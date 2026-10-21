import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { CriticalSummary, D10Face } from "./types.js";

export function validateDiceFaces(
  faces: readonly number[],
  group: "normal" | "hunger",
): RuleEngineResult<readonly D10Face[]> {
  for (const [index, face] of faces.entries()) {
    if (!Number.isInteger(face)) {
      return fail({
        code: "InvalidDiceFace",
        reason: "NOT_INTEGER",
        path: ["faces", group, index],
      });
    }

    if (face < 1 || face > 10) {
      return fail({
        code: "InvalidDiceFace",
        reason: "OUT_OF_RANGE",
        path: ["faces", group, index],
      });
    }
  }

  return succeed([...faces] as D10Face[]);
}

export function countCriticals(
  normalFaces: readonly number[],
  hungerFaces: readonly number[],
): RuleEngineResult<CriticalSummary> {
  const validatedNormal = validateDiceFaces(normalFaces, "normal");
  if (!validatedNormal.ok) return validatedNormal;

  const validatedHunger = validateDiceFaces(hungerFaces, "hunger");
  if (!validatedHunger.ok) return validatedHunger;

  const normalTenCount = validatedNormal.value.filter((face) => face === 10).length;
  const hungerTenCount = validatedHunger.value.filter((face) => face === 10).length;
  const totalTenCount = normalTenCount + hungerTenCount;
  const criticalPairCount = Math.floor(totalTenCount / 2);

  return succeed({
    normalTenCount,
    hungerTenCount,
    totalTenCount,
    criticalPairCount,
    criticalBonusSuccesses: criticalPairCount * 2,
    hasCriticalPair: criticalPairCount > 0,
    hasHungerTen: hungerTenCount > 0,
  });
}
