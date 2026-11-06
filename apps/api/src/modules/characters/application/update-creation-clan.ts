import type {
  CreationClanStepView,
  CreationOriginId,
} from "@assistente-vampiro/contracts";
import {
  characterKindForOrigin,
  determineCreationOriginChangeImpact,
  resolveCreationOrigin,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import {
  projectCharacterCreationContext,
  selectedCreationOrigin,
} from "./character-creation-context.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import type { GetCreationClan } from "./get-creation-clan.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";

export interface UpdateCreationClanCommand {
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly originId: CreationOriginId;
}

export class UpdateCreationClan {
  private readonly accessPolicy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
    private readonly getCreationClan: GetCreationClan,
  ) {}

  async execute(
    actor: ActorContext,
    command: UpdateCreationClanCommand,
  ): Promise<CreationClanStepView> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (
      context === undefined ||
      !this.accessPolicy.authorizeOwnerView(actor, context).allowed
    ) {
      throw new CharacterNotAvailableError();
    }
    const origin = resolveCreationOrigin(command.originId);
    if (origin === undefined) {
      throw new InvalidCharacterCreationError([
        { code: "CREATION_ORIGIN_INVALID", path: ["originId"] },
      ]);
    }
    const persisted = await this.writer.readCreationContext(command.characterId);
    const creationContext = projectCharacterCreationContext(
      persisted,
      command.characterId,
      "clan",
    );
    const impact = determineCreationOriginChangeImpact(
      selectedCreationOrigin(persisted.clanId, persisted.kind),
      command.originId,
      Object.fromEntries(creationContext.steps.map((step) => [step.id, step.status])),
    );
    const result = await this.writer.updateCreationClan({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: command.characterId,
      clanId: origin.clanId,
      correlationId: command.correlationId,
      expectedVersion: command.expectedVersion,
      kind: characterKindForOrigin(command.originId),
      originId: command.originId,
      potentialImpactedSteps: impact.potentiallyAffectedSteps,
    });
    if (result.status === "version-conflict") {
      throw new CharacterVersionConflictError();
    }
    const view = await this.getCreationClan.execute(actor, command.characterId);
    if (view === undefined) throw new CharacterNotAvailableError();
    return view;
  }
}

export const UPDATE_CREATION_CLAN = Symbol("UPDATE_CREATION_CLAN");
