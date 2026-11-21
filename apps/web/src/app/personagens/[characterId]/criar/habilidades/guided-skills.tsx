"use client";

import type {
  CreationSkillId,
  CreationSkillMethodId,
  CreationSkillsStepView,
  CreationSpecialtyView,
} from "@assistente-vampiro/contracts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { loadCharacterSheetById } from "../../../../character-api";
import { CharacterSheetPrototype } from "../../../../character-sheet-prototype";
import { AnkhMark } from "../../../ankh-mark";
import { CharacterCreationIdentity } from "../../../criar/character-creation-identity";
import {
  createCreationSpecialty,
  deleteCreationSpecialty,
  loadCreationSkills,
  updateCreationSkills,
  updateCreationSpecialty,
} from "../../../criar/creation-client";
import styles from "../../../criar/creation.module.css";

const creationSteps = [
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

const groupNames = {
  MENTAL: "Mentais",
  PHYSICAL: "Físicas",
  SOCIAL: "Sociais",
} as const;

const quickMethods = [
  "QUICK_BALANCED",
  "QUICK_SPECIALIST",
  "QUICK_JACK_OF_ALL_TRADES",
] as const satisfies readonly CreationSkillMethodId[];

function SpecialtyEditor({
  specialty,
  disabled,
  onCancel,
  onDelete,
  onEdit,
  onSave,
}: {
  readonly specialty: CreationSpecialtyView;
  readonly disabled: boolean;
  readonly onCancel: () => void;
  readonly onDelete: () => void;
  readonly onEdit: () => void;
  readonly onSave: (label: string) => void;
}) {
  const [label, setLabel] = useState(specialty.label);

  return (
    <div className={styles.specialtyChip}>
      <label>
        <span>Especialização</span>
        <input
          aria-label="Nome da Especialização"
          autoFocus
          maxLength={80}
          onChange={(event) => {
            setLabel(event.target.value);
            onEdit();
          }}
          value={label}
        />
      </label>
      <div>
        <button
          aria-label={`Remover ${specialty.label}`}
          className={styles.specialtyRemove}
          disabled={disabled}
          onClick={onDelete}
          type="button"
        >
          Remover especialização
        </button>
        <button disabled={disabled} onClick={onCancel} type="button">
          Cancelar
        </button>
        <button
          disabled={disabled || label.trim().length < 2}
          onClick={() => onSave(label.trim())}
          type="button"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

function errorMessage(reason: unknown): string {
  return reason instanceof Error
    ? reason.message
    : "A escolha não pôde ser aplicada. O estado da ficha foi preservado.";
}

export function GuidedSkills({ characterId }: { readonly characterId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<CreationSkillsStepView | null>(null);
  const [pending, setPending] = useState(false);
  const [expandedSkill, setExpandedSkill] = useState<CreationSkillId | null>(null);
  const [activeHelp, setActiveHelp] = useState<CreationSkillId | null>(null);
  const [addingFor, setAddingFor] = useState<CreationSkillId | null>(null);
  const [choosingFreeSpecialty, setChoosingFreeSpecialty] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [specialtyError, setSpecialtyError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof loadCharacterSheetById>
  > | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const specialtyInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    void loadCreationSkills(characterId, controller.signal)
      .then((next) => {
        setStep(next);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setMessage(errorMessage(reason));
      });
    return () => controller.abort();
  }, [characterId]);

  useEffect(() => {
    if (preview !== null) closeButton.current?.focus();
  }, [preview]);

  useEffect(() => {
    if (addingFor !== null) specialtyInput.current?.focus();
  }, [addingFor]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (preview !== null) {
        setPreview(null);
        return;
      }
      setAddingFor(null);
      setNewLabel("");
      setExpandedSkill(null);
      setActiveHelp(null);
      setChoosingFreeSpecialty(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [preview]);

  async function perform(
    operation: (current: CreationSkillsStepView) => Promise<CreationSkillsStepView>,
    isApplied: (current: CreationSkillsStepView) => boolean,
    onError?: (feedback: string) => void,
  ): Promise<CreationSkillsStepView | null> {
    if (step === null || pending) return null;
    setPending(true);
    setMessage("");
    try {
      const next = await operation(step);
      setStep(next);
      return next;
    } catch (reason) {
      try {
        const authoritative = await loadCreationSkills(characterId);
        setStep(authoritative);
        if (isApplied(authoritative)) {
          setMessage(
            "A conexão foi interrompida, mas a alteração já estava salva e foi sincronizada.",
          );
          return authoritative;
        }
      } catch {
        // A mensagem original é mais útil; nenhuma mutação é repetida automaticamente.
      }
      const feedback = errorMessage(reason);
      setMessage(feedback);
      onError?.(feedback);
      return null;
    } finally {
      setPending(false);
    }
  }

  function chooseMethod(methodId: CreationSkillMethodId) {
    void perform(
      (current) => updateCreationSkills(characterId, current.version, {}, methodId),
      (current) => current.methodId === methodId,
    );
  }

  function chooseRating(skillId: CreationSkillId, requested: number) {
    if (step === null || requested > step.policy.maximumRating) return;
    const value =
      step.skills[skillId] === requested ? Math.max(0, requested - 1) : requested;
    const relatedSpecialties = step.specialties.filter(
      (specialty) => specialty.skillId === skillId,
    );
    const invalidatesSpecialty =
      relatedSpecialties.length > 0 &&
      (value === 0 || (skillId !== "skill:craft" && value < relatedSpecialties.length));
    if (invalidatesSpecialty) {
      setExpandedSkill(skillId);
      setMessage(
        "Esta alteração afeta uma Especialização existente. Remova ou reorganize a Especialização antes de reduzir a Habilidade.",
      );
      return;
    }
    void perform(
      (current) =>
        updateCreationSkills(characterId, current.version, { [skillId]: value }),
      (current) => current.skills[skillId] === value,
    );
  }

  function openSpecialty(skillId: CreationSkillId, openEditor = false) {
    if (step === null) return;
    setExpandedSkill(skillId);
    setAddingFor(openEditor ? skillId : null);
    setNewLabel("");
    setSpecialtyError("");
    setChoosingFreeSpecialty(false);
    window.setTimeout(() => {
      const row = document.getElementById(`${skillId}-row`);
      row?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
      if (!openEditor) {
        row?.querySelector<HTMLButtonElement>("[data-skill-name]")?.focus();
      }
    }, 0);
  }

  function toggleSkillHelp(skillId: CreationSkillId) {
    setActiveHelp((current) => (current === skillId ? null : skillId));
  }

  function openSpecialtyEditor(skillId: CreationSkillId) {
    if (step !== null && choosingFreeSpecialty) {
      const specialtyCount = step.specialties.filter(
        (specialty) => specialty.skillId === skillId,
      ).length;
      const hasCapacity =
        skillId === "skill:craft" || specialtyCount < step.skills[skillId];
      if (step.skills[skillId] > 0 && hasCapacity) {
        openSpecialty(skillId, true);
        return;
      }
      setMessage(
        step.skills[skillId] < 1
          ? "Escolha uma Habilidade com ao menos 1 ponto."
          : "Esta Habilidade não possui espaço para outra Especialização no nível atual.",
      );
      return;
    }
    if (step === null) return;
    const skillSpecialties = step.specialties.filter(
      (specialty) => specialty.skillId === skillId,
    );
    const automaticPending =
      step.evaluation.automaticSpecialtiesPending.includes(skillId);
    const hasGrant = automaticPending || step.evaluation.freeSpecialtiesPending > 0;
    const hasCapacity =
      skillId === "skill:craft" || skillSpecialties.length < step.skills[skillId];
    setExpandedSkill(skillId);
    setActiveHelp(null);
    setNewLabel("");
    setSpecialtyError("");
    setAddingFor(
      skillSpecialties.length === 0 && hasGrant && hasCapacity ? skillId : null,
    );
  }

  function closeSpecialtyEditor() {
    setAddingFor(null);
    setNewLabel("");
    setSpecialtyError("");
    setExpandedSkill(null);
  }

  function startAddingSpecialty(skillId: CreationSkillId) {
    if (step === null) return;
    if (step.skills[skillId] < 1) {
      setMessage("Distribua ao menos 1 ponto nesta Habilidade antes de especializá-la.");
      return;
    }
    const hasGrant =
      step.evaluation.automaticSpecialtiesPending.includes(skillId) ||
      step.evaluation.freeSpecialtiesPending > 0;
    if (!hasGrant) {
      setMessage("As concessões de Especialização desta etapa já foram utilizadas.");
      return;
    }
    const existingCount = step.specialties.filter(
      (specialty) => specialty.skillId === skillId,
    ).length;
    if (skillId !== "skill:craft" && existingCount >= step.skills[skillId]) {
      setMessage(
        "Esta Habilidade não possui espaço para outra Especialização no nível atual.",
      );
      return;
    }
    setAddingFor(skillId);
    setNewLabel("");
    setSpecialtyError("");
  }

  async function addSpecialty(skillId: CreationSkillId) {
    if (step === null || newLabel.trim().length < 2) return;
    const label = newLabel.trim();
    const origin = step.evaluation.automaticSpecialtiesPending.includes(skillId)
      ? "CREATION_AUTOMATIC"
      : "CREATION_FREE";
    const next = await perform(
      (current) =>
        createCreationSpecialty(characterId, current.version, skillId, origin, label),
      (current) =>
        current.specialties.some(
          (specialty) =>
            specialty.skillId === skillId &&
            specialty.origin === origin &&
            specialty.label === label,
        ),
      setSpecialtyError,
    );
    if (next !== null) {
      closeSpecialtyEditor();
    }
  }

  async function openPreview() {
    try {
      setPreview(
        await loadCharacterSheetById(
          "player-one",
          characterId,
          new AbortController().signal,
        ),
      );
    } catch (reason) {
      setMessage(errorMessage(reason));
    }
  }

  if (step === null) {
    return (
      <main className={`${styles.creationShell} ${styles.guidedShell}`}>
        <section className={styles.guidedLoading} aria-live="polite">
          <AnkhMark />
          <p>{message || "Preparando as Habilidades da ficha…"}</p>
        </section>
      </main>
    );
  }

  const selectedMethod = step.policy.methods.find(
    (method) =>
      method.id === step.methodId &&
      quickMethods.includes(method.id as (typeof quickMethods)[number]),
  );
  const selectedMethodLabel = selectedMethod?.labelPtBr ?? "Escolha um método";
  const selectedMethodDescription =
    selectedMethod?.descriptionPtBr ?? "A distribuição aparecerá aqui.";
  const automaticSkills = step.policy.automaticSpecialtySkillIds.filter(
    (skillId) => step.skills[skillId] > 0,
  );
  const freeSpecialty = step.specialties.find(
    (specialty) => specialty.origin === "CREATION_FREE",
  );
  const skillLabel = new Map(step.catalog.map((skill) => [skill.id, skill.labelPtBr]));
  return (
    <main className={`${styles.creationShell} ${styles.guidedShell}`}>
      <article
        aria-busy={pending}
        aria-labelledby="skills-title"
        className={`${styles.guidedDocument} ${styles.skillsDocument}`}
      >
        <header className={styles.guidedMasthead}>
          <AnkhMark />
          <div>
            <h1>Assistente Vampiro</h1>
            <p>Ficha de personagem · quinta edição</p>
          </div>
          <CharacterCreationIdentity context={step.creationContext} />
          <p>
            <strong>Em criação</strong>
            <span>Modo guiado</span>
          </p>
        </header>

        <nav aria-label="Etapas da criação" className={styles.stepTrack}>
          {creationSteps.map(([id, label]) => {
            const status = step.creationContext.steps.find(
              (candidate) => candidate.id === id,
            )?.status;
            return (
              <span
                className={id === "skills" ? styles.currentStep : ""}
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

        <div className={styles.skillsLayout}>
          <section className={styles.skillsStage}>
            <header className={styles.stageHeading}>
              <p>Mostram o que seu personagem aprendeu a fazer ao longo da vida.</p>
              <h2 id="skills-title">Habilidades</h2>
            </header>

            <fieldset
              aria-busy={pending}
              className={styles.methodSelector}
              disabled={pending}
            >
              <legend>Método de distribuição</legend>
              {quickMethods.map((id) => {
                const method = step.policy.methods.find((item) => item.id === id)!;
                return (
                  <label
                    data-busy={pending}
                    data-selected={step.methodId === id}
                    key={id}
                  >
                    <input
                      checked={step.methodId === id}
                      name="skill-method"
                      onChange={() => chooseMethod(id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") chooseMethod(id);
                      }}
                      type="radio"
                      value={id}
                    />
                    <span>
                      <strong>{method.labelPtBr}</strong>
                      <small>{method.descriptionPtBr}</small>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <div className={styles.skillColumns}>
              {(["PHYSICAL", "SOCIAL", "MENTAL"] as const).map((group) => (
                <section key={group}>
                  <h3>{groupNames[group]}</h3>
                  {step.catalog
                    .filter((skill) => skill.group === group)
                    .map((skill) => {
                      const value = step.skills[skill.id];
                      const skillSpecialties = step.specialties.filter(
                        (item) => item.skillId === skill.id,
                      );
                      const automaticPending =
                        step.evaluation.automaticSpecialtiesPending.includes(skill.id);
                      const hasSpecialtyCapacity =
                        skill.id === "skill:craft" || skillSpecialties.length < value;
                      const canAdd =
                        value > 0 &&
                        hasSpecialtyCapacity &&
                        (automaticPending || step.evaluation.freeSpecialtiesPending > 0);
                      const freeEligible =
                        choosingFreeSpecialty && value > 0 && hasSpecialtyCapacity;
                      const specialtyActionUnavailable =
                        value < 1 || (!canAdd && skillSpecialties.length === 0);
                      const specialtyActionHint =
                        value < 1
                          ? "Adicione ao menos 1 ponto para definir uma especialização."
                          : !hasSpecialtyCapacity
                            ? "O nível atual não permite outra especialização."
                            : specialtyActionUnavailable
                              ? "Nenhuma especialização está disponível para esta Habilidade."
                              : "Adicionar ou editar especialização";
                      return (
                        <div
                          className={styles.skillRow}
                          data-expanded={expandedSkill === skill.id}
                          data-free-eligible={freeEligible}
                          id={`${skill.id}-row`}
                          key={skill.id}
                        >
                          <div className={styles.skillLine}>
                            <span
                              className={styles.skillLabel}
                              data-open={activeHelp === skill.id}
                            >
                              <button
                                aria-describedby={`${skill.id}-help`}
                                aria-expanded={activeHelp === skill.id}
                                aria-label={`${skill.labelPtBr}: mostrar ajuda`}
                                data-skill-name
                                onBlur={() => setActiveHelp(null)}
                                onClick={() => toggleSkillHelp(skill.id)}
                                onFocus={() => setActiveHelp(skill.id)}
                                type="button"
                              >
                                {skill.labelPtBr}
                                {expandedSkill === skill.id
                                  ? null
                                  : skillSpecialties.map((specialty) => (
                                      <small key={specialty.id}>
                                        ↳ {specialty.label}
                                      </small>
                                    ))}
                              </button>
                              <span id={`${skill.id}-help`} role="tooltip">
                                <strong>{skill.labelPtBr}</strong>
                                {skill.summaryPtBr}
                              </span>
                            </span>
                            <div
                              aria-label={`${skill.labelPtBr}: ${value}`}
                              className={styles.skillRating}
                            >
                              {Array.from(
                                { length: step.policy.structuralMaximum },
                                (_, index) => index + 1,
                              ).map((rating) => {
                                const unavailableDuringCreation =
                                  rating > step.policy.maximumRating;

                                return (
                                  <button
                                    aria-disabled={
                                      unavailableDuringCreation ||
                                      pending ||
                                      step.methodId === null
                                    }
                                    aria-label={
                                      unavailableDuringCreation
                                        ? `${skill.labelPtBr}: ponto ${rating} indisponível na criação inicial`
                                        : `Definir ${skill.labelPtBr} em ${rating}`
                                    }
                                    aria-pressed={rating <= value}
                                    data-creation-locked={unavailableDuringCreation}
                                    disabled={pending || step.methodId === null}
                                    key={rating}
                                    onClick={
                                      unavailableDuringCreation
                                        ? undefined
                                        : () => chooseRating(skill.id, rating)
                                    }
                                    title={
                                      unavailableDuringCreation
                                        ? "O quinto ponto existe na escala, mas não pode ser escolhido na criação inicial."
                                        : undefined
                                    }
                                    type="button"
                                  />
                                );
                              })}
                            </div>
                            <span className={styles.specialtyAction}>
                              <button
                                aria-label={`Adicionar ou editar especialização de ${skill.labelPtBr}`}
                                aria-describedby={`${skill.id}-specialty-help`}
                                aria-disabled={pending || specialtyActionUnavailable}
                                aria-expanded={expandedSkill === skill.id}
                                data-pending={automaticPending}
                                disabled={pending}
                                onClick={() => {
                                  if (!specialtyActionUnavailable) {
                                    openSpecialtyEditor(skill.id);
                                  }
                                }}
                                type="button"
                              >
                                <span aria-hidden="true">✎</span>
                              </button>
                              <span id={`${skill.id}-specialty-help`} role="tooltip">
                                {specialtyActionHint}
                              </span>
                              {automaticPending ? (
                                <i title="Especialização pendente">
                                  <span className={styles.visuallyHidden}>
                                    Especialização pendente
                                  </span>
                                  <span aria-hidden="true">!</span>
                                </i>
                              ) : null}
                            </span>
                          </div>

                          {expandedSkill === skill.id ? (
                            <div className={styles.specialtyEditor}>
                              {skillSpecialties.map((specialty) => (
                                <SpecialtyEditor
                                  disabled={pending}
                                  key={specialty.id}
                                  onCancel={closeSpecialtyEditor}
                                  onDelete={() => {
                                    void (async () => {
                                      const next = await perform(
                                        (current) =>
                                          deleteCreationSpecialty(
                                            characterId,
                                            specialty.id,
                                            current.version,
                                          ),
                                        (current) =>
                                          !current.specialties.some(
                                            (candidate) => candidate.id === specialty.id,
                                          ),
                                        setSpecialtyError,
                                      );
                                      if (next !== null) closeSpecialtyEditor();
                                    })();
                                  }}
                                  onEdit={() => setSpecialtyError("")}
                                  onSave={(label) => {
                                    void (async () => {
                                      const next = await perform(
                                        (current) =>
                                          updateCreationSpecialty(
                                            characterId,
                                            specialty.id,
                                            current.version,
                                            label,
                                          ),
                                        (current) =>
                                          current.specialties.some(
                                            (candidate) =>
                                              candidate.id === specialty.id &&
                                              candidate.label === label,
                                          ),
                                        setSpecialtyError,
                                      );
                                      if (next !== null) closeSpecialtyEditor();
                                    })();
                                  }}
                                  specialty={specialty}
                                />
                              ))}

                              {addingFor === skill.id ? (
                                <div className={styles.specialtyAdd}>
                                  <label>
                                    <span>Especialização</span>
                                    <input
                                      aria-label={`Nova Especialização de ${skill.labelPtBr}`}
                                      maxLength={80}
                                      onChange={(event) => {
                                        setNewLabel(event.target.value);
                                        setSpecialtyError("");
                                      }}
                                      placeholder="Digite uma especialização…"
                                      ref={specialtyInput}
                                      value={newLabel}
                                    />
                                  </label>
                                  <div>
                                    <button
                                      disabled={pending}
                                      onClick={closeSpecialtyEditor}
                                      type="button"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      disabled={pending || newLabel.trim().length < 2}
                                      onClick={() => void addSpecialty(skill.id)}
                                      type="button"
                                    >
                                      Confirmar
                                    </button>
                                  </div>
                                </div>
                              ) : canAdd ? (
                                skillSpecialties.length > 0 ? (
                                  <button
                                    className={styles.addSpecialtyButton}
                                    disabled={pending}
                                    onClick={() => startAddingSpecialty(skill.id)}
                                    type="button"
                                  >
                                    + Adicionar outra especialização
                                  </button>
                                ) : null
                              ) : null}
                              {specialtyError === "" ? null : (
                                <p className={styles.specialtyError} role="alert">
                                  {specialtyError}
                                </p>
                              )}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                </section>
              ))}
            </div>
          </section>

          <aside className={styles.skillsRulePanel}>
            <section className={`${styles.selectedMethod} ${styles.firstRuleSection}`}>
              <h3>Método</h3>
              <strong>{selectedMethodLabel}</strong>
              <span>{selectedMethodDescription}</span>
            </section>

            <section>
              <h3>Distribuição</h3>
              {selectedMethod === undefined ? (
                <p>Selecione um método para ver sua distribuição disponível.</p>
              ) : (
                <ul className={styles.distributionRemaining}>
                  {selectedMethod.ratingCounts.map((entry) => {
                    const current = Object.values(step.skills).filter(
                      (value) => value === entry.rating,
                    ).length;
                    const remaining = Math.max(0, entry.count - current);
                    return (
                      <li data-complete={remaining === 0} key={entry.rating}>
                        <span>Nível {entry.rating}</span>
                        <strong>
                          {remaining === 0
                            ? "completo"
                            : `${remaining} ${remaining === 1 ? "restante" : "restantes"}`}
                        </strong>
                      </li>
                    );
                  })}
                </ul>
              )}
              {step.evaluation.violations.some(
                (violation) => violation.code === "SKILL_DISTRIBUTION_UNREACHABLE",
              ) ? (
                <p className={styles.ruleWarning}>
                  A distribuição atual não cabe neste método. Ajuste os níveis destacados;
                  nenhum valor foi apagado.
                </p>
              ) : null}
            </section>

            <section>
              <h3>Especializações</h3>
              <div className={styles.specialtySummary}>
                {automaticSkills.length === 0 ? (
                  <p>Nenhuma pendência automática até o momento.</p>
                ) : (
                  automaticSkills.map((skillId) => {
                    const specialty = step.specialties.find(
                      (candidate) =>
                        candidate.skillId === skillId &&
                        candidate.origin === "CREATION_AUTOMATIC",
                    );
                    return specialty === undefined ? (
                      <button
                        key={skillId}
                        onClick={() => openSpecialty(skillId, true)}
                        type="button"
                      >
                        <span aria-hidden="true">!</span>
                        {skillLabel.get(skillId)} — definir
                      </button>
                    ) : (
                      <p key={skillId}>
                        <span aria-hidden="true">✓</span> {skillLabel.get(skillId)} —{" "}
                        {specialty.label}
                      </p>
                    );
                  })
                )}
                {freeSpecialty === undefined ? (
                  <>
                    <button
                      disabled={step.methodId === null}
                      onClick={() => {
                        setChoosingFreeSpecialty(true);
                        setExpandedSkill(null);
                        setAddingFor(null);
                        setMessage(
                          "Escolha uma Habilidade para receber sua especialização livre.",
                        );
                      }}
                      type="button"
                    >
                      + Escolher especialização livre
                    </button>
                    {choosingFreeSpecialty ? (
                      <p className={styles.freeSpecialtyInstruction} role="status">
                        Escolha uma Habilidade para receber sua especialização livre.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p>
                    <span aria-hidden="true">✓</span>{" "}
                    {skillLabel.get(freeSpecialty.skillId)} — {freeSpecialty.label}
                  </p>
                )}
              </div>
            </section>

            <section>
              <h3>O que são Habilidades?</h3>
              <p>
                Habilidades representam tudo aquilo que seu personagem aprendeu a fazer ao
                longo da vida, pelo estudo, pelo trabalho, pela prática ou simplesmente
                pela necessidade de sobreviver. Elas se dividem em Físicas, Sociais e
                Mentais e revelam onde existe experiência de verdade por trás do potencial
                mostrado pelos Atributos. A forma como esses pontos são distribuídos ajuda
                a contar quem essa pessoa era antes do Abraço e quais conhecimentos,
                hábitos e talentos ela ainda carrega consigo noite após noite.
              </p>
            </section>
          </aside>
        </div>

        <footer className={styles.guidedActions}>
          <Link href={`/personagens/${characterId}/criar/atributos`}>← Voltar</Link>
          <div>
            <button onClick={() => void openPreview()} type="button">
              Ver ficha até agora
            </button>
            <Link href={`/ficha/${characterId}?identity=player-one&mode=direct`}>
              Preencher diretamente
            </Link>
            <button
              className={styles.continueButton}
              disabled={!step.evaluation.complete || selectedMethod === undefined}
              onClick={() => {
                router.push(`/personagens/${characterId}/criar/disciplinas`);
              }}
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
