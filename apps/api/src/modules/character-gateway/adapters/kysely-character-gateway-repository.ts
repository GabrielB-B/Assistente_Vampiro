import type { Database } from "@assistente-vampiro/database";
import { sql } from "kysely";

import type {
  CharacterGatewayItem,
  CharacterGatewayRepository,
} from "../application/character-gateway-repository.js";

interface CharacterGatewayRow {
  readonly character_id: string;
  readonly chronicle_id: string;
  readonly chronicle_title: string;
  readonly last_activity_at: Date | null;
  readonly name: string;
}

function toIsoString(value: Date | null): string | null {
  return value === null ? null : value.toISOString();
}

function toItem(row: CharacterGatewayRow): CharacterGatewayItem {
  return {
    characterId: row.character_id,
    chronicleId: row.chronicle_id,
    chronicleTitle: row.chronicle_title,
    clan: null,
    lastActivityAt: toIsoString(row.last_activity_at),
    name: row.name,
    portraitUrl: null,
  };
}

export class KyselyCharacterGatewayRepository implements CharacterGatewayRepository {
  constructor(private readonly database: Database) {}

  async findAuthorized(
    accountId: string,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterGatewayItem | undefined> {
    const characters = await this.listRows(accountId, characterId, chronicleId);
    const first = characters[0];
    return first === undefined ? undefined : toItem(first);
  }

  async listAuthorized(accountId: string): Promise<readonly CharacterGatewayItem[]> {
    const rows = await this.listRows(accountId);
    return rows.map(toItem);
  }

  private listRows(
    accountId: string,
    characterId?: string,
    chronicleId?: string,
  ): Promise<CharacterGatewayRow[]> {
    let query = this.database
      .selectFrom("character as character_record")
      .innerJoin("character_binding as binding", (join) =>
        join
          .onRef("binding.character_id", "=", "character_record.id")
          .on("binding.state", "=", "active"),
      )
      .innerJoin("chronicle_membership as membership", (join) =>
        join
          .onRef("membership.id", "=", "binding.membership_id")
          .onRef("membership.chronicle_id", "=", "binding.chronicle_id")
          .on("membership.account_id", "=", accountId)
          .on("membership.status", "=", "active"),
      )
      .innerJoin("chronicle", (join) =>
        join
          .onRef("chronicle.id", "=", "binding.chronicle_id")
          .on("chronicle.state", "=", "active"),
      )
      .leftJoin("game_session as session", "session.chronicle_id", "chronicle.id")
      .select([
        "character_record.id as character_id",
        "character_record.name",
        "chronicle.id as chronicle_id",
        "chronicle.title as chronicle_title",
        sql<Date | null>`max(coalesce(session.ended_at, session.started_at, session.scheduled_at))`.as(
          "last_activity_at",
        ),
      ])
      .where("character_record.owner_account_id", "=", accountId)
      .where("character_record.state", "=", "ready")
      .where(sql<boolean>`'PLAYER' = any(${sql.ref("membership.roles")})`)
      .groupBy([
        "character_record.id",
        "character_record.name",
        "chronicle.id",
        "chronicle.title",
      ])
      .orderBy("character_record.name", "asc");

    if (characterId !== undefined) {
      query = query.where("character_record.id", "=", characterId);
    }
    if (chronicleId !== undefined) {
      query = query.where("chronicle.id", "=", chronicleId);
    }

    return query.execute();
  }
}
