import { readDatabaseConfig } from "../config.js";
import {
  migrateToLatest,
  readMigrationStatus,
  rollbackLastMigration,
} from "../migrations/migrator.js";

type MigrationCommand = "down" | "status" | "up";

function readCommand(rawCommand: string | undefined): MigrationCommand {
  if (rawCommand === "up" || rawCommand === "down" || rawCommand === "status") {
    return rawCommand;
  }

  throw new Error("Comando inválido. Use up, down ou status.");
}

async function run(): Promise<void> {
  const command = readCommand(process.argv[2]);
  const config = readDatabaseConfig();

  if (command === "up") {
    await migrateToLatest(config);
    console.info(`Migrações aplicadas no schema ${config.schema}.`);
    return;
  }

  if (command === "down") {
    await rollbackLastMigration(config);
    console.info(`Última migração revertida no schema ${config.schema}.`);
    return;
  }

  const migrations = await readMigrationStatus(config);
  for (const migration of migrations) {
    const state = migration.executedAt === undefined ? "pendente" : "aplicada";
    console.info(`${migration.name}: ${state}`);
  }
}

run().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Falha desconhecida na migração.";
  console.error(message);
  process.exitCode = 1;
});
