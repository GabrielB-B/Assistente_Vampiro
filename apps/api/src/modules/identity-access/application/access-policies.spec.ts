import { describe, expect, it } from "vitest";

import type { ActorContext } from "./actor-context.js";
import type { CharacterAccessContext } from "./authorization-context.js";
import { CharacterAccessPolicy } from "./character-access-policy.js";
import { ChronicleAccessPolicy } from "./chronicle-access-policy.js";
import { FeedVisibilityPolicy } from "./feed-visibility-policy.js";

const player: ActorContext = {
  accountId: "account-player",
  authenticationMethod: "alpha",
  identityAlias: "player-one",
};
const storyteller: ActorContext = {
  accountId: "account-storyteller",
  authenticationMethod: "alpha",
  identityAlias: "storyteller-one",
};

function createCharacterContext(
  accountId: string,
  roles: readonly ("PLAYER" | "STORYTELLER")[],
): CharacterAccessContext {
  return {
    character: {
      binding: {
        characterId: "character-one",
        chronicleId: "chronicle-one",
        membershipId: "membership-one",
        state: "active",
      },
      characterId: "character-one",
      ownerAccountId: "account-player",
    },
    membership: {
      accountId,
      chronicleId: "chronicle-one",
      membershipId: "membership-one",
      roles,
      status: "active",
    },
  };
}

describe("políticas de acesso", () => {
  it("permite que Jogador controle somente a própria personagem vinculada", () => {
    const policy = new CharacterAccessPolicy();

    expect(
      policy.authorizePlayerControl(
        player,
        createCharacterContext(player.accountId, ["PLAYER"]),
      ),
    ).toEqual({ allowed: true });

    const otherPlayer = { ...player, accountId: "account-other" };
    expect(
      policy.authorizePlayerControl(
        otherPlayer,
        createCharacterContext(otherPlayer.accountId, ["PLAYER"]),
      ),
    ).toEqual({ allowed: false, code: "RESOURCE_NOT_AVAILABLE" });
  });

  it("exige Vínculo ativo para controle e para visão do Narrador", () => {
    const policy = new CharacterAccessPolicy();
    const playerContext = createCharacterContext(player.accountId, ["PLAYER"]);
    const storytellerContext = createCharacterContext(storyteller.accountId, [
      "STORYTELLER",
    ]);
    const withoutBinding: CharacterAccessContext = {
      ...playerContext,
      character: { ...playerContext.character, binding: undefined },
    };

    expect(policy.authorizePlayerControl(player, withoutBinding)).toEqual({
      allowed: false,
      code: "RESOURCE_NOT_AVAILABLE",
    });
    expect(
      policy.authorizeStorytellerView(storyteller, {
        ...storytellerContext,
        character: { ...storytellerContext.character, binding: undefined },
      }),
    ).toEqual({ allowed: false, code: "RESOURCE_NOT_AVAILABLE" });
  });

  it("não aceita papel declarado fora da Participação", () => {
    const policy = new ChronicleAccessPolicy();
    const membership = createCharacterContext(player.accountId, ["PLAYER"]).membership;

    expect(policy.authorizeRole(player, membership, "STORYTELLER")).toEqual({
      allowed: false,
      code: "ACTION_NOT_ALLOWED",
    });
  });

  it("nega Participação suspensa mesmo quando o papel está presente", () => {
    const policy = new ChronicleAccessPolicy();
    const activeMembership = createCharacterContext(storyteller.accountId, [
      "STORYTELLER",
    ]).membership;
    const suspendedMembership =
      activeMembership === undefined
        ? undefined
        : { ...activeMembership, status: "suspended" as const };

    expect(policy.authorizeRole(storyteller, suspendedMembership, "STORYTELLER")).toEqual(
      { allowed: false, code: "MEMBERSHIP_INACTIVE" },
    );
  });

  it("não revela evento privado do Narrador ao Jogador", () => {
    const policy = new FeedVisibilityPolicy();
    const playerMembership = createCharacterContext(player.accountId, [
      "PLAYER",
    ]).membership;
    const storytellerMembership = createCharacterContext(storyteller.accountId, [
      "STORYTELLER",
    ]).membership;

    expect(policy.authorize(player, playerMembership, "STORYTELLER_PRIVATE")).toEqual({
      allowed: false,
      code: "RESOURCE_NOT_AVAILABLE",
    });
    expect(
      policy.authorize(storyteller, storytellerMembership, "STORYTELLER_PRIVATE"),
    ).toEqual({ allowed: true });
    expect(policy.authorize(player, playerMembership, "CHRONICLE_SHARED")).toEqual({
      allowed: true,
    });
  });
});
