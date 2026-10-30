import {
  ALPHA_IDENTITY_OPTIONS,
  type AlphaIdentityAlias,
} from "@assistente-vampiro/contracts";

import { PlayerEntry } from "../../player-entry";

function parseIdentity(value: string | string[] | undefined): AlphaIdentityAlias {
  const candidate = Array.isArray(value) ? value[0] : value;
  return (
    ALPHA_IDENTITY_OPTIONS.find((identity) => identity.alias === candidate)?.alias ??
    "player-one"
  );
}

export default async function FullCharacterSheetPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
  readonly searchParams: Promise<{ readonly identity?: string | string[] }>;
}) {
  const [{ characterId }, query] = await Promise.all([params, searchParams]);

  return (
    <PlayerEntry
      initialCharacterId={characterId}
      initialIdentityAlias={parseIdentity(query.identity)}
    />
  );
}
