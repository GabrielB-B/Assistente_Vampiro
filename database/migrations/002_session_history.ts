import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create type game_session_state as enum ('scheduled', 'active', 'ended', 'cancelled');
    create type scene_state as enum ('prepared', 'active', 'closed');
    create type content_visibility as enum ('CHRONICLE_SHARED', 'STORYTELLER_PRIVATE');
    create type roll_outcome as enum ('VICTORY', 'FAILURE');
    create type roll_special_result as enum ('NONE', 'MESSY_CRITICAL', 'BESTIAL_FAILURE');
  `.execute(database);

  await sql`
    create table game_session (
      id uuid primary key,
      chronicle_id uuid not null references chronicle(id) on delete restrict,
      state game_session_state not null,
      version integer not null default 0 check (version >= 0),
      scheduled_at timestamptz,
      started_at timestamptz,
      ended_at timestamptz,
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint ck_session_timeline check (
        ended_at is null or (started_at is not null and ended_at >= started_at)
      )
    )
  `.execute(database);

  await sql`
    create table scene (
      id uuid primary key,
      session_id uuid not null references game_session(id) on delete restrict,
      state scene_state not null,
      version integer not null default 0 check (version >= 0),
      title text not null check (btrim(title) <> ''),
      published_description text,
      storyteller_notes text,
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint uq_scene_session unique (id, session_id)
    )
  `.execute(database);

  await sql`
    create unique index uq_active_scene_per_session
      on scene (session_id)
      where state = 'active'
  `.execute(database);

  await sql`
    create table roll_attempt (
      id uuid primary key,
      session_id uuid not null references game_session(id) on delete restrict,
      scene_id uuid not null,
      actor_account_id uuid not null references account(id) on delete restrict,
      character_id uuid not null references "character"(id) on delete restrict,
      character_binding_id uuid,
      idempotency_key text not null check (
        btrim(idempotency_key) <> '' and char_length(idempotency_key) <= 255
      ),
      operation_version text not null check (
        btrim(operation_version) <> '' and char_length(operation_version) <= 100
      ),
      command_fingerprint text not null check (command_fingerprint ~ '^[0-9a-f]{64}$'),
      expected_character_version integer not null check (expected_character_version >= 0),
      profile_revision_id uuid not null references rule_set_profile_revision(id) on delete restrict,
      evaluator_revision text not null check (btrim(evaluator_revision) <> ''),
      difficulty smallint not null check (difficulty >= 0),
      requested_visibility content_visibility not null,
      composition jsonb not null check (jsonb_typeof(composition) = 'object'),
      faces jsonb not null check (jsonb_typeof(faces) = 'object'),
      outcome roll_outcome not null,
      special_result roll_special_result not null,
      result jsonb not null check (jsonb_typeof(result) = 'object'),
      previous_attempt_id uuid references roll_attempt(id) on delete restrict,
      correlation_id uuid not null,
      confirmed_at timestamptz not null default clock_timestamp(),
      constraint uq_roll_attempt_idempotency unique (
        actor_account_id,
        session_id,
        operation_version,
        idempotency_key
      ),
      constraint fk_roll_scene_session
        foreign key (scene_id, session_id)
        references scene(id, session_id)
        on delete restrict,
      constraint fk_roll_binding_character
        foreign key (character_binding_id, character_id)
        references character_binding(id, character_id)
        on delete restrict,
      constraint ck_roll_special_result check (
        (special_result = 'MESSY_CRITICAL' and outcome = 'VICTORY')
        or (special_result = 'BESTIAL_FAILURE' and outcome = 'FAILURE')
        or special_result = 'NONE'
      )
    )
  `.execute(database);

  await sql`
    create table session_stream (
      session_id uuid primary key references game_session(id) on delete restrict,
      last_sequence bigint not null default 0 check (last_sequence >= 0)
    )
  `.execute(database);

  await sql`
    create table session_event (
      id uuid primary key,
      session_id uuid not null references game_session(id) on delete restrict,
      sequence bigint not null check (sequence > 0),
      roll_attempt_id uuid unique references roll_attempt(id) on delete restrict,
      event_type text not null check (btrim(event_type) <> ''),
      audience content_visibility[] not null check (cardinality(audience) > 0),
      payload jsonb not null check (jsonb_typeof(payload) = 'object'),
      occurred_at timestamptz not null default clock_timestamp(),
      constraint uq_session_event_sequence unique (session_id, sequence)
    )
  `.execute(database);

  await sql`
    create table outbox_message (
      id uuid primary key,
      session_event_id uuid not null unique references session_event(id) on delete restrict,
      topic text not null check (btrim(topic) <> ''),
      payload jsonb not null check (jsonb_typeof(payload) = 'object'),
      audience content_visibility[] not null check (cardinality(audience) > 0),
      attempts integer not null default 0 check (attempts >= 0),
      next_attempt_at timestamptz not null default clock_timestamp(),
      dispatched_at timestamptz,
      claim_token uuid,
      claimed_until timestamptz,
      created_at timestamptz not null default clock_timestamp(),
      constraint ck_outbox_claim check (
        (claim_token is null and claimed_until is null)
        or (claim_token is not null and claimed_until is not null)
      )
    )
  `.execute(database);

  await sql`
    create table audit_entry (
      id uuid primary key,
      actor_account_id uuid references account(id) on delete restrict,
      action text not null check (btrim(action) <> ''),
      resource_type text not null check (btrim(resource_type) <> ''),
      resource_id uuid,
      correlation_id uuid not null,
      metadata jsonb not null check (jsonb_typeof(metadata) = 'object'),
      occurred_at timestamptz not null default clock_timestamp()
    )
  `.execute(database);

  await sql`
    create index ix_session_chronicle_state on game_session (chronicle_id, state);
    create index ix_roll_attempt_character_time on roll_attempt (character_id, confirmed_at desc);
    create index ix_outbox_pending
      on outbox_message (next_attempt_at, id)
      where dispatched_at is null;
    create index ix_audit_resource_time on audit_entry (resource_type, resource_id, occurred_at desc);
  `.execute(database);

  await sql`
    create function prevent_append_only_mutation()
    returns trigger
    language plpgsql
    as $$
    begin
      raise exception '% is append-only', tg_table_name using errcode = 'P0001';
    end;
    $$;

    create trigger prevent_roll_attempt_mutation
      before update or delete on roll_attempt
      for each row execute function prevent_append_only_mutation();

    create trigger prevent_session_event_mutation
      before update or delete on session_event
      for each row execute function prevent_append_only_mutation();

    create trigger prevent_audit_entry_mutation
      before update or delete on audit_entry
      for each row execute function prevent_append_only_mutation();
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists audit_entry`.execute(database);
  await sql`drop table if exists outbox_message`.execute(database);
  await sql`drop table if exists session_event`.execute(database);
  await sql`drop table if exists session_stream`.execute(database);
  await sql`drop table if exists roll_attempt`.execute(database);
  await sql`drop table if exists scene`.execute(database);
  await sql`drop table if exists game_session`.execute(database);
  await sql`drop function if exists prevent_append_only_mutation()`.execute(database);

  await sql`drop type if exists roll_special_result`.execute(database);
  await sql`drop type if exists roll_outcome`.execute(database);
  await sql`drop type if exists content_visibility`.execute(database);
  await sql`drop type if exists scene_state`.execute(database);
  await sql`drop type if exists game_session_state`.execute(database);
}
