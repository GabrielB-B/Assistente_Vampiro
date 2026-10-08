export type Visibility = "PUBLIC" | "PLAYER" | "STORYTELLER";

export type RollResultKind =
  | "SUCCESS"
  | "FAILURE"
  | "MESSY_CRITICAL"
  | "BESTIAL_FAILURE";

export interface ConfirmRollFixture {
  readonly attemptId: string;
  readonly eventId: string;
  readonly outboxMessageId: string;
  readonly characterId: string;
  readonly sessionId: string;
  readonly sceneId: string;
  readonly idempotencyKey: string;
  readonly commandFingerprint: string;
  readonly expectedStateVersion: number;
  readonly profileRevision: string;
  readonly rulesRevision: string;
  readonly evaluatorRevision: string;
  readonly composition: Readonly<Record<string, unknown>>;
  readonly faces: Readonly<Record<string, unknown>>;
  readonly resultKind: RollResultKind;
  readonly result: Readonly<Record<string, unknown>>;
  readonly audience: readonly Visibility[];
  readonly previousAttemptId?: string;
  readonly simulateOutboxFailure?: boolean;
}

export interface ConfirmedRollFixture {
  readonly attemptId: string;
  readonly eventId: string;
  readonly outboxMessageId: string;
  readonly characterId: string;
  readonly stateVersion: number;
  readonly sessionSequence: number;
  readonly idempotencyKey: string;
  readonly commandFingerprint: string;
  readonly resultKind: RollResultKind;
}

export interface ClaimedMessageFixture {
  readonly messageId: string;
  readonly eventId: string;
  readonly topic: string;
  readonly attempts: number;
}

export interface PersistenceCandidate {
  migrateEmptyDatabase(): Promise<void>;
  confirmRoll(command: ConfirmRollFixture): Promise<ConfirmedRollFixture>;
  findByIdempotencyKey(
    sessionId: string,
    key: string,
  ): Promise<ConfirmedRollFixture | null>;
  claimOutbox(batchSize: number): Promise<readonly ClaimedMessageFixture[]>;
  close(): Promise<void>;
}

export interface PersistenceTestHarness extends PersistenceCandidate {
  readonly name: "kysely" | "drizzle" | "prisma";
  resetDatabase(): Promise<void>;
  seedCharacter(characterId: string, hunger?: number): Promise<void>;
  readRecordCounts(): Promise<RecordCounts>;
  readCharacterVersion(characterId: string): Promise<number | null>;
  readSchemaEvidence(): Promise<SchemaEvidence>;
  provokeUniqueViolation(command: ConfirmRollFixture): Promise<unknown>;
  provokeTimeout(): Promise<unknown>;
  provokeConnectionError(): Promise<unknown>;
  readOperationalEvidence(attemptId: string): Promise<OperationalEvidence>;
}

export interface RecordCounts {
  readonly characterStates: number;
  readonly rollAttempts: number;
  readonly sessionStreams: number;
  readonly sessionEvents: number;
  readonly outboxMessages: number;
}

export interface OperationalEvidence {
  readonly historyRows: number;
  readonly delayedOutboxRows: number;
  readonly plan: string;
}

export interface SchemaEvidence {
  readonly tableNames: readonly string[];
  readonly checkConstraintCount: number;
  readonly uniqueConstraintCount: number;
  readonly correlationIdIsRequired: boolean;
  readonly commandFingerprintIsRequired: boolean;
}
