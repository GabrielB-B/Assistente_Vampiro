import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    update roll_attempt
    set command_fingerprint = 'legacy:' || id::text
    where command_fingerprint is null
  `.execute(database);
}

export async function down(_database: Kysely<unknown>): Promise<void> {
  // O preenchimento é deliberadamente irreversível: apagar a impressão perderia evidência.
}
