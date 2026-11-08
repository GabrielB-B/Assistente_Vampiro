import {
  CREATION_ORIGIN_CATALOG,
  type CreationDisciplineId,
  type CreationOriginId,
} from "./clans.js";

export type DisciplinePowerId = `power:${string}`;
export type PowerRuleAuditStatus = "CONFLICT_REVIEWED" | "PENDING" | "VERIFIED";
export interface PowerPresentationView {
  readonly contentKind: "PROJECT_PARAPHRASE" | "LICENSED" | "OWNER_PROVIDED";
  readonly contentRevisionId: string;
  readonly descriptionPtBr: string;
  readonly effectPtBr: string;
  readonly summaryPtBr: string;
}
export interface PowerRuleView {
  readonly activationPtBr: string | null;
  readonly amalgamRequirements: DisciplinePowerCatalogItemView["amalgamRequirements"];
  readonly auditStatus: PowerRuleAuditStatus;
  readonly conditionsPtBr: readonly string[];
  readonly cost: string | null;
  readonly dicePool: string | null;
  readonly difficulty: string | null;
  readonly duration: string | null;
  readonly notesPtBr: readonly string[];
  readonly prerequisitePowerOptions: DisciplinePowerCatalogItemView["prerequisitePowerOptions"];
  readonly prerequisites: DisciplinePowerCatalogItemView["prerequisites"];
  readonly rangePtBr: string | null;
  readonly restrictionsPtBr: readonly string[];
  readonly ruleRevisionId: string;
  readonly ruleRevisions: DisciplinePowerCatalogItemView["ruleRevisions"];
  readonly sourceRefs: DisciplinePowerCatalogItemView["sourceRefs"];
  readonly systemStepsPtBr: readonly string[];
  readonly targetPtBr: string | null;
}
export interface DisciplinePowerCatalogItemView {
  readonly auditStatus: PowerRuleAuditStatus;
  readonly amalgamRequirements: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly rating: number;
  }[];
  readonly cost?: string;
  readonly dicePool?: string;
  readonly difficulty?: string;
  readonly descriptionPtBr: string;
  readonly disciplineId: CreationDisciplineId;
  readonly duration?: string;
  readonly notesPtBr?: string;
  readonly effectPtBr: string;
  readonly id: DisciplinePowerId;
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly nameOriginal: string;
  readonly namePtBr: string;
  readonly presentation: PowerPresentationView;
  readonly prerequisites: readonly DisciplinePowerId[];
  readonly prerequisitePowerOptions: readonly (readonly DisciplinePowerId[])[];
  readonly ruleRevisionId: string;
  readonly ruleRevisions: readonly {
    readonly id: string;
    readonly sourceRefs: DisciplinePowerCatalogItemView["sourceRefs"];
    readonly status: "ACTIVE" | "SUPERSEDED";
  }[];
  readonly restrictionsPtBr?: string;
  readonly sourceRefs: readonly {
    readonly pages: readonly number[];
    readonly sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004";
  }[];
  readonly summaryPtBr: string;
  readonly systemPtBr?: string;
  readonly rule: PowerRuleView;
}
export interface DisciplineCatalogItemView {
  readonly descriptionPtBr: string;
  readonly id: CreationDisciplineId;
  readonly nameOriginal: string;
  readonly namePtBr: string;
  readonly powers: readonly DisciplinePowerCatalogItemView[];
  readonly ruleRevisionId: string;
  readonly sourceRefs: DisciplinePowerCatalogItemView["sourceRefs"];
  readonly summaryPtBr: string;
}
export interface CharacterDisciplineView {
  readonly disciplineId: CreationDisciplineId;
  readonly rating: number;
  readonly structuralMaximum: 5;
}
export interface CharacterDisciplinePowerView {
  readonly disciplineId: CreationDisciplineId;
  readonly powerId: DisciplinePowerId;
  readonly powerRuleRevisionId: string;
}
export interface CreationDisciplinesViolation {
  readonly code:
    | "CREATION_DISCIPLINE_DISTRIBUTION_EXCEEDED"
    | "CREATION_ORIGIN_REQUIRED"
    | "DISCIPLINE_DUPLICATE"
    | "DISCIPLINE_NOT_ALLOWED"
    | "DISCIPLINE_POWER_COUNT_EXCEEDED"
    | "DISCIPLINE_POWER_DUPLICATE"
    | "DISCIPLINE_POWER_LEVEL_INSUFFICIENT"
    | "DISCIPLINE_POWER_LEVEL_SLOT_INVALID"
    | "DISCIPLINE_POWER_AMALGAM_MISSING"
    | "DISCIPLINE_POWER_PREREQUISITE_MISSING"
    | "DISCIPLINE_POWER_REMOVAL_REQUIRES_CONFIRMATION"
    | "DISCIPLINE_POWER_UNKNOWN"
    | "DISCIPLINE_RATING_INVALID";
  readonly path: readonly string[];
}
export interface CreationDisciplinesEvaluationView {
  readonly complete: boolean;
  readonly pendingPowerChoices: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly eligiblePowerIds: readonly DisciplinePowerId[];
    readonly ordinal: number;
  }[];
  readonly powerAdjustments: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly incompatiblePowerIds: readonly DisciplinePowerId[];
    readonly minimumRequiredRemovals: number;
    readonly targetRating: number;
  }[];
  readonly violations: readonly CreationDisciplinesViolation[];
}

export const CREATION_DISCIPLINES_POLICY_REVISION = "RULE-CREATION-DISCIPLINES-001-r1";
export const DISCIPLINE_CATALOG_REVISION = "CATALOG-V5-CORE-COMPANION-PG-2023-r1";
const POWER_PRESENTATION_REVISION = "POWER-PRESENTATION-PTBR-PARAPHRASE-r1";
export const DISCIPLINE_STRUCTURAL_MAXIMUM = 5 as const;

type PowerSeed = readonly [
  slug: string,
  level: 1 | 2 | 3 | 4 | 5,
  namePtBr: string,
  nameOriginal: string,
  summaryPtBr: string,
];

const source = (sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004", ...pages: number[]) =>
  ({ pages, sourceId }) as const;

const POWER_SOURCE_OVERRIDES: Readonly<
  Record<string, DisciplinePowerCatalogItemView["sourceRefs"]>
> = {
  "auspex-heightened-senses": [source("SRC-0001", 249)],
  "auspex-sense-the-unseen": [source("SRC-0001", 249)],
  "auspex-premonition": [source("SRC-0001", 249)],
  "auspex-scry-the-soul": [source("SRC-0001", 250)],
  "auspex-share-the-senses": [source("SRC-0001", 250)],
  "auspex-spirits-touch": [source("SRC-0001", 250, 251)],
  "auspex-clairvoyance": [source("SRC-0001", 251)],
  "auspex-possession": [source("SRC-0001", 251, 252)],
  "auspex-telepathy": [source("SRC-0001", 252)],
  "celerity-cats-grace": [source("SRC-0001", 252)],
  "celerity-rapid-reflexes": [source("SRC-0001", 253)],
  "celerity-fleetness": [source("SRC-0001", 253)],
  "celerity-blink": [source("SRC-0001", 253)],
  "celerity-traversal": [source("SRC-0001", 253, 254)],
  "celerity-draught-of-elegance": [source("SRC-0001", 254)],
  "celerity-unerring-aim": [source("SRC-0001", 254)],
  "celerity-lightning-strike": [source("SRC-0001", 254)],
  "celerity-split-second": [source("SRC-0001", 254)],
  "presence-awe": [source("SRC-0001", 267)],
  "presence-daunt": [source("SRC-0001", 267)],
  "presence-lingering-kiss": [source("SRC-0001", 267)],
  "presence-dread-gaze": [source("SRC-0001", 267, 268)],
  "presence-entrancement": [source("SRC-0001", 268)],
  "presence-irresistible-voice": [source("SRC-0001", 268)],
  "presence-summon": [source("SRC-0001", 268)],
  "presence-majesty": [source("SRC-0001", 268, 269)],
  "presence-star-magnetism": [source("SRC-0001", 269)],
  "animalism-animal-messenger": [source("SRC-0004", 69)],
  "animalism-messengers-command": [source("SRC-0004", 69)],
  "animalism-plague-of-beasts": [source("SRC-0004", 69)],
  "animalism-pursue-bestial-temper": [source("SRC-0004", 70)],
  "animalism-quell-the-herd": [source("SRC-0004", 69, 70)],
  "auspex-fatal-flaw": [source("SRC-0004", 71)],
  "auspex-panacea": [source("SRC-0003", 24), source("SRC-0004", 70)],
  "auspex-reveal-temper": [source("SRC-0004", 70, 71)],
  "auspex-unburdening-bestial-soul": [
    source("SRC-0003", 24, 25),
    source("SRC-0004", 71, 72),
  ],
  "celerity-blurred-momentum": [source("SRC-0004", 72)],
  "celerity-russian-work": [source("SRC-0004", 72)],
  "celerity-unseen-strike": [source("SRC-0004", 73)],
  "celerity-weaving": [source("SRC-0004", 72)],
  "dominate-ancestral-dominion": [source("SRC-0004", 74)],
  "dominate-domitors-favor": [source("SRC-0003", 25), source("SRC-0004", 74)],
  "dominate-implant-suggestion": [source("SRC-0004", 74)],
  "dominate-slavish-devotion": [source("SRC-0004", 73)],
  "fortitude-earths-perseverance": [source("SRC-0004", 74, 75)],
  "fortitude-gorgons-scales": [source("SRC-0004", 75, 76)],
  "fortitude-revitalizing-vitae": [source("SRC-0004", 75)],
  "fortitude-valeren": [source("SRC-0003", 25), source("SRC-0004", 75)],
  "obfuscate-chimerstry": [source("SRC-0003", 25, 26), source("SRC-0004", 76)],
  "obfuscate-fata-morgana": [source("SRC-0003", 26), source("SRC-0004", 77)],
  "obfuscate-mask-mind": [source("SRC-0004", 78)],
  "obfuscate-mental-maze": [source("SRC-0004", 77, 78)],
  "potence-crash-down": [source("SRC-0004", 79)],
  "potence-relentless-grip": [source("SRC-0004", 79)],
  "potence-subtle-hammer": [source("SRC-0004", 79, 80)],
  "potence-wrecker": [source("SRC-0004", 79)],
  "presence-blow-edifice": [source("SRC-0004", 80, 81)],
  "presence-melpominee": [source("SRC-0004", 80)],
  "presence-serpents-eyes": [source("SRC-0004", 80)],
  "presence-thrown-voice": [source("SRC-0004", 80)],
  "protean-fleshcrafting": [source("SRC-0003", 27, 28), source("SRC-0004", 82, 83)],
  "protean-horrid-form": [source("SRC-0003", 28), source("SRC-0004", 83)],
  "protean-one-land": [source("SRC-0003", 28), source("SRC-0004", 84)],
  "protean-vicissitude": [source("SRC-0003", 26, 27), source("SRC-0004", 81, 82)],
  "blood-sorcery-explore-secrets": [source("SRC-0004", 98)],
  "tba-blooming-amaranth": [source("SRC-0004", 106)],
  "tba-airborne-momentum": [source("SRC-0001", 287)],
  "tba-awaken-sleeper": [source("SRC-0001", 287)],
  "tba-defractionate": [source("SRC-0001", 286)],
  "tba-envelop": [source("SRC-0001", 285, 286)],
  "tba-far-reach": [source("SRC-0001", 284, 285)],
  "tba-friends-list": [source("SRC-0004", 104)],
  "tba-mandragloire": [source("SRC-0004", 104, 105)],
  "tba-moment-clarity": [source("SRC-0004", 106)],
  "tba-mercurian-tongue": [source("SRC-0004", 103)],
  "tba-plug-in": [source("SRC-0004", 103, 104)],
  "tba-profane-hieros-gamos": [source("SRC-0001", 285)],
  "tba-rumor": [source("SRC-0004", 105)],
  "tba-short-circuit": [source("SRC-0004", 105)],
  "tba-tank": [source("SRC-0004", 105)],
  "tba-toxic-personality": [source("SRC-0004", 105, 106)],
  "tba-haze": [source("SRC-0001", 285)],
};

interface PowerMechanics {
  readonly activationPtBr?: string;
  readonly conditionsPtBr?: readonly string[];
  readonly cost?: string;
  readonly dicePool?: string;
  readonly difficulty?: string;
  readonly duration?: string;
  readonly notesPtBr?: string;
  readonly rangePtBr?: string;
  readonly restrictionsPtBr?: string;
  readonly systemPtBr?: string;
  readonly systemStepsPtBr?: readonly string[];
  readonly targetPtBr?: string;
}

const POWER_MECHANICS: Readonly<Record<string, PowerMechanics>> = {
  "animalism-bond-famulus": {
    cost: "Alimentar o animal com vitae em três noites distintas, uma Checagem de Sangue por noite",
    dicePool: "Carisma + Empatia com Animais",
    difficulty: "2 para ordens simples; aumenta com a complexidade",
    duration: "Até a morte do familiar",
    restrictionsPtBr: "Um familiar por vampiro.",
    systemPtBr:
      "Cria um vínculo mental com um animal. Sem Sussurros Selvagens, o familiar entende ordens verbais simples; ele se defende e protege o mestre, mas não enfrenta ameaças contrárias à própria natureza.",
  },
  "animalism-sense-the-beast": {
    cost: "Gratuito",
    dicePool: "Determinação + Animalismo vs. Autocontrole + Subterfúgio",
    duration: "Passiva",
    systemPtBr:
      "Revela hostilidade, presença de uma Besta sobrenatural e, com vitória crítica, tipo de criatura, Fome ou equivalente e Ressonância.",
  },
  "animalism-feral-whispers": {
    cost: "Uma Checagem de Sangue por tipo de animal na cena; gratuito com o familiar",
    dicePool: "Manipulação + Animalismo; Carisma + Animalismo para convocar",
    duration: "Uma cena",
    systemPtBr:
      "Permite comunicação em duas vias sem teste. Convencer animais exige teste conforme a tarefa; convocar um tipo presente na região usa dificuldade conforme a raridade e a margem define quantos respondem.",
  },
  "animalism-animal-messenger": {
    cost: "Uma Checagem de Sangue por noite de busca",
    dicePool: "Nenhuma; o familiar pode testar Determinação + Manha ou Sobrevivência",
    difficulty: "2 para rastrear; resistida se o destinatário estiver escondido",
    duration: "Uma ou mais noites",
    restrictionsPtBr: "Exige Amálgama Auspícios 1.",
    systemPtBr:
      "O familiar procura o destinatário e, ao fazer contato visual, entrega uma frase curta com a voz do mestre, retornando em seguida.",
  },
  "animalism-animal-succulence": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Sangue animal sacia um ponto adicional de Fome e trata a Potência do Sangue como dois níveis menor para alimentação animal. Consumir o próprio familiar sacia quatro e concede bônus temporário de dois pontos em um Atributo associado.",
  },
  "animalism-quell-the-beast": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Animalismo vs. Vigor + Determinação",
    duration: "Uma cena contra mortais; margem + 1 turnos contra vampiros",
    systemPtBr:
      "Incapacita um mortal salvo para autopreservação. Contra vampiro impede Surto de Sangue e críticos bestiais; vitória crítica também encerra frenesi.",
  },
  "animalism-plague-of-beasts": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Animalismo vs. Autocontrole + Empatia com Animais",
    duration: "Uma noite",
    systemPtBr:
      "Marca um alvo para a hostilidade dos animais próximos. A margem vira penalidade em testes de Habilidade fora do conflito físico e bônus equivalente para rastreá-lo.",
  },
  "animalism-messengers-command": {
    cost: "Nenhum custo adicional",
    dicePool: "Conforme Compelir ou Hipnotizar",
    duration: "Conforme Mensageiro Animal",
    restrictionsPtBr:
      "Exige Mensageiro Animal e Compelir ou Hipnotizar; Amálgama Dominação 1.",
    systemPtBr:
      "O familiar entrega também uma ordem de Dominação. O teste do Poder escolhido ocorre quando ele faz contato visual com o alvo.",
  },
  "animalism-subsume-the-spirit": {
    cost: "Uma Checagem de Sangue; gratuito no familiar",
    dicePool: "Manipulação + Animalismo",
    difficulty: "3",
    duration: "Uma cena; pode ser estendida indefinidamente nas condições da regra",
    systemPtBr:
      "A mente ocupa o corpo do animal e usa seus sentidos e movimentos. O corpo vampírico fica imóvel; prolongar durante o dia exige permanecer acordado e a morte do animal encerra o efeito com dano de Força de Vontade.",
  },
  "animalism-quell-the-herd": {
    cost: "Uma ou mais Checagens de Sangue",
    dicePool: "Autocontrole + Animalismo",
    duration: "Uma noite",
    systemPtBr:
      "Define um impulso geral para animais numa área do tamanho de um campo. Sucessos determinam a intensidade e aumentam a dificuldade de controle mundano; Checagens adicionais ampliam a área.",
  },
  "animalism-animal-dominion": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Carisma + Animalismo",
    duration: "Uma cena ou até a ordem ser cumprida",
    systemPtBr:
      "Comanda todos os animais de um tipo na área. A dificuldade depende da natureza e do perigo da ordem; os animais obedecem, mas o usuário não se comunica individualmente com eles.",
  },
  "animalism-drawing-out-the-beast": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Animalismo vs. Autocontrole + Determinação",
    duration: "A duração do frenesi transferido",
    systemPtBr:
      "Ao resistir a frenesi de fúria ou terror, transfere a Besta a um alvo próximo. Falha faz o usuário entrar em frenesi; sucesso coloca o alvo no frenesi correspondente.",
  },
  "animalism-pursue-bestial-temper": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Animalismo",
    difficulty: "3",
    duration: "Enquanto o usuário mantiver a vocalização",
    systemPtBr:
      "Aumenta ou reduz em um por sucesso da margem a dificuldade de resistir ao frenesi para vampiros ao alcance da voz. Redução permite novo teste para quem já está em frenesi.",
  },
  "animalism-unliving-hive": {
    cost: "Nenhum custo adicional",
    duration: "Passiva",
    restrictionsPtBr: "Exige Amálgama Ofuscação 2.",
    systemPtBr:
      "Estende a enxames de insetos os Poderes de Animalismo normalmente limitados a vertebrados. Um enxame pode tornar-se familiar e funciona como uma criatura coletiva para resistência, dano e usos narrativos.",
  },
  "auspex-heightened-senses": {
    cost: "Gratuito",
    duration: "Até ser desativado",
    systemPtBr:
      "Amplia todos os sentidos e soma Auspícios às paradas de percepção. O Narrador pode pedir Raciocínio + Auspícios para notar algo sobrenatural oculto; estímulos extremos podem sobrecarregar o usuário até que ele desative o Poder.",
  },
  "auspex-sense-the-unseen": {
    cost: "Gratuito",
    dicePool: "Raciocínio ou Determinação + Auspícios",
    duration: "Passiva",
    systemPtBr:
      "Permite perceber fantasmas, vampiros ofuscados e outros efeitos sobrenaturais escondidos. Quando há oposição ativa, a detecção é resistida pela parada usada para ocultar o alvo.",
  },
  "auspex-premonition": {
    cost: "Gratuito; uma Checagem de Sangue quando o usuário força uma visão",
    dicePool: "Determinação + Auspícios",
    duration: "Passiva ou até a visão ser interpretada",
    systemPtBr:
      "O Narrador oferece avisos breves e simbólicos de perigo. O usuário pode provocar uma premonição sobre um assunto específico; a margem determina a clareza e a utilidade dos sinais recebidos.",
  },
  "auspex-panacea": {
    cost: "Uma Checagem de Sangue; pode causar dano de Força de Vontade ao tratar alvos adicionais",
    dicePool: "Autocontrole + Auspícios",
    difficulty: "2; 0 se o tratamento ocupar uma cena inteira",
    duration: "Não aplicável",
    restrictionsPtBr: "Somente outro alvo; uma vez por alvo a cada noite.",
    systemPtBr:
      "Restaura dano Superficial de Força de Vontade igual à margem, ou um nível de dano Agravado para cada três sucessos da margem. Em mortais, também estabiliza forte agitação emocional.",
  },
  "auspex-scry-the-soul": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Um turno",
    systemPtBr:
      "Lê a aura do alvo. A margem revela estado emocional, Ressonância, natureza sobrenatural e outros sinais espirituais; resultados mais completos exigem margem maior.",
  },
  "auspex-share-the-senses": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Auspícios",
    difficulty: "3; pode aumentar com distância ou falta de vínculo",
    duration: "Uma cena",
    systemPtBr:
      "Projeta a percepção para os sentidos de um alvo conhecido. O corpo do usuário permanece vulnerável e ele percebe o ambiente pelo alvo enquanto sustenta a conexão.",
  },
  "auspex-reveal-temper": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Uma cena",
    systemPtBr:
      "Revela a Ressonância e Discrasias de um mortal ou a Ressonância da última presa de um vampiro. Uma vitória crítica também expõe detalhes da alimentação e favorece a interação com o alvo.",
  },
  "auspex-fatal-flaw": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole ou Vigor + Subterfúgio",
    duration: "Uma cena",
    systemPtBr:
      "Após observar o alvo por um turno, revela sua defesa mental ou física mais baixa e concede dois dados contra essa defesa. Compartilhar a descoberta concede um dado a outro personagem.",
  },
  "auspex-spirits-touch": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios",
    difficulty: "Definida pela idade e intensidade da impressão psíquica",
    duration: "Um turno",
    systemPtBr:
      "Ao tocar objeto ou local, recebe impressões emocionais e sensoriais ligadas a eventos passados. Mais sucessos produzem imagens mais antigas, claras ou específicas.",
  },
  "auspex-clairvoyance": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Auspícios",
    difficulty: "Variável conforme a área e o que se procura",
    duration: "Alguns minutos de concentração; informação válida para a cena",
    systemPtBr:
      "Expande a consciência por uma área ampla. Cada sucesso permite obter uma informação relevante sobre pessoas, presenças ou acontecimentos, respeitando o alcance definido pelo Narrador.",
  },
  "auspex-possession": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Determinação + Auspícios vs. Determinação + Inteligência",
    duration: "Até ser encerrada, o corpo hospedeiro morrer ou o usuário ser expulso",
    restrictionsPtBr: "Exige Amálgama Dominação 3 e normalmente afeta apenas mortais.",
    systemPtBr:
      "Transfere a mente do vampiro ao corpo do alvo. O corpo original cai em torpor; o usuário controla o hospedeiro, conserva capacidades mentais e sociais próprias e usa os atributos físicos dele.",
  },
  "auspex-telepathy": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Auspícios vs. Raciocínio + Subterfúgio",
    duration: "Até um minuto por ativação; pode ser renovada",
    systemPtBr:
      "Lê pensamentos superficiais e, com perguntas ou margem suficiente, alcança memórias e imagens mais profundas. Alvos não voluntários podem resistir e percebem a intrusão em uma falha do usuário.",
  },
  "auspex-unburdening-bestial-soul": {
    cost: "Duas Checagens de Sangue e uma Mácula",
    dicePool: "Autocontrole + Auspícios vs. Humanidade",
    duration: "Uma sessão",
    restrictionsPtBr:
      "Somente vampiros com Humanidade inferior à do usuário; exige Panaceia e Amálgama Dominação 3.",
    systemPtBr:
      "Após uma cena isolada, cada sucesso da margem remove uma Mácula ou cria proteção contra uma Mácula futura. Uma vitória crítica pode restaurar uma única vez um ponto de Humanidade, substituindo os demais benefícios.",
  },
  "celerity-cats-grace": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Mantém equilíbrio sobrenatural e permite atravessar superfícies estreitas sem teste. Quedas de até dez metros são aterrissadas em pé sem dano.",
  },
  "celerity-rapid-reflexes": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Permite defender-se de ataques à distância sem cobertura e realizar uma ação menor de até dois dados sem reduzir a ação principal.",
  },
  "celerity-fleetness": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Soma Celeridade a testes de Destreza fora do combate e às paradas de Destreza + Atletismo usadas para defender-se em combate.",
  },
  "celerity-russian-work": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    restrictionsPtBr: "Não acelera ataques, defesas nem tarefas ativamente resistidas.",
    systemPtBr:
      "Converte tarefas de Habilidade que consumiriam uma ação inteira em ações menores. Ações já consideradas menores podem ser realizadas quase instantaneamente, conforme o Narrador.",
  },
  "celerity-blink": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Destreza + Atletismo",
    difficulty: "Definida pelo terreno e obstáculos",
    duration: "Um turno",
    systemPtBr:
      "Percorre até cerca de cinquenta metros em linha quase reta e então realiza a ação pretendida. Obstáculos ou terreno perigoso exigem o teste indicado.",
  },
  "celerity-traversal": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Destreza + Atletismo",
    difficulty: "3",
    duration: "Um turno",
    systemPtBr:
      "Corre por paredes, superfícies frágeis ou água enquanto mantém o movimento. Uma falha interrompe a travessia e aplica as consequências normais da queda ou do terreno.",
  },
  "celerity-weaving": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Não sofre redução de parada ao defender-se de vários ataques à distância e soma Celeridade a todas as defesas de Destreza + Atletismo contra projéteis.",
  },
  "celerity-draught-of-elegance": {
    cost: "Uma Checagem de Sangue para produzir a vitae",
    duration: "Uma noite",
    systemPtBr:
      "Quem bebe a vitae recebe temporariamente metade do nível de Celeridade do doador, arredondado para baixo, e os Poderes correspondentes que o Narrador autorizar.",
  },
  "celerity-unerring-aim": {
    cost: "Uma Checagem de Sangue",
    duration: "Um turno",
    restrictionsPtBr: "Exige Amálgama Auspícios 2 e um ataque à distância.",
    systemPtBr:
      "O ataque à distância não pode ser defendido por meios comuns. Um alvo com Celeridade suficiente pode contestar segundo a regra específica do Poder.",
  },
  "celerity-blurred-momentum": {
    cost: "Uma Checagem de Sangue por turno",
    duration: "Até o usuário deixar de sustentar o efeito",
    systemPtBr:
      "Todo ataque que obtenha menos sucessos do que o nível de Celeridade do usuário erra automaticamente, inclusive ataques surpresa ou sem defesa normal.",
  },
  "celerity-lightning-strike": {
    cost: "Uma Checagem de Sangue",
    duration: "Um turno",
    systemPtBr:
      "Realiza um ataque físico em velocidade impossível. O alvo não pode defender-se sem Celeridade compatível; quando pode, resolve-se a disputa prevista pela regra.",
  },
  "celerity-split-second": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma ação",
    systemPtBr:
      "Interrompe a sequência narrativa para executar uma ação curta antes que o evento em curso se complete. Não retroage sobre algo já resolvido e o Narrador delimita o que cabe no instante.",
  },
  "celerity-unseen-strike": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Destreza + Celeridade vs. Raciocínio + Percepção",
    difficulty: "1 para o ataque surpresa se o alvo perder a disputa",
    duration: "Um turno",
    restrictionsPtBr: "Exige Piscar e Amálgama Ofuscação 4.",
    systemPtBr:
      "Combina o deslocamento de Piscar com desaparecimento momentâneo. Se o alvo perder a disputa, não se defende e o ataque é feito na Dificuldade 1; caso contrário, o ataque segue como um uso normal de Piscar.",
  },
  "presence-awe": {
    cost: "Gratuito",
    duration: "Uma cena ou até ser desativado",
    systemPtBr:
      "Soma Presença às paradas de Persuasão e Performance e a outros testes de influência positiva aprovados pelo Narrador contra quem percebe o usuário.",
  },
  "presence-daunt": {
    cost: "Gratuito",
    duration: "Uma cena ou até ser desativado",
    systemPtBr:
      "Soma Presença às paradas de Intimidação. Mortais precisam superar o efeito para atacar ou agir diretamente contra o usuário, conforme a situação estabelecida pelo Narrador.",
  },
  "presence-serpents-eyes": {
    cost: "Gratuito",
    dicePool: "Carisma + Presença vs. Raciocínio + Autocontrole contra vampiros",
    duration: "Até o contato visual ser rompido ou a cena terminar",
    restrictionsPtBr: "Exige Amálgama Proteanismo 1 e afeta um alvo por vez.",
    systemPtBr:
      "Imobiliza um mortal enquanto o olhar é mantido. Vampiros resistem pela disputa e podem gastar um ponto de Força de Vontade, a partir do turno seguinte, para romper a paralisia.",
  },
  "presence-lingering-kiss": {
    cost: "Gratuito",
    duration: "Até o efeito emocional terminar segundo a margem e a ficção",
    restrictionsPtBr: "Ativa-se ao alimentar-se de um mortal.",
    systemPtBr:
      "Transforma o Beijo em dependência sobrenatural. O alvo passa a desejar nova alimentação pelo vampiro e sofre consequências quando resiste ou tenta substituir a experiência, conforme a intensidade obtida.",
  },
  "presence-melpominee": {
    cost: "Gratuito",
    duration: "Conforme o Poder de Presença transmitido",
    systemPtBr:
      "Permite aplicar Fascínio, Amedrontar, Olhar Aterrorizante, Transe e Majestade somente pela voz. O alvo precisa ouvi-la ao vivo; gravações e transmissões não conservam o efeito.",
  },
  "presence-thrown-voice": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    restrictionsPtBr: "Exige Amálgama Auspícios 1.",
    systemPtBr:
      "Projeta a voz a partir de qualquer ponto visível. Pode ser combinada com Voz Irresistível, Melpominê e efeitos semelhantes, mantendo os testes e limitações do Poder transmitido.",
  },
  "presence-dread-gaze": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Um turno; consequências de fuga podem durar mais",
    systemPtBr:
      "Impõe terror sobrenatural. Mortais fogem ou se submetem; vampiros recuam e sofrem a penalidade definida pela margem. Uma vitória crítica pode provocar frenesi de terror.",
  },
  "presence-entrancement": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Raciocínio",
    duration: "Uma hora, acrescida conforme a margem",
    systemPtBr:
      "Cria fascinação intensa pelo usuário. A margem favorece interações sociais e leva o alvo a atender pedidos razoáveis, mas não remove sua autopreservação nem equivale a controle mental.",
  },
  "presence-irresistible-voice": {
    cost: "Gratuito",
    duration: "Passiva",
    restrictionsPtBr: "Exige Amálgama Dominação 1.",
    systemPtBr:
      "Permite usar Dominação por meio da voz sem contato visual, desde que o alvo ouça o comando. Todas as demais limitações da Dominação permanecem.",
  },
  "presence-summon": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Presença vs. Autocontrole + Inteligência",
    duration: "Uma noite",
    restrictionsPtBr: "O usuário precisa ter encontrado ou afetado o alvo antes.",
    systemPtBr:
      "Implanta a necessidade de ir até o usuário. Em caso de vitória, o alvo segue pelo caminho mais direto e seguro disponível, sem saber necessariamente por que está indo.",
  },
  "presence-blow-edifice": {
    cost: "Conforme o Poder de Presença transmitido",
    duration: "Conforme o Poder de Presença transmitido",
    restrictionsPtBr: "O usuário precisa estar dentro do edifício ou local equivalente.",
    systemPtBr:
      "Estende Fascínio, Amedrontar ou Majestade ao próprio local. Quem está dentro ou contempla a construção reage a ela como reagiria ao vampiro, salvo quando o usuário está diretamente visível.",
  },
  "presence-majesty": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Uma cena",
    systemPtBr:
      "Impõe reverência esmagadora. Quem perde a disputa não consegue agir contra o usuário e precisa vencer nova resistência para desobedecer ou afastar-se de sua presença.",
  },
  "presence-star-magnetism": {
    cost: "Uma Checagem de Sangue",
    duration: "Conforme o Poder de Presença transmitido",
    systemPtBr:
      "Permite que Poderes de Presença atravessem transmissão ao vivo e, com efeito reduzido, gravações. Cada espectador resiste ou reage individualmente segundo o Poder aplicado.",
  },
  "dominate-cloud-memory": {
    cost: "Gratuito",
    duration: "Permanente",
    systemPtBr:
      "Com contato visual e a ordem apropriada, apaga a lembrança dos últimos minutos. Não cria memória substituta e não remove conhecimentos mais antigos.",
  },
  "dominate-compel": {
    cost: "Gratuito",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação quando resistido",
    duration: "Até a ordem imediata ser executada ou a cena terminar",
    systemPtBr:
      "Impõe uma ordem simples, direta e executável em um turno. Mortais despreparados normalmente não testam; alvos preparados ou sobrenaturais podem resistir.",
  },
  "dominate-slavish-devotion": {
    cost: "Nenhum custo adicional",
    duration: "Passiva",
    restrictionsPtBr: "Exige Amálgama Fortitude 1.",
    systemPtBr:
      "Terceiros sofrem penalidade igual à Fortitude do usuário ao usar Dominação em alguém que já esteja sob a Dominação dele.",
  },
  "dominate-mesmerize": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação quando resistido",
    duration: "Até a ordem ser cumprida ou a cena terminar",
    systemPtBr:
      "Implanta instrução verbal mais complexa, desde que seja clara e possível. A vítima executa literalmente; comandos autodestrutivos falham sem Decreto Terminal.",
  },
  "dominate-dementation": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Dominação vs. Autocontrole + Inteligência",
    duration: "Uma cena",
    restrictionsPtBr: "Exige Amálgama Ofuscação 2.",
    systemPtBr:
      "Ataca a estabilidade mental e causa dano Superficial de Força de Vontade igual à margem; uma vitória crítica também impõe uma Compulsão apropriada.",
  },
  "dominate-domitors-favor": {
    cost: "Uma Checagem de Sangue",
    duration: "Um mês",
    systemPtBr:
      "Servos sob Laço de Sangue sofrem três dados de penalidade em tentativas de desafiar o mestre e não podem gastar Força de Vontade; falha total impede o enfraquecimento mensal do Laço.",
  },
  "dominate-forgetful-mind": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação",
    duration: "Permanente; pode ser desfeito por investigação sobrenatural",
    systemPtBr:
      "Remove e substitui lembranças de uma cena. A margem define a extensão e coerência; memórias mal construídas podem ruir sob evidência ou escrutínio.",
  },
  "dominate-submerged-directive": {
    cost: "Nenhum custo adicional ao Poder de Dominação usado",
    duration: "Até a condição ocorrer ou o comando perder validade",
    systemPtBr:
      "Esconde uma ordem de Hipnotizar para ativação futura quando uma condição sensorial clara acontecer. A vítima não se recorda da instrução até o gatilho.",
  },
  "dominate-implant-suggestion": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Dominação vs. Autocontrole + Determinação",
    duration: "Uma cena",
    restrictionsPtBr: "Exige Amálgama Presença 1.",
    systemPtBr:
      "Altera temporariamente opinião, desejo ou intenção. Mudanças contrárias a convicções fundamentais sempre concedem resistência, inclusive a mortais despreparados.",
  },
  "dominate-rationalize": {
    cost: "Nenhum custo adicional",
    duration: "Permanente",
    systemPtBr:
      "Quem executa uma ordem de Dominação acredita ter agido por decisão própria e inventa justificativas plausíveis, dificultando perceber ou provar a manipulação.",
  },
  "dominate-ancestral-dominion": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Dominação vs. Determinação + Ocultismo",
    duration: "Até a ordem ser executada ou a cena terminar",
    restrictionsPtBr:
      "Exige Hipnotizar e Amálgama Feitiçaria de Sangue 2; afeta descendente da linhagem.",
    systemPtBr:
      "Transmite silenciosamente uma ordem pelo Sangue, sem contato visual. O alvo recebe um dado de resistência por geração de separação e não cumpre ordem autolesiva.",
  },
  "dominate-mass-manipulation": {
    cost: "Uma Checagem de Sangue além do Poder replicado",
    duration: "Conforme o Poder de Dominação aplicado",
    systemPtBr:
      "Aplica Compelir, Hipnotizar ou outro comando compatível a todos os alvos que vejam e ouçam o usuário. Cada alvo elegível resiste individualmente quando cabível.",
  },
  "dominate-terminal-decree": {
    cost: "Nenhum custo adicional",
    duration: "Conforme o comando",
    restrictionsPtBr: "Aplica-se a Poderes de Dominação capazes de impor ordens.",
    systemPtBr:
      "Permite ordens diretamente perigosas ou fatais. Alvos sobrenaturais ou preparados ainda resistem segundo o Poder empregado; mortais podem receber uma última resistência conforme a regra.",
  },
  "fortitude-earths-perseverance": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até o usuário encerrar",
    systemPtBr:
      "Enquanto ativo, nenhuma força externa move o vampiro contra sua vontade. O Poder não reduz dano nem impede que o corpo ou a superfície onde ele está sejam destruídos.",
  },
  "fortitude-resilience": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Aumenta a Vitalidade máxima em um número de caixas igual ao nível de Fortitude e recalcula o rastreador imediatamente.",
  },
  "fortitude-unswayable-mind": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Soma Fortitude às paradas usadas para resistir a coerção, intimidação, sedução e outras influências mentais ou sociais, sobrenaturais ou não.",
  },
  "fortitude-toughness": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Subtrai Fortitude de todo dano Superficial recebido antes de reduzi-lo pela metade, sem poder baixar o dano abaixo de um.",
  },
  "fortitude-enduring-beasts": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    restrictionsPtBr:
      "Exige Amálgama Animalismo 1 e um animal afetado pelo Sangue do usuário.",
    systemPtBr:
      "Concede ao animal o nível de Fortitude do vampiro e seus benefícios defensivos aplicáveis durante a cena.",
  },
  "fortitude-revitalizing-vitae": {
    cost: "Somente as Checagens de Sangue necessárias para doar vitae",
    duration: "Passiva",
    systemPtBr:
      "Quando a vitae do usuário cura um ser vivo, cada Checagem de Sangue restaura três níveis de dano Agravado em vez de um. Laço de Sangue e transformação em carniçal continuam normais.",
  },
  "fortitude-valeren": {
    cost: "Uma Checagem de Sangue; pode causar dano de Vitalidade ao tratar alvos adicionais",
    dicePool: "Inteligência + Fortitude",
    difficulty: "2; 0 se o tratamento ocupar uma cena inteira",
    duration: "Não aplicável",
    restrictionsPtBr: "Somente outro vampiro; uma vez por alvo a cada noite.",
    systemPtBr:
      "Restaura dano Superficial de Vitalidade igual à margem, ou um nível de dano Agravado para cada três sucessos da margem.",
  },
  "fortitude-defy-bane": {
    cost: "Uma Checagem de Sangue por uso",
    duration: "Até o fim da cena",
    systemPtBr:
      "Ao sofrer dano Agravado, converte uma quantidade até Fortitude em dano Superficial. Cada conversão exige Checagem de Sangue e ocorre antes de marcar o dano.",
  },
  "fortitude-fortify-inner-facade": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Soma Fortitude à resistência contra Auspícios e outros efeitos que leem mente, emoções ou aura; se não houver disputa, aumenta a Dificuldade pela metade de Fortitude, arredondada para cima.",
  },
  "fortitude-draught-of-endurance": {
    cost: "Uma Checagem de Sangue para produzir a vitae",
    duration: "Uma noite",
    systemPtBr:
      "Quem bebe a vitae recebe metade da Fortitude do doador, arredondada para baixo, e Poderes compatíveis autorizados pelo Narrador.",
  },
  "fortitude-gorgons-scales": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até a Ressonância ser consumida",
    systemPtBr:
      "Concede uma defesa conforme a Ressonância da última alimentação: remove estaca, reduz dano Agravado de fogo ou sol para Superficial, ou concede quatro dados contra leitura por Auspícios. A proteção termina ao atingir seu limite.",
  },
  "fortitude-flesh-of-marble": {
    cost: "Duas Checagens de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Ignora a primeira fonte de dano físico de cada turno, inclusive fogo e luz solar, salvo quando um ataque obtém vitória crítica ou a regra específica supera a proteção.",
  },
  "fortitude-prowess-from-pain": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Ignora penalidades de comprometimento e acrescenta um ponto a um Atributo Físico por nível de dano marcado, limitado pelo nível de Fortitude e pelo máximo permitido.",
  },
  "obfuscate-cloak-of-shadows": {
    cost: "Gratuito",
    duration: "Uma cena ou até mover-se ou chamar atenção",
    systemPtBr:
      "Enquanto imóvel e discretamente posicionado, o vampiro é ignorado pela percepção comum. Observação sobrenatural pode contestar conforme as regras de Ofuscação.",
  },
  "obfuscate-silence-of-death": {
    cost: "Gratuito",
    duration: "Uma cena ou até ser desativado",
    systemPtBr:
      "Suprime todos os sons produzidos pelo usuário e por objetos em contato direto com ele, sem silenciar terceiros ou o ambiente ao redor.",
  },
  "obfuscate-unseen-passage": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até o efeito ser rompido",
    systemPtBr:
      "Permite mover-se sem ser percebido. Ataques, ações que chamem atenção ou interação direta podem romper a ocultação; observadores sobrenaturais contestam com Auspícios.",
  },
  "obfuscate-chimerstry": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Ofuscação vs. Autocontrole + Raciocínio",
    duration: "Um turno",
    restrictionsPtBr:
      "Exige Amálgama Presença 1; cada alvo é afetado uma vez por conflito.",
    systemPtBr:
      "Cria uma alucinação breve de um sentido. Alvos despreparados perdem dois dados na próxima ação; quem falha em resistir perde também a próxima ação ativa.",
  },
  "obfuscate-ghost-in-machine": {
    cost: "Nenhum custo adicional",
    duration: "Conforme o Poder de Ofuscação aplicado",
    systemPtBr:
      "Faz câmeras, sensores e transmissões tratarem o usuário conforme sua Ofuscação. Tentativas digitais de identificá-lo sofrem a oposição definida pelo Poder.",
  },
  "obfuscate-mask-thousand-faces": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Observadores percebem um estranho comum e esquecível. Criar aparência específica exige Disfarce do Impostor; Auspícios pode contestar a máscara.",
  },
  "obfuscate-fata-morgana": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Ofuscação",
    difficulty: "1 + sentidos afetados; aumenta com escala e complexidade",
    duration: "Uma cena ou até ser encerrada",
    restrictionsPtBr: "Exige Amálgama Presença 2.",
    systemPtBr:
      "Cria alucinação multissensorial para todos os alvos que vejam o usuário ou sejam vistos por ele. Interação física ou teste bem-sucedido de Inteligência + Percepção contra Manipulação + Presença desfaz a ilusão para o observador.",
  },
  "obfuscate-conceal": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Ofuscação",
    duration: "Uma noite ou até o objeto ser movido",
    restrictionsPtBr: "Exige Amálgama Auspícios 3.",
    systemPtBr:
      "Estende Manto das Sombras a um objeto grande o bastante para ser tocado. A margem e o tamanho determinam a dificuldade; mover ou usar o objeto rompe o efeito.",
  },
  "obfuscate-vanish": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Ofuscação vs. Raciocínio + Percepção",
    duration: "Conforme o Poder de Ofuscação ativado em seguida",
    systemPtBr:
      "Permite ativar Ofuscação diante de testemunhas. Quem perde a disputa racionaliza o desaparecimento e deixa de acompanhar o usuário.",
  },
  "obfuscate-mental-maze": {
    cost: "Uma Checagem de Sangue; mais duas para área muito pequena ou exterior denso",
    dicePool: "Carisma + Ofuscação vs. Raciocínio + Determinação",
    duration: "Uma noite",
    restrictionsPtBr: "Exige Amálgama Dominação 1.",
    systemPtBr:
      "Aprisiona o alvo na percepção repetida do local. Mortais não escapam por teste; sobrenaturais tentam Determinação + Percepção por cena contra os sucessos iniciais e sofrem dano de Força de Vontade ao falhar.",
  },
  "obfuscate-cloak-gathering": {
    cost: "Uma Checagem de Sangue além do Poder estendido",
    duration: "Conforme o Poder de Ofuscação aplicado",
    systemPtBr:
      "Estende ao grupo próximo um Poder de Ofuscação conhecido. Quem rompe a ocultação deixa de se beneficiar sem necessariamente revelar os demais.",
  },
  "obfuscate-impostors-guise": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Performance",
    duration: "Uma cena",
    systemPtBr:
      "Com estudo prévio, faz observadores perceberem o usuário como uma pessoa específica. A margem define fidelidade; contato próximo e Auspícios podem contestar.",
  },
  "obfuscate-mask-mind": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Ofuscação",
    difficulty: "1 a 3 ou mais, conforme a complexidade da falsa personalidade",
    duration: "Uma cena",
    restrictionsPtBr: "Exige Amálgama Dominação 2.",
    systemPtBr:
      "Constrói personalidade psíquica falsa. A margem aumenta a Dificuldade de leituras sobrenaturais; falha em superar esse valor revela somente pensamentos, aura e emoções fabricados.",
  },
  "potence-lethal-body": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Ataques desarmados causam dano Agravado a mortais e ignoram uma quantidade de armadura igual à Potência do usuário.",
  },
  "potence-soaring-leap": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Multiplica a distância normal de salto pelo nível de Potência, sem exigir corrida, e permite alcançar alturas impossíveis para um humano.",
  },
  "potence-prowess": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Soma Potência ao dano desarmado e aos feitos de força; em ataques com armas corpo a corpo, adiciona metade de Potência, arredondada para cima, ao dano.",
  },
  "potence-relentless-grip": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Soma Potência como sucessos automáticos para manter-se agarrado a algo ou conservar uma imobilização já obtida; não melhora o teste inicial de agarrar.",
  },
  "potence-brutal-feed": {
    cost: "Gratuito",
    duration: "Durante a alimentação",
    systemPtBr:
      "Ao alimentar-se violentamente, sacia Fome e causa dano à vítima com velocidade ampliada. A ação ameaça a Máscara e pode matar mortais rapidamente.",
  },
  "potence-spark-of-rage": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Potência vs. Autocontrole + Inteligência",
    duration: "Uma cena",
    restrictionsPtBr: "Exige Amálgama Presença 3.",
    systemPtBr:
      "Provoca irritação coletiva e pode iniciar conflito. Alvos que perdem a disputa sofrem penalidade social e precisam resistir a impulsos violentos conforme a situação.",
  },
  "potence-uncanny-grip": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Força + Potência",
    difficulty: "Definida pela superfície",
    duration: "Uma cena",
    systemPtBr:
      "Crava mãos e pés em superfícies para escalar sem apoio. Cada sucesso permite progresso e falha pode causar queda conforme a altura.",
  },
  "potence-draught-of-might": {
    cost: "Uma Checagem de Sangue para produzir a vitae",
    duration: "Uma noite",
    systemPtBr:
      "Quem bebe a vitae recebe metade da Potência do doador, arredondada para baixo, e Poderes compatíveis autorizados pelo Narrador.",
  },
  "potence-subtle-hammer": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Permite executar um ataque desarmado ou feito de força como ação menor de dois dados, uma vez por turno, e concede bônus em feitos com movimento limitado.",
  },
  "potence-earthshock": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Força + Potência",
    duration: "Um turno",
    systemPtBr:
      "Golpeia o solo e derruba ou fere alvos numa área. A margem determina alcance e dano conforme terreno e distância.",
  },
  "potence-fist-of-caine": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Ataques desarmados do vampiro causam dano Agravado também a seres sobrenaturais, preservando os demais bônus de Potência aplicáveis.",
  },
  "potence-crash-down": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Força + Potência vs. Destreza + Atletismo",
    duration: "Não aplicável",
    restrictionsPtBr: "Exige Salto Elevado.",
    systemPtBr:
      "Ao aterrissar com Salto Elevado, atinge todos em um raio de três metros. Cada alvo sofre dano Superficial igual à margem; três níveis ou falha total também o derrubam.",
  },
  "potence-wrecker": {
    cost: "Gratuito",
    duration: "Conforme Proeza",
    restrictionsPtBr: "Exige Proeza e afeta somente objetos inanimados.",
    systemPtBr:
      "Conta o nível de Potência duas vezes ao usar Proeza em feitos de força destinados a danificar ou destruir objetos e estruturas.",
  },
  "protean-eyes-beast": {
    cost: "Gratuito",
    duration: "Até ser desativado",
    systemPtBr:
      "Permite enxergar em escuridão total e perceber detalhes sem fonte de luz. Os olhos assumem aparência animal e podem denunciar a natureza sobrenatural.",
  },
  "protean-weight-feather": {
    cost: "Gratuito",
    duration: "Enquanto mantido",
    systemPtBr:
      "Reduz o peso efetivo do corpo a quase nada, permitindo amortecer quedas, caminhar sobre superfícies frágeis e ser deslocado com facilidade; não altera massa para causar dano.",
  },
  "protean-feral-weapons": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Transforma mãos, dentes ou outra parte do corpo em arma natural leve perfurante com dano aumentado. O dano é Superficial não reduzido pela metade contra vampiros.",
  },
  "protean-vicissitude": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Proteanismo",
    duration: "Permanente",
    restrictionsPtBr: "Exige Amálgama Dominação 2.",
    systemPtBr:
      "Cada sucesso permite uma alteração no próprio corpo, até o nível de Proteanismo, ao custo de um ponto de Atributo Físico por alteração. Pode redistribuir Atributos, criar arma, armadura ou aparência; reverter equivale a curar dano Agravado.",
  },
  "protean-earth-meld": {
    cost: "Uma Checagem de Sangue",
    duration: "Um dia ou até ser perturbado",
    systemPtBr:
      "Afunda o corpo em solo natural suficiente para contê-lo e protege da luz solar. Despertar antes da noite ou ser perturbado exige a resolução indicada e pode expulsar o usuário.",
  },
  "protean-shapechange": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até ser encerrada",
    systemPtBr:
      "Transforma o vampiro em um animal aproximadamente do mesmo tamanho. Conserva mente e traços sobrenaturais, assume atributos físicos e capacidades locomotoras da forma escolhida.",
  },
  "protean-fleshcrafting": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Proteanismo vs. Vigor + Determinação quando resistido",
    duration: "Permanente",
    restrictionsPtBr: "Exige Vicissitude e Amálgama Dominação 2.",
    systemPtBr:
      "Aplica alterações de Vicissitude a outro corpo durante uma cena de trabalho. A margem determina alterações contra alvo contido; cada mudança pode ser revertida como dano Agravado.",
  },
  "protean-metamorphosis": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até ser encerrada",
    restrictionsPtBr: "Exige Metamorfose.",
    systemPtBr:
      "Concede uma segunda forma animal, em geral menor ou voltada a fuga, com atributos e sentidos próprios; segue as demais regras de Metamorfose.",
  },
  "protean-horrid-form": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena ou até ser encerrada",
    restrictionsPtBr: "Exige Vicissitude e Amálgama Dominação 2.",
    systemPtBr:
      "Em um turno, ganha alterações gratuitas de Vicissitude iguais a Proteanismo para Atributos, armas e armadura. Críticos tornam-se bestiais e a dificuldade de frenesi aumenta em dois.",
  },
  "protean-mist-form": {
    cost: "Uma ou mais Checagens de Sangue conforme a velocidade da transformação",
    duration: "Uma cena ou até ser encerrada",
    systemPtBr:
      "Transforma-se em névoa consciente, atravessa frestas e fica imune a dano físico comum. Fogo, luz solar e efeitos sobrenaturais apropriados ainda causam dano.",
  },
  "protean-unfettered-heart": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "O coração pode mover-se dentro do corpo, tornando tentativas de estaquear mais difíceis e permitindo remover uma estaca com ação e teste apropriados.",
  },
  "protean-one-land": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Raciocínio + Animalismo quando a percepção é contestada",
    duration: "Um dia ou mais, ou até perturbação física",
    restrictionsPtBr: "Exige Fusão com a Terra e Amálgama Animalismo 2.",
    systemPtBr:
      "Funde-se a qualquer superfície e percebe estímulos até cerca de 1,6 km pelos animais locais. Acordar antes da noite exige Determinação + Proteanismo na Dificuldade 4.",
  },
  "blood-sorcery-corrosive-vitae": {
    cost: "Uma ou mais Checagens de Sangue",
    duration: "Até a vitae perder potência ou ser neutralizada",
    systemPtBr:
      "Converte vitae expelida em ácido capaz de corroer matéria não viva. Cada Checagem produz quantidade limitada; o sangue não pode alimentar nem criar Laço enquanto corrosivo.",
  },
  "blood-sorcery-taste-for-blood": {
    cost: "Gratuito",
    dicePool: "Determinação + Feitiçaria de Sangue",
    duration: "Não aplicável",
    systemPtBr:
      "Ao provar sangue, cada sucesso revela uma categoria de informação: Ressonância, intensidade, natureza sobrenatural, Potência do Sangue, geração ou vínculo relevante.",
  },
  "blood-sorcery-extinguish-vitae": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Feitiçaria de Sangue vs. Vigor + Autocontrole",
    duration: "Não aplicável",
    systemPtBr:
      "À distância visual, faz a vitae de outro vampiro tornar-se inerte e aumenta a Fome conforme a margem, limitada pela regra do Poder.",
  },
  "blood-sorcery-explore-secrets": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Feitiçaria de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Usa uma amostra de sangue para descobrir vínculos, propriedades ou segredos sobrenaturais que ela carrega. A margem define precisão e quantidade de respostas.",
  },
  "blood-sorcery-blood-potency": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Feitiçaria de Sangue",
    difficulty: "2 + Potência do Sangue atual",
    duration: "Uma cena ou uma noite em vitória crítica",
    systemPtBr:
      "Aumenta temporariamente a Potência do Sangue em um por sucesso da margem, respeitando o máximo geracional. Benefícios e penalidades do novo valor aplicam-se durante o efeito.",
  },
  "blood-sorcery-scorpions-touch": {
    cost: "Uma ou mais Checagens de Sangue",
    dicePool: "Força + Feitiçaria de Sangue vs. Vigor + Ocultismo",
    duration: "Uma cena para o veneno preparado; efeito conforme o dano",
    systemPtBr:
      "Transforma vitae em veneno aplicado por ingestão ou arma. A disputa causa dano Agravado de Vitalidade igual à margem contra mortais e Superficial não reduzido contra vampiros.",
  },
  "blood-sorcery-theft-vitae": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Feitiçaria de Sangue vs. Raciocínio + Ocultismo",
    duration: "Um turno",
    systemPtBr:
      "Puxa sangue de ferimento ou recipiente até a boca do usuário. Contra ser vivo, a margem determina a Fome saciada e o dano correspondente.",
  },
  "blood-sorcery-baals-caress": {
    cost: "Uma ou mais Checagens de Sangue",
    dicePool: "Força + Feitiçaria de Sangue vs. Vigor + Ocultismo",
    duration: "Uma cena para a vitae preparada",
    systemPtBr:
      "Produz veneno de vitae mais potente. Quando introduzido no alvo, causa dano Agravado conforme a margem, inclusive contra vampiros.",
  },
  "blood-sorcery-cauldron-blood": {
    cost: "Uma Checagem de Sangue e Máculas conforme a vítima",
    dicePool: "Determinação + Feitiçaria de Sangue vs. Autocontrole + Ocultismo",
    duration: "Um turno",
    systemPtBr:
      "Faz o sangue do alvo ferver. Cada sucesso da margem causa dano Agravado e pode matar mortais de forma imediata; exige toque e concentração.",
  },
  "oblivion-ashes-to-ashes": {
    cost: "Uma Checagem de Sangue",
    duration: "Três turnos",
    systemPtBr:
      "Aplica vitae a um cadáver e o reduz a cinzas, removendo vestígios orgânicos. Objetos não orgânicos permanecem e exame sobrenatural ainda pode revelar interferência.",
  },
  "oblivion-sight": {
    cost: "Gratuito",
    duration: "Até ser desativado",
    systemPtBr:
      "Permite enxergar em escuridão natural e sobrenatural e perceber espectros não ocultos. Os olhos assumem aspecto anormal enquanto o Poder está ativo.",
  },
  "oblivion-binding-fetter": {
    cost: "Gratuito",
    dicePool: "Raciocínio + Oblívio",
    difficulty: "Variável conforme a força do Grilhão",
    duration: "Uma cena",
    systemPtBr:
      "Identifica se pessoa, objeto ou lugar funciona como Grilhão de um espectro. Sucessos adicionais revelam intensidade, natureza e pistas sobre o morto ligado a ele.",
  },
  "oblivion-shadow-cloak": {
    cost: "Gratuito",
    duration: "Passiva",
    systemPtBr:
      "Soma dois dados a Furtividade e a Intimidação contra mortais quando sombras suficientes estão presentes ao redor do usuário.",
  },
  "oblivion-arms-ahriman": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Oblívio",
    duration: "Uma cena ou até os braços serem destruídos",
    restrictionsPtBr: "Exige Amálgama Potência 2.",
    systemPtBr:
      "Invoca tentáculos a partir de sombras visíveis. Eles atacam, agarram e imobilizam usando a parada do Poder, têm alcance sobrenatural e podem ser destruídos por dano e luz intensa.",
  },
  "oblivion-fatal-prediction": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Oblívio",
    duration: "Uma cena",
    systemPtBr:
      "Observa os sinais da morte ao redor de um alvo vivo. A margem indica proximidade, natureza provável e detalhes da ameaça, sem garantir futuro imutável.",
  },
  "oblivion-where-shroud-thins": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Oblívio",
    duration: "Uma cena",
    systemPtBr:
      "Mede a espessura do Véu numa área e identifica eventos, objetos ou ações que o enfraquecem. Sucessos indicam também como interagir com a fronteira dos mortos.",
  },
  "oblivion-shadow-cast": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Manifesta uma sombra sobrenatural independente da iluminação. Ela amplia alcance de outros Poderes de sombra e denuncia a natureza impossível do usuário a observadores atentos.",
  },
  "oblivion-aura-decay": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Acelera decomposição orgânica na proximidade: comida apodrece, plantas murcham e seres vivos sofrem enfraquecimento conforme exposição e resistência.",
  },
  "oblivion-passion-feast": {
    cost: "Gratuito",
    dicePool: "Determinação + Oblívio vs. Determinação + Autocontrole do espectro",
    duration: "Não aplicável",
    systemPtBr:
      "Devora a paixão que sustenta um espectro. Vitória causa dano Agravado de Força de Vontade e reduz a Fome do vampiro; o ato pode justificar Mácula.",
  },
  "oblivion-touch": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Força + Oblívio vs. Vigor + Ocultismo",
    duration: "Até o ferimento ser tratado",
    systemPtBr:
      "Um toque transmite necrose e causa dano Agravado a mortais ou dano Superficial não reduzido a vampiros, além de possíveis penalidades físicas conforme a margem.",
  },
  "oblivion-shadow-perspective": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Projeta visão e audição para uma sombra alcançável. O corpo fica vulnerável enquanto o usuário percebe do ponto escolhido e pode canalizar Poderes compatíveis por ele.",
  },
  "oblivion-shadow-servant": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Destaca a própria sombra e a anima como servo simples. Ela obedece comandos, interage fisicamente segundo o perfil catalogado e é vulnerável a luz intensa e dano.",
  },
  "oblivion-stygian-shroud": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Raciocínio + Oblívio",
    duration: "Uma cena",
    systemPtBr:
      "Cria área de escuridão sobrenatural que bloqueia visão comum, amortece som e sufoca mortais. Visão do Oblívio e efeitos equivalentes atravessam a mortalha.",
  },
  "oblivion-shadow-step": {
    cost: "Uma Checagem de Sangue",
    duration: "Um turno",
    systemPtBr:
      "Entra por uma sombra grande o bastante e emerge de outra visível dentro do alcance. Luz intensa, falta de conexão ou levar passageiro pode exigir teste ou custo adicional.",
  },
  "oblivion-necrotic-plague": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Determinação + Oblívio vs. Vigor + Medicina",
    duration: "Uma noite ou até tratamento bem-sucedido",
    restrictionsPtBr: "Afeta mortais vivos.",
    systemPtBr:
      "Infecta o alvo com necrose sobrenatural contagiosa. A margem determina gravidade, dano e dificuldade de tratamento; contato próximo pode espalhar a praga a outros mortais.",
  },
  "oblivion-tenebrous-avatar": {
    cost: "Duas Checagens de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Transforma o vampiro em sombra bidimensional, capaz de atravessar frestas e mover-se por superfícies. Somente fogo, luz solar e efeitos sobrenaturais adequados o ferem normalmente.",
  },
  "oblivion-skuld-fulfilled": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Determinação + Oblívio vs. Vigor + Determinação",
    duration: "Até o destino restaurado se cumprir ou o efeito terminar pela regra",
    restrictionsPtBr:
      "Afeta mortal vivo cuja morte ou ferimento grave foi anteriormente evitado.",
    systemPtBr:
      "Faz o corpo sofrer de uma vez a consequência física que o destino adiou. A margem define dano e manifestação; o efeito não inventa uma morte sem vínculo com o passado do alvo.",
  },
  "tba-far-reach": {
    cost: "Uma Checagem de Sangue, além da destilação",
    dicePool: "Determinação + Alquimia vs. Força + Atletismo quando resistido",
    duration: "Um turno, salvo se o efeito for sustentado",
    systemPtBr:
      "Move à distância objeto ou pessoa com até cerca de cem quilos a menos de dez metros. Arremessar alvo resistente causa dano Superficial igual à margem e o derruba; manter algo suspenso exige novo teste por turno.",
  },
  "tba-haze": {
    cost: "Uma Checagem de Sangue, além da destilação",
    duration: "Uma cena ou até ser encerrada",
    systemPtBr:
      "Uma névoa acompanha o alquimista e impõe dois dados de penalidade para identificá-lo ou atingi-lo à distância. Outra Checagem de Sangue amplia a cobertura para até cinco pessoas.",
  },
  "tba-profane-hieros-gamos": {
    cost: "Custo normal de destilação",
    duration: "Permanente até nova aplicação",
    systemPtBr:
      "Remodela o corpo do alquimista durante o sono diurno para a configuração sexual e corporal preparada pela fórmula. A mudança é física e completa, não uma ilusão.",
  },
  "tba-mercurian-tongue": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma noite ou até mudar o idioma pela alimentação",
    systemPtBr:
      "Concede o idioma nativo do mortal usado na fórmula. Gastar um ponto de Força de Vontade ao alimentar-se permite substituir o idioma pelo da nova presa.",
  },
  "tba-plug-in": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Determinação + Alquimia",
    difficulty: "2",
    duration: "Uma cena para iluminação; até metade da carga de um dispositivo",
    systemPtBr:
      "Produz corrente elétrica pelo toque, suficiente para alimentar pequenos dispositivos, um computador pessoal ou uma lâmpada. A energia cessa quando o contato é interrompido.",
  },
  "tba-envelop": {
    cost: "Uma Checagem de Sangue, além da destilação",
    dicePool: "Raciocínio + Alquimia vs. Vigor + Sobrevivência",
    duration: "Até o fim da cena ou encerramento voluntário",
    systemPtBr:
      "Névoa envolve um único alvo e impõe três dados de penalidade à detecção visual e ataques à distância. Contra mortal, uma vitória o deixa apenas tossindo; vitória crítica o deixa inconsciente.",
  },
  "tba-friends-list": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Alquimia",
    duration: "Uma cena",
    systemPtBr:
      "Mostra fios prateados entre um mortal e os vampiros com quem mantém vínculos. Relações mais fracas exigem mais sucessos; sucessos adicionais revelam conexões secundárias.",
  },
  "tba-defractionate": {
    cost: "Custo normal de destilação",
    duration: "Até o sangue preparado ser consumido ou deteriorar",
    systemPtBr:
      "Cada sucesso da destilação produz elixir suficiente para tornar uma bolsa de sangue fracionado novamente nutritiva, saciando um ponto de Fome quando consumida.",
  },
  "tba-mandragloire": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Vigor + Alquimia vs. Vigor + Determinação",
    duration: "Três turnos",
    systemPtBr:
      "Libera gás paralisante em um cômodo. Mortais derrotados ficam em coma desperto pelo restante da cena; criaturas sobrenaturais sofrem dois dados de penalidade em testes físicos.",
  },
  "tba-tank": {
    cost: "Uma Checagem de Sangue",
    duration: "Até sofrer dano ou a cena terminar",
    systemPtBr:
      "Na primeira vez em que o alquimista sofrer dano na cena, reduz o total em cinco níveis; a fórmula então se encerra.",
  },
  "tba-airborne-momentum": {
    cost: "Uma Checagem de Sangue, além da destilação",
    dicePool: "Força + Alquimia vs. Força + Atletismo quando resistido",
    duration: "Uma cena",
    systemPtBr:
      "Permite voar em qualquer direção à velocidade de corrida. Carregar massa humana reduz a velocidade; agarrar alvo relutante ou impedir o voo exige a disputa indicada.",
  },
  "tba-short-circuit": {
    cost: "Uma Checagem de Sangue",
    duration: "Não aplicável",
    systemPtBr:
      "Ao tocar o aparelho ou metal conectado, causa silenciosamente curto-circuito em baterias, fusíveis e equipamentos elétricos, com escala limitada pela conexão física alcançada.",
  },
  "tba-rumor": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Alquimia vs. Raciocínio + Percepção",
    duration: "Uma cena e depois até contradição convincente",
    systemPtBr:
      "Faz o alvo concordar com uma afirmação e acreditar que decidiu por vontade própria. A margem pode favorecer um teste social posterior para levá-lo a agir conforme o acordo.",
  },
  "tba-toxic-personality": {
    cost: "Uma Checagem de Sangue; outra para projetar a bile à distância",
    dicePool: "Força ou Destreza + Alquimia vs. Destreza + Atletismo",
    duration: "Uma cena",
    systemPtBr:
      "Secreta bile corrosiva que destrói materiais e soma dois ao dano de Briga. Projetá-la causa dano Superficial igual à margem mais três, Agravado contra mortais.",
  },
  "tba-awaken-sleeper": {
    cost: "Custo normal de destilação",
    duration: "Não aplicável",
    systemPtBr:
      "Misturado a sangue humano, o elixir desperta vampiro em torpor se sua Potência do Sangue não exceder os sucessos da destilação menos dois.",
  },
  "tba-moment-clarity": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    systemPtBr:
      "Soma quatro dados a paradas Mentais de Habilidade ou Disciplina e a resistências mentais contra Disciplinas. Também impede críticos bestiais e frenesi enquanto durar.",
  },
  "tba-blooming-amaranth": {
    cost: "Uma Checagem de Sangue por participante",
    dicePool: "Determinação + Alquimia vs. Força de Vontade + Potência do Sangue",
    duration:
      "Permanente para a Disciplina adquirida; demais consequências seguem a diablerie",
    restrictionsPtBr:
      "Até três Sangues-Ralos contra um vampiro de sangue completo contido.",
    systemPtBr:
      "Em vitória, os participantes ganham um ponto aleatório em uma Disciplina do Clã do alvo; vitória crítica permite escolher. Não podem elevar essa Disciplina além de um ponto e sofrem as consequências previstas da diablerie.",
  },
};

/**
 * Auditoria mecânica da etapa atual. Estes registros são paráfrases normativas
 * conservadoras: preservam cada operação da regra sem reproduzir a prosa editorial.
 */
const POWER_RULE_AUDIT_OVERRIDES: Readonly<Record<string, PowerMechanics>> = {
  "auspex-heightened-senses": {
    cost: "Gratuito, salvo a possível exigência de Força de Vontade descrita no Sistema",
    dicePool: "Raciocínio + Determinação",
    difficulty: "3 ou mais contra sobrecarga sensorial, conforme a intensidade",
    duration: "Até ser desativado",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "Enquanto o Poder estiver ativo, some o nível de Auspícios do usuário a todas as paradas de percepção.",
      "Se o usuário for exposto a um estímulo extremo, teste Raciocínio + Determinação na Dificuldade 3 ou maior para reduzir os sentidos a tempo.",
      "Em caso de falha nesse teste, o usuário sofre uma penalidade de três dados em todas as paradas baseadas em percepção pelo restante da cena.",
      "Manter o Poder ativo por mais de uma cena sem descanso, especialmente em ambiente de estímulos intensos, pode exigir gasto de Força de Vontade a critério do Narrador.",
    ],
  },
  "auspex-sense-the-unseen": {
    cost: "Gratuito",
    dicePool: "Raciocínio + Auspícios ou Determinação + Auspícios",
    duration: "Passiva",
    targetPtBr: "Presença ou efeito sobrenatural oculto",
    systemStepsPtBr: [
      "Quando algo sobrenatural estiver oculto à vista, o Narrador faz em segredo um teste de Raciocínio + Auspícios contra uma Dificuldade definida por ele.",
      "Se uma entidade estiver se ocultando ativamente, resolva uma disputa contra a parada pertinente do alvo; para perceber Ofuscação, por exemplo, use Raciocínio + Auspícios contra Raciocínio + Ofuscação.",
      "Quando o usuário procurar ativamente uma entidade sobrenatural escondida, use Determinação + Auspícios e resolva da mesma forma.",
    ],
  },
  "auspex-premonition": {
    cost: "Gratuito quando espontâneo; uma Checagem de Sangue para provocar a visão",
    dicePool: "Determinação + Auspícios",
    duration: "Passiva",
    targetPtBr: "Um assunto no qual o usuário se concentra, quando a visão é provocada",
    systemStepsPtBr: [
      "Quando considerar apropriado, o Narrador pode fornecer ao personagem um indício repentino que revele uma pista ignorada, antecipe perigo ou mova a situação adiante. O limite sugerido é uma premonição por cena, mesmo que mais de um personagem possua o Poder.",
      "Para provocar uma premonição, o usuário se concentra em um assunto, faz uma Checagem de Sangue e testa Determinação + Auspícios.",
      "A quantidade de sucessos determina se existe informação e qual é o grau de compreensão obtido sobre o assunto.",
    ],
  },
  "auspex-panacea": {
    activationPtBr: "Um turno completo; uma cena inteira reduz a Dificuldade para 0",
    cost: "Uma Checagem de Sangue; dano Superficial de Força de Vontade ao tratar alvos adicionais na mesma noite",
    dicePool: "Autocontrole + Auspícios",
    difficulty: "2; 0 quando o tratamento ocupa uma cena inteira",
    duration: "Não aplicável",
    targetPtBr: "Outro indivíduo; nunca o próprio usuário",
    conditionsPtBr: ["Cada alvo pode receber Panaceia somente uma vez por noite."],
    systemStepsPtBr: [
      "Teste Autocontrole + Auspícios. Em uma vitória, restaure dano Superficial de Força de Vontade do alvo igual à margem; como alternativa, restaure um nível de dano Agravado de Força de Vontade para cada três sucessos da margem.",
      "Quando usado com sucesso em um mortal emocionalmente perturbado, o Poder também o acalma ou o deixa à vontade.",
      "Para cada alvo depois do primeiro na mesma noite, o usuário sofre dano Superficial de Força de Vontade igual à metade dos sucessos obtidos na margem do teste daquele alvo.",
    ],
  },
  "auspex-scry-the-soul": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    difficulty:
      "Em varredura de multidão, definida pelo tamanho, distrações e traço procurado; os exemplos normativos vão de 3 a 6 ou mais",
    duration: "Um turno ou a critério do Narrador",
    targetPtBr:
      "Um indivíduo observado ou uma multidão examinada em busca de um traço específico",
    systemStepsPtBr: [
      "Contra um indivíduo, dispute Inteligência + Auspícios contra Autocontrole + Subterfúgio. Em uma vitória, o Narrador responde com veracidade a perguntas sobre aura e psique em quantidade igual à margem.",
      "As perguntas podem determinar o estado emocional, a Ressonância do sangue, a natureza sobrenatural, a influência de Feitiçaria de Sangue ou outra magia e a prática de diablerie no último ano.",
      "Uma vitória crítica revela também um fato inesperado definido pelo Narrador.",
      "Ao examinar uma multidão, o teste apenas identifica a presença do traço procurado e não fornece as demais informações; use a Dificuldade estabelecida pelas condições da busca.",
    ],
  },
  "auspex-share-the-senses": {
    cost: "Uma Checagem de Sangue",
    dicePool:
      "Determinação + Auspícios; Raciocínio + Determinação vs. Raciocínio + Determinação para expulsar um intruso",
    difficulty:
      "3, aumentada por distração, distância e outros fatores, inclusive a quantidade de Sangue do usuário ainda presente no alvo",
    duration: "Uma cena",
    rangePtBr:
      "Linha de visão para iniciar em um desconhecido; distância maior é possível quando o alvo ainda contém Sangue do usuário",
    targetPtBr: "Um mortal ou vampiro",
    systemStepsPtBr: [
      "Teste Determinação + Auspícios e escolha receber um, alguns ou todos os sentidos do alvo. O usuário conserva também os próprios sentidos e continua ciente de seu entorno.",
      "O alvo normalmente não percebe a intrusão, mas Sentir o Invisível pode detectá-la.",
      "Para expulsar um usuário indesejado, a vítima precisa vencê-lo numa disputa de Raciocínio + Determinação contra Raciocínio + Determinação.",
      "Se for expulso dessa forma, o usuário não pode tentar Compartilhar os Sentidos com aquela vítima novamente até a noite seguinte.",
    ],
  },
  "auspex-reveal-temper": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Uma cena",
    targetPtBr: "Um mortal ou vampiro observado",
    systemStepsPtBr: [
      "Em uma vitória contra um mortal, revele sua Ressonância e particularidades do sangue, inclusive Discrasias.",
      "Em uma vitória crítica contra um mortal, o usuário também recebe dois dados em interações com o alvo durante a cena.",
      "Em uma vitória contra um vampiro, revele a Ressonância do último mortal do qual ele se alimentou. Em uma vitória crítica, revele também uma impressão mais detalhada do recipiente no momento da alimentação, incluindo o método e o Tipo de Predador do vampiro.",
    ],
  },
  "auspex-fatal-flaw": {
    activationPtBr: "Um turno de observação atenta",
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios vs. Autocontrole ou Vigor + Subterfúgio",
    duration: "Uma cena",
    targetPtBr: "Um indivíduo observado",
    systemStepsPtBr: [
      "Depois de observar o alvo por um turno, escolha procurar uma fraqueza mental ou física e dispute Inteligência + Auspícios contra Autocontrole + Subterfúgio ou Vigor + Subterfúgio, respectivamente.",
      "Em uma vitória, revele a menor parada defensiva do alvo na categoria examinada e conceda ao usuário dois dados em ataques contra essa parada durante a cena.",
      "Se o usuário comunicar a fraqueza a outra pessoa, essa pessoa recebe um dado ao explorá-la.",
    ],
  },
  "auspex-spirits-touch": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios",
    difficulty:
      "Conforme a informação procurada; 3 para impressão recente e intensa, aproximando-se de 6 ou mais para rastros antigos e contextuais",
    duration: "Um turno",
    targetPtBr: "Um objeto inanimado tocado ou o solo de um local",
    systemStepsPtBr: [
      "Teste Inteligência + Auspícios contra a Dificuldade estabelecida pela idade, intensidade e natureza da informação procurada.",
      "Uma vitória revela resíduos emocionais e circunstâncias ligados ao manipulador ou visitante mais recente pertinente.",
      "Cada ponto de margem permite perceber aproximadamente um manipulador anterior e seu conjunto de circunstâncias, retrocedendo do mais recente para os mais antigos.",
    ],
  },
  "auspex-clairvoyance": {
    activationPtBr: "Alguns minutos de concentração para reunir informações",
    cost: "Uma Checagem de Sangue",
    dicePool: "Inteligência + Auspícios",
    difficulty:
      "Conforme segurança e atividade da área; 3 no próprio refúgio e 7 ou mais em quarteirão urbano desconhecido e movimentado",
    duration: "Alguns minutos para obter informações; até uma noite para vigilância",
    rangePtBr:
      "Aproximadamente um quarteirão, ampliado em áreas externas ou pouco povoadas",
    targetPtBr: "A área ao redor do usuário",
    systemStepsPtBr: [
      "Teste Inteligência + Auspícios. No próprio refúgio, some à parada o nível-base do Refúgio.",
      "O Narrador responde a perguntas sobre entradas e saídas, o que pessoas viram ou ouviram, rumores locais e choques ou impressões recentes. O jogador faz aproximadamente uma pergunta por ponto de margem; informação deliberadamente escondida pode consumir mais de um ponto.",
      "Uma vitória crítica revela um fato importante independentemente das perguntas, se houver algo relevante a descobrir.",
      "O usuário também pode vigiar acontecimentos em andamento, mas precisa permanecer na área enquanto mantiver a vigilância.",
    ],
  },
  "auspex-possession": {
    activationPtBr: "Contato visual seguido da disputa de ativação",
    cost: "Duas Checagens de Sangue",
    dicePool: "Determinação + Auspícios vs. Determinação + Inteligência",
    difficulty:
      "2 + dano Agravado sofrido pelo hospedeiro para conservar o controle após o ferimento",
    duration: "Até terminar voluntária ou involuntariamente",
    targetPtBr:
      "Um mortal; se for carniçal, ele precisa possuir Laço de Sangue com o usuário",
    systemStepsPtBr: [
      "Após estabelecer contato visual, dispute Determinação + Auspícios contra Determinação + Inteligência. Uma falha total torna o alvo imune a novas tentativas de Possessão do usuário pelo restante da história.",
      "Durante a possessão, o corpo do usuário entra num transe semelhante ao torpor, inconsciente do ambiente e de sua condição física, exceto por dano Agravado; esse dano rompe o transe e encerra o Poder.",
      "O usuário pode empregar Auspícios, Presença e Dominação através do hospedeiro. Para permanecer durante o dia, precisa vencer o teste para ficar acordado; uma falha encerra o Poder.",
      "Quando o hospedeiro sofre dano Agravado, teste Determinação + Auspícios na Dificuldade 2 + dano sofrido para conservar o controle. Se o hospedeiro morrer, o usuário sofre imediatamente três níveis de dano Agravado de Força de Vontade.",
      "O Poder não lê a mente nem concede Habilidades ou maneiras do hospedeiro: use as Habilidades do usuário. Para imitar comportamento, expressões e maneirismos, dispute Manipulação + Performance contra Raciocínio + Sagacidade.",
      "A violação causada pela Possessão pode justificar Máculas, a critério do Narrador.",
    ],
  },
  "auspex-telepathy": {
    cost: "Uma Checagem de Sangue; mais um ponto de Força de Vontade contra vampiro não consentinte",
    dicePool: "Determinação + Auspícios vs. Raciocínio + Subterfúgio",
    duration:
      "Aproximadamente um minuto por Checagem de Sangue; uma cena inteira com alvo consentinte",
    rangePtBr: "Linha de visão",
    targetPtBr: "Um mortal ou vampiro",
    systemStepsPtBr: [
      "Projetar pensamentos em outra mente não exige teste, mas requer linha de visão.",
      "Para ler um mortal não consentinte em linha de visão, encare seus olhos e dispute Determinação + Auspícios contra Raciocínio + Subterfúgio. Um mortal consentinte não exige teste.",
      "Uma vitória revela pensamentos superficiais como fluxo de imagens; margens maiores permitem buscar lembranças mais distantes ou enterradas. Uma vitória crítica fornece um quadro coerente dos pensamentos e intenções atuais.",
      "Para ler um vampiro não consentinte, gaste um ponto de Força de Vontade antes da disputa.",
    ],
  },
  "auspex-unburdening-bestial-soul": {
    activationPtBr: "Uma cena em reclusão com o alvo",
    cost: "Duas Checagens de Sangue e uma Mácula para o usuário",
    dicePool: "Autocontrole + Auspícios vs. Humanidade do alvo",
    duration: "Uma sessão",
    targetPtBr: "Um vampiro com Humanidade igual ou inferior à do usuário",
    conditionsPtBr: [
      "Falha automaticamente se o alvo possuir Humanidade superior à do usuário.",
      "Um vampiro só pode recuperar Humanidade por este Poder uma única vez em toda a existência.",
    ],
    systemStepsPtBr: [
      "Para cada sucesso da margem, remova uma Mácula do alvo ou crie um escudo psicológico que cancele uma Mácula adquirida posteriormente na mesma sessão.",
      "Em uma vitória crítica, o usuário pode renunciar a todos os benefícios anteriores para restaurar um ponto de Humanidade do alvo.",
      "Pelo restante da sessão, o alvo fica entorpecido e qualquer Poder de Dominação usado nele pelo usuário é automaticamente bem-sucedido, sem contato visual.",
      "Ao terminar o Poder, escudos não utilizados são perdidos; Máculas removidas e Humanidade restaurada não retornam.",
    ],
  },
  "celerity-cats-grace": {
    cost: "Gratuito",
    duration: "Passiva",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "O usuário passa automaticamente em qualquer teste baseado em Destreza ou Atletismo exigido para manter o equilíbrio.",
      "O Poder não permite equilibrar-se sobre um apoio incapaz de sustentar o peso do usuário.",
    ],
  },
  "celerity-rapid-reflexes": {
    cost: "Gratuito",
    duration: "Passiva",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "O usuário não sofre penalidade em paradas de defesa pela ausência de cobertura contra ataques com Armas de Fogo.",
      "Uma vez por turno, ele pode executar gratuitamente uma ação menor que valha até dois dados, como preparar ou recarregar uma arma.",
    ],
  },
  "celerity-fleetness": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "Some o nível de Celeridade do usuário às paradas de testes de Destreza fora de combate.",
      "Uma vez por turno, o usuário também pode somar Celeridade quando se defender com Destreza + Atletismo.",
    ],
  },
  "celerity-russian-work": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    targetPtBr: "O próprio usuário",
    restrictionsPtBr: "Não acelera ataques, defesas nem tarefas ativamente resistidas.",
    systemStepsPtBr: [
      "Tarefas ligadas a Habilidades que normalmente consumiriam turnos inteiros podem ser concluídas em poucos segundos.",
      "O usuário pode tratar uma ação completa desse tipo como ação menor. A penalidade normal da ação menor continua aplicável à ação principal executada no mesmo turno.",
    ],
  },
  "celerity-blink": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Destreza + Atletismo ou a parada pertinente à disputa",
    duration: "Um turno",
    rangePtBr: "Menos de 50 metros em linha reta",
    targetPtBr: "Um ponto, pessoa, objeto ou ação ao fim do deslocamento",
    systemStepsPtBr: [
      "O usuário percorre em linha reta qualquer distância inferior a 50 metros e ainda executa uma ação durante o turno.",
      "Se o terreno for perigoso, teste Destreza + Atletismo para evitar tropeçar e parar no caminho. O Narrador pode exigir outras disputas, especialmente quando o usuário corre contra alguém para alcançar um objeto ou executar uma ação.",
      "Ao engajar um oponente com este Poder, trate o usuário como já engajado desde o início do turno.",
    ],
  },
  "celerity-traversal": {
    cost: "Uma Checagem de Sangue",
    dicePool: "Destreza + Atletismo",
    difficulty:
      "3 em superfície inclinada com tração até 6 em superfície vertical escorregadia ou água aberta",
    duration: "Um turno",
    rangePtBr:
      "Definido pela margem; como referência, mais de 60 metros sobre água ou mais de 30 andares de subida costuma exceder o alcance",
    targetPtBr: "Uma rota contínua pela superfície escolhida",
    systemStepsPtBr: [
      "Teste Destreza + Atletismo contra a Dificuldade definida pela superfície e inclinação.",
      "Cada ponto de margem aumenta a distância alcançada: margem 0 alcança um alvo próximo, margem 1 o próximo patamar de distância e assim por diante.",
      "O Narrador deve avisar antes do teste quando o destino estiver além do alcance possível do Poder.",
    ],
  },
  "celerity-weaving": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "O usuário não sofre redução de parada ao se defender de múltiplos ataques à distância com Destreza + Atletismo.",
      "Enquanto o Poder estiver ativo, some o nível de Celeridade a todas essas defesas.",
    ],
  },
  "celerity-draught-of-elegance": {
    cost: "Uma Checagem de Sangue em vitae bebida diretamente do doador",
    duration:
      "Uma noite; para vampiros, até a próxima alimentação ou até alcançar Fome 5",
    targetPtBr: "Quem beber a vitae diretamente do usuário",
    systemStepsPtBr: [
      "O alvo recebe Celeridade temporária igual à metade do nível de Celeridade do doador, arredondada para baixo.",
      "Ele também recebe os mesmos Poderes sem Amálgama que o doador possua, limitados ao nível temporário concedido.",
    ],
  },
  "celerity-unerring-aim": {
    activationPtBr: "Antes de realizar um ataque à distância",
    cost: "Uma Checagem de Sangue",
    difficulty: "1 para o ataque",
    duration: "Um único ataque",
    targetPtBr: "O alvo do ataque à distância",
    systemStepsPtBr: [
      "O alvo não faz teste para esquivar ou se defender; resolva o ataque na Dificuldade 1.",
      "Um alvo com Celeridade 5 pode fazer uma Checagem de Sangue para anular o Poder e se defender normalmente, na mesma velocidade.",
    ],
  },
  "celerity-blurred-momentum": {
    cost: "Uma Checagem de Sangue para ativar e outra a cada turno adicional",
    duration: "Até o usuário deixar o efeito expirar",
    targetPtBr: "O próprio usuário",
    systemStepsPtBr: [
      "Todo ataque que obtenha menos sucessos que o nível de Celeridade do usuário erra, independentemente do resultado de eventual defesa ou esquiva.",
      "A proteção também se aplica a ataques surpresa e a ataques que normalmente não permitem defesa, como Golpe Relâmpago.",
    ],
  },
  "celerity-lightning-strike": {
    activationPtBr: "Antes de um ataque de Briga ou Armas Brancas",
    cost: "Uma Checagem de Sangue",
    difficulty: "1 para o ataque",
    duration: "Um único ataque",
    targetPtBr: "O alvo do ataque corpo a corpo",
    systemStepsPtBr: [
      "O alvo não faz teste para esquivar ou se defender; resolva o ataque na Dificuldade 1.",
      "Um alvo com Celeridade 5 pode fazer uma Checagem de Sangue para anular o Poder e se defender normalmente, na mesma velocidade.",
    ],
  },
  "celerity-split-second": {
    cost: "Uma Checagem de Sangue",
    duration: "Aproximadamente uma ação, conforme decisão do Narrador",
    targetPtBr: "O próprio usuário e o acontecimento no qual ele intervém",
    systemStepsPtBr: [
      "Dentro do razoável, o jogador pode sobrepor a narração do Narrador para declarar uma reação antes que o acontecimento em curso se complete.",
      "A ação precisa caber em poucos segundos de tempo real e não pode desfazer algo já resolvido.",
      "O Narrador determina quais Habilidades, se houver, precisam ser testadas para concluir a ação iniciada com o Poder.",
    ],
  },
  "celerity-unseen-strike": {
    activationPtBr: "Ao combinar Piscar com um ataque",
    cost: "Duas Checagens de Sangue",
    dicePool: "Destreza + Celeridade vs. Raciocínio + Percepção",
    difficulty: "1 para o ataque surpresa quando o alvo perde a disputa",
    duration: "Um turno",
    rangePtBr: "O mesmo alcance e as mesmas restrições de deslocamento de Piscar",
    targetPtBr: "Um alvo ao fim do deslocamento",
    systemStepsPtBr: [
      "Dispute Destreza + Celeridade contra Raciocínio + Percepção do alvo.",
      "Se o alvo perder, ele não pode se defender e o ataque é resolvido na Dificuldade 1.",
      "Se o usuário perder, ainda realiza um ataque regular conforme Piscar. Todas as restrições de movimento de Piscar continuam aplicáveis.",
    ],
  },
  "presence-awe": {
    cost: "Gratuito",
    dicePool:
      "Manipulação + Presença vs. Autocontrole + Inteligência quando houver resistência consciente",
    duration: "Uma cena ou até ser encerrado voluntariamente",
    targetPtBr: "Pessoas que percebam o usuário",
    systemStepsPtBr: [
      "Some o nível de Presença do usuário a testes de Persuasão e Performance e, a critério do Narrador, a outros testes ligados a Carisma.",
      "Quem souber que está sendo afetado pode resistir numa disputa de Autocontrole + Inteligência contra Manipulação + Presença. Uma vitória permite resistir pela cena; uma vitória crítica concede imunidade pelo restante da noite.",
      "Quando o Poder termina, as vítimas retornam às opiniões que possuíam antes de serem influenciadas.",
    ],
  },
  "presence-daunt": {
    cost: "Gratuito",
    dicePool: "Determinação + Autocontrole para atacar o usuário",
    difficulty: "2 para atacar o usuário",
    duration: "Uma cena ou até ser encerrado voluntariamente",
    targetPtBr: "Pessoas na presença do usuário",
    conditionsPtBr: ["Fascínio e Amedrontar não podem permanecer ativos ao mesmo tempo."],
    systemStepsPtBr: [
      "Some o nível de Presença do usuário a todos os testes de Intimidação.",
      "Para atacar o usuário, um personagem precisa vencer um teste de Determinação + Autocontrole na Dificuldade 2.",
    ],
  },
  "presence-serpents-eyes": {
    activationPtBr: "Capturar e manter a atenção do alvo pelo olhar",
    cost: "Gratuito",
    dicePool: "Carisma + Presença vs. Raciocínio + Autocontrole contra vampiros",
    duration: "Até o contato visual ser rompido ou a cena terminar",
    targetPtBr: "Um mortal ou vampiro por vez",
    systemStepsPtBr: [
      "Depois de capturar a atenção de um mortal, o usuário o imobiliza enquanto mantiver contato visual. O efeito termina se a vítima sofrer dano ou for removida à força; ela ainda pode falar, mas não gritar.",
      "Contra um vampiro, o usuário precisa vencer a disputa indicada. A partir do turno posterior ao primeiro, a vítima vampira pode gastar um ponto de Força de Vontade para encerrar a paralisia.",
    ],
  },
  "presence-lingering-kiss": {
    activationPtBr: "Escolhido durante cada alimentação em um mortal",
    cost: "Gratuito",
    difficulty: "Nível de Presença do usuário no teste semanal da vítima",
    duration: "Até a vítima resistir com sucesso",
    targetPtBr: "Um mortal do qual o usuário se alimenta",
    systemStepsPtBr: [
      "Após a alimentação, some dados iguais ao nível de Presença do usuário às futuras paradas assistidas por Carisma contra o mortal afetado.",
      "Uma vez por semana, o mortal pode testar Força de Vontade contra Dificuldade igual à Presença do usuário.",
      "Três vitórias semanais consecutivas encerram o efeito; uma única vitória crítica também o encerra.",
    ],
  },
  "presence-melpominee": {
    cost: "Gratuito",
    duration: "Conforme o Poder de Presença transmitido",
    rangePtBr: "Alcance da voz ao vivo",
    targetPtBr: "Quem puder ouvir diretamente a voz do usuário",
    systemStepsPtBr: [
      "O usuário pode aplicar Fascínio, Amedrontar, Olhar Aterrorizante, Transe e Majestade apenas pela voz.",
      "Usuário e alvo não precisam se ver nem compartilhar o mesmo espaço imediato, desde que o alvo ouça a voz diretamente.",
      "Gravações e transmissões eletrônicas não preservam este efeito.",
    ],
  },
  "presence-thrown-voice": {
    cost: "Uma Checagem de Sangue",
    duration: "Uma cena",
    rangePtBr: "Qualquer ponto que o usuário consiga ver",
    targetPtBr: "Um ponto visível escolhido como origem aparente da voz",
    systemStepsPtBr: [
      "A voz do usuário passa a emanar do ponto escolhido e é ouvida com a intensidade empregada, dentro do alcance normal daquela voz.",
      "Nenhum teste é exigido além da Checagem de Sangue. Ao combinar com Voz Irresistível, Melpominê ou Poder semelhante, faça normalmente os testes exigidos pelo outro Poder.",
      "A voz pode ser deixada no local escolhido e continuar transmitindo o efeito aplicável durante a duração.",
    ],
  },
  "presence-dread-gaze": {
    activationPtBr: "Exibir a natureza vampírica e concentrá-la em um alvo",
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Um turno",
    targetPtBr: "Um indivíduo",
    systemStepsPtBr: [
      "Em uma falha do usuário, um mortal não pode agir além de se defender e recua durante um turno; um vampiro não é afetado.",
      "Em uma vitória, um mortal foge de medo. Um vampiro não pode agir além de se defender durante um turno, salvo se gastar Força de Vontade igual à margem do usuário, com mínimo de um ponto.",
      "Em uma vitória crítica, um mortal congela ou se encolhe incapaz de agir. Um vampiro testa frenesi de terror na Dificuldade 3; mesmo vencendo, ainda sofre o efeito normal de uma vitória.",
    ],
  },
  "presence-entrancement": {
    activationPtBr: "Obter a atenção do alvo e vencer a disputa",
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Raciocínio",
    duration: "Uma hora, mais uma hora por ponto de margem",
    targetPtBr: "Um indivíduo",
    systemStepsPtBr: [
      "Após uma vitória, some o nível de Presença do usuário a todas as paradas Sociais contra o alvo afetado.",
      "O efeito pode ser renovado, mas uma falha na renovação o encerra e torna o alvo imune pelo restante da noite.",
      "Pedidos que causem dano evidente ao alvo ou a pessoas queridas, ou contrariem suas Convicções, falham e exigem imediatamente uma nova disputa; se o usuário não vencer, Transe termina.",
    ],
  },
  "presence-irresistible-voice": {
    cost: "Nenhum custo adicional",
    duration: "Passiva",
    rangePtBr: "Alcance direto da voz",
    targetPtBr: "Um alvo que ouça diretamente o usuário",
    restrictionsPtBr:
      "Não funciona através de telefone, televisão, interfone ou outro meio eletrônico.",
    systemStepsPtBr: [
      "A voz do usuário basta para aplicar Poderes de Dominação; não é necessário contato visual.",
      "Todas as demais exigências e limitações do Poder de Dominação usado continuam válidas.",
    ],
  },
  "presence-summon": {
    activationPtBr: "Cinco minutos de concentração pensando no alvo",
    cost: "Uma Checagem de Sangue",
    dicePool: "Manipulação + Presença vs. Autocontrole + Inteligência",
    duration: "Uma noite",
    targetPtBr:
      "Alguém previamente afetado por Fascínio, Transe ou Majestade, ou que tenha provado o Sangue do usuário",
    systemStepsPtBr: [
      "Em uma vitória, o alvo percebe quem o convoca e a localização atual do usuário, mas ainda pode decidir não atender.",
      "Em uma vitória crítica, o alvo procura chegar o mais rápido possível, salvo risco imediato ao próprio bem-estar.",
      "A atração não obriga o alvo a causar prejuízo físico ou financeiro grave; o Poder pode ser repetido em noites posteriores se a distância ou relutância impedir a chegada.",
    ],
  },
  "presence-blow-edifice": {
    activationPtBr: "Ativar Fascínio, Amedrontar ou Majestade enquanto estiver no local",
    cost: "Nenhum custo adicional além do Poder transmitido",
    dicePool: "A mesma parada do Poder de Presença transmitido",
    duration: "A mesma duração do Poder transmitido",
    rangePtBr: "Todo o edifício ou local semelhante e sua aparência externa",
    targetPtBr: "Pessoas dentro do local ou que o observem de fora",
    systemStepsPtBr: [
      "Quem estiver no edifício ou o enxergar de fora resiste ao Poder transmitido como se o usuário estivesse presente.",
      "Se o usuário estiver no campo de visão, ele próprio volta a ser o foco do efeito.",
      "Quando um bônus precisaria ser aplicado a uma parada de Habilidade, aplique-o à reação pertinente que a vítima tenha ao local, pois o edifício não faz testes.",
    ],
  },
  "presence-majesty": {
    cost: "Duas Checagens de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Uma cena",
    targetPtBr: "Pessoas na presença do usuário",
    systemStepsPtBr: [
      "Quem percebe o usuário só consegue observá-lo ou desviar os olhos em medo ou submissão.",
      "Para agir em oposição ao usuário, salvo por autopreservação, o alvo precisa vencer Autocontrole + Determinação contra Carisma + Presença.",
      "Uma vitória concede liberdade por um turno, mais um turno por ponto de margem. Apenas uma vitória crítica permite resistir por toda a cena.",
    ],
  },
  "presence-star-magnetism": {
    cost: "Uma Checagem de Sangue adicional ao Poder transmitido",
    duration: "A mesma duração do Poder transmitido",
    rangePtBr: "Transmissão ao vivo por tela ou telefone",
    targetPtBr: "Pessoas que vejam ou ouçam a transmissão ao vivo",
    restrictionsPtBr: "Imagens, áudios e mensagens gravados não preservam o efeito.",
    systemStepsPtBr: [
      "Fascínio, Amedrontar e Transe podem ser transmitidos ao vivo por telas ou telefones.",
      "Ao usar Transe, o nome da vítima precisa ser pronunciado claramente, pois esse Poder afeta uma pessoa por vez.",
      "Outras pessoas que acompanhem a mesma transmissão acham o usuário atraente, mas não sofrem influência sobrenatural de Transe.",
    ],
  },
};

const POWER_REQUIREMENTS: Readonly<
  Record<
    string,
    {
      readonly amalgamRequirements?: DisciplinePowerCatalogItemView["amalgamRequirements"];
      readonly prerequisites?: readonly DisciplinePowerId[];
      readonly prerequisitePowerOptions?: readonly (readonly DisciplinePowerId[])[];
    }
  >
> = {
  "animalism-animal-messenger": {
    amalgamRequirements: [{ disciplineId: "discipline:auspex", rating: 1 }],
  },
  "animalism-messengers-command": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 1 }],
    prerequisites: ["power:animalism-animal-messenger"],
    prerequisitePowerOptions: [["power:dominate-compel", "power:dominate-mesmerize"]],
  },
  "animalism-unliving-hive": {
    amalgamRequirements: [{ disciplineId: "discipline:obfuscate", rating: 2 }],
  },
  "auspex-fatal-flaw": {
    amalgamRequirements: [{ disciplineId: "discipline:oblivion", rating: 1 }],
  },
  "auspex-panacea": {
    amalgamRequirements: [{ disciplineId: "discipline:fortitude", rating: 1 }],
  },
  "auspex-possession": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 3 }],
  },
  "auspex-unburdening-bestial-soul": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 3 }],
    prerequisites: ["power:auspex-panacea"],
  },
  "celerity-unerring-aim": {
    amalgamRequirements: [{ disciplineId: "discipline:auspex", rating: 2 }],
  },
  "celerity-weaving": {
    prerequisites: ["power:celerity-rapid-reflexes"],
  },
  "celerity-unseen-strike": {
    amalgamRequirements: [{ disciplineId: "discipline:obfuscate", rating: 4 }],
    prerequisites: ["power:celerity-blink"],
  },
  "dominate-dementation": {
    amalgamRequirements: [{ disciplineId: "discipline:obfuscate", rating: 2 }],
  },
  "dominate-slavish-devotion": {
    amalgamRequirements: [{ disciplineId: "discipline:fortitude", rating: 1 }],
  },
  "dominate-implant-suggestion": {
    amalgamRequirements: [{ disciplineId: "discipline:presence", rating: 1 }],
  },
  "dominate-ancestral-dominion": {
    amalgamRequirements: [{ disciplineId: "discipline:blood-sorcery", rating: 2 }],
    prerequisites: ["power:dominate-mesmerize"],
  },
  "fortitude-enduring-beasts": {
    amalgamRequirements: [{ disciplineId: "discipline:animalism", rating: 1 }],
  },
  "fortitude-valeren": {
    amalgamRequirements: [{ disciplineId: "discipline:auspex", rating: 1 }],
  },
  "obfuscate-conceal": {
    amalgamRequirements: [{ disciplineId: "discipline:auspex", rating: 3 }],
  },
  "obfuscate-chimerstry": {
    amalgamRequirements: [{ disciplineId: "discipline:presence", rating: 1 }],
  },
  "obfuscate-fata-morgana": {
    amalgamRequirements: [{ disciplineId: "discipline:presence", rating: 2 }],
  },
  "obfuscate-mental-maze": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 1 }],
  },
  "obfuscate-mask-mind": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 2 }],
  },
  "potence-spark-of-rage": {
    amalgamRequirements: [{ disciplineId: "discipline:presence", rating: 3 }],
  },
  "potence-crash-down": {
    prerequisites: ["power:potence-soaring-leap"],
  },
  "potence-wrecker": {
    prerequisites: ["power:potence-prowess"],
  },
  "presence-irresistible-voice": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 1 }],
  },
  "presence-serpents-eyes": {
    amalgamRequirements: [{ disciplineId: "discipline:protean", rating: 1 }],
  },
  "presence-thrown-voice": {
    amalgamRequirements: [{ disciplineId: "discipline:auspex", rating: 1 }],
  },
  "protean-fleshcrafting": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 2 }],
    prerequisites: ["power:protean-vicissitude"],
  },
  "protean-horrid-form": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 2 }],
    prerequisites: ["power:protean-vicissitude"],
  },
  "protean-metamorphosis": { prerequisites: ["power:protean-shapechange"] },
  "protean-one-land": {
    amalgamRequirements: [{ disciplineId: "discipline:animalism", rating: 2 }],
    prerequisites: ["power:protean-earth-meld"],
  },
  "protean-vicissitude": {
    amalgamRequirements: [{ disciplineId: "discipline:dominate", rating: 2 }],
  },
};

const POWER_DESCRIPTIONS: Readonly<Record<string, string>> = {
  "auspex-heightened-senses":
    "O Sangue abre os sentidos do vampiro muito além da capacidade humana. Conversas distantes, odores quase apagados, movimentos mínimos e detalhes escondidos pela penumbra tornam-se perceptíveis, fazendo do usuário um observador extraordinário. Essa abertura também cobra atenção: luz intensa, ruído súbito e outros estímulos violentos podem sobrecarregá-lo.",
  "auspex-sense-the-unseen":
    "A percepção do vampiro deixa de se limitar ao que pertence ao mundo material e evidente. Fantasmas, criaturas ocultas, ilusões e manifestações sobrenaturais podem denunciar sua presença como contornos, sensações ou inconsistências no ambiente. O Poder não garante compreensão imediata do fenômeno, mas permite notar que algo escondido está ali.",
  "auspex-premonition":
    "A mente recebe lampejos que antecedem o perigo ou revelam um significado ainda encoberto. Essas visões podem surgir espontaneamente, como imagens, sensações e símbolos difíceis de interpretar, ou ser procuradas deliberadamente pelo vampiro. Quanto mais clara for a conexão com a pergunta, mais útil tende a ser o aviso recebido.",
  "auspex-panacea":
    "Ao compartilhar uma pequena medida de vitae e concentrar sua percepção sobre outra pessoa, o vampiro acalma tormentos que não cedem a palavras comuns. A serenidade transmitida pode restaurar a firmeza de quem está emocionalmente abalado ou mentalmente exausto. O processo exige proximidade, cuidado e deixa claro que o alívio nasce do Sangue do usuário.",
  "auspex-scry-the-soul":
    "A aura do alvo se oferece à percepção como um conjunto de sinais emocionais e espirituais. O vampiro pode reconhecer estados de espírito, marcas sobrenaturais e indícios sobre a natureza da criatura observada. Leituras mais profundas dependem de atenção e margem suficientes, pois medo, dissimulação e confusão podem tornar a alma difícil de interpretar.",
  "auspex-share-the-senses":
    "O vampiro abandona momentaneamente o ponto de vista do próprio corpo para perceber através de outra criatura. Visão, audição e demais sentidos chegam pela perspectiva do alvo, permitindo acompanhar lugares distantes ou observar sem estar presente. Enquanto a conexão permanece, o corpo do usuário continua onde foi deixado e pode ficar vulnerável ao que acontece ao redor.",
  "auspex-reveal-temper":
    "A percepção sobrenatural atravessa o comportamento aparente e alcança a qualidade do sangue que move o alvo. Em mortais, o vampiro identifica Ressonância e possíveis Discrasias; em Membros, percebe vestígios da presa recente. A leitura também pode revelar hábitos de alimentação e oferecer uma compreensão mais precisa de como abordar aquela pessoa.",
  "auspex-fatal-flaw":
    "Depois de observar postura, reações e sinais invisíveis aos sentidos comuns, o vampiro encontra o ponto em que a defesa do alvo pode ruir. A fraqueza descoberta pode ser física, mental ou ligada à forma como a criatura resiste a ataques. O conhecimento não causa dano por si só, mas orienta o golpe certo e pode ser comunicado a um aliado.",
  "auspex-spirits-touch":
    "Objetos e lugares conservam ecos das pessoas e acontecimentos que os marcaram. Ao tocar a superfície e abrir a mente, o vampiro recebe fragmentos sensoriais e emocionais do passado: uma presença, um gesto, uma sensação ou uma imagem. Impressões recentes e intensas são mais fáceis de alcançar; rastros antigos ou discretos exigem maior esforço.",
  "auspex-clairvoyance":
    "A consciência do vampiro se espalha por uma região em vez de permanecer presa aos próprios sentidos. Ele pode procurar pessoas, movimentos e acontecimentos distantes dentro da área, reunindo informações como se a cidade ao redor fosse um único organismo perceptível. A visão não é onisciente: alcance, precisão e quantidade de respostas dependem do teste e da pergunta formulada.",
  "auspex-possession":
    "A mente do vampiro atravessa o espaço entre dois corpos e ocupa um hospedeiro mortal. O corpo original cai inerte enquanto o usuário enxerga, fala e age pela carne tomada, conservando sua identidade e suas capacidades mentais. A experiência é profunda e perigosa, pois expulsão, morte do hospedeiro ou ameaça ao corpo abandonado podem encerrar o controle de modo abrupto.",
  "auspex-telepathy":
    "Pensamentos deixam de ser inteiramente privados diante da concentração do vampiro. Ele pode captar ideias superficiais, projetar palavras e imagens e, quando força a intrusão, buscar lembranças ou conteúdos mais profundos. Mentes resistentes podem perceber a invasão ou ocultar aquilo que o usuário procura, transformando a leitura em uma disputa silenciosa.",
  "auspex-unburdening-bestial-soul":
    "O vampiro estabelece uma ligação psíquica íntima com outro Membro e o ajuda a enfrentar parte da degradação causada pela Besta. Culpa, Máculas e perda de humanidade são trabalhadas durante uma cena exigente, que pode aliviar o alvo ou protegê-lo de uma queda futura. O processo cobra um preço moral do usuário e não pode ser oferecido indiscriminadamente.",
  "celerity-cats-grace":
    "O corpo encontra equilíbrio antes mesmo que a mente reconheça o risco. Beiradas estreitas, superfícies instáveis e mudanças bruscas de apoio são atravessadas com a segurança de um predador perfeitamente coordenado. Mesmo uma queda significativa pode terminar em um pouso controlado, desde que esteja dentro dos limites sobrenaturais do Poder.",
  "celerity-rapid-reflexes":
    "Os reflexos do vampiro antecedem o movimento consciente e permitem respostas que pareceriam impossíveis a um observador mortal. Ele reage a projéteis, ameaças repentinas e pequenas exigências sem sacrificar a ação principal. Não se trata apenas de correr depressa, mas de reconhecer e completar um gesto defensivo no instante exato.",
  "celerity-fleetness":
    "A velocidade sobrenatural passa a acompanhar cada movimento de precisão e agilidade. O vampiro muda de direção, alcança posições e evita ataques com uma fluidez que ultrapassa treinamento comum. Durante a manifestação, tarefas baseadas em Destreza e determinadas defesas físicas recebem o impulso direto da Celeridade.",
  "celerity-russian-work":
    "O usuário comprime trabalho cuidadoso em poucos segundos, movendo mãos e ferramentas rápido demais para olhos comuns acompanharem. Escrever, montar, reparar ou executar outras tarefas de Habilidade pode consumir apenas uma fração do tempo normal. A aceleração não substitui conhecimento e não oferece vantagem para atacar, defender ou superar oposição ativa.",
  "celerity-blink":
    "O vampiro cruza uma distância em um surto tão veloz que parece desaparecer de um ponto e surgir em outro. Para quem observa, o percurso quase não existe; resta apenas o deslocamento de ar e a ação realizada ao final. Terreno irregular e obstáculos ainda importam, porque a velocidade não transforma uma rota impossível em passagem segura.",
  "celerity-traversal":
    "Enquanto mantiver o impulso, o vampiro corre onde um corpo normal não encontraria sustentação. Paredes, água, superfícies frágeis e caminhos precários tornam-se trajetos possíveis por alguns instantes. Hesitar ou perder o ritmo encerra a vantagem e devolve imediatamente ao ambiente suas consequências naturais.",
  "celerity-weaving":
    "O vampiro costura uma trajetória por entre projéteis e ameaças sucessivas, corrigindo posição a cada fração de segundo. Sua defesa permanece eficiente mesmo quando vários atacantes tentam cercá-lo com fogo à distância. A manifestação exige Reflexos Rápidos e transforma movimento contínuo em uma proteção sobrenatural.",
  "celerity-draught-of-elegance":
    "A vitae do usuário pode carregar uma parcela temporária de sua velocidade impossível. Quem bebe recebe por uma noite um reflexo limitado da Celeridade do doador, manifestando parte de seu nível e dos Poderes compatíveis. O empréstimo nasce do Sangue e não transforma o receptor em verdadeiro mestre da Disciplina.",
  "celerity-unerring-aim":
    "Percepção sobrenatural e velocidade se unem no instante de um disparo. O ataque parte antes que movimentos defensivos comuns possam responder, tornando inúteis muitas tentativas normais de esquiva. Apenas criaturas capazes de acompanhar essa rapidez possuem chance real de reagir conforme as regras específicas do Poder.",
  "celerity-blurred-momentum":
    "O vampiro sustenta uma aceleração tão intensa que sua posição nunca parece inteiramente fixa. Ataques atravessam o lugar que ele ocupava um instante antes, enquanto o corpo já se encontra fora da trajetória. Manter esse estado exige alimentar o Sangue a cada turno, e golpes suficientemente precisos ainda podem alcançá-lo.",
  "celerity-lightning-strike":
    "O usuário transforma um ataque corpo a corpo em um acontecimento quase instantâneo. A aproximação e o golpe se completam antes que uma defesa comum consiga se formar, deixando ao alvo apenas recursos sobrenaturais comparáveis. A força do ataque continua vindo da técnica e do corpo; Celeridade torna sua execução praticamente impossível de acompanhar.",
  "celerity-split-second":
    "Entre a intenção de outra pessoa e sua consequência, o vampiro encontra tempo para agir. Ele pode intervir com uma ação curta antes que o acontecimento em curso se complete, alterando posição, proteção ou oportunidade. O Poder não desfaz fatos já resolvidos e depende de haver, de fato, um instante no qual a intervenção caiba.",
  "celerity-unseen-strike":
    "O vampiro combina um deslocamento fulminante com ocultação sobrenatural, desaparecendo da percepção durante a aproximação. Se o alvo não acompanha o movimento, o ataque chega sem defesa e de uma direção impossível de antecipar. A técnica exige domínio de Piscar e Ofuscação, reunindo velocidade e ausência em um único golpe.",
  "presence-awe":
    "O vampiro deixa de ser apenas mais uma pessoa no ambiente e passa a atrair espontaneamente atenção, interesse e simpatia. Voz, postura e gestos parecem mais convincentes, fazendo com que uma plateia deseje ouvi-lo ou acompanhá-lo. Fascínio intensifica influência positiva, mas não remove julgamento, autopreservação ou liberdade de decisão.",
  "presence-daunt":
    "Uma ameaça predatória envolve o vampiro mesmo quando ele permanece imóvel e silencioso. Aproximar-se, desafiá-lo ou sustentar confronto parece instintivamente perigoso, como encarar algo que não deveria ser provocado. Amedrontar fortalece intimidação e pode impedir mortais de agir diretamente contra o usuário sem primeiro superar o medo.",
  "presence-serpents-eyes":
    "Os olhos do vampiro assumem uma qualidade hipnótica e predatória que captura por completo a atenção de quem sustenta seu olhar. Mortais podem ficar imóveis, incapazes de desviar-se ou agir enquanto o contato continua; vampiros ainda têm a chance de resistir. A manifestação alcança um alvo por vez e denuncia a natureza inumana do usuário.",
  "presence-lingering-kiss":
    "O êxtase do Beijo permanece na memória do mortal muito depois de a alimentação terminar. O alvo passa a desejar novamente aquela intimidade sobrenatural e pode comparar outras experiências de forma desfavorável à lembrança deixada pelo vampiro. A intensidade da dependência nasce da alimentação e pode influenciar escolhas sem equivaler a uma ordem direta.",
  "presence-melpominee":
    "A voz se torna o veículo pleno da Presença e carrega nela a atração, o medo ou a majestade do vampiro. Quem a escuta ao vivo pode ser afetado mesmo sem enxergar o usuário, desde que o Poder transmitido também seja aplicável. Gravações e transmissões comuns preservam o som, mas não a força sobrenatural que o acompanha.",
  "presence-thrown-voice":
    "O vampiro desloca a origem aparente de sua voz para qualquer ponto que consiga ver. Palavras podem surgir atrás de uma porta, no alto de uma sala ou junto a outra pessoa, confundindo ouvintes e permitindo combinações com Poderes vocais. A voz continua sendo a do usuário; apenas sua posição percebida é alterada.",
  "presence-dread-gaze":
    "A Besta aparece por trás da expressão do vampiro e transforma sua atenção em terror concentrado. O alvo compreende, num nível instintivo, que está diante de um predador capaz de destruí-lo, podendo recuar, fugir ou perder o controle. Membros resistem melhor do que mortais, mas uma manifestação extrema ainda pode despertar frenesi de terror.",
  "presence-entrancement":
    "O vampiro concentra sua influência sobre uma pessoa e desperta nela admiração e devoção intensas. O alvo deseja agradá-lo, tende a interpretar suas ações favoravelmente e se mostra mais disposto a atender pedidos razoáveis. Transe não elimina a autopreservação nem converte a vítima em servo sem vontade.",
  "presence-irresistible-voice":
    "A autoridade sobrenatural da voz substitui a necessidade de capturar o olhar do alvo ao usar Dominação. Basta que a ordem seja ouvida para que o Poder de Dominação possa alcançá-lo, mesmo à distância visual. Todas as demais restrições continuam valendo; esta técnica muda o canal da imposição, não a natureza do comando.",
  "presence-summon":
    "O vampiro alcança alguém que já encontrou e planta uma necessidade persistente de procurá-lo. O alvo organiza seus passos para chegar até o usuário pela rota mais direta e segura disponível, mesmo sem compreender plenamente a razão. Distância, perigo e resistência podem atrasar ou impedir a chegada, mas não tornam o chamado consciente.",
  "presence-blow-edifice":
    "A presença emocional do vampiro impregna um edifício ou espaço equivalente até que o próprio lugar pareça observá-lo, atraí-lo ou ameaçá-lo. Fascínio, Amedrontar ou Majestade podem então alcançar pessoas através da arquitetura. Quando o usuário está visível, sua presença direta continua sendo o foco principal da manifestação.",
  "presence-majesty":
    "O vampiro revela uma presença tão absoluta que oposição e irreverência parecem atos impossíveis. Quem contempla a manifestação pode ficar dominado por reverência, desejo ou terror, incapaz de atacar ou desafiar o usuário sem vencer a resistência exigida. Majestade não é uma ordem específica: é a certeza avassaladora de que aquela figura deve ser obedecida ou adorada.",
  "presence-star-magnetism":
    "A Presença atravessa a distância criada por câmeras, telas e transmissões, permitindo que a influência do vampiro alcance uma audiência ausente. Efeitos ao vivo conservam maior força, enquanto gravações carregam uma impressão reduzida. Cada espectador ainda reage como indivíduo e pode resistir de acordo com o Poder transmitido.",
};

const DISCIPLINE_DESCRIPTIONS = {
  "discipline:animalism":
    "Animalismo aproxima o vampiro da linguagem da Besta que existe nele e nos demais seres vivos. Seus praticantes reconhecem impulsos predatórios, comunicam-se com animais e impõem a eles uma autoridade que vai muito além do adestramento. Nos níveis mais profundos, a Disciplina permite despertar, acalmar ou deslocar a própria ferocidade sobrenatural, tornando instinto e fome instrumentos perigosos.",
  "discipline:auspex":
    "Auspícios rompe os limites dos sentidos e da intuição, permitindo perceber aquilo que olhos e ouvidos comuns jamais alcançariam. A Disciplina revela presenças ocultas, emoções, auras, pensamentos e ecos deixados em pessoas, objetos e lugares. Quanto maior o domínio, mais a consciência se afasta do corpo e atravessa distância, memória e mente — uma abertura poderosa, mas vulnerável ao excesso de estímulos e às verdades que talvez fosse melhor não conhecer.",
  "discipline:blood-sorcery":
    "Feitiçaria de Sangue transforma a vitae em objeto de estudo, arma e linguagem sobrenatural. Seus Poderes permitem analisar, alterar, enfraquecer e comandar o Sangue com uma precisão que outras Disciplinas não possuem. A prática exige conhecimento e controle; os Rituais relacionados formam um subsistema próprio e não são confundidos com os Poderes adquiridos por pontos da Disciplina.",
  "discipline:celerity":
    "Celeridade leva reação, equilíbrio e movimento para além do que um corpo humano consegue acompanhar. Seus praticantes atravessam espaços em um piscar, agem entre dois instantes e transformam coordenação perfeita em defesa ou ataque. A Disciplina não significa apenas correr depressa: ela altera a relação do vampiro com o tempo físico, permitindo que um segundo contenha decisões e movimentos impossíveis para qualquer observador comum.",
  "discipline:dominate":
    "Dominação projeta a vontade do vampiro diretamente sobre outra mente. Ordens podem ser impostas, lembranças apagadas ou remodeladas e comportamentos plantados para despertar mais tarde. A Disciplina não cria confiança verdadeira e suas vítimas podem carregar lacunas, racionalizações ou traumas; quanto mais profundo o uso, mais evidente se torna a violência de reduzir uma pessoa a instrumento.",
  "discipline:fortitude":
    "Fortitude faz da carne, da vontade e da identidade muralhas sobrenaturais. O vampiro suporta ferimentos que destruiriam outro corpo, resiste a coerção e pode estender parte dessa proteção a quem está próximo. Mais do que simples dureza, a Disciplina representa a recusa do Sangue em ceder quando dor, medo ou destruição deveriam encerrar qualquer resistência.",
  "discipline:obfuscate":
    "Ofuscação conduz a atenção para longe do vampiro em vez de depender apenas de invisibilidade física. Olhares escorregam, memórias falham e identidades podem parecer diferentes, permitindo que pessoas, objetos ou ações permaneçam diante de testemunhas sem serem realmente percebidos. A Disciplina é poderosa enquanto o usuário respeita seus limites, mas violência aberta e comportamentos impossíveis podem romper a ilusão de ausência.",
  "discipline:oblivion":
    "Oblívio alcança a ausência que existe além da luz, da vida e da morte. Seus Poderes moldam sombras, aceleram decomposição e estabelecem contato com espectros e lugares tocados pelo mundo dos mortos. Cada manifestação aproxima o vampiro do vazio que pretende comandar; as Cerimônias associadas possuem regras próprias e permanecem separadas dos Poderes adquiridos pelo nível da Disciplina.",
  "discipline:potence":
    "Potência manifesta a força do Sangue sem medida humana. O vampiro salta distâncias impossíveis, domina corpos, rompe materiais e concentra violência suficiente para transformar um único golpe em destruição. Seus Poderes podem agir de forma brutal ou precisa, mas todos expressam a mesma certeza física: quando o usuário decide impor força, as limitações comuns de músculos, peso e estrutura deixam de protegê-lo.",
  "discipline:presence":
    "Presença influencia as emoções de todos que percebem o vampiro. Ela pode atrair atenção, despertar confiança, impor medo, provocar devoção ou transformar uma voz e um lugar em extensões do magnetismo do usuário. Diferentemente de Dominação, a Disciplina não implanta ordens diretas: ela muda o que as pessoas sentem e, por meio disso, altera profundamente o que desejam fazer.",
  "discipline:protean":
    "Proteanismo entrega o corpo à mutabilidade da Besta. Sentidos, peso, armas naturais e anatomia deixam de ser limites fixos, permitindo ao vampiro adaptar-se à caça, ao ambiente ou à violência. Com domínio suficiente, a forma humana pode ser abandonada em favor de animais, monstros, terra ou névoa, tornando a própria identidade física algo temporário.",
  "discipline:thin-blood-alchemy":
    "Alquimia Sangue-Ralo transforma a instabilidade do sangue diluído em experimentação sobrenatural. Fórmulas, métodos de destilação e ingredientes específicos permitem produzir efeitos que o alquimista não sustentaria naturalmente, inclusive imitações limitadas de outras Disciplinas. Cada resultado depende de preparo e conhecimento; Alquimia não é uma Disciplina intrínseca comum e sua obtenção durante a criação permanece ligada à Qualidade apropriada.",
} satisfies Readonly<Record<CreationDisciplineId, string>>;

const AUDITED_DISCIPLINE_IDS = new Set<CreationDisciplineId>([
  "discipline:auspex",
  "discipline:celerity",
  "discipline:presence",
]);

function power(
  disciplineId: CreationDisciplineId,
  seed: PowerSeed,
  sourceRefs: DisciplinePowerCatalogItemView["sourceRefs"],
  extra: PowerMechanics &
    Partial<
      Pick<
        DisciplinePowerCatalogItemView,
        "amalgamRequirements" | "prerequisites" | "prerequisitePowerOptions"
      >
    > = {},
): DisciplinePowerCatalogItemView {
  const auditStatus: PowerRuleAuditStatus = AUDITED_DISCIPLINE_IDS.has(disciplineId)
    ? sourceRefs.length > 1
      ? "CONFLICT_REVIEWED"
      : "VERIFIED"
    : "PENDING";
  const descriptionPtBr = POWER_DESCRIPTIONS[seed[0]] ?? seed[4];
  const amalgamRequirements = extra.amalgamRequirements ?? [];
  const prerequisites = extra.prerequisites ?? [];
  const prerequisitePowerOptions = extra.prerequisitePowerOptions ?? [];
  const ruleRevisions: PowerRuleView["ruleRevisions"] = sourceRefs.map(
    (sourceRef, index) => ({
      id:
        index === sourceRefs.length - 1
          ? DISCIPLINE_CATALOG_REVISION
          : `${DISCIPLINE_CATALOG_REVISION}:${sourceRef.sourceId.toLowerCase()}`,
      sourceRefs: [sourceRef],
      status: index === sourceRefs.length - 1 ? "ACTIVE" : "SUPERSEDED",
    }),
  );
  const systemStepsPtBr =
    extra.systemStepsPtBr ?? (extra.systemPtBr === undefined ? [] : [extra.systemPtBr]);
  const presentation: PowerPresentationView = {
    contentKind: "PROJECT_PARAPHRASE",
    contentRevisionId: POWER_PRESENTATION_REVISION,
    descriptionPtBr,
    effectPtBr: seed[4],
    summaryPtBr: seed[4],
  };
  const rule: PowerRuleView = {
    activationPtBr: extra.activationPtBr ?? null,
    amalgamRequirements,
    auditStatus,
    conditionsPtBr: extra.conditionsPtBr ?? [],
    cost: extra.cost ?? null,
    dicePool: extra.dicePool ?? null,
    difficulty: extra.difficulty ?? null,
    duration: extra.duration ?? null,
    notesPtBr: extra.notesPtBr === undefined ? [] : [extra.notesPtBr],
    prerequisitePowerOptions,
    prerequisites,
    rangePtBr: extra.rangePtBr ?? null,
    restrictionsPtBr:
      extra.restrictionsPtBr === undefined ? [] : [extra.restrictionsPtBr],
    ruleRevisionId: DISCIPLINE_CATALOG_REVISION,
    ruleRevisions,
    sourceRefs,
    systemStepsPtBr,
    targetPtBr: extra.targetPtBr ?? null,
  };
  return {
    auditStatus,
    amalgamRequirements,
    descriptionPtBr,
    disciplineId,
    effectPtBr: seed[4],
    id: `power:${seed[0]}`,
    level: seed[1],
    nameOriginal: seed[3],
    namePtBr: seed[2],
    presentation,
    prerequisites,
    prerequisitePowerOptions,
    rule,
    ruleRevisionId: DISCIPLINE_CATALOG_REVISION,
    ruleRevisions,
    sourceRefs,
    summaryPtBr: seed[4],
    ...(extra.cost === undefined ? {} : { cost: extra.cost }),
    ...(extra.dicePool === undefined ? {} : { dicePool: extra.dicePool }),
    ...(extra.difficulty === undefined ? {} : { difficulty: extra.difficulty }),
    ...(extra.duration === undefined ? {} : { duration: extra.duration }),
    ...(extra.notesPtBr === undefined ? {} : { notesPtBr: extra.notesPtBr }),
    ...(extra.restrictionsPtBr === undefined
      ? {}
      : { restrictionsPtBr: extra.restrictionsPtBr }),
    ...(systemStepsPtBr.length === 0 ? {} : { systemPtBr: systemStepsPtBr.join("\n\n") }),
  };
}

function discipline(
  id: CreationDisciplineId,
  namePtBr: string,
  nameOriginal: string,
  summaryPtBr: string,
  pages: readonly number[],
  seeds: readonly PowerSeed[],
  sourceId: "SRC-0001" | "SRC-0004" = "SRC-0001",
): DisciplineCatalogItemView {
  const refs = [source(sourceId, ...pages)];
  const powers = seeds.map((seed) =>
    power(id, seed, POWER_SOURCE_OVERRIDES[seed[0]] ?? refs, {
      ...(POWER_REQUIREMENTS[seed[0]] ?? {}),
      ...(POWER_MECHANICS[seed[0]] ?? {}),
      ...(POWER_RULE_AUDIT_OVERRIDES[seed[0]] ?? {}),
    }),
  );
  const sourceRefs = [
    ...new Map(
      [refs, ...powers.map((entry) => entry.sourceRefs)]
        .flat()
        .map((reference) => [
          `${reference.sourceId}:${reference.pages.join(",")}`,
          reference,
        ]),
    ).values(),
  ];
  return {
    descriptionPtBr: DISCIPLINE_DESCRIPTIONS[id],
    id,
    nameOriginal,
    namePtBr,
    powers,
    ruleRevisionId: DISCIPLINE_CATALOG_REVISION,
    sourceRefs,
    summaryPtBr,
  };
}

const ANIMALISM: readonly PowerSeed[] = [
  [
    "animalism-bond-famulus",
    1,
    "Vínculo com Familiar",
    "Bond Famulus",
    "Cria um vínculo duradouro com um animal que passa a servir e compreender o vampiro.",
  ],
  [
    "animalism-sense-the-beast",
    1,
    "Sentir a Besta",
    "Sense the Beast",
    "Percebe a Besta em vampiros e a hostilidade ou o medo predatório em mortais.",
  ],
  [
    "animalism-feral-whispers",
    2,
    "Sussurros Selvagens",
    "Feral Whispers",
    "Permite comunicação sobrenatural com animais e pedidos compatíveis com sua natureza.",
  ],
  [
    "animalism-animal-messenger",
    2,
    "Mensageiro Animal",
    "Animal Messenger",
    "Faz o familiar localizar uma pessoa e entregar uma mensagem curta com a voz do mestre.",
  ],
  [
    "animalism-animal-succulence",
    3,
    "Suculência Animal",
    "Animal Succulence",
    "Torna o sangue animal mais nutritivo para o vampiro.",
  ],
  [
    "animalism-quell-the-beast",
    3,
    "Domar a Besta",
    "Quell the Beast",
    "Suprime por algum tempo a fúria predatória ou a vontade combativa de um alvo.",
  ],
  [
    "animalism-unliving-hive",
    3,
    "Enxame Não Vivo",
    "Unliving Hive",
    "Estende os Poderes de Animalismo a enxames de insetos e permite adotá-los como familiar.",
  ],
  [
    "animalism-plague-of-beasts",
    3,
    "Praga de Bestas",
    "Plague of Beasts",
    "Marca um alvo para receber a atenção hostil e persistente dos animais próximos.",
  ],
  [
    "animalism-messengers-command",
    3,
    "Comando do Mensageiro",
    "Messenger's Command",
    "Permite transmitir um comando de Dominação por meio do familiar mensageiro.",
  ],
  [
    "animalism-subsume-the-spirit",
    4,
    "Subsumir o Espírito",
    "Subsume the Spirit",
    "Projeta a consciência no corpo de um animal e assume seus sentidos e movimentos.",
  ],
  [
    "animalism-quell-the-herd",
    4,
    "Acalmar o Rebanho",
    "Quell the Herd",
    "Orienta o humor coletivo dos animais de uma área extensa.",
  ],
  [
    "animalism-animal-dominion",
    5,
    "Domínio Animal",
    "Animal Dominion",
    "Estende a autoridade do vampiro a grandes grupos de animais.",
  ],
  [
    "animalism-drawing-out-the-beast",
    5,
    "Expulsar a Besta",
    "Drawing Out the Beast",
    "Transfere a própria Besta para outra pessoa, deslocando um frenesi iminente ou ativo.",
  ],
  [
    "animalism-pursue-bestial-temper",
    5,
    "Perseguir o Temperamento Bestial",
    "Pursue the Bestial Temper",
    "Altera a dificuldade de resistir ao frenesi para vampiros ao alcance.",
  ],
];

const AUSPEX: readonly PowerSeed[] = [
  [
    "auspex-heightened-senses",
    1,
    "Sentidos Aguçados",
    "Heightened Senses",
    "Amplia os sentidos a uma intensidade sobrenatural, revelando detalhes normalmente imperceptíveis.",
  ],
  [
    "auspex-sense-the-unseen",
    1,
    "Sentir o Invisível",
    "Sense the Unseen",
    "Detecta presenças sobrenaturais ocultas, ilusões e coisas escondidas da percepção comum.",
  ],
  [
    "auspex-premonition",
    2,
    "Premonição",
    "Premonition",
    "Entrega lampejos intuitivos de perigo, significado ou acontecimentos ainda encobertos.",
  ],
  [
    "auspex-panacea",
    2,
    "Panaceia",
    "Panacea",
    "Acalma sofrimento mental ou emocional ao compartilhar serenidade através da vitae.",
  ],
  [
    "auspex-scry-the-soul",
    3,
    "Perscrutar a Alma",
    "Scry the Soul",
    "Lê aura, estado emocional e sinais da natureza sobrenatural de um alvo.",
  ],
  [
    "auspex-share-the-senses",
    3,
    "Compartilhar os Sentidos",
    "Share the Senses",
    "Percebe o mundo através dos sentidos de outra criatura.",
  ],
  [
    "auspex-reveal-temper",
    3,
    "Revelar Temperamento",
    "Reveal Temper",
    "Expõe inclinações, forças e fragilidades comportamentais úteis para compreender um alvo.",
  ],
  [
    "auspex-fatal-flaw",
    3,
    "Falha Fatal",
    "Fatal Flaw",
    "Revela uma fraqueza crítica no corpo, na defesa ou na condição sobrenatural observada.",
  ],
  [
    "auspex-spirits-touch",
    4,
    "Toque do Espírito",
    "Spirit's Touch",
    "Obtém impressões psíquicas deixadas em objetos e lugares por pessoas e acontecimentos.",
  ],
  [
    "auspex-clairvoyance",
    5,
    "Clarividência",
    "Clairvoyance",
    "Espalha a percepção por uma área, permitindo observar acontecimentos distantes dentro dela.",
  ],
  [
    "auspex-possession",
    5,
    "Possessão",
    "Possession",
    "Projeta a mente no corpo de um mortal e passa a controlá-lo.",
  ],
  [
    "auspex-telepathy",
    5,
    "Telepatia",
    "Telepathy",
    "Lê pensamentos e projeta palavras ou imagens diretamente na mente.",
  ],
  [
    "auspex-unburdening-bestial-soul",
    5,
    "Descarregando a Alma Bestial",
    "Unburdening the Bestial Soul",
    "Trata parte da erosão moral de outro vampiro mediante um vínculo psíquico exigente.",
  ],
];

const CELERITY: readonly PowerSeed[] = [
  [
    "celerity-cats-grace",
    1,
    "Graça Felina",
    "Cat's Grace",
    "Concede equilíbrio e coordenação impossíveis, mesmo em superfícies precárias.",
  ],
  [
    "celerity-rapid-reflexes",
    1,
    "Reflexos Rápidos",
    "Rapid Reflexes",
    "Permite reagir sem hesitação e executar pequenas ações defensivas com velocidade sobrenatural.",
  ],
  [
    "celerity-fleetness",
    2,
    "Rapidez",
    "Fleetness",
    "Acrescenta velocidade sobrenatural a movimentos e disputas de agilidade.",
  ],
  [
    "celerity-russian-work",
    2,
    "Trabalho Russo",
    "Russian Work",
    "Comprime tarefas demoradas em um intervalo extraordinariamente curto.",
  ],
  [
    "celerity-blink",
    3,
    "Piscar",
    "Blink",
    "Cruza uma distância quase instantaneamente, parecendo desaparecer e reaparecer.",
  ],
  [
    "celerity-traversal",
    3,
    "Travessia",
    "Traversal",
    "Corre por paredes, água e superfícies que não sustentariam movimento normal.",
  ],
  [
    "celerity-weaving",
    3,
    "Tecelagem",
    "Weaving",
    "Move-se por uma zona de perigo desviando de ataques e obstáculos em sucessão.",
  ],
  [
    "celerity-draught-of-elegance",
    4,
    "Elegância Direto da Fonte",
    "Draught of Elegance",
    "Transmite temporariamente parte da Celeridade por meio da vitae.",
  ],
  [
    "celerity-unerring-aim",
    4,
    "Mira Infalível",
    "Unerring Aim",
    "Torna um ataque à distância quase impossível de acompanhar ou evitar.",
  ],
  [
    "celerity-blurred-momentum",
    4,
    "Momento Borro",
    "Blurred Momentum",
    "Mantém uma aceleração extrema por vários instantes consecutivos.",
  ],
  [
    "celerity-lightning-strike",
    5,
    "Golpe Relâmpago",
    "Lightning Strike",
    "Desfere um ataque corpo a corpo rápido demais para uma defesa comum.",
  ],
  [
    "celerity-split-second",
    5,
    "Fração de Segundo",
    "Split Second",
    "Permite intervir numa situação antes que os demais consigam completar sua reação.",
  ],
  [
    "celerity-unseen-strike",
    5,
    "Greve Invisível",
    "Unseen Strike",
    "Combina deslocamento e ocultação para atacar sem que o alvo acompanhe a aproximação.",
  ],
];

const DOMINATE: readonly PowerSeed[] = [
  [
    "dominate-cloud-memory",
    1,
    "Nublar a Memória",
    "Cloud Memory",
    "Apaga da memória recente um momento breve presenciado pelo alvo.",
  ],
  [
    "dominate-compel",
    1,
    "Compelir",
    "Compel",
    "Impõe uma ordem curta e imediata que o alvo tenta executar literalmente.",
  ],
  [
    "dominate-slavish-devotion",
    1,
    "Devoção Servil",
    "Slavish Devotion",
    "Reforça a obediência de um servo contra tentativas externas de afastá-lo do mestre.",
  ],
  [
    "dominate-mesmerize",
    2,
    "Hipnotizar",
    "Mesmerize",
    "Implanta instruções mais complexas em uma mente submetida ao olhar e à voz do vampiro.",
  ],
  [
    "dominate-dementation",
    2,
    "Demência",
    "Dementation",
    "Faz a mente do alvo ser invadida por compulsões e perturbação psíquica.",
  ],
  [
    "dominate-domitors-favor",
    2,
    "Favor do Dominador",
    "Domitor's Favor",
    "Torna mais difícil para um servo vinculado agir diretamente contra seu mestre.",
  ],
  [
    "dominate-forgetful-mind",
    3,
    "A Mente Esquecida",
    "The Forgetful Mind",
    "Reescreve lembranças do alvo com uma narrativa construída pelo usuário.",
  ],
  [
    "dominate-submerged-directive",
    3,
    "Diretriz Submersa",
    "Submerged Directive",
    "Esconde uma ordem que só desperta quando uma condição futura é satisfeita.",
  ],
  [
    "dominate-implant-suggestion",
    3,
    "Implantar Sugestão",
    "Implant Suggestion",
    "Faz uma ideia imposta parecer uma conclusão natural da própria vítima.",
  ],
  [
    "dominate-rationalize",
    4,
    "Racionalizar",
    "Rationalize",
    "Leva o alvo a justificar como próprias as ações realizadas sob Dominação.",
  ],
  [
    "dominate-ancestral-dominion",
    4,
    "Domínio Ancestral",
    "Ancestral Dominion",
    "Amplia a força da Dominação contra alvos normalmente protegidos pela potência do Sangue.",
  ],
  [
    "dominate-mass-manipulation",
    5,
    "Manipulação em Massa",
    "Mass Manipulation",
    "Aplica uma ordem de Dominação a várias pessoas ao mesmo tempo.",
  ],
  [
    "dominate-terminal-decree",
    5,
    "Decreto Terminal",
    "Terminal Decree",
    "Remove a proteção instintiva que impede ordens diretamente autodestrutivas.",
  ],
];

const FORTITUDE: readonly PowerSeed[] = [
  [
    "fortitude-resilience",
    1,
    "Resiliência",
    "Resilience",
    "Aumenta a capacidade física de suportar ferimentos.",
  ],
  [
    "fortitude-unswayable-mind",
    1,
    "Mente Inabalável",
    "Unswayable Mind",
    "Fortalece a mente contra coerção, intimidação e influência sobrenatural.",
  ],
  [
    "fortitude-toughness",
    2,
    "Tenacidade",
    "Toughness",
    "Reduz a gravidade do dano superficial antes que ele seja registrado.",
  ],
  [
    "fortitude-enduring-beasts",
    2,
    "Bestas Resistentes",
    "Enduring Beasts",
    "Compartilha resistência sobrenatural com animais vinculados.",
  ],
  [
    "fortitude-revitalizing-vitae",
    2,
    "Vitae Revigorante",
    "Revitalizing Vitae",
    "Usa vitae para auxiliar a recuperação de outro vampiro.",
  ],
  [
    "fortitude-earths-perseverance",
    2,
    "Perseverança da Terra",
    "Earth's Perseverance",
    "Ancora o vampiro ao local, impedindo que forças externas o movam enquanto o efeito durar.",
  ],
  [
    "fortitude-defy-bane",
    3,
    "Desafiar a Perdição",
    "Defy Bane",
    "Converte parte de um ferimento agravado em dano mais tratável.",
  ],
  [
    "fortitude-fortify-inner-facade",
    3,
    "Fortificar a Fachada Interior",
    "Fortify the Inner Facade",
    "Oculta pensamentos e emoções de escrutínio sobrenatural.",
  ],
  [
    "fortitude-valeren",
    3,
    "Valeren",
    "Valeren",
    "Projeta a Fortitude para reparar ferimentos sofridos por outro vampiro.",
  ],
  [
    "fortitude-draught-of-endurance",
    4,
    "Gole de Resistência",
    "Draught of Endurance",
    "Transmite temporariamente parte da Fortitude por meio da vitae.",
  ],
  [
    "fortitude-gorgons-scales",
    4,
    "Escamas da Górgona",
    "Gorgon's Scales",
    "Endurece o corpo contra uma ameaça específica escolhida a partir de sangue apropriado.",
  ],
  [
    "fortitude-flesh-of-marble",
    5,
    "Carne de Mármore",
    "Flesh of Marble",
    "Torna o corpo quase imune a impactos até que um golpe consiga romper a proteção.",
  ],
  [
    "fortitude-prowess-from-pain",
    5,
    "Proeza da Dor",
    "Prowess from Pain",
    "Transforma ferimentos sofridos em força para ações físicas.",
  ],
];

const OBFUSCATE: readonly PowerSeed[] = [
  [
    "obfuscate-cloak-of-shadows",
    1,
    "Manto das Sombras",
    "Cloak of Shadows",
    "Faz o vampiro passar despercebido enquanto permanece imóvel e discreto.",
  ],
  [
    "obfuscate-silence-of-death",
    1,
    "Silêncio da Morte",
    "Silence of Death",
    "Abafa todos os sons produzidos pelo usuário.",
  ],
  [
    "obfuscate-unseen-passage",
    2,
    "Passagem Invisível",
    "Unseen Passage",
    "Permite caminhar sem ser percebido enquanto a ocultação não é rompida.",
  ],
  [
    "obfuscate-chimerstry",
    2,
    "Quimerismo",
    "Chimerstry",
    "Cria uma impressão sensorial breve e sutil que parece real a quem a percebe.",
  ],
  [
    "obfuscate-ghost-in-machine",
    3,
    "Fantasma na Máquina",
    "Ghost in the Machine",
    "Estende a ocultação a registros digitais e vigilância eletrônica.",
  ],
  [
    "obfuscate-mask-thousand-faces",
    3,
    "Máscara de Mil Faces",
    "Mask of a Thousand Faces",
    "Faz observadores perceberem uma pessoa comum e esquecível no lugar do vampiro.",
  ],
  [
    "obfuscate-fata-morgana",
    3,
    "Fata Morgana",
    "Fata Morgana",
    "Constrói uma ilusão sensorial mais ampla, capaz de enganar vários sentidos.",
  ],
  [
    "obfuscate-conceal",
    4,
    "Ocultar",
    "Conceal",
    "Esconde um objeto inanimado como se ele também usasse Ofuscação.",
  ],
  [
    "obfuscate-vanish",
    4,
    "Desaparecer",
    "Vanish",
    "Permite sumir da percepção mesmo depois de ter sido claramente observado.",
  ],
  [
    "obfuscate-mental-maze",
    4,
    "Labirinto Mental",
    "Mental Maze",
    "Aprisiona a vítima numa percepção distorcida do espaço ao redor.",
  ],
  [
    "obfuscate-cloak-gathering",
    5,
    "Manto do Agrupamento",
    "Cloak the Gathering",
    "Estende poderes de ocultação a companheiros próximos.",
  ],
  [
    "obfuscate-impostors-guise",
    5,
    "Disfarce do Impostor",
    "Impostor's Guise",
    "Assume de forma convincente a aparência percebida de uma pessoa específica.",
  ],
  [
    "obfuscate-mask-mind",
    5,
    "Máscara da Mente",
    "Mask of the Mind",
    "Apresenta uma fachada psíquica falsa contra poderes que leem pensamentos e emoções.",
  ],
];

const POTENCE: readonly PowerSeed[] = [
  [
    "potence-lethal-body",
    1,
    "Corpo Letal",
    "Lethal Body",
    "Faz golpes desarmados causarem dano devastador e permite ferir mortais sem contenção.",
  ],
  [
    "potence-soaring-leap",
    1,
    "Salto Elevado",
    "Soaring Leap",
    "Projeta o corpo a distâncias e alturas impossíveis para força humana.",
  ],
  [
    "potence-prowess",
    2,
    "Proeza",
    "Prowess",
    "Amplia feitos de força e o dano causado em combate corporal.",
  ],
  [
    "potence-relentless-grip",
    2,
    "Aperto Implacável",
    "Relentless Grip",
    "Torna a pegada quase impossível de romper enquanto o vampiro mantém contato.",
  ],
  [
    "potence-brutal-feed",
    3,
    "Alimentação Brutal",
    "Brutal Feed",
    "Permite drenar sangue com violência e rapidez aterradoras.",
  ],
  [
    "potence-spark-of-rage",
    3,
    "Centelha de Fúria",
    "Spark of Rage",
    "Inflama agressividade e violência em quem está ao redor.",
  ],
  [
    "potence-uncanny-grip",
    3,
    "Aderência Sobrenatural",
    "Uncanny Grip",
    "Permite escalar e se prender a superfícies usando força nos dedos e membros.",
  ],
  [
    "potence-draught-of-might",
    4,
    "Gole de Poder",
    "Draught of Might",
    "Transmite temporariamente parte da Potência por meio da vitae.",
  ],
  [
    "potence-crash-down",
    4,
    "Queda",
    "Crash Down",
    "Converte o pouso de um salto sobrenatural em um impacto que derruba e fere quem está ao redor.",
  ],
  [
    "potence-subtle-hammer",
    4,
    "Martelo Sutil",
    "Subtle Hammer",
    "Concentra força imensa em movimentos mínimos e discretos.",
  ],
  [
    "potence-earthshock",
    5,
    "Abalo Sísmico",
    "Earthshock",
    "Golpeia o chão e espalha força destrutiva pela área próxima.",
  ],
  [
    "potence-fist-of-caine",
    5,
    "Punho de Caim",
    "Fist of Caine",
    "Faz ataques desarmados destruírem matéria e infligirem ferimentos sobrenaturais.",
  ],
  [
    "potence-wrecker",
    5,
    "Destruidor",
    "Wrecker",
    "Concentra a Potência para destruir objetos e estruturas inanimadas com força extrema.",
  ],
];

const PRESENCE: readonly PowerSeed[] = [
  [
    "presence-awe",
    1,
    "Fascínio",
    "Awe",
    "Reveste o vampiro de fascínio, atraindo olhares e tornando sua presença difícil de ignorar.",
  ],
  [
    "presence-daunt",
    1,
    "Amedrontar",
    "Daunt",
    "Projeta uma ameaça sobrenatural que desencoraja confronto, desafio e aproximação.",
  ],
  [
    "presence-serpents-eyes",
    1,
    "Olhos da Serpente",
    "Eyes of the Serpent",
    "Prende a atenção da vítima pelo olhar, deixando-a imóvel enquanto o contato é mantido.",
  ],
  [
    "presence-lingering-kiss",
    2,
    "Beijo Indelével",
    "Lingering Kiss",
    "Torna o Beijo uma lembrança sobrenaturalmente viciante e desejada.",
  ],
  [
    "presence-thrown-voice",
    3,
    "Voz Lançada",
    "Thrown Voice",
    "Faz a voz surgir de outro ponto visível, inclusive para conduzir outros poderes vocais.",
  ],
  [
    "presence-melpominee",
    2,
    "Melpominê",
    "Melpominee",
    "Imbui a voz de uma qualidade arrebatadora capaz de carregar a influência da Presença.",
  ],
  [
    "presence-dread-gaze",
    3,
    "Olhar Aterrorizante",
    "Dread Gaze",
    "Concentra terror predatório num alvo e pode fazê-lo recuar ou fugir.",
  ],
  [
    "presence-entrancement",
    3,
    "Transe",
    "Entrancement",
    "Provoca devoção e admiração intensas em uma pessoa específica.",
  ],
  [
    "presence-irresistible-voice",
    4,
    "Voz Irresistível",
    "Irresistible Voice",
    "Permite usar Dominação apenas por meio da voz, sem depender do olhar.",
  ],
  [
    "presence-summon",
    4,
    "Convocar",
    "Summon",
    "Chama sobrenaturalmente alguém já afetado pela Presença para que procure o vampiro.",
  ],
  [
    "presence-blow-edifice",
    4,
    "Suprar o Edifício",
    "Blow the Edifice",
    "Estende a aura emocional do vampiro a todo um edifício ou local.",
  ],
  [
    "presence-majesty",
    5,
    "Majestade",
    "Majesty",
    "Manifesta uma presença tão esmagadora que resistir ou agir contra o vampiro se torna extraordinário.",
  ],
  [
    "presence-star-magnetism",
    5,
    "Magnetismo de Estrela",
    "Star Magnetism",
    "Leva a Presença através de transmissões ao vivo e meios eletrônicos.",
  ],
];

const PROTEAN: readonly PowerSeed[] = [
  [
    "protean-eyes-beast",
    1,
    "Olhos da Besta",
    "Eyes of the Beast",
    "Permite enxergar na escuridão e manifesta olhos predatórios visíveis.",
  ],
  [
    "protean-weight-feather",
    1,
    "Peso da Pena",
    "Weight of the Feather",
    "Reduz o peso efetivo do corpo para cair, equilibrar-se e mover-se sem impacto normal.",
  ],
  [
    "protean-feral-weapons",
    2,
    "Armas Ferais",
    "Feral Weapons",
    "Faz brotar presas, garras ou outras armas naturais sobrenaturais.",
  ],
  [
    "protean-vicissitude",
    2,
    "Vicissitude",
    "Vicissitude",
    "Remodela a própria carne, músculos e ossos em alterações úteis, belas ou monstruosas.",
  ],
  [
    "protean-earth-meld",
    3,
    "Fusão com a Terra",
    "Earth Meld",
    "Afunda o corpo no solo para permanecer oculto e protegido durante o dia.",
  ],
  [
    "protean-shapechange",
    3,
    "Metamorfose",
    "Shapechange",
    "Transforma o corpo numa forma animal associada ao Sangue do vampiro.",
  ],
  [
    "protean-fleshcrafting",
    3,
    "Moldar a Carne",
    "Fleshcrafting",
    "Aplica a Vicissitude ao corpo de outra criatura, voluntária ou contida.",
  ],
  [
    "protean-metamorphosis",
    4,
    "Metamorfose Superior",
    "Metamorphosis",
    "Concede uma segunda forma animal mais perigosa ou adaptada.",
  ],
  [
    "protean-horrid-form",
    4,
    "Forma Horrenda",
    "Horrid Form",
    "Converte o corpo numa expressão monstruosa da Besta, armada e resistente.",
  ],
  [
    "protean-mist-form",
    5,
    "Forma de Névoa",
    "Mist Form",
    "Dissolve o corpo em névoa móvel, difícil de ferir ou conter.",
  ],
  [
    "protean-unfettered-heart",
    5,
    "Coração Livre",
    "The Unfettered Heart",
    "Torna os órgãos móveis e difíceis de localizar, protegendo contra estacamento.",
  ],
  [
    "protean-one-land",
    5,
    "Uno com a Terra",
    "One with the Land",
    "Funde-se a um domínio e percebe acontecimentos através da vida animal que o ocupa.",
  ],
];

const BLOOD_SORCERY: readonly PowerSeed[] = [
  [
    "blood-sorcery-corrosive-vitae",
    1,
    "Vitae Corrosiva",
    "Corrosive Vitae",
    "Torna a vitae capaz de corroer objetos inanimados.",
  ],
  [
    "blood-sorcery-taste-for-blood",
    1,
    "Um Gosto de Sangue",
    "A Taste for Blood",
    "Lê propriedades e sinais sobrenaturais presentes numa amostra de sangue.",
  ],
  [
    "blood-sorcery-extinguish-vitae",
    2,
    "Extinguir Vitae",
    "Extinguish Vitae",
    "Faz o Sangue de outro vampiro perder potência e aumentar sua Fome.",
  ],
  [
    "blood-sorcery-explore-secrets",
    2,
    "Explorar Segredos",
    "Explore Secrets",
    "Usa sangue como vínculo para encontrar informação oculta em uma coleção ou local de pesquisa.",
  ],
  [
    "blood-sorcery-blood-potency",
    3,
    "Sangue Potente",
    "Blood of Potency",
    "Eleva temporariamente a Potência do Sangue do feiticeiro.",
  ],
  [
    "blood-sorcery-scorpions-touch",
    3,
    "Toque do Escorpião",
    "Scorpion's Touch",
    "Transforma vitae em veneno capaz de debilitar uma vítima.",
  ],
  [
    "blood-sorcery-theft-vitae",
    4,
    "Roubo de Vitae",
    "Theft of Vitae",
    "Puxa sangue para fora de uma vítima e o leva até o feiticeiro à distância.",
  ],
  [
    "blood-sorcery-baals-caress",
    5,
    "Carícia de Baal",
    "Baal's Caress",
    "Cria um veneno de vitae especialmente destrutivo para vampiros.",
  ],
  [
    "blood-sorcery-cauldron-blood",
    5,
    "Caldeirão de Sangue",
    "Cauldron of Blood",
    "Faz o sangue de uma vítima ferver dentro de seu próprio corpo.",
  ],
];

const OBLIVION: readonly PowerSeed[] = [
  [
    "oblivion-ashes-to-ashes",
    1,
    "Cinzas às Cinzas",
    "Ashes to Ashes",
    "Desintegra um cadáver por meio da vitae, apagando vestígios físicos.",
  ],
  [
    "oblivion-sight",
    1,
    "Visão do Oblívio",
    "The Oblivion's Sight",
    "Enxerga em escuridão total e percebe fantasmas que não estejam ocultos.",
  ],
  [
    "oblivion-binding-fetter",
    1,
    "O Grilhão Vinculante",
    "The Binding Fetter",
    "Identifica objetos e lugares que prendem um espectro ao mundo dos vivos.",
  ],
  [
    "oblivion-shadow-cloak",
    1,
    "Manto de Sombras",
    "Shadow Cloak",
    "Reveste o usuário em sombras sobrenaturais que ocultam e intimidam.",
  ],
  [
    "oblivion-arms-ahriman",
    2,
    "Braços de Ahriman",
    "Arms of Ahriman",
    "Manifesta tentáculos de sombra capazes de agarrar e ferir.",
  ],
  [
    "oblivion-fatal-prediction",
    2,
    "Previsão Fatal",
    "Fatal Prediction",
    "Lê a proximidade e a forma provável da morte de uma pessoa.",
  ],
  [
    "oblivion-where-shroud-thins",
    2,
    "Onde o Véu se Torna Fino",
    "Where the Shroud Thins",
    "Avalia e explora locais em que a fronteira com os mortos está enfraquecida.",
  ],
  [
    "oblivion-shadow-cast",
    2,
    "Sombra Projetada",
    "Shadow Cast",
    "Separa e anima a sombra do vampiro para agir de modo antinatural.",
  ],
  [
    "oblivion-aura-decay",
    3,
    "Aura de Decomposição",
    "Aura of Decay",
    "Faz matéria orgânica, alimento e vitalidade se deteriorarem ao redor do usuário.",
  ],
  [
    "oblivion-passion-feast",
    3,
    "Banquete de Paixão",
    "Passion Feast",
    "Alimenta-se das emoções de um espectro e enfraquece sua presença.",
  ],
  [
    "oblivion-touch",
    3,
    "Toque do Oblívio",
    "Oblivion's Touch",
    "Fere e incapacita carne viva por um toque carregado de vazio.",
  ],
  [
    "oblivion-shadow-perspective",
    3,
    "Perspectiva da Sombra",
    "Shadow Perspective",
    "Projeta os sentidos em uma sombra distante que o usuário consegue perceber.",
  ],
  [
    "oblivion-shadow-servant",
    3,
    "Servo da Sombra",
    "Shadow Servant",
    "Anima a própria sombra como criatura obediente.",
  ],
  [
    "oblivion-stygian-shroud",
    4,
    "Mortalha Estígia",
    "Stygian Shroud",
    "Espalha uma escuridão sobrenatural que abafa visão, som e respiração.",
  ],
  [
    "oblivion-shadow-step",
    4,
    "Passo pelas Sombras",
    "Shadow Step",
    "Entra numa sombra e emerge de outra a uma distância limitada.",
  ],
  [
    "oblivion-necrotic-plague",
    4,
    "Praga Necrótica",
    "Necrotic Plague",
    "Infecta mortais com uma deterioração sobrenatural que pode se espalhar.",
  ],
  [
    "oblivion-tenebrous-avatar",
    5,
    "Avatar Tenebroso",
    "Tenebrous Avatar",
    "Transforma o corpo numa sombra viva capaz de atravessar frestas e envolver vítimas.",
  ],
  [
    "oblivion-skuld-fulfilled",
    5,
    "Skuld Cumprido",
    "Skuld Fulfilled",
    "Restaura temporariamente ao alvo mortal o destino físico que a morte interrompeu.",
  ],
];

const THIN_BLOOD_ALCHEMY: readonly PowerSeed[] = [
  [
    "tba-far-reach",
    1,
    "Longo Alcance",
    "Far Reach",
    "Move e manipula objetos à distância por força alquímica.",
  ],
  [
    "tba-haze",
    1,
    "Neblina",
    "Haze",
    "Produz uma névoa que encobre a área e dificulta a percepção.",
  ],
  [
    "tba-mercurian-tongue",
    1,
    "Língua Mercúria",
    "Mercurian Tongue",
    "Permite falar o idioma nativo do mortal cujo sangue integra a fórmula.",
  ],
  [
    "tba-plug-in",
    1,
    "Plug-in",
    "Plug-In",
    "Interage alquimicamente com equipamentos e sinais eletrônicos.",
  ],
  [
    "tba-friends-list",
    2,
    "Lista de Amigos",
    "Friends List",
    "Revela conexões sociais ou de Sangue ligadas a uma pessoa observada.",
  ],
  [
    "tba-envelop",
    2,
    "Envolver",
    "Envelop",
    "Cria uma névoa sufocante que persegue e envolve um alvo.",
  ],
  [
    "tba-mandragloire",
    3,
    "Mandagloire",
    "Mandagloire",
    "Produz um composto que impõe rigidez cadavérica a seres vivos e sobrenaturais.",
  ],
  ["tba-tank", 3, "Tanque", "Tank", "Concede resistência temporária contra ferimentos."],
  [
    "tba-defractionate",
    3,
    "Desfracionar",
    "Defractionate",
    "Restaura sangue preservado para que volte a alimentar um vampiro.",
  ],
  [
    "tba-profane-hieros-gamos",
    1,
    "Hieros Gamos Profano",
    "Profane Hieros Gamos",
    "Remodela de modo permanente características corporais do alquimista.",
  ],
  [
    "tba-short-circuit",
    4,
    "Curto-Circuito",
    "Short Circuit",
    "Interrompe equipamentos eletrônicos mediante toque e ativação alquímica.",
  ],
  [
    "tba-rumor",
    4,
    "Rumor",
    "Rumor",
    "Leva um alvo a aceitar uma declaração do alquimista como se fosse uma conclusão própria.",
  ],
  [
    "tba-toxic-personality",
    4,
    "Personalidade Tóxica",
    "Toxic Personality",
    "Faz o corpo secretar uma bile sobrenaturalmente corrosiva que destrói matéria e fere pelo contato.",
  ],
  [
    "tba-airborne-momentum",
    4,
    "Impulso Aéreo",
    "Airborne Momentum",
    "Permite deslocamento aéreo sobrenatural em grande velocidade.",
  ],
  [
    "tba-awaken-sleeper",
    5,
    "Despertar o Adormecido",
    "Awaken the Sleeper",
    "Desperta um vampiro do torpor sob condições alquímicas específicas.",
  ],
  [
    "tba-moment-clarity",
    5,
    "Momento de Clareza",
    "Moment of Clarity",
    "Concede por breve período uma lucidez e competência extraordinárias.",
  ],
  [
    "tba-blooming-amaranth",
    5,
    "Amaranto Florido",
    "Blooming Amaranth",
    "Compartilha uma forma alquímica de diablerie entre até três Sangues-Ralos vinculados pela fórmula.",
  ],
];

export const DISCIPLINE_CATALOG: readonly DisciplineCatalogItemView[] = [
  discipline(
    "discipline:animalism",
    "Animalismo",
    "Animalism",
    "Animalismo aproxima o vampiro da linguagem da Besta. Ele percebe impulsos predatórios, estabelece domínio sobre animais e, nos níveis mais profundos, projeta ou desloca a ferocidade que habita todos os Membros.",
    [244, 245, 246, 247, 248, 249],
    ANIMALISM,
  ),
  discipline(
    "discipline:auspex",
    "Auspícios",
    "Auspex",
    "Auspícios amplia sentidos e percepção sobrenaturais. Seus Poderes revelam presenças ocultas, emoções, pensamentos e sinais que escapam à observação comum.",
    [249, 250, 251, 252],
    AUSPEX,
  ),
  discipline(
    "discipline:celerity",
    "Celeridade",
    "Celerity",
    "Celeridade concede velocidade, equilíbrio e reação sobrenaturais. Seus Poderes permitem agir e se deslocar além dos limites de um corpo comum.",
    [252, 253, 254, 255],
    CELERITY,
  ),
  discipline(
    "discipline:dominate",
    "Dominação",
    "Dominate",
    "Dominação impõe vontade diretamente sobre outra mente. Ordens, lembranças e justificativas podem ser plantadas, apagadas ou remodeladas, sempre com o risco de reduzir uma pessoa a instrumento.",
    [255, 256, 257, 258],
    DOMINATE,
  ),
  discipline(
    "discipline:fortitude",
    "Fortitude",
    "Fortitude",
    "Fortitude faz do corpo e da mente muralhas contra dor, coerção e destruição. Não é apenas resistência: é a recusa sobrenatural em ceder quando carne, vontade ou identidade deveriam quebrar.",
    [258, 259, 260, 261],
    FORTITUDE,
  ),
  discipline(
    "discipline:obfuscate",
    "Ofuscação",
    "Obfuscate",
    "Ofuscação não torna apenas invisível: ela conduz a atenção para longe, altera a percepção e faz pessoas, objetos ou identidades escaparem da memória e dos sentidos de quem observa.",
    [261, 262, 263, 264],
    OBFUSCATE,
  ),
  discipline(
    "discipline:potence",
    "Potência",
    "Potence",
    "Potência é a força do Sangue manifestada sem medida humana. Ela permite saltos impossíveis, impactos devastadores, domínio físico e uma violência concentrada capaz de romper corpos e estruturas.",
    [264, 265, 266, 267],
    POTENCE,
  ),
  discipline(
    "discipline:presence",
    "Presença",
    "Presence",
    "Presença influencia as emoções de quem percebe o vampiro. Seus Poderes podem atrair, fascinar, intimidar ou provocar devoção sem controlar diretamente a mente do alvo.",
    [267, 268, 269, 270],
    PRESENCE,
  ),
  discipline(
    "discipline:protean",
    "Proteanismo",
    "Protean",
    "Proteanismo entrega o corpo à mutabilidade da Besta. Olhos, peso, armas naturais e forma deixam de ser limites fixos, até que o vampiro possa tornar-se animal, monstro, terra ou névoa.",
    [270, 271, 272, 273],
    PROTEAN,
  ),
  discipline(
    "discipline:blood-sorcery",
    "Feitiçaria de Sangue",
    "Blood Sorcery",
    "Feitiçaria de Sangue trata a vitae como matéria de estudo, arma e linguagem ritual. Seus praticantes analisam, enfraquecem, envenenam e comandam o Sangue com precisão terrível.",
    [273, 274, 275, 276, 277],
    BLOOD_SORCERY,
  ),
  discipline(
    "discipline:oblivion",
    "Oblívio",
    "Oblivion",
    "Oblívio toca a ausência que existe além da morte. Sombras, decomposição e espectros tornam-se extensões do vampiro, mas cada uso aproxima sua alma do vazio que pretende controlar.",
    [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97],
    OBLIVION,
    "SRC-0004",
  ),
  discipline(
    "discipline:thin-blood-alchemy",
    "Alquimia Sangue-Ralo",
    "Thin-Blood Alchemy",
    "Alquimia Sangue-Ralo converte a instabilidade do sangue diluído em fórmulas experimentais. O alquimista prepara efeitos por métodos próprios e pode imitar fragmentos de dons que seu Sangue não sustenta naturalmente.",
    [103, 104, 105, 106],
    THIN_BLOOD_ALCHEMY,
    "SRC-0004",
  ),
] as const;

const POWER_BY_ID = new Map(
  DISCIPLINE_CATALOG.flatMap((entry) => entry.powers).map((entry) => [entry.id, entry]),
);

export interface CreationDisciplineState {
  readonly disciplines: readonly CharacterDisciplineView[];
  readonly powers: readonly CharacterDisciplinePowerView[];
}

export interface CreationDisciplinePolicy {
  readonly allowedDisciplineIds: readonly CreationDisciplineId[];
  readonly family: "CAITIFF" | "CLAN" | "THIN_BLOOD";
  readonly hasIntrinsicDisciplines: boolean;
  readonly requiredRatings: readonly number[];
  readonly ruleRevision: string;
  readonly structuralMaximum: 5;
}

const STANDARD_DISCIPLINES = DISCIPLINE_CATALOG.map((entry) => entry.id).filter(
  (id) => id !== "discipline:thin-blood-alchemy",
);

export function resolveCreationDisciplinePolicy(
  originId: CreationOriginId,
): CreationDisciplinePolicy {
  const origin = CREATION_ORIGIN_CATALOG.find((item) => item.id === originId);
  if (origin === undefined) throw new Error(`Unknown creation origin: ${originId}`);
  if (origin.kind === "CLAN_VAMPIRE") {
    return {
      allowedDisciplineIds: origin.disciplines,
      family: "CLAN",
      hasIntrinsicDisciplines: true,
      requiredRatings: [2, 1],
      ruleRevision: CREATION_DISCIPLINES_POLICY_REVISION,
      structuralMaximum: 5,
    };
  }
  if (origin.kind === "CAITIFF") {
    return {
      allowedDisciplineIds: STANDARD_DISCIPLINES,
      family: "CAITIFF",
      hasIntrinsicDisciplines: true,
      requiredRatings: [2, 1],
      ruleRevision: CREATION_DISCIPLINES_POLICY_REVISION,
      structuralMaximum: 5,
    };
  }
  return {
    allowedDisciplineIds: ["discipline:thin-blood-alchemy"],
    family: "THIN_BLOOD",
    hasIntrinsicDisciplines: false,
    requiredRatings: [],
    ruleRevision: CREATION_DISCIPLINES_POLICY_REVISION,
    structuralMaximum: 5,
  };
}

export function eligibleDisciplinePowers(
  disciplineId: CreationDisciplineId,
  maximumPowerLevel: number,
  acquiredPowerIds: readonly DisciplinePowerId[],
  ratings: ReadonlyMap<CreationDisciplineId, number>,
): readonly DisciplinePowerCatalogItemView[] {
  const disciplineEntry = DISCIPLINE_CATALOG.find((entry) => entry.id === disciplineId);
  if (disciplineEntry === undefined) return [];
  return disciplineEntry.powers.filter(
    (candidate) =>
      candidate.level <= maximumPowerLevel &&
      !acquiredPowerIds.includes(candidate.id) &&
      candidate.prerequisites.every((id) => acquiredPowerIds.includes(id)) &&
      candidate.prerequisitePowerOptions.every((options) =>
        options.some((id) => acquiredPowerIds.includes(id)),
      ) &&
      candidate.amalgamRequirements.every(
        (requirement) =>
          (ratings.get(requirement.disciplineId) ?? 0) >= requirement.rating,
      ),
  );
}

export function evaluateCreationDisciplines(
  state: CreationDisciplineState,
  policy: CreationDisciplinePolicy,
): CreationDisciplinesEvaluationView {
  const violations: CreationDisciplinesViolation[] = [];
  const ratings = new Map<CreationDisciplineId, number>();
  for (const item of state.disciplines) {
    if (!policy.allowedDisciplineIds.includes(item.disciplineId))
      violations.push({
        code: "DISCIPLINE_NOT_ALLOWED",
        path: ["disciplines", item.disciplineId],
      });
    if (
      !Number.isInteger(item.rating) ||
      item.rating < 0 ||
      item.rating > DISCIPLINE_STRUCTURAL_MAXIMUM
    )
      violations.push({
        code: "DISCIPLINE_RATING_INVALID",
        path: ["disciplines", item.disciplineId],
      });
    if (ratings.has(item.disciplineId))
      violations.push({
        code: "DISCIPLINE_DUPLICATE",
        path: ["disciplines", item.disciplineId],
      });
    ratings.set(item.disciplineId, item.rating);
  }
  const activeRatings = [...ratings.values()]
    .filter((value) => value > 0)
    .sort((a, b) => b - a);
  if (
    policy.hasIntrinsicDisciplines &&
    (activeRatings.length > 2 || activeRatings.some((value) => value > 2))
  )
    violations.push({
      code: "CREATION_DISCIPLINE_DISTRIBUTION_EXCEEDED",
      path: ["disciplines"],
    });
  const powerIds = state.powers.map((item) => item.powerId);
  if (new Set(powerIds).size !== powerIds.length)
    violations.push({ code: "DISCIPLINE_POWER_DUPLICATE", path: ["powerIds"] });
  for (const acquired of state.powers) {
    const catalogPower = POWER_BY_ID.get(acquired.powerId);
    if (catalogPower === undefined || catalogPower.disciplineId !== acquired.disciplineId)
      violations.push({
        code: "DISCIPLINE_POWER_UNKNOWN",
        path: ["powerIds", acquired.powerId],
      });
    else if (catalogPower.level > (ratings.get(acquired.disciplineId) ?? 0))
      violations.push({
        code: "DISCIPLINE_POWER_LEVEL_INSUFFICIENT",
        path: ["powerIds", acquired.powerId],
      });
    else {
      if (
        !catalogPower.prerequisites.every((id) => powerIds.includes(id)) ||
        !catalogPower.prerequisitePowerOptions.every((options) =>
          options.some((id) => powerIds.includes(id)),
        )
      )
        violations.push({
          code: "DISCIPLINE_POWER_PREREQUISITE_MISSING",
          path: ["powerIds", acquired.powerId],
        });
      if (
        !catalogPower.amalgamRequirements.every(
          (requirement) =>
            (ratings.get(requirement.disciplineId) ?? 0) >= requirement.rating,
        )
      )
        violations.push({
          code: "DISCIPLINE_POWER_AMALGAM_MISSING",
          path: ["powerIds", acquired.powerId],
        });
    }
  }
  const powerAdjustments: Array<
    CreationDisciplinesEvaluationView["powerAdjustments"][number]
  > = [];
  for (const disciplineId of policy.allowedDisciplineIds) {
    const acquiredForDiscipline = state.powers.filter(
      (item) => item.disciplineId === disciplineId,
    );
    const disciplineRating = ratings.get(disciplineId) ?? 0;
    const incompatiblePowerIds = acquiredForDiscipline.flatMap((item) => {
      const catalogPower = POWER_BY_ID.get(item.powerId);
      return catalogPower !== undefined && catalogPower.level > disciplineRating
        ? [item.powerId]
        : [];
    });
    const minimumRequiredRemovals = Math.max(
      incompatiblePowerIds.length,
      acquiredForDiscipline.length - disciplineRating,
    );
    if (minimumRequiredRemovals > 0)
      powerAdjustments.push({
        disciplineId,
        incompatiblePowerIds,
        minimumRequiredRemovals,
        targetRating: disciplineRating,
      });
    if (acquiredForDiscipline.length > disciplineRating)
      violations.push({
        code: "DISCIPLINE_POWER_COUNT_EXCEEDED",
        path: ["powerIds", disciplineId],
      });
    const acquiredLevels = acquiredForDiscipline
      .map((item) => POWER_BY_ID.get(item.powerId)?.level ?? 99)
      .sort((a, b) => a - b);
    if (acquiredLevels.some((level, index) => level > index + 1))
      violations.push({
        code: "DISCIPLINE_POWER_LEVEL_SLOT_INVALID",
        path: ["powerIds", disciplineId],
      });
  }
  const pendingPowerChoices = state.disciplines.flatMap((item) => {
    const acquired = state.powers.filter(
      (powerItem) => powerItem.disciplineId === item.disciplineId,
    );
    return Array.from(
      { length: Math.max(0, item.rating - acquired.length) },
      (_, index) => ({
        disciplineId: item.disciplineId,
        eligiblePowerIds: eligibleDisciplinePowers(
          item.disciplineId,
          acquired.length + index + 1,
          powerIds,
          ratings,
        ).map((candidate) => candidate.id),
        ordinal: acquired.length + index + 1,
      }),
    );
  });
  const distributionComplete =
    policy.requiredRatings.length === 0
      ? state.disciplines.every((item) => item.rating === 0)
      : activeRatings.length === policy.requiredRatings.length &&
        activeRatings.every((value, index) => value === policy.requiredRatings[index]);
  return {
    complete:
      violations.length === 0 && distributionComplete && pendingPowerChoices.length === 0,
    pendingPowerChoices,
    powerAdjustments,
    violations,
  };
}
