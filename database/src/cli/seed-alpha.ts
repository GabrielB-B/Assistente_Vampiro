import { createDatabase } from "../client.js";
import { readDatabaseConfig } from "../config.js";
import { seedAlphaContext } from "../seeds/alpha-context.js";

async function run(): Promise<void> {
  const config = readDatabaseConfig();
  const database = createDatabase(config);

  try {
    const alphaEnvironment =
      process.env.NODE_ENV === "production" ? "production" : process.env.APP_ENV;
    await seedAlphaContext(database, alphaEnvironment);
    console.info(`Contexto fictício do alpha aplicado no schema ${config.schema}.`);
  } finally {
    await database.destroy();
  }
}

run().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Falha desconhecida ao aplicar o seed.";
  console.error(message);
  process.exitCode = 1;
});
