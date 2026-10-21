import { describe, expect, it } from "vitest";

import { countCriticals } from "../src/basic-test/count-criticals.js";
import { resolveResult } from "../src/basic-test/resolve-result.js";
import type { D10Face } from "../src/index.js";
import { successValue } from "./fixtures/basic-test-fixtures.js";

describe("invariantes do resultado", () => {
  it("classifica cada combinação como vitória ou falha e soma o bônus uma vez", () => {
    for (let first = 1; first <= 10; first += 1) {
      for (let second = 1; second <= 10; second += 1) {
        for (let difficulty = 1; difficulty <= 5; difficulty += 1) {
          const faces = [first, second] as D10Face[];
          const critical = successValue(countCriticals(faces, []));
          const result = successValue(resolveResult(faces, [], difficulty, critical));
          const baseSuccesses = faces.filter((face) => face >= 6).length;

          expect(["VICTORY", "FAILURE"]).toContain(result.outcome);
          expect(result.successes.totalSuccesses).toBe(
            baseSuccesses + critical.criticalBonusSuccesses,
          );
          expect(result.outcome === "VICTORY").toBe(
            result.successes.totalSuccesses >= difficulty,
          );
        }
      }
    }
  });
});
