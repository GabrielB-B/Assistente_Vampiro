import type { ColumnType, Generated, JSONColumnType } from "kysely";

import type { RollResultKind, Visibility } from "../../shared/contract.js";

type GeneratedTimestamp = ColumnType<
  Date,
  Date | string | undefined,
  Date | string
>;
type NullableTimestamp = ColumnType<
  Date | null,
  Date | string | null | undefined,
  Date | string | null
>;

export interface CharacterStateTable {
  id: string;
  version: number;
  hunger: number;
  updated_at: GeneratedTimestamp;
}

export interface RollAttemptTable {
  id: string;
  session_id: string;
  scene_id: string;
  character_id: string;
  idempotency_key: string;
  command_fingerprint: string;
  expected_state_version: number;
  profile_revision: string;
  rules_revision: string;
  evaluator_revision: string;
  composition: JSONColumnType<
    Record<string, unknown>,
    Readonly<Record<string, unknown>>,
    never
  >;
  faces: JSONColumnType<
    Record<string, unknown>,
    Readonly<Record<string, unknown>>,
    never
  >;
  result_kind: RollResultKind;
  result: JSONColumnType<
    Record<string, unknown>,
    Readonly<Record<string, unknown>>,
    never
  >;
  previous_attempt_id: string | null;
  confirmed_at: GeneratedTimestamp;
  correlation_id: string;
}

export interface SessionEventTable {
  id: string;
  session_id: string;
  sequence: ColumnType<string, number, never>;
  roll_attempt_id: string;
  event_type: string;
  audience: Visibility[];
  occurred_at: GeneratedTimestamp;
}

export interface SessionStreamTable {
  session_id: string;
  last_sequence: ColumnType<string, number, number>;
}

export interface OutboxMessageTable {
  id: string;
  session_event_id: string;
  topic: string;
  payload: JSONColumnType<
    Record<string, unknown>,
    Readonly<Record<string, unknown>>,
    never
  >;
  audience: Visibility[];
  attempts: Generated<number>;
  next_attempt_at: GeneratedTimestamp;
  dispatched_at: NullableTimestamp;
  claim_token: string | null;
  claimed_until: NullableTimestamp;
}

export interface KyselyDatabase {
  character_state: CharacterStateTable;
  roll_attempt: RollAttemptTable;
  session_stream: SessionStreamTable;
  session_event: SessionEventTable;
  outbox_message: OutboxMessageTable;
}
