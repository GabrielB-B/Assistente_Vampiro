import { describe, expect, it } from "vitest";

import { countCriticals } from "../src/basic-test/count-criticals.js";
import { resolveResult } from "../src/basic-test/resolve-result.js";
import type { CriticalSummary, D10Face } from "../src/basic-test/types.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

function resolve(
  normal: readonly D10Face[],
  hunger: readonly D10Face[],
  difficulty: number,
) {
  const critical = successValue(countCriticals(normal, hunger));
  return successValue(resolveResult(normal, hunger, difficulty, critical));
}

describe("RULE-RESULT-001-r1", () => {
  it("RULE-RESULT-001-T01 trata igualdade como vitória de margem zero", () => {
    expect(resolve([6, 7, 4], [], 2)).toMatchObject({
      outcome: "VICTORY",
      margin: 0,
      successes: { totalSuccesses: 2 },
    });
  });

  it("RULE-RESULT-001-T02 torna falha com sucesso elegível para custo", () => {
    expect(resolve([6, 4, 3], [], 2)).toMatchObject({
      outcome: "FAILURE",
      winAtCostEligible: true,
      successes: { totalSuccesses: 1 },
    });
  });

  it("RULE-RESULT-001-T03 identifica Falha Total", () => {
    expect(resolve([5, 4, 1], [], 1)).toMatchObject({
      outcome: "FAILURE",
      isTotalFailure: true,
      successes: { totalSuccesses: 0 },
    });
  });

  it("RULE-RESULT-001-T04 soma o bônus antes da comparação", () => {
    expect(resolve([10, 10, 4], [], 4)).toMatchObject({
      outcome: "VICTORY",
      margin: 0,
      isCriticalVictory: true,
      successes: { totalSuccesses: 4 },
    });
  });

  it("RULE-RESULT-001-T05 não declara vitória crítica quando o total é insuficiente", () => {
    expect(resolve([10, 10, 4], [], 5)).toMatchObject({
      outcome: "FAILURE",
      isCriticalVictory: false,
      successes: { totalSuccesses: 4 },
    });
  });

  it("RULE-RESULT-001-T06 conta sucessos normais e de Fome pelo mesmo limite", () => {
    expect(resolve([8, 2], [7, 3], 2)).toMatchObject({
      outcome: "VICTORY",
      successes: { normalBaseSuccesses: 1, hungerBaseSuccesses: 1 },
    });
  });

  it("RULE-RESULT-001-T07 preserva falha com sucesso para classificação posterior", () => {
    expect(resolve([8, 2], [1, 3], 3)).toMatchObject({
      outcome: "FAILURE",
      isTotalFailure: false,
      winAtCostEligible: true,
      successes: { totalSuccesses: 1 },
    });
  });

  it("RULE-RESULT-001-T08 aceita par formado entre dado normal e de Fome", () => {
    expect(resolve([10, 7], [10, 2], 3)).toMatchObject({
      outcome: "VICTORY",
      isCriticalVictory: true,
      successes: { totalSuccesses: 5 },
    });
  });

  it("RULE-RESULT-001-T09 rejeita resumo crítico incompatível", () => {
    const correct = successValue(countCriticals([10, 10], []));
    const inconsistent: CriticalSummary = { ...correct, criticalBonusSuccesses: 0 };
    expectRuleError(
      resolveResult([10, 10], [], 3, inconsistent),
      "InvalidCriticalSummary",
      "BONUS_MISMATCH",
    );
  });
});
