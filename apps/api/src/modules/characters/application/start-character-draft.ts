import type { CharacterDraftMutationView } from "@assistente-vampiro/contracts";

import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export interface StartCharacterDraftCommand {
  readonly correlationId: string;
  readonly idempotencyKey: string;
}

export class StartCharacterDraft {
  constructor(
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  execute(
    actor: ActorContext,
    command: StartCharacterDraftCommand,
  ): Promise<CharacterDraftMutationView> {
    return this.writer.startDraft({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: this.idGenerator.next(),
      correlationId: command.correlationId,
      idempotencyKey: command.idempotencyKey,
    });
  }
}

export const START_CHARACTER_DRAFT = Symbol("START_CHARACTER_DRAFT");
