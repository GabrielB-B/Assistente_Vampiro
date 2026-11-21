import type { Server } from "node:http";

import type {
  CharacterSheetDocumentView,
  PlayerEntryView,
} from "@assistente-vampiro/contracts";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { CorrelationContext } from "../../../observability/correlation-context.js";
import { AuthenticationError } from "../../identity-access/application/authentication-error.js";
import { IDENTITY_PROVIDER } from "../../identity-access/application/identity-provider.js";
import { CharacterNotAvailableError } from "../application/character-not-available-error.js";
import { CharacterVersionConflictError } from "../application/character-version-conflict-error.js";
import { GET_CREATION_ATTRIBUTES } from "../application/get-creation-attributes.js";
import { GET_CREATION_CONCEPT } from "../application/get-creation-concept.js";
import { GET_CREATION_CLAN } from "../application/get-creation-clan.js";
import { GET_CREATION_SKILLS } from "../application/get-creation-skills.js";
import { GET_CREATION_DISCIPLINES } from "../application/get-creation-disciplines.js";
import { GET_CHARACTER_SHEET } from "../application/get-character-sheet.js";
import { LIST_PLAYER_ENTRY } from "../application/list-player-entry.js";
import { START_CHARACTER_DRAFT } from "../application/start-character-draft.js";
import { UPDATE_CREATION_ATTRIBUTES } from "../application/update-creation-attributes.js";
import { UPDATE_CREATION_CONCEPT } from "../application/update-creation-concept.js";
import { UPDATE_CREATION_CLAN } from "../application/update-creation-clan.js";
import { UPDATE_CREATION_SKILLS } from "../application/update-creation-skills.js";
import { UPDATE_CREATION_DISCIPLINES } from "../application/update-creation-disciplines.js";
import { UPDATE_CHARACTER_SHEET } from "../application/update-character-sheet.js";
import { CharactersController } from "./characters.controller.js";

const characterId = "019a0000-0000-7000-8000-000000000020";
const chronicleId = "019a0000-0000-7000-8000-000000000030";

const entry: PlayerEntryView = {
  actor: { displayName: "Jogadora Um", identityAlias: "player-one" },
  characters: [],
};

const document: CharacterSheetDocumentView = {
  context: {
    chronicle: {
      description: null,
      id: chronicleId,
      title: "Ecos sob a Chuva",
    },
  },
  sheet: {
    accessMode: "OWNER",
    character: {
      ambition: null,
      clanId: "clan:toreador",
      concept: null,
      desire: null,
      hunger: 2,
      id: characterId,
      kind: "CLAN_VAMPIRE",
      name: "Noemi Vale",
      sire: null,
      state: "ready",
      version: 0,
    },
    convictionPairs: [],
    ruleSetProfileRevisionId: null,
    traits: [],
  },
};

describe("contrato HTTP de entrada e ficha", () => {
  let application: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleReference = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        CorrelationContext,
        {
          provide: IDENTITY_PROVIDER,
          useValue: {
            resolve: (alias: string | undefined) =>
              alias === "player-one" || alias === "player-two"
                ? Promise.resolve({
                    accountId: `account-${alias}`,
                    authenticationMethod: "alpha" as const,
                    identityAlias: alias,
                  })
                : Promise.reject(new AuthenticationError()),
          },
        },
        {
          provide: LIST_PLAYER_ENTRY,
          useValue: { execute: () => Promise.resolve(entry) },
        },
        {
          provide: GET_CHARACTER_SHEET,
          useValue: {
            execute: (actor: { readonly identityAlias: string }) =>
              Promise.resolve(
                actor.identityAlias === "player-one" ? document : undefined,
              ),
          },
        },
        {
          provide: GET_CREATION_ATTRIBUTES,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: GET_CREATION_CONCEPT,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: GET_CREATION_CLAN,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: GET_CREATION_SKILLS,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: GET_CREATION_DISCIPLINES,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: START_CHARACTER_DRAFT,
          useValue: {
            execute: () => Promise.resolve({ characterId, created: true, version: 0 }),
          },
        },
        {
          provide: UPDATE_CREATION_ATTRIBUTES,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: UPDATE_CREATION_CONCEPT,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: UPDATE_CREATION_CLAN,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: UPDATE_CREATION_SKILLS,
          useValue: {
            createSpecialty: () => Promise.resolve(undefined),
            deleteSpecialty: () => Promise.resolve(undefined),
            execute: () => Promise.resolve(undefined),
            updateSpecialty: () => Promise.resolve(undefined),
          },
        },
        {
          provide: UPDATE_CREATION_DISCIPLINES,
          useValue: { execute: () => Promise.resolve(undefined) },
        },
        {
          provide: UPDATE_CHARACTER_SHEET,
          useValue: {
            execute: (
              actor: { readonly identityAlias: string },
              command: { readonly expectedVersion: number },
            ) => {
              if (actor.identityAlias !== "player-one") {
                return Promise.reject(new CharacterNotAvailableError());
              }
              if (command.expectedVersion !== 0) {
                return Promise.reject(new CharacterVersionConflictError());
              }
              return Promise.resolve({ characterId, version: 1 });
            },
          },
        },
      ],
    }).compile();
    application = moduleReference.createNestApplication();
    application.setGlobalPrefix("api/v1");
    await application.init();
    server = application.getHttpServer() as Server;
  });

  afterAll(async () => application.close());

  it("exige uma identidade da allowlist", async () => {
    const response = await request(server).get("/api/v1/player-entry");

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      error: { code: "AUTHENTICATION_REQUIRED" },
    });
  });

  it("publica a entrada autorizada", async () => {
    const response = await request(server)
      .get("/api/v1/player-entry")
      .set("x-alpha-identity", "player-one");

    expect(response.status).toBe(200);
    expect((response.body as PlayerEntryView).actor.displayName).toBe("Jogadora Um");
  });

  it("carrega a ficha própria sem exigir chronicleId", async () => {
    const response = await request(server)
      .get(`/api/v1/characters/${characterId}/sheet`)
      .set("x-alpha-identity", "player-one");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      context: { chronicle: { id: chronicleId } },
      sheet: { character: { id: characterId } },
    });
  });

  it("não diferencia recurso alheio de recurso inexistente", async () => {
    const response = await request(server)
      .get(`/api/v1/characters/${characterId}/sheet`)
      .set("x-alpha-identity", "player-two");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: { code: "RESOURCE_NOT_AVAILABLE" },
    });
  });

  it("rejeita identificadores malformados antes do caso de uso", async () => {
    const response = await request(server)
      .get("/api/v1/characters/invalido/sheet")
      .set("x-alpha-identity", "player-one");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: { code: "INVALID_REQUEST" } });
  });

  it("rejeita método de Habilidades fora do contrato público", async () => {
    const response = await request(server)
      .patch(`/api/v1/characters/${characterId}/creation/skills`)
      .set("x-alpha-identity", "player-one")
      .send({ expectedVersion: 0, methodId: "QUICK_INVENTED", skills: {} });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: { code: "INVALID_REQUEST" } });
  });

  it("expõe escrita parcial versionada sem aceitar proprietário no corpo", async () => {
    const response = await request(server)
      .patch(`/api/v1/characters/${characterId}/sheet`)
      .set("x-alpha-identity", "player-one")
      .send({
        expectedVersion: 0,
        identity: { concept: "Investigadora noturna" },
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ characterId, version: 1 });

    const invalid = await request(server)
      .patch(`/api/v1/characters/${characterId}/sheet`)
      .set("x-alpha-identity", "player-one")
      .send({
        expectedVersion: 0,
        identity: { name: "Noemi" },
        ownerAccountId: "account-other",
      });

    expect(invalid.status).toBe(400);
    expect(invalid.body).toMatchObject({ error: { code: "INVALID_REQUEST" } });
  });

  it("traduz conflito de versão para resposta estável", async () => {
    const response = await request(server)
      .patch(`/api/v1/characters/${characterId}/sheet`)
      .set("x-alpha-identity", "player-one")
      .send({ expectedVersion: 9, identity: { name: "Noemi" } });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ error: { code: "VERSION_CONFLICT" } });
  });
});
