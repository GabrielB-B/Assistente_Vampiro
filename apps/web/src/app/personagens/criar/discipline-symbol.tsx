import type { CreationDisciplineId } from "@assistente-vampiro/contracts";
import Image from "next/image";

import styles from "./creation.module.css";

export const disciplineVisualAssets = {
  "discipline:animalism": "animalism.svg",
  "discipline:auspex": "auspex.svg",
  "discipline:blood-sorcery": "blood-sorcery.svg",
  "discipline:celerity": "celerity.svg",
  "discipline:dominate": "dominate.svg",
  "discipline:fortitude": "fortitude.svg",
  "discipline:obfuscate": "obfuscate.svg",
  "discipline:oblivion": "oblivion.svg",
  "discipline:potence": "potence.svg",
  "discipline:presence": "presence.svg",
  "discipline:protean": "protean.svg",
  "discipline:thin-blood-alchemy": "thin-blood-alchemy.svg",
} as const satisfies Record<CreationDisciplineId, string>;

export function DisciplineSymbol({ id }: { readonly id: CreationDisciplineId }) {
  const file = disciplineVisualAssets[id];
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={styles.disciplineSymbol}
      height={56}
      src={`/assets/wod/disciplines/${file}`}
      unoptimized
      width={56}
    />
  );
}
