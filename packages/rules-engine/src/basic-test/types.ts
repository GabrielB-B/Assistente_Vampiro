import type { RuleEngineResult } from "../errors/rule-engine-error.js";
import type {
  AppliedRuleRevisions,
  PreparationRuleRevisions,
} from "../rule-set/v5-core-companion-pg-2023-r1.js";

export const POOL_COMPONENT_KINDS = [
  "ATTRIBUTE",
  "SKILL",
  "DISCIPLINE",
  "TRACK",
  "PUBLISHED_RULE",
] as const;

export type PoolComponentKind = (typeof POOL_COMPONENT_KINDS)[number];

export type PoolComponent = {
  readonly componentId: string;
  readonly kind: PoolComponentKind;
  readonly effectiveValue: number;
  readonly reason: string;
};

export type HungerExclusionReason = "ROUSE_CHECK" | "WILLPOWER" | "HUMANITY";

export type HungerInput =
  | {
      readonly participation: "APPLIES";
      readonly level: number;
    }
  | {
      readonly participation: "EXCLUDED";
      readonly level: number;
      readonly reason: HungerExclusionReason;
    };

export type PrepareBasicTestInput = {
  readonly ruleSetProfileRevisionId: string;
  readonly components: readonly PoolComponent[];
  readonly hunger: HungerInput;
  readonly difficulty: number;
};

export type EvaluateBasicTestInput = PrepareBasicTestInput & {
  readonly faces: {
    readonly normal: readonly number[];
    readonly hunger: readonly number[];
  };
};

export type PoolExplanation = {
  readonly rawPoolSize: number;
  readonly preparedPoolSize: number;
  readonly floorApplied: boolean;
  readonly components: readonly PoolComponent[];
};

export type HungerAllocation = {
  readonly level: number;
  readonly participation: "APPLIES" | "EXCLUDED";
  readonly exclusionReason: HungerExclusionReason | null;
  readonly normalDiceCount: number;
  readonly hungerDiceCount: number;
};

export type DifficultyBand =
  | "EASY"
  | "ROUTINE"
  | "MODERATE"
  | "CHALLENGING"
  | "HARD"
  | "VERY_HARD"
  | "NEARLY_IMPOSSIBLE";

export type ValidatedDifficulty = {
  readonly value: number;
  readonly band: DifficultyBand;
};

export type BasicTestPreparation = {
  readonly ruleSetProfileId: "v5-core-companion-pg-2023";
  readonly ruleSetProfileRevisionId: "v5-core-companion-pg-2023-r1";
  readonly pool: PoolExplanation;
  readonly hunger: HungerAllocation;
  readonly difficulty: ValidatedDifficulty;
  readonly appliedRuleRevisions: PreparationRuleRevisions;
};

export type D10Face = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CriticalSummary = {
  readonly normalTenCount: number;
  readonly hungerTenCount: number;
  readonly totalTenCount: number;
  readonly criticalPairCount: number;
  readonly criticalBonusSuccesses: number;
  readonly hasCriticalPair: boolean;
  readonly hasHungerTen: boolean;
};

export type SuccessSummary = {
  readonly normalBaseSuccesses: number;
  readonly hungerBaseSuccesses: number;
  readonly baseSuccesses: number;
  readonly criticalBonusSuccesses: number;
  readonly totalSuccesses: number;
};

export type BasicOutcome = "VICTORY" | "FAILURE";
export type SpecialResult = "MESSY_CRITICAL" | "BESTIAL_FAILURE" | "NONE";

export type NarratorDecision = {
  readonly kind: "MESSY_CRITICAL_CONSEQUENCE" | "BESTIAL_FAILURE_CONSEQUENCE";
  readonly causedByRuleRevisionId: "RULE-MESSY-001-r1" | "RULE-BESTIAL-001-r1";
};

export type BasicTestResult = Omit<BasicTestPreparation, "appliedRuleRevisions"> & {
  readonly evaluatorRevision: "basic-test-evaluator-r1";
  readonly dice: {
    readonly normalFaces: readonly D10Face[];
    readonly hungerFaces: readonly D10Face[];
    readonly normalOneCount: number;
    readonly hungerOneCount: number;
    readonly normalTenCount: number;
    readonly hungerTenCount: number;
  };
  readonly critical: CriticalSummary;
  readonly successes: SuccessSummary;
  readonly outcome: BasicOutcome;
  readonly margin: number | null;
  readonly isCriticalVictory: boolean;
  readonly isTotalFailure: boolean;
  readonly coexistsWithTotalFailure: boolean;
  readonly winAtCostEligible: boolean;
  readonly specialResult: SpecialResult;
  readonly narratorDecisions: readonly NarratorDecision[];
  readonly appliedRuleRevisions: AppliedRuleRevisions;
};

export type PrepareBasicTest = (
  input: PrepareBasicTestInput,
) => RuleEngineResult<BasicTestPreparation>;

export type EvaluateBasicTest = (
  input: EvaluateBasicTestInput,
) => RuleEngineResult<BasicTestResult>;
