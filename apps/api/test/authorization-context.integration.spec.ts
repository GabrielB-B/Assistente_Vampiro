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

import { AlphaIdentityProvider } from "../src/modules/identity-access/adapters/alpha-identity-provider.js";
import { KyselyAccessContextReader } from "../src/modules/identity-access/adapters/kysely-access-context-reader.js";
import { CharacterAccessPolicy } from "../src/modules/identity-access/application/character-access-policy.js";
import { ChronicleAccessPolicy } from "../src/modules/identity-access/application/chronicle-access-policy.js";

function loadLocalEnvironment(): void {
  try {
    loadEnvFile(resolve(import.meta.dirname, "../../../.env"));
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }
}

function createTestConfig(): DatabaseConfig {
  loadLocalEnvironment();
  const config = readDatabaseConfig();
  const hostname = new URL(config.connectionString).hostname;

  if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
    throw new Error("O teste de integração só pode usar PostgreSQL local.");
  }

  return {
    ...config,
    maxConnections: 2,
    schema: `av_test_api_access_${process.pid}_${Date.now()}`,
  };
}

describe("contexto de autorização persistido", () => {
  const config = createTestConfig();
  let database: Database;

  beforeAll(async () => {
    await migrateToLatest(config);
    database = createDatabase(config);
    await seedAlphaContext(database, "test");
  });

  afterAll(async () => {
    await database.schema.dropSchema(config.schema).ifExists().cascade().execute();
    await database.destroy();
  });

  it("permite controle apenas à Jogadora vinculada", async () => {
    const identities = new AlphaIdentityProvider("test");
    const reader = new KyselyAccessContextReader(database);
    const policy = new CharacterAccessPolicy();
    const playerOne = await identities.resolve("player-one");
    const playerTwo = await identities.resolve("player-two");
    const playerOneContext = await reader.readCharacterAccess(
      playerOne.accountId,
      ALPHA_FIXTURE_IDS.character,
      ALPHA_FIXTURE_IDS.chronicle,
    );
    const playerTwoContext = await reader.readCharacterAccess(
      playerTwo.accountId,
      ALPHA_FIXTURE_IDS.character,
      ALPHA_FIXTURE_IDS.chronicle,
    );

    expect(playerOneContext).toBeDefined();
    expect(playerTwoContext).toBeDefined();
    if (playerOneContext === undefined || playerTwoContext === undefined) {
      throw new Error("O seed não criou o contexto esperado.");
    }

    expect(playerOneContext.membership?.roles).toEqual(["PLAYER"]);
    expect(policy.authorizePlayerControl(playerOne, playerOneContext)).toEqual({
      allowed: true,
    });
    expect(policy.authorizePlayerControl(playerTwo, playerTwoContext)).toEqual({
      allowed: false,
      code: "RESOURCE_NOT_AVAILABLE",
    });
  });

  it("permite visão do Narrador somente por Participação ativa e Vínculo", async () => {
    const identities = new AlphaIdentityProvider("test");
    const reader = new KyselyAccessContextReader(database);
    const policy = new CharacterAccessPolicy();
    const storyteller = await identities.resolve("storyteller-one");
    const context = await reader.readCharacterAccess(
      storyteller.accountId,
      ALPHA_FIXTURE_IDS.character,
      ALPHA_FIXTURE_IDS.chronicle,
    );

    expect(context).toBeDefined();
    if (context === undefined) {
      throw new Error("O seed não criou o contexto esperado.");
    }

    expect(policy.authorizeStorytellerView(storyteller, context)).toEqual({
      allowed: true,
    });
  });

  it("nega outsider sem confirmar Participação na Crônica", async () => {
    const identities = new AlphaIdentityProvider("test");
    const reader = new KyselyAccessContextReader(database);
    const policy = new ChronicleAccessPolicy();
    const outsider = await identities.resolve("outsider-one");
    const context = await reader.readCharacterAccess(
      outsider.accountId,
      ALPHA_FIXTURE_IDS.character,
      ALPHA_FIXTURE_IDS.chronicle,
    );

    expect(context?.membership).toBeUndefined();
    expect(policy.authorizeActiveMembership(outsider, context?.membership)).toEqual({
      allowed: false,
      code: "RESOURCE_NOT_AVAILABLE",
    });
  });

  it("nega Participação suspensa lida do PostgreSQL", async () => {
    const identities = new AlphaIdentityProvider("test");
    const reader = new KyselyAccessContextReader(database);
    const policy = new ChronicleAccessPolicy();
    const playerTwo = await identities.resolve("player-two");

    await database
      .updateTable("chronicle_membership")
      .set({ status: "suspended" })
      .where("id", "=", ALPHA_FIXTURE_IDS.memberships.playerTwo)
      .executeTakeFirstOrThrow();

    try {
      const context = await reader.readCharacterAccess(
        playerTwo.accountId,
        ALPHA_FIXTURE_IDS.character,
        ALPHA_FIXTURE_IDS.chronicle,
      );

      expect(context?.membership?.roles).toEqual(["PLAYER"]);
      expect(policy.authorizeActiveMembership(playerTwo, context?.membership)).toEqual({
        allowed: false,
        code: "MEMBERSHIP_INACTIVE",
      });
    } finally {
      await database
        .updateTable("chronicle_membership")
        .set({ status: "active" })
        .where("id", "=", ALPHA_FIXTURE_IDS.memberships.playerTwo)
        .executeTakeFirstOrThrow();
    }
  });
});
