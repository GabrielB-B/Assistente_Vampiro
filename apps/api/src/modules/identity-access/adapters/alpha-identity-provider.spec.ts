import { ALPHA_FIXTURE_IDS } from "@assistente-vampiro/database";
import { describe, expect, it } from "vitest";

import type { AuthenticationError } from "../application/authentication-error.js";
import { AlphaIdentityProvider } from "./alpha-identity-provider.js";

describe("AlphaIdentityProvider", () => {
  it("resolve somente um alias publicado pelo seed", async () => {
    const provider = new AlphaIdentityProvider("test");

    await expect(provider.resolve("player-one")).resolves.toEqual({
      accountId: ALPHA_FIXTURE_IDS.accounts.playerOne,
      authenticationMethod: "alpha",
      identityAlias: "player-one",
    });
  });

  it.each([
    undefined,
    "",
    "PLAYER-ONE",
    ALPHA_FIXTURE_IDS.accounts.playerOne,
    "storyteller-two",
  ])("nega identidade ausente, alterada ou arbitrária: %s", async (alias) => {
    const provider = new AlphaIdentityProvider("test");

    await expect(provider.resolve(alias)).rejects.toEqual(
      expect.objectContaining<Partial<AuthenticationError>>({
        code: "AUTHENTICATION_REQUIRED",
      }),
    );
  });

  it.each([undefined, "development", "staging", "production"])(
    "não inicia fora de ambiente controlado: %s",
    (environment) => {
      expect(() => new AlphaIdentityProvider(environment)).toThrow(
        "O contexto fictício do alpha só pode ser usado em local, test ou ci.",
      );
    },
  );
});
