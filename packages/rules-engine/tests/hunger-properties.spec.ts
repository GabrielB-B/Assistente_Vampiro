import { describe, expect, it } from "vitest";

import { allocateHunger } from "../src/basic-test/allocate-hunger.js";
import { successValue } from "./fixtures/basic-test-fixtures.js";

describe("invariantes da participação da Fome", () => {
  it("preserva o total e limita Dados de Fome", () => {
    for (let pool = 1; pool <= 20; pool += 1) {
      for (let level = 0; level <= 5; level += 1) {
        const allocation = successValue(
          allocateHunger(pool, { participation: "APPLIES", level }),
        );
        expect(allocation.normalDiceCount + allocation.hungerDiceCount).toBe(pool);
        expect(allocation.hungerDiceCount).toBeLessThanOrEqual(level);
        expect(allocation.hungerDiceCount).toBeLessThanOrEqual(pool);
      }
    }
  });
});
