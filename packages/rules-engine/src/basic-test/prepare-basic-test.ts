import { succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import { resolveRuleSetProfile } from "../rule-set/resolve-profile.js";
import { PREPARATION_RULE_REVISIONS } from "../rule-set/v5-core-companion-pg-2023-r1.js";
import { allocateHunger } from "./allocate-hunger.js";
import { buildPool } from "./build-pool.js";
import type { BasicTestPreparation, PrepareBasicTestInput } from "./types.js";
import { validateDifficulty } from "./validate-difficulty.js";

export function prepareBasicTest(
  input: PrepareBasicTestInput,
): RuleEngineResult<BasicTestPreparation> {
  const profile = resolveRuleSetProfile(input.ruleSetProfileRevisionId);
  if (!profile.ok) return profile;

  const pool = buildPool(input.components);
  if (!pool.ok) return pool;

  const hunger = allocateHunger(pool.value.preparedPoolSize, input.hunger);
  if (!hunger.ok) return hunger;

  const difficulty = validateDifficulty(input.difficulty);
  if (!difficulty.ok) return difficulty;

  return succeed({
    ...profile.value,
    pool: pool.value,
    hunger: hunger.value,
    difficulty: difficulty.value,
    appliedRuleRevisions: PREPARATION_RULE_REVISIONS,
  });
}
