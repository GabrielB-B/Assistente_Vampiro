import { describe, expect, it } from "vitest";

import { countCriticals } from "../src/basic-test/count-criticals.js";
import { expectRuleError, successValue } from "./fixtures/basic-test-fixtures.js";

describe("RULE-CRIT-001-r1", () => {
  it.each([
    ["RULE-CRIT-001-T01", [8, 7, 2], [], 0, 0, 0, false],
    ["RULE-CRIT-001-T02", [10, 7, 2], [], 1, 0, 0, false],
    ["RULE-CRIT-001-T03", [10, 10, 2], [], 2, 1, 2, false],
    ["RULE-CRIT-001-T04", [10, 10, 10], [], 3, 1, 2, false],
    ["RULE-CRIT-001-T05", [10, 10, 10, 10], [], 4, 2, 4, false],
    ["RULE-CRIT-001-T06", [10, 7], [10, 2], 2, 1, 2, true],
    ["RULE-CRIT-001-T07", [7, 2], [10, 10], 2, 1, 2, true],
    ["RULE-CRIT-001-T09", [10, 10, 10], [10, 10], 5, 2, 4, true],
  ] as const)(
    "%s conta resultados 10 e pares",
    (_scenario, normal, hunger, totalTens, pairs, bonus, hasHungerTen) => {
      expect(successValue(countCriticals(normal, hunger))).toMatchObject({
        totalTenCount: totalTens,
        criticalPairCount: pairs,
        criticalBonusSuccesses: bonus,
        hasHungerTen,
      });
    },
  );

  it("RULE-CRIT-001-T08 rejeita face fora do intervalo", () => {
    expectRuleError(countCriticals([10, 0], []), "InvalidDiceFace", "OUT_OF_RANGE");
  });
});
