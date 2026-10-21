import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import {
  POOL_COMPONENT_KINDS,
  type PoolComponent,
  type PoolExplanation,
} from "./types.js";

const componentKinds = new Set<string>(POOL_COMPONENT_KINDS);

export function buildPool(
  components: readonly PoolComponent[],
): RuleEngineResult<PoolExplanation> {
  if (components.length === 0) {
    return fail({
      code: "InvalidPoolComposition",
      reason: "COMPONENTS_REQUIRED",
      path: ["components"],
    });
  }

  for (const [index, component] of components.entries()) {
    if (
      typeof component.componentId !== "string" ||
      component.componentId.trim() === ""
    ) {
      return fail({
        code: "InvalidPoolComposition",
        reason: "COMPONENT_ID_REQUIRED",
        path: ["components", index, "componentId"],
      });
    }

    if (!componentKinds.has(component.kind)) {
      return fail({
        code: "InvalidPoolComposition",
        reason: "COMPONENT_KIND_UNSUPPORTED",
        path: ["components", index, "kind"],
      });
    }

    if (typeof component.reason !== "string" || component.reason.trim() === "") {
      return fail({
        code: "InvalidPoolComposition",
        reason: "COMPONENT_REASON_REQUIRED",
        path: ["components", index, "reason"],
      });
    }

    if (!Number.isInteger(component.effectiveValue)) {
      return fail({
        code: "InvalidPoolComponentValue",
        reason: "NOT_INTEGER",
        path: ["components", index, "effectiveValue"],
      });
    }

    if (component.effectiveValue < 0) {
      return fail({
        code: "InvalidPoolComponentValue",
        reason: "BELOW_MINIMUM",
        path: ["components", index, "effectiveValue"],
      });
    }
  }

  const appliedComponents = components.map((component) => ({ ...component }));
  const rawPoolSize = appliedComponents.reduce(
    (total, component) => total + component.effectiveValue,
    0,
  );

  return succeed({
    rawPoolSize,
    preparedPoolSize: Math.max(1, rawPoolSize),
    floorApplied: rawPoolSize === 0,
    components: appliedComponents,
  });
}
