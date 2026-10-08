import {
  bigint,
  check,
  index,
  integer,
  jsonb,
  pgSchema,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import type {
  RollResultKind,
  Visibility,
} from "../../shared/contract.js";

export const drizzleSchemaName = "drizzle_lab";
const lab = pgSchema(drizzleSchemaName);

export const visibility = lab.enum("visibility", [
  "PUBLIC",
  "PLAYER",
  "STORYTELLER",
]);
export const rollResultKind = lab.enum("roll_result_kind", [
  "SUCCESS",
  "FAILURE",
  "MESSY_CRITICAL",
  "BESTIAL_FAILURE",
]);

export const characterState = lab.table(
  "character_state",
  {
    id: uuid("id").primaryKey(),
    version: integer("version").notNull(),
    hunger: smallint("hunger").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("ck_character_state_version", sql`${table.version} >= 0`),
    check(
      "ck_character_state_hunger",
      sql`${table.hunger} between 0 and 5`,
    ),
  ],
);

export const rollAttempt = lab.table(
  "roll_attempt",
  {
    id: uuid("id").primaryKey(),
    sessionId: uuid("session_id").notNull(),
    sceneId: uuid("scene_id").notNull(),
    characterId: uuid("character_id")
      .notNull()
      .references(() => characterState.id),
    idempotencyKey: text("idempotency_key").notNull(),
    commandFingerprint: text("command_fingerprint").notNull(),
    expectedStateVersion: integer("expected_state_version").notNull(),
    profileRevision: text("profile_revision").notNull(),
    rulesRevision: text("rules_revision").notNull(),
    evaluatorRevision: text("evaluator_revision").notNull(),
    composition: jsonb("composition")
      .$type<Readonly<Record<string, unknown>>>()
      .notNull(),
    faces: jsonb("faces")
      .$type<Readonly<Record<string, unknown>>>()
      .notNull(),
    resultKind: rollResultKind("result_kind")
      .$type<RollResultKind>()
      .notNull(),
    result: jsonb("result")
      .$type<Readonly<Record<string, unknown>>>()
      .notNull(),
    previousAttemptId: uuid("previous_attempt_id"),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    correlationId: uuid("correlation_id").notNull(),
  },
  (table) => [
    unique("uq_roll_attempt_session_idempotency").on(
      table.sessionId,
      table.idempotencyKey,
    ),
    check(
      "ck_roll_attempt_expected_version",
      sql`${table.expectedStateVersion} >= 0`,
    ),
    check("ck_roll_attempt_profile_revision", sql`${table.profileRevision} <> ''`),
    check("ck_roll_attempt_rules_revision", sql`${table.rulesRevision} <> ''`),
    check(
      "ck_roll_attempt_evaluator_revision",
      sql`${table.evaluatorRevision} <> ''`,
    ),
    check(
      "ck_roll_attempt_command_fingerprint",
      sql`${table.commandFingerprint} <> ''`,
    ),
    check(
      "ck_roll_attempt_composition_object",
      sql`jsonb_typeof(${table.composition}) = 'object'`,
    ),
    check(
      "ck_roll_attempt_faces_object",
      sql`jsonb_typeof(${table.faces}) = 'object'`,
    ),
    check(
      "ck_roll_attempt_result_object",
      sql`jsonb_typeof(${table.result}) = 'object'`,
    ),
    index("ix_roll_attempt_character_time").on(
      table.characterId,
      table.confirmedAt,
    ),
    index("ix_roll_attempt_correlation").on(table.correlationId),
  ],
);

export const sessionEvent = lab.table(
  "session_event",
  {
    id: uuid("id").primaryKey(),
    sessionId: uuid("session_id").notNull(),
    sequence: bigint("sequence", { mode: "number" }).notNull(),
    rollAttemptId: uuid("roll_attempt_id")
      .notNull()
      .unique()
      .references(() => rollAttempt.id),
    eventType: text("event_type").notNull(),
    audience: visibility("audience").array().$type<Visibility[]>().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_session_event_sequence").on(table.sessionId, table.sequence),
    check("ck_session_event_sequence", sql`${table.sequence} > 0`),
    check("ck_session_event_type", sql`${table.eventType} <> ''`),
    check(
      "ck_session_event_audience",
      sql`cardinality(${table.audience}) > 0`,
    ),
  ],
);

export const sessionStream = lab.table(
  "session_stream",
  {
    sessionId: uuid("session_id").primaryKey(),
    lastSequence: bigint("last_sequence", { mode: "number" })
      .notNull()
      .default(0),
  },
  (table) => [
    check("ck_session_stream_last_sequence", sql`${table.lastSequence} >= 0`),
  ],
);

export const outboxMessage = lab.table(
  "outbox_message",
  {
    id: uuid("id").primaryKey(),
    sessionEventId: uuid("session_event_id")
      .notNull()
      .unique()
      .references(() => sessionEvent.id),
    topic: text("topic").notNull(),
    payload: jsonb("payload")
      .$type<Readonly<Record<string, unknown>>>()
      .notNull(),
    audience: visibility("audience").array().$type<Visibility[]>().notNull(),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dispatchedAt: timestamp("dispatched_at", { withTimezone: true }),
    claimToken: uuid("claim_token"),
    claimedUntil: timestamp("claimed_until", { withTimezone: true }),
  },
  (table) => [
    check("ck_outbox_topic", sql`${table.topic} <> ''`),
    check(
      "ck_outbox_payload_object",
      sql`jsonb_typeof(${table.payload}) = 'object'`,
    ),
    check("ck_outbox_audience", sql`cardinality(${table.audience}) > 0`),
    check("ck_outbox_attempts", sql`${table.attempts} >= 0`),
    index("ix_outbox_pending")
      .on(table.nextAttemptAt, table.id)
      .where(sql`${table.dispatchedAt} is null`),
  ],
);

export const drizzleSchema = {
  characterState,
  rollAttempt,
  sessionStream,
  sessionEvent,
  outboxMessage,
};
