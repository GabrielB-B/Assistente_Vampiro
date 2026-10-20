import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { checkDatabaseConnection, createDatabase } from "../src/client.js";
import { readDatabaseConfig, type DatabaseConfig } from "../src/config.js";
import {
  migrateToLatest,
  readMigrationStatus,
  rollbackLastMigration,
} from "../src/migrations/migrator.js";

function loadLocalEnvironment(): void {
  try {
    loadEnvFile(resolve(import.meta.dirname, "../../.env"));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }
}

function requireLocalDatabaseConfig(): DatabaseConfig {
  loadLocalEnvironment();
  const config = readDatabaseConfig();
  const hostname = new URL(config.connectionString).hostname;

  if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
    throw new Error("O teste de integração só pode usar PostgreSQL local.");
  }

  return {
    ...config,
    maxConnections: 2,
    schema: `av_test_${process.pid}_${Date.now()}`,
  };
}

async function dropTestSchema(config: DatabaseConfig): Promise<void> {
  const database = new Kysely<unknown>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: config.connectionString, max: 1 }),
    }),
  });

  try {
    await database.schema.dropSchema(config.schema).ifExists().cascade().execute();
  } finally {
    await database.destroy();
  }
}

describe("migrações de produção", () => {
  const config = requireLocalDatabaseConfig();

  beforeAll(async () => {
    await migrateToLatest(config);
  });

  afterAll(async () => {
    await dropTestSchema(config);
  });

  it("aplica todo o schema em um banco vazio", async () => {
    const database = createDatabase(config);

    try {
      await checkDatabaseConnection(database);
      const tables = await sql<{ table_name: string }>`
        select table_name
        from information_schema.tables
        where table_schema = ${config.schema}
          and table_type = 'BASE TABLE'
        order by table_name
      `.execute(database);
      const timezone = await sql<{ TimeZone: string }>`show timezone`.execute(database);
      const version = await sql<{ server_version: string }>`show server_version`.execute(
        database,
      );

      expect(tables.rows.map((row) => row.table_name)).toEqual(
        expect.arrayContaining([
          "account",
          "audit_entry",
          "character",
          "character_binding",
          "chronicle",
          "chronicle_membership",
          "game_session",
          "outbox_message",
          "roll_attempt",
          "rule_set_profile_revision",
          "scene",
          "session_event",
          "session_stream",
        ]),
      );
      expect(timezone.rows[0]?.TimeZone).toBe("UTC");
      expect(version.rows[0]?.server_version).toMatch(/^18\./);
    } finally {
      await database.destroy();
    }
  });

  it("registra as duas migrações como aplicadas", async () => {
    const status = await readMigrationStatus(config);

    expect(status.map((migration) => migration.name)).toEqual([
      "001_initial_domain",
      "002_session_history",
    ]);
    expect(status.every((migration) => migration.executedAt !== undefined)).toBe(true);
  });

  it("materializa as invariantes críticas no PostgreSQL", async () => {
    const database = createDatabase(config);

    try {
      const constraints = await sql<{ conname: string }>`
        select constraint_record.conname
        from pg_constraint as constraint_record
        inner join pg_namespace as namespace
          on namespace.oid = constraint_record.connamespace
        where namespace.nspname = ${config.schema}
      `.execute(database);
      const indexes = await sql<{ indexname: string }>`
        select indexname
        from pg_indexes
        where schemaname = ${config.schema}
      `.execute(database);
      const triggers = await sql<{ tgname: string }>`
        select trigger_record.tgname
        from pg_trigger as trigger_record
        inner join pg_class as table_record on table_record.oid = trigger_record.tgrelid
        inner join pg_namespace as namespace on namespace.oid = table_record.relnamespace
        where namespace.nspname = ${config.schema}
          and not trigger_record.tgisinternal
      `.execute(database);

      expect(constraints.rows.map((row) => row.conname)).toEqual(
        expect.arrayContaining([
          "ck_roll_special_result",
          "fk_roll_scene_session",
          "uq_roll_attempt_idempotency",
          "uq_session_event_sequence",
        ]),
      );
      expect(indexes.rows.map((row) => row.indexname)).toEqual(
        expect.arrayContaining([
          "ix_outbox_pending",
          "uq_active_binding_per_character",
          "uq_active_scene_per_session",
        ]),
      );
      expect(triggers.rows.map((row) => row.tgname)).toEqual(
        expect.arrayContaining([
          "prevent_audit_entry_mutation",
          "prevent_roll_attempt_mutation",
          "prevent_session_event_mutation",
        ]),
      );
    } finally {
      await database.destroy();
    }
  });

  it("reverte e reaplica o último incremento sem afetar o domínio inicial", async () => {
    await rollbackLastMigration(config);
    const database = createDatabase(config);

    try {
      const tables = await sql<{ table_name: string }>`
        select table_name
        from information_schema.tables
        where table_schema = ${config.schema}
          and table_name in ('account', 'session_event')
        order by table_name
      `.execute(database);

      expect(tables.rows.map((row) => row.table_name)).toEqual(["account"]);
    } finally {
      await database.destroy();
    }

    await migrateToLatest(config);
  });
});
