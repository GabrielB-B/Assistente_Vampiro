import type { CreationValidationContext } from "./attributes.js";
import { V5_TRAIT_STRUCTURAL_MAXIMUM } from "./trait-ratings.js";

export const CREATION_SKILL_CATALOG = [
  {
    group: "PHYSICAL",
    id: "skill:melee",
    labelPtBr: "Armas Brancas",
    summaryPtBr: "Combate próximo com armas portáteis.",
  },
  {
    group: "PHYSICAL",
    id: "skill:firearms",
    labelPtBr: "Armas de Fogo",
    summaryPtBr: "Uso seguro e preciso de armas de fogo.",
  },
  {
    group: "PHYSICAL",
    id: "skill:athletics",
    labelPtBr: "Atletismo",
    summaryPtBr: "Movimento, força aplicada, corrida e agilidade corporal.",
  },
  {
    group: "PHYSICAL",
    id: "skill:brawl",
    labelPtBr: "Briga",
    summaryPtBr: "Confronto corporal desarmado e luta próxima.",
  },
  {
    group: "PHYSICAL",
    id: "skill:drive",
    labelPtBr: "Condução",
    summaryPtBr: "Controle de veículos em situações comuns ou arriscadas.",
  },
  {
    group: "PHYSICAL",
    id: "skill:stealth",
    labelPtBr: "Furtividade",
    summaryPtBr: "Mover-se e agir sem chamar atenção.",
  },
  {
    group: "PHYSICAL",
    id: "skill:larceny",
    labelPtBr: "Ladroagem",
    summaryPtBr: "Fechaduras, segurança física e apropriação discreta.",
  },
  {
    group: "PHYSICAL",
    id: "skill:craft",
    labelPtBr: "Ofícios",
    summaryPtBr: "Criar, reparar e avaliar trabalho material especializado.",
  },
  {
    group: "PHYSICAL",
    id: "skill:survival",
    labelPtBr: "Sobrevivência",
    summaryPtBr: "Orientação, rastreamento e resistência fora de ambientes seguros.",
  },
  {
    group: "SOCIAL",
    id: "skill:animal-ken",
    labelPtBr: "Empatia com Animais",
    summaryPtBr: "Compreender, acalmar e conduzir animais.",
  },
  {
    group: "SOCIAL",
    id: "skill:etiquette",
    labelPtBr: "Etiqueta",
    summaryPtBr: "Normas sociais, costumes e comportamento em diferentes círculos.",
  },
  {
    group: "SOCIAL",
    id: "skill:intimidation",
    labelPtBr: "Intimidação",
    summaryPtBr: "Coagir ou impor presença por ameaça e pressão.",
  },
  {
    group: "SOCIAL",
    id: "skill:leadership",
    labelPtBr: "Liderança",
    summaryPtBr: "Inspirar, organizar e dirigir outras pessoas.",
  },
  {
    group: "SOCIAL",
    id: "skill:streetwise",
    labelPtBr: "Manha",
    summaryPtBr: "Ler as ruas, seus códigos, contatos e perigos.",
  },
  {
    group: "SOCIAL",
    id: "skill:performance",
    labelPtBr: "Performance",
    summaryPtBr: "Expressão artística apresentada diante de um público.",
  },
  {
    group: "SOCIAL",
    id: "skill:persuasion",
    labelPtBr: "Persuasão",
    summaryPtBr: "Convencer pela argumentação, confiança e apelo.",
  },
  {
    group: "SOCIAL",
    id: "skill:insight",
    labelPtBr: "Sagacidade",
    summaryPtBr: "Perceber intenções, emoções e sinais sociais.",
  },
  {
    group: "SOCIAL",
    id: "skill:subterfuge",
    labelPtBr: "Subterfúgio",
    summaryPtBr: "Ocultar intenções, enganar e sustentar disfarces sociais.",
  },
  {
    group: "MENTAL",
    id: "skill:science",
    labelPtBr: "Ciência",
    summaryPtBr: "Conhecimento e método das ciências naturais e exatas.",
  },
  {
    group: "MENTAL",
    id: "skill:academics",
    labelPtBr: "Erudição",
    summaryPtBr: "Conhecimento humanístico, histórico e acadêmico.",
  },
  {
    group: "MENTAL",
    id: "skill:finance",
    labelPtBr: "Finanças",
    summaryPtBr: "Dinheiro, mercados, contabilidade e fluxos econômicos.",
  },
  {
    group: "MENTAL",
    id: "skill:investigation",
    labelPtBr: "Investigação",
    summaryPtBr: "Encontrar pistas, relacionar evidências e reconstruir acontecimentos.",
  },
  {
    group: "MENTAL",
    id: "skill:medicine",
    labelPtBr: "Medicina",
    summaryPtBr: "Diagnóstico, tratamento e conhecimento do corpo.",
  },
  {
    group: "MENTAL",
    id: "skill:occult",
    labelPtBr: "Ocultismo",
    summaryPtBr: "Tradições esotéricas, símbolos e fenômenos sobrenaturais.",
  },
  {
    group: "MENTAL",
    id: "skill:awareness",
    labelPtBr: "Percepção",
    summaryPtBr: "Notar detalhes, ameaças e mudanças no ambiente.",
  },
  {
    group: "MENTAL",
    id: "skill:politics",
    labelPtBr: "Política",
    summaryPtBr: "Poder institucional, facções, negociação e influência pública.",
  },
  {
    group: "MENTAL",
    id: "skill:technology",
    labelPtBr: "Tecnologia",
    summaryPtBr: "Sistemas digitais, dispositivos e infraestrutura técnica.",
  },
] as const;

export type CreationSkillId = (typeof CREATION_SKILL_CATALOG)[number]["id"];
export const CREATION_SKILL_IDS = CREATION_SKILL_CATALOG.map(
  (skill) => skill.id,
) as readonly CreationSkillId[];
export type CreationSkillMethodId =
  | "QUICK_JACK_OF_ALL_TRADES"
  | "QUICK_BALANCED"
  | "QUICK_SPECIALIST"
  | "DETAILED_GENERALIST"
  | "DETAILED_SPECIALIST";
export type CreationSpecialtyOrigin = "CREATION_AUTOMATIC" | "CREATION_FREE";
const sourceRefs = [
  { pages: [145, 146, 147, 159] as const, sourceId: "SRC-0001" as const },
];

export const CREATION_SKILL_METHODS = [
  {
    descriptionPtBr: "Muitas competências em níveis iniciais.",
    detailed: false,
    id: "QUICK_JACK_OF_ALL_TRADES",
    labelPtBr: "Pau pra toda obra",
    ratingCounts: [
      { count: 1, rating: 3 },
      { count: 8, rating: 2 },
      { count: 10, rating: 1 },
    ],
    sourceRefs,
  },
  {
    descriptionPtBr: "Versátil, sem focos extremos.",
    detailed: false,
    id: "QUICK_BALANCED",
    labelPtBr: "Equilibrado",
    ratingCounts: [
      { count: 3, rating: 3 },
      { count: 5, rating: 2 },
      { count: 7, rating: 1 },
    ],
    sourceRefs,
  },
  {
    descriptionPtBr: "Domínio alto em poucas competências.",
    detailed: false,
    id: "QUICK_SPECIALIST",
    labelPtBr: "Especialista",
    ratingCounts: [
      { count: 1, rating: 4 },
      { count: 3, rating: 3 },
      { count: 3, rating: 2 },
      { count: 3, rating: 1 },
    ],
    sourceRefs,
  },
  {
    descriptionPtBr: "História de vida com acabamento generalista.",
    detailed: true,
    id: "DETAILED_GENERALIST",
    labelPtBr: "Detalhado — Generalista",
    ratingCounts: [
      { count: 3, rating: 3 },
      { count: 5, rating: 2 },
      { count: 7, rating: 1 },
    ],
    sourceRefs,
  },
  {
    descriptionPtBr: "História de vida com acabamento especialista.",
    detailed: true,
    id: "DETAILED_SPECIALIST",
    labelPtBr: "Detalhado — Especialista",
    ratingCounts: [
      { count: 1, rating: 4 },
      { count: 3, rating: 3 },
      { count: 3, rating: 2 },
      { count: 3, rating: 1 },
    ],
    sourceRefs,
  },
] as const;

export const AUTOMATIC_SPECIALTY_SKILL_IDS = [
  "skill:academics",
  "skill:craft",
  "skill:performance",
  "skill:science",
] as const satisfies readonly CreationSkillId[];
export const CREATION_SKILLS_POLICY = {
  automaticSpecialtySkillIds: AUTOMATIC_SPECIALTY_SKILL_IDS,
  freeSpecialtyCount: 1,
  maximumRating: 4,
  methods: CREATION_SKILL_METHODS,
  ruleRevision: "RULE-CREATION-SKILLS-001-r1",
  structuralMaximum: V5_TRAIT_STRUCTURAL_MAXIMUM,
} as const;

export interface CreationSpecialtyValue {
  readonly id: string;
  readonly label: string;
  readonly origin: CreationSpecialtyOrigin;
  readonly skillId: CreationSkillId;
}
export interface CreationSkillsViolation {
  readonly code:
    | "SKILL_DISTRIBUTION_INCOMPLETE"
    | "SKILL_DISTRIBUTION_UNREACHABLE"
    | "SKILL_METHOD_REQUIRED"
    | "SKILL_OUT_OF_RANGE"
    | "SPECIALTY_AUTOMATIC_MISSING"
    | "SPECIALTY_FREE_MISSING"
    | "SPECIALTY_LABEL_INVALID"
    | "SPECIALTY_LIMIT_EXCEEDED"
    | "SPECIALTY_ORIGIN_INVALID"
    | "SPECIALTY_REQUIRES_SKILL";
  readonly path: readonly string[];
}
export interface CreationSkillsEvaluation {
  readonly automaticSpecialtiesPending: readonly CreationSkillId[];
  readonly complete: boolean;
  readonly distributionComplete: boolean;
  readonly freeSpecialtiesPending: number;
  readonly pointsAllocated: number;
  readonly pointsRemaining: number;
  readonly violations: readonly CreationSkillsViolation[];
}

function methodPolicy(methodId: CreationSkillMethodId | null) {
  return CREATION_SKILL_METHODS.find((method) => method.id === methodId);
}
function targetValues(methodId: CreationSkillMethodId): number[] {
  const method = methodPolicy(methodId)!;
  const assigned = method.ratingCounts.reduce((total, item) => total + item.count, 0);
  const rated: number[] = method.ratingCounts.flatMap(({ count, rating }) =>
    Array.from({ length: count }, () => Number(rating)),
  );
  return [
    ...rated,
    ...Array.from({ length: CREATION_SKILL_IDS.length - assigned }, () => 0),
  ].sort((left, right) => right - left);
}

export function evaluateCreationSkills(
  skills: Readonly<Partial<Record<CreationSkillId, number>>>,
  methodId: CreationSkillMethodId | null,
  specialties: readonly CreationSpecialtyValue[],
  context: CreationValidationContext,
): CreationSkillsEvaluation {
  const violations: CreationSkillsViolation[] = [];
  const values = CREATION_SKILL_IDS.map((id) => skills[id] ?? 0);
  values.forEach((value, index) => {
    if (!Number.isInteger(value) || value < 0 || value > 4)
      violations.push({
        code: "SKILL_OUT_OF_RANGE",
        path: ["skills", CREATION_SKILL_IDS[index]!],
      });
  });
  const method = methodId === null ? undefined : methodPolicy(methodId);
  if (method === undefined)
    violations.push({ code: "SKILL_METHOD_REQUIRED", path: ["methodId"] });
  const safeValues = values.map((value) =>
    Number.isInteger(value) && value >= 0 && value <= 4 ? value : 0,
  );
  const target = method === undefined ? [] : targetValues(method.id);
  const sorted = [...safeValues].sort((left, right) => right - left);
  const reachable =
    method !== undefined && sorted.every((value, index) => value <= target[index]!);
  const distributionComplete =
    reachable && sorted.every((value, index) => value === target[index]);
  if (method !== undefined && !reachable)
    violations.push({ code: "SKILL_DISTRIBUTION_UNREACHABLE", path: ["skills"] });
  if (context === "CREATION_FINALIZATION" && !distributionComplete)
    violations.push({ code: "SKILL_DISTRIBUTION_INCOMPLETE", path: ["skills"] });
  const specialtyCounts = new Map<CreationSkillId, number>();
  for (const specialty of specialties) {
    const rating = skills[specialty.skillId] ?? 0;
    specialtyCounts.set(
      specialty.skillId,
      (specialtyCounts.get(specialty.skillId) ?? 0) + 1,
    );
    if (specialty.label.trim().length < 2 || specialty.label.trim().length > 80)
      violations.push({
        code: "SPECIALTY_LABEL_INVALID",
        path: ["specialties", specialty.id, "label"],
      });
    if (rating < 1)
      violations.push({
        code: "SPECIALTY_REQUIRES_SKILL",
        path: ["specialties", specialty.id, "skillId"],
      });
    if (
      specialty.origin === "CREATION_AUTOMATIC" &&
      !AUTOMATIC_SPECIALTY_SKILL_IDS.includes(
        specialty.skillId as (typeof AUTOMATIC_SPECIALTY_SKILL_IDS)[number],
      )
    )
      violations.push({
        code: "SPECIALTY_ORIGIN_INVALID",
        path: ["specialties", specialty.id, "origin"],
      });
  }
  for (const [skillId, count] of specialtyCounts)
    if (skillId !== "skill:craft" && count > (skills[skillId] ?? 0))
      violations.push({
        code: "SPECIALTY_LIMIT_EXCEEDED",
        path: ["specialties", skillId],
      });
  for (const skillId of AUTOMATIC_SPECIALTY_SKILL_IDS)
    if (
      specialties.filter(
        (specialty) =>
          specialty.skillId === skillId && specialty.origin === "CREATION_AUTOMATIC",
      ).length > 1
    )
      violations.push({
        code: "SPECIALTY_LIMIT_EXCEEDED",
        path: ["specialties", skillId, "CREATION_AUTOMATIC"],
      });
  const automaticSpecialtiesPending = AUTOMATIC_SPECIALTY_SKILL_IDS.filter(
    (skillId) =>
      (skills[skillId] ?? 0) > 0 &&
      !specialties.some(
        (specialty) =>
          specialty.skillId === skillId && specialty.origin === "CREATION_AUTOMATIC",
      ),
  );
  const freeSpecialties = specialties.filter(
    (specialty) => specialty.origin === "CREATION_FREE",
  ).length;
  const freeSpecialtiesPending = Math.max(0, 1 - freeSpecialties);
  if (automaticSpecialtiesPending.length > 0 && context === "CREATION_FINALIZATION")
    violations.push({ code: "SPECIALTY_AUTOMATIC_MISSING", path: ["specialties"] });
  if (freeSpecialtiesPending > 0 && context === "CREATION_FINALIZATION")
    violations.push({ code: "SPECIALTY_FREE_MISSING", path: ["specialties"] });
  if (freeSpecialties > 1)
    violations.push({ code: "SPECIALTY_LIMIT_EXCEEDED", path: ["specialties"] });
  const pointsAllocated = safeValues.reduce((total, value) => total + value, 0);
  const targetPoints = target.reduce((total, value) => total + value, 0);
  const structuralViolations = violations.filter(
    (violation) =>
      !["SPECIALTY_AUTOMATIC_MISSING", "SPECIALTY_FREE_MISSING"].includes(violation.code),
  );
  return {
    automaticSpecialtiesPending,
    complete:
      distributionComplete &&
      automaticSpecialtiesPending.length === 0 &&
      freeSpecialtiesPending === 0 &&
      structuralViolations.length === 0,
    distributionComplete,
    freeSpecialtiesPending,
    pointsAllocated,
    pointsRemaining: Math.max(0, targetPoints - pointsAllocated),
    violations,
  };
}
