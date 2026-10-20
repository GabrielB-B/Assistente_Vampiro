import type { ColumnType, Generated, JSONColumnType } from "kysely";

export type AccountStatus = "active" | "disabled";
export type BindingState = "requested" | "approved" | "active" | "released" | "rejected";
export type CharacterKind =
  "CLAN_VAMPIRE" | "CAITIFF" | "THIN_BLOOD" | "GHOUL" | "MORTAL";
export type CharacterState = "draft" | "ready" | "retired";
export type ChronicleState = "draft" | "active" | "archived";
export type ContentVisibility = "CHRONICLE_SHARED" | "STORYTELLER_PRIVATE";
export type GameSessionState = "scheduled" | "active" | "ended" | "cancelled";
export type MembershipRole = "PLAYER" | "STORYTELLER";
export type MembershipStatus = "invited" | "active" | "suspended" | "left";
export type RollOutcome = "VICTORY" | "FAILURE";
export type RollSpecialResult = "NONE" | "MESSY_CRITICAL" | "BESTIAL_FAILURE";
export type RuleRevisionStatus = "draft" | "reviewed" | "published" | "superseded";
export type SceneState = "prepared" | "active" | "closed";

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue =
  JsonPrimitive | JsonValue[] | { readonly [key: string]: JsonValue };

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;
type NullableTimestamp = ColumnType<
  Date | null,
  Date | string | null | undefined,
  Date | string | null
>;
type JsonObject = JSONColumnType<
  Readonly<Record<string, JsonValue>>,
  Readonly<Record<string, JsonValue>>,
  never
>;
type Int8 = ColumnType<string, number | string, never>;

export interface AccountTable {
  id: string;
  display_name: string;
  status: Generated<AccountStatus>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RuleSetProfileRevisionTable {
  id: string;
  profile_id: string;
  revision: number;
  status: RuleRevisionStatus;
  definition: JsonObject;
  created_at: Timestamp;
  published_at: NullableTimestamp;
}

export interface CharacterTable {
  id: string;
  owner_account_id: string;
  forked_from_character_id: string | null;
  rule_set_profile_revision_id: string | null;
  name: string;
  concept: string | null;
  kind: CharacterKind;
  state: Generated<CharacterState>;
  version: Generated<number>;
  hunger: number | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ChronicleTable {
  id: string;
  administrative_owner_account_id: string;
  rule_set_profile_revision_id: string | null;
  title: string;
  description: string | null;
  state: Generated<ChronicleState>;
  version: Generated<number>;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ChronicleMembershipTable {
  id: string;
  chronicle_id: string;
  account_id: string;
  status: MembershipStatus;
  roles: MembershipRole[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CharacterBindingTable {
  id: string;
  chronicle_id: string;
  membership_id: string;
  character_id: string;
  requested_by_account_id: string;
  approved_by_account_id: string | null;
  state: BindingState;
  chronicle_alias: string | null;
  chronicle_notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface GameSessionTable {
  id: string;
  chronicle_id: string;
  state: GameSessionState;
  version: Generated<number>;
  scheduled_at: NullableTimestamp;
  started_at: NullableTimestamp;
  ended_at: NullableTimestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SceneTable {
  id: string;
  session_id: string;
  state: SceneState;
  version: Generated<number>;
  title: string;
  published_description: string | null;
  storyteller_notes: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface RollAttemptTable {
  id: string;
  session_id: string;
  scene_id: string;
  actor_account_id: string;
  character_id: string;
  character_binding_id: string | null;
  idempotency_key: string;
  operation_version: string;
  command_fingerprint: string;
  expected_character_version: number;
  profile_revision_id: string;
  evaluator_revision: string;
  difficulty: number;
  requested_visibility: ContentVisibility;
  composition: JsonObject;
  faces: JsonObject;
  outcome: RollOutcome;
  special_result: RollSpecialResult;
  result: JsonObject;
  previous_attempt_id: string | null;
  correlation_id: string;
  confirmed_at: Timestamp;
}

export interface SessionStreamTable {
  session_id: string;
  last_sequence: ColumnType<string, number | string, number | string>;
}

export interface SessionEventTable {
  id: string;
  session_id: string;
  sequence: Int8;
  roll_attempt_id: string | null;
  event_type: string;
  audience: ContentVisibility[];
  payload: JsonObject;
  occurred_at: Timestamp;
}

export interface OutboxMessageTable {
  id: string;
  session_event_id: string;
  topic: string;
  payload: JsonObject;
  audience: ContentVisibility[];
  attempts: Generated<number>;
  next_attempt_at: Timestamp;
  dispatched_at: NullableTimestamp;
  claim_token: string | null;
  claimed_until: NullableTimestamp;
  created_at: Timestamp;
}

export interface AuditEntryTable {
  id: string;
  actor_account_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  correlation_id: string;
  metadata: JsonObject;
  occurred_at: Timestamp;
}

export interface DatabaseSchema {
  account: AccountTable;
  audit_entry: AuditEntryTable;
  character: CharacterTable;
  character_binding: CharacterBindingTable;
  chronicle: ChronicleTable;
  chronicle_membership: ChronicleMembershipTable;
  game_session: GameSessionTable;
  outbox_message: OutboxMessageTable;
  roll_attempt: RollAttemptTable;
  rule_set_profile_revision: RuleSetProfileRevisionTable;
  scene: SceneTable;
  session_event: SessionEventTable;
  session_stream: SessionStreamTable;
}
