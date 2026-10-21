import { describe, expect, it } from "vitest";

import { buildPool } from "../src/basic-test/build-pool.js";
import {
  component,
  expectRuleError,
  successValue,
} from "./fixtures/basic-test-fixtures.js";

describe("RULE-ROLL-001-r1", () => {
  it("RULE-ROLL-001-T01 soma Atributo 3 e Habilidade 2", () => {
    const result = successValue(buildPool([component(3), component(2, "SKILL")]));
    expect(result).toMatchObject({
      rawPoolSize: 5,
      preparedPoolSize: 5,
      floorApplied: false,
    });
  });

  it("RULE-ROLL-001-T02 aceita Habilidade zero sem penalidade", () => {
    const result = successValue(buildPool([component(4), component(0, "SKILL")]));
    expect(result.preparedPoolSize).toBe(4);
  });

  it("RULE-ROLL-001-T03 aceita um único Atributo", () => {
    expect(successValue(buildPool([component(3)])).preparedPoolSize).toBe(3);
  });

  it("RULE-ROLL-001-T04 aceita dois Atributos", () => {
    expect(successValue(buildPool([component(2), component(3)])).preparedPoolSize).toBe(
      5,
    );
  });

  it("RULE-ROLL-001-T05 aplica o piso de um dado", () => {
    const result = successValue(buildPool([component(0)]));
    expect(result).toMatchObject({
      rawPoolSize: 0,
      preparedPoolSize: 1,
      floorApplied: true,
    });
  });

  it("RULE-ROLL-001-T06 não cria teto artificial de dez dados", () => {
    expect(successValue(buildPool([component(6), component(5)])).preparedPoolSize).toBe(
      11,
    );
  });

  it("RULE-ROLL-001-T07 rejeita lista vazia", () => {
    expectRuleError(buildPool([]), "InvalidPoolComposition", "COMPONENTS_REQUIRED");
  });

  it("RULE-ROLL-001-T08 rejeita valor negativo", () => {
    expectRuleError(
      buildPool([component(-1)]),
      "InvalidPoolComponentValue",
      "BELOW_MINIMUM",
    );
  });
});
