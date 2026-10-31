import type {
  CreationAttributeId,
  CreationAttributesMutationView,
} from "@assistente-vampiro/contracts";
import {
  CREATION_ATTRIBUTE_IDS,
  evaluateCreationAttributes,
  type CreationAttributeValues,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";

export interface UpdateCreationAttributesCommand {
  readonly attributes: Partial<Record<CreationAttributeId, number>>;
  readonly characterId: string;
  readonly correlationId: string;
  readonly expectedVersion: number;
}

export class UpdateCreationAttributes {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    actor: ActorContext,
    command: UpdateCreationAttributesCommand,
  ): Promise<CreationAttributesMutationView> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (
      context === undefined ||
      !this.policy.authorizeOwnerView(actor, context).allowed
    ) {
      throw new CharacterNotAvailableError();
    }

    const persisted = await this.writer.readCreationAttributes(command.characterId);
    const values = Object.fromEntries(
      CREATION_ATTRIBUTE_IDS.map((id) => [
        id,
        command.attributes[id] ?? persisted.attributes[id] ?? 1,
      ]),
    ) as CreationAttributeValues;
    const evaluation = evaluateCreationAttributes(values, "CREATION_STEP");
    if (evaluation.violations.length > 0) {
      throw new InvalidCharacterCreationError(evaluation.violations);
    }

    const result = await this.writer.updateCreationAttributes({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      attributes: command.attributes,
      characterId: command.characterId,
      correlationId: command.correlationId,
      expectedVersion: command.expectedVersion,
    });
    if (result.status === "version-conflict") {
      throw new CharacterVersionConflictError();
    }

    return {
      characterId: result.characterId,
      evaluation: {
        complete: evaluation.complete,
        healthMax: evaluation.derived.healthMax,
        incrementsSpent: evaluation.incrementsSpent,
        remainingIncrements: evaluation.remainingIncrements,
        willpowerMax: evaluation.derived.willpowerMax,
      },
      version: result.version,
    };
  }
}

export const UPDATE_CREATION_ATTRIBUTES = Symbol("UPDATE_CREATION_ATTRIBUTES");
