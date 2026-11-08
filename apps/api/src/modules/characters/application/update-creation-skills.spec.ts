import type {
  CreationSkillId,
  CreationSkillMethodId,
  CreationSpecialtyView,
} from "@assistente-vampiro/contracts";
import { describe, expect, it, vi } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";
import { UpdateCreationSkills } from "./update-creation-skills.js";

const actor: ActorContext = {
  accountId: "account-owner",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};

function ownerContext(): CharacterAccessContext {
  return {
    character: {
      binding: undefined,
      characterId: "character-one",
      ownerAccountId: actor.accountId,
    },
    membership: undefined,
  };
}

function persisted({
  methodId = null,
  skills = {},
  specialties = [],
  version = 1,
}: {
  readonly methodId?: CreationSkillMethodId | null;
  readonly skills?: Partial<Record<CreationSkillId, number>>;
  readonly specialties?: readonly CreationSpecialtyView[];
  readonly version?: number;
} = {}) {
  return {
    attributes: {},
    clanId: "clan:toreador" as const,
    convictionPairs: [],
    creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
    identity: {
      ambition: "Compreender a noite",
      concept: "Investigadora",
      desire: null,
      name: "Noemi Vale",
      sire: null,
    },
    kind: "CLAN_VAMPIRE" as const,
    skillMethodId: methodId,
    skills,
    specialties,
    version,
  };
}

function dependencies(
  reads: readonly ReturnType<typeof persisted>[],
  writeResult: Awaited<
    ReturnType<NonNullable<CharacterSheetWriter["updateCreationSkills"]>>
  > = {
    characterId: "character-one",
    status: "updated",
    version: 2,
  },
) {
  const updateCreationSkills = vi.fn().mockResolvedValue(writeResult);
  const readCreationContext = vi.fn();
  for (const value of reads) readCreationContext.mockResolvedValueOnce(value);
  const writer = {
    readCreationAttributes: vi.fn(),
    readCreationClan: vi.fn(),
    readCreationConcept: vi.fn(),
    readCreationContext,
    startDraft: vi.fn(),
    updateCreationAttributes: vi.fn(),
    updateCreationClan: vi.fn(),
    updateCreationConcept: vi.fn(),
    updateCreationSkills,
    updateIdentity: vi.fn(),
  } satisfies CharacterSheetWriter;
  const reader = {
    readCharacterAccess: vi.fn(),
    readCharacterOwnerAccess: vi.fn().mockResolvedValue(ownerContext()),
  } satisfies AccessContextReader;
  return { reader, updateCreationSkills, writer };
}

describe("UpdateCreationSkills", () => {
  it("persiste a seleção de método e devolve a política recalculada", async () => {
    const { reader, updateCreationSkills, writer } = dependencies([
      persisted(),
      persisted({ methodId: "QUICK_BALANCED", version: 2 }),
    ]);
    const useCase = new UpdateCreationSkills(reader, writer, {
      next: () => "audit-one",
    });

    const result = await useCase.execute(actor, {
      characterId: "character-one",
      correlationId: "correlation-one",
      expectedVersion: 1,
      methodId: "QUICK_BALANCED",
      skills: {},
    });

    expect(result.methodId).toBe("QUICK_BALANCED");
    expect(
      result.creationContext.steps.find((item) => item.id === "skills")?.status,
    ).toBe("in_progress");
    expect(updateCreationSkills).toHaveBeenCalledWith(
      expect.objectContaining({
        characterId: "character-one",
        expectedVersion: 1,
        methodId: "QUICK_BALANCED",
      }),
    );
  });

  it("cria e recarrega uma Especialização automática autoritativa", async () => {
    const science = { "skill:science": 1 };
    const specialty: CreationSpecialtyView = {
      id: "specialty-one",
      label: "Química",
      origin: "CREATION_AUTOMATIC",
      skillId: "skill:science",
    };
    const { reader, updateCreationSkills, writer } = dependencies([
      persisted({ methodId: "QUICK_BALANCED", skills: science }),
      persisted({
        methodId: "QUICK_BALANCED",
        skills: science,
        specialties: [specialty],
        version: 2,
      }),
    ]);
    const ids = vi
      .fn()
      .mockReturnValueOnce("specialty-one")
      .mockReturnValueOnce("audit-one");
    const useCase = new UpdateCreationSkills(reader, writer, { next: ids });

    const result = await useCase.createSpecialty(actor, {
      characterId: "character-one",
      correlationId: "correlation-one",
      expectedVersion: 1,
      label: " Química ",
      origin: "CREATION_AUTOMATIC",
      skillId: "skill:science",
    });

    expect(result.specialties).toEqual([specialty]);
    expect(updateCreationSkills).toHaveBeenCalledWith(
      expect.objectContaining({ specialties: [specialty] }),
    );
  });

  it("rejeita origem automática que a regra não concedeu", async () => {
    const { reader, updateCreationSkills, writer } = dependencies([
      persisted({
        methodId: "QUICK_BALANCED",
        skills: { "skill:etiquette": 1 },
      }),
    ]);
    const useCase = new UpdateCreationSkills(reader, writer, {
      next: () => "specialty-one",
    });

    await expect(
      useCase.createSpecialty(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
        label: "Etiqueta formal",
        origin: "CREATION_AUTOMATIC",
        skillId: "skill:etiquette",
      }),
    ).rejects.toBeInstanceOf(InvalidCharacterCreationError);
    expect(updateCreationSkills).not.toHaveBeenCalled();
  });

  it("preserva a Especialização e recusa reduzir a Habilidade que a sustenta", async () => {
    const specialty: CreationSpecialtyView = {
      id: "specialty-one",
      label: "Química",
      origin: "CREATION_AUTOMATIC",
      skillId: "skill:science",
    };
    const { reader, updateCreationSkills, writer } = dependencies([
      persisted({
        methodId: "QUICK_BALANCED",
        skills: { "skill:science": 1 },
        specialties: [specialty],
      }),
    ]);
    const useCase = new UpdateCreationSkills(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
        skills: { "skill:science": 0 },
      }),
    ).rejects.toBeInstanceOf(InvalidCharacterCreationError);
    expect(updateCreationSkills).not.toHaveBeenCalled();
  });

  it("propaga conflito de versão sem sobrescrever outro estado", async () => {
    const { reader, writer } = dependencies([persisted({ methodId: "QUICK_BALANCED" })], {
      status: "version-conflict",
    });
    const useCase = new UpdateCreationSkills(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 0,
        skills: { "skill:athletics": 1 },
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);
  });
});
