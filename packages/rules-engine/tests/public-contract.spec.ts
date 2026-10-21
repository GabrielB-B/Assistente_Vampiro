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
        "EVALUATOR_REVISION",
        "PREPARATION_RULE_REVISIONS",
        "RULE_SET_PROFILE_ID",
        "RULE_SET_PROFILE_REVISION_ID",
        "evaluateBasicTest",
        "prepareBasicTest",
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
