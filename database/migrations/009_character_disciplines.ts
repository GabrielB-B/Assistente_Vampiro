import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create table character_discipline (
      character_id uuid not null references "character"(id) on delete restrict,
      discipline_id text not null check (discipline_id ~ '^discipline:[a-z][a-z0-9-]{1,63}$'),
      rating smallint not null check (rating between 0 and 5),
      updated_at timestamptz not null default clock_timestamp(),
      primary key (character_id, discipline_id)
    )
  `.execute(database);
  await sql`
    create table character_discipline_power (
      character_id uuid not null references "character"(id) on delete restrict,
      power_id text not null check (power_id ~ '^power:[a-z][a-z0-9-]{1,95}$'),
      discipline_id text not null check (discipline_id ~ '^discipline:[a-z][a-z0-9-]{1,63}$'),
      power_rule_revision_id text not null check (char_length(power_rule_revision_id) between 3 and 96),
      acquired_at timestamptz not null default clock_timestamp(),
      primary key (character_id, power_id),
      foreign key (character_id, discipline_id)
        references character_discipline(character_id, discipline_id)
        on delete restrict
    )
  `.execute(database);
  await sql`create index ix_character_discipline_power_character_discipline on character_discipline_power(character_id, discipline_id)`.execute(
    database,
  );
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_discipline_power`.execute(database);
  await sql`drop table if exists character_discipline`.execute(database);
}
