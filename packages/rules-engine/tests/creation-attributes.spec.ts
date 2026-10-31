import { describe, expect, it } from "vitest";

import {
  CREATION_ATTRIBUTE_IDS,
  evaluateCreationAttributes,
  type CreationAttributeValues,
} from "../src/index.js";

function values(
  overrides: Partial<Record<(typeof CREATION_ATTRIBUTE_IDS)[number], number>> = {},
): CreationAttributeValues {
  return Object.fromEntries(
    CREATION_ATTRIBUTE_IDS.map((id) => [id, overrides[id] ?? 1]),
  ) as unknown as CreationAttributeValues;
}

describe("RULE-CREATION-ATTRIBUTES-001-r1", () => {
  const complete = values({
    "attribute:charisma": 3,
    "attribute:composure": 3,
    "attribute:dexterity": 2,
    "attribute:intelligence": 2,
    "attribute:manipulation": 2,
    "attribute:resolve": 2,
    "attribute:stamina": 3,
    "attribute:strength": 4,
  });

  it("aceita a distribuição final exata", () => {
    expect(evaluateCreationAttributes(complete, "CREATION_FINALIZATION")).toEqual({
      complete: true,
      derived: { healthMax: 6, willpowerMax: 5 },
      incrementsSpent: 13,
      remainingIncrements: 0,
      violations: [],
    });
  });

  it("aceita o estado-base como etapa incompleta", () => {
    expect(evaluateCreationAttributes(values(), "CREATION_STEP")).toMatchObject({
      complete: false,
      incrementsSpent: 0,
      remainingIncrements: 13,
      violations: [],
    });
  });

  it("rejeita uma escolha incremental que não cabe na distribuição", () => {
    const result = evaluateCreationAttributes(
      values({ "attribute:strength": 4, "attribute:stamina": 4 }),
      "CREATION_STEP",
    );
    expect(result.violations).toContainEqual({
      code: "ATTRIBUTE_DISTRIBUTION_UNREACHABLE",
      path: ["attributes"],
    });
  });

  it.each([0, 5, 1.5])("rejeita valor fora da faixa inicial: %s", (value) => {
    const result = evaluateCreationAttributes(
      values({ "attribute:strength": value }),
      "CREATION_STEP",
    );
    expect(result.violations[0]).toEqual({
      code: "ATTRIBUTE_OUT_OF_RANGE",
      path: ["attributes", "attribute:strength"],
    });
  });

  it("bloqueia distribuição parcial na finalização", () => {
    expect(
      evaluateCreationAttributes(values(), "CREATION_FINALIZATION").violations,
    ).toContainEqual({
      code: "ATTRIBUTE_DISTRIBUTION_INCOMPLETE",
      path: ["attributes"],
    });
  });

  it("não reaplica o orçamento inicial em edição contínua", () => {
    expect(
      evaluateCreationAttributes(
        values({ "attribute:strength": 4, "attribute:stamina": 4 }),
        "ONGOING_EDIT",
      ).violations,
    ).toEqual([]);
  });
});
