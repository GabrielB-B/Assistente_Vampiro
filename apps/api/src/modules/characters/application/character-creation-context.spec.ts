import { describe, expect, it } from "vitest";

import {
  projectCharacterCreationContext,
  type PersistedCharacterCreationContext,
} from "./character-creation-context.js";

function persisted(
  origin: "caitiff" | "thin-blood" | "toreador",
): PersistedCharacterCreationContext {
  return {
    attributes: { "attribute:stamina": 2 },
    clanId: origin === "toreador" ? "clan:toreador" : null,
    convictionPairs: [],
    creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
    identity: {
      ambition: "Encontrar a verdade",
      concept: "Investigadora",
      desire: null,
      name: "Noemi Vale",
      sire: null,
    },
    kind:
      origin === "toreador"
        ? "CLAN_VAMPIRE"
        : origin === "caitiff"
          ? "CAITIFF"
          : "THIN_BLOOD",
    version: 7,
  };
}

describe("projectCharacterCreationContext", () => {
  it.each([
    ["toreador", "clan:toreador", "CLAN"],
    ["caitiff", "origin:caitiff", "CAITIFF"],
    ["thin-blood", "origin:thin-blood", "THIN_BLOOD"],
  ] as const)(
    "reconstrói %s exclusivamente do Character persistido",
    (origin, originId, policyFamily) => {
      const context = projectCharacterCreationContext(
        persisted(origin),
        "character-one",
        "attributes",
      );

      expect(context).toMatchObject({
        characterId: "character-one",
        currentStep: "attributes",
        disciplinePolicy: { family: policyFamily },
        identity: { concept: "Investigadora", name: "Noemi Vale" },
        origin: { id: originId },
        version: 7,
      });
      expect(context.steps).toContainEqual({
        id: "attributes",
        status: "in_progress",
      });
    },
  );
});
