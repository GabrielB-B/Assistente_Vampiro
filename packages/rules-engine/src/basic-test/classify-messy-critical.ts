import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { BasicOutcome, NarratorDecision, SpecialResult } from "./types.js";

type MessyCriticalInput = {
  readonly outcome: BasicOutcome;
  readonly isCriticalVictory: boolean;
  readonly criticalPairCount: number;
  readonly hungerTenCount: number;
};

export type MessyCriticalClassification = {
  readonly specialResult: Extract<SpecialResult, "MESSY_CRITICAL" | "NONE">;
  readonly narratorDecisionRequired: boolean;
  readonly narratorDecision: NarratorDecision | null;
};

export function classifyMessyCritical(
  input: MessyCriticalInput,
): RuleEngineResult<MessyCriticalClassification> {
  if (input.isCriticalVictory && input.criticalPairCount < 1) {
    return fail({
      code: "InvalidSpecialResultInput",
      reason: "CRITICAL_VICTORY_WITHOUT_PAIR",
      path: ["critical", "criticalPairCount"],
    });
  }

  const isMessyCritical =
    input.outcome === "VICTORY" &&
    input.isCriticalVictory &&
    input.criticalPairCount > 0 &&
    input.hungerTenCount > 0;

  if (!isMessyCritical) {
    return succeed({
      specialResult: "NONE",
      narratorDecisionRequired: false,
      narratorDecision: null,
    });
  }

  return succeed({
    specialResult: "MESSY_CRITICAL",
    narratorDecisionRequired: true,
    narratorDecision: {
      kind: "MESSY_CRITICAL_CONSEQUENCE",
      causedByRuleRevisionId: "RULE-MESSY-001-r1",
    },
  });
}
