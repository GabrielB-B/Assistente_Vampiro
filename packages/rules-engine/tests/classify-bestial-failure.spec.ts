import { describe, expect, it } from "vitest";

import { classifyBestialFailure } from "../src/basic-test/classify-bestial-failure.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

describe("RULE-BESTIAL-001-r1", () => {
  it("RULE-BESTIAL-001-T01 permite coexistência com Falha Total", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "FAILURE",
          hungerOneCount: 1,
          isTotalFailure: true,
          winAtCostEligible: false,
        }),
      ),
    ).toMatchObject({ specialResult: "BESTIAL_FAILURE", coexistsWithTotalFailure: true });
  });

  it("RULE-BESTIAL-001-T02 classifica falha com sucessos e preserva custo elegível", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "FAILURE",
          hungerOneCount: 1,
          isTotalFailure: false,
          winAtCostEligible: true,
        }),
      ),
    ).toMatchObject({
      specialResult: "BESTIAL_FAILURE",
      coexistsWithTotalFailure: false,
      winAtCostEligible: true,
    });
  });

  it("RULE-BESTIAL-001-T03 não classifica uma vitória", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "VICTORY",
          hungerOneCount: 1,
          isTotalFailure: false,
          winAtCostEligible: false,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-BESTIAL-001-T04 ignora resultado 1 que não seja de Fome", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "FAILURE",
          hungerOneCount: 0,
          isTotalFailure: true,
          winAtCostEligible: false,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-BESTIAL-001-T05 mantém falha comum sem resultado 1 de Fome", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "FAILURE",
          hungerOneCount: 0,
          isTotalFailure: false,
          winAtCostEligible: true,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-BESTIAL-001-T06 produz uma única classificação com vários resultados 1", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "FAILURE",
          hungerOneCount: 2,
          isTotalFailure: true,
          winAtCostEligible: false,
        }),
      ).specialResult,
    ).toBe("BESTIAL_FAILURE");
  });

  it("RULE-BESTIAL-001-T07 nunca classifica uma vitória crítica como Falha Bestial", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "VICTORY",
          hungerOneCount: 1,
          isTotalFailure: false,
          winAtCostEligible: false,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-BESTIAL-001-T08 classifica a nova tentativa apenas pelo resultado recebido", () => {
    expect(
      successValue(
        classifyBestialFailure({
          outcome: "VICTORY",
          hungerOneCount: 1,
          isTotalFailure: false,
          winAtCostEligible: false,
        }),
      ).specialResult,
    ).toBe("NONE");
  });

  it("RULE-BESTIAL-001-T09 rejeita vitória marcada como Falha Total", () => {
    expectRuleError(
      classifyBestialFailure({
        outcome: "VICTORY",
        hungerOneCount: 0,
        isTotalFailure: true,
        winAtCostEligible: false,
      }),
      "InvalidSpecialResultInput",
      "TOTAL_FAILURE_WITH_VICTORY",
    );
  });
});
