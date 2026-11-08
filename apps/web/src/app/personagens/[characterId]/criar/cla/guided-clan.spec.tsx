import type {
  CharacterCreationContextView,
  CreationClanStepView,
  CreationOriginId,
  CreationOriginOptionView,
} from "@assistente-vampiro/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GuidedClan } from "./guided-clan";

const { loadCreationClan, push, updateCreationClan } = vi.hoisted(() => ({
  loadCreationClan: vi.fn(),
  push: vi.fn(),
  updateCreationClan: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const ids = [
  "clan:banu-haqim",
  "clan:brujah",
  "clan:gangrel",
  "clan:hecata",
  "clan:lasombra",
  "clan:malkavian",
  "clan:ministry",
  "clan:nosferatu",
  "clan:ravnos",
  "clan:salubri",
  "clan:toreador",
  "clan:tremere",
  "clan:tzimisce",
  "clan:ventrue",
  "origin:caitiff",
  "origin:thin-blood",
] as const satisfies readonly CreationOriginId[];

const options: readonly CreationOriginOptionView[] = ids.map((id) => ({
  bane: id.startsWith("clan:")
    ? {
        name: "Perdição",
        severity: {
          derivedFrom: "BLOOD_POTENCY",
          resolutionStage: "HISTORY_AND_BLOOD",
          source: { pages: [215, 216], sourceId: "SRC-0001" },
        },
        summary: "Resumo da Perdição.",
      }
    : null,
  category: id.startsWith("clan:") ? "CLAN" : "OTHER_ORIGIN",
  clanId: id.startsWith("clan:") ? id : null,
  compulsion: id.startsWith("clan:")
    ? { name: "Compulsão", summary: "Resumo da Compulsão." }
    : null,
  disciplines: id.startsWith("clan:") ? ["discipline:presence"] : [],
  id,
  kind:
    id === "origin:caitiff"
      ? "CAITIFF"
      : id === "origin:thin-blood"
        ? "THIN_BLOOD"
        : "CLAN_VAMPIRE",
  mechanics:
    id === "origin:caitiff"
      ? {
          disciplineExperienceMultiplier: 6,
          hasClanBane: false,
          hasClanCompulsion: false,
          startingDisciplinePattern: "TWO_AND_ONE_FROM_ANY_TWO",
          startsWithSuspectFlaw: true,
          statusAtCreationAllowed: false,
          type: "CAITIFF",
        }
      : id === "origin:thin-blood"
        ? {
            bloodPotency: 0,
            hasClanBane: false,
            hasClanCompulsion: false,
            hasIntrinsicClanDisciplines: false,
            predatorTypeAtCreation: false,
            temporaryDisciplineFromResonance: true,
            thinBloodMeritFlawPairs: { maximum: 3, minimum: 1 },
            type: "THIN_BLOOD",
          }
        : { type: "CLAN" },
  sources: [{ pages: [1], sourceId: "SRC-0001" }],
}));

function context(
  selectedOriginId: CreationOriginId | null,
): CharacterCreationContextView {
  const selected = options.find((option) => option.id === selectedOriginId);
  const disciplinePolicy: CharacterCreationContextView["disciplinePolicy"] =
    selectedOriginId === "origin:caitiff"
      ? {
          family: "CAITIFF",
          selectionScope: "ANY_STANDARD_DISCIPLINE",
          startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO",
        }
      : selectedOriginId === "origin:thin-blood"
        ? {
            family: "THIN_BLOOD",
            hasIntrinsicClanDisciplines: false,
            selectionRules: "NONE_UNLESS_THIN_BLOOD_ALCHEMIST_MERIT",
          }
        : selectedOriginId?.startsWith("clan:")
          ? {
              allowedDisciplines: selected?.disciplines ?? [],
              family: "CLAN",
              originId: selectedOriginId,
              selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
            }
          : { family: "ORIGIN_REQUIRED" };
  return {
    characterId: "character-one",
    completedSteps: selectedOriginId === null ? ["concept"] : ["concept", "clan"],
    creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
    currentStep: "clan",
    disciplinePolicy,
    identity: { concept: "Investigadora", name: "Noemi Vale" },
    origin:
      selectedOriginId === null || selected === undefined
        ? null
        : { clanId: selected.clanId, id: selectedOriginId, kind: selected.kind },
    steps: [
      { id: "concept", status: "complete" },
      {
        id: "clan",
        status: selectedOriginId === null ? "not_started" : "complete",
      },
      { id: "attributes", status: "not_started" },
      { id: "skills", status: "not_started" },
      { id: "disciplines", status: "not_started" },
      { id: "predator", status: "not_started" },
      { id: "advantages", status: "not_started" },
      { id: "history-and-blood", status: "not_started" },
      { id: "review", status: "not_started" },
    ],
    version: selectedOriginId === null ? 2 : 3,
  };
}

function view(selectedOriginId: CreationOriginId | null): CreationClanStepView {
  return {
    characterId: "character-one",
    creationContext: context(selectedOriginId),
    evaluation: { complete: selectedOriginId !== null, selectedOriginId },
    options,
    policy: { ruleRevision: "RULE-CREATION-CLAN-001-r1" },
    version: selectedOriginId === null ? 2 : 3,
  };
}

loadCreationClan.mockResolvedValue(view(null));
updateCreationClan.mockImplementation(
  (_characterId: string, _version: number, originId: CreationOriginId) =>
    Promise.resolve(view(originId)),
);
vi.mock("../../../criar/creation-client", () => ({
  loadCreationClan,
  updateCreationClan,
}));
vi.mock("../../../../character-api", () => ({ loadCharacterSheetById: vi.fn() }));

describe("GuidedClan", () => {
  it("separa 14 clãs das duas outras origens e mantém a ajuda fechada", async () => {
    render(<GuidedClan characterId="character-one" />);
    await screen.findByRole("heading", { name: "Clã" });
    expect(screen.getAllByRole("radio")).toHaveLength(16);
    expect(screen.getByRole("radio", { name: /Caitiff/ })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: /Sangue-Ralo/ })).not.toBeChecked();
    expect(
      screen.queryByRole("dialog", { name: "Entender a escolha de Clã" }),
    ).toBeNull();
  });

  it("persiste a origem antes de habilitar a continuação", async () => {
    render(<GuidedClan characterId="character-one" />);
    const continueButton = await screen.findByRole("button", { name: "Continuar →" });
    expect(continueButton).toBeDisabled();
    fireEvent.click(screen.getByRole("radio", { name: /Toreador/ }));
    await waitFor(() =>
      expect(updateCreationClan).toHaveBeenCalledWith(
        "character-one",
        2,
        "clan:toreador",
      ),
    );
    await waitFor(() => expect(continueButton).toBeEnabled());
    fireEvent.click(continueButton);
    expect(push).toHaveBeenCalledWith("/personagens/character-one/criar/atributos");
  });

  it("explica Caitiff sem inventar símbolo ou Perdição", async () => {
    render(<GuidedClan characterId="character-one" />);
    fireEvent.click(await screen.findByRole("radio", { name: /Caitiff/ }));
    const mechanicsHeading = await screen.findByRole("heading", {
      name: "Como esta origem funciona",
    });
    expect(screen.getByText(/novo nível × 6 XP/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Disciplinas do clã" })).toBeNull();
    expect(
      mechanicsHeading.closest("section")?.parentElement?.querySelector("img"),
    ).toBeNull();
  });

  it("abre tooltips por hover, foco e toque e mantém a leitura longa fechada por padrão", async () => {
    render(<GuidedClan characterId="character-one" />);
    const archetype = await screen.findByRole("button", {
      name: /Artista obsessivo/,
    });
    fireEvent.mouseEnter(archetype);
    expect(screen.getByRole("tooltip")).toHaveTextContent(/obra capaz/i);
    fireEvent.mouseLeave(archetype);
    expect(screen.queryByRole("tooltip")).toBeNull();

    const discipline = await screen.findByRole("button", { name: /Presença/ });
    expect(screen.queryByRole("dialog", { name: "Toreador" })).toBeNull();
    fireEvent.focus(discipline);
    expect(screen.getByRole("tooltip")).toHaveTextContent(/magnetismo e emoção/i);
    fireEvent.blur(discipline);
    fireEvent.click(discipline);
    expect(screen.getByRole("tooltip")).toHaveTextContent(/magnetismo e emoção/i);
    fireEvent.click(screen.getByRole("button", { name: /Conhecer este Clã/ }));
    expect(screen.getByRole("dialog", { name: "Toreador" })).toBeInTheDocument();
  });
});
