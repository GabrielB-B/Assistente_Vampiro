import type { CreationAttributesStepView } from "@assistente-vampiro/contracts";
import {
  CREATION_ATTRIBUTE_IDS,
  CREATION_ATTRIBUTES_POLICY,
  evaluateCreationAttributes,
  type CreationAttributeValues,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import { projectCharacterCreationContext } from "./character-creation-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export class GetCreationAttributes {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
  ) {}

  async execute(
    actor: ActorContext,
    characterId: string,
  ): Promise<CreationAttributesStepView | undefined> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(characterId);
    if (
      context === undefined ||
      !this.policy.authorizeOwnerView(actor, context).allowed
    ) {
      return undefined;
    }
    const persisted = await this.writer.readCreationContext(characterId);
    const attributes = Object.fromEntries(
      CREATION_ATTRIBUTE_IDS.map((id) => [id, persisted.attributes[id] ?? 1]),
    ) as CreationAttributeValues;
    const evaluation = evaluateCreationAttributes(attributes, "CREATION_STEP");
    return {
      attributes,
      characterId,
      creationContext: projectCharacterCreationContext(
        persisted,
        characterId,
        "attributes",
      ),
      evaluation: {
        complete: evaluation.complete,
        healthMax: evaluation.derived.healthMax,
        incrementsSpent: evaluation.incrementsSpent,
        remainingIncrements: evaluation.remainingIncrements,
        willpowerMax: evaluation.derived.willpowerMax,
      },
      policy: CREATION_ATTRIBUTES_POLICY,
      version: persisted.version,
    };
  }
}

export const GET_CREATION_ATTRIBUTES = Symbol("GET_CREATION_ATTRIBUTES");
