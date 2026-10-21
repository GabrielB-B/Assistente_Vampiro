export { evaluateBasicTest } from "./basic-test/evaluate-basic-test.js";
export { prepareBasicTest } from "./basic-test/prepare-basic-test.js";
export type {
  BasicOutcome,
  BasicTestPreparation,
  BasicTestResult,
  D10Face,
  DifficultyBand,
  EvaluateBasicTestInput,
  HungerExclusionReason,
  HungerInput,
  NarratorDecision,
  PoolComponent,
  PoolComponentKind,
  PrepareBasicTestInput,
  SpecialResult,
} from "./basic-test/types.js";
export type {
  RuleEngineError,
  RuleEngineErrorCode,
  RuleEngineResult,
} from "./errors/rule-engine-error.js";
export {
  APPLIED_RULE_REVISIONS,
  EVALUATOR_REVISION,
  PREPARATION_RULE_REVISIONS,
  RULE_SET_PROFILE_ID,
  RULE_SET_PROFILE_REVISION_ID,
} from "./rule-set/v5-core-companion-pg-2023-r1.js";
