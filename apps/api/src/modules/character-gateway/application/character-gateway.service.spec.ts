import { describe, expect, it, vi } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import type {
  CharacterGatewayItem,
  CharacterGatewayRepository,
} from "./character-gateway-repository.js";
import { CharacterGatewayService } from "./character-gateway.service.js";
import { CharacterNotAvailableError } from "./character-not-available-error.js";

const actor: ActorContext = {
  accountId: "account-player",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};

const character: CharacterGatewayItem = {
  characterId: "character-one",
  chronicleId: "chronicle-one",
  chronicleTitle: "Ecos sob a Chuva",
  clan: null,
  lastActivityAt: null,
  name: "Noemi Vale",
  portraitUrl: null,
};

const allowedContext: CharacterAccessContext = {
  character: {
    binding: {
      characterId: character.characterId,
      chronicleId: character.chronicleId,
      membershipId: "membership-one",
      state: "active",
    },
    characterId: character.characterId,
    ownerAccountId: actor.accountId,
  },
  membership: {
    accountId: actor.accountId,
    chronicleId: character.chronicleId,
    membershipId: "membership-one",
    roles: ["PLAYER"],
    status: "active",
  },
};

function createDependencies(context: CharacterAccessContext | undefined) {
  const findAuthorized = vi.fn().mockResolvedValue(character);
  const listAuthorized = vi.fn().mockResolvedValue([character]);
  const repository: CharacterGatewayRepository = {
    findAuthorized,
    listAuthorized,
  };
  const readCharacterAccess = vi.fn().mockResolvedValue(context);
  const reader: AccessContextReader = {
    readCharacterAccess,
  };
  return {
    findAuthorized,
    listAuthorized,
    readCharacterAccess,
    reader,
    repository,
  };
}

describe("CharacterGatewayService", () => {
  it("lista somente a projeção já autorizada para a identidade", async () => {
    const { listAuthorized, reader, repository } = createDependencies(allowedContext);
    const service = new CharacterGatewayService(repository, reader);

    await expect(service.list(actor)).resolves.toEqual({ characters: [character] });
    expect(listAuthorized).toHaveBeenCalledWith(actor.accountId);
  });

  it("revalida acesso antes de registrar a seleção", async () => {
    const { readCharacterAccess, reader, repository } =
      createDependencies(allowedContext);
    const service = new CharacterGatewayService(repository, reader);

    await expect(
      service.select(actor, character.characterId, character.chronicleId),
    ).resolves.toEqual({ activeCharacter: character, nextPath: "/boa-noite" });
    expect(readCharacterAccess).toHaveBeenCalledWith(
      actor.accountId,
      character.characterId,
      character.chronicleId,
    );
  });

  it("não diferencia ID inexistente de personagem alheio", async () => {
    const { findAuthorized, reader, repository } = createDependencies(undefined);
    const service = new CharacterGatewayService(repository, reader);

    await expect(
      service.select(actor, "character-tampered", "chronicle-tampered"),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);
    expect(findAuthorized).not.toHaveBeenCalled();
  });

  it("nega contexto existente quando o proprietário não é o ator", async () => {
    const otherOwnerContext: CharacterAccessContext = {
      ...allowedContext,
      character: { ...allowedContext.character, ownerAccountId: "account-other" },
    };
    const { findAuthorized, reader, repository } = createDependencies(otherOwnerContext);
    const service = new CharacterGatewayService(repository, reader);

    await expect(
      service.select(actor, character.characterId, character.chronicleId),
    ).rejects.toBeInstanceOf(CharacterNotAvailableError);
    expect(findAuthorized).not.toHaveBeenCalled();
  });
});
