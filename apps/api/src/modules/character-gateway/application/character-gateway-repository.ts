export interface CharacterGatewayItem {
  readonly characterId: string;
  readonly chronicleId: string;
  readonly chronicleTitle: string;
  readonly clan: string | null;
  readonly lastActivityAt: string | null;
  readonly name: string;
  readonly portraitUrl: string | null;
}

export interface CharacterGatewayRepository {
  findAuthorized(
    accountId: string,
    characterId: string,
    chronicleId: string,
  ): Promise<CharacterGatewayItem | undefined>;
  listAuthorized(accountId: string): Promise<readonly CharacterGatewayItem[]>;
}

export const CHARACTER_GATEWAY_REPOSITORY = Symbol("CHARACTER_GATEWAY_REPOSITORY");
