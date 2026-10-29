import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type {
  CharacterGatewayItem,
  CharacterGatewayRepository,
} from "./character-gateway-repository.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";

export interface CharacterGatewayList {
  readonly characters: readonly CharacterGatewayItem[];
}

export interface CharacterSelection {
  readonly activeCharacter: CharacterGatewayItem;
  readonly nextPath: "/boa-noite";
}

export class CharacterGatewayService {
  private readonly accessPolicy = new CharacterAccessPolicy();

  constructor(
    private readonly repository: CharacterGatewayRepository,
    private readonly accessContextReader: AccessContextReader,
  ) {}

  async list(actor: ActorContext): Promise<CharacterGatewayList> {
    return { characters: await this.repository.listAuthorized(actor.accountId) };
  }

  async select(
    actor: ActorContext,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterSelection> {
    const context = await this.accessContextReader.readCharacterAccess(
      actor.accountId,
      characterId,
      chronicleId,
    );

    if (context === undefined) {
      throw new CharacterNotAvailableError();
    }

    const decision = this.accessPolicy.authorizePlayerControl(actor, context);
    if (!decision.allowed) {
      throw new CharacterNotAvailableError();
    }

    const activeCharacter = await this.repository.findAuthorized(
      actor.accountId,
      characterId,
      chronicleId,
    );
    if (activeCharacter === undefined) {
      throw new CharacterNotAvailableError();
    }

    return { activeCharacter, nextPath: "/boa-noite" };
  }
}
