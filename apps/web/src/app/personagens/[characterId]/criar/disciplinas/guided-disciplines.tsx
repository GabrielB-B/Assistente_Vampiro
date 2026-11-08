"use client";

import type {
  CreationDisciplineId,
  CreationDisciplinesStepView,
  DisciplineCatalogItemView,
  DisciplinePowerCatalogItemView,
  DisciplinePowerId,
  PowerPresentationView,
  PowerRuleView,
} from "@assistente-vampiro/contracts";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { loadCharacterSheetById } from "../../../../character-api";
import { CharacterSheetPrototype } from "../../../../character-sheet-prototype";
import { AnkhMark } from "../../../ankh-mark";
import { CharacterCreationIdentity } from "../../../criar/character-creation-identity";
import {
  loadCreationDisciplines,
  previewCreationDisciplines,
  updateCreationDisciplines,
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
const feedback = (reason: unknown) =>
  reason instanceof Error
    ? reason.message
    : "A escolha não pôde ser salva; o estado anterior foi preservado.";
const powerLevels = [1, 2, 3, 4, 5] as const;

interface RatingAdjustment {
  readonly incompatiblePowerIds: readonly DisciplinePowerId[];
  readonly minimumRequiredRemovals: number;
  readonly removedPowerIds: readonly DisciplinePowerId[];
  readonly targetRating: number;
}

function formatSourceReference(ref: {
  readonly sourceId: string;
  readonly pages: readonly number[];
}) {
  const pages = [...new Set(ref.pages)].sort((left, right) => left - right);
  const ranges: string[] = [];
  for (let index = 0; index < pages.length; index += 1) {
    const start = pages[index]!;
    let end = start;
    while (pages[index + 1] === end + 1) {
      index += 1;
      end = pages[index]!;
    }
    ranges.push(start === end ? `${start}` : `${start}–${end}`);
  }
  return `${ref.sourceId}, p. ${ranges.join(", ")}`;
}

type TransitionalPower = Omit<DisciplinePowerCatalogItemView, "presentation" | "rule"> & {
  readonly presentation?: PowerPresentationView;
  readonly rule?: PowerRuleView;
};

function powerPresentation(power: DisciplinePowerCatalogItemView): PowerPresentationView {
  const transitional = power as TransitionalPower;
  return (
    transitional.presentation ?? {
      contentKind: "PROJECT_PARAPHRASE",
      contentRevisionId: "legacy-flat-catalog",
      descriptionPtBr: power.descriptionPtBr,
      effectPtBr: power.effectPtBr,
      summaryPtBr: power.summaryPtBr,
    }
  );
}

function powerRule(power: DisciplinePowerCatalogItemView): PowerRuleView {
  const transitional = power as TransitionalPower;
  return (
    transitional.rule ?? {
      activationPtBr: null,
      amalgamRequirements: power.amalgamRequirements,
      auditStatus: power.auditStatus,
      conditionsPtBr: [],
      cost: power.cost ?? null,
      dicePool: power.dicePool ?? null,
      difficulty: power.difficulty ?? null,
      duration: power.duration ?? null,
      notesPtBr: power.notesPtBr === undefined ? [] : [power.notesPtBr],
      prerequisitePowerOptions: power.prerequisitePowerOptions,
      prerequisites: power.prerequisites,
      rangePtBr: null,
      restrictionsPtBr:
        power.restrictionsPtBr === undefined ? [] : [power.restrictionsPtBr],
      ruleRevisionId: power.ruleRevisionId,
      ruleRevisions: power.ruleRevisions,
      sourceRefs: power.sourceRefs,
      systemStepsPtBr:
        power.systemPtBr === undefined ? [] : power.systemPtBr.split("\n\n"),
      targetPtBr: null,
    }
  );
}

function DetailDialog({
  catalog,
  discipline,
  power,
  onClose,
}: {
  readonly catalog: readonly DisciplineCatalogItemView[];
  readonly discipline: DisciplineCatalogItemView | undefined;
  readonly power: DisciplinePowerCatalogItemView | undefined;
  readonly onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (discipline === undefined && power === undefined) return;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || dialogRef.current === null) return;
      const focusable = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [discipline, onClose, power]);
  if (discipline === undefined && power === undefined) return null;
  const powerDiscipline =
    power === undefined
      ? undefined
      : catalog.find((candidate) => candidate.id === power.disciplineId);
  const powerName = (powerId: DisciplinePowerId) =>
    catalog
      .flatMap((candidate) => candidate.powers)
      .find((candidate) => candidate.id === powerId)?.namePtBr ?? powerId;
  const disciplineName = (disciplineId: CreationDisciplineId) =>
    catalog.find((candidate) => candidate.id === disciplineId)?.namePtBr ?? disciplineId;
  const selectedPresentation = power === undefined ? undefined : powerPresentation(power);
  const selectedRule = power === undefined ? undefined : powerRule(power);
  return (
    <div
      aria-modal="true"
      className={styles.disciplineDetailLayer}
      role="dialog"
      aria-labelledby="discipline-detail-title"
    >
      <article className={styles.disciplineDetailDialog} ref={dialogRef}>
        <header>
          <span>
            {power === undefined ? "Detalhes da Disciplina" : "Detalhes do Poder"}
          </span>
          <button
            aria-label="Fechar detalhes"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            ×
          </button>
        </header>
        {power === undefined ? (
          <>
            <h2 id="discipline-detail-title">{discipline!.namePtBr}</h2>
            <p className={styles.detailLead}>{discipline!.descriptionPtBr}</p>
            <section className={styles.disciplineGeneralRules}>
              <h3>Regras gerais</h3>
              <p>
                Cada ponto concede um Poder do novo nível ou de um nível inferior. A
                elegibilidade respeita nível, pré-requisitos e Amálgamas; esta consulta
                mostra o catálogo completo, não apenas as escolhas disponíveis agora.
              </p>
            </section>
            <div className={styles.powerLevels}>
              {([1, 2, 3, 4, 5] as const).map((level) => (
                <section key={level}>
                  <h3>Nível {level}</h3>
                  {discipline!.powers
                    .filter((candidate) => candidate.level === level)
                    .map((candidate) => (
                      <div key={candidate.id}>
                        <strong>{candidate.namePtBr}</strong>
                        <small>
                          {candidate.nameOriginal} ·{" "}
                          {candidate.sourceRefs.map(formatSourceReference).join("; ")}
                        </small>
                        <p>{powerPresentation(candidate).summaryPtBr}</p>
                      </div>
                    ))}
                </section>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className={styles.powerDetailEyebrow}>Poder</p>
            <h2 id="discipline-detail-title">{power.namePtBr}</h2>
            <p className={styles.powerOriginalName}>{power.nameOriginal}</p>
            <p className={styles.powerDetailEyebrow}>
              {powerDiscipline?.namePtBr ?? power.disciplineId} · Nível {power.level}
            </p>
            <section className={styles.powerDescription}>
              <h3>Descrição</h3>
              {selectedPresentation!.descriptionPtBr.split("\n\n").map((paragraph) => (
                <p className={styles.detailLead} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
            <h3 className={styles.powerSectionTitle}>Mecânica</h3>
            <dl className={styles.powerMechanics}>
              {selectedRule!.cost === null ? null : (
                <>
                  <dt>Custo</dt>
                  <dd>{selectedRule!.cost}</dd>
                </>
              )}
              {selectedRule!.activationPtBr === null ? null : (
                <>
                  <dt>Ativação</dt>
                  <dd>{selectedRule!.activationPtBr}</dd>
                </>
              )}
              {selectedRule!.dicePool === null ? null : (
                <>
                  <dt>Parada de dados / teste</dt>
                  <dd>{selectedRule!.dicePool}</dd>
                </>
              )}
              {selectedRule!.difficulty === null ? null : (
                <>
                  <dt>Dificuldade</dt>
                  <dd>{selectedRule!.difficulty}</dd>
                </>
              )}
              {selectedRule!.rangePtBr === null ? null : (
                <>
                  <dt>Alcance</dt>
                  <dd>{selectedRule!.rangePtBr}</dd>
                </>
              )}
              {selectedRule!.targetPtBr === null ? null : (
                <>
                  <dt>Alvo</dt>
                  <dd>{selectedRule!.targetPtBr}</dd>
                </>
              )}
              {selectedRule!.systemStepsPtBr.length === 0 ? null : (
                <>
                  <dt>Sistema</dt>
                  <dd>
                    {selectedRule!.systemStepsPtBr.map((step) => (
                      <p key={step}>{step}</p>
                    ))}
                  </dd>
                </>
              )}
              {selectedRule!.duration === null ? null : (
                <>
                  <dt>Duração</dt>
                  <dd>{selectedRule!.duration}</dd>
                </>
              )}
              {selectedRule!.prerequisites.length === 0 &&
              selectedRule!.prerequisitePowerOptions.length === 0 ? null : (
                <>
                  <dt>Pré-requisitos</dt>
                  <dd>
                    {[
                      ...selectedRule!.prerequisites.map(powerName),
                      ...selectedRule!.prerequisitePowerOptions.map(
                        (options) => `um entre: ${options.map(powerName).join(" ou ")}`,
                      ),
                    ].join("; ")}
                  </dd>
                </>
              )}
              {selectedRule!.amalgamRequirements.length === 0 ? null : (
                <>
                  <dt>Amálgama</dt>
                  <dd>
                    {selectedRule!.amalgamRequirements
                      .map(
                        (item) => `${disciplineName(item.disciplineId)} ${item.rating}`,
                      )
                      .join(", ")}
                  </dd>
                </>
              )}
              {selectedRule!.conditionsPtBr.length === 0 ? null : (
                <>
                  <dt>Condições</dt>
                  <dd>{selectedRule!.conditionsPtBr.join(" ")}</dd>
                </>
              )}
              {selectedRule!.restrictionsPtBr.length === 0 ? null : (
                <>
                  <dt>Restrições</dt>
                  <dd>{selectedRule!.restrictionsPtBr.join(" ")}</dd>
                </>
              )}
              {selectedRule!.notesPtBr.length === 0 ? null : (
                <>
                  <dt>Observações</dt>
                  <dd>{selectedRule!.notesPtBr.join(" ")}</dd>
                </>
              )}
              <dt>Referência</dt>
              <dd>{selectedRule!.sourceRefs.map(formatSourceReference).join("; ")}</dd>
              <dt>Revisão normativa</dt>
              <dd>
                {selectedRule!.ruleRevisionId} ·{" "}
                {selectedRule!.auditStatus === "CONFLICT_REVIEWED"
                  ? "conflito reconciliado"
                  : selectedRule!.auditStatus === "VERIFIED"
                    ? "verificada"
                    : "auditoria pendente"}
              </dd>
            </dl>
          </>
        )}
      </article>
    </div>
  );
}

export function GuidedDisciplines({ characterId }: { readonly characterId: string }) {
  const [step, setStep] = useState<CreationDisciplinesStepView | null>(null);
  const [selectedId, setSelectedId] = useState<CreationDisciplineId | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [disciplineError, setDisciplineError] = useState("");
  const [ratingAdjustment, setRatingAdjustment] = useState<RatingAdjustment | null>(null);
  const [detailDiscipline, setDetailDiscipline] = useState<DisciplineCatalogItemView>();
  const [detailPower, setDetailPower] = useState<DisciplinePowerCatalogItemView>();
  const [availablePowerView, setAvailablePowerView] = useState<{
    readonly choiceKey: string;
    readonly level: number;
  } | null>(null);
  const detailReturnFocus = useRef<HTMLElement | null>(null);
  const [preview, setPreview] = useState<Awaited<
    ReturnType<typeof loadCharacterSheetById>
  > | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void loadCreationDisciplines(characterId, controller.signal)
      .then((next) => {
        setStep(next);
        setSelectedId(
          [...next.disciplines].sort((a, b) => b.rating - a.rating)[0]?.disciplineId ??
            next.catalog[0]?.id ??
            null,
        );
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setMessage(feedback(reason));
      });
    return () => controller.abort();
  }, [characterId]);

  const selected = useMemo(
    () => step?.catalog.find((item) => item.id === selectedId),
    [selectedId, step],
  );
  const selectedState = step?.disciplines.find(
    (item) => item.disciplineId === selectedId,
  );
  const selectedPowers =
    step?.powers.filter((item) => item.disciplineId === selectedId) ?? [];
  const pendingChoices =
    step?.evaluation.pendingPowerChoices.filter(
      (item) => item.disciplineId === selectedId,
    ) ?? [];
  const pendingChoice = pendingChoices[0];
  const visibleSelectedPowers = selectedPowers.filter(
    (item) => !ratingAdjustment?.removedPowerIds.includes(item.powerId),
  );
  const selectedCatalogPowers = visibleSelectedPowers.flatMap((item) => {
    const catalogPower = selected?.powers.find(
      (candidate) => candidate.id === item.powerId,
    );
    return catalogPower === undefined ? [] : [{ catalogPower, powerId: item.powerId }];
  });
  const acquiredPowerGroups = powerLevels
    .map((level) => ({
      level,
      powers: selectedCatalogPowers.filter((item) => item.catalogPower.level === level),
    }))
    .filter((group) => group.powers.length > 0);
  const pendingPowerGroups = [...powerLevels]
    .reverse()
    .map((level) => ({
      level,
      powers:
        pendingChoice?.eligiblePowerIds.flatMap((powerId) => {
          const candidate = selected?.powers.find((item) => item.id === powerId);
          return candidate?.level === level ? [candidate] : [];
        }) ?? [],
    }))
    .filter((group) => group.powers.length > 0);
  const availableChoiceKey =
    pendingChoice === undefined
      ? ""
      : [
          pendingChoice.disciplineId,
          pendingChoice.ordinal,
          ...pendingChoice.eligiblePowerIds,
        ].join(":");
  const selectedAvailableLevel =
    availablePowerView?.choiceKey === availableChoiceKey &&
    pendingPowerGroups.some((group) => group.level === availablePowerView.level)
      ? availablePowerView.level
      : pendingPowerGroups[0]?.level;
  const visiblePendingPowerGroup = pendingPowerGroups.find(
    (group) => group.level === selectedAvailableLevel,
  );
  const adjustmentIncompatibleIds =
    ratingAdjustment?.incompatiblePowerIds.filter(
      (powerId) => !ratingAdjustment.removedPowerIds.includes(powerId),
    ) ?? [];
  const adjustmentRemovalCount = ratingAdjustment?.minimumRequiredRemovals ?? 0;

  async function save(
    disciplines: CreationDisciplinesStepView["disciplines"],
    powerIds: readonly DisciplinePowerId[],
    confirmPowerInvalidation = false,
  ): Promise<boolean> {
    if (step === null || pending) return false;
    setPending(true);
    setMessage("");
    setDisciplineError("");
    try {
      const next = await updateCreationDisciplines(
        characterId,
        step.version,
        disciplines,
        powerIds,
        confirmPowerInvalidation,
      );
      setStep(next);
      return true;
    } catch (reason) {
      setDisciplineError(feedback(reason));
      return false;
    } finally {
      setPending(false);
    }
  }

  async function previewChanges(
    disciplines: CreationDisciplinesStepView["disciplines"],
    powerIds: readonly DisciplinePowerId[],
  ): Promise<CreationDisciplinesStepView | null> {
    if (step === null || pending) return null;
    setPending(true);
    setMessage("");
    setDisciplineError("");
    try {
      return await previewCreationDisciplines(
        characterId,
        step.version,
        disciplines,
        powerIds,
      );
    } catch (reason) {
      setDisciplineError(feedback(reason));
      return null;
    } finally {
      setPending(false);
    }
  }

  async function changeRating(nextRating: number) {
    if (step === null || selectedId === null || step.policy.family === "THIN_BLOOD")
      return;
    if (nextRating > 2) {
      setDisciplineError("Na criação, uma Disciplina pode receber no máximo 2 pontos.");
      return;
    }
    const activeElsewhere = step.disciplines.filter(
      (item) => item.disciplineId !== selectedId && item.rating > 0,
    );
    if (
      nextRating > 0 &&
      (selectedState?.rating ?? 0) === 0 &&
      activeElsewhere.length >= 2
    ) {
      setDisciplineError(
        "Você já distribuiu pontos em duas Disciplinas. Limpe uma delas antes de escolher outra.",
      );
      return;
    }
    setDisciplineError("");
    const disciplines = step.disciplines.map((item) =>
      item.disciplineId === selectedId ? { ...item, rating: nextRating } : item,
    );
    if (nextRating < (selectedState?.rating ?? 0) && selectedPowers.length > 0) {
      const proposal = await previewChanges(
        disciplines,
        step.powers.map((item) => item.powerId),
      );
      const adjustment = proposal?.evaluation.powerAdjustments.find(
        (item) => item.disciplineId === selectedId,
      );
      if (adjustment !== undefined) {
        setRatingAdjustment({
          incompatiblePowerIds: adjustment.incompatiblePowerIds,
          minimumRequiredRemovals: adjustment.minimumRequiredRemovals,
          removedPowerIds: [],
          targetRating: adjustment.targetRating,
        });
        return;
      }
      if (proposal === null || proposal.evaluation.violations.length > 0) {
        if (proposal !== null)
          setDisciplineError(
            "A política de Disciplinas não permite esta redução com as escolhas atuais.",
          );
        return;
      }
    }
    setRatingAdjustment(null);
    void save(
      disciplines,
      step.powers.map((item) => item.powerId),
    );
  }

  function chooseRating(rating: number) {
    const currentRating = selectedState?.rating ?? 0;
    void changeRating(currentRating === rating ? Math.max(0, rating - 1) : rating);
  }

  function choosePower(powerId: DisciplinePowerId) {
    if (step !== null)
      void save(step.disciplines, [...step.powers.map((item) => item.powerId), powerId]);
  }
  async function removePower(powerId: DisciplinePowerId) {
    if (step === null) return;
    if (ratingAdjustment === null) {
      await save(
        step.disciplines,
        step.powers.map((item) => item.powerId).filter((id) => id !== powerId),
        true,
      );
      return;
    }
    const removedPowerIds = [...ratingAdjustment.removedPowerIds, powerId];
    const disciplines = step.disciplines.map((item) =>
      item.disciplineId === selectedId
        ? { ...item, rating: ratingAdjustment.targetRating }
        : item,
    );
    const retainedPowerIds = step.powers
      .map((item) => item.powerId)
      .filter((id) => !removedPowerIds.includes(id));
    const proposal = await previewChanges(disciplines, retainedPowerIds);
    if (proposal === null) return;
    const adjustment = proposal.evaluation.powerAdjustments.find(
      (item) => item.disciplineId === selectedId,
    );
    if (adjustment !== undefined) {
      setRatingAdjustment({
        incompatiblePowerIds: adjustment.incompatiblePowerIds,
        minimumRequiredRemovals: adjustment.minimumRequiredRemovals,
        removedPowerIds,
        targetRating: adjustment.targetRating,
      });
      return;
    }
    if (proposal.evaluation.violations.length > 0) {
      setRatingAdjustment({ ...ratingAdjustment, removedPowerIds });
      setDisciplineError(
        "Esta remoção deixaria outra regra de Poder inválida. Escolha outro Poder para remover.",
      );
      return;
    }
    const saved = await save(disciplines, retainedPowerIds, true);
    if (saved) setRatingAdjustment(null);
  }
  function openPowerDetails(
    powerToOpen: DisciplinePowerCatalogItemView,
    trigger: HTMLElement,
  ) {
    detailReturnFocus.current = trigger;
    setDetailDiscipline(undefined);
    setDetailPower(powerToOpen);
  }
  function openDisciplineDetails(
    disciplineToOpen: DisciplineCatalogItemView,
    trigger: HTMLElement,
  ) {
    detailReturnFocus.current = trigger;
    setDetailPower(undefined);
    setDetailDiscipline(disciplineToOpen);
  }
  function closeDetails() {
    setDetailDiscipline(undefined);
    setDetailPower(undefined);
    requestAnimationFrame(() => detailReturnFocus.current?.focus());
  }

  if (step === null)
    return (
      <main className={`${styles.creationShell} ${styles.guidedShell}`}>
        <section className={styles.guidedLoading}>
          <AnkhMark />
          <p>{message || "Consultando o Sangue da personagem…"}</p>
        </section>
      </main>
    );
  const isThinBlood = step.policy.family === "THIN_BLOOD";
  const activeRatings = step.disciplines
    .filter((item) => item.rating > 0)
    .sort((a, b) => b.rating - a.rating);
  const pendingPowerCount = step.evaluation.pendingPowerChoices.length;
  return (
    <main className={`${styles.creationShell} ${styles.guidedShell}`}>
      <article
        aria-busy={pending}
        className={`${styles.guidedDocument} ${styles.disciplinesDocument}`}
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
          {creationSteps.map(([id, label]) => (
            <span
              className={id === "disciplines" ? styles.currentStep : ""}
              data-complete={
                step.creationContext.steps.find((item) => item.id === id)?.status ===
                "complete"
              }
              key={id}
            >
              {label}
              <i />
            </span>
          ))}
        </nav>
        <div className={styles.disciplinesLayout}>
          <section className={styles.disciplinesStage}>
            <header className={styles.stageHeading}>
              <p>
                As Disciplinas são manifestações da maldição em seu Sangue, dons que
                moldam o que seu vampiro é capaz de fazer.
              </p>
              <h2 id="disciplines-title">Disciplinas</h2>
            </header>
            <fieldset className={styles.disciplineSelector} disabled={pending}>
              <legend>
                {step.policy.family === "CLAN"
                  ? "Disciplinas do Clã"
                  : step.policy.family === "CAITIFF"
                    ? "Disciplinas disponíveis"
                    : "Sangue-Ralo"}
              </legend>
              {isThinBlood ? (
                <p className={styles.thinBloodNotice}>
                  Sangue-Ralo não começa com Disciplinas intrínsecas. A Alquimia
                  Sangue-Ralo depende da Qualidade correspondente, resolvida na etapa de
                  Vantagens; nenhuma escolha artificial será criada aqui.
                </p>
              ) : (
                <>
                  <p className={styles.disciplineSelectorIntro}>
                    Selecione uma Disciplina, defina seus pontos e escolha um Poder por
                    ponto.
                  </p>
                  {step.catalog.map((item) => (
                    <label data-selected={selectedId === item.id} key={item.id}>
                      <input
                        checked={selectedId === item.id}
                        name="discipline"
                        onChange={() => {
                          setSelectedId(item.id);
                          setDisciplineError("");
                          setRatingAdjustment(null);
                        }}
                        type="radio"
                      />
                      <strong>{item.namePtBr}</strong>
                    </label>
                  ))}
                </>
              )}
            </fieldset>
            {isThinBlood || selected === undefined ? null : (
              <div className={styles.disciplineChoiceArea}>
                <section className={styles.disciplineRating}>
                  <div>
                    <div className={styles.disciplineRatingHeading}>
                      <h3>Nível de {selected.namePtBr}</h3>
                      <button
                        disabled={pending || (selectedState?.rating ?? 0) === 0}
                        onClick={() => changeRating(0)}
                        type="button"
                      >
                        Limpar Disciplina
                      </button>
                    </div>
                    <div
                      aria-label={`${selected.namePtBr}: ${selectedState?.rating ?? 0} de 5`}
                      className={styles.disciplineDots}
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          aria-label={`Definir ${selected.namePtBr} em ${rating}`}
                          aria-pressed={rating <= (selectedState?.rating ?? 0)}
                          aria-disabled={pending || rating > 2}
                          data-state={
                            rating > 2
                              ? "unavailable"
                              : rating <= (selectedState?.rating ?? 0)
                                ? "filled"
                                : "available"
                          }
                          key={rating}
                          onClick={() => chooseRating(rating)}
                          type="button"
                        />
                      ))}
                    </div>
                  </div>
                  <em>Nível atual: {selectedState?.rating ?? 0}</em>
                </section>
                {disciplineError === "" ? null : (
                  <p aria-live="polite" className={styles.disciplineContextError}>
                    {disciplineError}
                  </p>
                )}
                {ratingAdjustment === null ? null : (
                  <section
                    aria-label="Ajuste necessário"
                    className={styles.disciplineAdjustment}
                  >
                    <header>
                      <div>
                        <h3>Ajuste necessário</h3>
                        <p>
                          A redução para Nível {ratingAdjustment.targetRating} exige
                          remover {adjustmentRemovalCount} Poder
                          {adjustmentRemovalCount === 1 ? "" : "es"}. Escolha qual Poder
                          deseja manter.
                        </p>
                      </div>
                      <button
                        disabled={pending}
                        onClick={() => setRatingAdjustment(null)}
                        type="button"
                      >
                        Cancelar ajuste
                      </button>
                    </header>
                  </section>
                )}
                {(selectedState?.rating ?? 0) === 0 ? (
                  <section className={styles.disciplineEmptyState}>
                    <h3>Distribua os pontos</h3>
                    <p>Defina 1 ou 2 pontos para revelar os Poderes elegíveis.</p>
                  </section>
                ) : null}
                {(selectedState?.rating ?? 0) === 0 &&
                ratingAdjustment === null ? null : (
                  <section
                    aria-label="Poderes escolhidos"
                    className={styles.acquiredPowers}
                  >
                    <header>
                      <h3>Poderes escolhidos</h3>
                      <span>Registrados na ficha</span>
                    </header>
                    {selectedCatalogPowers.length === 0 ? (
                      <p>Nenhum Poder escolhido ainda.</p>
                    ) : (
                      acquiredPowerGroups.map((group) => (
                        <section className={styles.powerLevelGroup} key={group.level}>
                          <h4>Nível {group.level}</h4>
                          {group.powers.map((item) => {
                            const incompatible = adjustmentIncompatibleIds.includes(
                              item.powerId,
                            );
                            return (
                              <div
                                className={styles.acquiredPowerRow}
                                data-incompatible={incompatible}
                                key={item.powerId}
                              >
                                <span aria-hidden="true">✓</span>
                                <p>
                                  <strong>{item.catalogPower.namePtBr}</strong>
                                  {incompatible ? (
                                    <small>Não disponível no novo nível.</small>
                                  ) : null}
                                </p>
                                <button
                                  onClick={(event) =>
                                    openPowerDetails(
                                      item.catalogPower,
                                      event.currentTarget,
                                    )
                                  }
                                  type="button"
                                >
                                  Detalhes
                                </button>
                                <button
                                  onClick={() => removePower(item.powerId)}
                                  type="button"
                                >
                                  Remover
                                </button>
                              </div>
                            );
                          })}
                        </section>
                      ))
                    )}
                  </section>
                )}
                {pendingChoice === undefined || ratingAdjustment !== null ? null : (
                  <section aria-label="Próxima escolha" className={styles.pendingPowers}>
                    <header>
                      <h3>Próxima escolha</h3>
                      <p>
                        Você possui {pendingChoices.length} escolha
                        {pendingChoices.length === 1 ? "" : "s"} de Poder pendente
                        {pendingChoices.length === 1 ? "" : "s"} nesta Disciplina.
                      </p>
                    </header>
                    <p className={styles.pendingPowerGuidance}>
                      {pendingChoice.ordinal === 1
                        ? "A política permite, neste momento, todos os Poderes elegíveis de Nível 1."
                        : `A política permite todos os Poderes elegíveis entre os níveis 1 e ${pendingChoice.ordinal}.`}
                    </p>
                    <h4 className={styles.availablePowersTitle}>Poderes disponíveis</h4>
                    {pendingPowerGroups.length > 1 ? (
                      <nav
                        aria-label="Níveis dos Poderes disponíveis"
                        className={styles.availablePowerLevels}
                      >
                        {pendingPowerGroups.map((group) => {
                          const active = group.level === selectedAvailableLevel;
                          return (
                            <button
                              aria-label={`Ver Poderes de Nível ${group.level} (${group.powers.length})`}
                              aria-pressed={active}
                              disabled={pending}
                              key={group.level}
                              onClick={() =>
                                setAvailablePowerView({
                                  choiceKey: availableChoiceKey,
                                  level: group.level,
                                })
                              }
                              type="button"
                            >
                              <span>Nível {group.level}</span>
                              <small>
                                {group.powers.length}{" "}
                                {group.powers.length === 1 ? "Poder" : "Poderes"}
                              </small>
                            </button>
                          );
                        })}
                      </nav>
                    ) : null}
                    {visiblePendingPowerGroup === undefined ? null : (
                      <section
                        aria-label={`Poderes disponíveis de Nível ${visiblePendingPowerGroup.level}`}
                        className={`${styles.powerLevelGroup} ${styles.visiblePowerLevel}`}
                      >
                        <header className={styles.availablePowerLevelHeading}>
                          <h4>Nível {visiblePendingPowerGroup.level}</h4>
                          <span>
                            {visiblePendingPowerGroup.powers.length}{" "}
                            {visiblePendingPowerGroup.powers.length === 1
                              ? "opção disponível"
                              : "opções disponíveis"}
                          </span>
                        </header>
                        <div className={styles.pendingPowerOptions}>
                          {visiblePendingPowerGroup.powers.map((candidate) => (
                            <label key={candidate.id}>
                              <input
                                name={`power-${pendingChoice.ordinal}`}
                                onChange={() => choosePower(candidate.id)}
                                disabled={pending}
                                type="radio"
                              />
                              <span>
                                <strong>{candidate.namePtBr}</strong>
                                <small>{powerPresentation(candidate).summaryPtBr}</small>
                              </span>
                              <button
                                onClick={(event) => {
                                  event.preventDefault();
                                  openPowerDetails(candidate, event.currentTarget);
                                }}
                                type="button"
                              >
                                Detalhes →
                              </button>
                            </label>
                          ))}
                        </div>
                      </section>
                    )}
                  </section>
                )}
              </div>
            )}
          </section>
          <aside className={styles.disciplineEditorialPanel}>
            {isThinBlood ? (
              <>
                <span>Origem</span>
                <h2>Sangue-Ralo</h2>
                <p>
                  O Sangue diluído não sustenta dons intrínsecos como o de um Clã.
                  Ressonâncias podem despertar capacidades temporárias, enquanto a
                  Alquimia exige uma Qualidade própria e fórmulas aprendidas.
                </p>
                <h3>Regras na criação</h3>
                <ul>
                  <li>Nenhuma distribuição 2/1 é aplicada.</li>
                  <li>Nenhuma Disciplina permanente é inventada nesta etapa.</li>
                  <li>
                    A Alquimia será habilitada somente se a Qualidade correspondente for
                    escolhida.
                  </li>
                </ul>
              </>
            ) : selected === undefined ? null : (
              <>
                <span>Disciplina</span>
                <h2>{selected.namePtBr}</h2>
                <p>{selected.descriptionPtBr}</p>
                <section
                  aria-label="Sua distribuição"
                  className={styles.disciplineProgress}
                >
                  <h3>Sua distribuição</h3>
                  <p className={styles.disciplineProgressRule}>
                    {step.policy.requiredRatings.join("/")} em duas Disciplinas · 1 Poder
                    por ponto
                  </p>
                  {activeRatings.length === 0 ? (
                    <p className={styles.disciplineProgressEmpty}>
                      Nenhum ponto distribuído.
                    </p>
                  ) : (
                    activeRatings.map((item) => (
                      <p
                        className={styles.disciplineProgressRating}
                        key={item.disciplineId}
                      >
                        <span>
                          {step.catalog.find(
                            (candidate) => candidate.id === item.disciplineId,
                          )?.namePtBr ?? item.disciplineId}
                        </span>
                        <strong>{item.rating}</strong>
                      </p>
                    ))
                  )}
                  <small className={styles.disciplineProgressStatus}>
                    {ratingAdjustment !== null
                      ? "Ajuste pendente"
                      : step.evaluation.complete
                        ? "Distribuição concluída"
                        : pendingPowerCount > 0
                          ? `${pendingPowerCount} ${pendingPowerCount === 1 ? "Poder pendente" : "Poderes pendentes"} no total`
                          : "Distribuição incompleta"}
                  </small>
                </section>
                <button
                  onClick={(event) =>
                    openDisciplineDetails(selected, event.currentTarget)
                  }
                  type="button"
                >
                  Ver detalhes da Disciplina →
                </button>
              </>
            )}
          </aside>
        </div>
        <footer className={styles.guidedActions}>
          <Link href={`/personagens/${characterId}/criar/habilidades`}>← Voltar</Link>
          <div>
            <button
              onClick={() =>
                void loadCharacterSheetById(
                  "player-one",
                  characterId,
                  new AbortController().signal,
                )
                  .then(setPreview)
                  .catch((reason: unknown) => setMessage(feedback(reason)))
              }
              type="button"
            >
              Ver ficha até agora
            </button>
            <Link href={`/ficha/${characterId}?identity=player-one&mode=direct`}>
              Preencher diretamente
            </Link>
            <button
              className={styles.continueButton}
              disabled={!step.evaluation.complete}
              onClick={() =>
                setMessage(
                  "Disciplinas concluídas e registradas. A próxima etapa aguarda aprovação separada.",
                )
              }
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
      <DetailDialog
        catalog={step.catalog}
        discipline={detailDiscipline}
        power={detailPower}
        onClose={closeDetails}
      />
      {preview === null ? null : (
        <div aria-modal="true" className={styles.previewLayer} role="dialog">
          <div className={styles.previewDialog}>
            <header>
              <h2>Sua ficha até agora</h2>
              <button onClick={() => setPreview(null)} type="button">
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
