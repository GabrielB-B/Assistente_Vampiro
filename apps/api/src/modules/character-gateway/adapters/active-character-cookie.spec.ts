import { describe, expect, it } from "vitest";

import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterGatewayItem } from "../application/character-gateway-repository.js";
import { ActiveCharacterCookie } from "./active-character-cookie.js";

const actor: ActorContext = {
  accountId: "account-player",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};
const character: CharacterGatewayItem = {
  characterId: "character-one",
  chronicleId: "chronicle-one",
  chronicleTitle: "Ecos sob a Chuva",
  clan: null,
  lastActivityAt: null,
  name: "Noemi Vale",
  portraitUrl: null,
};

describe("ActiveCharacterCookie", () => {
  it("assina o contexto mínimo e o recupera sem dados de ficha", () => {
    const cookie = new ActiveCharacterCookie(
      "test-secret-with-at-least-thirty-two-characters",
      () => new Date("2026-10-28T12:00:00.000Z"),
    );

    const value = cookie.encode(actor, character);

    expect(cookie.verify(value)).toEqual({
      accountId: actor.accountId,
      characterId: character.characterId,
      chronicleId: character.chronicleId,
      issuedAt: "2026-10-28T12:00:00.000Z",
      version: 1,
    });
    expect(value).not.toContain(character.name);
  });

  it("rejeita adulteração do contexto ativo", () => {
    const cookie = new ActiveCharacterCookie(
      "test-secret-with-at-least-thirty-two-characters",
    );
    const value = cookie.encode(actor, character);
    const tampered = `${value.slice(0, -1)}${value.endsWith("a") ? "b" : "a"}`;

    expect(cookie.verify(tampered)).toBeUndefined();
  });
});
