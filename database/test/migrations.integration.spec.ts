import { sql } from "kysely";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { checkDatabaseConnection, createDatabase } from "../src/client.js";
import {
  migrateToLatest,
  readMigrationStatus,
  rollbackLastMigration,
} from "../src/migrations/migrator.js";
import {
  createLocalTestDatabaseConfig,
  dropLocalTestSchema,
} from "./support/local-test-database.js";

describe("migrações de produção", () => {
  const config = createLocalTestDatabaseConfig("migrations");

  beforeAll(async () => {
    await migrateToLatest(config);
  });

  afterAll(async () => {
    await dropLocalTestSchema(config);
  });

  it("aplica todo o schema em um banco vazio", async () => {
    const database = createDatabase(config);

    try {
      await checkDatabaseConnection(database);
      const tables = await sql<{ table_name: string }>`
        select table_name
        from information_schema.tables
        where table_schema = ${config.schema}
          and table_type = 'BASE TABLE'
        order by table_name
      `.execute(database);
      const timezone = await sql<{ TimeZone: string }>`show timezone`.execute(database);
      const version = await sql<{ server_version: string }>`show server_version`.execute(
        database,
      );

      expect(tables.rows.map((row) => row.table_name)).toEqual(
        expect.arrayContaining([
          "account",
          "audit_entry",
          "character",
          "character_binding",
          "character_conviction_pair",
          "character_draft_request",
          "character_trait",
          "chronicle",
          "chronicle_membership",
          "game_session",
          "outbox_message",
          "roll_attempt",
          "rule_set_profile_revision",
          "scene",
          "session_event",
          "session_stream",
        ]),
      );
      expect(timezone.rows[0]?.TimeZone).toBe("UTC");
      expect(version.rows[0]?.server_version).toMatch(/^18\./);
    } finally {
      await database.destroy();
    }
  });

  it("registra as oito migrações como aplicadas", async () => {
    const status = await readMigrationStatus(config);

    expect(status.map((migration) => migration.name)).toEqual([
      "001_initial_domain",
      "002_session_history",
      "003_character_traits",
      "004_character_draft_kind",
      "005_character_draft_request",
      "006_character_concept",
      "007_character_clan",
      "008_character_skills",
      "009_character_disciplines",
    ]);
    expect(status.every((migration) => migration.executedAt !== undefined)).toBe(true);
  });

  it("materializa as invariantes críticas no PostgreSQL", async () => {
    const database = createDatabase(config);

    try {
      const constraints = await sql<{ conname: string }>`
        select constraint_record.conname
        from pg_constraint as constraint_record
        inner join pg_namespace as namespace
          on namespace.oid = constraint_record.connamespace
        where namespace.nspname = ${config.schema}
      `.execute(database);
      const indexes = await sql<{ indexname: string }>`
        select indexname
        from pg_indexes
        where schemaname = ${config.schema}
      `.execute(database);
      const triggers = await sql<{ tgname: string }>`
        select trigger_record.tgname
        from pg_trigger as trigger_record
        inner join pg_class as table_record on table_record.oid = trigger_record.tgrelid
        inner join pg_namespace as namespace on namespace.oid = table_record.relnamespace
        where namespace.nspname = ${config.schema}
          and not trigger_record.tgisinternal
      `.execute(database);

      expect(constraints.rows.map((row) => row.conname)).toEqual(
        expect.arrayContaining([
          "ck_roll_special_result",
          "ck_character_trait_kind_matches_id",
          "ck_character_trait_value_by_kind",
          "ck_character_non_draft_kind",
          "ck_character_conviction_pair_has_content",
          "fk_roll_scene_session",
          "uq_roll_attempt_idempotency",
          "uq_session_event_sequence",
        ]),
      );
      expect(indexes.rows.map((row) => row.indexname)).toEqual(
        expect.arrayContaining([
          "ix_outbox_pending",
          "uq_active_binding_per_character",
          "uq_active_scene_per_session",
        ]),
      );
      expect(triggers.rows.map((row) => row.tgname)).toEqual(
        expect.arrayContaining([
          "prevent_audit_entry_mutation",
          "prevent_roll_attempt_mutation",
          "prevent_session_event_mutation",
        ]),
      );
    } finally {
      await database.destroy();
    }
  });

  it("permite kind nulo somente durante draft e não fixa compatibilidade de Fome", async () => {
    const database = createDatabase(config);

    try {
      await database
        .insertInto("account")
        .values({
          display_name: "Teste",
          id: "019a0000-0000-7000-8000-000000000099",
        })
        .execute();
      await expect(
        database
          .insertInto("character")
          .values({
            hunger: 3,
            id: "019a0000-0000-7000-8000-000000000098",
            kind: null,
            name: "",
            owner_account_id: "019a0000-0000-7000-8000-000000000099",
            state: "draft",
          })
          .execute(),
      ).resolves.toBeDefined();
      await expect(
        database
          .insertInto("character")
          .values({
            id: "019a0000-0000-7000-8000-000000000097",
            kind: null,
            name: "Pronto",
            owner_account_id: "019a0000-0000-7000-8000-000000000099",
            state: "ready",
          })
          .execute(),
      ).rejects.toThrow();
    } finally {
      await database
        .deleteFrom("character")
        .where("owner_account_id", "=", "019a0000-0000-7000-8000-000000000099")
        .execute();
      await database
        .deleteFrom("account")
        .where("id", "=", "019a0000-0000-7000-8000-000000000099")
        .execute();
      await database.destroy();
    }
  });

  it("persiste Convicção e Pilar como um par progressivo do personagem", async () => {
    const database = createDatabase(config);
    const accountId = "019a0000-0000-7000-8000-000000000096";
    const characterId = "019a0000-0000-7000-8000-000000000095";

    try {
      await database
        .insertInto("account")
        .values({ display_name: "Teste Conceito", id: accountId })
        .execute();
      await database
        .insertInto("character")
        .values({ id: characterId, kind: null, name: "", owner_account_id: accountId })
        .execute();
      await database
        .insertInto("character_conviction_pair")
        .values({
          character_id: characterId,
          conviction: "Nunca abandonar inocentes.",
          position: 0,
          touchstone: "Helena",
        })
        .execute();

      await expect(
        database
          .insertInto("character_conviction_pair")
          .values({
            character_id: characterId,
            conviction: null,
            position: 1,
            touchstone: null,
          })
          .execute(),
      ).rejects.toThrow();
    } finally {
      await database
        .deleteFrom("character_conviction_pair")
        .where("character_id", "=", characterId)
        .execute();
      await database.deleteFrom("character").where("id", "=", characterId).execute();
      await database.deleteFrom("account").where("id", "=", accountId).execute();
      await database.destroy();
    }
  });

  it("reverte e reaplica o último incremento sem afetar o domínio inicial", async () => {
    await rollbackLastMigration(config);
    const database = createDatabase(config);

    try {
      const tables = await sql<{ table_name: string }>`
        select table_name
        from information_schema.tables
        where table_schema = ${config.schema}
          and table_name in (
            'account',
            'character_conviction_pair',
            'character_discipline',
            'character_discipline_power',
            'character_draft_request',
            'character_specialty',
            'character_trait',
            'session_event'
          )
        order by table_name
      `.execute(database);

      expect(tables.rows.map((row) => row.table_name)).toEqual([
        "account",
        "character_conviction_pair",
        "character_draft_request",
        "character_specialty",
        "character_trait",
        "session_event",
      ]);
      const skillMethodColumn = await sql<{ column_name: string }>`
        select column_name
        from information_schema.columns
        where table_schema = ${config.schema}
          and table_name = 'character'
          and column_name = 'creation_skill_method'
      `.execute(database);
      expect(skillMethodColumn.rows).toEqual([{ column_name: "creation_skill_method" }]);
    } finally {
      await database.destroy();
    }

    await migrateToLatest(config);
  });
});
