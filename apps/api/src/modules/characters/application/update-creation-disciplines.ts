import type {
  CharacterDisciplinePowerView,
  CreationDisciplineId,
  CreationDisciplinesStepView,
  DisciplinePowerId,
} from "@assistente-vampiro/contracts";
import {
  DISCIPLINE_CATALOG,
  evaluateCreationDisciplines,
  resolveCreationDisciplinePolicy,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import type { IdGenerator } from "../../identity-access/application/id-generator.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import { selectedCreationOrigin } from "./character-creation-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { projectCreationDisciplinesStep } from "./get-creation-disciplines.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";

export interface UpdateCreationDisciplinesCommand {
  readonly characterId: string;
  readonly confirmPowerInvalidation?: boolean;
  readonly correlationId: string;
  readonly disciplines: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly rating: number;
  }[];
  readonly expectedVersion: number;
  readonly powerIds: readonly DisciplinePowerId[];
  readonly previewOnly?: boolean;
}

const POWER_BY_ID = new Map(
  DISCIPLINE_CATALOG.flatMap((entry) => entry.powers).map((entry) => [entry.id, entry]),
);

export class UpdateCreationDisciplines {
  private readonly accessPolicy = new CharacterAccessPolicy();
  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(
    actor: ActorContext,
    command: UpdateCreationDisciplinesCommand,
  ): Promise<CreationDisciplinesStepView> {
    const access = await this.accessContextReader.readCharacterOwnerAccess(
      command.characterId,
    );
    if (
      access === undefined ||
      !this.accessPolicy.authorizeOwnerView(actor, access).allowed
    )
      throw new CharacterNotAvailableError();
    const persisted = await this.writer.readCreationContext(command.characterId);
    const originId = selectedCreationOrigin(persisted.clanId, persisted.kind);
    if (originId === null)
      throw new InvalidCharacterCreationError([
        { code: "CREATION_ORIGIN_REQUIRED", path: ["origin"] },
      ]);
    const policy = resolveCreationDisciplinePolicy(originId);
    const disciplines = policy.allowedDisciplineIds.map((disciplineId) => ({
      disciplineId,
      rating:
        command.disciplines.find((item) => item.disciplineId === disciplineId)?.rating ??
        0,
      structuralMaximum: 5 as const,
    }));
    const powers: CharacterDisciplinePowerView[] = command.powerIds.map((powerId) => {
      const catalogPower = POWER_BY_ID.get(powerId);
      if (catalogPower === undefined)
        return {
          disciplineId: "discipline:animalism",
          powerId,
          powerRuleRevisionId: "UNKNOWN",
        };
      return {
        disciplineId: catalogPower.disciplineId,
        powerId,
        powerRuleRevisionId: catalogPower.ruleRevisionId,
      };
    });
    const removedPowerIds = (persisted.disciplinePowers ?? [])
      .map((item) => item.powerId)
      .filter((id) => !command.powerIds.includes(id));
    const evaluation = evaluateCreationDisciplines({ disciplines, powers }, policy);
    if (command.previewOnly === true) {
      const currentView = projectCreationDisciplinesStep(persisted, command.characterId);
      if (currentView === undefined) throw new CharacterNotAvailableError();
      return {
        ...currentView,
        disciplines,
        evaluation,
        powers,
      };
    }
    if (removedPowerIds.length > 0 && command.confirmPowerInvalidation !== true) {
      throw new InvalidCharacterCreationError([
        {
          code: "DISCIPLINE_POWER_REMOVAL_REQUIRES_CONFIRMATION",
          path: ["powerIds", ...removedPowerIds],
        },
      ]);
    }
    if (evaluation.violations.length > 0)
      throw new InvalidCharacterCreationError(evaluation.violations);
    const result = await this.writer.updateCreationDisciplines!({
      actorAccountId: actor.accountId,
      auditEntryId: this.idGenerator.next(),
      characterId: command.characterId,
      correlationId: command.correlationId,
      disciplines,
      expectedVersion: command.expectedVersion,
      powers,
    });
    if (result.status === "version-conflict") throw new CharacterVersionConflictError();
    const view = projectCreationDisciplinesStep(
      await this.writer.readCreationContext(command.characterId),
      command.characterId,
    );
    if (view === undefined) throw new CharacterNotAvailableError();
    return view;
  }
}

export const UPDATE_CREATION_DISCIPLINES = Symbol("UPDATE_CREATION_DISCIPLINES");
