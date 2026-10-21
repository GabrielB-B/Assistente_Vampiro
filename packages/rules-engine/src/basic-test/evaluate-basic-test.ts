import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import {
  APPLIED_RULE_REVISIONS,
  EVALUATOR_REVISION,
} from "../rule-set/v5-core-companion-pg-2023-r1.js";
import { classifyBestialFailure } from "./classify-bestial-failure.js";
import { classifyMessyCritical } from "./classify-messy-critical.js";
import { countCriticals, validateDiceFaces } from "./count-criticals.js";
import { prepareBasicTest } from "./prepare-basic-test.js";
import { resolveResult } from "./resolve-result.js";
import type {
  BasicTestResult,
  EvaluateBasicTestInput,
  NarratorDecision,
} from "./types.js";

function countFace(faces: readonly number[], target: number): number {
  return faces.filter((face) => face === target).length;
}

export function evaluateBasicTest(
  input: EvaluateBasicTestInput,
): RuleEngineResult<BasicTestResult> {
  const preparation = prepareBasicTest(input);
  if (!preparation.ok) return preparation;

  const normalFaces = validateDiceFaces(input.faces.normal, "normal");
  if (!normalFaces.ok) return normalFaces;

  const hungerFaces = validateDiceFaces(input.faces.hunger, "hunger");
  if (!hungerFaces.ok) return hungerFaces;

  const expectedTotal = preparation.value.pool.preparedPoolSize;
  const receivedTotal = normalFaces.value.length + hungerFaces.value.length;

  if (receivedTotal !== expectedTotal) {
    return fail({
      code: "DiceCountMismatch",
      reason: "TOTAL_COUNT_MISMATCH",
      path: ["faces"],
    });
  }

  if (normalFaces.value.length !== preparation.value.hunger.normalDiceCount) {
    return fail({
      code: "DiceCountMismatch",
      reason: "NORMAL_COUNT_MISMATCH",
      path: ["faces", "normal"],
    });
  }

  if (hungerFaces.value.length !== preparation.value.hunger.hungerDiceCount) {
    return fail({
      code: "DiceCountMismatch",
      reason: "HUNGER_COUNT_MISMATCH",
      path: ["faces", "hunger"],
    });
  }

  const critical = countCriticals(normalFaces.value, hungerFaces.value);
  if (!critical.ok) return critical;

  const result = resolveResult(
    normalFaces.value,
    hungerFaces.value,
    preparation.value.difficulty.value,
    critical.value,
  );
  if (!result.ok) return result;

  const messyCritical = classifyMessyCritical({
    outcome: result.value.outcome,
    isCriticalVictory: result.value.isCriticalVictory,
    criticalPairCount: critical.value.criticalPairCount,
    hungerTenCount: critical.value.hungerTenCount,
  });
  if (!messyCritical.ok) return messyCritical;

  const hungerOneCount = countFace(hungerFaces.value, 1);
  const bestialFailure = classifyBestialFailure({
    outcome: result.value.outcome,
    hungerOneCount,
    isTotalFailure: result.value.isTotalFailure,
    winAtCostEligible: result.value.winAtCostEligible,
  });
  if (!bestialFailure.ok) return bestialFailure;

  const narratorDecisions: NarratorDecision[] = [];
  if (messyCritical.value.narratorDecision !== null) {
    narratorDecisions.push(messyCritical.value.narratorDecision);
  }
  if (bestialFailure.value.narratorDecision !== null) {
    narratorDecisions.push(bestialFailure.value.narratorDecision);
  }

  return succeed({
    ruleSetProfileId: preparation.value.ruleSetProfileId,
    ruleSetProfileRevisionId: preparation.value.ruleSetProfileRevisionId,
    pool: preparation.value.pool,
    hunger: preparation.value.hunger,
    difficulty: preparation.value.difficulty,
    evaluatorRevision: EVALUATOR_REVISION,
    dice: {
      normalFaces: normalFaces.value,
      hungerFaces: hungerFaces.value,
      normalOneCount: countFace(normalFaces.value, 1),
      hungerOneCount,
      normalTenCount: critical.value.normalTenCount,
      hungerTenCount: critical.value.hungerTenCount,
    },
    critical: critical.value,
    successes: result.value.successes,
    outcome: result.value.outcome,
    margin: result.value.margin,
    isCriticalVictory: result.value.isCriticalVictory,
    isTotalFailure: result.value.isTotalFailure,
    coexistsWithTotalFailure: bestialFailure.value.coexistsWithTotalFailure,
    winAtCostEligible: result.value.winAtCostEligible,
    specialResult:
      messyCritical.value.specialResult !== "NONE"
        ? messyCritical.value.specialResult
        : bestialFailure.value.specialResult,
    narratorDecisions,
    appliedRuleRevisions: APPLIED_RULE_REVISIONS,
  });
}
