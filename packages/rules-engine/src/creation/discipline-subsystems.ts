import {
  THIN_BLOOD_ALCHEMY_FORMULA_CATALOG,
  type CharacterDisciplinePowerView,
  type CharacterDisciplineView,
  type DisciplinePowerId,
  type PowerRuleAuditStatus,
  type RuleTranslationStatus,
  type ThinBloodAlchemyFormulaId,
  type ThinBloodAlchemyMethod,
} from "./disciplines.js";

export type DisciplineSubsystemSourceRef = Readonly<{
  pages: readonly number[];
  sourceId: "SRC-0001" | "SRC-0003" | "SRC-0004";
}>;

interface AuditedSubsystemItem {
  readonly auditStatus: Exclude<PowerRuleAuditStatus, "PENDING">;
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly nameOriginal: string;
  readonly namePtBr: string;
  readonly ruleRevisionId: string;
  readonly sourceRefs: readonly DisciplineSubsystemSourceRef[];
  readonly translationStatus: RuleTranslationStatus;
}

export type BloodSorceryRitualId = `ritual:blood-sorcery:${string}`;
export interface BloodSorceryRitualCatalogItem extends AuditedSubsystemItem {
  readonly id: BloodSorceryRitualId;
  readonly ingredientsPtBr: readonly string[];
  readonly processPtBr: readonly string[];
  readonly rule: Readonly<{
    castTime: string;
    cost: string;
    dicePool: string;
    difficulty: string;
    duration: string | null;
    restrictionsPtBr: readonly string[];
    systemStepsPtBr: readonly string[];
  }>;
}

export type OblivionCeremonyId = `ceremony:oblivion:${string}`;
export interface OblivionCeremonyCatalogItem extends AuditedSubsystemItem {
  readonly id: OblivionCeremonyId;
  readonly ingredientsPtBr: readonly string[];
  readonly prerequisitePowerId: DisciplinePowerId;
  readonly processPtBr: readonly string[];
  readonly rule: Readonly<{
    castTime: string;
    cost: string;
    dicePool: string;
    difficulty: string;
    duration: string | null;
    restrictionsPtBr: readonly string[];
    systemStepsPtBr: readonly string[];
  }>;
}

export interface CreationDisciplineSubsystemState {
  readonly bloodSorceryRitualIds: readonly BloodSorceryRitualId[];
  readonly disciplines: readonly CharacterDisciplineView[];
  readonly oblivionCeremonyIds: readonly OblivionCeremonyId[];
  readonly powers: readonly CharacterDisciplinePowerView[];
  readonly thinBloodAlchemyFormulaIds: readonly ThinBloodAlchemyFormulaId[];
  readonly thinBloodAlchemyMethod: ThinBloodAlchemyMethod | null;
}

export type PendingCreationDisciplineSubchoice =
  | Readonly<{
      eligibleIds: readonly BloodSorceryRitualId[];
      kind: "BLOOD_SORCERY_RITUAL";
      ordinal: 1;
    }>
  | Readonly<{
      eligibleIds: readonly OblivionCeremonyId[];
      kind: "OBLIVION_CEREMONY";
      ordinal: 1;
    }>
  | Readonly<{
      eligibleIds: readonly ThinBloodAlchemyMethod[];
      kind: "THIN_BLOOD_ALCHEMY_METHOD";
      ordinal: 1;
    }>
  | Readonly<{
      eligibleIds: readonly ThinBloodAlchemyFormulaId[];
      kind: "THIN_BLOOD_ALCHEMY_FORMULA";
      ordinal: number;
    }>;

export const BLOOD_SORCERY_RITUAL_CATALOG_REVISION =
  "CATALOG-BLOOD-SORCERY-RITUALS-V5-CORE-PG-2023-r1";
export const OBLIVION_CEREMONY_CATALOG_REVISION =
  "CATALOG-OBLIVION-CEREMONIES-V5-PG-2023-r1";

const source = (
  sourceId: DisciplineSubsystemSourceRef["sourceId"],
  ...pages: number[]
): DisciplineSubsystemSourceRef => ({ pages, sourceId });

export const BLOOD_SORCERY_RITUAL_EXECUTION_POLICY = {
  beneficialTarget: "Somente o próprio conjurador, salvo exceção expressa do Ritual",
  castTime: "Cinco minutos por nível, salvo exceção expressa do Ritual",
  cost: "Uma Checagem de Sangue, salvo exceção expressa do Ritual",
  dicePool: "Inteligência + Feitiçaria de Sangue",
  difficultyFormula: "nível do Ritual + 1",
  sourceRefs: [source("SRC-0001", 274)],
  wards: {
    affectedIntruderRetry: {
      cost: "Um ponto de Força de Vontade",
      test: "Vigor + Determinação",
      difficulty: "4; 7 contra Proteção obtida com vitória crítica",
    },
    areaLimit: "Aproximadamente um metro do objeto",
    criticalWinDamage: "Três pontos de dano Agravado à Vitalidade",
    detectionContest:
      "Inteligência + Auspícios vs. Inteligência + Feitiçaria de Sangue do conjurador",
    duration: "Até o objeto ser fisicamente destruído ou a inscrição ser quebrada",
    forcedContactTriggersWard: false,
    ritualRollTiming: "Na primeira vez em que um intruso toca a Proteção",
    successDamage: "Um ponto de dano Agravado à Vitalidade",
  },
  wardingCircles: {
    castTime: "Uma noite inteira",
    cost: "Três Checagens de Sangue",
    crossingContest: "Inteligência + Feitiçaria de Sangue vs. Força de Vontade",
    criticalWinDamage: "Três pontos de dano Agravado à Vitalidade",
    defaultDuration: "Até o amanhecer",
    extendedDuration: "Um ano e um dia",
    extendedDurationDifficultyModifier: 2,
    failedCircleAllowsEntry: true,
    ingredientMultiplier: 3,
    radiusLimitMeters: 3,
    retryAfterCasterWin: {
      cost: "Um ponto de Força de Vontade",
      contest: "Repetir a disputa",
    },
    successDamage: "Três pontos de dano Superficial à Vitalidade e entrada bloqueada",
  },
} as const;

export const OBLIVION_CEREMONY_EXECUTION_POLICY = {
  beneficialTarget: "Somente o próprio conjurador, salvo exceção expressa da Cerimônia",
  castTime: "Cinco minutos por nível, salvo exceção expressa da Cerimônia",
  cost: "Uma Checagem de Sangue, salvo exceção expressa da Cerimônia",
  dicePool: "Determinação + Oblívio",
  difficultyFormula: "nível da Cerimônia + 1",
  requiresMatchingPrerequisitePower: true,
  sourceRefs: [source("SRC-0004", 91, 92)],
  temporaryOblivionAccessGrantsCeremonies: false,
} as const;

interface RitualSeed {
  readonly castTime?: string;
  readonly id: string;
  readonly ingredientsPtBr: readonly string[];
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly nameOriginal: string;
  readonly namePtBr: string;
  readonly page: number;
  readonly processPtBr: readonly string[];
  readonly sourceId: "SRC-0001" | "SRC-0004";
  readonly systemStepsPtBr: readonly string[];
  readonly duration?: string;
  readonly cost?: string;
  readonly dicePool?: string;
  readonly difficulty?: string;
  readonly restrictionsPtBr?: readonly string[];
}

const ritual = (seed: RitualSeed): BloodSorceryRitualCatalogItem => ({
  auditStatus: "VERIFIED",
  id: `ritual:blood-sorcery:${seed.id}`,
  ingredientsPtBr: seed.ingredientsPtBr,
  level: seed.level,
  nameOriginal: seed.nameOriginal,
  namePtBr: seed.namePtBr,
  processPtBr: seed.processPtBr,
  rule: {
    castTime: seed.castTime ?? "Cinco minutos por nível",
    cost: seed.cost ?? "Uma Checagem de Sangue",
    dicePool: seed.dicePool ?? "Inteligência + Feitiçaria de Sangue",
    difficulty: seed.difficulty ?? `Nível do Ritual + 1 (${seed.level + 1})`,
    duration: seed.duration ?? null,
    restrictionsPtBr: seed.restrictionsPtBr ?? [],
    systemStepsPtBr: seed.systemStepsPtBr,
  },
  ruleRevisionId: BLOOD_SORCERY_RITUAL_CATALOG_REVISION,
  sourceRefs: [source(seed.sourceId, seed.page)],
  translationStatus:
    seed.sourceId === "SRC-0001" ? "OFFICIAL_PT_BR" : "CONTROLLED_CANDIDATE",
});

export const BLOOD_SORCERY_RITUAL_CATALOG: readonly BloodSorceryRitualCatalogItem[] = [
  ritual({
    id: "clinging-of-the-insect",
    ingredientsPtBr: ["Uma aranha viva"],
    level: 1,
    nameOriginal: "Clinging of the Insect",
    namePtBr: "Aderência do Inseto",
    page: 276,
    processPtBr: ["Misture a aranha esmagada à vitae e ingira a mistura."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vitória permite aderir a paredes e tetos durante uma cena; uma vitória crítica amplia para uma noite.",
      "As duas mãos e os dois pés precisam permanecer em contato e o deslocamento ocorre aproximadamente à metade da velocidade normal.",
    ],
    duration: "Uma cena; uma noite em vitória crítica",
  }),
  ritual({
    id: "blood-walk",
    ingredientsPtBr: [
      "Um copo de prata",
      "Sangue do alvo equivalente a uma Checagem de Sangue",
    ],
    level: 1,
    nameOriginal: "Blood Walk",
    namePtBr: "Caminho do Sangue",
    page: 276,
    castTime: "Uma hora",
    processPtBr: [
      "Misture a própria vitae à amostra e recite o encanto por cerca de uma hora.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vitória revela a geração e o nome do alvo e de seu Senhor.",
      "Uma vitória crítica também revela Laços de Sangue ativos no alvo e a posição dele em cada Laço.",
    ],
    duration: "Não aplicável",
  }),
  ritual({
    id: "craft-bloodstone",
    ingredientsPtBr: [
      "Seixo de minério de ferro ou pequeno ímã",
      "Um litro de sangue",
      "Tigela de prata",
    ],
    level: 1,
    nameOriginal: "Craft Bloodstone",
    namePtBr: "Criar Pedra de Sangue",
    page: 276,
    castTime: "Três noites",
    processPtBr: ["Faça o seixo absorver a mistura durante três noites de cânticos."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Após a rolagem na terceira noite, a pedra passa a indicar infalivelmente direção e distância ao conjurador.",
      "O vínculo termina quando a pedra é destruída ou depois de uma semana; o limite simultâneo é igual à Determinação do conjurador.",
    ],
    duration: "Uma semana ou até a pedra ser destruída",
  }),
  ritual({
    id: "wake-with-evenings-freshness",
    ingredientsPtBr: ["Ossos e penas calcinados de um galo"],
    level: 1,
    nameOriginal: "Wake with Evening's Freshness",
    namePtBr: "Despertar com o Frescor do Anoitecer",
    page: 276,
    processPtBr: [
      "Trace com cinzas e vitae um círculo ao redor do local de repouso antes do amanhecer.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "A rolagem só ocorre quando surge perigo real durante o dia; em vitória o conjurador desperta completamente alerta.",
      "Enquanto a crise durar, ignore as penalidades normais por permanecer acordado; em vitória crítica, o benefício dura até o próximo amanhecer.",
    ],
    duration: "Durante a crise; até o próximo amanhecer em vitória crítica",
  }),
  ritual({
    id: "ward-against-ghouls",
    ingredientsPtBr: ["Vitae do conjurador"],
    level: 1,
    nameOriginal: "Ward Against Ghouls",
    namePtBr: "Proteção contra Carniçais",
    page: 276,
    processPtBr: ["Inscreva no objeto o glifo de Proteção com a própria vitae."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique integralmente as regras gerais de Proteções contra qualquer carniçal que tocar o objeto.",
    ],
    duration: "Até o objeto ser destruído ou a inscrição ser quebrada",
  }),
  ritual({
    id: "warding-circle-against-ghouls",
    ingredientsPtBr: ["Osso humano mergulhado em vitae"],
    level: 2,
    nameOriginal: "Warding Circle Against Ghouls",
    namePtBr: "Círculo de Proteção contra Carniçais",
    page: 277,
    castTime: "Uma noite inteira",
    processPtBr: ["Desenhe no piso ou solo o círculo com o osso preparado."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Círculos de Proteção contra carniçais que tentarem cruzá-lo.",
    ],
    cost: "Três Checagens de Sangue para o círculo",
    duration: "Até o amanhecer; um ano e um dia com a conjuração ampliada",
  }),
  ritual({
    id: "communicate-with-kindsire",
    ingredientsPtBr: ["Objeto que pertenceu ao Senhor", "Tigela de prata com água limpa"],
    level: 2,
    nameOriginal: "Communicate with Kindred Sire",
    namePtBr: "Comunicação com o Senhor do Membro",
    page: 277,
    castTime: "Quinze minutos até a rolagem; quinze minutos adicionais até a conexão",
    processPtBr: [
      "Submerja o objeto, verta vitae na água e concentre-se na última lembrança do Senhor.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Role após quinze minutos; uma vitória abre comunicação mental bilateral por dez minutos depois de mais quinze minutos.",
      "Uma vitória crítica torna a conexão imediata; perturbação séria em qualquer lado a encerra.",
    ],
    duration: "Dez minutos",
  }),
  ritual({
    id: "illuminate-trail-of-prey",
    ingredientsPtBr: ["Fita branca de cetim"],
    level: 2,
    nameOriginal: "Illuminate the Trail of Prey",
    namePtBr: "Iluminar o Rastro da Presa",
    page: 277,
    processPtBr: ["Embeba a fita na própria vitae e incendeie-a pelo Ritual."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Depois de a fita ser consumida, perceba o rastro sutil de alvo conhecido e visto nas últimas 24 horas.",
      "Para seguir o rastro, teste Inteligência + Sobrevivência contra Dificuldade 6 menos a margem do Ritual.",
    ],
    duration: "Uma noite; duas noites em vitória crítica",
  }),
  ritual({
    id: "eyes-of-babel",
    ingredientsPtBr: ["Um olho e uma língua frescos da mesma pessoa"],
    level: 2,
    nameOriginal: "Eyes of Babel",
    namePtBr: "Olhos de Babel",
    page: 277,
    processPtBr: ["Mastigue e engula os ingredientes retirados da vítima."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vitória permite ler e falar todos os idiomas conhecidos pela vítima com a competência dela.",
    ],
    duration: "Uma semana; um mês em vitória crítica",
  }),
  ritual({
    id: "ward-against-spirits",
    ingredientsPtBr: ["Sal ou pó de tijolo", "Vitae do conjurador"],
    level: 2,
    nameOriginal: "Ward Against Spirits",
    namePtBr: "Proteção contra Espíritos",
    page: 278,
    processPtBr: ["Inscreva no objeto a mistura preparada."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Proteções a seres incorpóreos que toquem, atravessem ou manipulem o objeto.",
    ],
    duration: "Até o objeto ser destruído ou a inscrição ser quebrada",
  }),
  ritual({
    id: "truth-of-blood",
    ingredientsPtBr: ["Uma pequena amostra de sangue do alvo"],
    level: 2,
    nameOriginal: "Truth of Blood",
    namePtBr: "Verdade do Sangue",
    page: 278,
    processPtBr: [
      "Misture a amostra à própria vitae em recipiente que permita mergulhar um dedo.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Para cada afirmação, dispute Determinação + Feitiçaria de Sangue contra Autocontrole + Ocultismo; a primeira derrota encerra o Ritual.",
      "A vitória informa se o alvo acredita dizer a verdade; vitória crítica extrai detalhes subconscientes, mas não restaura memórias apagadas.",
    ],
    dicePool: "Determinação + Feitiçaria de Sangue vs. Autocontrole + Ocultismo",
    difficulty: "Teste resistido",
    duration: "Uma cena ou até a primeira derrota",
  }),
  ritual({
    id: "firewalker",
    ingredientsPtBr: ["Ponta de um dedo do conjurador", "Tigela ou cálice dourado"],
    level: 3,
    nameOriginal: "Firewalker",
    namePtBr: "Andarilho do Fogo",
    page: 278,
    processPtBr: ["Queime a ponta do dedo com vitae no recipiente."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Com a preparação bem-sucedida, cada alvo indicado sofre metade do dano causado por fogo durante a noite.",
    ],
    difficulty: "3 para a preparação, além da rolagem do Ritual quando aplicável",
    duration: "Uma noite",
  }),
  ritual({
    id: "dagons-call",
    ingredientsPtBr: [
      "Adaga cerimonial incrustada de ouro",
      "Exposição prévia do alvo à vitae do conjurador",
    ],
    level: 3,
    nameOriginal: "Dagon's Call",
    namePtBr: "O Chamado de Dagon",
    page: 278,
    processPtBr: [
      "Entre uma hora e uma semana após a exposição, perfure a própria pele e derrame vitae com a adaga.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Dispute Determinação + Feitiçaria de Sangue contra Vigor + Determinação.",
      "Cada ponto de margem causa um dano Agravado a mortais ou Superficial não reduzido a vampiros; até duas repetições exigem nova Checagem de Sangue cada.",
    ],
    dicePool: "Determinação + Feitiçaria de Sangue vs. Vigor + Determinação",
    difficulty: "Teste resistido",
    duration: "Resolução imediata; até duas repetições",
  }),
  ritual({
    id: "warding-circle-against-spirits",
    ingredientsPtBr: ["Faca de ferro mergulhada em sal e vitae"],
    level: 3,
    nameOriginal: "Warding Circle Against Spirits",
    namePtBr: "Círculo de Proteção contra Espíritos",
    page: 279,
    castTime: "Uma noite inteira",
    processPtBr: ["Desenhe com a faca preparada o círculo no piso ou solo."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Círculos de Proteção contra seres incorpóreos.",
    ],
    cost: "Três Checagens de Sangue para o círculo",
    duration: "Até o amanhecer; um ano e um dia com a conjuração ampliada",
  }),
  ritual({
    id: "deflection-of-wooden-doom",
    ingredientsPtBr: ["Lascas e rebarbas de madeira"],
    level: 3,
    nameOriginal: "Deflection of Wooden Doom",
    namePtBr: "Deflecção da Ruína de Madeira",
    page: 279,
    castTime: "Uma hora",
    processPtBr: [
      "Trace um círculo com a mistura, medite uma hora e mantenha uma lasca sob a língua.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "A rolagem só ocorre quando uma tentativa real de estaquear alcança a pele; em vitória, a estaca se despedaça.",
      "Vitória crítica também cega o atacante por dois turnos.",
    ],
    duration: "Até o fim da noite ou a remoção da lasca",
  }),
  ritual({
    id: "essence-of-air",
    ingredientsPtBr: ["Folhas e frutos de beladona", "Vitae do conjurador"],
    level: 3,
    nameOriginal: "Essence of Air",
    namePtBr: "Essência do Ar",
    page: 279,
    processPtBr: ["Reduza a infusão enquanto pronuncia as palavras do Ritual."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "A poção válida por uma noite permite apenas ao conjurador voar à velocidade de corrida durante uma cena.",
      "Carregar massa humana reduz a velocidade; oposição física usa Força + Feitiçaria de Sangue contra Força + Atletismo.",
    ],
    duration: "Uma cena após ingerida; a poção conserva potência por uma noite",
  }),
  ritual({
    id: "ward-against-lupines",
    ingredientsPtBr: ["Prata em pó", "Vitae do conjurador"],
    level: 3,
    nameOriginal: "Ward Against Lupines",
    namePtBr: "Proteção contra Lupinos",
    page: 279,
    processPtBr: ["Inscreva no objeto o glifo com a mistura."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Proteções contra lobisomens em qualquer forma.",
    ],
    duration: "Até o objeto ser destruído ou a inscrição ser quebrada",
  }),
  ritual({
    id: "warding-circle-against-lupines",
    ingredientsPtBr: ["Faca de prata mergulhada em acônito e vitae"],
    level: 4,
    nameOriginal: "Warding Circle Against Lupines",
    namePtBr: "Círculo de Proteção contra Lupinos",
    page: 279,
    castTime: "Uma noite inteira",
    processPtBr: ["Desenhe no piso ou solo o círculo com a faca preparada."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Círculos de Proteção contra lobisomens em qualquer forma.",
    ],
    cost: "Três Checagens de Sangue para o círculo",
    duration: "Até o amanhecer; um ano e um dia com a conjuração ampliada",
  }),
  ritual({
    id: "defense-of-sacred-haven",
    ingredientsPtBr: ["Vitae do conjurador"],
    level: 4,
    nameOriginal: "Defense of the Sacred Haven",
    namePtBr: "Defesa do Refúgio Sagrado",
    page: 279,
    castTime: "Uma hora ou mais, conforme a área protegida",
    processPtBr: [
      "Inscreva sigilos por pelo menos uma hora numa área de raio máximo de seis metros e permaneça nela.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Ao nascer do sol, uma vitória cobre a área de sombra e impede dano por luz solar aos vampiros dentro dela.",
      "O efeito termina se o conjurador deixar a área; vitória crítica permite observar vagamente o exterior.",
    ],
    duration: "Um dia ou até o conjurador deixar a área",
  }),
  ritual({
    id: "eyes-of-the-nighthawk",
    ingredientsPtBr: ["Ave carnívora alimentada com a vitae do conjurador"],
    level: 4,
    nameOriginal: "Eyes of the Nighthawk",
    namePtBr: "Olhos do Falcão Noturno",
    page: 280,
    processPtBr: ["Alimente a ave e entre em transe para possuí-la."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vitória permite dirigir o voo e perceber pelos sentidos da ave sem limite de distância.",
      "Vitória crítica permite ações simples; não arrancar os olhos da ave no fim impõe cegueira ao conjurador pelas três noites seguintes.",
    ],
    duration: "Uma noite",
  }),
  ritual({
    id: "incorporeal-passage",
    ingredientsPtBr: ["Um espelho", "Vitae do conjurador"],
    level: 4,
    nameOriginal: "Incorporeal Passage",
    namePtBr: "Passagem Incorpórea",
    page: 280,
    processPtBr: ["Salpique vitae, entoe o cântico e quebre o espelho."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Enquanto segura um caco, o conjurador fica incorpóreo e atravessa matéria em linha reta, mas não interage fisicamente nem usa o Sangue.",
      "Fogo, luz solar e efeitos capazes de ferir espíritos continuam válidos; soltar o caco encerra o estado.",
    ],
    duration: "Uma cena ou até soltar o caco",
  }),
  ritual({
    id: "ward-against-cainites",
    ingredientsPtBr: ["Cinzas quentes de fogo ainda aceso", "Vitae do conjurador"],
    level: 4,
    nameOriginal: "Ward Against Cainites",
    namePtBr: "Proteção contra Cainitas",
    page: 280,
    processPtBr: ["Inscreva no objeto o glifo com cinzas e vitae."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Proteções contra qualquer vampiro exceto o conjurador.",
    ],
    duration: "Até o objeto ser destruído ou a inscrição ser quebrada",
  }),
  ritual({
    id: "warding-circle-against-cainites",
    ingredientsPtBr: [
      "Varinha de sorveira mergulhada em vitae e cinzas de fogo ainda aceso",
    ],
    level: 5,
    nameOriginal: "Warding Circle Against Cainites",
    namePtBr: "Círculo de Proteção contra Cainitas",
    page: 280,
    castTime: "Uma noite inteira",
    processPtBr: ["Desenhe o círculo com a varinha preparada."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Aplique as regras gerais de Círculos de Proteção contra vampiros, exceto o conjurador.",
    ],
    cost: "Três Checagens de Sangue para o círculo",
    duration: "Até o amanhecer; um ano e um dia com a conjuração ampliada",
  }),
  ritual({
    id: "heart-of-stone",
    ingredientsPtBr: ["Laje de pedra", "Vela de cera embebida em vitae"],
    level: 5,
    nameOriginal: "Heart of Stone",
    namePtBr: "Coração de Pedra",
    page: 281,
    castTime: "Uma noite",
    processPtBr: [
      "Permaneça deitado enquanto a vela queima sobre o peito durante uma noite e resista ao frenesi de terror.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vitória torna o coração impenetrável por estacas, mas impõe três dados de penalidade a Remorso e testes Sociais ativos, salvo Intimidação e Dominação.",
      "Presença não pode ser usada e o conjurador ganha três dados para resisti-la; repetir o Ritual reverte o efeito.",
    ],
    duration: "Indefinida, até o Ritual ser repetido para reversão",
  }),
  ritual({
    id: "escape-to-true-sanctuary",
    ingredientsPtBr: [
      "Dois círculos carbonizados de aproximadamente um metro de diâmetro",
    ],
    level: 5,
    nameOriginal: "Escape to True Sanctuary",
    namePtBr: "Fuga para o Verdadeiro Santuário",
    page: 281,
    castTime: "Duas horas",
    processPtBr: [
      "Consagre durante duas horas um círculo de partida e outro de chegada em construções fixas.",
    ],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "Uma vez por cena, concentre-se um turno e role o Ritual para transportar-se instantaneamente ao círculo de chegada.",
      "É possível levar uma pessoa ou massa equivalente; dano a qualquer círculo encerra o vínculo e só um par pode estar ativo.",
    ],
    duration: "Até um círculo ser danificado ou outro par ser criado",
  }),
  ritual({
    id: "shaft-of-belated-dissolution",
    ingredientsPtBr: [
      "Estaca de sorveira inscrita com runas",
      "Vitae equivalente a duas Checagens de Sangue",
    ],
    level: 5,
    nameOriginal: "Shaft of Belated Dissolution",
    namePtBr: "Fuste de Extinção Tardia",
    page: 281,
    processPtBr: ["Embeba e prepare a estaca sobre fogo de carvalho conforme o rito."],
    sourceId: "SRC-0001",
    systemStepsPtBr: [
      "A estaca preparada conserva as regras especiais do Ritual quando usada contra um vampiro, independentemente de quem a empunha.",
      "Com margem de ataque igual ou superior a cinco, o alvo é destruído em um turno; caso contrário, o fuste avança até o coração conforme a regra do Ritual.",
      "Uma terceira pessoa pode extrair a ponta com Destreza + Medicina na Dificuldade 6 em até quatro horas; sem isso, só amputação antes de ela alcançar o tronco evita a progressão.",
    ],
    cost: "Vitae equivalente a duas Checagens de Sangue durante a preparação",
    duration: "Até a estaca ser destruída ou cumprir seu efeito",
  }),
  ritual({
    id: "douse-the-fear",
    ingredientsPtBr: ["Objeto sagrado exposto à chama"],
    level: 1,
    nameOriginal: "Douse the Fear",
    namePtBr: "Extinguir o Medo",
    page: 99,
    processPtBr: ["Toque o objeto sagrado com fogo durante a conjuração."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória concede dois dados para resistir ao frenesi de terror; vitória crítica elimina esses testes durante a noite.",
    ],
    duration: "Uma noite",
  }),
  ritual({
    id: "seal-the-brand",
    ingredientsPtBr: ["Prata derretida"],
    level: 1,
    nameOriginal: "Seal the Brand",
    namePtBr: "Selar a Marca",
    page: 99,
    processPtBr: [
      "Derrame a prata sobre tatuagem, marca, cicatriz ou modificação corporal.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória torna a modificação parte permanente do corpo morto-vivo; o processo causa um dano Superficial reparável.",
    ],
    duration: "Permanente",
  }),
  ritual({
    id: "as-fog-on-water",
    ingredientsPtBr: ["Madeira de embarcação", "Água do corpo que será atravessado"],
    level: 2,
    nameOriginal: "As Fog on Water",
    namePtBr: "Como Névoa sobre a Água",
    page: 100,
    processPtBr: ["Mergulhe a madeira na água e verta vitae nela."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória permite caminhar silenciosamente sobre a superfície da água pelo restante da noite; encerrar é voluntário e definitivo até nova conjuração.",
    ],
    duration: "Uma noite ou até ser encerrado",
  }),
  ritual({
    id: "calix-secretus",
    ingredientsPtBr: ["Objeto que caiba na mão", "Vitae do conjurador"],
    level: 2,
    nameOriginal: "Calix Secretus",
    namePtBr: "Calix Secretus",
    page: 100,
    castTime: "Uma hora",
    processPtBr: [
      "Durante uma hora, banhe o objeto em vitae e pronuncie a fórmula; uma palavra de comando libera o conteúdo.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória armazena vitae; cada duas Checagens depositadas saciam uma Fome quando recuperadas, e uma só pode atender carniçal ou outro Ritual.",
    ],
    duration: "Até a vitae ser liberada",
  }),
  ritual({
    id: "soporific-touch",
    ingredientsPtBr: ["Pequena quantidade de haxixe ou outro narcótico"],
    level: 2,
    nameOriginal: "Soporific Touch",
    namePtBr: "Toque Soporífero",
    page: 100,
    processPtBr: [
      "Misture a substância à vitae e friccione-a entre os dedos durante a fórmula.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "No contato, dispute o Ritual contra Vigor + Determinação do alvo; a margem penaliza resistências que incluam Autocontrole ou Determinação durante a cena.",
    ],
    dicePool: "Inteligência + Feitiçaria de Sangue vs. Vigor + Determinação",
    difficulty: "Teste resistido",
    duration: "Uma cena",
  }),
  ritual({
    id: "fire-in-the-blood",
    ingredientsPtBr: [
      "Amostra de sangue do alvo",
      "Imagem do alvo",
      "Vela vermelha ou isqueiro de ferro",
    ],
    level: 3,
    nameOriginal: "Fire in the Blood",
    namePtBr: "Fogo no Sangue",
    page: 100,
    processPtBr: ["Concentre-se na imagem e queime a amostra sobre a chama."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Dispute o Ritual contra Determinação + Ocultismo ou Fortitude; cada margem causa dano Superficial e dois dados de penalidade Física até o fim da cena.",
      "Vitória crítica aumenta a penalidade para três; vampiro ferido faz uma Checagem de Sangue e o alvo só pode ser afetado uma vez por noite.",
    ],
    dicePool:
      "Inteligência + Feitiçaria de Sangue vs. Determinação + Ocultismo ou Fortitude",
    difficulty: "Teste resistido",
    duration: "Uma cena",
  }),
  ritual({
    id: "one-with-the-blade",
    ingredientsPtBr: ["Arma corpo a corpo", "Vitae suficiente para submergi-la"],
    level: 3,
    nameOriginal: "One with the Blade",
    namePtBr: "Uno com a Lâmina",
    page: 101,
    castTime: "Até o amanhecer seguinte",
    processPtBr: ["Submerja a arma até o amanhecer e jure dedicar-lhe a não vida."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória vincula uma única arma, que não se deteriora na posse do conjurador.",
      "Ungir a arma com vitae em um turno, com Checagem de Sangue, concede dois dados em combate por uma cena; contra o dono original ela causa dano Agravado, sem os dois dados.",
    ],
    duration: "Permanente até a arma ser destruída ou substituída pelo Ritual",
  }),
  ritual({
    id: "feast-of-ashes",
    ingredientsPtBr: ["Pergaminho com o nome do alvo", "Cinzas desse pergaminho"],
    level: 4,
    nameOriginal: "Feast of Ashes",
    namePtBr: "Banquete de Cinzas",
    page: 101,
    processPtBr: [
      "Queime o nome e trace os sigilos com as cinzas misturadas à própria vitae.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Dispute o Ritual contra Determinação + Força de Vontade; em vitória, o alvo vomita sangue ingerido por uma noite e só cinzas reduzem sua Fome, nunca abaixo de 3.",
    ],
    dicePool: "Inteligência + Feitiçaria de Sangue vs. Determinação + Força de Vontade",
    difficulty: "Teste resistido",
    duration: "Uma noite",
  }),
  ritual({
    id: "guided-memory",
    ingredientsPtBr: [
      "Vitae de outro vampiro",
      "Alecrim seco",
      "Papoulas ou miosótis frescos",
    ],
    level: 4,
    nameOriginal: "Guided Memory",
    namePtBr: "Memória Guiada",
    page: 101,
    processPtBr: [
      "Queime as plantas, misture as cinzas à vitae doadora e beba para entrar no Memoriam guiado.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Escolha um objetivo de Memoriam ou Poder/Qualidade até nível 3 conforme a tabela; o Narrador decide a dádiva coerente encontrada.",
      "O benefício dura até o fim da sessão, não conta no limite de Poderes, exige rating e não serve como pré-requisito; aplique as penalidades temporais do Memoriam guiado.",
    ],
    duration:
      "Até o fim da sessão; até o fim da sessão seguinte se obtido no encerramento",
  }),
  ritual({
    id: "invisible-chains-of-binding",
    ingredientsPtBr: ["Um elo de corrente", "Vitae do conjurador"],
    level: 4,
    nameOriginal: "Invisible Chains of Binding",
    namePtBr: "Correntes Invisíveis de Aprisionamento",
    page: 102,
    castTime: "Uma hora para preparar o elo",
    processPtBr: ["Inscreva o elo durante uma hora e arremesse-o aos pés do alvo."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Dispute o Ritual contra Força + Determinação; o alvo não sai do lugar por uma hora por margem e sofre quatro dados de penalidade em defesa física, Briga e Armas Brancas enquanto o elo ficar inteiro a até três metros.",
    ],
    dicePool: "Inteligência + Feitiçaria de Sangue vs. Força + Determinação",
    difficulty: "Teste resistido",
    duration: "Uma hora por ponto de margem",
  }),
  ritual({
    id: "antebrachia-ignium",
    ingredientsPtBr: [
      "Vitae suficiente para cobrir os braços até os cotovelos",
      "Fonte de chama",
    ],
    level: 5,
    nameOriginal: "Antebrachia Ignium",
    namePtBr: "Antebrachia Ignium",
    page: 102,
    processPtBr: ["Mergulhe os braços na vitae e depois exponha o revestimento ao fogo."],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Com Fome 4+, resista ao frenesi de fome na Dificuldade 3; uma vitória no Ritual acende os braços e provoca frenesi de terror 2 nos demais vampiros próximos.",
      "Ataque de Destreza + Briga causa dois danos Agravados; agarrar incendeia roupas até teste de Autocontrole + Sobrevivência 3, e só os braços ficam protegidos.",
    ],
    duration: "Uma cena ou até ser encerrado",
  }),
  ritual({
    id: "dominion",
    ingredientsPtBr: ["Selos de ferro para cada entrada", "Vitae do conjurador"],
    level: 5,
    nameOriginal: "Dominion",
    namePtBr: "Domínio",
    page: 103,
    castTime: "Três horas",
    processPtBr: [
      "Durante três horas, instale e consagre os selos e grave sigilos nas portas.",
    ],
    sourceId: "SRC-0004",
    systemStepsPtBr: [
      "Uma vitória impede qualquer outro usuário de ativar Animalismo, Auspícios, Dominação ou Presença dentro do edifício; as Checagens ainda ocorrem e o efeito termina quando ao menos um selo é destruído.",
    ],
    cost: "De uma a cinco Checagens de Sangue conforme o tamanho do edifício",
    duration: "Indefinida, até um selo ser destruído",
  }),
] as const;

interface CeremonySeed {
  readonly id: string;
  readonly ingredientsPtBr: readonly string[];
  readonly level: 1 | 2 | 3 | 4 | 5;
  readonly nameOriginal: string;
  readonly namePtBr: string;
  readonly page: number;
  readonly prerequisitePowerId: DisciplinePowerId;
  readonly processPtBr: readonly string[];
  readonly systemStepsPtBr: readonly string[];
  readonly duration?: string;
  readonly dicePool?: string;
  readonly difficulty?: string;
  readonly restrictionsPtBr?: readonly string[];
}

const ceremony = (seed: CeremonySeed): OblivionCeremonyCatalogItem => ({
  auditStatus: "VERIFIED",
  id: `ceremony:oblivion:${seed.id}`,
  ingredientsPtBr: seed.ingredientsPtBr,
  level: seed.level,
  nameOriginal: seed.nameOriginal,
  namePtBr: seed.namePtBr,
  prerequisitePowerId: seed.prerequisitePowerId,
  processPtBr: seed.processPtBr,
  rule: {
    castTime: "Cinco minutos por nível, salvo exceção indicada pela Cerimônia",
    cost: "Uma Checagem de Sangue",
    dicePool: seed.dicePool ?? "Determinação + Oblívio",
    difficulty: seed.difficulty ?? `Nível da Cerimônia + 1 (${seed.level + 1})`,
    duration: seed.duration ?? null,
    restrictionsPtBr: seed.restrictionsPtBr ?? [],
    systemStepsPtBr: seed.systemStepsPtBr,
  },
  ruleRevisionId: OBLIVION_CEREMONY_CATALOG_REVISION,
  sourceRefs: [source("SRC-0004", seed.page)],
  translationStatus: "CONTROLLED_CANDIDATE",
});

export const OBLIVION_CEREMONY_CATALOG: readonly OblivionCeremonyCatalogItem[] = [
  ceremony({
    id: "gift-of-false-life",
    ingredientsPtBr: ["Um ou mais cadáveres humanos", "Mistura de sangue, fleuma e bile"],
    level: 1,
    nameOriginal: "The Gift of False Life",
    namePtBr: "Dádiva da Falsa Vida",
    page: 92,
    prerequisitePowerId: "power:oblivion-ashes-to-ashes",
    processPtBr: [
      "Aplique a mistura aos corpos e dê uma ordem simples, única ou repetitiva.",
    ],
    systemStepsPtBr: [
      "Uma vitória anima até o menor valor entre rating de Oblívio e corpos preparados; vitória crítica dobra o rating para esse limite.",
      "Os cadáveres não pensam nem se defendem, encerram ao cumprir a tarefa ou serem destruídos e usam o perfil normativo de cadáver irracional.",
    ],
    duration: "Até a tarefa terminar ou o cadáver ser destruído",
  }),
  ceremony({
    id: "summon-spirit",
    ingredientsPtBr: [
      "Grilhão do espectro",
      "Imagem ou nome assinado do morto",
      "Vitae do conjurador",
    ],
    level: 1,
    nameOriginal: "Summon Spirit",
    namePtBr: "Invocar Espírito",
    page: 92,
    prerequisitePowerId: "power:oblivion-binding-fetter",
    processPtBr: [
      "Cubra o Grilhão com vitae, estude a identificação e chame o nome do espectro.",
    ],
    systemStepsPtBr: [
      "Uma vitória traz o espectro pelo Véu se ele não for impenetrável no local; mover o Grilhão depois não move o ponto de travessia.",
      "A invocação não obriga o espectro a cooperar e ele retorna ao Submundo no fim da cena se outra Cerimônia não o compelir ou vincular.",
    ],
    duration: "Uma cena",
  }),
  ceremony({
    id: "awaken-homuncular-servant",
    ingredientsPtBr: [
      "Parte de corpo ou pequeno animal morto",
      "Instrumento que o separou ou matou",
      "Mistura de urina, fezes e sêmen",
    ],
    level: 2,
    nameOriginal: "Awaken the Homuncular Servant",
    namePtBr: "Despertar o Servo Homuncular",
    page: 93,
    prerequisitePowerId: "power:oblivion-where-shroud-thins",
    processPtBr: [
      "Prepare a parte ou carcaça, massageie vitae nela e conclua a Cerimônia.",
    ],
    systemStepsPtBr: [
      "Uma vitória cria servo leal que espiona, segue ou intimida; além de cem metros do criador ele fica inerte.",
      "Permanece ativo por noites iguais aos sucessos, para sempre em vitória crítica; falha total destrói os componentes e o servo usa o perfil normativo próprio.",
    ],
    duration: "Uma noite por sucesso; permanente em vitória crítica",
  }),
  ceremony({
    id: "compel-spirit",
    ingredientsPtBr: [
      "Grilhão do espectro",
      "Vitae",
      "Meio ou ameaça crível de danificar o Grilhão",
    ],
    level: 2,
    nameOriginal: "Compel Spirit",
    namePtBr: "Compelir Espírito",
    page: 94,
    prerequisitePowerId: "power:oblivion-where-shroud-thins",
    processPtBr: [
      "Na presença do espectro, ameace o Grilhão e verta vitae em sua direção.",
    ],
    systemStepsPtBr: [
      "Dispute a Cerimônia contra Determinação + Autocontrole do espectro; sem ameaça física, também vença Manipulação + Intimidação contra a mesma parada.",
      "Sucessos compram tarefas moderadas, dois por tarefa difícil; vitória crítica admite qualquer ordem. Derrota causa dano Superficial de Vitalidade igual à margem e envia o espectro ao Submundo.",
    ],
    dicePool: "Determinação + Oblívio vs. Determinação + Autocontrole do espectro",
    difficulty: "Teste resistido; possível segundo teste social",
    duration: "Até o fim da crônica ou cumprimento das ordens, salvo ruptura antecipada",
  }),
  ceremony({
    id: "host-spirit",
    ingredientsPtBr: [
      "Tributo valorizável pelo espectro",
      "Inseto parasita",
      "Dois dentes do conjurador",
    ],
    level: 3,
    nameOriginal: "Host Spirit",
    namePtBr: "Hospedar Espírito",
    page: 94,
    prerequisitePowerId: "power:oblivion-aura-decay",
    processPtBr: [
      "Ofereça o tributo, arranque os dentes e morda o parasita para abrir o corpo ao espectro consentinte.",
    ],
    systemStepsPtBr: [
      "Uma vitória permite a entrada por cenas iguais aos sucessos, concede dois dados em testes de Atributos Físicos, +2 Vitalidade e acesso narrativo às Habilidades oferecidas pelo espectro.",
      "Se o espectro tentar tomar controle, dispute Determinação + Autocontrole; em derrota ele conduz o corpo até o fim da cena, com restrições de autodestruição.",
    ],
    duration: "Uma cena por sucesso",
  }),
  ceremony({
    id: "shambling-hordes",
    ingredientsPtBr: [
      "Cadáveres preparados",
      "Componentes orgânicos e vitae conforme o rito",
    ],
    level: 3,
    nameOriginal: "Shambling Hordes",
    namePtBr: "Hordas Cambaleantes",
    page: 95,
    prerequisitePowerId: "power:oblivion-aura-decay",
    processPtBr: ["Prepare os corpos e execute a Cerimônia antes de comandar a horda."],
    systemStepsPtBr: [
      "Uma vitória anima os corpos dentro do limite da Cerimônia e lhes permite cumprir ordens mais agressivas usando o perfil de cadáver agressivo.",
      "Antes de conjurar, resista ao frenesi de fome na Dificuldade 2; os servos persistem até serem destruídos ou a condição prevista terminar.",
    ],
    duration: "Até os cadáveres serem destruídos ou a Cerimônia ser encerrada pela regra",
  }),
  ceremony({
    id: "bind-the-spirit",
    ingredientsPtBr: ["Grilhão do espectro", "Vitae e materiais de vinculação"],
    level: 4,
    nameOriginal: "Bind the Spirit",
    namePtBr: "Vincular o Espírito",
    page: 96,
    prerequisitePowerId: "power:oblivion-necrotic-plague",
    processPtBr: ["Execute a vinculação na presença do espectro e do Grilhão preparado."],
    systemStepsPtBr: [
      "Uma vitória prende o espectro ao recipiente ou local designado sem teste resistido adicional e impõe as limitações da vinculação.",
      "O vínculo persiste até a condição de término, destruição apropriada ou cancelamento pelo necromante; agressão direta pode romper a cooperação prevista.",
    ],
    duration: "Indefinida até ruptura ou cancelamento conforme a Cerimônia",
  }),
  ceremony({
    id: "split-the-veil",
    ingredientsPtBr: ["Lençol de seda", "Lâmina", "Vitae do conjurador"],
    level: 4,
    nameOriginal: "Split the Veil",
    namePtBr: "Rasgar o Véu",
    page: 96,
    prerequisitePowerId: "power:oblivion-necrotic-plague",
    processPtBr: [
      "Prepare o lençol, cubra a passagem e corte-o ao concluir a Cerimônia.",
    ],
    systemStepsPtBr: [
      "Depois de resistir ao frenesi de fome exigido, uma vitória reduz a densidade do Véu no local em um grau e cria uma abertura utilizável conforme a tabela do Véu.",
      "A abertura afeta a travessia e manifestações de espectros e permanece pela duração definida pela margem e pelo local.",
    ],
    duration: "Conforme os sucessos e a densidade local do Véu",
  }),
  ceremony({
    id: "lazarene-blessing",
    ingredientsPtBr: ["Cadáver-alvo", "Vitae e componentes sacrificiais do rito"],
    level: 5,
    nameOriginal: "Lazarene Blessing",
    namePtBr: "Bênção Lazarena",
    page: 98,
    prerequisitePowerId: "power:oblivion-skuld-fulfilled",
    processPtBr: [
      "Prepare o cadáver e ofereça o sacrifício exigido antes da rolagem da Cerimônia.",
    ],
    systemStepsPtBr: [
      "Uma vitória permite que um espectro apropriado ocupe e reanime o cadáver, conservando a identidade e limitações estabelecidas pela Cerimônia.",
      "Matar o mortal exigido pode gerar Máculas; o corpo reanimado segue as condições de decadência, permanência e destruição registradas na regra.",
    ],
    duration: "Indefinida enquanto o corpo e o ocupante permanecerem vinculados",
  }),
] as const;

export const BLOOD_SORCERY_RITUAL_ACQUISITION_POLICY = {
  creation: {
    grantedChoices: 1,
    maximumLevel: 1,
    minimumBloodSorceryRating: 1,
    sourceRefs: [source("SRC-0001", 272)],
  },
  duringPlay: {
    experienceCostFormula: "nível do Ritual × 3",
    maximumLevelFormula: "rating de Feitiçaria de Sangue",
    minimumLearningTimeFormula: "nível do Ritual ao quadrado, em semanas",
    sourceRefs: [source("SRC-0001", 272), source("SRC-0001", 151)],
  },
  temporaryDisciplineAccessGrantsRituals: false,
} as const;

export const OBLIVION_CEREMONY_ACQUISITION_POLICY = {
  creation: {
    grantedChoices: 1,
    maximumLevel: 1,
    requiresAnyMatchingPrerequisitePower: true,
    sourceRefs: [source("SRC-0004", 91)],
  },
  duringPlay: {
    experienceCostFormula: "nível da Cerimônia × 3",
    maximumLevelFormula: "rating de Oblívio",
    minimumLearningTimeFormula: "nível da Cerimônia ao quadrado, em semanas",
    requiresMatchingPrerequisitePower: true,
    requiresTeacherWhoKnowsCeremony: true,
    sourceRefs: [source("SRC-0004", 91, 92)],
  },
  temporaryOblivionAccessGrantsCeremonies: false,
} as const;

const INITIAL_ALCHEMY_METHODS = [
  "ATHANOR_CORPORIS",
  "CALCINATIO",
  "FIXATIO",
] as const satisfies readonly ThinBloodAlchemyMethod[];

export function projectCreationDisciplineSubchoices(
  state: CreationDisciplineSubsystemState,
): readonly PendingCreationDisciplineSubchoice[] {
  const ratingByDiscipline = new Map(
    state.disciplines.map((discipline) => [discipline.disciplineId, discipline.rating]),
  );
  const knownPowerIds = new Set(state.powers.map((power) => power.powerId));
  const pending: PendingCreationDisciplineSubchoice[] = [];

  const bloodSorceryRating = ratingByDiscipline.get("discipline:blood-sorcery") ?? 0;
  if (bloodSorceryRating >= 1 && state.bloodSorceryRitualIds.length === 0) {
    pending.push({
      eligibleIds: BLOOD_SORCERY_RITUAL_CATALOG.filter(
        (ritual) => ritual.level === 1,
      ).map((ritual) => ritual.id),
      kind: "BLOOD_SORCERY_RITUAL",
      ordinal: 1,
    });
  }

  const oblivionRating = ratingByDiscipline.get("discipline:oblivion") ?? 0;
  if (oblivionRating >= 1 && state.oblivionCeremonyIds.length === 0) {
    const eligibleIds = OBLIVION_CEREMONY_CATALOG.filter(
      (ceremony) =>
        ceremony.level === 1 && knownPowerIds.has(ceremony.prerequisitePowerId),
    ).map((ceremony) => ceremony.id);
    if (eligibleIds.length > 0) {
      pending.push({
        eligibleIds,
        kind: "OBLIVION_CEREMONY",
        ordinal: 1,
      });
    }
  }

  const alchemyRating = ratingByDiscipline.get("discipline:thin-blood-alchemy") ?? 0;
  if (alchemyRating >= 1 && state.thinBloodAlchemyMethod === null) {
    pending.push({
      eligibleIds: INITIAL_ALCHEMY_METHODS,
      kind: "THIN_BLOOD_ALCHEMY_METHOD",
      ordinal: 1,
    });
  }
  const knownFormulaIds = new Set(state.thinBloodAlchemyFormulaIds);
  const hasPendingFormula = alchemyRating > knownFormulaIds.size;
  if (hasPendingFormula && state.thinBloodAlchemyMethod !== null) {
    const eligibleIds = THIN_BLOOD_ALCHEMY_FORMULA_CATALOG.filter(
      (formula) => formula.level <= alchemyRating && !knownFormulaIds.has(formula.id),
    ).map((formula) => formula.id);
    pending.push({
      eligibleIds,
      kind: "THIN_BLOOD_ALCHEMY_FORMULA",
      ordinal: knownFormulaIds.size + 1,
    });
  }

  return pending;
}
