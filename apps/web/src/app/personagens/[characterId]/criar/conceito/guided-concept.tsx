"use client";

import type { CreationConceptStepView } from "@assistente-vampiro/contracts";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { loadCharacterSheetById } from "../../../../character-api";
import { CharacterSheetPrototype } from "../../../../character-sheet-prototype";
import { AnkhMark } from "../../../ankh-mark";
import {
  loadCreationConcept,
  updateCreationConcept,
} from "../../../criar/creation-client";
import styles from "../../../criar/creation.module.css";

const steps = [
  "Conceito",
  "Clã",
  "Atributos",
  "Habilidades",
  "Disciplinas",
  "Predador",
  "Vantagens",
  "História",
  "Revisão",
] as const;

const help = {
  ambition: "Um objetivo concreto de longo prazo que orienta o personagem.",
  concept: "Uma frase curta que resume quem o personagem é nesta história.",
  conviction: "Um princípio pessoal que ajuda o personagem a preservar sua humanidade.",
  desire: "Um objetivo imediato, menor e mais fácil de substituir que a Ambição.",
  sire: "Quem criou o personagem, quando essa informação for conhecida e aplicável.",
  touchstone: "A pessoa mortal que liga esta Convicção à humanidade do personagem.",
} as const;

type HelpId = keyof typeof help;
type ConceptDraft = {
  readonly convictionPairs: readonly {
    readonly conviction: string;
    readonly touchstone: string;
  }[];
  readonly identity: {
    readonly ambition: string;
    readonly concept: string;
    readonly desire: string;
    readonly name: string;
    readonly sire: string;
  };
};

function fromStep(step: CreationConceptStepView): ConceptDraft {
  return {
    convictionPairs: step.convictionPairs.map((pair) => ({
      conviction: pair.conviction ?? "",
      touchstone: pair.touchstone ?? "",
    })),
    identity: {
      ambition: step.identity.ambition ?? "",
      concept: step.identity.concept ?? "",
      desire: step.identity.desire ?? "",
      name: step.identity.name,
      sire: step.identity.sire ?? "",
    },
  };
}

function fingerprint(draft: ConceptDraft): string {
  return JSON.stringify(draft);
}

function HelpLabel({
  active,
  helpId,
  instanceId = helpId,
  label,
  onToggle,
}: {
  readonly active: boolean;
  readonly helpId: HelpId;
  readonly instanceId?: string;
  readonly label: string;
  readonly onToggle: (instanceId: string | null) => void;
}) {
  return (
    <span className={styles.conceptLabel} data-open={active}>
      <span>{label}</span>
      <button
        aria-describedby={`${instanceId}-help`}
        aria-expanded={active}
        aria-label={`${label}: mostrar ajuda`}
        onBlur={() => onToggle(null)}
        onClick={() => onToggle(active ? null : instanceId)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onToggle(null);
            event.currentTarget.blur();
          }
        }}
        type="button"
      >
        ?
      </button>
      <span className={styles.attributeTooltip} id={`${instanceId}-help`} role="tooltip">
        {help[helpId]}
      </span>
    </span>
  );
}

export function GuidedConcept({ characterId }: { readonly characterId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<CreationConceptStepView | null>(null);
  const [draft, setDraft] = useState<ConceptDraft | null>(null);
  const [activeHelp, setActiveHelp] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saveState, setSaveState] = useState<"dirty" | "idle" | "saved" | "saving">(
    "idle",
  );
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof loadCharacterSheetById>
  > | null>(null);
  const stepRef = useRef<CreationConceptStepView | null>(null);
  const draftRef = useRef<ConceptDraft | null>(null);
  const savedFingerprint = useRef("");
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    void loadCreationConcept(characterId, controller.signal)
      .then((loaded) => {
        const loadedDraft = fromStep(loaded);
        stepRef.current = loaded;
        draftRef.current = loadedDraft;
        savedFingerprint.current = fingerprint(loadedDraft);
        setStep(loaded);
        setDraft(loadedDraft);
      })
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

  function replaceDraft(next: ConceptDraft) {
    draftRef.current = next;
    setDraft(next);
    setSaveState("dirty");
    setMessage("");
  }

  function changeIdentity(field: keyof ConceptDraft["identity"], value: string) {
    const current = draftRef.current;
    if (current === null) return;
    replaceDraft({ ...current, identity: { ...current.identity, [field]: value } });
  }

  function changePair(
    position: number,
    field: "conviction" | "touchstone",
    value: string,
  ) {
    const current = draftRef.current;
    if (current === null) return;
    replaceDraft({
      ...current,
      convictionPairs: current.convictionPairs.map((pair, index) =>
        index === position ? { ...pair, [field]: value } : pair,
      ),
    });
  }

  function persistCurrent(): Promise<CreationConceptStepView | null> {
    let resolved: CreationConceptStepView | null = null;
    const operation = saveQueue.current.then(async () => {
      const currentStep = stepRef.current;
      const currentDraft = draftRef.current;
      if (currentStep === null || currentDraft === null) return;
      const currentFingerprint = fingerprint(currentDraft);
      if (currentFingerprint === savedFingerprint.current) {
        resolved = currentStep;
        return;
      }
      setSaveState("saving");
      setMessage("");
      try {
        const updated = await updateCreationConcept(
          characterId,
          currentStep.version,
          {
            ambition: currentDraft.identity.ambition || null,
            concept: currentDraft.identity.concept || null,
            desire: currentDraft.identity.desire || null,
            name: currentDraft.identity.name,
            sire: currentDraft.identity.sire || null,
          },
          currentDraft.convictionPairs.map((pair) => ({
            conviction: pair.conviction || null,
            touchstone: pair.touchstone || null,
          })),
        );
        stepRef.current = updated;
        setStep(updated);
        savedFingerprint.current = currentFingerprint;
        setSaveState("saved");
        resolved = updated;
      } catch (reason) {
        setSaveState("dirty");
        setMessage(reason instanceof Error ? reason.message : "Não foi possível salvar.");
      }
    });
    saveQueue.current = operation.catch(() => undefined);
    return operation.then(() => resolved);
  }

  function addPair() {
    const current = draftRef.current;
    if (
      current === null ||
      step === null ||
      current.convictionPairs.length >= step.policy.maximumConvictionPairs
    ) {
      return;
    }
    replaceDraft({
      ...current,
      convictionPairs: [...current.convictionPairs, { conviction: "", touchstone: "" }],
    });
  }

  function removePair(position: number) {
    const current = draftRef.current;
    if (current === null) return;
    replaceDraft({
      ...current,
      convictionPairs: current.convictionPairs.filter((_, index) => index !== position),
    });
    void persistCurrent();
  }

  async function openPreview() {
    const saved = await persistCurrent();
    if (saved === null) return;
    const controller = new AbortController();
    try {
      setPreview(
        await loadCharacterSheetById("player-one", characterId, controller.signal),
      );
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "A ficha não respondeu.");
    }
  }

  async function saveAndGo(path: string) {
    const saved = await persistCurrent();
    if (saved !== null) router.push(path);
  }

  async function continueToClan() {
    const saved = await persistCurrent();
    if (saved === null) return;
    if (saved.evaluation.complete) {
      router.push(`/personagens/${characterId}/criar/cla`);
      return;
    }
    setMessage(
      "Complete Nome, Conceito e Ambição e finalize qualquer par iniciado para avançar.",
    );
  }

  if (step === null || draft === null) {
    return (
      <main className={`${styles.creationShell} ${styles.guidedShell}`}>
        <section className={styles.guidedLoading} aria-live="polite">
          <AnkhMark />
          <p>{message || "Preparando o Conceito da ficha…"}</p>
        </section>
      </main>
    );
  }

  const missing = new Set(step.evaluation.missingRequiredFields);
  const pairIncomplete = new Set(step.evaluation.incompletePairPositions);

  return (
    <main className={`${styles.creationShell} ${styles.guidedShell}`}>
      <article className={styles.guidedDocument} aria-labelledby="concept-title">
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
          {steps.map((label) => (
            <span className={label === "Conceito" ? styles.currentStep : ""} key={label}>
              {label}
              <i />
            </span>
          ))}
        </nav>
        <div className={styles.guidedGrid}>
          <section className={`${styles.attributeStage} ${styles.conceptStage}`}>
            <div className={styles.stageHeading}>
              <p>Comece pela pessoa que existe antes dos pontos e poderes.</p>
              <h2 id="concept-title">Conceito</h2>
            </div>
            {step.chronicle === null ? null : (
              <p className={styles.chronicleContext}>
                <span>Crônica</span>
                <strong>{step.chronicle.title}</strong>
              </p>
            )}
            <div className={styles.conceptFields}>
              <label>
                <span>Nome</span>
                <input
                  aria-label="Nome"
                  aria-invalid={missing.has("name")}
                  maxLength={120}
                  onBlur={() => void persistCurrent()}
                  onChange={(event) => changeIdentity("name", event.target.value)}
                  value={draft.identity.name}
                />
              </label>
              <label>
                <HelpLabel
                  active={activeHelp === "sire"}
                  helpId="sire"
                  label="Senhor"
                  onToggle={setActiveHelp}
                />
                <input
                  aria-describedby="sire-help"
                  aria-label="Senhor"
                  maxLength={500}
                  onBlur={() => void persistCurrent()}
                  onChange={(event) => changeIdentity("sire", event.target.value)}
                  value={draft.identity.sire}
                />
              </label>
              <label className={styles.conceptPrimaryField}>
                <HelpLabel
                  active={activeHelp === "concept"}
                  helpId="concept"
                  label="Conceito"
                  onToggle={setActiveHelp}
                />
                <textarea
                  aria-describedby="concept-help"
                  aria-label="Conceito"
                  aria-invalid={missing.has("concept")}
                  maxLength={500}
                  onBlur={() => void persistCurrent()}
                  onChange={(event) => changeIdentity("concept", event.target.value)}
                  rows={2}
                  value={draft.identity.concept}
                />
              </label>
              {(["ambition", "desire"] as const).map((field) => {
                const label = field === "ambition" ? "Ambição" : "Desejo";
                return (
                  <label key={field}>
                    <HelpLabel
                      active={activeHelp === field}
                      helpId={field}
                      label={label}
                      onToggle={setActiveHelp}
                    />
                    <input
                      aria-describedby={`${field}-help`}
                      aria-label={label}
                      aria-invalid={field === "ambition" && missing.has("ambition")}
                      maxLength={500}
                      onBlur={() => void persistCurrent()}
                      onChange={(event) => changeIdentity(field, event.target.value)}
                      value={draft.identity[field]}
                    />
                  </label>
                );
              })}
            </div>
            <section className={styles.convictionSection}>
              <header>
                <h3>Convicções e Pilares</h3>
                <span>
                  {draft.convictionPairs.length} / {step.policy.maximumConvictionPairs}
                </span>
              </header>
              <div className={styles.convictionPairs}>
                {draft.convictionPairs.map((pair, position) => (
                  <div className={styles.convictionPair} key={position}>
                    <label>
                      <HelpLabel
                        active={activeHelp === `conviction-${position}`}
                        helpId="conviction"
                        instanceId={`conviction-${position}`}
                        label="Convicção"
                        onToggle={setActiveHelp}
                      />
                      <input
                        aria-describedby={`conviction-${position}-help`}
                        aria-label="Convicção"
                        aria-invalid={pairIncomplete.has(position)}
                        maxLength={500}
                        onBlur={() => void persistCurrent()}
                        onChange={(event) =>
                          changePair(position, "conviction", event.target.value)
                        }
                        value={pair.conviction}
                      />
                    </label>
                    <span aria-hidden="true">↔</span>
                    <label>
                      <HelpLabel
                        active={activeHelp === `touchstone-${position}`}
                        helpId="touchstone"
                        instanceId={`touchstone-${position}`}
                        label="Pilar"
                        onToggle={setActiveHelp}
                      />
                      <input
                        aria-describedby={`touchstone-${position}-help`}
                        aria-label="Pilar"
                        aria-invalid={pairIncomplete.has(position)}
                        maxLength={500}
                        onBlur={() => void persistCurrent()}
                        onChange={(event) =>
                          changePair(position, "touchstone", event.target.value)
                        }
                        value={pair.touchstone}
                      />
                    </label>
                    <button
                      aria-label={`Remover convicção e pilar ${position + 1}`}
                      onClick={() => removePair(position)}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {draft.convictionPairs.length < step.policy.maximumConvictionPairs ? (
                <button className={styles.addPairButton} onClick={addPair} type="button">
                  + Adicionar convicção e pilar
                </button>
              ) : null}
            </section>
          </section>
          <aside className={styles.rulePanel}>
            <p className={styles.ruleEyebrow}>Entender esta etapa</p>
            <section className={styles.ruleBlock}>
              <h2>O que é Conceito?</h2>
              <p>Resume quem é o personagem e orienta as escolhas que virão depois.</p>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Ambição e Desejo</h3>
              <p>
                Ambição aponta para um objetivo duradouro. Desejo registra algo mais
                imediato e substituível.
              </p>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Convicções e Pilares</h3>
              <p>
                A Convicção é um princípio importante. Seu Pilar liga esse princípio à
                humanidade do personagem.
              </p>
            </section>
            <section className={styles.ruleBlock}>
              <h3>Seu progresso</h3>
              <ul className={styles.conceptChecklist}>
                <li data-complete={!missing.has("name")}>Nome</li>
                <li data-complete={!missing.has("concept")}>Conceito</li>
                <li data-complete={!missing.has("ambition")}>Ambição</li>
                <li data-complete={pairIncomplete.size === 0}>Pares iniciados</li>
              </ul>
            </section>
            <small>Política {step.policy.ruleRevision}</small>
          </aside>
        </div>
        <footer className={styles.guidedActions}>
          <button onClick={() => void saveAndGo("/personagens")} type="button">
            ← Voltar
          </button>
          <div>
            <button onClick={() => void openPreview()} type="button">
              Ver ficha até agora
            </button>
            <button onClick={() => void saveAndGo("/personagens")} type="button">
              Salvar e sair
            </button>
            <button
              onClick={() =>
                void saveAndGo(`/ficha/${characterId}?identity=player-one&mode=direct`)
              }
              type="button"
            >
              Preencher diretamente
            </button>
            <button
              className={styles.continueButton}
              onClick={() => void continueToClan()}
              type="button"
            >
              Continuar →
            </button>
          </div>
        </footer>
        <p aria-live="polite" className={styles.guidedMessage}>
          {saveState === "saving"
            ? "Salvando…"
            : saveState === "saved" && message.length === 0
              ? "Rascunho salvo."
              : message}
        </p>
      </article>
      {preview === null ? null : (
        <div
          aria-label="Ficha até agora"
          aria-modal="true"
          className={styles.previewLayer}
          role="dialog"
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
