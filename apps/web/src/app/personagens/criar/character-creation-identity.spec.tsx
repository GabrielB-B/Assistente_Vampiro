import type {
  CharacterCreationContextView,
  CreationOriginId,
} from "@assistente-vampiro/contracts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CharacterCreationIdentity } from "./character-creation-identity";

function context(
  id: CreationOriginId,
  kind: "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD",
): CharacterCreationContextView {
  return {
    characterId: "character-one",
    completedSteps: ["concept", "clan"],
    creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
    currentStep: "attributes",
    disciplinePolicy:
      kind === "CLAN_VAMPIRE"
        ? {
            allowedDisciplines: [],
            family: "CLAN",
            originId: id,
            selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
          }
        : kind === "CAITIFF"
          ? {
              family: "CAITIFF",
              selectionScope: "ANY_STANDARD_DISCIPLINE",
              startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO",
            }
          : {
              family: "THIN_BLOOD",
              hasIntrinsicClanDisciplines: false,
              selectionRules: "NONE_UNLESS_THIN_BLOOD_ALCHEMIST_MERIT",
            },
    identity: { concept: "Investigadora", name: "Noemi Vale" },
    origin: {
      clanId: kind === "CLAN_VAMPIRE" ? id : null,
      id,
      kind,
    },
    steps: [],
    version: 3,
  };
}

describe("CharacterCreationIdentity", () => {
  it.each([
    ["clan:toreador", "Toreador"],
    ["clan:ventrue", "Ventrue"],
  ] as const)("reutiliza símbolo e nome oficiais de %s", (id, name) => {
    render(<CharacterCreationIdentity context={context(id, "CLAN_VAMPIRE")} />);

    expect(screen.getByRole("img", { name: `Símbolo do Clã ${name}` })).toBeVisible();
    expect(screen.getByText(name)).toBeVisible();
  });

  it.each([
    ["origin:caitiff", "CAITIFF", "Caitiff"],
    ["origin:thin-blood", "THIN_BLOOD", "Sangue-Ralo"],
  ] as const)("apresenta %s somente como identidade textual", (id, kind, name) => {
    const { container } = render(
      <CharacterCreationIdentity context={context(id, kind)} />,
    );

    expect(screen.getByText(name)).toBeVisible();
    expect(screen.getByText("Origem")).toBeVisible();
    expect(container.querySelector("img")).toBeNull();
  });
});
