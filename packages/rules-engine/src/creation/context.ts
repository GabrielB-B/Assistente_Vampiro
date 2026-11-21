import {
  resolveCreationOrigin,
  type CreationDisciplineId,
  type CreationOriginId,
} from "./clans.js";

export const CREATION_STEP_IDS = [
  "concept",
  "clan",
  "attributes",
  "skills",
  "disciplines",
  "predator",
  "advantages",
  "history-and-blood",
  "review",
] as const;

export type CreationStepId = (typeof CREATION_STEP_IDS)[number];
export type CreationStepStatus = "blocked" | "complete" | "in_progress" | "not_started";

export type CreationDisciplinePolicyProjection =
  | { readonly family: "ORIGIN_REQUIRED" }
  | {
      readonly allowedDisciplines: readonly CreationDisciplineId[];
      readonly family: "CLAN";
      readonly originId: CreationOriginId;
      readonly selectionRules: "TWO_AND_ONE_FROM_ANY_TWO";
    }
  | {
      readonly family: "CAITIFF";
      readonly selectionScope: "ANY_STANDARD_DISCIPLINE";
      readonly startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO";
    }
  | {
      readonly family: "THIN_BLOOD";
      readonly hasIntrinsicClanDisciplines: false;
      readonly selectionRules: "NONE_UNLESS_THIN_BLOOD_ALCHEMIST_MERIT";
    };

export interface CreationProgressInput {
  readonly attributesComplete: boolean;
  readonly attributesStarted: boolean;
  readonly clanComplete: boolean;
  readonly conceptComplete: boolean;
  readonly conceptStarted: boolean;
  readonly skillsComplete?: boolean;
  readonly skillsStarted?: boolean;
  readonly disciplinesComplete?: boolean;
  readonly disciplinesStarted?: boolean;
}

export interface CreationOriginChangeImpact {
  readonly changed: boolean;
  readonly potentiallyAffectedSteps: readonly CreationStepId[];
  readonly requiresConfirmation: boolean;
  readonly stepsRequiringReview: readonly CreationStepId[];
}

export function projectCreationDisciplinePolicy(
  originId: CreationOriginId | null,
): CreationDisciplinePolicyProjection {
  if (originId === null) return { family: "ORIGIN_REQUIRED" };
  if (originId === "origin:caitiff") {
    return {
      family: "CAITIFF",
      selectionScope: "ANY_STANDARD_DISCIPLINE",
      startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO",
    };
  }
  if (originId === "origin:thin-blood") {
    return {
      family: "THIN_BLOOD",
      hasIntrinsicClanDisciplines: false,
      selectionRules: "NONE_UNLESS_THIN_BLOOD_ALCHEMIST_MERIT",
    };
  }
  const origin = resolveCreationOrigin(originId);
  if (origin === undefined || origin.kind !== "CLAN_VAMPIRE") {
    return { family: "ORIGIN_REQUIRED" };
  }
  return {
    allowedDisciplines: origin.disciplines,
    family: "CLAN",
    originId,
    selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
  };
}

export function evaluateCreationProgress(
  input: CreationProgressInput,
): readonly { readonly id: CreationStepId; readonly status: CreationStepStatus }[] {
  const conceptStatus = input.conceptComplete
    ? "complete"
    : input.conceptStarted
      ? "in_progress"
      : "not_started";
  const clanStatus = input.clanComplete ? "complete" : "not_started";
  const attributesStatus = input.attributesComplete
    ? "complete"
    : input.attributesStarted
      ? "in_progress"
      : "not_started";
  const skillsStatus = input.skillsComplete
    ? "complete"
    : input.skillsStarted
      ? "in_progress"
      : "not_started";
  const disciplinesStatus = input.disciplinesComplete
    ? "complete"
    : input.disciplinesStarted
      ? "in_progress"
      : "not_started";
  return CREATION_STEP_IDS.map((id) => ({
    id,
    status:
      id === "concept"
        ? conceptStatus
        : id === "clan"
          ? clanStatus
          : id === "attributes"
            ? attributesStatus
            : id === "skills"
              ? skillsStatus
              : id === "disciplines"
                ? disciplinesStatus
                : "not_started",
  }));
}

export function determineCreationOriginChangeImpact(
  previousOriginId: CreationOriginId | null,
  nextOriginId: CreationOriginId,
  stepStates: Readonly<Partial<Record<CreationStepId, CreationStepStatus>>>,
): CreationOriginChangeImpact {
  if (previousOriginId === nextOriginId) {
    return {
      changed: false,
      potentiallyAffectedSteps: [],
      requiresConfirmation: false,
      stepsRequiringReview: [],
    };
  }
  const potentiallyAffectedSteps = [
    "disciplines",
    "predator",
    "advantages",
    "history-and-blood",
  ] as const;
  const stepsRequiringReview = potentiallyAffectedSteps.filter((id) =>
    ["complete", "in_progress"].includes(stepStates[id] ?? "not_started"),
  );
  return {
    changed: true,
    potentiallyAffectedSteps,
    requiresConfirmation: stepsRequiringReview.length > 0,
    stepsRequiringReview,
  };
}
