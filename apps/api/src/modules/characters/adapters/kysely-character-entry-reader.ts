import type {
  CharacterEntrySummaryView,
  CharacterSheetDocumentView,
} from "@assistente-vampiro/contracts";
import type { Database } from "@assistente-vampiro/database";
import { sql } from "kysely";

import type { MembershipRole } from "../../identity-access/application/authorization-context.js";
import type {
  AuthorizedCharacterReference,
  CharacterAccessCandidate,
  CharacterEntryProjection,
  CharacterEntryReader,
} from "../application/character-entry-reader.js";

export class KyselyCharacterEntryReader implements CharacterEntryReader {
  constructor(private readonly database: Database) {}

  async listAccessCandidates(
    accountId: string,
  ): Promise<readonly CharacterAccessCandidate[]> {
    const ownerRowsPromise = this.database
      .selectFrom("character as character_record")
      .leftJoin("character_binding as binding", (join) =>
        join
          .onRef("binding.character_id", "=", "character_record.id")
          .on("binding.state", "=", "active"),
      )
      .select([
        "binding.character_id as binding_character_id",
        "binding.chronicle_id as binding_chronicle_id",
        "binding.membership_id as binding_membership_id",
        "binding.state as binding_state",
        "character_record.id as character_id",
        "character_record.owner_account_id",
      ])
      .where("character_record.owner_account_id", "=", accountId)
      .where("character_record.state", "!=", "retired")
      .execute();

    const contextualRowsPromise = this.database
      .selectFrom("character as character_record")
      .innerJoin(
        "character_binding as binding",
        "binding.character_id",
        "character_record.id",
      )
      .innerJoin("chronicle_membership as membership", (join) =>
        join
          .onRef("membership.chronicle_id", "=", "binding.chronicle_id")
          .on("membership.account_id", "=", accountId),
      )
      .select([
        "binding.character_id as binding_character_id",
        "binding.chronicle_id as binding_chronicle_id",
        "binding.membership_id as binding_membership_id",
        "binding.state as binding_state",
        "character_record.id as character_id",
        "character_record.owner_account_id",
        "membership.account_id as membership_account_id",
        "membership.chronicle_id as membership_chronicle_id",
        "membership.id as membership_id",
        "membership.status as membership_status",
        sql<MembershipRole[]>`membership.roles::text[]`.as("membership_roles"),
      ])
      .where("binding.state", "=", "active")
      .execute();

    const [ownerRows, contextualRows] = await Promise.all([
      ownerRowsPromise,
      contextualRowsPromise,
    ]);
    const ownedCharacterIds = new Set(ownerRows.map((row) => row.character_id));

    const ownerCandidates = ownerRows.map((row): CharacterAccessCandidate => ({
      ...(row.binding_chronicle_id === null
        ? {}
        : { chronicleId: row.binding_chronicle_id }),
      context: {
        character: {
          binding:
            row.binding_character_id === null ||
            row.binding_chronicle_id === null ||
            row.binding_membership_id === null ||
            row.binding_state === null
              ? undefined
              : {
                  characterId: row.binding_character_id,
                  chronicleId: row.binding_chronicle_id,
                  membershipId: row.binding_membership_id,
                  state: row.binding_state,
                },
          characterId: row.character_id,
          ownerAccountId: row.owner_account_id,
        },
        membership: undefined,
      },
    }));

    const contextualCandidates = contextualRows.flatMap(
      (row): CharacterAccessCandidate[] =>
        ownedCharacterIds.has(row.character_id)
          ? []
          : [
              {
                chronicleId: row.binding_chronicle_id,
                context: {
                  character: {
                    binding: {
                      characterId: row.binding_character_id,
                      chronicleId: row.binding_chronicle_id,
                      membershipId: row.binding_membership_id,
                      state: row.binding_state,
                    },
                    characterId: row.character_id,
                    ownerAccountId: row.owner_account_id,
                  },
                  membership: {
                    accountId: row.membership_account_id,
                    chronicleId: row.membership_chronicle_id,
                    membershipId: row.membership_id,
                    roles: row.membership_roles,
                    status: row.membership_status,
                  },
                },
              },
            ],
    );

    return [...ownerCandidates, ...contextualCandidates];
  }

  async readEntryProjection(
    accountId: string,
    references: readonly AuthorizedCharacterReference[],
  ): Promise<CharacterEntryProjection | undefined> {
    const accountPromise = this.database
      .selectFrom("account")
      .select("display_name")
      .where("id", "=", accountId)
      .where("status", "=", "active")
      .executeTakeFirst();

    if (references.length === 0) {
      const account = await accountPromise;
      return account === undefined
        ? undefined
        : { actorDisplayName: account.display_name, characters: [] };
    }

    const characterIds = [...new Set(references.map(({ characterId }) => characterId))];
    const accessModes = new Map(
      references.map((reference) => [reference.characterId, reference.accessMode]),
    );
    const summariesPromise = this.database
      .selectFrom("character as character_record")
      .leftJoin("character_binding as binding", (join) =>
        join
          .onRef("binding.character_id", "=", "character_record.id")
          .on("binding.state", "=", "active"),
      )
      .leftJoin("chronicle", "chronicle.id", "binding.chronicle_id")
      .select([
        "character_record.concept",
        "character_record.id as character_id",
        "character_record.name as character_name",
        "character_record.state as character_state",
        "chronicle.id as chronicle_id",
        "chronicle.title as chronicle_title",
      ])
      .where("character_record.id", "in", characterIds)
      .orderBy("character_record.name")
      .execute();
    const [account, rows] = await Promise.all([accountPromise, summariesPromise]);

    if (account === undefined) {
      return undefined;
    }

    const characters = rows.flatMap((row): CharacterEntrySummaryView[] => {
      const accessMode = accessModes.get(row.character_id);
      return accessMode === undefined
        ? []
        : [
            {
              accessMode,
              characterId: row.character_id,
              characterName: row.character_name,
              characterState: row.character_state,
              chronicleId: row.chronicle_id,
              chronicleTitle: row.chronicle_title,
              concept: row.concept,
            },
          ];
    });

    return { actorDisplayName: account.display_name, characters };
  }

  async readSheet(
    reference: AuthorizedCharacterReference,
  ): Promise<CharacterSheetDocumentView | undefined> {
    const corePromise = this.database
      .selectFrom("character")
      .select([
        "ambition",
        "concept",
        "desire",
        "hunger",
        "id",
        "kind",
        "name",
        "rule_set_profile_revision_id",
        "state",
        "sire",
        "version",
      ])
      .where("id", "=", reference.characterId)
      .executeTakeFirst();
    const traitsPromise = this.database
      .selectFrom("character_trait")
      .select(["kind", "trait_id", "value"])
      .where("character_id", "=", reference.characterId)
      .orderBy("kind")
      .orderBy("trait_id")
      .execute();
    const convictionPairsPromise = this.database
      .selectFrom("character_conviction_pair")
      .select(["conviction", "position", "touchstone"])
      .where("character_id", "=", reference.characterId)
      .orderBy("position")
      .execute();
    const contextPromise =
      reference.chronicleId === undefined
        ? Promise.resolve(undefined)
        : this.database
            .selectFrom("character_binding as binding")
            .innerJoin("chronicle", "chronicle.id", "binding.chronicle_id")
            .select(["chronicle.description", "chronicle.id", "chronicle.title"])
            .where("binding.character_id", "=", reference.characterId)
            .where("binding.chronicle_id", "=", reference.chronicleId)
            .where("binding.state", "=", "active")
            .executeTakeFirst();
    const [core, traits, convictionPairs, chronicle] = await Promise.all([
      corePromise,
      traitsPromise,
      convictionPairsPromise,
      contextPromise,
    ]);

    if (
      core === undefined ||
      (reference.accessMode === "STORYTELLER" && chronicle === undefined)
    ) {
      return undefined;
    }

    return {
      context: {
        chronicle:
          chronicle === undefined
            ? null
            : {
                description: chronicle.description,
                id: chronicle.id,
                title: chronicle.title,
              },
      },
      sheet: {
        accessMode: reference.accessMode,
        character: {
          ambition: core.ambition,
          concept: core.concept,
          desire: core.desire,
          hunger: core.hunger,
          id: core.id,
          kind: core.kind,
          name: core.name,
          sire: core.sire,
          state: core.state,
          version: core.version,
        },
        convictionPairs,
        ruleSetProfileRevisionId: core.rule_set_profile_revision_id,
        traits: traits.map((trait) => ({
          kind: trait.kind,
          traitId: trait.trait_id,
          value: trait.value,
        })),
      },
    };
  }
}
