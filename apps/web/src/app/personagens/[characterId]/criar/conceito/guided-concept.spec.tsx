import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  loadCreationConcept,
  updateCreationConcept,
} from "../../../criar/creation-client";
import { GuidedConcept } from "./guided-concept";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("../../../criar/creation-client", () => ({
  loadCreationConcept: vi.fn(),
  updateCreationConcept: vi.fn(),
}));
vi.mock("../../../../character-api", () => ({
  loadCharacterSheetById: vi.fn(),
}));
vi.mock("../../../../character-sheet-prototype", () => ({
  CharacterSheetPrototype: () => <div>Ficha real</div>,
}));

const emptyStep = {
  characterId: "character-one",
  chronicle: null,
  convictionPairs: [],
  evaluation: {
    complete: false,
    incompletePairPositions: [],
    missingRequiredFields: ["name", "concept", "ambition"],
  },
  identity: {
    ambition: null,
    concept: null,
    desire: null,
    name: "",
    sire: null,
  },
  policy: {
    maximumConvictionPairs: 3,
    ruleRevision: "RULE-CREATION-CONCEPT-001-r1",
  },
  version: 0,
} as const;

describe("GuidedConcept", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadCreationConcept).mockResolvedValue(emptyStep);
    vi.mocked(updateCreationConcept).mockImplementation(
      async (_characterId, _version, identity, pairs) => ({
        ...emptyStep,
        convictionPairs: pairs.map((pair, position) => ({ ...pair, position })),
        evaluation: {
          complete: Boolean(identity.name && identity.concept && identity.ambition),
          incompletePairPositions: [],
          missingRequiredFields: [],
        },
        identity,
        version: 1,
      }),
    );
  });

  it("mantém a hierarquia narrativa, omite Crônica ausente e revela pares aos poucos", async () => {
    render(<GuidedConcept characterId="character-one" />);

    await screen.findByRole("heading", { name: "Conceito" });
    expect(screen.getByRole("textbox", { name: "Nome" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Senhor" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Conceito" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Ambição" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Desejo" })).toBeVisible();
    expect(screen.queryByText("Sem Crônica")).toBeNull();
    expect(screen.queryByLabelText(/Remover convicção e pilar/u)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Adicionar convicção e pilar/u }));
    expect(screen.getByRole("textbox", { name: "Convicção" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Pilar" })).toBeVisible();
    expect(screen.getAllByLabelText(/Remover convicção e pilar/u)).toHaveLength(1);
  });

  it("oferece ajuda por toque e persiste no mesmo Character com expectedVersion", async () => {
    render(<GuidedConcept characterId="character-one" />);

    const concept = await screen.findByRole("textbox", { name: "Conceito" });
    const helpTrigger = screen.getByRole("button", {
      name: "Conceito: mostrar ajuda",
    });
    fireEvent.click(helpTrigger);
    expect(helpTrigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Uma frase curta que resume quem o personagem é nesta história."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: "Nome" }), {
      target: { value: "Noemi Vale" },
    });
    fireEvent.change(concept, {
      target: { value: "Investigadora da própria noite." },
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Ambição" }), {
      target: { value: "Recuperar suas memórias." },
    });
    fireEvent.blur(concept);

    await waitFor(() =>
      expect(updateCreationConcept).toHaveBeenCalledWith(
        "character-one",
        0,
        expect.objectContaining({
          ambition: "Recuperar suas memórias.",
          concept: "Investigadora da própria noite.",
          name: "Noemi Vale",
        }),
        [],
      ),
    );
  });
});
