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

export interface CharacterEntrySummaryView {
  readonly accessMode: CharacterAccessMode;
  readonly characterId: string;
  readonly characterName: string;
  readonly characterState: CharacterState;
  readonly chronicleId: string;
  readonly chronicleTitle: string;
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
    readonly concept: string | null;
    readonly hunger: number | null;
    readonly id: string;
    readonly kind: CharacterKind;
    readonly name: string;
    readonly state: CharacterState;
    readonly version: number;
  };
  readonly chronicle: {
    readonly description: string | null;
    readonly id: string;
    readonly title: string;
  };
  readonly ruleSetProfileRevisionId: string | null;
  readonly scene: {
    readonly id: string;
    readonly publishedDescription: string | null;
    readonly title: string;
    readonly version: number;
  } | null;
  readonly session: {
    readonly id: string;
    readonly state: "active" | "cancelled" | "ended" | "scheduled";
    readonly version: number;
  } | null;
  readonly traits: readonly CharacterTraitView[];
}
