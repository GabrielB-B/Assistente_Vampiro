export const RULE_SET_PROFILE_ID = "v5-core-companion-pg-2023" as const;
export const RULE_SET_PROFILE_REVISION_ID = "v5-core-companion-pg-2023-r1" as const;
export const EVALUATOR_REVISION = "basic-test-evaluator-r1" as const;

export const PREPARATION_RULE_REVISIONS = [
  "RULE-ROLL-001-r1",
  "RULE-HUNGER-001-r1",
  "RULE-DIFF-001-r1",
] as const;

export const APPLIED_RULE_REVISIONS = [
  ...PREPARATION_RULE_REVISIONS,
  "RULE-CRIT-001-r1",
  "RULE-RESULT-001-r1",
  "RULE-MESSY-001-r1",
  "RULE-BESTIAL-001-r1",
  "RULE-ROLLFLOW-001-r1",
] as const;

export type PreparationRuleRevisions = typeof PREPARATION_RULE_REVISIONS;
export type AppliedRuleRevisions = typeof APPLIED_RULE_REVISIONS;
