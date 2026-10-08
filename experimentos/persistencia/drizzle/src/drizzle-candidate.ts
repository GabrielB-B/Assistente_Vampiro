import { fileURLToPath } from "node:url";

import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import type {
  ClaimedMessageFixture,
  ConfirmedRollFixture,
  ConfirmRollFixture,
  OperationalEvidence,
  PersistenceTestHarness,
  RecordCounts,
  SchemaEvidence,
} from "../../shared/contract.js";
import { databaseUrlForSchema, testDatabaseUrl } from "../../shared/environment.js";
import {
  assertSameIdempotentCommand,
  databaseErrorCode,
  PersistenceConflictError,
  translateDatabaseError,
} from "../../shared/errors.js";
import {
  readCharacterVersion,
  readRecordCounts,
  readSchemaEvidence,
  resetSchema,
  seedCharacter,
} from "../../shared/postgres-test-support.js";
import {
  characterState,
  drizzleSchema,
  drizzleSchemaName,
  outboxMessage,
  rollAttempt,
  sessionEvent,
  sessionStream,
} from "./schema.js";

const connectionString = databaseUrlForSchema(drizzleSchemaName);
const migrationsFolder = fileURLToPath(new URL("../migrations", import.meta.url));

interface DrizzleContext {
  readonly pool: Pool;
  readonly database: NodePgDatabase<typeof drizzleSchema>;
}

function createContext(url = connectionString): DrizzleContext {
  const pool = new Pool({ connectionString: url, max: 4 });
  return {
    pool,
    database: drizzle(pool, { schema: drizzleSchema }),
  };
}

export class DrizzleCandidate implements PersistenceTestHarness {
  readonly name = "drizzle" as const;
  private context = createContext();

  async resetDatabase(): Promise<void> {
    await this.context.pool.end();
    await resetSchema(drizzleSchemaName);
    this.context = createContext();
  }

  async migrateEmptyDatabase(): Promise<void> {
    await migrate(this.context.database, {
      migrationsFolder,
      migrationsSchema: drizzleSchemaName,
      migrationsTable: "__drizzle_migrations",
    });
  }

  async seedCharacter(characterId: string, hunger = 2): Promise<void> {
    await seedCharacter(connectionString, characterId, hunger);
  }

  async confirmRoll(command: ConfirmRollFixture): Promise<ConfirmedRollFixture> {
    const existing = await this.findByIdempotencyKey(
      command.sessionId,
      command.idempotencyKey,
    );

    if (existing !== null) {
      assertSameIdempotentCommand(
        existing.commandFingerprint,
        command.commandFingerprint,
      );
      return existing;
    }

    try {
      return await this.context.database.transaction(async (transaction) => {
        const [updatedState] = await transaction
          .update(characterState)
          .set({
            version: sql`${characterState.version} + 1`,
            updatedAt: sql`clock_timestamp()`,
          })
          .where(
            and(
              eq(characterState.id, command.characterId),
              eq(characterState.version, command.expectedStateVersion),
            ),
          )
          .returning({ version: characterState.version });

        if (updatedState === undefined) {
          throw new PersistenceConflictError();
        }

        await transaction.insert(rollAttempt).values({
          id: command.attemptId,
          sessionId: command.sessionId,
          sceneId: command.sceneId,
          characterId: command.characterId,
          idempotencyKey: command.idempotencyKey,
          commandFingerprint: command.commandFingerprint,
          expectedStateVersion: command.expectedStateVersion,
          profileRevision: command.profileRevision,
          rulesRevision: command.rulesRevision,
          evaluatorRevision: command.evaluatorRevision,
          composition: command.composition,
          faces: command.faces,
          resultKind: command.resultKind,
          result: command.result,
          previousAttemptId: command.previousAttemptId ?? null,
          correlationId: command.attemptId,
        });

        const [sequenceRow] = await transaction
          .insert(sessionStream)
          .values({ sessionId: command.sessionId, lastSequence: 1 })
          .onConflictDoUpdate({
            target: sessionStream.sessionId,
            set: { lastSequence: sql`${sessionStream.lastSequence} + 1` },
          })
          .returning({ lastSequence: sessionStream.lastSequence });
        const nextSequence = sequenceRow?.lastSequence;

        if (nextSequence === undefined) {
          throw new Error("Não foi possível calcular a sequência da sessão.");
        }

        await transaction.insert(sessionEvent).values({
          id: command.eventId,
          sessionId: command.sessionId,
          sequence: nextSequence,
          rollAttemptId: command.attemptId,
          eventType: "ROLL_CONFIRMED",
          audience: [...command.audience],
        });

        await transaction.insert(outboxMessage).values({
          id: command.outboxMessageId,
          sessionEventId: command.eventId,
          topic:
            command.simulateOutboxFailure === true
              ? ""
              : "session.roll-confirmed",
          payload: {
            eventId: command.eventId,
            attemptId: command.attemptId,
            sessionId: command.sessionId,
          },
          audience: [...command.audience],
        });

        return {
          attemptId: command.attemptId,
          eventId: command.eventId,
          outboxMessageId: command.outboxMessageId,
          characterId: command.characterId,
          stateVersion: updatedState.version,
          sessionSequence: nextSequence,
          idempotencyKey: command.idempotencyKey,
          commandFingerprint: command.commandFingerprint,
          resultKind: command.resultKind,
        };
      });
    } catch (error) {
      if (
        error instanceof PersistenceConflictError ||
        databaseErrorCode(error) === "23505"
      ) {
        const confirmed = await this.findByIdempotencyKey(
          command.sessionId,
          command.idempotencyKey,
        );
        if (confirmed !== null) {
          assertSameIdempotentCommand(
            confirmed.commandFingerprint,
            command.commandFingerprint,
          );
          return confirmed;
        }
      }

      throw translateDatabaseError(error);
    }
  }

  async findByIdempotencyKey(
    sessionId: string,
    key: string,
  ): Promise<ConfirmedRollFixture | null> {
    const [row] = await this.context.database
      .select({
        attemptId: rollAttempt.id,
        eventId: sessionEvent.id,
        outboxMessageId: outboxMessage.id,
        characterId: rollAttempt.characterId,
        expectedStateVersion: rollAttempt.expectedStateVersion,
        sessionSequence: sessionEvent.sequence,
        idempotencyKey: rollAttempt.idempotencyKey,
        commandFingerprint: rollAttempt.commandFingerprint,
        resultKind: rollAttempt.resultKind,
      })
      .from(rollAttempt)
      .innerJoin(sessionEvent, eq(sessionEvent.rollAttemptId, rollAttempt.id))
      .innerJoin(outboxMessage, eq(outboxMessage.sessionEventId, sessionEvent.id))
      .where(
        and(
          eq(rollAttempt.sessionId, sessionId),
          eq(rollAttempt.idempotencyKey, key),
        ),
      )
      .limit(1);

    if (row === undefined) {
      return null;
    }

    return {
      attemptId: row.attemptId,
      eventId: row.eventId,
      outboxMessageId: row.outboxMessageId,
      characterId: row.characterId,
      stateVersion: row.expectedStateVersion + 1,
      sessionSequence: row.sessionSequence,
      idempotencyKey: row.idempotencyKey,
      commandFingerprint: row.commandFingerprint,
      resultKind: row.resultKind,
    };
  }

  async claimOutbox(batchSize: number): Promise<readonly ClaimedMessageFixture[]> {
    return this.context.database.transaction(async (transaction) => {
      const result = await transaction.execute<{
        message_id: string;
        event_id: string;
        topic: string;
        attempts: number;
      }>(sql`
        with claimable as (
          select id
          from ${outboxMessage}
          where dispatched_at is null
            and next_attempt_at <= clock_timestamp()
            and (claimed_until is null or claimed_until < clock_timestamp())
          order by next_attempt_at, id
          for update skip locked
          limit ${batchSize}
        )
        update ${outboxMessage} as message
        set claim_token = gen_random_uuid(),
            claimed_until = clock_timestamp() + interval '30 seconds',
            attempts = message.attempts + 1
        from claimable
        where message.id = claimable.id
        returning message.id as message_id,
                  message.session_event_id as event_id,
                  message.topic,
                  message.attempts
      `);

      return result.rows.map((row) => ({
        messageId: row.message_id,
        eventId: row.event_id,
        topic: row.topic,
        attempts: row.attempts,
      }));
    });
  }

  readRecordCounts(): Promise<RecordCounts> {
    return readRecordCounts(connectionString);
  }

  readCharacterVersion(characterId: string): Promise<number | null> {
    return readCharacterVersion(connectionString, characterId);
  }

  readSchemaEvidence(): Promise<SchemaEvidence> {
    return readSchemaEvidence(connectionString, drizzleSchemaName);
  }

  async provokeUniqueViolation(command: ConfirmRollFixture): Promise<unknown> {
    try {
      await this.context.database.insert(characterState).values({
        id: command.characterId,
        version: 0,
        hunger: 2,
      });
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeTimeout(): Promise<unknown> {
    try {
      await this.context.database.transaction(async (transaction) => {
        await transaction.execute(sql`set local statement_timeout = '10ms'`);
        await transaction.execute(sql`select pg_sleep(0.1)`);
      });
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeConnectionError(): Promise<unknown> {
    const unavailable = createContext(testDatabaseUrl.replace(":5432/", ":1/"));
    try {
      await unavailable.database.execute(sql`select 1`);
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    } finally {
      await unavailable.pool.end();
    }
  }

  async readOperationalEvidence(attemptId: string): Promise<OperationalEvidence> {
    const history = await this.context.database
      .select({
        attemptId: rollAttempt.id,
        resultKind: rollAttempt.resultKind,
        sequence: sessionEvent.sequence,
      })
      .from(rollAttempt)
      .innerJoin(sessionEvent, eq(sessionEvent.rollAttemptId, rollAttempt.id))
      .where(eq(rollAttempt.id, attemptId));
    const delayed = await this.context.database
      .select({
        id: outboxMessage.id,
        topic: outboxMessage.topic,
        attempts: outboxMessage.attempts,
        nextAttemptAt: outboxMessage.nextAttemptAt,
      })
      .from(outboxMessage)
      .where(
        and(
          isNull(outboxMessage.dispatchedAt),
          lte(outboxMessage.nextAttemptAt, sql`clock_timestamp()`),
        ),
      );
    const planResult = await this.context.database.execute<{
      "QUERY PLAN": string;
    }>(sql`
      explain (format text)
      select id, topic, attempts, next_attempt_at
      from ${outboxMessage}
      where dispatched_at is null
        and next_attempt_at <= clock_timestamp()
      order by next_attempt_at, id
      limit 20
    `);

    return {
      historyRows: history.length,
      delayedOutboxRows: delayed.length,
      plan: planResult.rows.map((row) => row["QUERY PLAN"]).join("\n"),
    };
  }

  async close(): Promise<void> {
    await this.context.pool.end();
  }
}
