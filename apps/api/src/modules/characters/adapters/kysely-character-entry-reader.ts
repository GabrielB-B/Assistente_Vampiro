import type {
  CharacterEntrySummaryView,
  CharacterSheetView,
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

function referenceKey(characterId: string, chronicleId: string): string {
  return `${characterId}:${chronicleId}`;
}

export class KyselyCharacterEntryReader implements CharacterEntryReader {
  constructor(private readonly database: Database) {}

  async listAccessCandidates(
    accountId: string,
  ): Promise<readonly CharacterAccessCandidate[]> {
    const rows = await this.database
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
      .execute();

    return rows.map((row) => ({
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
    }));
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
    const chronicleIds = [...new Set(references.map(({ chronicleId }) => chronicleId))];
    const accessModes = new Map(
      references.map((reference) => [
        referenceKey(reference.characterId, reference.chronicleId),
        reference.accessMode,
      ]),
    );
    const summariesPromise = this.database
      .selectFrom("character as character_record")
      .innerJoin(
        "character_binding as binding",
        "binding.character_id",
        "character_record.id",
      )
      .innerJoin("chronicle", "chronicle.id", "binding.chronicle_id")
      .select([
        "character_record.concept",
        "character_record.id as character_id",
        "character_record.name as character_name",
        "character_record.state as character_state",
        "chronicle.id as chronicle_id",
        "chronicle.title as chronicle_title",
      ])
      .where("character_record.id", "in", characterIds)
      .where("chronicle.id", "in", chronicleIds)
      .where("binding.state", "=", "active")
      .orderBy("chronicle.title")
      .orderBy("character_record.name")
      .execute();
    const [account, rows] = await Promise.all([accountPromise, summariesPromise]);

    if (account === undefined) {
      return undefined;
    }

    const characters = rows.flatMap((row): CharacterEntrySummaryView[] => {
      const accessMode = accessModes.get(
        referenceKey(row.character_id, row.chronicle_id),
      );
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
  ): Promise<CharacterSheetView | undefined> {
    const corePromise = this.database
      .selectFrom("character as character_record")
      .innerJoin(
        "character_binding as binding",
        "binding.character_id",
        "character_record.id",
      )
      .innerJoin("chronicle", "chronicle.id", "binding.chronicle_id")
      .select([
        "character_record.concept",
        "character_record.hunger",
        "character_record.id as character_id",
        "character_record.kind",
        "character_record.name as character_name",
        "character_record.rule_set_profile_revision_id",
        "character_record.state as character_state",
        "character_record.version as character_version",
        "chronicle.description as chronicle_description",
        "chronicle.id as chronicle_id",
        "chronicle.title as chronicle_title",
      ])
      .where("character_record.id", "=", reference.characterId)
      .where("chronicle.id", "=", reference.chronicleId)
      .where("binding.state", "=", "active")
      .executeTakeFirst();
    const traitsPromise = this.database
      .selectFrom("character_trait")
      .select(["kind", "trait_id", "value"])
      .where("character_id", "=", reference.characterId)
      .orderBy("kind")
      .orderBy("trait_id")
      .execute();
    const sessionPromise = this.database
      .selectFrom("game_session as session_record")
      .leftJoin("scene", (join) =>
        join
          .onRef("scene.session_id", "=", "session_record.id")
          .on("scene.state", "=", "active"),
      )
      .select([
        "scene.id as scene_id",
        "scene.published_description",
        "scene.title as scene_title",
        "scene.version as scene_version",
        "session_record.id as session_id",
        "session_record.state as session_state",
        "session_record.version as session_version",
      ])
      .where("session_record.chronicle_id", "=", reference.chronicleId)
      .where("session_record.state", "=", "active")
      .orderBy("session_record.started_at", "desc")
      .orderBy("scene.updated_at", "desc")
      .executeTakeFirst();
    const [core, traits, session] = await Promise.all([
      corePromise,
      traitsPromise,
      sessionPromise,
    ]);

    if (core === undefined) {
      return undefined;
    }

    return {
      accessMode: reference.accessMode,
      character: {
        concept: core.concept,
        hunger: core.hunger,
        id: core.character_id,
        kind: core.kind,
        name: core.character_name,
        state: core.character_state,
        version: core.character_version,
      },
      chronicle: {
        description: core.chronicle_description,
        id: core.chronicle_id,
        title: core.chronicle_title,
      },
      ruleSetProfileRevisionId: core.rule_set_profile_revision_id,
      scene:
        session?.scene_id === null || session?.scene_id === undefined
          ? null
          : {
              id: session.scene_id,
              publishedDescription: session.published_description,
              title: session.scene_title ?? "Cena sem título",
              version: session.scene_version ?? 0,
            },
      session:
        session === undefined
          ? null
          : {
              id: session.session_id,
              state: session.session_state,
              version: session.session_version,
            },
      traits: traits.map((trait) => ({
        kind: trait.kind,
        traitId: trait.trait_id,
        value: trait.value,
      })),
    };
  }
}
