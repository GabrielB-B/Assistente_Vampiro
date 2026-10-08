import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`create type visibility as enum ('PUBLIC', 'PLAYER', 'STORYTELLER')`.execute(database);
  await sql`create type roll_result_kind as enum ('SUCCESS', 'FAILURE', 'MESSY_CRITICAL', 'BESTIAL_FAILURE')`.execute(database);

  await sql`
    create table character_state (
      id uuid primary key,
      version integer not null check (version >= 0),
      hunger smallint not null check (hunger between 0 and 5),
      updated_at timestamptz not null default clock_timestamp()
    )
  `.execute(database);

  await sql`
    create table roll_attempt (
      id uuid primary key,
      session_id uuid not null,
      scene_id uuid not null,
      character_id uuid not null references character_state(id),
      idempotency_key text not null,
      expected_state_version integer not null check (expected_state_version >= 0),
      profile_revision text not null check (profile_revision <> ''),
      rules_revision text not null check (rules_revision <> ''),
      evaluator_revision text not null check (evaluator_revision <> ''),
      composition jsonb not null check (jsonb_typeof(composition) = 'object'),
      faces jsonb not null check (jsonb_typeof(faces) = 'object'),
      result_kind roll_result_kind not null,
      result jsonb not null check (jsonb_typeof(result) = 'object'),
      previous_attempt_id uuid references roll_attempt(id),
      confirmed_at timestamptz not null default clock_timestamp(),
      constraint uq_roll_attempt_session_idempotency unique (session_id, idempotency_key)
    )
  `.execute(database);

  await sql`
    create table session_stream (
      session_id uuid primary key,
      last_sequence bigint not null default 0 check (last_sequence >= 0)
    )
  `.execute(database);

  await sql`
    create table session_event (
      id uuid primary key,
      session_id uuid not null,
      sequence bigint not null check (sequence > 0),
      roll_attempt_id uuid not null unique references roll_attempt(id),
      event_type text not null check (event_type <> ''),
      audience visibility[] not null check (cardinality(audience) > 0),
      occurred_at timestamptz not null default clock_timestamp(),
      constraint uq_session_event_sequence unique (session_id, sequence)
    )
  `.execute(database);

  await sql`
    create table outbox_message (
      id uuid primary key,
      session_event_id uuid not null unique references session_event(id),
      topic text not null check (topic <> ''),
      payload jsonb not null check (jsonb_typeof(payload) = 'object'),
      audience visibility[] not null check (cardinality(audience) > 0),
      attempts integer not null default 0 check (attempts >= 0),
      next_attempt_at timestamptz not null default clock_timestamp(),
      dispatched_at timestamptz,
      claim_token uuid,
      claimed_until timestamptz
    )
  `.execute(database);

  await sql`
    create index ix_outbox_pending
      on outbox_message (next_attempt_at, id)
      where dispatched_at is null
  `.execute(database);
  await sql`create index ix_roll_attempt_character_time on roll_attempt (character_id, confirmed_at desc)`.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists outbox_message cascade`.execute(database);
  await sql`drop table if exists session_event cascade`.execute(database);
  await sql`drop table if exists session_stream cascade`.execute(database);
  await sql`drop table if exists roll_attempt cascade`.execute(database);
  await sql`drop table if exists character_state cascade`.execute(database);
  await sql`drop type if exists roll_result_kind`.execute(database);
  await sql`drop type if exists visibility`.execute(database);
}
