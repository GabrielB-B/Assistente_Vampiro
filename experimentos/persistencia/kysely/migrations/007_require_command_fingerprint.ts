import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table roll_attempt
      alter column command_fingerprint set not null,
      add constraint ck_roll_attempt_command_fingerprint
        check (command_fingerprint <> '')
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`
    alter table roll_attempt
      drop constraint if exists ck_roll_attempt_command_fingerprint,
      alter column command_fingerprint drop not null
  `.execute(database);
}
