import { afterAll, beforeEach, describe, expect, it } from "vitest";

import type { PersistenceTestHarness, RollResultKind, Visibility } from "./contract.js";
import {
  IdempotencyConflictError,
  PersistenceConflictError,
  PersistenceConnectionError,
  PersistenceConstraintError,
  PersistenceTimeoutError,
} from "./errors.js";
import { confirmedRollFixture, ids } from "./fixtures.js";

export function verifyPersistenceCandidate(
  createCandidate: () => PersistenceTestHarness,
): void {
  const candidate = createCandidate();

  describe(`${candidate.name}: contrato comum de persistência`, () => {
    beforeEach(async () => {
      await candidate.resetDatabase();
      await candidate.migrateEmptyDatabase();
      await candidate.seedCharacter(ids.character);
    });

    afterAll(async () => {
      await candidate.close();
    });

    it("P01 aplica as migrações completas em banco vazio", async () => {
      const evidence = await candidate.readSchemaEvidence();

      expect(evidence.tableNames).toEqual([
        "character_state",
        "outbox_message",
        "roll_attempt",
        "session_event",
        "session_stream",
      ]);
      expect(evidence.checkConstraintCount).toBeGreaterThanOrEqual(8);
      expect(evidence.uniqueConstraintCount).toBeGreaterThanOrEqual(3);
    });

    it("P02 confirma estado, tentativa, evento e outbox atomicamente", async () => {
      const confirmed = await candidate.confirmRoll(confirmedRollFixture());

      expect(confirmed).toMatchObject({
        stateVersion: 1,
        sessionSequence: 1,
        resultKind: "MESSY_CRITICAL",
      });
      await expect(candidate.readRecordCounts()).resolves.toEqual({
        characterStates: 1,
        rollAttempts: 1,
        sessionStreams: 1,
        sessionEvents: 1,
        outboxMessages: 1,
      });
    });

    it("P03 desfaz toda a transação quando a outbox falha", async () => {
      await expect(
        candidate.confirmRoll(
          confirmedRollFixture(1, { simulateOutboxFailure: true }),
        ),
      ).rejects.toBeInstanceOf(Error);

      await expect(candidate.readCharacterVersion(ids.character)).resolves.toBe(0);
      await expect(candidate.readRecordCounts()).resolves.toEqual({
        characterStates: 1,
        rollAttempts: 0,
        sessionStreams: 0,
        sessionEvents: 0,
        outboxMessages: 0,
      });
    });

    it("P04 aplica idempotência por Sessão e rejeita chave reutilizada", async () => {
      const command = confirmedRollFixture();
      const [first, repeated] = await Promise.all([
        candidate.confirmRoll(command),
        candidate.confirmRoll(command),
      ]);

      expect(repeated).toEqual(first);
      expect(await candidate.readRecordCounts()).toMatchObject({
        rollAttempts: 1,
        sessionStreams: 1,
        sessionEvents: 1,
        outboxMessages: 1,
      });
      expect(await candidate.readCharacterVersion(ids.character)).toBe(1);

      const otherSession = await candidate.confirmRoll(
        confirmedRollFixture(2, {
          sessionId: ids.secondSession,
          idempotencyKey: command.idempotencyKey,
          commandFingerprint: "sha256:other-session-command",
          expectedStateVersion: 1,
        }),
      );

      expect(otherSession.attemptId).not.toBe(first.attemptId);
      expect(await candidate.readRecordCounts()).toMatchObject({
        rollAttempts: 2,
        sessionStreams: 2,
        sessionEvents: 2,
        outboxMessages: 2,
      });

      await expect(candidate.confirmRoll(command)).resolves.toEqual(first);

      await expect(
        candidate.confirmRoll(
          confirmedRollFixture(3, {
            sessionId: command.sessionId,
            idempotencyKey: command.idempotencyKey,
            commandFingerprint: "sha256:different-command",
            expectedStateVersion: 2,
          }),
        ),
      ).rejects.toBeInstanceOf(IdempotencyConflictError);

      expect(await candidate.readCharacterVersion(ids.character)).toBe(2);
    });

    it("P05 permite somente um avanço para a mesma versão esperada", async () => {
      const first = confirmedRollFixture(1, { expectedStateVersion: 0 });
      const second = confirmedRollFixture(2, { expectedStateVersion: 0 });
      const outcomes = await Promise.allSettled([
        candidate.confirmRoll(first),
        candidate.confirmRoll(second),
      ]);

      expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
      const rejected = outcomes.find((outcome) => outcome.status === "rejected");
      expect(rejected).toBeDefined();
      if (rejected?.status === "rejected") {
        expect(rejected.reason).toBeInstanceOf(PersistenceConflictError);
      }
      expect(await candidate.readCharacterVersion(ids.character)).toBe(1);
      expect(await candidate.readRecordCounts()).toMatchObject({
        rollAttempts: 1,
        sessionStreams: 1,
        sessionEvents: 1,
        outboxMessages: 1,
      });
    });

    it("P06 não reserva a mesma mensagem para dois workers", async () => {
      await candidate.confirmRoll(confirmedRollFixture());
      const [firstWorker, secondWorker] = await Promise.all([
        candidate.claimOutbox(1),
        candidate.claimOutbox(1),
      ]);
      const claimed = [...firstWorker, ...secondWorker];

      expect(claimed).toHaveLength(1);
      expect(new Set(claimed.map((message) => message.messageId)).size).toBe(1);
      expect(claimed[0]?.attempts).toBe(1);
    });

    it("P07 conclui expansão, preenchimento e obrigatoriedade", async () => {
      const evidence = await candidate.readSchemaEvidence();
      expect(evidence.correlationIdIsRequired).toBe(true);
      expect(evidence.commandFingerprintIsRequired).toBe(true);
    });

    it("P08 preserva os tipos fechados e os snapshots estruturados", async () => {
      const allowedVisibility: Visibility = "PUBLIC";
      const allowedResult: RollResultKind = "MESSY_CRITICAL";
      const confirmed = await candidate.confirmRoll(
        confirmedRollFixture(1, {
          audience: [allowedVisibility],
          resultKind: allowedResult,
          result: { successes: 4, hungerCritical: true },
        }),
      );

      expect(confirmed.resultKind).toBe(allowedResult);
    });

    it("P09 traduz violações, timeout e conexão sem analisar mensagens", async () => {
      const uniqueViolation = await candidate.provokeUniqueViolation(
        confirmedRollFixture(),
      );
      const timeout = await candidate.provokeTimeout();
      const connection = await candidate.provokeConnectionError();

      expect(uniqueViolation).toBeInstanceOf(PersistenceConstraintError);
      expect(timeout).toBeInstanceOf(PersistenceTimeoutError);
      expect(connection).toBeInstanceOf(PersistenceConnectionError);
    });

    it("P10 lê somente o necessário e produz um plano observável", async () => {
      const confirmed = await candidate.confirmRoll(confirmedRollFixture());
      const evidence = await candidate.readOperationalEvidence(confirmed.attemptId);

      expect(evidence.historyRows).toBe(1);
      expect(evidence.delayedOutboxRows).toBe(1);
      expect(evidence.plan.length).toBeGreaterThan(0);
      expect(evidence.plan).toContain("outbox_message");
    });
  });
}
