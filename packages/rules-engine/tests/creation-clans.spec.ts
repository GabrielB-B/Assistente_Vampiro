import { describe, expect, it } from "vitest";

import {
  characterKindForOrigin,
  CREATION_CLAN_POLICY,
  CREATION_ORIGIN_CATALOG,
  evaluateCreationClan,
  resolveCreationOrigin,
} from "../src/index.js";

describe("catálogo de origem da criação V5", () => {
  it("publica 14 clãs e duas outras origens sem duplicidade", () => {
    expect(CREATION_ORIGIN_CATALOG).toHaveLength(16);
    expect(new Set(CREATION_ORIGIN_CATALOG.map((option) => option.id)).size).toBe(16);
    expect(
      CREATION_ORIGIN_CATALOG.filter((option) => option.category === "CLAN"),
    ).toHaveLength(14);
    expect(CREATION_CLAN_POLICY.ruleRevision).toBe("RULE-CREATION-CLAN-001-r1");
  });

  it("mapeia clã, Caitiff e Sangue-Ralo para capacidades distintas", () => {
    expect(characterKindForOrigin("clan:toreador")).toBe("CLAN_VAMPIRE");
    expect(characterKindForOrigin("origin:caitiff")).toBe("CAITIFF");
    expect(characterKindForOrigin("origin:thin-blood")).toBe("THIN_BLOOD");
    expect(resolveCreationOrigin("origin:caitiff")).toMatchObject({
      bane: null,
      clanId: null,
      compulsion: null,
      disciplines: [],
      mechanics: {
        disciplineExperienceMultiplier: 6,
        startsWithSuspectFlaw: true,
        type: "CAITIFF",
      },
    });
    expect(resolveCreationOrigin("origin:thin-blood")).toMatchObject({
      mechanics: {
        bloodPotency: 0,
        predatorTypeAtCreation: false,
        temporaryDisciplineFromResonance: true,
        type: "THIN_BLOOD",
      },
    });
  });

  it("só conclui a etapa com uma origem do catálogo", () => {
    expect(evaluateCreationClan(null)).toEqual({
      complete: false,
      selectedOriginId: null,
    });
    expect(evaluateCreationClan("clan:brujah")).toEqual({
      complete: true,
      selectedOriginId: "clan:brujah",
    });
  });
});
