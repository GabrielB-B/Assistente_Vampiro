import { describe, expect, it, vi } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { InvalidCharacterCreationError } from "./invalid-character-creation-error.js";
import { UpdateCreationAttributes } from "./update-creation-attributes.js";

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
  writeResult: Awaited<ReturnType<CharacterSheetWriter["updateCreationAttributes"]>> = {
    characterId: "character-one",
    status: "updated",
    version: 2,
  },
) {
  const updateCreationAttributes = vi.fn().mockResolvedValue(writeResult);
  const writer = {
    readCreationConcept: vi.fn(),
    readCreationAttributes: vi.fn().mockResolvedValue({
      attributes: {},
      version: 1,
    }),
    startDraft: vi.fn(),
    updateCreationAttributes,
    updateCreationConcept: vi.fn(),
    updateIdentity: vi.fn(),
  } satisfies CharacterSheetWriter;
  const reader = {
    readCharacterAccess: vi.fn(),
    readCharacterOwnerAccess: vi.fn().mockResolvedValue(context),
  } satisfies AccessContextReader;

  return { reader, updateCreationAttributes, writer };
}

describe("UpdateCreationAttributes", () => {
  it("persiste uma escolha alcançável e devolve saldo e derivados autoritativos", async () => {
    const { reader, updateCreationAttributes, writer } = dependencies(ownerContext());
    const useCase = new UpdateCreationAttributes(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        attributes: { "attribute:stamina": 4 },
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
      }),
    ).resolves.toEqual({
      characterId: "character-one",
      evaluation: {
        complete: false,
        healthMax: 7,
        incrementsSpent: 3,
        remainingIncrements: 10,
        willpowerMax: 2,
      },
      version: 2,
    });
    expect(updateCreationAttributes).toHaveBeenCalledWith({
      actorAccountId: "account-owner",
      auditEntryId: "audit-one",
      attributes: { "attribute:stamina": 4 },
      characterId: "character-one",
      correlationId: "correlation-one",
      expectedVersion: 1,
    });
  });

  it("rejeita distribuição inalcançável antes de escrever", async () => {
    const { reader, updateCreationAttributes, writer } = dependencies(ownerContext());
    const useCase = new UpdateCreationAttributes(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        attributes: {
          "attribute:stamina": 4,
          "attribute:strength": 4,
        },
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
      }),
    ).rejects.toBeInstanceOf(InvalidCharacterCreationError);
    expect(updateCreationAttributes).not.toHaveBeenCalled();
  });

  it("não confirma a existência de personagem alheio", async () => {
    const { reader, updateCreationAttributes, writer } = dependencies(
      ownerContext("account-other"),
    );
    const useCase = new UpdateCreationAttributes(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        attributes: { "attribute:stamina": 2 },
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 1,
      }),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);
    expect(updateCreationAttributes).not.toHaveBeenCalled();
  });

  it("traduz a falha de versão otimista em conflito estável", async () => {
    const { reader, writer } = dependencies(ownerContext(), {
      status: "version-conflict",
    });
    const useCase = new UpdateCreationAttributes(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        attributes: { "attribute:stamina": 2 },
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 0,
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);
  });
});
