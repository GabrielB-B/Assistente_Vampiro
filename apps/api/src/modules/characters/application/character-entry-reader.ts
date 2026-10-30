import type {
  CharacterAccessMode,
  CharacterEntrySummaryView,
  CharacterSheetView,
} from "@assistente-vampiro/contracts";

import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";

export interface CharacterAccessCandidate {
  readonly chronicleId: string;
  readonly context: CharacterAccessContext;
}

export interface AuthorizedCharacterReference {
  readonly accessMode: CharacterAccessMode;
  readonly characterId: string;
  readonly chronicleId: string;
}

export interface CharacterEntryProjection {
  readonly actorDisplayName: string;
  readonly characters: readonly CharacterEntrySummaryView[];
}

export interface CharacterEntryReader {
  listAccessCandidates(accountId: string): Promise<readonly CharacterAccessCandidate[]>;
  readEntryProjection(
    accountId: string,
    references: readonly AuthorizedCharacterReference[],
  ): Promise<CharacterEntryProjection | undefined>;
  readSheet(
    reference: AuthorizedCharacterReference,
  ): Promise<CharacterSheetView | undefined>;
}

export const CHARACTER_ENTRY_READER = Symbol("CHARACTER_ENTRY_READER");
