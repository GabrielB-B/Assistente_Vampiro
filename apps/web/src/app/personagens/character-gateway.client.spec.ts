import { afterEach, describe, expect, it, vi } from "vitest";

import { CharacterGatewayClientError, listCharacters } from "./character-gateway.client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("character gateway client", () => {
  it("classifica autorização negada sem expor detalhes do recurso", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 } as Response),
    );

    await expect(listCharacters()).rejects.toEqual(
      new CharacterGatewayClientError("denied"),
    );
  });

  it("separa indisponibilidade transitória para permitir nova tentativa", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 } as Response),
    );

    await expect(listCharacters()).rejects.toEqual(
      new CharacterGatewayClientError("unavailable"),
    );
  });
});
