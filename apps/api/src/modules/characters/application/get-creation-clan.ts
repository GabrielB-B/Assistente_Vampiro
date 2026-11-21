import type { CreationClanStepView } from "@assistente-vampiro/contracts";
import {
  CREATION_CLAN_POLICY,
  CREATION_ORIGIN_CATALOG,
  evaluateCreationClan,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import {
  projectCharacterCreationContext,
  selectedCreationOrigin,
} from "./character-creation-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export class GetCreationClan {
  private readonly accessPolicy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
  ) {}

  async execute(
    actor: ActorContext,
    characterId: string,
  ): Promise<CreationClanStepView | undefined> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(characterId);
    if (
      context === undefined ||
      !this.accessPolicy.authorizeOwnerView(actor, context).allowed
    ) {
      return undefined;
    }
    const persisted = await this.writer.readCreationContext(characterId);
    const evaluation = evaluateCreationClan(
      selectedCreationOrigin(persisted.clanId, persisted.kind),
    );
    return {
      characterId,
      creationContext: projectCharacterCreationContext(persisted, characterId, "clan"),
      evaluation,
      options: CREATION_ORIGIN_CATALOG,
      policy: CREATION_CLAN_POLICY,
      version: persisted.version,
    };
  }
}

export const GET_CREATION_CLAN = Symbol("GET_CREATION_CLAN");
