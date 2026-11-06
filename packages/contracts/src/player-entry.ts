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
export const CREATION_ORIGIN_IDS = [
  "clan:banu-haqim",
  "clan:brujah",
  "clan:gangrel",
  "clan:hecata",
  "clan:lasombra",
  "clan:malkavian",
  "clan:ministry",
  "clan:nosferatu",
  "clan:ravnos",
  "clan:salubri",
  "clan:toreador",
  "clan:tremere",
  "clan:tzimisce",
  "clan:ventrue",
  "origin:caitiff",
  "origin:thin-blood",
] as const;
export type CreationOriginId = (typeof CREATION_ORIGIN_IDS)[number];
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
    readonly clanId: CreationOriginId | null;
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

export type CreationStepId =
  | "concept"
  | "clan"
  | "attributes"
  | "skills"
  | "disciplines"
  | "predator"
  | "advantages"
  | "history-and-blood"
  | "review";

export type CreationStepStatus = "blocked" | "complete" | "in_progress" | "not_started";

export type CreationDisciplinePolicyView =
  | { readonly family: "ORIGIN_REQUIRED" }
  | {
      readonly allowedDisciplines: readonly CreationDisciplineId[];
      readonly family: "CLAN";
      readonly originId: CreationOriginId;
      readonly selectionRules: "NOT_FORMALIZED";
    }
  | {
      readonly family: "CAITIFF";
      readonly selectionScope: "ANY_STANDARD_DISCIPLINE";
      readonly startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO";
    }
  | {
      readonly family: "THIN_BLOOD";
      readonly hasIntrinsicClanDisciplines: false;
      readonly selectionRules: "NOT_FORMALIZED";
    };

export interface CharacterCreationContextView {
  readonly characterId: string;
  readonly completedSteps: readonly CreationStepId[];
  readonly creationProfileRevisionId: string | null;
  readonly currentStep: CreationStepId;
  readonly disciplinePolicy: CreationDisciplinePolicyView;
  readonly identity: {
    readonly concept: string | null;
    readonly name: string | null;
  };
  readonly origin: {
    readonly clanId: CreationOriginId | null;
    readonly id: CreationOriginId;
    readonly kind: Extract<CharacterKind, "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD">;
  } | null;
  readonly steps: readonly {
    readonly id: CreationStepId;
    readonly status: CreationStepStatus;
  }[];
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
  readonly creationContext: CharacterCreationContextView;
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

export interface CreationOriginSourceView {
  readonly pages: readonly number[];
  readonly sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004";
}

export type CreationDisciplineId =
  | "discipline:animalism"
  | "discipline:auspex"
  | "discipline:blood-sorcery"
  | "discipline:celerity"
  | "discipline:dominate"
  | "discipline:fortitude"
  | "discipline:obfuscate"
  | "discipline:oblivion"
  | "discipline:potence"
  | "discipline:presence"
  | "discipline:protean"
  | "discipline:thin-blood-alchemy";

export type CreationOriginMechanicsView =
  | { readonly type: "CLAN" }
  | {
      readonly type: "CAITIFF";
      readonly startingDisciplinePattern: "TWO_AND_ONE_FROM_ANY_TWO";
      readonly disciplineExperienceMultiplier: 6;
      readonly hasClanBane: false;
      readonly hasClanCompulsion: false;
      readonly startsWithSuspectFlaw: true;
      readonly statusAtCreationAllowed: false;
    }
  | {
      readonly type: "THIN_BLOOD";
      readonly bloodPotency: 0;
      readonly hasClanBane: false;
      readonly hasClanCompulsion: false;
      readonly hasIntrinsicClanDisciplines: false;
      readonly predatorTypeAtCreation: false;
      readonly thinBloodMeritFlawPairs: { readonly maximum: 3; readonly minimum: 1 };
      readonly temporaryDisciplineFromResonance: true;
    };

export interface CreationOriginOptionView {
  readonly bane: {
    readonly name: string;
    readonly severity: {
      readonly derivedFrom: "BLOOD_POTENCY";
      readonly resolutionStage: "HISTORY_AND_BLOOD";
      readonly source: {
        readonly pages: readonly [215, 216];
        readonly sourceId: "SRC-0001";
      };
    };
    readonly summary: string;
  } | null;
  readonly category: "CLAN" | "OTHER_ORIGIN";
  readonly clanId: CreationOriginId | null;
  readonly compulsion: { readonly name: string; readonly summary: string } | null;
  readonly disciplines: readonly CreationDisciplineId[];
  readonly id: CreationOriginId;
  readonly kind: Extract<CharacterKind, "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD">;
  readonly mechanics: CreationOriginMechanicsView;
  readonly sources: readonly CreationOriginSourceView[];
}

export interface CreationClanEvaluationView {
  readonly complete: boolean;
  readonly selectedOriginId: CreationOriginId | null;
}

export interface CreationClanStepView extends CharacterSheetMutationView {
  readonly creationContext: CharacterCreationContextView;
  readonly evaluation: CreationClanEvaluationView;
  readonly options: readonly CreationOriginOptionView[];
  readonly policy: {
    readonly ruleRevision: string;
  };
}

export interface UpdateCreationClanRequest {
  readonly expectedVersion: number;
  readonly originId: CreationOriginId;
}
