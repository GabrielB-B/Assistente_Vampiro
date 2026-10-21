import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { HungerAllocation, HungerExclusionReason, HungerInput } from "./types.js";

const exclusionReasons = new Set<HungerExclusionReason>([
  "ROUSE_CHECK",
  "WILLPOWER",
  "HUMANITY",
]);

export function allocateHunger(
  preparedPoolSize: number,
  hunger: HungerInput,
): RuleEngineResult<HungerAllocation> {
  if (!Number.isInteger(preparedPoolSize) || preparedPoolSize < 1) {
    return fail({
      code: "InvalidHungerAllocation",
      reason: "BASE_POOL_OUT_OF_RANGE",
      path: ["pool", "preparedPoolSize"],
    });
  }

  if (!Number.isInteger(hunger.level) || hunger.level < 0 || hunger.level > 5) {
    return fail({
      code: "InvalidHungerAllocation",
      reason: "HUNGER_OUT_OF_RANGE",
      path: ["hunger", "level"],
    });
  }

  if (hunger.participation === "EXCLUDED") {
    const reason: unknown = (hunger as { readonly reason?: unknown }).reason;

    if (typeof reason !== "string" || reason === "") {
      return fail({
        code: "InvalidHungerAllocation",
        reason: "EXCLUSION_REASON_REQUIRED",
        path: ["hunger", "reason"],
      });
    }

    if (!exclusionReasons.has(reason as HungerExclusionReason)) {
      return fail({
        code: "InvalidHungerAllocation",
        reason: "EXCLUSION_REASON_UNSUPPORTED",
        path: ["hunger", "reason"],
      });
    }

    return succeed({
      level: hunger.level,
      participation: "EXCLUDED",
      exclusionReason: reason as HungerExclusionReason,
      normalDiceCount: preparedPoolSize,
      hungerDiceCount: 0,
    });
  }

  const hungerDiceCount = Math.min(preparedPoolSize, hunger.level);

  return succeed({
    level: hunger.level,
    participation: "APPLIES",
    exclusionReason: null,
    normalDiceCount: preparedPoolSize - hungerDiceCount,
    hungerDiceCount,
  });
}
