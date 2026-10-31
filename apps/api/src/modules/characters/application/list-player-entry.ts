import type { PlayerEntryView } from "@assistente-vampiro/contracts";

import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type {
  AuthorizedCharacterReference,
  CharacterAccessCandidate,
  CharacterEntryReader,
} from "./character-entry-reader.js";

function authorizeCandidate(
  actor: ActorContext,
  candidate: CharacterAccessCandidate,
  policy: CharacterAccessPolicy,
): AuthorizedCharacterReference | undefined {
  const ownerDecision = policy.authorizeOwnerView(actor, candidate.context);
  if (ownerDecision.allowed) {
    return {
      accessMode: "OWNER",
      characterId: candidate.context.character.characterId,
      ...(candidate.chronicleId === undefined
        ? {}
        : { chronicleId: candidate.chronicleId }),
    };
  }

  const storytellerDecision = policy.authorizeStorytellerView(actor, candidate.context);
  if (storytellerDecision.allowed && candidate.chronicleId !== undefined) {
    return {
      accessMode: "STORYTELLER",
      characterId: candidate.context.character.characterId,
      chronicleId: candidate.chronicleId,
    };
  }

  return undefined;
}

export class ListPlayerEntry {
  private readonly policy = new CharacterAccessPolicy();

  constructor(private readonly reader: CharacterEntryReader) {}

  async execute(actor: ActorContext): Promise<PlayerEntryView | undefined> {
    const candidates = await this.reader.listAccessCandidates(actor.accountId);
    const references = candidates.flatMap((candidate) => {
      const authorized = authorizeCandidate(actor, candidate, this.policy);
      return authorized === undefined ? [] : [authorized];
    });
    const projection = await this.reader.readEntryProjection(actor.accountId, references);

    if (projection === undefined) {
      return undefined;
    }

    return {
      actor: {
        displayName: projection.actorDisplayName,
        identityAlias: actor.identityAlias,
      },
      characters: projection.characters,
    };
  }
}

export const LIST_PLAYER_ENTRY = Symbol("LIST_PLAYER_ENTRY");
