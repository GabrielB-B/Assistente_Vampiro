import type { CreationDisciplinesStepView } from "@assistente-vampiro/contracts";
import {
  DISCIPLINE_CATALOG,
  evaluateCreationDisciplines,
  resolveCreationDisciplinePolicy,
} from "@assistente-vampiro/rules-engine";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import { CharacterAccessPolicy } from "../../identity-access/application/character-access-policy.js";
import {
  projectCharacterCreationContext,
  selectedCreationOrigin,
} from "./character-creation-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";

export function projectCreationDisciplinesStep(
  persisted: Awaited<ReturnType<CharacterSheetWriter["readCreationContext"]>>,
  characterId: string,
): CreationDisciplinesStepView | undefined {
  const originId = selectedCreationOrigin(persisted.clanId, persisted.kind);
  if (originId === null) return undefined;
  const policy = resolveCreationDisciplinePolicy(originId);
  const persistedById = new Map(
    (persisted.disciplines ?? []).map((item) => [item.disciplineId, item]),
  );
  const disciplines = policy.allowedDisciplineIds.map(
    (disciplineId) =>
      persistedById.get(disciplineId) ?? {
        disciplineId,
        rating: 0,
        structuralMaximum: 5 as const,
      },
  );
  const powers = (persisted.disciplinePowers ?? []).filter((item) =>
    policy.allowedDisciplineIds.includes(item.disciplineId),
  );
  return {
    catalog: DISCIPLINE_CATALOG.filter((entry) =>
      policy.allowedDisciplineIds.includes(entry.id),
    ),
    characterId,
    creationContext: projectCharacterCreationContext(
      persisted,
      characterId,
      "disciplines",
    ),
    disciplines,
    evaluation: evaluateCreationDisciplines({ disciplines, powers }, policy),
    policy,
    powers,
    version: persisted.version,
  };
}

export class GetCreationDisciplines {
  private readonly policy = new CharacterAccessPolicy();
  constructor(
    private readonly accessContextReader: AccessContextReader,
    private readonly writer: CharacterSheetWriter,
  ) {}
  async execute(
    actor: ActorContext,
    characterId: string,
  ): Promise<CreationDisciplinesStepView | undefined> {
    const context = await this.accessContextReader.readCharacterOwnerAccess(characterId);
    if (context === undefined || !this.policy.authorizeOwnerView(actor, context).allowed)
      return undefined;
    return projectCreationDisciplinesStep(
      await this.writer.readCreationContext(characterId),
      characterId,
    );
  }
}

export const GET_CREATION_DISCIPLINES = Symbol("GET_CREATION_DISCIPLINES");
