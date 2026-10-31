import { sql, type Kysely } from "kysely";

export async function up(database: Kysely<unknown>): Promise<void> {
  await sql`
    create table character_draft_request (
      owner_account_id uuid not null references account(id) on delete restrict,
      idempotency_key text not null check (
        char_length(idempotency_key) between 8 and 128
      ),
      character_id uuid not null unique references "character"(id) on delete restrict,
      created_at timestamptz not null default clock_timestamp(),
      primary key (owner_account_id, idempotency_key)
    )
  `.execute(database);
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await sql`drop table if exists character_draft_request`.execute(database);
}
