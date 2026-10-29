export interface CharacterGatewayItem {
  readonly characterId: string;
  readonly chronicleId: string;
  readonly chronicleTitle: string;
  readonly clan: string | null;
  readonly lastActivityAt: string | null;
  readonly name: string;
  readonly portraitUrl: string | null;
}

export interface CharacterGatewayList {
  readonly characters: readonly CharacterGatewayItem[];
}

export interface CharacterSelection {
  readonly activeCharacter: CharacterGatewayItem;
  readonly nextPath: "/boa-noite";
}
