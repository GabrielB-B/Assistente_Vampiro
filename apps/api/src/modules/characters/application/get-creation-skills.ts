import type { CreationSkillsStepView } from "@assistente-vampiro/contracts";
import {
  CREATION_SKILL_CATALOG,
  CREATION_SKILL_IDS,
  CREATION_SKILLS_POLICY,
  evaluateCreationSkills,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import { projectCharacterCreationContext } from "./character-creation-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export function projectCreationSkillsStep(
  persisted: Awaited<ReturnType<CharacterSheetWriter["readCreationContext"]>>,
  characterId: string,
): CreationSkillsStepView {
  const persistedSkills = persisted.skills ?? {};
  const specialties = persisted.specialties ?? [];
  const methodId = persisted.skillMethodId ?? null;
  const skills = Object.fromEntries(
    CREATION_SKILL_IDS.map((id) => [id, persistedSkills[id] ?? 0]),
  ) as CreationSkillsStepView["skills"];
  return {
    catalog: CREATION_SKILL_CATALOG,
    characterId,
    creationContext: projectCharacterCreationContext(persisted, characterId, "skills"),
    evaluation: evaluateCreationSkills(skills, methodId, specialties, "CREATION_STEP"),
    methodId,
    policy: CREATION_SKILLS_POLICY,
    skills,
    specialties,
    version: persisted.version,
  };
}

export class GetCreationSkills {
  private readonly policy = new CharacterAccessPolicy();
  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
  ) {}
  async execute(
    actor: ActorContext,
    characterId: string,
  ): Promise<CreationSkillsStepView | undefined> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(characterId);
    if (context === undefined || !this.policy.authorizeOwnerView(actor, context).allowed)
      return undefined;
    return projectCreationSkillsStep(
      await this.writer.readCreationContext(characterId),
      characterId,
    );
  }
}

export const GET_CREATION_SKILLS = Symbol("GET_CREATION_SKILLS");
