export const CREATION_ATTRIBUTE_IDS = [
  "attribute:strength",
  "attribute:dexterity",
  "attribute:stamina",
  "attribute:charisma",
  "attribute:manipulation",
  "attribute:composure",
  "attribute:intelligence",
  "attribute:wits",
  "attribute:resolve",
] as const;
export const CREATION_ATTRIBUTES_POLICY = {
  maximum: 4,
  minimum: 1,
  ratingCounts: [
    { count: 1, rating: 4 },
    { count: 3, rating: 3 },
    { count: 4, rating: 2 },
    { count: 1, rating: 1 },
  ],
  ruleRevision: "RULE-CREATION-ATTRIBUTES-001-r1",
  totalIncrements: 13,
} as const;

export type CreationAttributeId = (typeof CREATION_ATTRIBUTE_IDS)[number];
export type CreationValidationContext =
  "CHRONICLE_BINDING" | "CREATION_FINALIZATION" | "CREATION_STEP" | "ONGOING_EDIT";

export interface CreationAttributeViolation {
  readonly code:
    | "ATTRIBUTE_DISTRIBUTION_INCOMPLETE"
    | "ATTRIBUTE_DISTRIBUTION_UNREACHABLE"
    | "ATTRIBUTE_OUT_OF_RANGE";
  readonly path: readonly ["attributes", CreationAttributeId] | readonly ["attributes"];
}

export interface CreationAttributesEvaluation {
  readonly complete: boolean;
  readonly derived: {
    readonly healthMax: number;
    readonly willpowerMax: number;
  };
  readonly incrementsSpent: number;
  readonly remainingIncrements: number;
  readonly violations: readonly CreationAttributeViolation[];
}

export type CreationAttributeValues = Readonly<Record<CreationAttributeId, number>>;

const finalHistogram: Readonly<Record<number, number>> = { 1: 1, 2: 4, 3: 3, 4: 1 };

function histogram(values: readonly number[]): Readonly<Record<number, number>> {
  return values.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

export function evaluateCreationAttributes(
  attributes: CreationAttributeValues,
  context: CreationValidationContext,
): CreationAttributesEvaluation {
  const violations: CreationAttributeViolation[] = [];
  const values = CREATION_ATTRIBUTE_IDS.map((id) => {
    const value = attributes[id];
    if (!Number.isInteger(value) || value < 1 || value > 4) {
      violations.push({
        code: "ATTRIBUTE_OUT_OF_RANGE",
        path: ["attributes", id],
      });
    }
    return value;
  });
  const validValues = values.filter(
    (value) => Number.isInteger(value) && value >= 1 && value <= 4,
  );
  const incrementsSpent = validValues.reduce((total, value) => total + value - 1, 0);
  const counts = histogram(validValues);
  const complete =
    violations.length === 0 &&
    Object.entries(finalHistogram).every(
      ([value, expected]) => counts[Number(value)] === expected,
    );

  if (context === "CREATION_STEP") {
    const isReachablePrefix =
      incrementsSpent <= CREATION_ATTRIBUTES_POLICY.totalIncrements &&
      (counts[4] ?? 0) <= 1 &&
      validValues.filter((value) => value >= 3).length <= 4 &&
      validValues.filter((value) => value >= 2).length <= 8;
    if (violations.length === 0 && !isReachablePrefix) {
      violations.push({
        code: "ATTRIBUTE_DISTRIBUTION_UNREACHABLE",
        path: ["attributes"],
      });
    }
  } else if (context === "CREATION_FINALIZATION" && !complete) {
    violations.push({
      code: "ATTRIBUTE_DISTRIBUTION_INCOMPLETE",
      path: ["attributes"],
    });
  }

  return {
    complete,
    derived: {
      healthMax: attributes["attribute:stamina"] + 3,
      willpowerMax: attributes["attribute:composure"] + attributes["attribute:resolve"],
    },
    incrementsSpent,
    remainingIncrements: Math.max(
      0,
      CREATION_ATTRIBUTES_POLICY.totalIncrements - incrementsSpent,
    ),
    violations,
  };
}
