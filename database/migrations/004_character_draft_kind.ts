import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table "character"
      drop constraint ck_character_hunger_capability,
      alter column kind drop not null,
      add constraint ck_character_non_draft_kind check (
        state = 'draft' or kind is not null
      )
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table "character"
      drop constraint ck_character_non_draft_kind,
      alter column kind set not null,
      add constraint ck_character_hunger_capability check (
        (
          kind in ('CLAN_VAMPIRE', 'CAITIFF', 'THIN_BLOOD')
          and (state = 'draft' or hunger is not null)
        )
        or (kind in ('GHOUL', 'MORTAL') and hunger is null)
      )
  `.execute(database);
}
