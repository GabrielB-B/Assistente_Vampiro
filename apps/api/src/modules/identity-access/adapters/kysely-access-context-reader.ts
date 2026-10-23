import type { Database } from "@assistente-vampiro/database";
import { sql } from "kysely";

import type { AccessContextReader } from "../application/access-context-reader.js";
import type {
  CharacterAccessContext,
  MembershipRole,
} from "../application/authorization-context.js";

export class KyselyAccessContextReader implements AccessContextReader {
  constructor(private readonly database: Database) {}

  async readCharacterAccess(
    accountId: string,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterAccessContext | undefined> {
    const row = await this.database
      .selectFrom("character as character_record")
      .leftJoin("chronicle_membership as membership", (join) =>
        join
          .on("membership.account_id", "=", accountId)
          .on("membership.chronicle_id", "=", chronicleId),
      )
      .leftJoin("character_binding as binding", (join) =>
        join
          .onRef("binding.character_id", "=", "character_record.id")
          .on("binding.chronicle_id", "=", chronicleId)
          .on("binding.state", "=", "active"),
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
      .where("character_record.id", "=", characterId)
      .executeTakeFirst();

    if (row === undefined) {
      return undefined;
    }

    return {
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
      membership:
        row.membership_account_id === null ||
        row.membership_chronicle_id === null ||
        row.membership_id === null ||
        row.membership_roles === null ||
        row.membership_status === null
          ? undefined
          : {
              accountId: row.membership_account_id,
              chronicleId: row.membership_chronicle_id,
              membershipId: row.membership_id,
              roles: row.membership_roles,
              status: row.membership_status,
            },
    };
  }
}
