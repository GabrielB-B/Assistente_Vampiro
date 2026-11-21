import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create type creation_skill_method as enum (
      'QUICK_JACK_OF_ALL_TRADES', 'QUICK_BALANCED', 'QUICK_SPECIALIST',
      'DETAILED_GENERALIST', 'DETAILED_SPECIALIST'
    )
  `.execute(database);
  await sql`
    create type character_specialty_origin as enum (
      'CREATION_AUTOMATIC', 'CREATION_FREE'
    )
  `.execute(database);
  await sql`
    alter table "character"
      add column creation_skill_method creation_skill_method
  `.execute(database);
  await sql`
    create table character_specialty (
      id uuid primary key,
      character_id uuid not null references "character"(id) on delete restrict,
      skill_id text not null check (skill_id ~ '^skill:[a-z][a-z0-9-]{1,63}$'),
      label text not null check (char_length(btrim(label)) between 2 and 80),
      origin character_specialty_origin not null,
      position smallint not null check (position >= 0),
      created_at timestamptz not null default clock_timestamp(),
      updated_at timestamptz not null default clock_timestamp(),
      unique (character_id, position)
    )
  `.execute(database);
  await sql`create index ix_character_specialty_character_skill on character_specialty(character_id, skill_id)`.execute(
    database,
  );
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_specialty`.execute(database);
  await sql`alter table "character" drop column if exists creation_skill_method`.execute(
    database,
  );
  await sql`drop type if exists character_specialty_origin`.execute(database);
  await sql`drop type if exists creation_skill_method`.execute(database);
}
