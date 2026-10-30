import type { CharacterSheetView, PlayerEntryView } from "@assistente-vampiro/contracts";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PlayerEntry } from "./player-entry";

const characterId = "019a0000-0000-7000-8000-000000000020";

const playerEntry: PlayerEntryView = {
  actor: { displayName: "Jogadora Um", identityAlias: "player-one" },
  characters: [
    {
      accessMode: "OWNER",
      characterId,
      characterName: "Noemi Vale",
      characterState: "ready",
      chronicleId: "019a0000-0000-7000-8000-000000000030",
      chronicleTitle: "Ecos sob a Chuva",
      concept: "Investigadora que ainda procura entender a própria noite.",
    },
  ],
};

const sheet: CharacterSheetView = {
  accessMode: "OWNER",
  character: {
    concept: "Investigadora que ainda procura entender a própria noite.",
    hunger: 2,
    id: characterId,
    kind: "CLAN_VAMPIRE",
    name: "Noemi Vale",
    state: "ready",
    version: 0,
  },
  chronicle: {
    description: "Crônica inteiramente fictícia para a prova técnica do alpha.",
    id: "019a0000-0000-7000-8000-000000000030",
    title: "Ecos sob a Chuva",
  },
  ruleSetProfileRevisionId: "019a0000-0000-7000-8000-000000000011",
  scene: {
    id: "019a0000-0000-7000-8000-000000000060",
    publishedDescription:
      "A chuva cobre a cidade quando uma mensagem interrompe o silêncio.",
    title: "O primeiro chamado",
    version: 0,
  },
  session: {
    id: "019a0000-0000-7000-8000-000000000050",
    state: "active",
    version: 0,
  },
  traits: [
    { kind: "ATTRIBUTE", traitId: "attribute:composure", value: 3 },
    { kind: "ATTRIBUTE", traitId: "attribute:resolve", value: 2 },
    { kind: "SKILL", traitId: "skill:awareness", value: 2 },
    { kind: "SKILL", traitId: "skill:occult", value: 1 },
  ],
};

function response(body: unknown): Response {
  return {
    json: () => Promise.resolve(body),
    ok: true,
  } as Response;
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((input: RequestInfo | URL) =>
      Promise.resolve(
        String(input).includes("/sheet") ? response(sheet) : response(playerEntry),
      ),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Ficha Completa V5", () => {
  it("carrega somente a folha autorizada, sem antecipar a Mesa", async () => {
    render(<PlayerEntry initialCharacterId={characterId} />);

    expect(await screen.findByRole("heading", { name: "Noemi Vale" })).toBeVisible();
    expect(screen.getByText("Ecos sob a Chuva")).toBeVisible();
    expect(screen.getByLabelText("Fome: 2 de 5")).toBeVisible();
    expect(screen.queryByLabelText("Jogar agora")).not.toBeInTheDocument();
    expect(screen.queryByText("Ficha rápida")).not.toBeInTheDocument();
  });

  it("abre o Roll Builder a partir de uma Habilidade carregada", async () => {
    render(<PlayerEntry initialCharacterId={characterId} />);
    await screen.findByRole("heading", { name: "Noemi Vale" });

    fireEvent.click(
      screen.getByRole("button", { name: /Preparar jogada com Percepção/ }),
    );

    const dialog = screen.getByRole("dialog", { name: "Percepção" });
    fireEvent.click(within(dialog).getByRole("button", { name: /Autocontrole/ }));
    fireEvent.change(within(dialog).getByRole("combobox"), {
      target: { value: "3" },
    });

    expect(within(dialog).getByText("5 dados")).toBeVisible();
    fireEvent.click(within(dialog).getByRole("button", { name: "Preparar rolagem" }));
    expect(within(dialog).getByRole("status")).toHaveTextContent("2 Dados de Fome");
  });

  it("mantém campos futuros vazios em vez de inventar dados", async () => {
    render(<PlayerEntry initialCharacterId={characterId} />);
    await screen.findByRole("heading", { name: "Noemi Vale" });

    fireEvent.click(screen.getByRole("button", { name: "Crônica & Sangue" }));
    expect(screen.getByText("Dados ainda não registrados.")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "História" }));
    expect(screen.getByText("A história ainda não foi registrada.")).toBeVisible();
  });
});
