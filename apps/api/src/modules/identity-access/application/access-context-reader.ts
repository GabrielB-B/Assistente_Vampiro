import type { CharacterAccessContext } from "./authorization-context.js";

export interface AccessContextReader {
  readCharacterAccess(
    accountId: string,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterAccessContext | undefined>;
}

export const ACCESS_CONTEXT_READER = Symbol("ACCESS_CONTEXT_READER");
