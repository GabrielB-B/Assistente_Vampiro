import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GuidedAttributes } from "./guided-attributes";

vi.mock("../../../criar/creation-client", () => ({
  loadCreationAttributes: vi.fn().mockResolvedValue({
    attributes: {
      "attribute:charisma": 1,
      "attribute:composure": 1,
      "attribute:dexterity": 1,
      "attribute:intelligence": 1,
      "attribute:manipulation": 1,
      "attribute:resolve": 1,
      "attribute:stamina": 1,
      "attribute:strength": 1,
      "attribute:wits": 1,
    },
    characterId: "character-one",
    creationContext: {
      characterId: "character-one",
      completedSteps: ["concept", "clan"],
      creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
      currentStep: "attributes",
      disciplinePolicy: {
        allowedDisciplines: [
          "discipline:auspex",
          "discipline:celerity",
          "discipline:presence",
        ],
        family: "CLAN",
        originId: "clan:toreador",
        selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
      },
      identity: { concept: "Investigadora", name: "Noemi Vale" },
      origin: {
        clanId: "clan:toreador",
        id: "clan:toreador",
        kind: "CLAN_VAMPIRE",
      },
      steps: [
        { id: "concept", status: "complete" },
        { id: "clan", status: "complete" },
        { id: "attributes", status: "not_started" },
        { id: "skills", status: "not_started" },
        { id: "disciplines", status: "not_started" },
        { id: "predator", status: "not_started" },
        { id: "advantages", status: "not_started" },
        { id: "history-and-blood", status: "not_started" },
        { id: "review", status: "not_started" },
      ],
      version: 0,
    },
    evaluation: {
      complete: false,
      healthMax: 4,
      incrementsSpent: 0,
      remainingIncrements: 13,
      willpowerMax: 2,
    },
    policy: {
      maximum: 4,
      minimum: 1,
      ratingCounts: [
        { count: 1, rating: 4 },
        { count: 3, rating: 3 },
        { count: 4, rating: 2 },
        { count: 1, rating: 1 },
      ],
      ruleRevision: "RULE-CREATION-ATTRIBUTES-001-r1",
      totalIncrements: 13,
    },
    version: 0,
  }),
  updateCreationAttribute: vi.fn(),
}));

vi.mock("../../../../character-api", () => ({
  loadCharacterSheetById: vi.fn(),
}));

describe("GuidedAttributes", () => {
  it("mantém a identidade Toreador herdada do Character persistido", async () => {
    render(<GuidedAttributes characterId="character-one" />);

    expect(
      await screen.findByRole("img", { name: "Símbolo do Clã Toreador" }),
    ).toBeVisible();
    expect(screen.getByText("Toreador")).toBeVisible();
    expect(screen.getByText("Noemi Vale")).toBeVisible();
  });

  it("expõe os quatro blocos didáticos sem duplicar o progresso central", async () => {
    render(<GuidedAttributes characterId="character-one" />);

    await screen.findByRole("heading", { name: "Atributos" });
    expect(screen.getByRole("heading", { name: "O que são Atributos?" })).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Como pensar esta etapa?" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Regra de distribuição" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Impacto na ficha" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Seu progresso" })).toBeNull();
  });

  it("liga cada nome à microajuda e permite abrir e fechar por toque ou teclado", async () => {
    render(<GuidedAttributes characterId="character-one" />);

    const trigger = await screen.findByRole("button", {
      name: "Força: mostrar ajuda",
    });
    const tooltip = screen.getByRole("tooltip", {
      name: "Potência física bruta, impacto e capacidade de impor o corpo.",
    });

    expect(trigger).toHaveAttribute("aria-describedby", "attribute:strength-help");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(trigger, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    expect(tooltip).toBeInTheDocument();
  });
});
