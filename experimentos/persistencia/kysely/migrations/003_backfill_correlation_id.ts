import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`update roll_attempt set correlation_id = id where correlation_id is null`.execute(database);
}

export async function down(_database: Kysely<unknown>): Promise<void> {
  // Backfill reverso não é necessário: a coluna permanece até a contração.
}
