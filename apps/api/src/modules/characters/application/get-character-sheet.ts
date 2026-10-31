import type { CharacterSheetDocumentView } from "@assistente-vampiro/contracts";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type {
  AuthorizedCharacterReference,
  CharacterEntryReader,
} from "./character-entry-reader.js";

export interface GetCharacterSheetQuery {
  readonly characterId: string;
  readonly chronicleId?: string;
}

export class GetCharacterSheet {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly entryReader: CharacterEntryReader,
  ) {}

  async execute(
    actor: ActorContext,
    query: GetCharacterSheetQuery,
  ): Promise<CharacterSheetDocumentView | undefined> {
    const context =
      query.chronicleId === undefined
        ? await this.accessContextReader.readCharacterOwnerAccess(query.characterId)
        : await this.accessContextReader.readCharacterAccess(
            actor.accountId,
            query.characterId,
            query.chronicleId,
          );

    if (context === undefined) {
      return undefined;
    }

    let reference: AuthorizedCharacterReference | undefined;
    if (this.policy.authorizeOwnerView(actor, context).allowed) {
      reference = {
        accessMode: "OWNER",
        characterId: query.characterId,
        ...(query.chronicleId === undefined ? {} : { chronicleId: query.chronicleId }),
      };
    } else if (this.policy.authorizeStorytellerView(actor, context).allowed) {
      if (query.chronicleId !== undefined) {
        reference = {
          accessMode: "STORYTELLER",
          characterId: query.characterId,
          chronicleId: query.chronicleId,
        };
      }
    }

    return reference === undefined ? undefined : this.entryReader.readSheet(reference);
  }
}

export const GET_CHARACTER_SHEET = Symbol("GET_CHARACTER_SHEET");
