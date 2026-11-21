import type {
  CreationAttributeId,
  CreationConceptPairView,
  CreationConceptStepView,
  CreationOriginId,
  CharacterKind,
  CreationSkillId,
  CreationSkillMethodId,
  CreationSpecialtyView,
  CharacterDisciplinePowerView,
  CharacterDisciplineView,
} from "@assistente-vampiro/contracts";

export interface UpdateCharacterIdentityCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly identity: {
    readonly ambition?: string | null;
    readonly concept?: string | null;
    readonly desire?: string | null;
    readonly name?: string;
    readonly sire?: string | null;
  };
}

export interface UpdateCreationConceptWriteCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly convictionPairs: readonly Omit<CreationConceptPairView, "position">[];
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly identity: CreationConceptStepView["identity"];
}

export type CharacterSheetWriteResult =
  | {
      readonly characterId: string;
      readonly status: "updated";
      readonly version: number;
    }
  | { readonly status: "version-conflict" };

export interface CharacterSheetWriter {
  readCreationContext(characterId: string): Promise<{
    readonly attributes: Readonly<Partial<Record<CreationAttributeId, number>>>;
    readonly clanId: CreationOriginId | null;
    readonly convictionPairs: readonly CreationConceptPairView[];
    readonly creationProfileRevisionId: string | null;
    readonly identity: CreationConceptStepView["identity"];
    readonly kind: CharacterKind | null;
    readonly skillMethodId?: CreationSkillMethodId | null;
    readonly skills?: Readonly<Partial<Record<CreationSkillId, number>>>;
    readonly specialties?: readonly CreationSpecialtyView[];
    readonly disciplines?: readonly CharacterDisciplineView[];
    readonly disciplinePowers?: readonly CharacterDisciplinePowerView[];
    readonly version: number;
  }>;
  readCreationClan(characterId: string): Promise<{
    readonly clanId: CreationOriginId | null;
    readonly kind: CharacterKind | null;
    readonly version: number;
  }>;
  readCreationConcept(characterId: string): Promise<{
    readonly chronicle: CreationConceptStepView["chronicle"];
    readonly convictionPairs: readonly CreationConceptPairView[];
    readonly identity: CreationConceptStepView["identity"];
    readonly version: number;
  }>;
  readCreationAttributes(characterId: string): Promise<{
    readonly attributes: Readonly<Partial<Record<CreationAttributeId, number>>>;
    readonly version: number;
  }>;
  startDraft(command: StartCharacterDraftWriteCommand): Promise<{
    readonly characterId: string;
    readonly created: boolean;
    readonly version: number;
  }>;
  updateCreationAttributes(
    command: UpdateCharacterAttributesCommand,
  ): Promise<CharacterSheetWriteResult>;
  updateCreationClan(
    command: UpdateCreationClanWriteCommand,
  ): Promise<CharacterSheetWriteResult>;
  updateCreationConcept(
    command: UpdateCreationConceptWriteCommand,
  ): Promise<CharacterSheetWriteResult>;
  updateCreationSkills?(
    command: UpdateCreationSkillsWriteCommand,
  ): Promise<CharacterSheetWriteResult>;
  updateCreationDisciplines?(
    command: UpdateCreationDisciplinesWriteCommand,
  ): Promise<CharacterSheetWriteResult>;
  updateIdentity(
    command: UpdateCharacterIdentityCommand,
  ): Promise<CharacterSheetWriteResult>;
}

export const CHARACTER_SHEET_WRITER = Symbol("CHARACTER_SHEET_WRITER");

export interface StartCharacterDraftWriteCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly correlationId: string;
  readonly idempotencyKey: string;
}

export interface UpdateCharacterAttributesCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly attributes: Partial<Record<CreationAttributeId, number>>;
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
}

export interface UpdateCreationClanWriteCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly clanId: CreationOriginId | null;
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly kind: Extract<CharacterKind, "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD">;
  readonly originId: CreationOriginId;
  readonly potentialImpactedSteps: readonly string[];
}

export interface UpdateCreationSkillsWriteCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly methodId: CreationSkillMethodId;
  readonly skills: Readonly<Record<CreationSkillId, number>>;
  readonly specialties: readonly CreationSpecialtyView[];
}

export interface UpdateCreationDisciplinesWriteCommand {
  readonly actorAccountId: string;
  readonly auditEntryId: string;
  readonly characterId: string;
  readonly correlationId: string;
  readonly disciplines: readonly CharacterDisciplineView[];
  readonly expectedVersion: number;
  readonly powers: readonly CharacterDisciplinePowerView[];
}
