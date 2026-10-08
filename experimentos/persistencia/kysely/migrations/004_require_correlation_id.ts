import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`alter table roll_attempt alter column correlation_id set not null`.execute(database);
  await sql`create index ix_roll_attempt_correlation on roll_attempt (correlation_id)`.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop index if exists ix_roll_attempt_correlation`.execute(database);
  await sql`alter table roll_attempt alter column correlation_id drop not null`.execute(database);
}
