import { expect } from "vitest";

import type {
  EvaluateBasicTestInput,
  PoolComponent,
  RuleEngineResult,
} from "../../src/index.js";

export function component(
  effectiveValue: number,
  kind: PoolComponent["kind"] = "ATTRIBUTE",
  componentId = `${kind.toLowerCase()}-${effectiveValue}`,
): PoolComponent {
  return {
    componentId,
    kind,
    effectiveValue,
    reason: "Componente autorizado para o cenário",
  };
}

export function basicTestInput(options: {
  readonly normal: readonly number[];
  readonly hunger?: readonly number[];
  readonly difficulty: number;
}): EvaluateBasicTestInput {
  const hungerFaces = options.hunger ?? [];
  const totalDice = options.normal.length + hungerFaces.length;

  return {
    ruleSetProfileRevisionId: "v5-core-companion-pg-2023-r1",
    components: [component(totalDice)],
    hunger: { participation: "APPLIES", level: hungerFaces.length },
    difficulty: options.difficulty,
    faces: {
      normal: options.normal,
      hunger: hungerFaces,
    },
  };
}

export function successValue<T>(result: RuleEngineResult<T>): T {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(
      `Esperava sucesso, mas recebeu ${result.error.code}:${result.error.reason}`,
    );
  }
  return result.value;
}

export function expectRuleError(
  result: RuleEngineResult<unknown>,
  code: string,
  reason?: string,
): void {
  expect(result.ok).toBe(false);
  if (result.ok) throw new Error("Esperava erro de regra, mas recebeu sucesso");
  expect(result.error.code).toBe(code);
  if (reason !== undefined) expect(result.error.reason).toBe(reason);
}
