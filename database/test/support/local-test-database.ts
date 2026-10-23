import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

import { readDatabaseConfig, type DatabaseConfig } from "../../src/config.js";

function loadLocalEnvironment(): void {
  try {
    loadEnvFile(resolve(import.meta.dirname, "../../../.env"));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }
}

export function createLocalTestDatabaseConfig(prefix: string): DatabaseConfig {
  loadLocalEnvironment();
  const config = readDatabaseConfig();
  const hostname = new URL(config.connectionString).hostname;

  if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
    throw new Error("O teste de integração só pode usar PostgreSQL local.");
  }

  return {
    ...config,
    maxConnections: 2,
    schema: `av_test_${prefix}_${process.pid}_${Date.now()}`,
  };
}

export async function dropLocalTestSchema(config: DatabaseConfig): Promise<void> {
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
