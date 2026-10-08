import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";

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
import { Prisma, PrismaClient } from "../generated/client/client.js";

const executeFile = promisify(execFile);
const schema = "prisma_lab";
const connectionString = databaseUrlForSchema(schema);
const experimentRoot = fileURLToPath(new URL("../..", import.meta.url));
const prismaCli = path.join(experimentRoot, "node_modules", "prisma", "build", "index.js");
const prismaConfig = path.join(experimentRoot, "prisma.config.ts");

type Client = InstanceType<typeof PrismaClient>;

function createClient(url = connectionString): Client {
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });
}

function toInputJson(
  value: Readonly<Record<string, unknown>>,
): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export class PrismaCandidate implements PersistenceTestHarness {
  readonly name = "prisma" as const;
  private client = createClient();

  async resetDatabase(): Promise<void> {
    await this.client.$disconnect();
    await resetSchema(schema);
    this.client = createClient();
  }

  async migrateEmptyDatabase(): Promise<void> {
    await executeFile(
      process.execPath,
      [prismaCli, "migrate", "deploy", "--config", prismaConfig],
      {
        cwd: experimentRoot,
        env: process.env,
        windowsHide: true,
      },
    );
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
      return await this.client.$transaction(async (transaction) => {
        const updatedState = await transaction.characterState.updateMany({
          where: {
            id: command.characterId,
            version: command.expectedStateVersion,
          },
          data: {
            version: { increment: 1 },
            updatedAt: new Date(),
          },
        });

        if (updatedState.count !== 1) {
          throw new PersistenceConflictError();
        }

        await transaction.rollAttempt.create({
          data: {
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
            composition: toInputJson(command.composition),
            faces: toInputJson(command.faces),
            resultKind: command.resultKind,
            result: toInputJson(command.result),
            previousAttemptId: command.previousAttemptId ?? null,
            correlationId: command.attemptId,
          },
        });

        const sequenceRows = await transaction.$queryRaw<
          Array<{ last_sequence: bigint }>
        >`
          insert into "prisma_lab"."session_stream" ("session_id", "last_sequence")
          values (${command.sessionId}::uuid, 1)
          on conflict ("session_id") do update
          set "last_sequence" = "session_stream"."last_sequence" + 1
          returning "last_sequence"
        `;
        const nextSequenceValue = sequenceRows[0]?.last_sequence;
        const nextSequence =
          nextSequenceValue === undefined ? undefined : Number(nextSequenceValue);

        if (nextSequence === undefined) {
          throw new Error("Não foi possível calcular a sequência da sessão.");
        }

        await transaction.sessionEvent.create({
          data: {
            id: command.eventId,
            sessionId: command.sessionId,
            sequence: BigInt(nextSequence),
            rollAttemptId: command.attemptId,
            eventType: "ROLL_CONFIRMED",
            audience: [...command.audience],
          },
        });

        await transaction.outboxMessage.create({
          data: {
            id: command.outboxMessageId,
            sessionEventId: command.eventId,
            topic:
              command.simulateOutboxFailure === true
                ? ""
                : "session.roll-confirmed",
            payload: toInputJson({
              eventId: command.eventId,
              attemptId: command.attemptId,
              sessionId: command.sessionId,
            }),
            audience: [...command.audience],
          },
        });

        return {
          attemptId: command.attemptId,
          eventId: command.eventId,
          outboxMessageId: command.outboxMessageId,
          characterId: command.characterId,
          stateVersion: command.expectedStateVersion + 1,
          sessionSequence: nextSequence,
          idempotencyKey: command.idempotencyKey,
          commandFingerprint: command.commandFingerprint,
          resultKind: command.resultKind,
        };
      });
    } catch (error) {
      if (
        error instanceof PersistenceConflictError ||
        databaseErrorCode(error) === "23505" ||
        databaseErrorCode(error) === "P2002"
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
    const row = await this.client.rollAttempt.findUnique({
      where: {
        sessionId_idempotencyKey: {
          sessionId,
          idempotencyKey: key,
        },
      },
      select: {
        id: true,
        characterId: true,
        idempotencyKey: true,
        commandFingerprint: true,
        expectedStateVersion: true,
        resultKind: true,
        sessionEvent: {
          select: {
            id: true,
            sequence: true,
            outboxMessage: { select: { id: true } },
          },
        },
      },
    });

    if (row?.sessionEvent?.outboxMessage === null || row?.sessionEvent === null || row === null) {
      return null;
    }

    return {
      attemptId: row.id,
      eventId: row.sessionEvent.id,
      outboxMessageId: row.sessionEvent.outboxMessage.id,
      characterId: row.characterId,
      stateVersion: row.expectedStateVersion + 1,
      sessionSequence: Number(row.sessionEvent.sequence),
      idempotencyKey: row.idempotencyKey,
      commandFingerprint: row.commandFingerprint,
      resultKind: row.resultKind,
    };
  }

  async claimOutbox(batchSize: number): Promise<readonly ClaimedMessageFixture[]> {
    return this.client.$transaction(async (transaction) => {
      const claimable = await transaction.$queryRaw<
        Array<{
          id: string;
          session_event_id: string;
          topic: string;
          attempts: number;
        }>
      >`
        select "id", "session_event_id", "topic", "attempts"
        from "prisma_lab"."outbox_message"
        where "dispatched_at" is null
          and "next_attempt_at" <= clock_timestamp()
          and ("claimed_until" is null or "claimed_until" < clock_timestamp())
        order by "next_attempt_at", "id"
        for update skip locked
        limit ${batchSize}
      `;

      const claimedUntil = new Date(Date.now() + 30_000);
      for (const row of claimable) {
        await transaction.outboxMessage.update({
          where: { id: row.id },
          data: {
            claimToken: randomUUID(),
            claimedUntil,
            attempts: { increment: 1 },
          },
        });
      }

      return claimable.map((row) => ({
        messageId: row.id,
        eventId: row.session_event_id,
        topic: row.topic,
        attempts: row.attempts + 1,
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
      await this.client.characterState.create({
        data: { id: command.characterId, version: 0, hunger: 2 },
      });
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeTimeout(): Promise<unknown> {
    try {
      await this.client.$transaction(async (transaction) => {
        await transaction.$executeRaw`set local statement_timeout = '10ms'`;
        await transaction.$queryRaw`select pg_sleep(0.1)`;
      });
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    }
  }

  async provokeConnectionError(): Promise<unknown> {
    const unavailable = createClient(testDatabaseUrl.replace(":5432/", ":1/"));
    try {
      await unavailable.$queryRaw`select 1`;
      return null;
    } catch (error) {
      return translateDatabaseError(error);
    } finally {
      await unavailable.$disconnect();
    }
  }

  async readOperationalEvidence(attemptId: string): Promise<OperationalEvidence> {
    const history = await this.client.rollAttempt.findMany({
      where: { id: attemptId },
      select: {
        id: true,
        resultKind: true,
        sessionEvent: { select: { sequence: true } },
      },
    });
    const delayed = await this.client.outboxMessage.findMany({
      where: {
        dispatchedAt: null,
        nextAttemptAt: { lte: new Date() },
      },
      select: {
        id: true,
        topic: true,
        attempts: true,
        nextAttemptAt: true,
      },
    });
    const planRows = await this.client.$queryRaw<Array<{ "QUERY PLAN": string }>>`
      explain (format text)
      select "id", "topic", "attempts", "next_attempt_at"
      from "prisma_lab"."outbox_message"
      where "dispatched_at" is null
        and "next_attempt_at" <= clock_timestamp()
      order by "next_attempt_at", "id"
      limit 20
    `;

    return {
      historyRows: history.length,
      delayedOutboxRows: delayed.length,
      plan: planRows.map((row) => row["QUERY PLAN"]).join("\n"),
    };
  }

  async close(): Promise<void> {
    await this.client.$disconnect();
  }
}
