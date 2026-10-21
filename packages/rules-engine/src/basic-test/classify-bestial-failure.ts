import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { BasicOutcome, NarratorDecision, SpecialResult } from "./types.js";

type BestialFailureInput = {
  readonly outcome: BasicOutcome;
  readonly hungerOneCount: number;
  readonly isTotalFailure: boolean;
  readonly winAtCostEligible: boolean;
};

export type BestialFailureClassification = {
  readonly specialResult: Extract<SpecialResult, "BESTIAL_FAILURE" | "NONE">;
  readonly coexistsWithTotalFailure: boolean;
  readonly winAtCostEligible: boolean;
  readonly narratorDecisionRequired: boolean;
  readonly narratorDecision: NarratorDecision | null;
};

export function classifyBestialFailure(
  input: BestialFailureInput,
): RuleEngineResult<BestialFailureClassification> {
  if (input.outcome === "VICTORY" && input.isTotalFailure) {
    return fail({
      code: "InvalidSpecialResultInput",
      reason: "TOTAL_FAILURE_WITH_VICTORY",
      path: ["isTotalFailure"],
    });
  }

  const isBestialFailure = input.outcome === "FAILURE" && input.hungerOneCount > 0;

  if (!isBestialFailure) {
    return succeed({
      specialResult: "NONE",
      coexistsWithTotalFailure: false,
      winAtCostEligible: input.winAtCostEligible,
      narratorDecisionRequired: false,
      narratorDecision: null,
    });
  }

  return succeed({
    specialResult: "BESTIAL_FAILURE",
    coexistsWithTotalFailure: input.isTotalFailure,
    winAtCostEligible: input.winAtCostEligible,
    narratorDecisionRequired: true,
    narratorDecision: {
      kind: "BESTIAL_FAILURE_CONSEQUENCE",
      causedByRuleRevisionId: "RULE-BESTIAL-001-r1",
    },
  });
}
