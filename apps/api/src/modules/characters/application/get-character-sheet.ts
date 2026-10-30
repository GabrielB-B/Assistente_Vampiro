import type { CharacterSheetView } from "@assistente-vampiro/contracts";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type {
  AuthorizedCharacterReference,
  CharacterEntryReader,
} from "./character-entry-reader.js";

export interface GetCharacterSheetQuery {
  readonly characterId: string;
  readonly chronicleId: string;
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
  ): Promise<CharacterSheetView | undefined> {
    const context = await this.accessContextReader.readCharacterAccess(
      actor.accountId,
      query.characterId,
      query.chronicleId,
    );

    if (context === undefined) {
      return undefined;
    }

    let reference: AuthorizedCharacterReference | undefined;
    if (this.policy.authorizePlayerControl(actor, context).allowed) {
      reference = { accessMode: "OWNER", ...query };
    } else if (this.policy.authorizeStorytellerView(actor, context).allowed) {
      reference = { accessMode: "STORYTELLER", ...query };
    }

    return reference === undefined ? undefined : this.entryReader.readSheet(reference);
  }
}

export const GET_CHARACTER_SHEET = Symbol("GET_CHARACTER_SHEET");
