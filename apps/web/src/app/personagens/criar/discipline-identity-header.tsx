import type { CreationDisciplineId } from "@assistente-vampiro/contracts";

import styles from "./creation.module.css";
import { DisciplineSymbol } from "./discipline-symbol";

export function DisciplineIdentityHeader({
  disciplineId,
  name,
}: {
  readonly disciplineId: CreationDisciplineId;
  readonly name: string;
}) {
  return (
    <header className={styles.disciplinePanelHeading}>
      <DisciplineSymbol id={disciplineId} />
      <h2>{name}</h2>
    </header>
  );
}
