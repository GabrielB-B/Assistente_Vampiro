import type {
  CharacterCreationContextView,
  CreationOriginId,
  CreationStepId,
} from "@assistente-vampiro/contracts";
import {
  CREATION_ATTRIBUTE_IDS,
  evaluateCreationAttributes,
  evaluateCreationConcept,
  evaluateCreationProgress,
  evaluateCreationSkills,
  evaluateCreationDisciplines,
  resolveCreationDisciplinePolicy,
  projectCreationDisciplinePolicy,
  type CreationAttributeValues,
} from "@assistente-vampiro/rules-engine";

import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export type PersistedCharacterCreationContext = Awaited<
  ReturnType<CharacterSheetWriter["readCreationContext"]>
>;

export function selectedCreationOrigin(
  clanId: CreationOriginId | null,
  kind: string | null,
): CreationOriginId | null {
  if (clanId !== null) return clanId;
  if (kind === "CAITIFF") return "origin:caitiff";
  if (kind === "THIN_BLOOD") return "origin:thin-blood";
  return null;
}

function hasText(value: string | null): boolean {
  return value !== null && value.trim().length > 0;
}

export function projectCharacterCreationContext(
  persisted: PersistedCharacterCreationContext,
  characterId: string,
  currentStep: CreationStepId,
): CharacterCreationContextView {
  const attributes = Object.fromEntries(
    CREATION_ATTRIBUTE_IDS.map((id) => [id, persisted.attributes[id] ?? 1]),
  ) as CreationAttributeValues;
  const attributeEvaluation = evaluateCreationAttributes(attributes, "CREATION_STEP");
  const conceptEvaluation = evaluateCreationConcept(
    { ...persisted.identity, convictionPairs: persisted.convictionPairs },
    "CREATION_STEP",
  );
  const originId = selectedCreationOrigin(persisted.clanId, persisted.kind);
  const skillEvaluation = evaluateCreationSkills(
    persisted.skills ?? {},
    persisted.skillMethodId ?? null,
    persisted.specialties ?? [],
    "CREATION_STEP",
  );
  const disciplineEvaluation =
    originId === null
      ? null
      : evaluateCreationDisciplines(
          {
            disciplines: persisted.disciplines ?? [],
            powers: persisted.disciplinePowers ?? [],
          },
          resolveCreationDisciplinePolicy(originId),
        );
  const steps = evaluateCreationProgress({
    attributesComplete: attributeEvaluation.complete,
    attributesStarted: attributeEvaluation.incrementsSpent > 0,
    clanComplete: originId !== null,
    conceptComplete: conceptEvaluation.complete,
    conceptStarted:
      Object.values(persisted.identity).some(hasText) ||
      persisted.convictionPairs.length > 0,
    skillsComplete: skillEvaluation.complete,
    skillsStarted:
      (persisted.skillMethodId ?? null) !== null || skillEvaluation.pointsAllocated > 0,
    disciplinesComplete: disciplineEvaluation?.complete ?? false,
    disciplinesStarted:
      (persisted.disciplines ?? []).some((item) => item.rating > 0) ||
      (persisted.disciplinePowers ?? []).length > 0,
  });
  const origin =
    originId === null ||
    !["CAITIFF", "CLAN_VAMPIRE", "THIN_BLOOD"].includes(persisted.kind ?? "")
      ? null
      : {
          clanId: persisted.clanId,
          id: originId,
          kind: persisted.kind as "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD",
        };
  return {
    characterId,
    completedSteps: steps
      .filter((step) => step.status === "complete")
      .map((step) => step.id),
    creationProfileRevisionId: persisted.creationProfileRevisionId,
    currentStep,
    disciplinePolicy: projectCreationDisciplinePolicy(originId),
    identity: {
      concept: hasText(persisted.identity.concept) ? persisted.identity.concept : null,
      name: hasText(persisted.identity.name) ? persisted.identity.name : null,
    },
    origin,
    steps,
    version: persisted.version,
  };
}
