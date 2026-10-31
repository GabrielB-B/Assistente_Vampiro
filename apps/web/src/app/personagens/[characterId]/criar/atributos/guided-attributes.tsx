"use client";

import {
  type CreationAttributeId,
  type CreationAttributesStepView,
} from "@assistente-vampiro/contracts";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { loadCharacterSheetById } from "../../../../character-api";
import { CharacterSheetPrototype } from "../../../../character-sheet-prototype";
import { AnkhMark } from "../../../ankh-mark";
import {
  loadCreationAttributes,
  updateCreationAttribute,
} from "../../../criar/creation-client";
import styles from "../../../criar/creation.module.css";

const groups: readonly {
  readonly title: string;
  readonly items: readonly {
    readonly help: string;
    readonly id: CreationAttributeId;
    readonly label: string;
  }[];
}[] = [
  {
    items: [
      {
        help: "Potência física bruta, impacto e capacidade de impor o corpo.",
        id: "attribute:strength",
        label: "Força",
      },
      {
        help: "Coordenação, precisão, agilidade e reflexos.",
        id: "attribute:dexterity",
        label: "Destreza",
      },
      {
        help: "Resistência física, robustez e capacidade de suportar dano ou esforço.",
        id: "attribute:stamina",
        label: "Vigor",
      },
    ],
    title: "Físicos",
  },
  {
    items: [
      {
        help: "Presença, magnetismo pessoal e capacidade de inspirar.",
        id: "attribute:charisma",
        label: "Carisma",
      },
      {
        help: "Influência indireta, persuasão e controle sutil.",
        id: "attribute:manipulation",
        label: "Manipulação",
      },
      {
        help: "Compostura, domínio emocional e frieza sob pressão.",
        id: "attribute:composure",
        label: "Autocontrole",
      },
    ],
    title: "Sociais",
  },
  {
    items: [
      {
        help: "Conhecimento, raciocínio aprendido e compreensão.",
        id: "attribute:intelligence",
        label: "Inteligência",
      },
      {
        help: "Rapidez mental, percepção imediata e reação ao inesperado.",
        id: "attribute:wits",
        label: "Raciocínio",
      },
      {
        help: "Firmeza interior, foco e persistência mental.",
        id: "attribute:resolve",
        label: "Determinação",
      },
    ],
    title: "Mentais",
  },
] as const;

export function GuidedAttributes({ characterId }: { readonly characterId: string }) {
  const [step, setStep] = useState<CreationAttributesStepView | null>(null);
  const [pending, setPending] = useState<CreationAttributeId | null>(null);
  const [activeHelp, setActiveHelp] = useState<CreationAttributeId | null>(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof loadCharacterSheetById>
  > | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    void loadCreationAttributes(characterId, controller.signal)
      .then(setStep)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setMessage(reason instanceof Error ? reason.message : "A etapa não respondeu.");
        }
      });
    return () => controller.abort();
  }, [characterId]);

  useEffect(() => {
    if (preview === null) return;
    closeButton.current?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPreview(null);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [preview]);

  async function choose(attributeId: CreationAttributeId, value: number) {
    if (step === null || pending !== null) return;
    setPending(attributeId);
    setMessage("");
    try {
      const result = await updateCreationAttribute(
        characterId,
        step.version,
        attributeId,
        value,
      );
      setStep({
        ...step,
        attributes: { ...step.attributes, [attributeId]: value },
        evaluation: result.evaluation,
        version: result.version,
      });
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "Essa escolha não pôde ser aplicada.",
      );
    } finally {
      setPending(null);
    }
  }

  async function openPreview() {
    const controller = new AbortController();
    setMessage("");
    try {
      setPreview(
        await loadCharacterSheetById("player-one", characterId, controller.signal),
      );
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "A ficha não respondeu.");
    }
  }

  if (step === null) {
    return (
      <main className={`${styles.creationShell} ${styles.guidedShell}`}>
        <section className={styles.guidedLoading} aria-live="polite">
          <AnkhMark />
          <p>{message || "Preparando os Atributos da ficha…"}</p>
        </section>
      </main>
    );
  }

  return (
    <main className={`${styles.creationShell} ${styles.guidedShell}`}>
      <article className={styles.guidedDocument} aria-labelledby="attributes-title">
        <header className={styles.guidedMasthead}>
          <AnkhMark />
          <div>
            <h1>Assistente Vampiro</h1>
            <p>Ficha de personagem · quinta edição</p>
          </div>
          <p>
            <strong>Em criação</strong>
            <span>Modo guiado</span>
          </p>
        </header>
        <nav className={styles.stepTrack} aria-label="Etapas da criação">
          {[
            "Conceito",
            "Clã",
            "Atributos",
            "Habilidades",
            "Disciplinas",
            "Predador",
            "Vantagens",
            "História",
            "Revisão",
          ].map((label) => (
            <span className={label === "Atributos" ? styles.currentStep : ""} key={label}>
              {label}
              <i />
            </span>
          ))}
        </nav>
        <div className={styles.guidedGrid}>
          <section className={styles.attributeStage}>
            <div className={styles.stageHeading}>
              <p>Definem as capacidades naturais do seu personagem.</p>
              <h2 id="attributes-title">Atributos</h2>
            </div>
            <div className={styles.attributeGroups}>
              {groups.map((group) => (
                <section key={group.title}>
                  <h3>{group.title}</h3>
                  {group.items.map((attribute) => {
                    const current = step.attributes[attribute.id];
                    return (
                      <div className={styles.attributeRow} key={attribute.id}>
                        <span
                          className={styles.attributeLabel}
                          data-open={activeHelp === attribute.id}
                        >
                          <button
                            aria-describedby={`${attribute.id}-help`}
                            aria-expanded={activeHelp === attribute.id}
                            aria-label={`${attribute.label}: mostrar ajuda`}
                            onBlur={() => setActiveHelp(null)}
                            onClick={() =>
                              setActiveHelp((current) =>
                                current === attribute.id ? null : attribute.id,
                              )
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Escape") {
                                setActiveHelp(null);
                                event.currentTarget.blur();
                              }
                            }}
                            type="button"
                          >
                            {attribute.label}
                          </button>
                          <span
                            className={styles.attributeTooltip}
                            id={`${attribute.id}-help`}
                            role="tooltip"
                          >
                            {attribute.help}
                          </span>
                        </span>
                        <div aria-label={`${attribute.label}: ${current}`}>
                          {Array.from(
                            { length: step.policy.maximum },
                            (_, index) => index + 1,
                          ).map((rating) => (
                            <button
                              aria-label={`Definir ${attribute.label} em ${rating}`}
                              aria-pressed={rating <= current}
                              disabled={pending !== null}
                              key={rating}
                              onClick={() => void choose(attribute.id, rating)}
                              type="button"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              ))}
            </div>
            <div className={styles.attributeBudget}>
              <div>
                <strong>
                  {step.evaluation.incrementsSpent} / {step.policy.totalIncrements}
                </strong>
                <span>incrementos distribuídos</span>
              </div>
              <div>
                <strong>{step.evaluation.healthMax}</strong>
                <span>Vitalidade</span>
              </div>
              <div>
                <strong>{step.evaluation.willpowerMax}</strong>
                <span>Força de Vontade</span>
              </div>
            </div>
          </section>
          <aside className={styles.rulePanel}>
            <p className={styles.ruleEyebrow}>Entender esta etapa</p>
            <section className={styles.ruleBlock}>
              <h2>O que são Atributos?</h2>
              <p>
                São as capacidades naturais do personagem. Mostram em quais áreas ele age
                com mais facilidade antes de treinamento ou experiência.
              </p>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Como pensar esta etapa?</h3>
              <ul>
                <li>
                  <strong>Físicos</strong> — ação, confronto, resistência e corpo.
                </li>
                <li>
                  <strong>Sociais</strong> — influência, presença, sedução e controle
                  emocional.
                </li>
                <li>
                  <strong>Mentais</strong> — percepção, estudo, investigação e firmeza
                  interior.
                </li>
              </ul>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Regra de distribuição</h3>
              <dl>
                {step.policy.ratingCounts.map((entry) => (
                  <div key={entry.rating}>
                    <dt>{entry.count}</dt>
                    <dd>
                      {entry.count === 1 ? "Atributo" : "Atributos"} em {entry.rating}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Impacto na ficha</h3>
              <ul>
                <li>
                  <strong>Vitalidade</strong> depende de Vigor.
                </li>
                <li>
                  <strong>Força de Vontade</strong> depende de Autocontrole +
                  Determinação.
                </li>
              </ul>
            </section>
            <small>Política {step.policy.ruleRevision}</small>
          </aside>
        </div>
        <footer className={styles.guidedActions}>
          <Link href="/personagens/criar">← Voltar</Link>
          <div>
            <button onClick={() => void openPreview()} type="button">
              Ver ficha até agora
            </button>
            <Link href={`/ficha/${characterId}?identity=player-one&mode=direct`}>
              Preencher diretamente
            </Link>
            <button
              className={styles.continueButton}
              disabled={!step.evaluation.complete}
              type="button"
            >
              Continuar →
            </button>
          </div>
        </footer>
        <p aria-live="polite" className={styles.guidedMessage}>
          {message}
        </p>
      </article>
      {preview === null ? null : (
        <div
          aria-modal="true"
          className={styles.previewLayer}
          role="dialog"
          aria-label="Ficha até agora"
        >
          <div className={styles.previewDialog}>
            <header>
              <h2>Sua ficha até agora</h2>
              <button ref={closeButton} onClick={() => setPreview(null)} type="button">
                ×<small>Fechar</small>
              </button>
            </header>
            <div className={styles.previewViewport}>
              <CharacterSheetPrototype context={preview.context} sheet={preview.sheet} />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
