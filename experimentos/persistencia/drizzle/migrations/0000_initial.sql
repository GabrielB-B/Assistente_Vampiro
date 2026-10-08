CREATE TYPE "drizzle_lab"."visibility" AS ENUM ('PUBLIC', 'PLAYER', 'STORYTELLER');
--> statement-breakpoint
CREATE TYPE "drizzle_lab"."roll_result_kind" AS ENUM ('SUCCESS', 'FAILURE', 'MESSY_CRITICAL', 'BESTIAL_FAILURE');
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."character_state" (
  "id" uuid PRIMARY KEY,
  "version" integer NOT NULL,
  "hunger" smallint NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT "ck_character_state_version" CHECK ("version" >= 0),
  CONSTRAINT "ck_character_state_hunger" CHECK ("hunger" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."roll_attempt" (
  "id" uuid PRIMARY KEY,
  "session_id" uuid NOT NULL,
  "scene_id" uuid NOT NULL,
  "character_id" uuid NOT NULL REFERENCES "drizzle_lab"."character_state"("id"),
  "idempotency_key" text NOT NULL,
  "expected_state_version" integer NOT NULL,
  "profile_revision" text NOT NULL,
  "rules_revision" text NOT NULL,
  "evaluator_revision" text NOT NULL,
  "composition" jsonb NOT NULL,
  "faces" jsonb NOT NULL,
  "result_kind" "drizzle_lab"."roll_result_kind" NOT NULL,
  "result" jsonb NOT NULL,
  "previous_attempt_id" uuid REFERENCES "drizzle_lab"."roll_attempt"("id"),
  "confirmed_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT "uq_roll_attempt_session_idempotency" UNIQUE ("session_id", "idempotency_key"),
  CONSTRAINT "ck_roll_attempt_expected_version" CHECK ("expected_state_version" >= 0),
  CONSTRAINT "ck_roll_attempt_profile_revision" CHECK ("profile_revision" <> ''),
  CONSTRAINT "ck_roll_attempt_rules_revision" CHECK ("rules_revision" <> ''),
  CONSTRAINT "ck_roll_attempt_evaluator_revision" CHECK ("evaluator_revision" <> ''),
  CONSTRAINT "ck_roll_attempt_composition_object" CHECK (jsonb_typeof("composition") = 'object'),
  CONSTRAINT "ck_roll_attempt_faces_object" CHECK (jsonb_typeof("faces") = 'object'),
  CONSTRAINT "ck_roll_attempt_result_object" CHECK (jsonb_typeof("result") = 'object')
);
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."session_stream" (
  "session_id" uuid PRIMARY KEY,
  "last_sequence" bigint NOT NULL DEFAULT 0,
  CONSTRAINT "ck_session_stream_last_sequence" CHECK ("last_sequence" >= 0)
);
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."session_event" (
  "id" uuid PRIMARY KEY,
  "session_id" uuid NOT NULL,
  "sequence" bigint NOT NULL,
  "roll_attempt_id" uuid NOT NULL UNIQUE REFERENCES "drizzle_lab"."roll_attempt"("id"),
  "event_type" text NOT NULL,
  "audience" "drizzle_lab"."visibility"[] NOT NULL,
  "occurred_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  CONSTRAINT "uq_session_event_sequence" UNIQUE ("session_id", "sequence"),
  CONSTRAINT "ck_session_event_sequence" CHECK ("sequence" > 0),
  CONSTRAINT "ck_session_event_type" CHECK ("event_type" <> ''),
  CONSTRAINT "ck_session_event_audience" CHECK (cardinality("audience") > 0)
);
--> statement-breakpoint
CREATE TABLE "drizzle_lab"."outbox_message" (
  "id" uuid PRIMARY KEY,
  "session_event_id" uuid NOT NULL UNIQUE REFERENCES "drizzle_lab"."session_event"("id"),
  "topic" text NOT NULL,
  "payload" jsonb NOT NULL,
  "audience" "drizzle_lab"."visibility"[] NOT NULL,
  "attempts" integer NOT NULL DEFAULT 0,
  "next_attempt_at" timestamptz NOT NULL DEFAULT clock_timestamp(),
  "dispatched_at" timestamptz,
  "claim_token" uuid,
  "claimed_until" timestamptz,
  CONSTRAINT "ck_outbox_topic" CHECK ("topic" <> ''),
  CONSTRAINT "ck_outbox_payload_object" CHECK (jsonb_typeof("payload") = 'object'),
  CONSTRAINT "ck_outbox_audience" CHECK (cardinality("audience") > 0),
  CONSTRAINT "ck_outbox_attempts" CHECK ("attempts" >= 0)
);
--> statement-breakpoint
CREATE INDEX "ix_roll_attempt_character_time" ON "drizzle_lab"."roll_attempt" ("character_id", "confirmed_at" DESC);
--> statement-breakpoint
CREATE INDEX "ix_outbox_pending" ON "drizzle_lab"."outbox_message" ("next_attempt_at", "id") WHERE "dispatched_at" IS NULL;
