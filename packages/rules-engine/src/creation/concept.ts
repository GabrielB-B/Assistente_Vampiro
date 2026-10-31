import type { CreationValidationContext } from "./attributes.js";

export const CREATION_CONCEPT_POLICY = {
  maximumConvictionPairs: 3,
  requiredFields: ["name", "concept", "ambition"],
  ruleRevision: "RULE-CREATION-CONCEPT-001-r1",
} as const;

export interface CreationConceptPair {
  readonly conviction: string | null;
  readonly touchstone: string | null;
}

export interface CreationConceptValues {
  readonly ambition: string | null;
  readonly concept: string | null;
  readonly convictionPairs: readonly CreationConceptPair[];
  readonly desire: string | null;
  readonly name: string;
  readonly sire: string | null;
}

export interface CreationConceptEvaluation {
  readonly complete: boolean;
  readonly incompletePairPositions: readonly number[];
  readonly missingRequiredFields: readonly (typeof CREATION_CONCEPT_POLICY.requiredFields)[number][];
  readonly violations: readonly {
    readonly code: "CONVICTION_PAIR_LIMIT_EXCEEDED";
    readonly path: readonly ["convictionPairs"];
  }[];
}

function hasText(value: string | null): boolean {
  return value !== null && value.trim().length > 0;
}

export function evaluateCreationConcept(
  values: CreationConceptValues,
  context: CreationValidationContext,
): CreationConceptEvaluation {
  const missingRequiredFields = CREATION_CONCEPT_POLICY.requiredFields.filter(
    (field) => !hasText(values[field]),
  );
  const incompletePairPositions = values.convictionPairs.flatMap((pair, index) =>
    hasText(pair.conviction) === hasText(pair.touchstone) ? [] : [index],
  );
  const violations =
    values.convictionPairs.length > CREATION_CONCEPT_POLICY.maximumConvictionPairs
      ? [
          {
            code: "CONVICTION_PAIR_LIMIT_EXCEEDED" as const,
            path: ["convictionPairs"] as const,
          },
        ]
      : [];
  const complete =
    missingRequiredFields.length === 0 &&
    incompletePairPositions.length === 0 &&
    violations.length === 0;

  return {
    complete:
      context === "CREATION_FINALIZATION" || context === "CREATION_STEP"
        ? complete
        : violations.length === 0,
    incompletePairPositions,
    missingRequiredFields,
    violations,
  };
}
