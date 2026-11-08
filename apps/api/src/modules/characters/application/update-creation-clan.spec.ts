import type { CreationClanStepView } from "@assistente-vampiro/contracts";
import { describe, expect, it, vi } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import type { GetCreationClan } from "./get-creation-clan.js";
import { UpdateCreationClan } from "./update-creation-clan.js";

const actor: ActorContext = {
  accountId: "account-owner",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};

function ownerContext(ownerAccountId = actor.accountId): CharacterAccessContext {
  return {
    character: {
      binding: undefined,
      characterId: "character-one",
      ownerAccountId,
    },
    membership: undefined,
  };
}

function dependencies(
  context: CharacterAccessContext | undefined,
  writeResult: Awaited<ReturnType<CharacterSheetWriter["updateCreationClan"]>> = {
    characterId: "character-one",
    status: "updated",
    version: 3,
  },
) {
  const updateCreationClan = vi.fn().mockResolvedValue(writeResult);
  const readCreationContext = vi.fn().mockResolvedValue({
    attributes: {},
    clanId: null,
    convictionPairs: [],
    creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
    identity: {
      ambition: null,
      concept: "Investigadora",
      desire: null,
      name: "Noemi Vale",
      sire: null,
    },
    kind: null,
    version: 2,
  });
  const writer = {
    readCreationContext,
    readCreationAttributes: vi.fn(),
    readCreationClan: vi.fn(),
    readCreationConcept: vi.fn(),
    startDraft: vi.fn(),
    updateCreationAttributes: vi.fn(),
    updateCreationClan,
    updateCreationConcept: vi.fn(),
    updateIdentity: vi.fn(),
  } satisfies CharacterSheetWriter;
  const reader = {
    readCharacterAccess: vi.fn(),
    readCharacterOwnerAccess: vi.fn().mockResolvedValue(context),
  } satisfies AccessContextReader;
  const view = {
    characterId: "character-one",
    creationContext: {
      characterId: "character-one",
      completedSteps: ["concept", "clan"],
      creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
      currentStep: "clan",
      disciplinePolicy: {
        allowedDisciplines: [
          "discipline:auspex",
          "discipline:celerity",
          "discipline:presence",
        ],
        family: "CLAN",
        originId: "clan:toreador",
        selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
      },
      identity: { concept: "Investigadora", name: "Noemi Vale" },
      origin: {
        clanId: "clan:toreador",
        id: "clan:toreador",
        kind: "CLAN_VAMPIRE",
      },
      steps: [
        { id: "concept", status: "complete" },
        { id: "clan", status: "complete" },
        { id: "attributes", status: "not_started" },
        { id: "skills", status: "not_started" },
        { id: "disciplines", status: "not_started" },
        { id: "predator", status: "not_started" },
        { id: "advantages", status: "not_started" },
        { id: "history-and-blood", status: "not_started" },
        { id: "review", status: "not_started" },
      ],
      version: 3,
    },
    evaluation: { complete: true, selectedOriginId: "clan:toreador" },
    options: [],
    policy: { ruleRevision: "RULE-CREATION-CLAN-001-r1" },
    version: 3,
  } satisfies CreationClanStepView;
  const getter = {
    execute: vi.fn().mockResolvedValue(view),
  } as unknown as GetCreationClan;
  return { getter, reader, updateCreationClan, view, writer };
}

describe("UpdateCreationClan", () => {
  it("persiste o clã no Character com versão e auditoria", async () => {
    const { getter, reader, updateCreationClan, view, writer } =
      dependencies(ownerContext());
    const useCase = new UpdateCreationClan(
      reader,
      writer,
      { next: () => "audit-one" },
      getter,
    );

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 2,
        originId: "clan:toreador",
      }),
    ).resolves.toEqual(view);
    expect(updateCreationClan).toHaveBeenCalledWith({
      actorAccountId: actor.accountId,
      auditEntryId: "audit-one",
      characterId: "character-one",
      clanId: "clan:toreador",
      correlationId: "correlation-one",
      expectedVersion: 2,
      kind: "CLAN_VAMPIRE",
      originId: "clan:toreador",
      potentialImpactedSteps: [
        "disciplines",
        "predator",
        "advantages",
        "history-and-blood",
      ],
    });
  });

  it.each([
    ["origin:caitiff", "CAITIFF"],
    ["origin:thin-blood", "THIN_BLOOD"],
  ] as const)("persiste %s sem fingir um clã", async (originId, kind) => {
    const { getter, reader, updateCreationClan, writer } = dependencies(ownerContext());
    const useCase = new UpdateCreationClan(
      reader,
      writer,
      { next: () => "audit-one" },
      getter,
    );

    await useCase.execute(actor, {
      characterId: "character-one",
      correlationId: "correlation-one",
      expectedVersion: 2,
      originId,
    });
    expect(updateCreationClan).toHaveBeenCalledWith(
      expect.objectContaining({ clanId: null, kind, originId }),
    );
  });

  it("não revela um personagem que não pertence ao ator", async () => {
    const { getter, reader, writer } = dependencies(ownerContext("another-account"));
    const useCase = new UpdateCreationClan(
      reader,
      writer,
      { next: () => "audit-one" },
      getter,
    );

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 2,
        originId: "clan:brujah",
      }),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);
  });

  it("mantém conflito otimista explícito", async () => {
    const { getter, reader, writer } = dependencies(ownerContext(), {
      status: "version-conflict",
    });
    const useCase = new UpdateCreationClan(
      reader,
      writer,
      { next: () => "audit-one" },
      getter,
    );

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
        originId: "clan:brujah",
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);
  });
});
