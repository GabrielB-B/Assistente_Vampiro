import { describe, expect, it } from "vitest";

import { buildPool } from "../src/basic-test/build-pool.js";
import { component, successValue } from "./fixtures/basic-test-fixtures.js";

describe("invariantes da parada", () => {
  it("a ordem dos componentes não altera o total", () => {
    for (let first = 0; first <= 8; first += 1) {
      for (let second = 0; second <= 8; second += 1) {
        const direct = successValue(
          buildPool([component(first), component(second, "SKILL")]),
        );
        const reversed = successValue(
          buildPool([component(second, "SKILL"), component(first)]),
        );
        expect(direct.preparedPoolSize).toBe(reversed.preparedPoolSize);
      }
    }
  });

  it("preserva paradas acima de dez", () => {
    for (let value = 11; value <= 30; value += 1) {
      expect(successValue(buildPool([component(value)])).preparedPoolSize).toBe(value);
    }
  });
});
