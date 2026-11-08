import type {
  CreationSkillId,
  CreationSkillMethodId,
  CreationSkillsStepView,
  CreationSpecialtyOrigin,
} from "@assistente-vampiro/contracts";
import {
  CREATION_SKILL_IDS,
  evaluateCreationSkills,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { projectCreationSkillsStep } from "./get-creation-skills.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";

interface BaseCommand {
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
}
export interface UpdateCreationSkillsCommand extends BaseCommand {
  readonly methodId?: CreationSkillMethodId;
  readonly skills: Partial<Record<CreationSkillId, number>>;
}
export interface CreateCreationSpecialtyCommand extends BaseCommand {
  readonly label: string;
  readonly origin: CreationSpecialtyOrigin;
  readonly skillId: CreationSkillId;
}
export interface UpdateCreationSpecialtyCommand extends BaseCommand {
  readonly label: string;
  readonly specialtyId: string;
}
export interface DeleteCreationSpecialtyCommand extends BaseCommand {
  readonly specialtyId: string;
}

export class UpdateCreationSkills {
  private readonly policy = new CharacterAccessPolicy();
  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  execute(actor: ActorContext, command: UpdateCreationSkillsCommand) {
    return this.mutate(actor, command, (persisted) => ({
      methodId: command.methodId ?? persisted.skillMethodId ?? null,
      skills: { ...(persisted.skills ?? {}), ...command.skills },
      specialties: persisted.specialties ?? [],
      allowUnreachable:
        command.methodId !== undefined && Object.keys(command.skills).length === 0,
    }));
  }

  createSpecialty(actor: ActorContext, command: CreateCreationSpecialtyCommand) {
    return this.mutate(actor, command, (persisted) => ({
      methodId: persisted.skillMethodId ?? null,
      skills: persisted.skills ?? {},
      specialties: [
        ...(persisted.specialties ?? []),
        {
          id: this.idGenerator.next(),
          label: command.label.trim(),
          origin: command.origin,
          skillId: command.skillId,
        },
      ],
    }));
  }

  updateSpecialty(actor: ActorContext, command: UpdateCreationSpecialtyCommand) {
    return this.mutate(actor, command, (persisted) => {
      const specialties = persisted.specialties ?? [];
      if (!specialties.some((item) => item.id === command.specialtyId))
        throw new CharacterNotAvailableError();
      return {
        methodId: persisted.skillMethodId ?? null,
        skills: persisted.skills ?? {},
        specialties: specialties.map((item) =>
          item.id === command.specialtyId
            ? { ...item, label: command.label.trim() }
            : item,
        ),
      };
    });
  }

  deleteSpecialty(actor: ActorContext, command: DeleteCreationSpecialtyCommand) {
    return this.mutate(actor, command, (persisted) => {
      const specialties = persisted.specialties ?? [];
      if (!specialties.some((item) => item.id === command.specialtyId))
        throw new CharacterNotAvailableError();
      return {
        methodId: persisted.skillMethodId ?? null,
        skills: persisted.skills ?? {},
        specialties: specialties.filter((item) => item.id !== command.specialtyId),
      };
    });
  }

  private async mutate(
    actor: ActorContext,
    command: BaseCommand,
    project: (
      persisted: Awaited<ReturnType<CharacterSheetWriter["readCreationContext"]>>,
    ) => {
      readonly allowUnreachable?: boolean;
      readonly methodId: CreationSkillMethodId | null;
      readonly skills: Readonly<Partial<Record<CreationSkillId, number>>>;
      readonly specialties: CreationSkillsStepView["specialties"];
    },
  ): Promise<CreationSkillsStepView> {
    const access = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (access === undefined || !this.policy.authorizeOwnerView(actor, access).allowed)
      throw new CharacterNotAvailableError();
    const persisted = await this.writer.readCreationContext(command.characterId);
    const next = project(persisted);
    if (next.methodId === null)
      throw new InvalidCharacterCreationError([
        { code: "SKILL_METHOD_REQUIRED", path: ["methodId"] },
      ]);
    const skills = Object.fromEntries(
      CREATION_SKILL_IDS.map((id) => [id, next.skills[id] ?? 0]),
    ) as Record<CreationSkillId, number>;
    const evaluation = evaluateCreationSkills(
      skills,
      next.methodId,
      next.specialties,
      "CREATION_STEP",
    );
    const blocking = evaluation.violations.filter(
      (violation) =>
        !(
          next.allowUnreachable === true &&
          violation.code === "SKILL_DISTRIBUTION_UNREACHABLE"
        ),
    );
    if (blocking.length > 0) throw new InvalidCharacterCreationError(blocking);
    const result = await this.writer.updateCreationSkills!({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: command.characterId,
      correlationId: command.correlationId,
      expectedVersion: command.expectedVersion,
      methodId: next.methodId,
      skills,
      specialties: next.specialties,
    });
    if (result.status === "version-conflict") throw new CharacterVersionConflictError();
    return projectCreationSkillsStep(
      await this.writer.readCreationContext(command.characterId),
      command.characterId,
    );
  }
}

export const UPDATE_CREATION_SKILLS = Symbol("UPDATE_CREATION_SKILLS");
