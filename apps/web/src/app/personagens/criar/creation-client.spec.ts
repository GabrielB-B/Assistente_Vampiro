import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CreationClientError,
  loadCreationSkills,
  previewCreationDisciplines,
  updateCreationDisciplines,
  updateCreationSkills,
} from "./creation-client";

describe("cliente da criação de Habilidades", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("repete somente a leitura quando o proxy reinicia transitoriamente", async () => {
    const view = { characterId: "character-one", methodId: null, version: 1 };
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce(
        new Response("Bad gateway", { status: 502, statusText: "Bad Gateway" }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify(view), {
          headers: { "content-type": "application/json" },
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(loadCreationSkills("character-one")).resolves.toEqual(view);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("não repete uma mutação cuja confirmação de rede foi perdida", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("reset"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      updateCreationSkills("character-one", 1, {}, "QUICK_BALANCED"),
    ).rejects.toMatchObject<Partial<CreationClientError>>({ transient: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("envia somente os campos aceitos pela API ao salvar Disciplinas", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ characterId: "character-one", version: 2 }), {
        headers: { "content-type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await updateCreationDisciplines(
      "character-one",
      1,
      [
        {
          disciplineId: "discipline:presence",
          rating: 2,
          structuralMaximum: 5,
        },
      ] as never,
      [],
    );

    const request = fetchMock.mock.calls[0]?.[1];
    expect(JSON.parse(String(request?.body))).toMatchObject({
      disciplines: [{ disciplineId: "discipline:presence", rating: 2 }],
      expectedVersion: 1,
    });
    expect(String(request?.body)).not.toContain("structuralMaximum");
  });

  it("solicita uma prévia autoritativa sem persistir a redução de Disciplinas", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ characterId: "character-one", version: 1 }), {
        headers: { "content-type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await previewCreationDisciplines(
      "character-one",
      1,
      [{ disciplineId: "discipline:presence", rating: 1 }],
      ["power:presence-awe", "power:presence-lingering-kiss"],
    );

    const request = fetchMock.mock.calls[0]?.[1];
    expect(JSON.parse(String(request?.body))).toEqual({
      disciplines: [{ disciplineId: "discipline:presence", rating: 1 }],
      expectedVersion: 1,
      powerIds: ["power:presence-awe", "power:presence-lingering-kiss"],
      previewOnly: true,
    });
  });
});
