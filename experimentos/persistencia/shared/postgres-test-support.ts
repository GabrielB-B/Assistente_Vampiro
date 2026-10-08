import { Pool } from "pg";

import type { RecordCounts, SchemaEvidence } from "./contract.js";
import { testDatabaseUrl } from "./environment.js";

function assertSafeSchemaName(schema: string): void {
  if (!/^[a-z][a-z0-9_]*$/.test(schema)) {
    throw new Error(`Nome de schema inválido: ${schema}`);
  }
}

export async function resetSchema(schema: string): Promise<void> {
  assertSafeSchemaName(schema);
  const pool = new Pool({ connectionString: testDatabaseUrl, max: 1 });

  try {
    await pool.query(`drop schema if exists ${schema} cascade`);
    await pool.query(`create schema ${schema} authorization current_user`);
  } finally {
    await pool.end();
  }
}

export async function seedCharacter(
  connectionString: string,
  characterId: string,
  hunger: number,
): Promise<void> {
  const pool = new Pool({ connectionString, max: 1 });

  try {
    await pool.query(
      `insert into character_state (id, version, hunger)
       values ($1, 0, $2)
       on conflict (id) do update set version = 0, hunger = excluded.hunger`,
      [characterId, hunger],
    );
  } finally {
    await pool.end();
  }
}

export async function readRecordCounts(
  connectionString: string,
): Promise<RecordCounts> {
  const pool = new Pool({ connectionString, max: 1 });

  try {
    const result = await pool.query<{
      character_states: string;
      roll_attempts: string;
      session_streams: string;
      session_events: string;
      outbox_messages: string;
    }>(`
      select
        (select count(*) from character_state)::text as character_states,
        (select count(*) from roll_attempt)::text as roll_attempts,
        (select count(*) from session_stream)::text as session_streams,
        (select count(*) from session_event)::text as session_events,
        (select count(*) from outbox_message)::text as outbox_messages
    `);
    const row = result.rows[0];

    if (row === undefined) {
      throw new Error("A consulta de contagem não retornou dados.");
    }

    return {
      characterStates: Number(row.character_states),
      rollAttempts: Number(row.roll_attempts),
      sessionStreams: Number(row.session_streams),
      sessionEvents: Number(row.session_events),
      outboxMessages: Number(row.outbox_messages),
    };
  } finally {
    await pool.end();
  }
}

export async function readCharacterVersion(
  connectionString: string,
  characterId: string,
): Promise<number | null> {
  const pool = new Pool({ connectionString, max: 1 });

  try {
    const result = await pool.query<{ version: number }>(
      "select version from character_state where id = $1",
      [characterId],
    );
    return result.rows[0]?.version ?? null;
  } finally {
    await pool.end();
  }
}

export async function readSchemaEvidence(
  connectionString: string,
  schema: string,
): Promise<SchemaEvidence> {
  const pool = new Pool({ connectionString, max: 1 });

  try {
    const tables = await pool.query<{ table_name: string }>(
      `select table_name
       from information_schema.tables
       where table_schema = $1 and table_type = 'BASE TABLE'
       order by table_name`,
      [schema],
    );
    const constraints = await pool.query<{ constraint_type: string; count: string }>(
      `select constraint_type, count(*)::text as count
       from information_schema.table_constraints
       where table_schema = $1
       group by constraint_type`,
      [schema],
    );
    const correlation = await pool.query<{ is_nullable: "YES" | "NO" }>(
      `select is_nullable
       from information_schema.columns
       where table_schema = $1
         and table_name = 'roll_attempt'
         and column_name = 'correlation_id'`,
      [schema],
    );
    const commandFingerprint = await pool.query<{ is_nullable: "YES" | "NO" }>(
      `select is_nullable
       from information_schema.columns
       where table_schema = $1
         and table_name = 'roll_attempt'
         and column_name = 'command_fingerprint'`,
      [schema],
    );
    const countByType = new Map(
      constraints.rows.map((row) => [row.constraint_type, Number(row.count)]),
    );

    return {
      tableNames: tables.rows
        .map((row) => row.table_name)
        .filter(
          (name) =>
            !name.startsWith("kysely_") &&
            name !== "__drizzle_migrations" &&
            name !== "_prisma_migrations",
        ),
      checkConstraintCount: countByType.get("CHECK") ?? 0,
      uniqueConstraintCount: countByType.get("UNIQUE") ?? 0,
      correlationIdIsRequired: correlation.rows[0]?.is_nullable === "NO",
      commandFingerprintIsRequired:
        commandFingerprint.rows[0]?.is_nullable === "NO",
    };
  } finally {
    await pool.end();
  }
}
