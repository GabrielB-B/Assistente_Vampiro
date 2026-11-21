import type {
  CharacterSheetDocumentView,
  PlayerEntryView,
} from "@assistente-vampiro/contracts";
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

function ownerOnlyContext(ownerAccountId = player.accountId): CharacterAccessContext {
  return {
    character: {
      binding: undefined,
      characterId: "character-draft",
      ownerAccountId,
    },
    membership: undefined,
  };
}

const document: CharacterSheetDocumentView = {
  context: {
    chronicle: {
      description: "Uma Crônica fictícia.",
      id: "chronicle-one",
      title: "Ecos sob a Chuva",
    },
  },
  sheet: {
    accessMode: "OWNER",
    character: {
      ambition: null,
      clanId: "clan:toreador",
      concept: "Investigadora noturna",
      desire: null,
      hunger: 2,
      id: "character-one",
      kind: "CLAN_VAMPIRE",
      name: "Noemi Vale",
      sire: null,
      state: "ready",
      version: 0,
    },
    convictionPairs: [],
    ruleSetProfileRevisionId: "profile-r1",
    traits: [],
  },
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
        characterName: reference.characterId === "character-draft" ? "" : "Noemi Vale",
        characterState: reference.characterId === "character-draft" ? "draft" : "ready",
        chronicleId: reference.chronicleId ?? null,
        chronicleTitle: reference.chronicleId === undefined ? null : "Ecos sob a Chuva",
        concept: "Investigadora noturna",
      })),
    });
  }

  readSheet(
    reference: AuthorizedCharacterReference,
  ): Promise<CharacterSheetDocumentView> {
    return Promise.resolve({
      ...document,
      sheet: { ...document.sheet, accessMode: reference.accessMode },
    });
  }
}

function accessReader(
  ownerContext: CharacterAccessContext | undefined,
  contextualContext: CharacterAccessContext | undefined,
): AccessContextReader {
  return {
    readCharacterAccess: () => Promise.resolve(contextualContext),
    readCharacterOwnerAccess: () => Promise.resolve(ownerContext),
  };
}

describe("entrada autorizada do jogador", () => {
  it("projeta a personagem própria somente depois da política de propriedade", async () => {
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

  it("projeta rascunho próprio sem Crônica, Participação ou Vínculo", async () => {
    const reader = new FakeEntryReader([{ context: ownerOnlyContext() }]);

    const view = await new ListPlayerEntry(reader).execute(player);

    expect(reader.references).toEqual([
      { accessMode: "OWNER", characterId: "character-draft" },
    ]);
    expect(view?.characters[0]).toMatchObject({
      characterState: "draft",
      chronicleId: null,
      chronicleTitle: null,
    });
  });

  it("projeta para a Narradora apenas a ficha com Vínculo ativo", async () => {
    const context = accessContext(storyteller, ["STORYTELLER"]);
    const reader = new FakeEntryReader([{ chronicleId: "chronicle-one", context }]);

    const view = await new GetCharacterSheet(
      accessReader(undefined, context),
      reader,
    ).execute(storyteller, {
      characterId: "character-one",
      chronicleId: "chronicle-one",
    });

    expect(view?.sheet.accessMode).toBe("STORYTELLER");
  });

  it("carrega ficha própria sem consultar contexto de Crônica", async () => {
    const context = ownerOnlyContext();
    const reader = new FakeEntryReader([]);
    let contextualRead = false;
    const readerOfAccess: AccessContextReader = {
      readCharacterAccess: () => {
        contextualRead = true;
        return Promise.resolve(undefined);
      },
      readCharacterOwnerAccess: () => Promise.resolve(context),
    };

    const view = await new GetCharacterSheet(readerOfAccess, reader).execute(player, {
      characterId: "character-draft",
    });

    expect(view?.sheet.accessMode).toBe("OWNER");
    expect(contextualRead).toBe(false);
  });

  it("nega a troca de ID antes de pedir a projeção narrativa", async () => {
    const reader = new FakeEntryReader([]);
    let projectionRead = false;
    reader.readSheet = () => {
      projectionRead = true;
      return Promise.resolve(document);
    };

    const view = await new GetCharacterSheet(
      accessReader(ownerOnlyContext("account-other"), undefined),
      reader,
    ).execute(player, { characterId: "character-draft" });

    expect(view).toBeUndefined();
    expect(projectionRead).toBe(false);
  });
});
