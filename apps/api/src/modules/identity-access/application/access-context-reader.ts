import type { CharacterAccessContext } from "./authorization-context.js";

export interface AccessContextReader {
  readCharacterOwnerAccess(
    characterId: string,
  ): Promise<CharacterAccessContext | undefined>;
  readCharacterAccess(
    accountId: string,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterAccessContext | undefined>;
}

export const ACCESS_CONTEXT_READER = Symbol("ACCESS_CONTEXT_READER");
