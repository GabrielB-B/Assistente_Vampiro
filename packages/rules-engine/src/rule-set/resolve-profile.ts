import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import {
  RULE_SET_PROFILE_ID,
  RULE_SET_PROFILE_REVISION_ID,
} from "./v5-core-companion-pg-2023-r1.js";

type ResolvedRuleSetProfile = {
  readonly ruleSetProfileId: typeof RULE_SET_PROFILE_ID;
  readonly ruleSetProfileRevisionId: typeof RULE_SET_PROFILE_REVISION_ID;
};

export function resolveRuleSetProfile(
  revisionId: string,
): RuleEngineResult<ResolvedRuleSetProfile> {
  if (revisionId !== RULE_SET_PROFILE_REVISION_ID) {
    return fail({
      code: "UnsupportedRuleSetProfile",
      reason: "PROFILE_REVISION_UNSUPPORTED",
      path: ["ruleSetProfileRevisionId"],
    });
  }

  return succeed({
    ruleSetProfileId: RULE_SET_PROFILE_ID,
    ruleSetProfileRevisionId: RULE_SET_PROFILE_REVISION_ID,
  });
}
