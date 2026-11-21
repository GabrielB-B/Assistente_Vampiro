export const CREATION_CLAN_POLICY = {
  ruleRevision: "RULE-CREATION-CLAN-001-r1",
} as const;

type PlayableKind = "CAITIFF" | "CLAN_VAMPIRE" | "THIN_BLOOD";

export type CreationOriginId =
  | "clan:banu-haqim"
  | "clan:brujah"
  | "clan:gangrel"
  | "clan:hecata"
  | "clan:lasombra"
  | "clan:malkavian"
  | "clan:ministry"
  | "clan:nosferatu"
  | "clan:ravnos"
  | "clan:salubri"
  | "clan:toreador"
  | "clan:tremere"
  | "clan:tzimisce"
  | "clan:ventrue"
  | "origin:caitiff"
  | "origin:thin-blood";

export type CreationDisciplineId =
  | "discipline:animalism"
  | "discipline:auspex"
  | "discipline:blood-sorcery"
  | "discipline:celerity"
  | "discipline:dominate"
  | "discipline:fortitude"
  | "discipline:obfuscate"
  | "discipline:oblivion"
  | "discipline:potence"
  | "discipline:presence"
  | "discipline:protean"
  | "discipline:thin-blood-alchemy";

type CreationOriginMechanicsView =
  | { readonly type: "CLAN" }
  | {
      readonly type: "CAITIFF";
      readonly startingDisciplinePattern: "TWO_AND_ONE_FROM_ANY_TWO";
      readonly disciplineExperienceMultiplier: 6;
      readonly hasClanBane: false;
      readonly hasClanCompulsion: false;
      readonly startsWithSuspectFlaw: true;
      readonly statusAtCreationAllowed: false;
    }
  | {
      readonly type: "THIN_BLOOD";
      readonly bloodPotency: 0;
      readonly hasClanBane: false;
      readonly hasClanCompulsion: false;
      readonly hasIntrinsicClanDisciplines: false;
      readonly predatorTypeAtCreation: false;
      readonly thinBloodMeritFlawPairs: { readonly maximum: 3; readonly minimum: 1 };
      readonly temporaryDisciplineFromResonance: true;
    };

export interface CreationBaneDefinition {
  readonly name: string;
  readonly severity: {
    readonly derivedFrom: "BLOOD_POTENCY";
    readonly resolutionStage: "HISTORY_AND_BLOOD";
    readonly source: {
      readonly pages: readonly [215, 216];
      readonly sourceId: "SRC-0001";
    };
  };
  readonly summary: string;
}

export interface CreationOriginDefinition {
  readonly bane: CreationBaneDefinition | null;
  readonly category: "CLAN" | "OTHER_ORIGIN";
  readonly clanId: CreationOriginId | null;
  readonly compulsion: { readonly name: string; readonly summary: string } | null;
  readonly disciplines: readonly CreationDisciplineId[];
  readonly id: CreationOriginId;
  readonly kind: PlayableKind;
  readonly mechanics: CreationOriginMechanicsView;
  readonly sources: readonly {
    readonly pages: readonly number[];
    readonly sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004";
  }[];
}

export interface CreationClanViolation {
  readonly code: "CREATION_ORIGIN_INVALID";
  readonly path: readonly ["originId"];
}

const source = (sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004", ...pages: number[]) =>
  ({ pages, sourceId }) as const;

const clan = (
  option: Omit<CreationOriginDefinition, "bane" | "category" | "kind" | "mechanics"> & {
    readonly bane: Omit<CreationBaneDefinition, "severity">;
  },
): CreationOriginDefinition => ({
  ...option,
  bane: {
    ...option.bane,
    severity: {
      derivedFrom: "BLOOD_POTENCY",
      resolutionStage: "HISTORY_AND_BLOOD",
      source: { pages: [215, 216], sourceId: "SRC-0001" },
    },
  },
  category: "CLAN",
  kind: "CLAN_VAMPIRE",
  mechanics: { type: "CLAN" },
});

export const CREATION_ORIGIN_CATALOG: readonly CreationOriginDefinition[] = [
  clan({
    bane: {
      name: "Sede pelo Sangue dos Membros",
      summary: "Provar vitae vampírica pode despertar uma fome difícil de interromper.",
    },
    clanId: "clan:banu-haqim",
    compulsion: {
      name: "Julgamento",
      summary: "O Sangue exige que uma transgressão ao código pessoal seja punida.",
    },
    disciplines: [
      "discipline:blood-sorcery",
      "discipline:celerity",
      "discipline:obfuscate",
    ],
    id: "clan:banu-haqim",
    sources: [source("SRC-0004", 18, 19, 20)],
  }),
  clan({
    bane: {
      name: "Temperamento violento",
      summary: "A Fúria torna mais difícil resistir a provocações e ao Frenesi.",
    },
    clanId: "clan:brujah",
    compulsion: {
      name: "Rebelião",
      summary:
        "A autoridade e as ordens tornam-se afrontas que precisam ser contestadas.",
    },
    disciplines: ["discipline:celerity", "discipline:potence", "discipline:presence"],
    id: "clan:brujah",
    sources: [source("SRC-0001", 65, 66, 67, 68, 69)],
  }),
  clan({
    bane: {
      name: "Traços bestiais",
      summary: "O Frenesi deixa marcas animais que denunciam a proximidade da Besta.",
    },
    clanId: "clan:gangrel",
    compulsion: {
      name: "Impulsos ferais",
      summary: "A razão recua e uma necessidade animal imediata domina a ação.",
    },
    disciplines: ["discipline:animalism", "discipline:fortitude", "discipline:protean"],
    id: "clan:gangrel",
    sources: [source("SRC-0001", 71, 72, 73, 74, 75)],
  }),
  clan({
    bane: {
      name: "Beijo doloroso",
      summary: "Sua mordida traz agonia em vez do êxtase normalmente causado pelo Beijo.",
    },
    clanId: "clan:hecata",
    compulsion: {
      name: "Morbidade",
      summary:
        "A fronteira entre vida e morte torna-se uma questão que precisa ser alterada.",
    },
    disciplines: ["discipline:auspex", "discipline:fortitude", "discipline:oblivion"],
    id: "clan:hecata",
    sources: [source("SRC-0004", 24, 25, 26, 27)],
  }),
  clan({
    bane: {
      name: "Imagem distorcida",
      summary: "Reflexos, gravações e certas tecnologias revelam uma presença instável.",
    },
    clanId: "clan:lasombra",
    compulsion: {
      name: "Implacabilidade",
      summary:
        "O fracasso torna-se intolerável e qualquer meio parece justificável para vencer.",
    },
    disciplines: ["discipline:dominate", "discipline:oblivion", "discipline:potence"],
    id: "clan:lasombra",
    sources: [source("SRC-0004", 30, 31, 32, 33)],
  }),
  clan({
    bane: {
      name: "Perspectiva fraturada",
      summary: "O Sangue intensifica uma perturbação que altera a experiência do mundo.",
    },
    clanId: "clan:malkavian",
    compulsion: {
      name: "Delírio",
      summary: "Uma percepção particular impõe-se como verdade imediata e incontornável.",
    },
    disciplines: ["discipline:auspex", "discipline:dominate", "discipline:obfuscate"],
    id: "clan:malkavian",
    sources: [source("SRC-0001", 77, 78, 79, 80, 81)],
  }),
  clan({
    bane: {
      name: "Repulsa à luz",
      summary: "A luz intensa fere e enfraquece os Ministros mais do que outros Membros.",
    },
    clanId: "clan:ministry",
    compulsion: {
      name: "Transgressão",
      summary:
        "O vampiro precisa levar alguém a romper uma regra ou convicção limitante.",
    },
    disciplines: ["discipline:obfuscate", "discipline:presence", "discipline:protean"],
    id: "clan:ministry",
    sources: [source("SRC-0004", 36, 37, 38, 39)],
  }),
  clan({
    bane: {
      name: "Repulsividade",
      summary:
        "O Abraço deforma sua aparência e limita tentativas de parecer inofensivo.",
    },
    clanId: "clan:nosferatu",
    compulsion: {
      name: "Criptofilia",
      summary: "Um segredo próximo torna-se uma necessidade que precisa ser descoberta.",
    },
    disciplines: ["discipline:animalism", "discipline:obfuscate", "discipline:potence"],
    id: "clan:nosferatu",
    sources: [source("SRC-0001", 83, 84, 85, 86, 87)],
  }),
  clan({
    bane: {
      name: "Condenação",
      summary: "Permanecer no mesmo refúgio por noites seguidas faz o Sangue arder.",
    },
    clanId: "clan:ravnos",
    compulsion: {
      name: "Tentar o destino",
      summary:
        "O perigo torna-se irresistível quando existe um caminho seguro e previsível.",
    },
    disciplines: ["discipline:animalism", "discipline:obfuscate", "discipline:presence"],
    id: "clan:ravnos",
    sources: [source("SRC-0003", 7, 8, 9), source("SRC-0004", 42, 43, 44, 45)],
  }),
  clan({
    bane: {
      name: "Caçados",
      summary: "Sua vitae desperta uma fome perigosa em outros vampiros que a provam.",
    },
    clanId: "clan:salubri",
    compulsion: {
      name: "Empatia afetiva",
      summary:
        "O sofrimento próximo exige alívio, mesmo quando ajudar traz novos riscos.",
    },
    disciplines: ["discipline:auspex", "discipline:dominate", "discipline:fortitude"],
    id: "clan:salubri",
    sources: [source("SRC-0003", 13, 14, 15), source("SRC-0004", 48, 49, 50, 51)],
  }),
  clan({
    bane: {
      name: "Fixação estética",
      summary:
        "Beleza e feiura intensas podem capturar sua atenção e interromper outras ações.",
    },
    clanId: "clan:toreador",
    compulsion: {
      name: "Obsessão",
      summary:
        "Algo sublime domina o pensamento até ser possuído, compreendido ou destruído.",
    },
    disciplines: ["discipline:auspex", "discipline:celerity", "discipline:presence"],
    id: "clan:toreador",
    sources: [source("SRC-0001", 89, 90, 91, 92, 93)],
  }),
  clan({
    bane: {
      name: "Sangue deficiente",
      summary:
        "Seu vitae perdeu parte da antiga capacidade de criar Laços com outros vampiros.",
    },
    clanId: "clan:tremere",
    compulsion: {
      name: "Perfeccionismo",
      summary:
        "A necessidade de executar uma tarefa sem falhas impede aceitar soluções suficientes.",
    },
    disciplines: ["discipline:auspex", "discipline:blood-sorcery", "discipline:dominate"],
    id: "clan:tremere",
    sources: [source("SRC-0001", 95, 96, 97, 98, 99)],
  }),
  clan({
    bane: {
      name: "Enraizados",
      summary:
        "O sono diurno exige proximidade com uma posse escolhida e claramente delimitada.",
    },
    clanId: "clan:tzimisce",
    compulsion: {
      name: "Cobiça",
      summary: "Uma pessoa, lugar ou objeto desperta uma urgência de posse e domínio.",
    },
    disciplines: ["discipline:animalism", "discipline:dominate", "discipline:protean"],
    id: "clan:tzimisce",
    sources: [source("SRC-0003", 17, 18, 19), source("SRC-0004", 54, 55, 56, 57)],
  }),
  clan({
    bane: {
      name: "Paladar refinado",
      summary: "A Fome só pode ser saciada plenamente por um tipo restrito de vítima.",
    },
    clanId: "clan:ventrue",
    compulsion: {
      name: "Arrogância",
      summary:
        "O vampiro precisa afirmar superioridade e obter obediência de alguém próximo.",
    },
    disciplines: ["discipline:dominate", "discipline:fortitude", "discipline:presence"],
    id: "clan:ventrue",
    sources: [source("SRC-0001", 100, 101, 102, 103, 104)],
  }),
  {
    bane: null,
    category: "OTHER_ORIGIN",
    clanId: null,
    compulsion: null,
    disciplines: [],
    id: "origin:caitiff",
    kind: "CAITIFF",
    mechanics: {
      disciplineExperienceMultiplier: 6,
      hasClanBane: false,
      hasClanCompulsion: false,
      startingDisciplinePattern: "TWO_AND_ONE_FROM_ANY_TWO",
      startsWithSuspectFlaw: true,
      statusAtCreationAllowed: false,
      type: "CAITIFF",
    },
    sources: [source("SRC-0001", 107, 108, 109), source("SRC-0004", 66, 67, 126, 127)],
  },
  {
    bane: null,
    category: "OTHER_ORIGIN",
    clanId: null,
    compulsion: null,
    disciplines: [],
    id: "origin:thin-blood",
    kind: "THIN_BLOOD",
    mechanics: {
      bloodPotency: 0,
      hasClanBane: false,
      hasClanCompulsion: false,
      hasIntrinsicClanDisciplines: false,
      predatorTypeAtCreation: false,
      temporaryDisciplineFromResonance: true,
      thinBloodMeritFlawPairs: { maximum: 3, minimum: 1 },
      type: "THIN_BLOOD",
    },
    sources: [
      source("SRC-0001", 111, 112, 113, 114, 115, 182, 183, 184),
      source("SRC-0004", 66, 67, 126),
    ],
  },
] as const;

const byId = new Map(CREATION_ORIGIN_CATALOG.map((option) => [option.id, option]));

export function resolveCreationOrigin(
  originId: CreationOriginId,
): CreationOriginDefinition | undefined {
  return byId.get(originId);
}

export function evaluateCreationClan(originId: CreationOriginId | null): {
  readonly complete: boolean;
  readonly selectedOriginId: CreationOriginId | null;
} {
  return {
    complete: originId !== null && byId.has(originId),
    selectedOriginId: originId !== null && byId.has(originId) ? originId : null,
  };
}

export function characterKindForOrigin(originId: CreationOriginId): PlayableKind {
  const option = resolveCreationOrigin(originId);
  if (option === undefined) throw new Error(`Unknown creation origin: ${originId}`);
  return option.kind;
}
