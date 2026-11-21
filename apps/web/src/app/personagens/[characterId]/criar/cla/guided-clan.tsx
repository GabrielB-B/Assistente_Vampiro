"use client";

import type {
  CreationClanStepView,
  CreationDisciplineId,
  CreationOriginId,
  CreationOriginOptionView,
} from "@assistente-vampiro/contracts";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { loadCharacterSheetById } from "../../../../character-api";
import { CharacterSheetPrototype } from "../../../../character-sheet-prototype";
import { AnkhMark } from "../../../ankh-mark";
import {
  DISCIPLINE_PRESENTATIONS,
  getClanPresentation,
  type ClanPresentation,
} from "../../../criar/clan-presentation";
import { CLAN_VISUALS } from "../../../criar/clan-visuals";
import { loadCreationClan, updateCreationClan } from "../../../criar/creation-client";
import styles from "../../../criar/creation.module.css";

const steps = [
  ["concept", "Conceito"],
  ["clan", "Clã"],
  ["attributes", "Atributos"],
  ["skills", "Habilidades"],
  ["disciplines", "Disciplinas"],
  ["predator", "Predador"],
  ["advantages", "Vantagens"],
  ["history-and-blood", "História"],
  ["review", "Revisão"],
] as const;

function ContextTooltip({
  description,
  label,
}: {
  readonly description: string;
  readonly label: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className={styles.contextTooltip} data-open={open}>
      <button
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        type="button"
      >
        {label}
        <span className={styles.visuallyHidden}> — ver explicação</span>
      </button>
      {open ? (
        <span id={id} role="tooltip">
          {description}
        </span>
      ) : null}
    </span>
  );
}

function OriginCard({
  option,
  pending,
  selected,
  onChoose,
}: {
  readonly option: CreationOriginOptionView;
  readonly pending: boolean;
  readonly selected: boolean;
  readonly onChoose: (originId: CreationOriginId) => void;
}) {
  const visual = CLAN_VISUALS[option.id];
  const presentation = getClanPresentation(option.id);
  return (
    <label
      className={styles.clanCard}
      data-origin-kind={option.kind}
      data-selected={selected}
      style={
        visual === undefined
          ? undefined
          : ({ "--clan-accent": visual.accent } as React.CSSProperties)
      }
    >
      <input
        aria-label={presentation.namePtBr}
        checked={selected}
        disabled={pending}
        name="character-origin"
        onChange={() => onChoose(option.id)}
        type="radio"
        value={option.id}
      />
      {visual === undefined ? (
        <span aria-hidden="true" className={styles.originWordmark}>
          {presentation.namePtBr}
        </span>
      ) : (
        <Image
          alt=""
          className={styles.clanCardSymbol}
          height={84}
          src={visual.symbol}
          width={84}
        />
      )}
      {visual === undefined ? null : <strong>{presentation.namePtBr}</strong>}
    </label>
  );
}

function DisciplineList({
  disciplineIds,
}: {
  readonly disciplineIds: readonly CreationDisciplineId[];
}) {
  return (
    <section className={styles.clanDetailBlock}>
      <h3>Disciplinas do clã</h3>
      <ul className={styles.disciplineList}>
        {disciplineIds.map((disciplineId) => {
          const discipline = DISCIPLINE_PRESENTATIONS[disciplineId];
          return (
            <li key={disciplineId}>
              <ContextTooltip
                description={discipline.descriptionPtBr}
                label={discipline.namePtBr}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function OtherOriginMechanics({ option }: { readonly option: CreationOriginOptionView }) {
  if (option.mechanics.type === "CAITIFF") {
    return (
      <section className={`${styles.clanSystemNotes} ${styles.originMechanics}`}>
        <h3>Como esta origem funciona</h3>
        <div>
          <strong>Nesta escolha</strong>
          <p>
            Você registra uma origem sem clã. Não recebe Perdição nem Compulsão de clã e
            começa sob a condição social de Suspeito, sem comprar Status na criação.
          </p>
        </div>
        <div>
          <strong>Na etapa de Disciplinas</strong>
          <p>
            Você escolherá duas Disciplinas quaisquer: dois pontos em uma e um ponto na
            outra. O avanço Caitiff custa novo nível ×{" "}
            {option.mechanics.disciplineExperienceMultiplier} XP.
          </p>
        </div>
      </section>
    );
  }
  if (option.mechanics.type === "THIN_BLOOD") {
    return (
      <section className={`${styles.clanSystemNotes} ${styles.originMechanics}`}>
        <h3>Como esta origem funciona</h3>
        <div>
          <strong>Nesta escolha</strong>
          <p>
            Você registra Potência do Sangue {option.mechanics.bloodPotency}, sem
            Perdição, Compulsão ou Disciplinas intrínsecas de clã. Sangue com Ressonância
            pode conceder temporariamente uma Disciplina associada.
          </p>
        </div>
        <div>
          <strong>Em etapas posteriores</strong>
          <p>
            Você escolherá de uma a três Qualidades Sangue-Ralo e o mesmo número de
            Defeitos. Alquimia e fórmulas serão tratadas com Disciplinas; Tipo de Predador
            não é escolhido na criação.
          </p>
        </div>
      </section>
    );
  }
  return null;
}

function OriginDetails({
  onLearnMore,
  option,
}: {
  readonly onLearnMore: () => void;
  readonly option: CreationOriginOptionView;
}) {
  const visual = CLAN_VISUALS[option.id];
  const presentation = getClanPresentation(option.id);
  return (
    <section
      aria-live="polite"
      className={styles.clanDetails}
      data-origin-kind={option.kind}
      style={
        {
          "--clan-accent": visual?.accent ?? "#841a25",
          "--clan-deep": visual?.deep ?? "#241b1a",
        } as React.CSSProperties
      }
    >
      <header className={styles.clanDetailsHeader}>
        {visual === undefined ? null : (
          <Image alt="" height={124} src={visual.symbol} width={124} />
        )}
        <div>
          <span>{option.category === "CLAN" ? "Clã" : "Outra origem"}</span>
          <h2>{presentation.namePtBr}</h2>
        </div>
      </header>
      <div className={styles.clanSummary}>
        {presentation.summaryParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <section className={styles.clanDetailBlock}>
        <h3>Arquétipos comuns</h3>
        <ul className={styles.archetypeList}>
          {presentation.archetypes.map((item) => (
            <li key={item.label}>
              <ContextTooltip description={item.description} label={item.label} />
            </li>
          ))}
        </ul>
      </section>

      {option.disciplines.length === 0 ? null : (
        <DisciplineList disciplineIds={option.disciplines} />
      )}
      {option.mechanics.type === "CLAN" ? (
        <div className={styles.baneCompulsionGrid}>
          <section>
            <h3>Perdição</h3>
            <strong>{option.bane?.name}</strong>
            <p>{option.bane?.summary}</p>
          </section>
          <section>
            <h3>Compulsão</h3>
            <strong>{option.compulsion?.name}</strong>
            <p>{option.compulsion?.summary}</p>
          </section>
        </div>
      ) : (
        <OtherOriginMechanics option={option} />
      )}

      <button className={styles.learnClanButton} onClick={onLearnMore} type="button">
        {option.category === "CLAN" ? "Conhecer este Clã" : "Conhecer esta origem"}{" "}
        <span aria-hidden="true">→</span>
      </button>
      <small>
        Referência editorial:{" "}
        {presentation.sourceRefs.map((item) => item.sourceId).join(" · ")}
      </small>
    </section>
  );
}

function DeepDiveDialog({
  onClose,
  presentation,
}: {
  readonly onClose: () => void;
  readonly presentation: ClanPresentation;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButton.current?.focus();
  }, []);
  return (
    <div className={styles.clanLoreBackdrop} onClick={onClose}>
      <section
        aria-labelledby="clan-lore-title"
        aria-modal="true"
        className={styles.clanLoreDialog}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Fechar conteúdo do clã"
          onClick={onClose}
          ref={closeButton}
          type="button"
        >
          ×
        </button>
        <p>Conhecer em profundidade</p>
        <h2 id="clan-lore-title">{presentation.namePtBr}</h2>
        {[...presentation.summaryParagraphs, ...presentation.deepDiveParagraphs].map(
          (paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ),
        )}
        <small>
          Paráfrase editorial baseada em{" "}
          {presentation.sourceRefs.map((item) => item.sourceId).join(" · ")}.
        </small>
      </section>
    </div>
  );
}

export function GuidedClan({ characterId }: { readonly characterId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<CreationClanStepView | null>(null);
  const [activeId, setActiveId] = useState<CreationOriginId>("clan:toreador");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [loreOpen, setLoreOpen] = useState(false);
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof loadCharacterSheetById>
  > | null>(null);
  const closePreviewButton = useRef<HTMLButtonElement>(null);
  const closeHelpButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    void loadCreationClan(characterId, controller.signal)
      .then((view) => {
        setStep(view);
        if (view.evaluation.selectedOriginId !== null)
          setActiveId(view.evaluation.selectedOriginId);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setMessage(reason instanceof Error ? reason.message : "A etapa não respondeu.");
      });
    return () => controller.abort();
  }, [characterId]);

  useEffect(() => {
    if (preview !== null) closePreviewButton.current?.focus();
    if (helpOpen) closeHelpButton.current?.focus();
    if (preview === null && !helpOpen && !loreOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPreview(null);
      setHelpOpen(false);
      setLoreOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [helpOpen, loreOpen, preview]);

  const activeOption = useMemo(
    () => step?.options.find((option) => option.id === activeId) ?? null,
    [activeId, step],
  );
  const clans = step?.options.filter((option) => option.category === "CLAN") ?? [];
  const otherOrigins =
    step?.options.filter((option) => option.category === "OTHER_ORIGIN") ?? [];

  async function choose(originId: CreationOriginId) {
    if (step === null || pending) return;
    setActiveId(originId);
    setPending(true);
    setMessage("Salvando escolha…");
    try {
      const saved = await updateCreationClan(characterId, step.version, originId);
      setStep(saved);
      setMessage(`${getClanPresentation(originId).namePtBr} salvo na ficha.`);
    } catch (reason) {
      setMessage(
        reason instanceof Error ? reason.message : "A escolha não pôde ser salva.",
      );
    } finally {
      setPending(false);
    }
  }

  async function openPreview() {
    setMessage("");
    const controller = new AbortController();
    try {
      setPreview(
        await loadCharacterSheetById("player-one", characterId, controller.signal),
      );
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "A ficha não respondeu.");
    }
  }

  if (step === null || activeOption === null) {
    return (
      <main className={`${styles.creationShell} ${styles.guidedShell}`}>
        <section className={styles.guidedLoading} aria-live="polite">
          <AnkhMark />
          <p>{message || "Preparando as linhagens de Sangue…"}</p>
        </section>
      </main>
    );
  }
  const activePresentation = getClanPresentation(activeOption.id);

  return (
    <main className={`${styles.creationShell} ${styles.guidedShell}`}>
      <article className={`${styles.guidedDocument} ${styles.clanDocument}`}>
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
          {steps.map(([id, label]) => {
            const status = step.creationContext.steps.find(
              (candidate) => candidate.id === id,
            )?.status;
            return (
              <span
                className={id === "clan" ? styles.currentStep : ""}
                data-complete={status === "complete"}
                data-status={status}
                key={id}
              >
                {label}
                <i />
              </span>
            );
          })}
        </nav>
        <div className={styles.clanLayout}>
          <section className={styles.clanSelection}>
            <header>
              <h2>Clã</h2>
              <p>Escolha o sangue que moldou seu personagem.</p>
            </header>
            <fieldset className={styles.clanGrid}>
              <legend className={styles.visuallyHidden}>Clãs</legend>
              {clans.map((option) => (
                <OriginCard
                  key={option.id}
                  onChoose={(originId) => void choose(originId)}
                  option={option}
                  pending={pending}
                  selected={step.evaluation.selectedOriginId === option.id}
                />
              ))}
            </fieldset>
            <div className={styles.otherOriginsHeading}>
              <span />
              <h3>Outras origens</h3>
              <span />
            </div>
            <fieldset className={styles.otherOriginsGrid}>
              <legend className={styles.visuallyHidden}>Outras origens</legend>
              {otherOrigins.map((option) => (
                <OriginCard
                  key={option.id}
                  onChoose={(originId) => void choose(originId)}
                  option={option}
                  pending={pending}
                  selected={step.evaluation.selectedOriginId === option.id}
                />
              ))}
            </fieldset>
          </section>
          <OriginDetails onLearnMore={() => setLoreOpen(true)} option={activeOption} />
          <button
            aria-expanded={helpOpen}
            aria-label="Entender a etapa de Clã"
            className={styles.clanHelpTab}
            onClick={() => setHelpOpen(true)}
            type="button"
          >
            i
          </button>
        </div>
        <footer className={styles.guidedActions}>
          <Link href={`/personagens/${characterId}/criar/conceito`}>← Voltar</Link>
          <div>
            <button onClick={() => void openPreview()} type="button">
              Ver ficha até agora
            </button>
            <Link href={`/ficha/${characterId}?identity=player-one&mode=direct`}>
              Preencher diretamente
            </Link>
            <button
              className={styles.continueButton}
              disabled={!step.evaluation.complete || pending}
              onClick={() => router.push(`/personagens/${characterId}/criar/atributos`)}
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

      {helpOpen ? (
        <div className={styles.clanHelpBackdrop} onClick={() => setHelpOpen(false)}>
          <aside
            aria-label="Entender a escolha de Clã"
            aria-modal="true"
            className={styles.clanHelpDrawer}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Fechar ajuda"
              onClick={() => setHelpOpen(false)}
              ref={closeHelpButton}
              type="button"
            >
              ×
            </button>
            <p>Entender esta etapa</p>
            <h2>O que muda com a origem?</h2>
            <p>
              O clã define uma herança de Sangue: Disciplinas, Perdição e Compulsão.
              Caitiff e Sangue-Ralo seguem estruturas próprias, apresentadas sem fingir
              que são clãs.
            </p>
            <p>
              Esta escolha registra a origem na mesma ficha. Geração, Humanidade e poderes
              serão tratados nas etapas adequadas.
            </p>
            <small>Política {step.policy.ruleRevision}</small>
          </aside>
        </div>
      ) : null}
      {loreOpen ? (
        <DeepDiveDialog
          onClose={() => setLoreOpen(false)}
          presentation={activePresentation}
        />
      ) : null}
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
              <button
                ref={closePreviewButton}
                onClick={() => setPreview(null)}
                type="button"
              >
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
