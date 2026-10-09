import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create type account_status as enum ('active', 'disabled');
    create type rule_revision_status as enum ('draft', 'reviewed', 'published', 'superseded');
    create type character_kind as enum ('CLAN_VAMPIRE', 'CAITIFF', 'THIN_BLOOD', 'GHOUL', 'MORTAL');
    create type character_state as enum ('draft', 'ready', 'retired');
    create type chronicle_state as enum ('draft', 'active', 'archived');
    create type membership_status as enum ('invited', 'active', 'suspended', 'left');
    create type membership_role as enum ('PLAYER', 'STORYTELLER');
    create type binding_state as enum ('requested', 'approved', 'active', 'released', 'rejected');
  `.execute(database);

  await sql`
    create table account (
      id uuid primary key,
      display_name text not null check (btrim(display_name) <> ''),
      status account_status not null default 'active',
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp()
    )
  `.execute(database);

  await sql`
    create table rule_set_profile_revision (
      id uuid primary key,
      profile_id uuid not null,
      revision integer not null check (revision > 0),
      status rule_revision_status not null,
      definition jsonb not null check (jsonb_typeof(definition) = 'object'),
      created_at timestamptz not null default clock_timestamp(),
      published_at timestamptz,
      constraint uq_rule_profile_revision unique (profile_id, revision),
      constraint ck_rule_profile_publication check (
        (status in ('published', 'superseded') and published_at is not null)
        or (status in ('draft', 'reviewed') and published_at is null)
      )
    )
  `.execute(database);

  await sql`
    create table "character" (
      id uuid primary key,
      owner_account_id uuid not null references account(id) on delete restrict,
      forked_from_character_id uuid references "character"(id) on delete restrict,
      rule_set_profile_revision_id uuid references rule_set_profile_revision(id) on delete restrict,
      name text not null,
      concept text,
      kind character_kind not null,
      state character_state not null default 'draft',
      version integer not null default 0 check (version >= 0),
      hunger smallint check (hunger between 0 and 5),
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint ck_character_ready_profile check (
        state <> 'ready' or rule_set_profile_revision_id is not null
      ),
      constraint ck_character_published_name check (
        state = 'draft' or btrim(name) <> ''
      ),
      constraint ck_character_hunger_capability check (
        (
          kind in ('CLAN_VAMPIRE', 'CAITIFF', 'THIN_BLOOD')
          and (state = 'draft' or hunger is not null)
        )
        or (kind in ('GHOUL', 'MORTAL') and hunger is null)
      )
    )
  `.execute(database);

  await sql`
    create table chronicle (
      id uuid primary key,
      administrative_owner_account_id uuid not null references account(id) on delete restrict,
      rule_set_profile_revision_id uuid references rule_set_profile_revision(id) on delete restrict,
      title text not null check (btrim(title) <> ''),
      description text,
      state chronicle_state not null default 'draft',
      version integer not null default 0 check (version >= 0),
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint ck_chronicle_active_profile check (
        state <> 'active' or rule_set_profile_revision_id is not null
      )
    )
  `.execute(database);

  await sql`
    create table chronicle_membership (
      id uuid primary key,
      chronicle_id uuid not null references chronicle(id) on delete restrict,
      account_id uuid not null references account(id) on delete restrict,
      status membership_status not null,
      roles membership_role[] not null default '{}',
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint uq_membership_account unique (chronicle_id, account_id),
      constraint uq_membership_chronicle unique (id, chronicle_id),
      constraint ck_active_membership_roles check (
        status <> 'active' or cardinality(roles) > 0
      )
    )
  `.execute(database);

  await sql`
    create table character_binding (
      id uuid primary key,
      chronicle_id uuid not null references chronicle(id) on delete restrict,
      membership_id uuid not null,
      character_id uuid not null references "character"(id) on delete restrict,
      requested_by_account_id uuid not null references account(id) on delete restrict,
      approved_by_account_id uuid references account(id) on delete restrict,
      state binding_state not null,
      chronicle_alias text,
      chronicle_notes text,
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      constraint fk_binding_membership_chronicle
        foreign key (membership_id, chronicle_id)
        references chronicle_membership(id, chronicle_id)
        on delete restrict,
      constraint uq_binding_character unique (id, character_id),
      constraint ck_binding_approval check (
        state not in ('approved', 'active') or approved_by_account_id is not null
      )
    )
  `.execute(database);

  await sql`
    create unique index uq_active_binding_per_character
      on character_binding (character_id)
      where state = 'active'
  `.execute(database);

  await sql`
    create index ix_character_owner on "character" (owner_account_id, state);
    create index ix_chronicle_membership_account on chronicle_membership (account_id, status);
    create index ix_binding_chronicle on character_binding (chronicle_id, state);
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_binding`.execute(database);
  await sql`drop table if exists chronicle_membership`.execute(database);
  await sql`drop table if exists chronicle`.execute(database);
  await sql`drop table if exists "character"`.execute(database);
  await sql`drop table if exists rule_set_profile_revision`.execute(database);
  await sql`drop table if exists account`.execute(database);

  await sql`drop type if exists binding_state`.execute(database);
  await sql`drop type if exists membership_role`.execute(database);
  await sql`drop type if exists membership_status`.execute(database);
  await sql`drop type if exists chronicle_state`.execute(database);
  await sql`drop type if exists character_state`.execute(database);
  await sql`drop type if exists character_kind`.execute(database);
  await sql`drop type if exists rule_revision_status`.execute(database);
  await sql`drop type if exists account_status`.execute(database);
}
