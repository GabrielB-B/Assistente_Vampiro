import { describe, expect, it } from "vitest";

import { classifyMessyCritical } from "../src/basic-test/classify-messy-critical.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

describe("RULE-MESSY-001-r1", () => {
  it.each([
    ["RULE-MESSY-001-T01", 1],
    ["RULE-MESSY-001-T02", 2],
    ["RULE-MESSY-001-T07", 1],
  ] as const)(
    "%s classifica vitória crítica com 10 de Fome",
    (_scenario, hungerTenCount) => {
      expect(
        successValue(
          classifyMessyCritical({
            outcome: "VICTORY",
            isCriticalVictory: true,
            criticalPairCount: 1,
            hungerTenCount,
          }),
        ),
      ).toMatchObject({
        specialResult: "MESSY_CRITICAL",
        narratorDecisionRequired: true,
      });
    },
  );

  it("RULE-MESSY-001-T03 mantém vitória crítica só com dados normais", () => {
    expect(
      successValue(
        classifyMessyCritical({
          outcome: "VICTORY",
          isCriticalVictory: true,
          criticalPairCount: 1,
          hungerTenCount: 0,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-MESSY-001-T04 não classifica um 10 de Fome sem par", () => {
    expect(
      successValue(
        classifyMessyCritical({
          outcome: "VICTORY",
          isCriticalVictory: false,
          criticalPairCount: 0,
          hungerTenCount: 1,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-MESSY-001-T05 não classifica uma falha com par", () => {
    expect(
      successValue(
        classifyMessyCritical({
          outcome: "FAILURE",
          isCriticalVictory: false,
          criticalPairCount: 1,
          hungerTenCount: 1,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-MESSY-001-T06 não usa resultado 1 de Fome nessa classificação", () => {
    expect(
      successValue(
        classifyMessyCritical({
          outcome: "VICTORY",
          isCriticalVictory: false,
          criticalPairCount: 0,
          hungerTenCount: 0,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-MESSY-001-T08 mantém vitória crítica sem Dados de Fome", () => {
    expect(
      successValue(
        classifyMessyCritical({
          outcome: "VICTORY",
          isCriticalVictory: true,
          criticalPairCount: 1,
          hungerTenCount: 0,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-MESSY-001-T09 rejeita vitória crítica sem par", () => {
    expectRuleError(
      classifyMessyCritical({
        outcome: "VICTORY",
        isCriticalVictory: true,
        criticalPairCount: 0,
        hungerTenCount: 1,
      }),
      "InvalidSpecialResultInput",
      "CRITICAL_VICTORY_WITHOUT_PAIR",
    );
  });
});
