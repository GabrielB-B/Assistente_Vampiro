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
import { KyselyCharacterSheetWriter } from "../src/modules/characters/adapters/kysely-character-sheet-writer.js";
import { CharacterNotAvailableError } from "../src/modules/characters/application/character-not-available-error.js";
import { CharacterVersionConflictError } from "../src/modules/characters/application/character-version-conflict-error.js";
import { GetCharacterSheet } from "../src/modules/characters/application/get-character-sheet.js";
import { GetCreationConcept } from "../src/modules/characters/application/get-creation-concept.js";
import { ListPlayerEntry } from "../src/modules/characters/application/list-player-entry.js";
import { StartCharacterDraft } from "../src/modules/characters/application/start-character-draft.js";
import { UpdateCharacterSheet } from "../src/modules/characters/application/update-character-sheet.js";
import { UpdateCreationAttributes } from "../src/modules/characters/application/update-creation-attributes.js";
import { UpdateCreationConcept } from "../src/modules/characters/application/update-creation-concept.js";
import { AlphaIdentityProvider } from "../src/modules/identity-access/adapters/alpha-identity-provider.js";
import { KyselyAccessContextReader } from "../src/modules/identity-access/adapters/kysely-access-context-reader.js";

const draftCharacterId = "019a0000-0000-7000-8000-000000000021";
const auditEntryId = "019a0000-0000-7000-8000-000000000071";
const correlationId = "019a0000-0000-7000-8000-000000000072";
const createdDraftId = "019a0000-0000-7000-8000-000000000022";
const createdDraftReplayId = "019a0000-0000-7000-8000-000000000023";
const createdDraftAuditId = "019a0000-0000-7000-8000-000000000073";
const createdDraftReplayAuditId = "019a0000-0000-7000-8000-000000000074";
const attributesAuditId = "019a0000-0000-7000-8000-000000000075";
const conceptDraftId = "019a0000-0000-7000-8000-000000000024";
const conceptAuditId = "019a0000-0000-7000-8000-000000000076";

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
  let updateSheet: UpdateCharacterSheet;
  let accessReader: KyselyAccessContextReader;
  let sheetWriter: KyselyCharacterSheetWriter;
  const identities = new AlphaIdentityProvider("test");

  beforeAll(async () => {
    await migrateToLatest(config);
    database = createDatabase(config);
    await seedAlphaContext(database, "test");
    await database
      .insertInto("character")
      .values({
        concept: null,
        forked_from_character_id: null,
        hunger: null,
        id: draftCharacterId,
        kind: "CLAN_VAMPIRE",
        name: "",
        owner_account_id: ALPHA_FIXTURE_IDS.accounts.playerOne,
        rule_set_profile_revision_id: null,
        state: "draft",
        version: 0,
      })
      .execute();
    await database
      .insertInto("character")
      .values({
        concept: null,
        forked_from_character_id: null,
        hunger: null,
        id: conceptDraftId,
        kind: null,
        name: "",
        owner_account_id: ALPHA_FIXTURE_IDS.accounts.playerOne,
        rule_set_profile_revision_id: ALPHA_FIXTURE_IDS.ruleProfileRevision,
        state: "draft",
        version: 0,
      })
      .execute();

    const reader = new KyselyCharacterEntryReader(database);
    accessReader = new KyselyAccessContextReader(database);
    sheetWriter = new KyselyCharacterSheetWriter(database);
    entries = new ListPlayerEntry(reader);
    getSheet = new GetCharacterSheet(accessReader, reader);
    updateSheet = new UpdateCharacterSheet(accessReader, sheetWriter, {
      next: () => auditEntryId,
    });
  });

  afterAll(async () => {
    await database.schema.dropSchema(config.schema).ifExists().cascade().execute();
    await database.destroy();
  });

  it("mantém Crônica como contexto separado da ficha canônica", async () => {
    const actor = await identities.resolve("player-one");
    const entry = await entries.execute(actor);
    const view = await getSheet.execute(actor, {
      characterId: ALPHA_FIXTURE_IDS.character,
      chronicleId: ALPHA_FIXTURE_IDS.chronicle,
    });

    expect(entry?.characters).toContainEqual(
      expect.objectContaining({
        accessMode: "OWNER",
        characterName: "Noemi Vale",
        chronicleTitle: "Ecos sob a Chuva",
      }),
    );
    expect(view).toMatchObject({
      context: { chronicle: { title: "Ecos sob a Chuva" } },
      sheet: {
        accessMode: "OWNER",
        character: { hunger: 2, name: "Noemi Vale" },
      },
    });
    expect(view).not.toHaveProperty("scene");
    expect(view).not.toHaveProperty("session");
    expect(view?.sheet.traits).toHaveLength(4);
  });

  it("carrega rascunho próprio sem Crônica, Participação, Sessão ou Cena", async () => {
    const actor = await identities.resolve("player-one");
    const entry = await entries.execute(actor);
    const view = await getSheet.execute(actor, { characterId: draftCharacterId });

    expect(entry?.characters).toContainEqual({
      accessMode: "OWNER",
      characterId: draftCharacterId,
      characterName: "",
      characterState: "draft",
      chronicleId: null,
      chronicleTitle: null,
      concept: null,
    });
    expect(view).toMatchObject({
      context: { chronicle: null },
      sheet: {
        accessMode: "OWNER",
        character: { id: draftCharacterId, state: "draft", version: 0 },
      },
    });
  });

  it("entrega a projeção vinculada à Narradora sem misturar Sessão na ficha", async () => {
    const actor = await identities.resolve("storyteller-one");
    const entry = await entries.execute(actor);
    const view = await getSheet.execute(actor, {
      characterId: ALPHA_FIXTURE_IDS.character,
      chronicleId: ALPHA_FIXTURE_IDS.chronicle,
    });

    expect(entry?.characters[0]?.accessMode).toBe("STORYTELLER");
    expect(view?.sheet.accessMode).toBe("STORYTELLER");
    expect(view).not.toHaveProperty("scene");
    expect(view).not.toHaveProperty("session");
  });

  it.each(["player-two", "outsider-one"] as const)(
    "não revela o rascunho independente para %s",
    async (alias) => {
      const actor = await identities.resolve(alias);

      await expect(
        getSheet.execute(actor, { characterId: draftCharacterId }),
      ).resolves.toBeUndefined();
    },
  );

  it("atualiza identidade com versão esperada e auditoria na mesma transação", async () => {
    const actor = await identities.resolve("player-one");

    await expect(
      updateSheet.execute(actor, {
        characterId: draftCharacterId,
        correlationId,
        expectedVersion: 0,
        identity: { concept: "Investigadora noturna", name: "Noemi Vale" },
      }),
    ).resolves.toEqual({ characterId: draftCharacterId, version: 1 });

    const [character, audit] = await Promise.all([
      database
        .selectFrom("character")
        .select(["concept", "name", "version"])
        .where("id", "=", draftCharacterId)
        .executeTakeFirstOrThrow(),
      database
        .selectFrom("audit_entry")
        .select(["action", "actor_account_id", "resource_id"])
        .where("id", "=", auditEntryId)
        .executeTakeFirstOrThrow(),
    ]);

    expect(character).toEqual({
      concept: "Investigadora noturna",
      name: "Noemi Vale",
      version: 1,
    });
    expect(audit).toEqual({
      action: "character.sheet.identity.updated",
      actor_account_id: actor.accountId,
      resource_id: draftCharacterId,
    });
  });

  it("rejeita overwrite silencioso e edição por outra Conta", async () => {
    const owner = await identities.resolve("player-one");
    const other = await identities.resolve("player-two");

    await expect(
      updateSheet.execute(owner, {
        characterId: draftCharacterId,
        correlationId,
        expectedVersion: 0,
        identity: { name: "Sobrescrita" },
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);
    await expect(
      updateSheet.execute(other, {
        characterId: draftCharacterId,
        correlationId,
        expectedVersion: 1,
        identity: { name: "Invasão" },
      }),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);

    await expect(
      database
        .selectFrom("character")
        .select("name")
        .where("id", "=", draftCharacterId)
        .executeTakeFirstOrThrow(),
    ).resolves.toEqual({ name: "Noemi Vale" });
  });

  it("persiste e retoma Conceito, pares e progresso com autorização e versão", async () => {
    const owner = await identities.resolve("player-one");
    const other = await identities.resolve("player-two");
    const getConcept = new GetCreationConcept(accessReader, sheetWriter);
    const updateConcept = new UpdateCreationConcept(accessReader, sheetWriter, {
      next: () => conceptAuditId,
    });

    await expect(getConcept.execute(owner, conceptDraftId)).resolves.toMatchObject({
      chronicle: null,
      convictionPairs: [],
      evaluation: { complete: false },
      version: 0,
    });

    await expect(
      updateConcept.execute(owner, {
        characterId: conceptDraftId,
        convictionPairs: [
          {
            conviction: "Nunca abandonar quem pede ajuda.",
            touchstone: "Helena",
          },
        ],
        correlationId,
        expectedVersion: 0,
        identity: {
          ambition: "Descobrir quem apagou suas memórias.",
          concept: "Investigadora da própria noite.",
          desire: null,
          name: "Noemi Vale",
          sire: "Dorian Valerius",
        },
      }),
    ).resolves.toMatchObject({
      evaluation: { complete: true },
      version: 1,
    });

    const resumed = await getConcept.execute(owner, conceptDraftId);
    expect(resumed).toMatchObject({
      convictionPairs: [
        {
          conviction: "Nunca abandonar quem pede ajuda.",
          position: 0,
          touchstone: "Helena",
        },
      ],
      identity: {
        ambition: "Descobrir quem apagou suas memórias.",
        concept: "Investigadora da própria noite.",
        name: "Noemi Vale",
        sire: "Dorian Valerius",
      },
      version: 1,
    });
    await expect(getConcept.execute(other, conceptDraftId)).resolves.toBeUndefined();
    await expect(
      updateConcept.execute(owner, {
        characterId: conceptDraftId,
        convictionPairs: [],
        correlationId,
        expectedVersion: 0,
        identity: resumed?.identity ?? {
          ambition: null,
          concept: null,
          desire: null,
          name: "",
          sire: null,
        },
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);

    await expect(
      database
        .selectFrom("audit_entry")
        .select("action")
        .where("id", "=", conceptAuditId)
        .executeTakeFirstOrThrow(),
    ).resolves.toEqual({ action: "character.creation.concept.updated" });
  });

  it("inicia uma única Ficha canônica idempotente e persiste Atributos nela", async () => {
    const actor = await identities.resolve("player-one");
    const ids = [
      createdDraftAuditId,
      createdDraftId,
      createdDraftReplayAuditId,
      createdDraftReplayId,
    ];
    const startDraft = new StartCharacterDraft(sheetWriter, {
      next: () => ids.shift() ?? "019a0000-0000-7000-8000-000000000099",
    });

    const first = await startDraft.execute(actor, {
      correlationId,
      idempotencyKey: "integration-creation-attempt",
    });
    const replay = await startDraft.execute(actor, {
      correlationId,
      idempotencyKey: "integration-creation-attempt",
    });

    expect(first).toEqual({ characterId: createdDraftId, created: true, version: 0 });
    expect(replay).toEqual({
      characterId: createdDraftId,
      created: false,
      version: 0,
    });

    const updateAttributes = new UpdateCreationAttributes(accessReader, sheetWriter, {
      next: () => attributesAuditId,
    });
    await expect(
      updateAttributes.execute(actor, {
        attributes: { "attribute:stamina": 4 },
        characterId: createdDraftId,
        correlationId,
        expectedVersion: 0,
      }),
    ).resolves.toMatchObject({
      characterId: createdDraftId,
      evaluation: { healthMax: 7, remainingIncrements: 10 },
      version: 1,
    });

    const [character, traits, requests] = await Promise.all([
      database
        .selectFrom("character")
        .select(["kind", "rule_set_profile_revision_id", "state", "version"])
        .where("id", "=", createdDraftId)
        .executeTakeFirstOrThrow(),
      database
        .selectFrom("character_trait")
        .select(["trait_id", "value"])
        .where("character_id", "=", createdDraftId)
        .where("kind", "=", "ATTRIBUTE")
        .execute(),
      database
        .selectFrom("character_draft_request")
        .select("character_id")
        .where("owner_account_id", "=", actor.accountId)
        .where("idempotency_key", "=", "integration-creation-attempt")
        .execute(),
    ]);

    expect(character).toEqual({
      kind: null,
      rule_set_profile_revision_id: ALPHA_FIXTURE_IDS.ruleProfileRevision,
      state: "draft",
      version: 1,
    });
    expect(traits).toHaveLength(9);
    expect(traits).toContainEqual({ trait_id: "attribute:stamina", value: 4 });
    expect(requests).toEqual([{ character_id: createdDraftId }]);
  });
});
