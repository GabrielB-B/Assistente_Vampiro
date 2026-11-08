import type { Database } from "@assistente-vampiro/database";
import {
  CREATION_ATTRIBUTE_IDS,
  CREATION_SKILL_IDS,
  type CreationAttributeId,
  type CreationSkillId,
  type CreationDisciplineId,
  type DisciplinePowerId,
} from "@assistente-vampiro/contracts";
import { RULE_SET_PROFILE_REVISION_ID } from "@assistente-vampiro/rules-engine";
import { sql } from "kysely";

import type {
  CharacterSheetWriteResult,
  CharacterSheetWriter,
  StartCharacterDraftWriteCommand,
  UpdateCharacterAttributesCommand,
  UpdateCharacterIdentityCommand,
  UpdateCreationClanWriteCommand,
  UpdateCreationConceptWriteCommand,
  UpdateCreationSkillsWriteCommand,
  UpdateCreationDisciplinesWriteCommand,
} from "../application/character-sheet-writer.js";

export class KyselyCharacterSheetWriter implements CharacterSheetWriter {
  constructor(private readonly database: Database) {}

  async readCreationContext(characterId: string) {
    const [
      character,
      convictionPairs,
      attributeRows,
      skillRows,
      specialties,
      disciplines,
      disciplinePowers,
    ] = await Promise.all([
      this.database
        .selectFrom("character")
        .leftJoin(
          "rule_set_profile_revision as profile",
          "profile.id",
          "character.rule_set_profile_revision_id",
        )
        .select([
          "character.ambition",
          "character.clan_id",
          "character.concept",
          "character.creation_skill_method",
          "character.desire",
          "character.kind",
          "character.name",
          "character.sire",
          "character.version",
          sql<string | null>`profile.definition ->> 'profileRevisionId'`.as(
            "creation_profile_revision_id",
          ),
        ])
        .where("character.id", "=", characterId)
        .executeTakeFirstOrThrow(),
      this.database
        .selectFrom("character_conviction_pair")
        .select(["conviction", "position", "touchstone"])
        .where("character_id", "=", characterId)
        .orderBy("position")
        .execute(),
      this.database
        .selectFrom("character_trait")
        .select(["trait_id", "value"])
        .where("character_id", "=", characterId)
        .where("kind", "=", "ATTRIBUTE")
        .execute(),
      this.database
        .selectFrom("character_trait")
        .select(["trait_id", "value"])
        .where("character_id", "=", characterId)
        .where("kind", "=", "SKILL")
        .execute(),
      this.database
        .selectFrom("character_specialty")
        .select(["id", "label", "origin", "skill_id"])
        .where("character_id", "=", characterId)
        .orderBy("position")
        .execute(),
      this.database
        .selectFrom("character_discipline")
        .select(["discipline_id", "rating"])
        .where("character_id", "=", characterId)
        .orderBy("discipline_id")
        .execute(),
      this.database
        .selectFrom("character_discipline_power")
        .select(["discipline_id", "power_id", "power_rule_revision_id"])
        .where("character_id", "=", characterId)
        .orderBy("power_id")
        .execute(),
    ]);
    return {
      attributes: Object.fromEntries(
        attributeRows
          .filter((row) =>
            CREATION_ATTRIBUTE_IDS.includes(row.trait_id as CreationAttributeId),
          )
          .map((row) => [row.trait_id, row.value]),
      ),
      clanId: character.clan_id as UpdateCreationClanWriteCommand["clanId"],
      convictionPairs,
      creationProfileRevisionId: character.creation_profile_revision_id,
      identity: {
        ambition: character.ambition,
        concept: character.concept,
        desire: character.desire,
        name: character.name,
        sire: character.sire,
      },
      kind: character.kind,
      skillMethodId: character.creation_skill_method,
      skills: Object.fromEntries(
        skillRows
          .filter((row) => CREATION_SKILL_IDS.includes(row.trait_id as CreationSkillId))
          .map((row) => [row.trait_id, row.value]),
      ),
      specialties: specialties.map((specialty) => ({
        id: specialty.id,
        label: specialty.label,
        origin: specialty.origin,
        skillId: specialty.skill_id as CreationSkillId,
      })),
      disciplines: disciplines.map((item) => ({
        disciplineId: item.discipline_id as CreationDisciplineId,
        rating: item.rating,
        structuralMaximum: 5 as const,
      })),
      disciplinePowers: disciplinePowers.map((item) => ({
        disciplineId: item.discipline_id as CreationDisciplineId,
        powerId: item.power_id as DisciplinePowerId,
        powerRuleRevisionId: item.power_rule_revision_id,
      })),
      version: character.version,
    };
  }

  async readCreationClan(characterId: string) {
    const character = await this.database
      .selectFrom("character")
      .select(["clan_id", "kind", "version"])
      .where("id", "=", characterId)
      .executeTakeFirstOrThrow();
    return {
      clanId: character.clan_id as UpdateCreationClanWriteCommand["clanId"],
      kind: character.kind,
      version: character.version,
    };
  }

  async readCreationConcept(characterId: string) {
    const [character, convictionPairs, chronicle] = await Promise.all([
      this.database
        .selectFrom("character")
        .select(["ambition", "concept", "desire", "name", "sire", "version"])
        .where("id", "=", characterId)
        .executeTakeFirstOrThrow(),
      this.database
        .selectFrom("character_conviction_pair")
        .select(["conviction", "position", "touchstone"])
        .where("character_id", "=", characterId)
        .orderBy("position")
        .execute(),
      this.database
        .selectFrom("character_binding as binding")
        .innerJoin("chronicle", "chronicle.id", "binding.chronicle_id")
        .select(["chronicle.id", "chronicle.title"])
        .where("binding.character_id", "=", characterId)
        .where("binding.state", "=", "active")
        .executeTakeFirst(),
    ]);

    return {
      chronicle: chronicle ?? null,
      convictionPairs,
      identity: {
        ambition: character.ambition,
        concept: character.concept,
        desire: character.desire,
        name: character.name,
        sire: character.sire,
      },
      version: character.version,
    };
  }

  async readCreationAttributes(characterId: string): Promise<{
    readonly attributes: Readonly<Partial<Record<CreationAttributeId, number>>>;
    readonly version: number;
  }> {
    const [character, rows] = await Promise.all([
      this.database
        .selectFrom("character")
        .select("version")
        .where("id", "=", characterId)
        .executeTakeFirstOrThrow(),
      this.database
        .selectFrom("character_trait")
        .select(["trait_id", "value"])
        .where("character_id", "=", characterId)
        .where("kind", "=", "ATTRIBUTE")
        .execute(),
    ]);
    return {
      attributes: Object.fromEntries(
        rows
          .filter((row) =>
            CREATION_ATTRIBUTE_IDS.includes(row.trait_id as CreationAttributeId),
          )
          .map((row) => [row.trait_id, row.value]),
      ),
      version: character.version,
    };
  }

  async readCreationSkills(characterId: string) {
    const [character, rows, specialties] = await Promise.all([
      this.database
        .selectFrom("character")
        .select(["creation_skill_method", "version"])
        .where("id", "=", characterId)
        .executeTakeFirstOrThrow(),
      this.database
        .selectFrom("character_trait")
        .select(["trait_id", "value"])
        .where("character_id", "=", characterId)
        .where("kind", "=", "SKILL")
        .execute(),
      this.database
        .selectFrom("character_specialty")
        .select(["id", "label", "origin", "skill_id"])
        .where("character_id", "=", characterId)
        .orderBy("position")
        .execute(),
    ]);
    return {
      methodId: character.creation_skill_method,
      skills: Object.fromEntries(
        rows
          .filter((row) => CREATION_SKILL_IDS.includes(row.trait_id as CreationSkillId))
          .map((row) => [row.trait_id, row.value]),
      ),
      specialties: specialties.map((specialty) => ({
        id: specialty.id,
        label: specialty.label,
        origin: specialty.origin,
        skillId: specialty.skill_id as CreationSkillId,
      })),
      version: character.version,
    };
  }

  startDraft(command: StartCharacterDraftWriteCommand): Promise<{
    readonly characterId: string;
    readonly created: boolean;
    readonly version: number;
  }> {
    return this.database.transaction().execute(async (transaction) => {
      await sql`
        select pg_advisory_xact_lock(
          hashtextextended(${`${command.actorAccountId}:${command.idempotencyKey}`}, 0)
        )
      `.execute(transaction);

      const existing = await transaction
        .selectFrom("character_draft_request as request")
        .innerJoin("character", "character.id", "request.character_id")
        .select(["character.id", "character.version"])
        .where("request.owner_account_id", "=", command.actorAccountId)
        .where("request.idempotency_key", "=", command.idempotencyKey)
        .executeTakeFirst();
      if (existing !== undefined) {
        return {
          characterId: existing.id,
          created: false,
          version: existing.version,
        };
      }

      const profile = await transaction
        .selectFrom("rule_set_profile_revision")
        .select("id")
        .where("status", "=", "published")
        .where(
          sql<boolean>`definition ->> 'profileRevisionId' = ${RULE_SET_PROFILE_REVISION_ID}`,
        )
        .executeTakeFirstOrThrow();

      await transaction
        .insertInto("character")
        .values({
          concept: null,
          forked_from_character_id: null,
          hunger: null,
          id: command.characterId,
          kind: null,
          name: "",
          owner_account_id: command.actorAccountId,
          rule_set_profile_revision_id: profile.id,
          state: "draft",
          version: 0,
        })
        .execute();
      await transaction
        .insertInto("character_trait")
        .values(
          CREATION_ATTRIBUTE_IDS.map((traitId) => ({
            character_id: command.characterId,
            kind: "ATTRIBUTE" as const,
            trait_id: traitId,
            value: 1,
          })),
        )
        .execute();
      await transaction
        .insertInto("character_draft_request")
        .values({
          character_id: command.characterId,
          idempotency_key: command.idempotencyKey,
          owner_account_id: command.actorAccountId,
        })
        .execute();
      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.draft.started",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            profileRevisionId: RULE_SET_PROFILE_REVISION_ID,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();

      return { characterId: command.characterId, created: true, version: 0 };
    });
  }

  updateCreationAttributes(
    command: UpdateCharacterAttributesCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const updated = await transaction
        .updateTable("character")
        .set({ updated_at: new Date(), version: sql<number>`version + 1` })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("state", "=", "draft")
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();
      if (updated === undefined) {
        return { status: "version-conflict" };
      }

      const entries = Object.entries(command.attributes) as [
        CreationAttributeId,
        number,
      ][];
      if (entries.length > 0) {
        await transaction
          .insertInto("character_trait")
          .values(
            entries.map(([traitId, value]) => ({
              character_id: command.characterId,
              kind: "ATTRIBUTE" as const,
              trait_id: traitId,
              updated_at: new Date(),
              value,
            })),
          )
          .onConflict((conflict) =>
            conflict
              .columns(["character_id", "kind", "trait_id"])
              .doUpdateSet((excluded) => ({
                updated_at: excluded.ref("excluded.updated_at"),
                value: excluded.ref("excluded.value"),
              })),
          )
          .execute();
      }

      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.creation.attributes.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            changedTraits: entries.map(([traitId]) => traitId),
            expectedVersion: command.expectedVersion,
            resultingVersion: updated.version,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();

      return {
        characterId: updated.id,
        status: "updated",
        version: updated.version,
      };
    });
  }

  updateCreationClan(
    command: UpdateCreationClanWriteCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const updated = await transaction
        .updateTable("character")
        .set({
          clan_id: command.clanId,
          kind: command.kind,
          updated_at: new Date(),
          version: sql<number>`version + 1`,
        })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("state", "=", "draft")
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();
      if (updated === undefined) return { status: "version-conflict" };

      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.creation.clan.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            expectedVersion: command.expectedVersion,
            kind: command.kind,
            originId: command.originId,
            potentialImpactedSteps: [...command.potentialImpactedSteps],
            resultingVersion: updated.version,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();

      return { characterId: updated.id, status: "updated", version: updated.version };
    });
  }

  updateCreationConcept(
    command: UpdateCreationConceptWriteCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const updated = await transaction
        .updateTable("character")
        .set({
          ambition: command.identity.ambition,
          concept: command.identity.concept,
          desire: command.identity.desire,
          name: command.identity.name,
          sire: command.identity.sire,
          updated_at: new Date(),
          version: sql<number>`version + 1`,
        })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("state", "=", "draft")
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();
      if (updated === undefined) {
        return { status: "version-conflict" };
      }

      await transaction
        .deleteFrom("character_conviction_pair")
        .where("character_id", "=", command.characterId)
        .execute();
      if (command.convictionPairs.length > 0) {
        await transaction
          .insertInto("character_conviction_pair")
          .values(
            command.convictionPairs.map((pair, position) => ({
              character_id: command.characterId,
              conviction: pair.conviction,
              position,
              touchstone: pair.touchstone,
            })),
          )
          .execute();
      }

      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.creation.concept.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            convictionPairCount: command.convictionPairs.length,
            expectedVersion: command.expectedVersion,
            resultingVersion: updated.version,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();

      return {
        characterId: updated.id,
        status: "updated",
        version: updated.version,
      };
    });
  }

  updateCreationSkills(
    command: UpdateCreationSkillsWriteCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const updated = await transaction
        .updateTable("character")
        .set({
          creation_skill_method: command.methodId,
          updated_at: new Date(),
          version: sql<number>`version + 1`,
        })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("state", "=", "draft")
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();
      if (updated === undefined) return { status: "version-conflict" };

      await transaction
        .insertInto("character_trait")
        .values(
          Object.entries(command.skills).map(([traitId, value]) => ({
            character_id: command.characterId,
            kind: "SKILL" as const,
            trait_id: traitId,
            updated_at: new Date(),
            value,
          })),
        )
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
        .deleteFrom("character_specialty")
        .where("character_id", "=", command.characterId)
        .execute();
      if (command.specialties.length > 0) {
        await transaction
          .insertInto("character_specialty")
          .values(
            command.specialties.map((specialty, position) => ({
              character_id: command.characterId,
              id: specialty.id,
              label: specialty.label,
              origin: specialty.origin,
              position,
              skill_id: specialty.skillId,
            })),
          )
          .execute();
      }
      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.creation.skills.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            methodId: command.methodId,
            resultingVersion: updated.version,
            specialtyCount: command.specialties.length,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();
      return { characterId: updated.id, status: "updated", version: updated.version };
    });
  }

  updateCreationDisciplines(
    command: UpdateCreationDisciplinesWriteCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const updated = await transaction
        .updateTable("character")
        .set({ updated_at: new Date(), version: sql<number>`version + 1` })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("state", "=", "draft")
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();
      if (updated === undefined) return { status: "version-conflict" };

      await transaction
        .deleteFrom("character_discipline_power")
        .where("character_id", "=", command.characterId)
        .execute();
      await transaction
        .deleteFrom("character_discipline")
        .where("character_id", "=", command.characterId)
        .execute();
      if (command.disciplines.length > 0) {
        await transaction
          .insertInto("character_discipline")
          .values(
            command.disciplines.map((item) => ({
              character_id: command.characterId,
              discipline_id: item.disciplineId,
              rating: item.rating,
              updated_at: new Date(),
            })),
          )
          .execute();
      }
      if (command.powers.length > 0) {
        await transaction
          .insertInto("character_discipline_power")
          .values(
            command.powers.map((item) => ({
              character_id: command.characterId,
              discipline_id: item.disciplineId,
              power_id: item.powerId,
              power_rule_revision_id: item.powerRuleRevisionId,
            })),
          )
          .execute();
      }
      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.creation.disciplines.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            disciplineCount: command.disciplines.length,
            powerCount: command.powers.length,
            resultingVersion: updated.version,
          },
          resource_id: command.characterId,
          resource_type: "character",
        })
        .execute();
      return { characterId: updated.id, status: "updated", version: updated.version };
    });
  }

  updateIdentity(
    command: UpdateCharacterIdentityCommand,
  ): Promise<CharacterSheetWriteResult> {
    return this.database.transaction().execute(async (transaction) => {
      const changedFields = [
        ...(command.identity.ambition === undefined ? [] : ["ambition"]),
        ...(command.identity.name === undefined ? [] : ["name"]),
        ...(command.identity.concept === undefined ? [] : ["concept"]),
        ...(command.identity.desire === undefined ? [] : ["desire"]),
        ...(command.identity.sire === undefined ? [] : ["sire"]),
      ];
      const updated = await transaction
        .updateTable("character")
        .set({
          ...(command.identity.ambition === undefined
            ? {}
            : { ambition: command.identity.ambition }),
          ...(command.identity.name === undefined ? {} : { name: command.identity.name }),
          ...(command.identity.concept === undefined
            ? {}
            : { concept: command.identity.concept }),
          ...(command.identity.desire === undefined
            ? {}
            : { desire: command.identity.desire }),
          ...(command.identity.sire === undefined ? {} : { sire: command.identity.sire }),
          updated_at: new Date(),
          version: sql<number>`version + 1`,
        })
        .where("id", "=", command.characterId)
        .where("owner_account_id", "=", command.actorAccountId)
        .where("version", "=", command.expectedVersion)
        .returning(["id", "version"])
        .executeTakeFirst();

      if (updated === undefined) {
        return { status: "version-conflict" };
      }

      await transaction
        .insertInto("audit_entry")
        .values({
          action: "character.sheet.identity.updated",
          actor_account_id: command.actorAccountId,
          correlation_id: command.correlationId,
          id: command.auditEntryId,
          metadata: {
            changedFields,
            expectedVersion: command.expectedVersion,
            resultingVersion: updated.version,
          },
          resource_id: updated.id,
          resource_type: "character",
        })
        .execute();

      return {
        characterId: updated.id,
        status: "updated",
        version: updated.version,
      };
    });
  }
}
