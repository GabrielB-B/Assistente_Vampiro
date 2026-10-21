import { describe, expect, it } from "vitest";

import { allocateHunger } from "../src/basic-test/allocate-hunger.js";
import type { HungerInput } from "../src/index.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

describe("RULE-HUNGER-001-r1", () => {
  it("RULE-HUNGER-001-T01 substitui dois dos seis dados", () => {
    expect(
      successValue(allocateHunger(6, { participation: "APPLIES", level: 2 })),
    ).toMatchObject({
      normalDiceCount: 4,
      hungerDiceCount: 2,
    });
  });

  it("RULE-HUNGER-001-T02 limita a Fome ao tamanho da parada", () => {
    expect(
      successValue(allocateHunger(3, { participation: "APPLIES", level: 5 })),
    ).toMatchObject({
      normalDiceCount: 0,
      hungerDiceCount: 3,
    });
  });

  it("RULE-HUNGER-001-T03 mantém todos os dados normais com Fome zero", () => {
    expect(
      successValue(allocateHunger(5, { participation: "APPLIES", level: 0 })),
    ).toMatchObject({
      normalDiceCount: 5,
      hungerDiceCount: 0,
    });
  });

  it("RULE-HUNGER-001-T04 substitui uma parada mínima", () => {
    expect(
      successValue(allocateHunger(1, { participation: "APPLIES", level: 1 })),
    ).toMatchObject({
      normalDiceCount: 0,
      hungerDiceCount: 1,
    });
  });

  it("RULE-HUNGER-001-T05 exclui Fome em Humanidade", () => {
    expect(
      successValue(
        allocateHunger(4, { participation: "EXCLUDED", level: 3, reason: "HUMANITY" }),
      ),
    ).toMatchObject({
      normalDiceCount: 4,
      hungerDiceCount: 0,
      exclusionReason: "HUMANITY",
    });
  });

  it("RULE-HUNGER-001-T06 exclui Fome em Checagem de Sangue", () => {
    expect(
      successValue(
        allocateHunger(1, { participation: "EXCLUDED", level: 5, reason: "ROUSE_CHECK" }),
      ),
    ).toMatchObject({
      normalDiceCount: 1,
      hungerDiceCount: 0,
      exclusionReason: "ROUSE_CHECK",
    });
  });

  it("RULE-HUNGER-001-T07 exclui Fome em rolagem de Força de Vontade", () => {
    expect(
      successValue(
        allocateHunger(5, { participation: "EXCLUDED", level: 2, reason: "WILLPOWER" }),
      ),
    ).toMatchObject({
      normalDiceCount: 5,
      hungerDiceCount: 0,
      exclusionReason: "WILLPOWER",
    });
  });

  it("RULE-HUNGER-001-T08 rejeita Fome negativa", () => {
    expectRuleError(
      allocateHunger(3, { participation: "APPLIES", level: -1 }),
      "InvalidHungerAllocation",
      "HUNGER_OUT_OF_RANGE",
    );
  });

  it("RULE-HUNGER-001-T09 rejeita Fome acima de cinco", () => {
    expectRuleError(
      allocateHunger(3, { participation: "APPLIES", level: 6 }),
      "InvalidHungerAllocation",
      "HUNGER_OUT_OF_RANGE",
    );
  });

  it("RULE-HUNGER-001-T10 rejeita exclusão sem motivo", () => {
    const invalid = { participation: "EXCLUDED", level: 2 } as HungerInput;
    expectRuleError(
      allocateHunger(3, invalid),
      "InvalidHungerAllocation",
      "EXCLUSION_REASON_REQUIRED",
    );
  });

  it("RULE-HUNGER-001-T11 rejeita parada zero", () => {
    expectRuleError(
      allocateHunger(0, { participation: "APPLIES", level: 0 }),
      "InvalidHungerAllocation",
      "BASE_POOL_OUT_OF_RANGE",
    );
  });
});
