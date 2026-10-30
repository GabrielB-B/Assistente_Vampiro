import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

import {
  ALPHA_FIXTURE_IDS,
  createDatabase,
  migrateToLatest,
  readDatabaseConfig,
  seedAlphaContext,
  type Database,
  type DatabaseConfig,
} from "@assistente-vampiro/database";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { KyselyCharacterEntryReader } from "../src/modules/characters/adapters/kysely-character-entry-reader.js";
import { GetCharacterSheet } from "../src/modules/characters/application/get-character-sheet.js";
import { ListPlayerEntry } from "../src/modules/characters/application/list-player-entry.js";
import { AlphaIdentityProvider } from "../src/modules/identity-access/adapters/alpha-identity-provider.js";
import { KyselyAccessContextReader } from "../src/modules/identity-access/adapters/kysely-access-context-reader.js";

function createTestConfig(): DatabaseConfig {
  try {
    loadEnvFile(resolve(import.meta.dirname, "../../../.env"));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }

  const config = readDatabaseConfig();
  const hostname = new URL(config.connectionString).hostname;
  if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
    throw new Error("O teste de integração só pode usar PostgreSQL local.");
  }

  return {
    ...config,
    maxConnections: 2,
    schema: `av_test_api_entry_${process.pid}_${Date.now()}`,
  };
}

describe("entrada e ficha mínima persistidas", () => {
  const config = createTestConfig();
  let database: Database;
  let entries: ListPlayerEntry;
  let getSheet: GetCharacterSheet;
  const identities = new AlphaIdentityProvider("test");

  beforeAll(async () => {
    await migrateToLatest(config);
    database = createDatabase(config);
    await seedAlphaContext(database, "test");
    const reader = new KyselyCharacterEntryReader(database);
    entries = new ListPlayerEntry(reader);
    getSheet = new GetCharacterSheet(new KyselyAccessContextReader(database), reader);
  });

  afterAll(async () => {
    await database.schema.dropSchema(config.schema).ifExists().cascade().execute();
    await database.destroy();
  });

  it("carrega a ficha própria e somente a cena publicada", async () => {
    const actor = await identities.resolve("player-one");
    const entry = await entries.execute(actor);
    const view = await getSheet.execute(actor, {
      characterId: ALPHA_FIXTURE_IDS.character,
      chronicleId: ALPHA_FIXTURE_IDS.chronicle,
    });

    expect(entry?.characters).toEqual([
      expect.objectContaining({
        accessMode: "OWNER",
        characterName: "Noemi Vale",
        chronicleTitle: "Ecos sob a Chuva",
      }),
    ]);
    expect(view).toMatchObject({
      accessMode: "OWNER",
      character: { hunger: 2, name: "Noemi Vale" },
      scene: { title: "O primeiro chamado" },
    });
    expect(view?.scene).not.toHaveProperty("storytellerNotes");
    expect(view?.traits).toHaveLength(4);
  });

  it("entrega a projeção vinculada à Narradora", async () => {
    const actor = await identities.resolve("storyteller-one");
    const entry = await entries.execute(actor);
    const view = await getSheet.execute(actor, {
      characterId: ALPHA_FIXTURE_IDS.character,
      chronicleId: ALPHA_FIXTURE_IDS.chronicle,
    });

    expect(entry?.characters[0]?.accessMode).toBe("STORYTELLER");
    expect(view?.accessMode).toBe("STORYTELLER");
  });

  it.each(["player-two", "outsider-one"] as const)(
    "não revela a personagem para %s",
    async (alias) => {
      const actor = await identities.resolve(alias);

      await expect(entries.execute(actor)).resolves.toMatchObject({ characters: [] });
      await expect(
        getSheet.execute(actor, {
          characterId: ALPHA_FIXTURE_IDS.character,
          chronicleId: ALPHA_FIXTURE_IDS.chronicle,
        }),
      ).resolves.toBeUndefined();
    },
  );
});
