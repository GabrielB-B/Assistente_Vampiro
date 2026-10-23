import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDatabase } from "../src/client.js";
import { migrateToLatest } from "../src/migrations/migrator.js";
import {
  ALPHA_FIXTURE_IDS,
  ALPHA_IDENTITIES,
  seedAlphaContext,
} from "../src/seeds/alpha-context.js";
import {
  createLocalTestDatabaseConfig,
  dropLocalTestSchema,
} from "./support/local-test-database.js";

describe("seed do contexto fictício do alpha", () => {
  const config = createLocalTestDatabaseConfig("alpha_seed");

  beforeAll(async () => {
    await migrateToLatest(config);
  });

  afterAll(async () => {
    await dropLocalTestSchema(config);
  });

  it("é repetível e mantém somente o conjunto determinístico", async () => {
    const database = createDatabase(config);

    try {
      await seedAlphaContext(database, "test");
      await seedAlphaContext(database, "test");

      const accounts = await database
        .selectFrom("account")
        .select(["id", "display_name"])
        .where(
          "id",
          "in",
          Object.values(ALPHA_IDENTITIES).map((identity) => identity.accountId),
        )
        .execute();
      const memberships = await database
        .selectFrom("chronicle_membership")
        .select(({ fn }) => fn.countAll<string>().as("count"))
        .where("chronicle_id", "=", ALPHA_FIXTURE_IDS.chronicle)
        .executeTakeFirstOrThrow();
      const traits = await database
        .selectFrom("character_trait")
        .select(["kind", "trait_id", "value"])
        .where("character_id", "=", ALPHA_FIXTURE_IDS.character)
        .orderBy("trait_id")
        .execute();
      const fixtureCounts = await Promise.all([
        database
          .selectFrom("character")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.character)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("chronicle")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.chronicle)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("character_binding")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.binding)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("game_session")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.session)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("scene")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.scene)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("session_stream")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("session_id", "=", ALPHA_FIXTURE_IDS.session)
          .executeTakeFirstOrThrow(),
        database
          .selectFrom("rule_set_profile_revision")
          .select(({ fn }) => fn.countAll<string>().as("count"))
          .where("id", "=", ALPHA_FIXTURE_IDS.ruleProfileRevision)
          .executeTakeFirstOrThrow(),
      ]);

      expect(accounts).toHaveLength(4);
      expect(memberships.count).toBe("3");
      expect(fixtureCounts.map(({ count }) => count)).toEqual([
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
      ]);
      expect(traits).toEqual([
        { kind: "ATTRIBUTE", trait_id: "attribute:composure", value: 3 },
        { kind: "ATTRIBUTE", trait_id: "attribute:resolve", value: 2 },
        { kind: "SKILL", trait_id: "skill:awareness", value: 2 },
        { kind: "SKILL", trait_id: "skill:occult", value: 1 },
      ]);
    } finally {
      await database.destroy();
    }
  });

  it("mantém outsider sem Participação e vincula apenas a personagem da Jogadora Um", async () => {
    const database = createDatabase(config);

    try {
      await seedAlphaContext(database, "test");

      const outsiderMembership = await database
        .selectFrom("chronicle_membership")
        .select("id")
        .where("account_id", "=", ALPHA_FIXTURE_IDS.accounts.outsiderOne)
        .executeTakeFirst();
      const binding = await database
        .selectFrom("character_binding")
        .select(["character_id", "membership_id", "state"])
        .where("id", "=", ALPHA_FIXTURE_IDS.binding)
        .executeTakeFirstOrThrow();

      expect(outsiderMembership).toBeUndefined();
      expect(binding).toEqual({
        character_id: ALPHA_FIXTURE_IDS.character,
        membership_id: ALPHA_FIXTURE_IDS.memberships.playerOne,
        state: "active",
      });
    } finally {
      await database.destroy();
    }
  });

  it("rejeita valores e IDs incompatíveis com o tipo da característica", async () => {
    const database = createDatabase(config);

    try {
      await seedAlphaContext(database, "test");

      await expect(
        database
          .insertInto("character_trait")
          .values({
            character_id: ALPHA_FIXTURE_IDS.character,
            kind: "ATTRIBUTE",
            trait_id: "attribute:invalid-zero",
            value: 0,
          })
          .execute(),
      ).rejects.toThrow();
      await expect(
        database
          .insertInto("character_trait")
          .values({
            character_id: ALPHA_FIXTURE_IDS.character,
            kind: "ATTRIBUTE",
            trait_id: "skill:invalid-kind",
            value: 1,
          })
          .execute(),
      ).rejects.toThrow();
    } finally {
      await database.destroy();
    }
  });
});
