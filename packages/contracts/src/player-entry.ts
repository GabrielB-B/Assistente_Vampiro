export const ALPHA_IDENTITY_OPTIONS = [
  { alias: "player-one", label: "Jogadora Um", roleHint: "Personagem própria" },
  { alias: "storyteller-one", label: "Narradora Um", roleHint: "Visão da Narradora" },
  { alias: "player-two", label: "Jogador Dois", roleHint: "Sem personagem vinculada" },
  { alias: "outsider-one", label: "Visitante Um", roleHint: "Sem acesso à Crônica" },
] as const;

export type AlphaIdentityAlias = (typeof ALPHA_IDENTITY_OPTIONS)[number]["alias"];
export type CharacterAccessMode = "OWNER" | "STORYTELLER";
export type CharacterKind =
  "CAITIFF" | "CLAN_VAMPIRE" | "GHOUL" | "MORTAL" | "THIN_BLOOD";
export type CharacterState = "draft" | "ready" | "retired";
export type CharacterTraitKind = "ATTRIBUTE" | "SKILL";
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
export type CreationAttributeId = (typeof CREATION_ATTRIBUTE_IDS)[number];

export interface CharacterEntrySummaryView {
  readonly accessMode: CharacterAccessMode;
  readonly characterId: string;
  readonly characterName: string;
  readonly characterState: CharacterState;
  readonly chronicleId: string | null;
  readonly chronicleTitle: string | null;
  readonly concept: string | null;
}

export interface PlayerEntryView {
  readonly actor: {
    readonly displayName: string;
    readonly identityAlias: AlphaIdentityAlias;
  };
  readonly characters: readonly CharacterEntrySummaryView[];
}

export interface CharacterTraitView {
  readonly kind: CharacterTraitKind;
  readonly traitId: string;
  readonly value: number;
}

export interface CharacterSheetView {
  readonly accessMode: CharacterAccessMode;
  readonly character: {
    readonly ambition: string | null;
    readonly concept: string | null;
    readonly desire: string | null;
    readonly hunger: number | null;
    readonly id: string;
    readonly kind: CharacterKind | null;
    readonly name: string;
    readonly sire: string | null;
    readonly state: CharacterState;
    readonly version: number;
  };
  readonly convictionPairs: readonly CreationConceptPairView[];
  readonly ruleSetProfileRevisionId: string | null;
  readonly traits: readonly CharacterTraitView[];
}

export interface CharacterSheetContextView {
  readonly chronicle: {
    readonly description: string | null;
    readonly id: string;
    readonly title: string;
  } | null;
}

export interface CharacterSheetDocumentView {
  readonly context: CharacterSheetContextView;
  readonly sheet: CharacterSheetView;
}

export interface UpdateCharacterSheetRequest {
  readonly expectedVersion: number;
  readonly identity: {
    readonly ambition?: string | null;
    readonly concept?: string | null;
    readonly desire?: string | null;
    readonly name?: string;
    readonly sire?: string | null;
  };
}

export interface CharacterSheetMutationView {
  readonly characterId: string;
  readonly version: number;
}

export interface StartCharacterDraftRequest {
  readonly idempotencyKey: string;
}

export interface CharacterDraftMutationView extends CharacterSheetMutationView {
  readonly created: boolean;
}

export interface CreationConceptPairView {
  readonly conviction: string | null;
  readonly position: number;
  readonly touchstone: string | null;
}

export interface CreationConceptEvaluationView {
  readonly complete: boolean;
  readonly incompletePairPositions: readonly number[];
  readonly missingRequiredFields: readonly ("ambition" | "concept" | "name")[];
}

export interface CreationConceptStepView extends CharacterSheetMutationView {
  readonly chronicle: {
    readonly id: string;
    readonly title: string;
  } | null;
  readonly convictionPairs: readonly CreationConceptPairView[];
  readonly evaluation: CreationConceptEvaluationView;
  readonly identity: {
    readonly ambition: string | null;
    readonly concept: string | null;
    readonly desire: string | null;
    readonly name: string;
    readonly sire: string | null;
  };
  readonly policy: {
    readonly maximumConvictionPairs: number;
    readonly ruleRevision: string;
  };
}

export interface UpdateCreationConceptRequest {
  readonly convictionPairs: readonly Omit<CreationConceptPairView, "position">[];
  readonly expectedVersion: number;
  readonly identity: CreationConceptStepView["identity"];
}

export interface UpdateCreationAttributesRequest {
  readonly attributes: Partial<Record<CreationAttributeId, number>>;
  readonly expectedVersion: number;
}

export interface CreationAttributesMutationView extends CharacterSheetMutationView {
  readonly evaluation: {
    readonly complete: boolean;
    readonly healthMax: number;
    readonly incrementsSpent: number;
    readonly remainingIncrements: number;
    readonly willpowerMax: number;
  };
}

export interface CreationAttributesStepView extends CreationAttributesMutationView {
  readonly attributes: Readonly<Record<CreationAttributeId, number>>;
  readonly policy: {
    readonly maximum: number;
    readonly minimum: number;
    readonly ratingCounts: readonly {
      readonly count: number;
      readonly rating: number;
    }[];
    readonly ruleRevision: string;
    readonly totalIncrements: number;
  };
}
