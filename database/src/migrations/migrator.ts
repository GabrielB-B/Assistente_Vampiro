import { Migrator, type MigrationInfo } from "kysely/migration";

import { createDatabase, ensureDatabaseSchema } from "../client.js";
import type { DatabaseConfig } from "../config.js";
import { ApplicationMigrationProvider } from "./migration-provider.js";

function createMigrator(config: DatabaseConfig) {
  const database = createDatabase(config);
  const migrator = new Migrator({
    db: database,
    migrationTableName: "migration_history",
    migrationTableSchema: config.schema,
    provider: new ApplicationMigrationProvider(),
  });

  return { database, migrator };
}

function throwMigrationError(error: unknown): never {
  throw error instanceof Error
    ? error
    : new Error("A migração falhou sem uma causa reconhecida.");
}

export async function migrateToLatest(config: DatabaseConfig): Promise<void> {
  await ensureDatabaseSchema(config);
  const { database, migrator } = createMigrator(config);

  try {
    const result = await migrator.migrateToLatest();
    if (result.error !== undefined) {
      throwMigrationError(result.error);
    }
  } finally {
    await database.destroy();
  }
}

export async function rollbackLastMigration(config: DatabaseConfig): Promise<void> {
  await ensureDatabaseSchema(config);
  const { database, migrator } = createMigrator(config);

  try {
    const result = await migrator.migrateDown();
    if (result.error !== undefined) {
      throwMigrationError(result.error);
    }
  } finally {
    await database.destroy();
  }
}

export async function readMigrationStatus(
  config: DatabaseConfig,
): Promise<readonly MigrationInfo[]> {
  await ensureDatabaseSchema(config);
  const { database, migrator } = createMigrator(config);

  try {
    return await migrator.getMigrations();
  } finally {
    await database.destroy();
  }
}
