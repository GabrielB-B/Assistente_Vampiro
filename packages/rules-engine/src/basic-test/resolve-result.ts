import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { BasicOutcome, CriticalSummary, D10Face, SuccessSummary } from "./types.js";

export type ResolvedBasicResult = {
  readonly successes: SuccessSummary;
  readonly outcome: BasicOutcome;
  readonly margin: number | null;
  readonly isCriticalVictory: boolean;
  readonly isTotalFailure: boolean;
  readonly winAtCostEligible: boolean;
};

function countBaseSuccesses(faces: readonly D10Face[]): number {
  return faces.filter((face) => face >= 6).length;
}

export function resolveResult(
  normalFaces: readonly D10Face[],
  hungerFaces: readonly D10Face[],
  difficulty: number,
  critical: CriticalSummary,
): RuleEngineResult<ResolvedBasicResult> {
  const totalTenCount = [...normalFaces, ...hungerFaces].filter(
    (face) => face === 10,
  ).length;
  const expectedPairCount = Math.floor(totalTenCount / 2);
  const expectedBonus = expectedPairCount * 2;

  if (critical.criticalPairCount !== expectedPairCount) {
    return fail({
      code: "InvalidCriticalSummary",
      reason: "PAIR_COUNT_MISMATCH",
      path: ["critical", "criticalPairCount"],
    });
  }

  if (critical.criticalBonusSuccesses !== expectedBonus) {
    return fail({
      code: "InvalidCriticalSummary",
      reason: "BONUS_MISMATCH",
      path: ["critical", "criticalBonusSuccesses"],
    });
  }

  const normalBaseSuccesses = countBaseSuccesses(normalFaces);
  const hungerBaseSuccesses = countBaseSuccesses(hungerFaces);
  const baseSuccesses = normalBaseSuccesses + hungerBaseSuccesses;
  const totalSuccesses = baseSuccesses + critical.criticalBonusSuccesses;
  const outcome: BasicOutcome = totalSuccesses >= difficulty ? "VICTORY" : "FAILURE";
  const isVictory = outcome === "VICTORY";

  return succeed({
    successes: {
      normalBaseSuccesses,
      hungerBaseSuccesses,
      baseSuccesses,
      criticalBonusSuccesses: critical.criticalBonusSuccesses,
      totalSuccesses,
    },
    outcome,
    margin: isVictory ? totalSuccesses - difficulty : null,
    isCriticalVictory: isVictory && critical.criticalPairCount > 0,
    isTotalFailure: !isVictory && totalSuccesses === 0,
    winAtCostEligible: !isVictory && totalSuccesses > 0,
  });
}
