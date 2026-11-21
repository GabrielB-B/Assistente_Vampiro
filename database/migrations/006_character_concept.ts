import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table "character"
      add column sire text,
      add column ambition text,
      add column desire text
  `.execute(database);

  await sql`
    create table character_conviction_pair (
      character_id uuid not null references "character"(id) on delete restrict,
      position smallint not null check (position >= 0),
      conviction text,
      touchstone text,
      updated_at timestamptz not null default clock_timestamp(),
      primary key (character_id, position),
      constraint ck_character_conviction_pair_has_content check (
        nullif(btrim(conviction), '') is not null
        or nullif(btrim(touchstone), '') is not null
      )
    )
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_conviction_pair`.execute(database);
  await sql`
    alter table "character"
      drop column if exists desire,
      drop column if exists ambition,
      drop column if exists sire
  `.execute(database);
}
