"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { AnkhMark } from "../ankh-mark";
import { startCharacterDraft } from "./creation-client";
import styles from "./creation.module.css";

type CreationMode = "direct" | "guided";
const storageKey = "assistente-vampiro:pending-character-draft";

function requestKey(): string {
  const existing = window.sessionStorage.getItem(storageKey);
  if (existing !== null) return existing;
  const created = window.crypto.randomUUID();
  window.sessionStorage.setItem(storageKey, created);
  return created;
}

export function CreationModeSelection() {
  const router = useRouter();
  const [pending, setPending] = useState<CreationMode | null>(null);
  const [error, setError] = useState("");

  async function choose(mode: CreationMode): Promise<void> {
    if (pending !== null) return;
    setPending(mode);
    setError("");
    try {
      const draft = await startCharacterDraft(requestKey());
      window.sessionStorage.removeItem(storageKey);
      router.push(
        mode === "guided"
          ? `/personagens/${draft.characterId}/criar/conceito`
          : `/ficha/${draft.characterId}?identity=player-one&mode=direct`,
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "A noite não respondeu.");
      setPending(null);
    }
  }

  return (
    <main className={styles.creationShell}>
      <div aria-hidden="true" className={styles.atmosphere} />
      <article className={styles.modeDocument} aria-labelledby="creation-mode-title">
        <header className={styles.documentMasthead}>
          <AnkhMark />
          <div>
            <i />
            <h1>Assistente Vampiro</h1>
            <i />
          </div>
          <p>Ficha de personagem · quinta edição</p>
        </header>
        <section className={styles.modeIntroduction}>
          <h2 id="creation-mode-title">Como deseja criar?</h2>
          <p>A mesma ficha, duas formas de começar.</p>
        </section>
        <div className={styles.modeChoices}>
          <section>
            <span aria-hidden="true" className={styles.bookIcon} />
            <h3>Criação guiada</h3>
            <p>
              Monte seu personagem parte por parte, com explicações e ajuda durante cada
              escolha.
            </p>
            <button
              disabled={pending !== null}
              onClick={() => void choose("guided")}
              type="button"
            >
              <span>
                {pending === "guided" ? "Abrindo a ficha…" : "Começar com criação guiada"}
              </span>
              <b aria-hidden="true">→</b>
            </button>
          </section>
          <section>
            <span aria-hidden="true" className={styles.sheetIcon} />
            <h3>Preencher ficha</h3>
            <p>
              Abra a ficha tradicional em branco e preencha diretamente. Para quem já
              conhece Vampire.
            </p>
            <button
              className={styles.secondaryAction}
              disabled={pending !== null}
              onClick={() => void choose("direct")}
              type="button"
            >
              <span>
                {pending === "direct"
                  ? "Abrindo a ficha…"
                  : "Preencher ficha diretamente"}
              </span>
              <b aria-hidden="true">→</b>
            </button>
          </section>
        </div>
        <footer className={styles.trustMessage}>
          <span aria-hidden="true">i</span>
          <p>
            Ambas as opções utilizam a mesma ficha e os mesmos dados do seu personagem.
          </p>
        </footer>
        <p aria-live="polite" className={styles.modeError}>
          {error}
        </p>
      </article>
    </main>
  );
}
