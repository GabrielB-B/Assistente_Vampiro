import type { CharacterSheetView, PlayerEntryView } from "@assistente-vampiro/contracts";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { CorrelationContext } from "../../../observability/correlation-context.js";
import { AuthenticationError } from "../../identity-access/application/authentication-error.js";
import { IDENTITY_PROVIDER } from "../../identity-access/application/identity-provider.js";
import { GET_CHARACTER_SHEET } from "../application/get-character-sheet.js";
import { LIST_PLAYER_ENTRY } from "../application/list-player-entry.js";
import { CharactersController } from "./characters.controller.js";

const characterId = "019a0000-0000-7000-8000-000000000020";
const chronicleId = "019a0000-0000-7000-8000-000000000030";

const entry: PlayerEntryView = {
  actor: { displayName: "Jogadora Um", identityAlias: "player-one" },
  characters: [],
};

const sheet: CharacterSheetView = {
  accessMode: "OWNER",
  character: {
    concept: null,
    hunger: 2,
    id: characterId,
    kind: "CLAN_VAMPIRE",
    name: "Noemi Vale",
    state: "ready",
    version: 0,
  },
  chronicle: { description: null, id: chronicleId, title: "Ecos sob a Chuva" },
  ruleSetProfileRevisionId: null,
  scene: null,
  session: null,
  traits: [],
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
              Promise.resolve(actor.identityAlias === "player-one" ? sheet : undefined),
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

  it("não diferencia recurso alheio de recurso inexistente", async () => {
    const response = await request(server)
      .get(`/api/v1/characters/${characterId}/sheet`)
      .query({ chronicleId })
      .set("x-alpha-identity", "player-two");

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      error: { code: "RESOURCE_NOT_AVAILABLE" },
    });
  });

  it("rejeita identificadores malformados antes do caso de uso", async () => {
    const response = await request(server)
      .get("/api/v1/characters/invalido/sheet")
      .query({ chronicleId })
      .set("x-alpha-identity", "player-one");

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ error: { code: "INVALID_REQUEST" } });
  });
});
import type { Server } from "node:http";
