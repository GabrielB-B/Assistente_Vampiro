import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table "character"
      add column clan_id text,
      add constraint ck_character_clan_id check (
        clan_id is null or clan_id in (
          'clan:banu-haqim', 'clan:brujah', 'clan:gangrel', 'clan:hecata',
          'clan:lasombra', 'clan:malkavian', 'clan:ministry', 'clan:nosferatu',
          'clan:ravnos', 'clan:salubri', 'clan:toreador', 'clan:tremere',
          'clan:tzimisce', 'clan:ventrue'
        )
      ),
      add constraint ck_character_origin_kind check (
        clan_id is null or kind = 'CLAN_VAMPIRE'
      )
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table "character"
      drop constraint if exists ck_character_origin_kind,
      drop constraint if exists ck_character_clan_id,
      drop column if exists clan_id
  `.execute(database);
}
