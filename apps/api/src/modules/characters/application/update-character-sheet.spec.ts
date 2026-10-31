import { describe, expect, it, vi } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { CharacterVersionConflictError } from "./character-version-conflict-error.js";
import { UpdateCharacterSheet } from "./update-character-sheet.js";

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
  result: Awaited<ReturnType<CharacterSheetWriter["updateIdentity"]>> = {
    characterId: "character-one",
    status: "updated",
    version: 4,
  },
) {
  const updateIdentity = vi.fn().mockResolvedValue(result);
  const writer: CharacterSheetWriter = {
    readCreationConcept: vi.fn(),
    readCreationAttributes: vi.fn(),
    startDraft: vi.fn(),
    updateCreationAttributes: vi.fn(),
    updateCreationConcept: vi.fn(),
    updateIdentity,
  };
  const reader: AccessContextReader = {
    readCharacterAccess: vi.fn(),
    readCharacterOwnerAccess: vi.fn().mockResolvedValue(context),
  };
  return { reader, updateIdentity, writer };
}

describe("UpdateCharacterSheet", () => {
  it("deriva o proprietário do ator e encaminha versão e auditoria", async () => {
    const { reader, updateIdentity, writer } = dependencies(ownerContext());
    const useCase = new UpdateCharacterSheet(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 3,
        identity: { concept: "Investigadora", name: "Noemi" },
      }),
    ).resolves.toEqual({ characterId: "character-one", version: 4 });
    expect(updateIdentity).toHaveBeenCalledWith({
      actorAccountId: actor.accountId,
      auditEntryId: "audit-one",
      characterId: "character-one",
      correlationId: "correlation-one",
      expectedVersion: 3,
      identity: { concept: "Investigadora", name: "Noemi" },
    });
  });

  it("nega personagem alheio antes de chamar a escrita", async () => {
    const { reader, updateIdentity, writer } = dependencies(
      ownerContext("account-other"),
    );
    const useCase = new UpdateCharacterSheet(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 3,
        identity: { name: "Invasão" },
      }),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);
    expect(updateIdentity).not.toHaveBeenCalled();
  });

  it("traduz a falha de concorrência em conflito estável", async () => {
    const { reader, writer } = dependencies(ownerContext(), {
      status: "version-conflict",
    });
    const useCase = new UpdateCharacterSheet(reader, writer, {
      next: () => "audit-one",
    });

    await expect(
      useCase.execute(actor, {
        characterId: "character-one",
        correlationId: "correlation-one",
        expectedVersion: 2,
        identity: { concept: null },
      }),
    ).rejects.toBeInstanceOf(CharacterVersionConflictError);
  });
});
