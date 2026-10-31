import type {
  CreationAttributeId,
  CreationConceptPairView,
  CreationConceptStepView,
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
  updateCreationConcept(
    command: UpdateCreationConceptWriteCommand,
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
