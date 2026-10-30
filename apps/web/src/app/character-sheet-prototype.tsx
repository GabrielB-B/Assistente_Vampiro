"use client";

import type { CharacterSheetView } from "@assistente-vampiro/contracts";
import { useEffect, useId, useRef, useState } from "react";

type SheetTab = "essential" | "chronicle" | "history";

type Trait = {
  readonly id: string;
  readonly name: string;
  readonly value: number | null;
};

type AvailableTrait = Omit<Trait, "value"> & { readonly value: number };

type TraitGroup = {
  readonly title: string;
  readonly traits: readonly Trait[];
};

type TraitDefinitionGroup = {
  readonly title: string;
  readonly traits: readonly { readonly id: string; readonly name: string }[];
};

const attributeDefinitions: readonly TraitDefinitionGroup[] = [
  {
    title: "Físicos",
    traits: [
      { id: "attribute:strength", name: "Força" },
      { id: "attribute:dexterity", name: "Destreza" },
      { id: "attribute:stamina", name: "Vigor" },
    ],
  },
  {
    title: "Sociais",
    traits: [
      { id: "attribute:charisma", name: "Carisma" },
      { id: "attribute:manipulation", name: "Manipulação" },
      { id: "attribute:composure", name: "Autocontrole" },
    ],
  },
  {
    title: "Mentais",
    traits: [
      { id: "attribute:intelligence", name: "Inteligência" },
      { id: "attribute:wits", name: "Raciocínio" },
      { id: "attribute:resolve", name: "Determinação" },
    ],
  },
] as const;

const skillDefinitions: readonly TraitDefinitionGroup[] = [
  {
    title: "Físicas",
    traits: [
      { id: "skill:melee", name: "Armas Brancas" },
      { id: "skill:firearms", name: "Armas de Fogo" },
      { id: "skill:athletics", name: "Atletismo" },
      { id: "skill:brawl", name: "Briga" },
      { id: "skill:drive", name: "Condução" },
      { id: "skill:stealth", name: "Furtividade" },
      { id: "skill:larceny", name: "Ladroagem" },
      { id: "skill:craft", name: "Ofícios" },
      { id: "skill:survival", name: "Sobrevivência" },
    ],
  },
  {
    title: "Sociais",
    traits: [
      { id: "skill:animal-ken", name: "Empatia com Animais" },
      { id: "skill:etiquette", name: "Etiqueta" },
      { id: "skill:intimidation", name: "Intimidação" },
      { id: "skill:leadership", name: "Liderança" },
      { id: "skill:streetwise", name: "Manha" },
      { id: "skill:performance", name: "Performance" },
      { id: "skill:persuasion", name: "Persuasão" },
      { id: "skill:insight", name: "Sagacidade" },
      { id: "skill:subterfuge", name: "Subterfúgio" },
    ],
  },
  {
    title: "Mentais",
    traits: [
      { id: "skill:science", name: "Ciência" },
      { id: "skill:academics", name: "Erudição" },
      { id: "skill:finance", name: "Finanças" },
      { id: "skill:investigation", name: "Investigação" },
      { id: "skill:medicine", name: "Medicina" },
      { id: "skill:occult", name: "Ocultismo" },
      { id: "skill:awareness", name: "Percepção" },
      { id: "skill:politics", name: "Política" },
      { id: "skill:technology", name: "Tecnologia" },
    ],
  },
] as const;

type RollDraft = {
  readonly actionName: string | null;
  readonly initialAttribute: AvailableTrait | null;
  readonly skill: AvailableTrait;
};

const tabLabels: Readonly<Record<SheetTab, string>> = {
  essential: "Essencial",
  chronicle: "Crônica & Sangue",
  history: "História",
};

function hydrateTraitGroups(
  definitions: readonly TraitDefinitionGroup[],
  sheet: CharacterSheetView,
): readonly TraitGroup[] {
  const values = new Map(sheet.traits.map((trait) => [trait.traitId, trait.value]));
  return definitions.map((group) => ({
    title: group.title,
    traits: group.traits.map((trait) => ({
      ...trait,
      value: values.get(trait.id) ?? null,
    })),
  }));
}

function RatingDots({
  label,
  max = 5,
  value,
  variant = "ink",
}: {
  readonly label: string;
  readonly max?: number;
  readonly value: number;
  readonly variant?: "blood" | "ink";
}) {
  return (
    <span
      aria-label={`${label}: ${value} de ${max}`}
      className={`rating-dots rating-dots--${variant}`}
      role="img"
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          aria-hidden="true"
          className={index < value ? "rating-dot is-filled" : "rating-dot"}
          key={`${label}-${index}`}
        />
      ))}
    </span>
  );
}

function TrackSquares({
  label,
  max,
  value,
}: {
  readonly label: string;
  readonly max: number;
  readonly value: number | null;
}) {
  return (
    <span
      aria-label={
        value === null ? `${label}: não carregada` : `${label}: ${value} de ${max}`
      }
      className="track-squares"
      role="img"
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          aria-hidden="true"
          className={
            value !== null && index < value ? "track-square is-filled" : "track-square"
          }
          key={`${label}-${index}`}
        />
      ))}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  readonly eyebrow: string;
  readonly title: string;
}) {
  return (
    <div className="section-heading">
      <i aria-hidden="true" />
      <h2>{title}</h2>
      <i aria-hidden="true" />
      <span className="section-number">{eyebrow}</span>
    </div>
  );
}

function TraitRow({
  onSelect,
  trait,
}: {
  readonly onSelect?: (trait: AvailableTrait) => void;
  readonly trait: Trait;
}) {
  const traitValue = trait.value;
  const isAvailable = trait.value !== null;
  const content = (
    <>
      {onSelect && traitValue !== null ? (
        <span aria-hidden="true" className="roll-glyph">
          ◇
        </span>
      ) : null}
      <span className="trait-name">{trait.name}</span>
      <span aria-hidden="true" className="trait-leader" />
      <RatingDots label={trait.name} value={trait.value ?? 0} />
    </>
  );

  if (onSelect && traitValue !== null) {
    return (
      <button
        aria-label={`Preparar jogada com ${trait.name}, valor ${trait.value}`}
        className="trait-row trait-row--interactive is-loaded"
        onClick={() => onSelect({ ...trait, value: traitValue })}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <div className={isAvailable ? "trait-row is-loaded" : "trait-row is-unavailable"}>
      {content}
    </div>
  );
}

function IdentityGrid({ sheet }: { readonly sheet: CharacterSheetView }) {
  const identityFields = [
    ["Nome", sheet.character.name],
    ["Conceito", sheet.character.concept ?? "Não informado"],
    ["Predador", "Não informado"],
    ["Crônica", sheet.chronicle.title],
    ["Ambição", "Não informada"],
    ["Clã", sheet.character.kind === "CLAN_VAMPIRE" ? "Em definição" : "—"],
    ["Senhor", "Não informado"],
    ["Desejo", "Não informado"],
    ["Geração", "Não informada"],
  ] as const;

  return (
    <div className="identity-grid">
      {identityFields.map(([label, value]) => (
        <div className="identity-field" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function EssentialSheet({
  attributeGroups,
  hunger,
  onSkillSelect,
  skillGroups,
}: {
  readonly attributeGroups: readonly TraitGroup[];
  readonly hunger: number;
  readonly onSkillSelect: (skill: AvailableTrait) => void;
  readonly skillGroups: readonly TraitGroup[];
}) {
  return (
    <>
      <SectionHeading eyebrow="01" title="Atributos" />
      <div className="trait-columns attribute-columns">
        {attributeGroups.map((group) => (
          <section
            aria-label={`Atributos ${group.title}`}
            className="trait-group"
            key={group.title}
          >
            <h3>{group.title}</h3>
            {group.traits.map((trait) => (
              <TraitRow key={trait.name} trait={trait} />
            ))}
          </section>
        ))}
      </div>

      <div className="track-grid">
        <div className="pending-track">
          <span>Vitalidade</span>
          <TrackSquares label="Vitalidade" max={10} value={null} />
        </div>
        <div className="pending-track">
          <span>Força de Vontade</span>
          <TrackSquares label="Força de Vontade" max={10} value={null} />
        </div>
      </div>

      <SectionHeading eyebrow="02" title="Habilidades" />
      <p className="section-instruction">
        O losango identifica uma Habilidade carregada e pronta para preparar jogada.
      </p>
      <div className="trait-columns skill-columns">
        {skillGroups.map((group) => (
          <section
            aria-label={`Habilidades ${group.title}`}
            className="trait-group"
            key={group.title}
          >
            <h3>{group.title}</h3>
            {group.traits.map((trait) => (
              <TraitRow key={trait.name} onSelect={onSkillSelect} trait={trait} />
            ))}
          </section>
        ))}
      </div>

      <SectionHeading eyebrow="03" title="Disciplinas" />
      <div aria-label="Disciplinas não carregadas" className="discipline-ledger">
        {Array.from({ length: 3 }, (_, column) => (
          <div className="discipline-column" key={`discipline-${column}`}>
            <RatingDots label={`Disciplina ${column + 1}`} value={0} />
            {Array.from({ length: 5 }, (_, row) => (
              <span aria-hidden="true" key={`discipline-${column}-${row}`} />
            ))}
          </div>
        ))}
      </div>

      <p className="sheet-data-note">
        4 Características carregadas · demais campos não carregados
      </p>

      <div className="sheet-footer-stats">
        <div>
          <span>Ressonância</span>
          <i aria-hidden="true" />
        </div>
        <div>
          <span>Fome</span>
          <RatingDots label="Fome" value={hunger} variant="blood" />
        </div>
        <div>
          <span>Humanidade</span>
          <TrackSquares label="Humanidade" max={10} value={null} />
        </div>
      </div>
    </>
  );
}

function ChronicleSheet({ sheet }: { readonly sheet: CharacterSheetView }) {
  return (
    <div className="narrative-sheet">
      <SectionHeading eyebrow="04" title="Crônica & Sangue" />
      <div className="narrative-triptych">
        <article>
          <span>Princípios da Crônica</span>
          <p>{sheet.chronicle.description ?? "Não informados nesta versão."}</p>
        </article>
        <article>
          <span>Pilares & Convicções</span>
          <p className="muted-copy">Ainda não registrados na ficha persistente.</p>
        </article>
        <article>
          <span>Perdição do Clã</span>
          <p className="muted-copy">Visível quando o Clã for confirmado.</p>
        </article>
      </div>

      <div className="chronicle-columns">
        <section>
          <h3>Vantagens & Defeitos</h3>
          <ul className="ruled-list">
            <li>Dados ainda não registrados.</li>
          </ul>
        </section>
        <section>
          <div className="blood-potency-title">
            <h3>Potência do Sangue</h3>
            <span className="pending-value">—</span>
          </div>
          <dl className="blood-facts">
            <div>
              <dt>Surto de Sangue</dt>
              <dd>Não carregado</dd>
            </div>
            <div>
              <dt>Bônus de Poder</dt>
              <dd>Não carregado</dd>
            </div>
            <div>
              <dt>Quantidade Recuperada</dt>
              <dd>Não carregada</dd>
            </div>
            <div>
              <dt>Rerrolagem de Sangue</dt>
              <dd>Não carregada</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}

function HistorySheet() {
  const entries = [
    ["Idade Verdadeira", "Não informada"],
    ["Idade Aparente", "Não informada"],
    ["Data de Nascimento", "Não informada"],
    ["Data de Morte", "Não informada"],
    ["Aparência", "Não informada"],
    ["Traços Distintivos", "Não informados"],
  ] as const;

  return (
    <div className="history-sheet">
      <SectionHeading eyebrow="05" title="História" />
      <div className="history-columns">
        <section className="notes-field">
          <span>Notas</span>
          <p>Nenhuma nota registrada.</p>
        </section>
        <section className="history-data">
          {entries.map(([label, value]) => (
            <div className="history-field" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
          <div className="history-field history-long-field">
            <span>História</span>
            <strong>A história ainda não foi registrada.</strong>
          </div>
        </section>
      </div>
    </div>
  );
}

function RollBuilder({
  actionName,
  attributes,
  hunger,
  initialAttribute,
  onClose,
  skill,
}: {
  readonly actionName: string | null;
  readonly attributes: readonly AvailableTrait[];
  readonly hunger: number;
  readonly initialAttribute: AvailableTrait | null;
  readonly onClose: () => void;
  readonly skill: AvailableTrait;
}) {
  const titleId = useId();
  const dialogReference = useRef<HTMLElement>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<AvailableTrait | null>(
    initialAttribute,
  );
  const [specialtyApplied, setSpecialtyApplied] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState("7");
  const [isPrepared, setIsPrepared] = useState(false);
  const poolSize = selectedAttribute
    ? selectedAttribute.value + skill.value + (specialtyApplied ? 1 : 0)
    : skill.value;
  const hungerDice = Math.min(hunger, poolSize);
  const customDifficultyNumber = Number(customDifficulty);
  const difficultyIsValid =
    difficulty !== "" &&
    (difficulty !== "7" ||
      (Number.isInteger(customDifficultyNumber) && customDifficultyNumber >= 7));
  const resolvedDifficulty = difficulty === "7" ? customDifficulty : difficulty;

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogReference.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = "hidden";
    dialog?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="builder-backdrop" onClick={onClose}>
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="roll-builder"
        onClick={(event) => event.stopPropagation()}
        ref={dialogReference}
        role="dialog"
        tabIndex={-1}
      >
        <header>
          <div>
            <p>Preparar jogada</p>
            <h2 id={titleId}>{actionName ?? skill.name}</h2>
          </div>
          <button aria-label="Fechar preparação" onClick={onClose} type="button">
            ×
          </button>
        </header>

        {isPrepared ? (
          <div className="builder-ready" role="status">
            <span aria-hidden="true">✓</span>
            <p>Intenção preparada</p>
            <h3>
              {selectedAttribute?.name} + {skill.name}
              {specialtyApplied ? " + Especialização" : ""}
            </h3>
            <dl>
              <div>
                <dt>Parada</dt>
                <dd>{poolSize} dados</dd>
              </div>
              <div>
                <dt>Fome</dt>
                <dd>{hungerDice} Dados de Fome</dd>
              </div>
              <div>
                <dt>Dificuldade</dt>
                <dd>{resolvedDifficulty}</dd>
              </div>
            </dl>
            <p className="builder-caveat">
              Esta é uma prévia local. Os valores autoritativos, as faces e a persistência
              serão resolvidos pelo servidor no VS01-04.
            </p>
            <button className="primary-action" onClick={onClose} type="button">
              Voltar à ficha
            </button>
          </div>
        ) : (
          <div className="builder-body">
            <section className="builder-step">
              <span className="step-number">01</span>
              <div>
                <p className="builder-label">Habilidade</p>
                <div className="selected-term">
                  <strong>{skill.name}</strong>
                  <span>{skill.value}</span>
                </div>
              </div>
            </section>

            <section className="builder-step">
              <span className="step-number">02</span>
              <div>
                <p className="builder-label">Escolha o Atributo</p>
                <div className="attribute-options">
                  {attributes.map((attribute) => (
                    <button
                      aria-pressed={selectedAttribute?.name === attribute.name}
                      className={
                        selectedAttribute?.name === attribute.name ? "is-selected" : ""
                      }
                      key={attribute.name}
                      onClick={() => setSelectedAttribute(attribute)}
                      type="button"
                    >
                      <span>{attribute.name}</span>
                      <strong>{attribute.value}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="builder-step builder-step--compact">
              <span className="step-number">03</span>
              <div className="builder-adjustments">
                <label>
                  <input
                    checked={specialtyApplied}
                    onChange={(event) => setSpecialtyApplied(event.target.checked)}
                    type="checkbox"
                  />
                  <span>
                    <strong>Especialização</strong>
                    {skill.name === "Investigação"
                      ? "Cena de crime"
                      : "Aplicável à situação"}
                  </span>
                </label>
                <label>
                  <span>
                    <strong>Dificuldade</strong>
                    Decisão final do Narrador
                  </span>
                  <select
                    onChange={(event) => setDifficulty(event.target.value)}
                    value={difficulty}
                  >
                    <option value="">Escolha...</option>
                    <option value="1">1 · Fácil</option>
                    <option value="2">2 · Rotineira</option>
                    <option value="3">3 · Moderada</option>
                    <option value="4">4 · Desafiadora</option>
                    <option value="5">5 · Difícil</option>
                    <option value="6">6 · Muito difícil</option>
                    <option value="7">7+ · Quase impossível</option>
                  </select>
                </label>
                {difficulty === "7" ? (
                  <label className="custom-difficulty">
                    <span>
                      <strong>Valor 7 ou mais</strong>
                      Informe os sucessos exigidos
                    </span>
                    <input
                      aria-label="Dificuldade 7 ou mais"
                      min="7"
                      onChange={(event) => setCustomDifficulty(event.target.value)}
                      step="1"
                      type="number"
                      value={customDifficulty}
                    />
                  </label>
                ) : null}
              </div>
            </section>

            <section className="roll-summary" aria-live="polite">
              <div>
                <span>Resumo da parada</span>
                <strong>{poolSize} dados</strong>
              </div>
              <p>
                {selectedAttribute
                  ? `${selectedAttribute.name} ${selectedAttribute.value}`
                  : "Escolha um Atributo"}
                {` + ${skill.name} ${skill.value}`}
                {specialtyApplied ? " + 1" : ""}
              </p>
              <small>
                {selectedAttribute
                  ? `${poolSize - hungerDice} comuns + ${hungerDice} Dados de Fome`
                  : "A Fome será calculada quando a parada estiver completa."}
              </small>
            </section>

            <button
              className="primary-action"
              disabled={!selectedAttribute || !difficultyIsValid}
              onClick={() => setIsPrepared(true)}
              type="button"
            >
              Preparar rolagem
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function CharacterSheetPrototype({
  sheet,
}: {
  readonly sheet: CharacterSheetView;
}) {
  const [activeTab, setActiveTab] = useState<SheetTab>("essential");
  const [rollDraft, setRollDraft] = useState<RollDraft | null>(null);
  const attributeGroups = hydrateTraitGroups(attributeDefinitions, sheet);
  const skillGroups = hydrateTraitGroups(skillDefinitions, sheet);
  const allAttributes = attributeGroups.flatMap((group) =>
    group.traits.flatMap((trait): AvailableTrait[] =>
      trait.value === null ? [] : [{ ...trait, value: trait.value }],
    ),
  );
  const hunger = sheet.character.hunger ?? 0;

  const openSkill = (skill: AvailableTrait) =>
    setRollDraft({ actionName: null, initialAttribute: null, skill });

  return (
    <main className="character-app character-app--full-sheet">
      <div className="sheet-workspace">
        <article className="character-sheet" aria-labelledby="sheet-title">
          <div className="sheet-frame">
            <h1 className="visually-hidden" id="sheet-title">
              {sheet.character.name}
            </h1>

            <header className="sheet-masthead" aria-hidden="true">
              <i />
              <div>
                <span>AV</span>
                <strong>Assistente Vampiro</strong>
                <small>ficha de personagem · quinta edição</small>
              </div>
              <i />
            </header>

            <div className="sheet-control-row">
              <nav aria-label="Seções da ficha" className="sheet-tabs">
                {(Object.keys(tabLabels) as SheetTab[]).map((tab) => (
                  <button
                    aria-current={activeTab === tab ? "page" : undefined}
                    className={activeTab === tab ? "is-active" : ""}
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    type="button"
                  >
                    {tabLabels[tab]}
                  </button>
                ))}
              </nav>
              <div className="sheet-status">
                <span>{sheet.character.state === "ready" ? "Pronta" : "Rascunho"}</span>
                <strong>Modo Jogar</strong>
              </div>
            </div>

            <IdentityGrid sheet={sheet} />

            <div className="sheet-content">
              {activeTab === "essential" ? (
                <EssentialSheet
                  attributeGroups={attributeGroups}
                  hunger={hunger}
                  onSkillSelect={openSkill}
                  skillGroups={skillGroups}
                />
              ) : null}
              {activeTab === "chronicle" ? <ChronicleSheet sheet={sheet} /> : null}
              {activeTab === "history" ? <HistorySheet /> : null}
            </div>

            <footer className="sheet-folio">
              <span>Assistente Vampiro</span>
              <span>V5 · projeção local autorizada</span>
            </footer>
          </div>
        </article>
      </div>

      {rollDraft ? (
        <RollBuilder
          actionName={rollDraft.actionName}
          attributes={allAttributes}
          hunger={hunger}
          initialAttribute={rollDraft.initialAttribute}
          onClose={() => setRollDraft(null)}
          skill={rollDraft.skill}
        />
      ) : null}
    </main>
  );
}
