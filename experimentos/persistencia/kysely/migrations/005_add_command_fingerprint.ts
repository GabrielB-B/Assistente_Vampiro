import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`alter table roll_attempt add column command_fingerprint text`.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`alter table roll_attempt drop column if exists command_fingerprint`.execute(database);
}
