import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`alter table roll_attempt add column correlation_id uuid`.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`alter table roll_attempt drop column correlation_id`.execute(database);
}
