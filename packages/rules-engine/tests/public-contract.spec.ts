import { describe, expect, it } from "vitest";

import * as rulesEngine from "../src/index.js";
import { prepareBasicTest } from "../src/index.js";
import {
  component,
  expectRuleError,
  successValue,
} from "./fixtures/basic-test-fixtures.js";

describe("contrato público do Rules Engine", () => {
  it("expõe somente operações e identidades versionadas", () => {
    expect(Object.keys(rulesEngine).sort()).toEqual(
      [
        "APPLIED_RULE_REVISIONS",
        "AUTOMATIC_SPECIALTY_SKILL_IDS",
        "CREATION_ATTRIBUTES_POLICY",
        "CREATION_ATTRIBUTE_IDS",
        "CREATION_CLAN_POLICY",
        "CREATION_CONCEPT_POLICY",
        "CREATION_DISCIPLINES_POLICY_REVISION",
        "CREATION_ORIGIN_CATALOG",
        "CREATION_RULE_REVISIONS",
        "CREATION_SKILLS_POLICY",
        "CREATION_SKILL_CATALOG",
        "CREATION_SKILL_IDS",
        "CREATION_SKILL_METHODS",
        "CREATION_STEP_IDS",
        "DISCIPLINE_CATALOG",
        "DISCIPLINE_CATALOG_REVISION",
        "DISCIPLINE_STRUCTURAL_MAXIMUM",
        "EVALUATOR_REVISION",
        "PREPARATION_RULE_REVISIONS",
        "RULE_SET_PROFILE_ID",
        "RULE_SET_PROFILE_REVISION_ID",
        "characterKindForOrigin",
        "determineCreationOriginChangeImpact",
        "eligibleDisciplinePowers",
        "evaluateBasicTest",
        "evaluateCreationAttributes",
        "evaluateCreationClan",
        "evaluateCreationConcept",
        "evaluateCreationDisciplines",
        "evaluateCreationProgress",
        "evaluateCreationSkills",
        "prepareBasicTest",
        "projectCreationDisciplinePolicy",
        "resolveCreationDisciplinePolicy",
        "resolveCreationOrigin",
      ].sort(),
    );
  });

  it("rejeita revisão de perfil não suportada", () => {
    expectRuleError(
      prepareBasicTest({
        ruleSetProfileRevisionId: "perfil-inexistente-r1",
        components: [component(3)],
        hunger: { participation: "APPLIES", level: 1 },
        difficulty: 2,
      }),
      "UnsupportedRuleSetProfile",
      "PROFILE_REVISION_UNSUPPORTED",
    );
  });

  it("devolve as revisões sob autoridade do pacote", () => {
    const preparation = successValue(
      prepareBasicTest({
        ruleSetProfileRevisionId: "v5-core-companion-pg-2023-r1",
        components: [component(3)],
        hunger: { participation: "APPLIES", level: 1 },
        difficulty: 2,
      }),
    );

    expect(preparation.appliedRuleRevisions).toEqual([
      "RULE-ROLL-001-r1",
      "RULE-HUNGER-001-r1",
      "RULE-DIFF-001-r1",
    ]);
  });
});
