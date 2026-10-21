import { describe, expect, it } from "vitest";

import { evaluateBasicTest } from "../src/index.js";
import {
  basicTestInput,
  expectRuleError,
  successValue,
} from "./fixtures/basic-test-fixtures.js";

describe("RULE-ROLLFLOW-001-r1", () => {
  it("RULE-ROLLFLOW-001-T01 resolve vitória comum com margem zero", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [7, 6, 2], difficulty: 2 })),
      ),
    ).toMatchObject({
      outcome: "VICTORY",
      margin: 0,
      specialResult: "NONE",
      successes: { totalSuccesses: 2 },
    });
  });

  it("RULE-ROLLFLOW-001-T02 resolve falha com custo elegível", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [7, 2, 2], difficulty: 2 })),
      ),
    ).toMatchObject({
      outcome: "FAILURE",
      winAtCostEligible: true,
      successes: { totalSuccesses: 1 },
    });
  });

  it("RULE-ROLLFLOW-001-T03 resolve Falha Total sem especial", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [5, 2, 1], difficulty: 1 })),
      ),
    ).toMatchObject({ isTotalFailure: true, specialResult: "NONE" });
  });

  it("RULE-ROLLFLOW-001-T04 resolve vitória crítica comum", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [10, 10, 2], difficulty: 3 })),
      ),
    ).toMatchObject({
      outcome: "VICTORY",
      margin: 1,
      isCriticalVictory: true,
      specialResult: "NONE",
      successes: { totalSuccesses: 4 },
    });
  });

  it("RULE-ROLLFLOW-001-T05 resolve Crítico Bestial com par misto", () => {
    expect(
      successValue(
        evaluateBasicTest(
          basicTestInput({ normal: [10, 2], hunger: [10], difficulty: 4 }),
        ),
      ),
    ).toMatchObject({
      outcome: "VICTORY",
      margin: 0,
      specialResult: "MESSY_CRITICAL",
      successes: { totalSuccesses: 4 },
    });
  });

  it("RULE-ROLLFLOW-001-T06 resolve Falha Bestial com sucesso", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [6, 2], hunger: [1], difficulty: 2 })),
      ),
    ).toMatchObject({
      outcome: "FAILURE",
      specialResult: "BESTIAL_FAILURE",
      winAtCostEligible: true,
      successes: { totalSuccesses: 1 },
    });
  });

  it("RULE-ROLLFLOW-001-T07 preserva Falha Total e Falha Bestial", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [2], hunger: [1], difficulty: 1 })),
      ),
    ).toMatchObject({
      isTotalFailure: true,
      coexistsWithTotalFailure: true,
      specialResult: "BESTIAL_FAILURE",
    });
  });

  it("RULE-ROLLFLOW-001-T08 não classifica vitória com resultado 1 de Fome", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [6], hunger: [1], difficulty: 1 })),
      ),
    ).toMatchObject({ outcome: "VICTORY", specialResult: "NONE" });
  });

  it("RULE-ROLLFLOW-001-T09 não classifica um 10 de Fome sem par", () => {
    expect(
      successValue(
        evaluateBasicTest(basicTestInput({ normal: [6], hunger: [10], difficulty: 2 })),
      ),
    ).toMatchObject({
      outcome: "VICTORY",
      isCriticalVictory: false,
      specialResult: "NONE",
    });
  });

  it("RULE-ROLLFLOW-001-T10 falha com par de Fome sem criar Crítico Bestial", () => {
    expect(
      successValue(
        evaluateBasicTest(
          basicTestInput({ normal: [10], hunger: [10, 1], difficulty: 5 }),
        ),
      ),
    ).toMatchObject({
      outcome: "FAILURE",
      isCriticalVictory: false,
      specialResult: "BESTIAL_FAILURE",
      successes: { totalSuccesses: 4 },
    });
  });

  it("RULE-ROLLFLOW-001-T11 rejeita quantidade incompleta de faces", () => {
    const input = basicTestInput({ normal: [7, 6, 2], difficulty: 2 });
    expectRuleError(
      evaluateBasicTest({ ...input, faces: { normal: [7, 6], hunger: [] } }),
      "DiceCountMismatch",
      "TOTAL_COUNT_MISMATCH",
    );
  });

  it("RULE-ROLLFLOW-001-T12 produz saída idêntica para a mesma entrada", () => {
    const input = basicTestInput({ normal: [10, 2], hunger: [10], difficulty: 4 });
    expect(evaluateBasicTest(input)).toEqual(evaluateBasicTest(input));
  });
});
