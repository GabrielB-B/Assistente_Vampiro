import { Kysely, PostgresDialect, sql } from "kysely";
import { Migrator, type Migration } from "kysely/migration";
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
import * as migration001 from "../migrations/001_initial.js";
import * as migration002 from "../migrations/002_add_correlation_id.js";
import * as migration003 from "../migrations/003_backfill_correlation_id.js";
import * as migration004 from "../migrations/004_require_correlation_id.js";
import * as migration005 from "../migrations/005_add_command_fingerprint.js";
import * as migration006 from "../migrations/006_backfill_command_fingerprint.js";
import * as migration007 from "../migrations/007_require_command_fingerprint.js";
import type { KyselyDatabase } from "./database-types.js";

const schema = "kysely_lab";
const connectionString = databaseUrlForSchema(schema);

const migrations: Record<string, Migration> = {
  "001_initial": migration001,
  "002_add_correlation_id": migration002,
  "003_backfill_correlation_id": migration003,
  "004_require_correlation_id": migration004,
  "005_add_command_fingerprint": migration005,
  "006_backfill_command_fingerprint": migration006,
  "007_require_command_fingerprint": migration007,
};

function createDatabase(url = connectionString): Kysely<KyselyDatabase> {
  return new Kysely<KyselyDatabase>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: url, max: 4 }),
    }),
  });
}

export class KyselyCandidate implements PersistenceTestHarness {
  readonly name = "kysely" as const;
  private database = createDatabase();

  async resetDatabase(): Promise<void> {
    await this.database.destroy();
    await resetSchema(schema);
    this.database = createDatabase();
  }

  async migrateEmptyDatabase(): Promise<void> {
    const migrator = new Migrator({
      db: this.database,
      migrationTableSchema: schema,
      provider: {
        async getMigrations() {
          return migrations;
        },
      },
    });
    const result = await migrator.migrateToLatest();

    if (result.error !== undefined) {
      throw result.error;
    }
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
      return await this.database.transaction().execute(async (transaction) => {
        const updatedState = await transaction
          .updateTable("character_state")
          .set({
            version: sql`version + 1`,
            updated_at: sql`clock_timestamp()`,
          })
          .where("id", "=", command.characterId)
          .where("version", "=", command.expectedStateVersion)
          .returning("version")
          .executeTakeFirst();

        if (updatedState === undefined) {
          throw new PersistenceConflictError();
        }

        await transaction
          .insertInto("roll_attempt")
          .values({
            id: command.attemptId,
            session_id: command.sessionId,
            scene_id: command.sceneId,
            character_id: command.characterId,
            idempotency_key: command.idempotencyKey,
            command_fingerprint: command.commandFingerprint,
            expected_state_version: command.expectedStateVersion,
            profile_revision: command.profileRevision,
            rules_revision: command.rulesRevision,
            evaluator_revision: command.evaluatorRevision,
            composition: command.composition,
            faces: command.faces,
            result_kind: command.resultKind,
            result: command.result,
            previous_attempt_id: command.previousAttemptId ?? null,
            correlation_id: command.attemptId,
          })
          .execute();

        const sequenceRow = await transaction
          .insertInto("session_stream")
          .values({ session_id: command.sessionId, last_sequence: 1 })
          .onConflict((conflict) =>
            conflict.column("session_id").doUpdateSet({
              last_sequence: sql`session_stream.last_sequence + 1`,
            }),
          )
          .returning("last_sequence")
          .executeTakeFirst();
        const nextSequence =
          sequenceRow === undefined ? undefined : Number(sequenceRow.last_sequence);

        if (nextSequence === undefined) {
          throw new Error("Não foi possível calcular a sequência da sessão.");
        }

        await transaction
          .insertInto("session_event")
          .values({
            id: command.eventId,
            session_id: command.sessionId,
            sequence: nextSequence,
            roll_attempt_id: command.attemptId,
            event_type: "ROLL_CONFIRMED",
            audience: [...command.audience],
          })
          .execute();

        await transaction
          .insertInto("outbox_message")
          .values({
            id: command.outboxMessageId,
            session_event_id: command.eventId,
            topic: command.simulateOutboxFailure === true ? "" : "session.roll-confirmed",
            payload: {
              eventId: command.eventId,
              attemptId: command.attemptId,
              sessionId: command.sessionId,
            },
            audience: [...command.audience],
            dispatched_at: null,
            claim_token: null,
            claimed_until: null,
          })
          .execute();

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
    const row = await this.database
      .selectFrom("roll_attempt as attempt")
      .innerJoin("session_event as event", "event.roll_attempt_id", "attempt.id")
      .innerJoin("outbox_message as outbox", "outbox.session_event_id", "event.id")
      .select([
        "attempt.id as attemptId",
        "event.id as eventId",
        "outbox.id as outboxMessageId",
        "attempt.character_id as characterId",
        "attempt.expected_state_version as expectedStateVersion",
        "event.sequence as sessionSequence",
        "attempt.idempotency_key as idempotencyKey",
        "attempt.command_fingerprint as commandFingerprint",
        "attempt.result_kind as resultKind",
      ])
      .where("attempt.session_id", "=", sessionId)
      .where("attempt.idempotency_key", "=", key)
      .executeTakeFirst();

    if (row === undefined) {
      return null;
    }

    return {
      attemptId: row.attemptId,
      eventId: row.eventId,
      outboxMessageId: row.outboxMessageId,
      characterId: row.characterId,
      stateVersion: row.expectedStateVersion + 1,
      sessionSequence: Number(row.sessionSequence),
      idempotencyKey: row.idempotencyKey,
      commandFingerprint: row.commandFingerprint,
      resultKind: row.resultKind,
    };
  }

  async claimOutbox(batchSize: number): Promise<readonly ClaimedMessageFixture[]> {
    return this.database.transaction().execute(async (transaction) => {
      const result = await sql<{
        message_id: string;
        event_id: string;
        topic: string;
        attempts: number;
      }>`
        with claimable as (
          select id
          from outbox_message
          where dispatched_at is null
            and next_attempt_at <= clock_timestamp()
            and (claimed_until is null or claimed_until < clock_timestamp())
          order by next_attempt_at, id
          for update skip locked
          limit ${batchSize}
        )
        update outbox_message as message
        set claim_token = gen_random_uuid(),
            claimed_until = clock_timestamp() + interval '30 seconds',
            attempts = message.attempts + 1
        from claimable
        where message.id = claimable.id
        returning message.id as message_id,
                  message.session_event_id as event_id,
                  message.topic,
                  message.attempts
      `.execute(transaction);

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
    return readSchemaEvidence(connectionString, schema);
  }

  async provokeUniqueViolation(command: ConfirmRollFixture): Promise<unknown> {
    try {
      await this.database
        .insertInto("character_state")
        .values({ id: command.characterId, version: 0, hunger: 2 })
        .execute();
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeTimeout(): Promise<unknown> {
    try {
      await this.database.transaction().execute(async (transaction) => {
        await sql`set local statement_timeout = '10ms'`.execute(transaction);
        await sql`select pg_sleep(0.1)`.execute(transaction);
      });
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeConnectionError(): Promise<unknown> {
    const unavailable = createDatabase(
      testDatabaseUrl.replace(":5432/", ":1/"),
    );
    try {
      await sql`select 1`.execute(unavailable);
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    } finally {
      await unavailable.destroy();
    }
  }

  async readOperationalEvidence(attemptId: string): Promise<OperationalEvidence> {
    const history = await this.database
      .selectFrom("roll_attempt as attempt")
      .innerJoin("session_event as event", "event.roll_attempt_id", "attempt.id")
      .select(["attempt.id", "attempt.result_kind", "event.sequence"])
      .where("attempt.id", "=", attemptId)
      .execute();
    const delayed = await this.database
      .selectFrom("outbox_message")
      .select(["id", "topic", "attempts", "next_attempt_at"])
      .where("dispatched_at", "is", null)
      .where("next_attempt_at", "<=", sql<Date>`clock_timestamp()`)
      .execute();
    const planResult = await sql<{ "QUERY PLAN": string }>`
      explain (format text)
      select id, topic, attempts, next_attempt_at
      from outbox_message
      where dispatched_at is null
        and next_attempt_at <= clock_timestamp()
      order by next_attempt_at, id
      limit 20
    `.execute(this.database);

    return {
      historyRows: history.length,
      delayedOutboxRows: delayed.length,
      plan: planResult.rows.map((row) => row["QUERY PLAN"]).join("\n"),
    };
  }

  async close(): Promise<void> {
    await this.database.destroy();
  }
}
