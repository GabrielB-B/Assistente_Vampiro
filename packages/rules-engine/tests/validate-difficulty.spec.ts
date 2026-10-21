import { describe, expect, it } from "vitest";

import { validateDifficulty } from "../src/basic-test/validate-difficulty.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

describe("RULE-DIFF-001-r1", () => {
  it.each([
    ["RULE-DIFF-001-T01", 1, "EASY"],
    ["RULE-DIFF-001-T02", 3, "MODERATE"],
    ["RULE-DIFF-001-T03", 6, "VERY_HARD"],
    ["RULE-DIFF-001-T04", 7, "NEARLY_IMPOSSIBLE"],
    ["RULE-DIFF-001-T05", 9, "NEARLY_IMPOSSIBLE"],
  ] as const)("%s classifica Dificuldade %i como %s", (_scenario, difficulty, band) => {
    expect(successValue(validateDifficulty(difficulty))).toEqual({
      value: difficulty,
      band,
    });
  });

  it.each([
    ["RULE-DIFF-001-T06", 0],
    ["RULE-DIFF-001-T07", -2],
  ] as const)("%s rejeita valor abaixo do mínimo", (_scenario, difficulty) => {
    expectRuleError(validateDifficulty(difficulty), "InvalidDifficulty", "BELOW_MINIMUM");
  });

  it("RULE-DIFF-001-T08 rejeita valor fracionário", () => {
    expectRuleError(validateDifficulty(2.5), "InvalidDifficulty", "NOT_INTEGER");
  });

  it("RULE-DIFF-001-T09 rejeita valor ausente em runtime", () => {
    expectRuleError(
      validateDifficulty(undefined as unknown as number),
      "InvalidDifficulty",
      "REQUIRED",
    );
  });
});
