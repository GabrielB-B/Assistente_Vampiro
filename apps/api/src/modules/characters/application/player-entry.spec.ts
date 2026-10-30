import type { CharacterSheetView, PlayerEntryView } from "@assistente-vampiro/contracts";
import { describe, expect, it } from "vitest";

import type { AccessContextReader } from "../../identity-access/application/access-context-reader.js";
import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterAccessContext } from "../../identity-access/application/authorization-context.js";
import type {
  AuthorizedCharacterReference,
  CharacterAccessCandidate,
  CharacterEntryReader,
} from "./character-entry-reader.js";
import { GetCharacterSheet } from "./get-character-sheet.js";
import { ListPlayerEntry } from "./list-player-entry.js";

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

function accessContext(
  actor: ActorContext,
  roles: readonly ("PLAYER" | "STORYTELLER")[],
): CharacterAccessContext {
  return {
    character: {
      binding: {
        characterId: "character-one",
        chronicleId: "chronicle-one",
        membershipId: "membership-player",
        state: "active",
      },
      characterId: "character-one",
      ownerAccountId: player.accountId,
    },
    membership: {
      accountId: actor.accountId,
      chronicleId: "chronicle-one",
      membershipId:
        actor.accountId === player.accountId
          ? "membership-player"
          : "membership-storyteller",
      roles,
      status: "active",
    },
  };
}

const sheet: CharacterSheetView = {
  accessMode: "OWNER",
  character: {
    concept: "Investigadora noturna",
    hunger: 2,
    id: "character-one",
    kind: "CLAN_VAMPIRE",
    name: "Noemi Vale",
    state: "ready",
    version: 0,
  },
  chronicle: {
    description: "Uma Crônica fictícia.",
    id: "chronicle-one",
    title: "Ecos sob a Chuva",
  },
  ruleSetProfileRevisionId: "profile-r1",
  scene: null,
  session: null,
  traits: [],
};

class FakeEntryReader implements CharacterEntryReader {
  references: readonly AuthorizedCharacterReference[] = [];

  constructor(private readonly candidates: readonly CharacterAccessCandidate[]) {}

  listAccessCandidates(): Promise<readonly CharacterAccessCandidate[]> {
    return Promise.resolve(this.candidates);
  }

  readEntryProjection(
    _accountId: string,
    references: readonly AuthorizedCharacterReference[],
  ): Promise<
    | {
        readonly actorDisplayName: string;
        readonly characters: PlayerEntryView["characters"];
      }
    | undefined
  > {
    this.references = references;
    return Promise.resolve({
      actorDisplayName: "Pessoa de teste",
      characters: references.map((reference) => ({
        accessMode: reference.accessMode,
        characterId: reference.characterId,
        characterName: "Noemi Vale",
        characterState: "ready",
        chronicleId: reference.chronicleId,
        chronicleTitle: "Ecos sob a Chuva",
        concept: "Investigadora noturna",
      })),
    });
  }

  readSheet(reference: AuthorizedCharacterReference): Promise<CharacterSheetView> {
    return Promise.resolve({ ...sheet, accessMode: reference.accessMode });
  }
}

describe("entrada autorizada do jogador", () => {
  it("projeta a personagem própria somente depois da política de controle", async () => {
    const reader = new FakeEntryReader([
      { chronicleId: "chronicle-one", context: accessContext(player, ["PLAYER"]) },
    ]);

    const view = await new ListPlayerEntry(reader).execute(player);

    expect(view?.actor).toEqual({
      displayName: "Pessoa de teste",
      identityAlias: "player-one",
    });
    expect(reader.references).toEqual([
      {
        accessMode: "OWNER",
        characterId: "character-one",
        chronicleId: "chronicle-one",
      },
    ]);
  });

  it("projeta para a Narradora apenas a ficha com Vínculo ativo", async () => {
    const context = accessContext(storyteller, ["STORYTELLER"]);
    const reader = new FakeEntryReader([{ chronicleId: "chronicle-one", context }]);
    const accessReader: AccessContextReader = {
      readCharacterAccess: () => Promise.resolve(context),
    };

    const view = await new GetCharacterSheet(accessReader, reader).execute(storyteller, {
      characterId: "character-one",
      chronicleId: "chronicle-one",
    });

    expect(view?.accessMode).toBe("STORYTELLER");
  });

  it("nega a troca de ID antes de pedir a projeção narrativa", async () => {
    const deniedContext = accessContext({ ...player, accountId: "account-other" }, [
      "PLAYER",
    ]);
    const reader = new FakeEntryReader([]);
    let projectionRead = false;
    reader.readSheet = () => {
      projectionRead = true;
      return Promise.resolve(sheet);
    };
    const accessReader: AccessContextReader = {
      readCharacterAccess: () => Promise.resolve(deniedContext),
    };

    const view = await new GetCharacterSheet(accessReader, reader).execute(
      { ...player, accountId: "account-other" },
      { characterId: "character-one", chronicleId: "chronicle-one" },
    );

    expect(view).toBeUndefined();
    expect(projectionRead).toBe(false);
  });
});
