import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

import { connectionStringForSchema, type DatabaseConfig } from "./config.js";
import type { DatabaseSchema } from "./database-types.js";

export type Database = Kysely<DatabaseSchema>;

export function createDatabase(config: DatabaseConfig): Database {
  return new Kysely<DatabaseSchema>({
    dialect: new PostgresDialect({
      pool: new Pool({
        application_name: "assistente-vampiro-api",
        connectionString: connectionStringForSchema(config),
        max: config.maxConnections,
      }),
    }),
  });
}

export async function checkDatabaseConnection(database: Database): Promise<void> {
  await sql`select 1`.execute(database);
}

export async function ensureDatabaseSchema(config: DatabaseConfig): Promise<void> {
  const bootstrap = new Kysely<unknown>({
    dialect: new PostgresDialect({
      pool: new Pool({
        application_name: "assistente-vampiro-migrator",
        connectionString: config.connectionString,
        max: 1,
      }),
    }),
  });

  try {
    await bootstrap.schema.createSchema(config.schema).ifNotExists().execute();
  } finally {
    await bootstrap.destroy();
  }
}
