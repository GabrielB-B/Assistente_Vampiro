import type { Database } from "@assistente-vampiro/database";
import {
  CREATION_ATTRIBUTE_IDS,
  type CreationAttributeId,
} from "@assistente-vampiro/contracts";
import { RULE_SET_PROFILE_REVISION_ID } from "@assistente-vampiro/rules-engine";
import { sql } from "kysely";

import type {
  CharacterSheetWriteResult,
  CharacterSheetWriter,
  StartCharacterDraftWriteCommand,
  UpdateCharacterAttributesCommand,
  UpdateCharacterIdentityCommand,
  UpdateCreationConceptWriteCommand,
} from "../application/character-sheet-writer.js";

export class KyselyCharacterSheetWriter implements CharacterSheetWriter {
  constructor(private readonly database: Database) {}

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
