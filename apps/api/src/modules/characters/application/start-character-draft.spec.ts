import { describe, expect, it, vi } from "vitest";

import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterSheetWriter } from "./character-sheet-writer.js";
import { StartCharacterDraft } from "./start-character-draft.js";

const actor: ActorContext = {
  accountId: "account-owner",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};

describe("StartCharacterDraft", () => {
  it("deriva o proprietário do ator e encaminha a chave de idempotência", async () => {
    const startDraft = vi.fn().mockResolvedValue({
      characterId: "character-one",
      created: true,
      version: 1,
    });
    const writer = {
      readCreationContext: vi.fn(),
      readCreationClan: vi.fn(),
      readCreationConcept: vi.fn(),
      readCreationAttributes: vi.fn(),
      startDraft,
      updateCreationAttributes: vi.fn(),
      updateCreationClan: vi.fn(),
      updateCreationConcept: vi.fn(),
      updateIdentity: vi.fn(),
    } satisfies CharacterSheetWriter;
    const ids = ["audit-one", "character-one"];
    const useCase = new StartCharacterDraft(writer, {
      next: () => ids.shift() ?? "unexpected-id",
    });

    await expect(
      useCase.execute(actor, {
        correlationId: "correlation-one",
        idempotencyKey: "creation-attempt-one",
      }),
    ).resolves.toEqual({
      characterId: "character-one",
      created: true,
      version: 1,
    });
    expect(startDraft).toHaveBeenCalledWith({
      actorAccountId: "account-owner",
      auditEntryId: "audit-one",
      characterId: "character-one",
      correlationId: "correlation-one",
      idempotencyKey: "creation-attempt-one",
    });
  });
});
