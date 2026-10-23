import type { Database } from "../client.js";

export const ALPHA_IDENTITY_ALIASES = [
  "player-one",
  "player-two",
  "storyteller-one",
  "outsider-one",
] as const;

export type AlphaIdentityAlias = (typeof ALPHA_IDENTITY_ALIASES)[number];
export type AlphaEnvironment = "ci" | "local" | "test";

export const ALPHA_FIXTURE_IDS = {
  accounts: {
    outsiderOne: "019a0000-0000-7000-8000-000000000004",
    playerOne: "019a0000-0000-7000-8000-000000000001",
    playerTwo: "019a0000-0000-7000-8000-000000000002",
    storytellerOne: "019a0000-0000-7000-8000-000000000003",
  },
  binding: "019a0000-0000-7000-8000-000000000040",
  character: "019a0000-0000-7000-8000-000000000020",
  chronicle: "019a0000-0000-7000-8000-000000000030",
  memberships: {
    playerOne: "019a0000-0000-7000-8000-000000000031",
    playerTwo: "019a0000-0000-7000-8000-000000000032",
    storytellerOne: "019a0000-0000-7000-8000-000000000033",
  },
  ruleProfile: "019a0000-0000-7000-8000-000000000010",
  ruleProfileRevision: "019a0000-0000-7000-8000-000000000011",
  scene: "019a0000-0000-7000-8000-000000000060",
  session: "019a0000-0000-7000-8000-000000000050",
} as const;

export const ALPHA_IDENTITIES: Readonly<
  Record<AlphaIdentityAlias, { readonly accountId: string; readonly displayName: string }>
> = {
  "outsider-one": {
    accountId: ALPHA_FIXTURE_IDS.accounts.outsiderOne,
    displayName: "Visitante Um",
  },
  "player-one": {
    accountId: ALPHA_FIXTURE_IDS.accounts.playerOne,
    displayName: "Jogadora Um",
  },
  "player-two": {
    accountId: ALPHA_FIXTURE_IDS.accounts.playerTwo,
    displayName: "Jogador Dois",
  },
  "storyteller-one": {
    accountId: ALPHA_FIXTURE_IDS.accounts.storytellerOne,
    displayName: "Narradora Um",
  },
};

const alphaEnvironments: readonly AlphaEnvironment[] = ["ci", "local", "test"];
const seedTimestamp = "2026-10-21T00:00:00.000Z";

export function assertAlphaEnvironment(
  environment: string | undefined,
): asserts environment is AlphaEnvironment {
  if (!alphaEnvironments.includes(environment as AlphaEnvironment)) {
    throw new Error(
      "O contexto fictício do alpha só pode ser usado em local, test ou ci.",
    );
  }
}

export async function seedAlphaContext(
  database: Database,
  environment: string | undefined,
): Promise<void> {
  assertAlphaEnvironment(environment);

  await database.transaction().execute(async (transaction) => {
    await transaction
      .insertInto("account")
      .values(
        Object.values(ALPHA_IDENTITIES).map((identity) => ({
          created_at: seedTimestamp,
          display_name: identity.displayName,
          id: identity.accountId,
          status: "active" as const,
          updated_at: seedTimestamp,
        })),
      )
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          display_name: excluded.ref("excluded.display_name"),
          status: excluded.ref("excluded.status"),
          updated_at: excluded.ref("excluded.updated_at"),
        })),
      )
      .execute();

    await transaction
      .insertInto("rule_set_profile_revision")
      .values({
        created_at: seedTimestamp,
        definition: {
          profileId: "v5-core-companion-pg-2023",
          profileRevisionId: "v5-core-companion-pg-2023-r1",
        },
        id: ALPHA_FIXTURE_IDS.ruleProfileRevision,
        profile_id: ALPHA_FIXTURE_IDS.ruleProfile,
        published_at: seedTimestamp,
        revision: 1,
        status: "published",
      })
      .onConflict((conflict) => conflict.column("id").doNothing())
      .execute();

    await transaction
      .insertInto("character")
      .values({
        concept: "Investigadora que ainda procura entender a própria noite.",
        created_at: seedTimestamp,
        forked_from_character_id: null,
        hunger: 2,
        id: ALPHA_FIXTURE_IDS.character,
        kind: "CLAN_VAMPIRE",
        name: "Noemi Vale",
        owner_account_id: ALPHA_FIXTURE_IDS.accounts.playerOne,
        rule_set_profile_revision_id: ALPHA_FIXTURE_IDS.ruleProfileRevision,
        state: "ready",
        updated_at: seedTimestamp,
        version: 0,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          concept: excluded.ref("excluded.concept"),
          hunger: excluded.ref("excluded.hunger"),
          kind: excluded.ref("excluded.kind"),
          name: excluded.ref("excluded.name"),
          owner_account_id: excluded.ref("excluded.owner_account_id"),
          rule_set_profile_revision_id: excluded.ref(
            "excluded.rule_set_profile_revision_id",
          ),
          state: excluded.ref("excluded.state"),
          updated_at: excluded.ref("excluded.updated_at"),
          version: excluded.ref("excluded.version"),
        })),
      )
      .execute();

    await transaction
      .insertInto("character_trait")
      .values([
        {
          character_id: ALPHA_FIXTURE_IDS.character,
          kind: "ATTRIBUTE",
          trait_id: "attribute:composure",
          updated_at: seedTimestamp,
          value: 3,
        },
        {
          character_id: ALPHA_FIXTURE_IDS.character,
          kind: "ATTRIBUTE",
          trait_id: "attribute:resolve",
          updated_at: seedTimestamp,
          value: 2,
        },
        {
          character_id: ALPHA_FIXTURE_IDS.character,
          kind: "SKILL",
          trait_id: "skill:awareness",
          updated_at: seedTimestamp,
          value: 2,
        },
        {
          character_id: ALPHA_FIXTURE_IDS.character,
          kind: "SKILL",
          trait_id: "skill:occult",
          updated_at: seedTimestamp,
          value: 1,
        },
      ])
      .onConflict((conflict) =>
        conflict
          .columns(["character_id", "kind", "trait_id"])
          .doUpdateSet((excluded) => ({
            updated_at: excluded.ref("excluded.updated_at"),
            value: excluded.ref("excluded.value"),
          })),
      )
      .execute();

    await transaction
      .insertInto("chronicle")
      .values({
        administrative_owner_account_id: ALPHA_FIXTURE_IDS.accounts.storytellerOne,
        created_at: seedTimestamp,
        description: "Crônica inteiramente fictícia para a prova técnica do alpha.",
        id: ALPHA_FIXTURE_IDS.chronicle,
        rule_set_profile_revision_id: ALPHA_FIXTURE_IDS.ruleProfileRevision,
        state: "active",
        title: "Ecos sob a Chuva",
        updated_at: seedTimestamp,
        version: 0,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          administrative_owner_account_id: excluded.ref(
            "excluded.administrative_owner_account_id",
          ),
          description: excluded.ref("excluded.description"),
          rule_set_profile_revision_id: excluded.ref(
            "excluded.rule_set_profile_revision_id",
          ),
          state: excluded.ref("excluded.state"),
          title: excluded.ref("excluded.title"),
          updated_at: excluded.ref("excluded.updated_at"),
          version: excluded.ref("excluded.version"),
        })),
      )
      .execute();

    await transaction
      .insertInto("chronicle_membership")
      .values([
        {
          account_id: ALPHA_FIXTURE_IDS.accounts.playerOne,
          chronicle_id: ALPHA_FIXTURE_IDS.chronicle,
          created_at: seedTimestamp,
          id: ALPHA_FIXTURE_IDS.memberships.playerOne,
          roles: ["PLAYER"],
          status: "active",
          updated_at: seedTimestamp,
        },
        {
          account_id: ALPHA_FIXTURE_IDS.accounts.playerTwo,
          chronicle_id: ALPHA_FIXTURE_IDS.chronicle,
          created_at: seedTimestamp,
          id: ALPHA_FIXTURE_IDS.memberships.playerTwo,
          roles: ["PLAYER"],
          status: "active",
          updated_at: seedTimestamp,
        },
        {
          account_id: ALPHA_FIXTURE_IDS.accounts.storytellerOne,
          chronicle_id: ALPHA_FIXTURE_IDS.chronicle,
          created_at: seedTimestamp,
          id: ALPHA_FIXTURE_IDS.memberships.storytellerOne,
          roles: ["STORYTELLER"],
          status: "active",
          updated_at: seedTimestamp,
        },
      ])
      .onConflict((conflict) =>
        conflict.columns(["chronicle_id", "account_id"]).doUpdateSet((excluded) => ({
          roles: excluded.ref("excluded.roles"),
          status: excluded.ref("excluded.status"),
          updated_at: excluded.ref("excluded.updated_at"),
        })),
      )
      .execute();

    await transaction
      .insertInto("character_binding")
      .values({
        approved_by_account_id: ALPHA_FIXTURE_IDS.accounts.storytellerOne,
        character_id: ALPHA_FIXTURE_IDS.character,
        chronicle_alias: null,
        chronicle_id: ALPHA_FIXTURE_IDS.chronicle,
        chronicle_notes: null,
        created_at: seedTimestamp,
        id: ALPHA_FIXTURE_IDS.binding,
        membership_id: ALPHA_FIXTURE_IDS.memberships.playerOne,
        requested_by_account_id: ALPHA_FIXTURE_IDS.accounts.playerOne,
        state: "active",
        updated_at: seedTimestamp,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          approved_by_account_id: excluded.ref("excluded.approved_by_account_id"),
          character_id: excluded.ref("excluded.character_id"),
          chronicle_id: excluded.ref("excluded.chronicle_id"),
          membership_id: excluded.ref("excluded.membership_id"),
          requested_by_account_id: excluded.ref("excluded.requested_by_account_id"),
          state: excluded.ref("excluded.state"),
          updated_at: excluded.ref("excluded.updated_at"),
        })),
      )
      .execute();

    await transaction
      .insertInto("game_session")
      .values({
        chronicle_id: ALPHA_FIXTURE_IDS.chronicle,
        created_at: seedTimestamp,
        ended_at: null,
        id: ALPHA_FIXTURE_IDS.session,
        scheduled_at: seedTimestamp,
        started_at: seedTimestamp,
        state: "active",
        updated_at: seedTimestamp,
        version: 0,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          chronicle_id: excluded.ref("excluded.chronicle_id"),
          ended_at: excluded.ref("excluded.ended_at"),
          scheduled_at: excluded.ref("excluded.scheduled_at"),
          started_at: excluded.ref("excluded.started_at"),
          state: excluded.ref("excluded.state"),
          updated_at: excluded.ref("excluded.updated_at"),
          version: excluded.ref("excluded.version"),
        })),
      )
      .execute();

    await transaction
      .insertInto("scene")
      .values({
        created_at: seedTimestamp,
        id: ALPHA_FIXTURE_IDS.scene,
        published_description:
          "A chuva cobre a cidade quando uma mensagem interrompe o silêncio.",
        session_id: ALPHA_FIXTURE_IDS.session,
        state: "active",
        storyteller_notes: "Anotação fictícia reservada para testar visibilidade.",
        title: "O primeiro chamado",
        updated_at: seedTimestamp,
        version: 0,
      })
      .onConflict((conflict) =>
        conflict.column("id").doUpdateSet((excluded) => ({
          published_description: excluded.ref("excluded.published_description"),
          session_id: excluded.ref("excluded.session_id"),
          state: excluded.ref("excluded.state"),
          storyteller_notes: excluded.ref("excluded.storyteller_notes"),
          title: excluded.ref("excluded.title"),
          updated_at: excluded.ref("excluded.updated_at"),
          version: excluded.ref("excluded.version"),
        })),
      )
      .execute();

    await transaction
      .insertInto("session_stream")
      .values({ session_id: ALPHA_FIXTURE_IDS.session, last_sequence: 0 })
      .onConflict((conflict) => conflict.column("session_id").doNothing())
      .execute();
  });
}
