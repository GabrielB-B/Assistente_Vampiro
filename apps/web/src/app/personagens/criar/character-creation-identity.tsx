import type { CharacterCreationContextView } from "@assistente-vampiro/contracts";
import Image from "next/image";

import { getClanPresentation } from "./clan-presentation";
import { CLAN_VISUALS } from "./clan-visuals";
import styles from "./creation.module.css";

export function CharacterCreationIdentity({
  context,
}: {
  readonly context: CharacterCreationContextView;
}) {
  if (context.origin === null) return null;
  const presentation = getClanPresentation(context.origin.id);
  const visual = CLAN_VISUALS[context.origin.id];
  return (
    <section
      aria-label={`Identidade em construção: ${presentation.namePtBr}`}
      className={styles.characterCreationIdentity}
      data-origin-kind={context.origin.kind}
      style={
        visual === undefined
          ? undefined
          : ({ "--character-accent": visual.accent } as React.CSSProperties)
      }
    >
      {visual === undefined ? null : (
        <Image
          alt={`Símbolo do Clã ${presentation.namePtBr}`}
          height={36}
          src={visual.symbol}
          width={36}
        />
      )}
      <span>
        {context.identity.name === null ? null : <small>{context.identity.name}</small>}
        <i>{context.origin.kind === "CLAN_VAMPIRE" ? "Clã" : "Origem"}</i>
        <strong>{presentation.namePtBr}</strong>
      </span>
    </section>
  );
}
