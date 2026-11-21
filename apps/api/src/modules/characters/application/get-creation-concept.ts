import type { CreationConceptStepView } from "@assistente-vampiro/contracts";
import {
  CREATION_CONCEPT_POLICY,
  evaluateCreationConcept,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export class GetCreationConcept {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
  ) {}

  async execute(
    actor: ActorContext,
    characterId: string,
  ): Promise<CreationConceptStepView | undefined> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(characterId);
    if (
      context === undefined ||
      !this.policy.authorizeOwnerView(actor, context).allowed
    ) {
      return undefined;
    }

    const persisted = await this.writer.readCreationConcept(characterId);
    const evaluation = evaluateCreationConcept(
      {
        ...persisted.identity,
        convictionPairs: persisted.convictionPairs,
      },
      "CREATION_STEP",
    );

    return {
      characterId,
      chronicle: persisted.chronicle,
      convictionPairs: persisted.convictionPairs,
      evaluation: {
        complete: evaluation.complete,
        incompletePairPositions: evaluation.incompletePairPositions,
        missingRequiredFields: evaluation.missingRequiredFields,
      },
      identity: persisted.identity,
      policy: {
        maximumConvictionPairs: CREATION_CONCEPT_POLICY.maximumConvictionPairs,
        ruleRevision: CREATION_CONCEPT_POLICY.ruleRevision,
      },
      version: persisted.version,
    };
  }
}

export const GET_CREATION_CONCEPT = Symbol("GET_CREATION_CONCEPT");
