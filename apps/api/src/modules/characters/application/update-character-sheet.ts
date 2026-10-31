import type { CharacterSheetMutationView } from "@assistente-vampiro/contracts";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export interface UpdateCharacterSheetCommand {
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly identity: {
    readonly ambition?: string | null;
    readonly concept?: string | null;
    readonly desire?: string | null;
    readonly name?: string;
    readonly sire?: string | null;
  };
}

export class UpdateCharacterSheet {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    actor: ActorContext,
    command: UpdateCharacterSheetCommand,
  ): Promise<CharacterSheetMutationView> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (
      context === undefined ||
      !this.policy.authorizeOwnerView(actor, context).allowed
    ) {
      throw new CharacterNotAvailableError();
    }

    const result = await this.writer.updateIdentity({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: command.characterId,
      correlationId: command.correlationId,
      expectedVersion: command.expectedVersion,
      identity: command.identity,
    });

    if (result.status === "version-conflict") {
      throw new CharacterVersionConflictError();
    }

    return {
      characterId: result.characterId,
      version: result.version,
    };
  }
}

export const UPDATE_CHARACTER_SHEET = Symbol("UPDATE_CHARACTER_SHEET");
