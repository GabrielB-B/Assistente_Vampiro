import type {
  CreationConceptPairView,
  CreationConceptStepView,
} from "@assistente-vampiro/contracts";
import {
  CREATION_CONCEPT_POLICY,
  evaluateCreationConcept,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";

export interface UpdateCreationConceptCommand {
  readonly characterId: string;
  readonly convictionPairs: readonly Omit<CreationConceptPairView, "position">[];
  readonly correlationId: string;
  readonly expectedVersion: number;
  readonly identity: CreationConceptStepView["identity"];
}

function nullableText(value: string | null): string | null {
  const normalized = value?.trim() ?? "";
  return normalized.length === 0 ? null : normalized;
}

export class UpdateCreationConcept {
  private readonly policy = new CharacterAccessPolicy();

  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    actor: ActorContext,
    command: UpdateCreationConceptCommand,
  ): Promise<CreationConceptStepView> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (
      context === undefined ||
      !this.policy.authorizeOwnerView(actor, context).allowed
    ) {
      throw new CharacterNotAvailableError();
    }

    const persisted = await this.writer.readCreationConcept(command.characterId);
    const identity = {
      ambition: nullableText(command.identity.ambition),
      concept: nullableText(command.identity.concept),
      desire: nullableText(command.identity.desire),
      name: command.identity.name.trim(),
      sire: nullableText(command.identity.sire),
    };
    const convictionPairs = command.convictionPairs
      .map((pair) => ({
        conviction: nullableText(pair.conviction),
        touchstone: nullableText(pair.touchstone),
      }))
      .filter((pair) => pair.conviction !== null || pair.touchstone !== null);
    const evaluation = evaluateCreationConcept(
      { ...identity, convictionPairs },
      "CREATION_STEP",
    );
    if (evaluation.violations.length > 0) {
      throw new InvalidCharacterCreationError(evaluation.violations);
    }

    const result = await this.writer.updateCreationConcept({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: command.characterId,
      convictionPairs,
      correlationId: command.correlationId,
      expectedVersion: command.expectedVersion,
      identity,
    });
    if (result.status === "version-conflict") {
      throw new CharacterVersionConflictError();
    }

    return {
      characterId: result.characterId,
      chronicle: persisted.chronicle,
      convictionPairs: convictionPairs.map((pair, position) => ({
        ...pair,
        position,
      })),
      evaluation: {
        complete: evaluation.complete,
        incompletePairPositions: evaluation.incompletePairPositions,
        missingRequiredFields: evaluation.missingRequiredFields,
      },
      identity,
      policy: {
        maximumConvictionPairs: CREATION_CONCEPT_POLICY.maximumConvictionPairs,
        ruleRevision: CREATION_CONCEPT_POLICY.ruleRevision,
      },
      version: result.version,
    };
  }
}

export const UPDATE_CREATION_CONCEPT = Symbol("UPDATE_CREATION_CONCEPT");
