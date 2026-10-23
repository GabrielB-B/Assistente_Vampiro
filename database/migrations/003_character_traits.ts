import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create type character_trait_kind as enum ('ATTRIBUTE', 'SKILL')
  `.execute(database);

  await sql`
    create table character_trait (
      character_id uuid not null references "character"(id) on delete restrict,
      kind character_trait_kind not null,
      trait_id text not null check (
        trait_id ~ '^(attribute|skill):[a-z][a-z0-9-]{1,63}$'
      ),
      value smallint not null,
      updated_at timestamptz not null default clock_timestamp(),
      primary key (character_id, kind, trait_id),
      constraint ck_character_trait_kind_matches_id check (
        (kind = 'ATTRIBUTE' and trait_id like 'attribute:%')
        or (kind = 'SKILL' and trait_id like 'skill:%')
      ),
      constraint ck_character_trait_value_by_kind check (
        (kind = 'ATTRIBUTE' and value between 1 and 5)
        or (kind = 'SKILL' and value between 0 and 5)
      )
    )
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_trait`.execute(database);
  await sql`drop type if exists character_trait_kind`.execute(database);
}
