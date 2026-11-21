import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { CreationDisciplinesStepView } from "@assistente-vampiro/contracts";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GuidedDisciplines } from "./guided-disciplines";

const client = vi.hoisted(() => ({
  load: vi.fn(),
  preview: vi.fn(),
  update: vi.fn(),
}));

vi.mock("../../../criar/creation-client", () => ({
  loadCreationDisciplines: client.load,
  previewCreationDisciplines: client.preview,
  updateCreationDisciplines: client.update,
}));

vi.mock("../../../../character-api", () => ({
  loadCharacterSheetById: vi.fn(),
}));

const context = {
  characterId: "character-one",
  completedSteps: ["concept", "clan", "attributes", "skills"],
  creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
  currentStep: "disciplines",
  disciplinePolicy: {
    allowedDisciplines: [
      "discipline:auspex",
      "discipline:celerity",
      "discipline:presence",
    ],
    family: "CLAN",
    originId: "clan:toreador",
    selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
  },
  identity: { concept: "Investigadora", name: "Noemi Vale" },
  origin: { clanId: "clan:toreador", id: "clan:toreador", kind: "CLAN_VAMPIRE" },
  steps: [
    { id: "concept", status: "complete" },
    { id: "clan", status: "complete" },
    { id: "attributes", status: "complete" },
    { id: "skills", status: "complete" },
    { id: "disciplines", status: "not_started" },
    { id: "predator", status: "not_started" },
    { id: "advantages", status: "not_started" },
    { id: "history-and-blood", status: "not_started" },
    { id: "review", status: "not_started" },
  ],
  version: 9,
};

const power = {
  auditStatus: "VERIFIED",
  amalgamRequirements: [],
  descriptionPtBr:
    "O vampiro envolve a própria presença em magnetismo sobrenatural. Olhares e atenção convergem para ele sem retirar a liberdade de quem o percebe.",
  disciplineId: "discipline:presence",
  effectPtBr: "Atrai a atenção e intensifica a presença do vampiro.",
  id: "power:presence-awe",
  level: 1,
  nameOriginal: "Awe",
  namePtBr: "Fascínio",
  presentation: {
    contentKind: "PROJECT_PARAPHRASE",
    contentRevisionId: "presentation-r1",
    descriptionPtBr:
      "O vampiro envolve a própria presença em magnetismo sobrenatural. Olhares e atenção convergem para ele sem retirar a liberdade de quem o percebe.",
    effectPtBr: "Atrai a atenção e intensifica a presença do vampiro.",
    summaryPtBr: "Magnetismo sobrenatural que prende a atenção.",
  },
  prerequisites: [],
  prerequisitePowerOptions: [],
  ruleRevisionId: "catalog-r1",
  ruleRevisions: [
    {
      id: "catalog-r1:src-0001",
      sourceRefs: [{ pages: [267, 268, 269, 270], sourceId: "SRC-0001" }],
      status: "ACTIVE",
    },
  ],
  sourceRefs: [{ pages: [267, 268, 269, 270], sourceId: "SRC-0001" }],
  summaryPtBr: "Magnetismo sobrenatural que prende a atenção.",
  systemPtBr: "Use conforme a regra catalogada.",
  rule: {
    activationPtBr: null,
    amalgamRequirements: [],
    auditStatus: "VERIFIED",
    conditionsPtBr: [],
    cost: "Gratuito",
    dicePool: null,
    difficulty: null,
    duration: "Uma cena",
    notesPtBr: [],
    prerequisitePowerOptions: [],
    prerequisites: [],
    rangePtBr: null,
    restrictionsPtBr: [],
    ruleRevisionId: "catalog-r1",
    ruleRevisions: [
      {
        id: "catalog-r1:src-0001",
        sourceRefs: [{ pages: [267, 268, 269, 270], sourceId: "SRC-0001" }],
        status: "ACTIVE",
      },
    ],
    sourceRefs: [{ pages: [267, 268, 269, 270], sourceId: "SRC-0001" }],
    systemStepsPtBr: ["Use conforme a regra catalogada."],
    targetPtBr: null,
  },
};

const secondLevelOnePower = {
  ...power,
  effectPtBr: "Afasta o confronto pela ameaça sobrenatural.",
  id: "power:presence-daunt",
  nameOriginal: "Daunt",
  namePtBr: "Amedrontar",
  presentation: {
    ...power.presentation,
    effectPtBr: "Afasta o confronto pela ameaça sobrenatural.",
    summaryPtBr: "Uma presença ameaçadora que repele aproximações.",
  },
  summaryPtBr: "Uma presença ameaçadora que repele aproximações.",
};

const levelTwoPower = {
  ...power,
  descriptionPtBr:
    "A experiência do Beijo permanece na memória do mortal e desperta um desejo persistente de revivê-la. A influência nasce da alimentação e não funciona como uma ordem direta.",
  effectPtBr: "Torna o Beijo uma lembrança sobrenaturalmente viciante.",
  id: "power:presence-lingering-kiss",
  level: 2,
  nameOriginal: "Lingering Kiss",
  namePtBr: "Beijo Indelével",
  presentation: {
    ...power.presentation,
    descriptionPtBr:
      "A experiência do Beijo permanece na memória do mortal e desperta um desejo persistente de revivê-la. A influência nasce da alimentação e não funciona como uma ordem direta.",
    effectPtBr: "Torna o Beijo uma lembrança sobrenaturalmente viciante.",
    summaryPtBr: "Faz do Beijo uma experiência difícil de esquecer.",
  },
  summaryPtBr: "Faz do Beijo uma experiência difícil de esquecer.",
  cost: "Uma Checagem de Sangue",
  dicePool: "Carisma + Presença vs. Autocontrole + Raciocínio",
  difficulty: "Disputa resistida",
  duration: "Uma noite",
  restrictionsPtBr: "Somente um alvo alimentado pelo vampiro.",
  rule: {
    ...power.rule,
    cost: "Uma Checagem de Sangue",
    dicePool: "Carisma + Presença vs. Autocontrole + Raciocínio",
    difficulty: "Disputa resistida",
    duration: "Uma noite",
    restrictionsPtBr: ["Somente um alvo alimentado pelo vampiro."],
  },
};

const secondLevelTwoPower = {
  ...power,
  descriptionPtBr:
    "A voz carrega a influência sobrenatural do vampiro até quem a escuta diretamente.",
  effectPtBr: "Permite transmitir Poderes de Presença apenas pela voz.",
  id: "power:presence-melpominee",
  level: 2,
  nameOriginal: "Melpominee",
  namePtBr: "Melpominê",
  presentation: {
    ...power.presentation,
    descriptionPtBr:
      "A voz carrega a influência sobrenatural do vampiro até quem a escuta diretamente.",
    effectPtBr: "Permite transmitir Poderes de Presença apenas pela voz.",
    summaryPtBr: "A voz conduz a influência da Presença.",
  },
  summaryPtBr: "A voz conduz a influência da Presença.",
};

const levelThreePower = {
  ...power,
  descriptionPtBr:
    "A influência sobrenatural concentra a atenção do alvo na presença do vampiro.",
  effectPtBr: "Concentra a atenção do alvo no vampiro.",
  id: "power:presence-entrancement",
  level: 3,
  nameOriginal: "Entrancement",
  namePtBr: "Transe",
  presentation: {
    ...power.presentation,
    descriptionPtBr:
      "A influência sobrenatural concentra a atenção do alvo na presença do vampiro.",
    effectPtBr: "Concentra a atenção do alvo no vampiro.",
    summaryPtBr: "Faz do vampiro o centro irresistível da atenção.",
  },
  summaryPtBr: "Faz do vampiro o centro irresistível da atenção.",
};

function makeStep({
  acquired = false,
  acquiredPowerIds,
  pending = false,
  pendingOrdinal = 1,
  powerAdjustments = [],
  presenceRating = 0,
  version = 9,
}: {
  acquired?: boolean;
  acquiredPowerIds?: readonly string[];
  pending?: boolean;
  pendingOrdinal?: number;
  powerAdjustments?: CreationDisciplinesStepView["evaluation"]["powerAdjustments"];
  presenceRating?: number;
  version?: number;
} = {}) {
  const persistedPowerIds = acquiredPowerIds ?? (acquired ? [power.id] : []);
  return {
    catalog: [
      {
        descriptionPtBr:
          "Auspícios rompe os limites dos sentidos e alcança presenças, emoções e pensamentos escondidos.",
        id: "discipline:auspex",
        nameOriginal: "Auspex",
        namePtBr: "Auspícios",
        powers: [],
        ruleRevisionId: "catalog-r1",
        sourceRefs: [],
        summaryPtBr: "Sentidos e percepção para além do humano.",
      },
      {
        descriptionPtBr:
          "Celeridade altera a relação do vampiro com movimento, reação e tempo físico.",
        id: "discipline:celerity",
        nameOriginal: "Celerity",
        namePtBr: "Celeridade",
        powers: [],
        ruleRevisionId: "catalog-r1",
        sourceRefs: [],
        summaryPtBr: "Velocidade e reflexos sobrenaturais.",
      },
      {
        descriptionPtBr:
          "Presença influencia emoções por meio do magnetismo sobrenatural do vampiro, sem implantar ordens diretas.",
        id: "discipline:presence",
        nameOriginal: "Presence",
        namePtBr: "Presença",
        powers: [
          power,
          secondLevelOnePower,
          levelTwoPower,
          secondLevelTwoPower,
          levelThreePower,
        ],
        ruleRevisionId: "catalog-r1",
        sourceRefs: [],
        summaryPtBr: "Influência, carisma e domínio sobre a atenção alheia.",
      },
    ],
    characterId: "character-one",
    creationContext: context,
    disciplines: [
      { disciplineId: "discipline:auspex", rating: 0, structuralMaximum: 5 },
      { disciplineId: "discipline:celerity", rating: 0, structuralMaximum: 5 },
      {
        disciplineId: "discipline:presence",
        rating: presenceRating,
        structuralMaximum: 5,
      },
    ],
    evaluation: {
      complete: acquired && !pending,
      pendingPowerChoices: pending
        ? Array.from(
            {
              length: Math.max(1, presenceRating - persistedPowerIds.length),
            },
            (_, index) => {
              const ordinal = pendingOrdinal + index;
              const eligiblePowerIds = [
                power,
                secondLevelOnePower,
                levelTwoPower,
                secondLevelTwoPower,
                levelThreePower,
              ]
                .filter(
                  (candidate) =>
                    candidate.level <= ordinal &&
                    !persistedPowerIds.includes(candidate.id),
                )
                .map((candidate) => candidate.id);
              return {
                disciplineId: "discipline:presence" as const,
                eligiblePowerIds,
                ordinal,
              };
            },
          )
        : [],
      powerAdjustments,
      violations: [],
    },
    policy: {
      allowedDisciplineIds: [
        "discipline:auspex",
        "discipline:celerity",
        "discipline:presence",
      ],
      family: "CLAN",
      hasIntrinsicDisciplines: true,
      requiredRatings: [2, 1],
      ruleRevision: "RULE-CREATION-DISCIPLINES-001-r1",
      structuralMaximum: 5,
    },
    powers: persistedPowerIds.map((powerId) => ({
      disciplineId: "discipline:presence",
      powerId,
      powerRuleRevisionId: "catalog-r1",
    })),
    version,
  };
}

describe("GuidedDisciplines", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    client.load.mockReset();
    client.preview.mockReset();
    client.update.mockReset();
  });

  it("começa vazia, apenas com foco editorial e identidade do Clã", async () => {
    client.load.mockResolvedValue(makeStep());
    const { container } = render(<GuidedDisciplines characterId="character-one" />);

    expect(await screen.findByRole("radio", { name: "Auspícios" })).toBeChecked();
    expect(
      within(screen.getByRole("group", { name: "Disciplinas do Clã" })).getAllByRole(
        "radio",
      ),
    ).toHaveLength(3);
    expect(container.querySelectorAll('button[aria-pressed="true"]')).toHaveLength(0);
    expect(screen.getByText(/Defina 1 ou 2 pontos/)).toBeVisible();
    expect(screen.getByRole("img", { name: "Símbolo do Clã Toreador" })).toBeVisible();
    expect(screen.queryByText("Poderes adquiridos")).toBeNull();
    expect(client.update).not.toHaveBeenCalled();
  });

  it("troca o foco editorial sem persistir nem alterar pontos", async () => {
    client.load.mockResolvedValue(makeStep());
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Celeridade" }));

    expect(client.update).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "Celeridade" })).toBeVisible();
    expect(screen.getByRole("complementary").querySelector("header img")).toHaveAttribute(
      "src",
      "/assets/wod/disciplines/celerity.svg",
    );
    expect(
      screen.getByRole("heading", { name: "Nível de Celeridade" }).querySelector("img"),
    ).toBeNull();
    expect(
      screen
        .getByRole("radio", { name: "Celeridade" })
        .closest("label")
        ?.querySelector("img"),
    ).toHaveAttribute("src", "/assets/wod/disciplines/celerity.svg");
    expect(
      screen.getByText(
        "Celeridade altera a relação do vampiro com movimento, reação e tempo físico.",
      ),
    ).toBeVisible();
  });

  it("mantém a seleção de Disciplina de um Caitiff sem atribuir símbolo de Clã", async () => {
    const step = makeStep();
    client.load.mockResolvedValue({
      ...step,
      creationContext: {
        ...context,
        origin: { kind: "CAITIFF", clanId: null, id: "origin:caitiff" },
      },
      policy: { ...step.policy, family: "CAITIFF" },
    });
    render(<GuidedDisciplines characterId="character-one" />);
    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    expect(screen.getByRole("complementary").querySelector("header img")).toHaveAttribute(
      "src",
      "/assets/wod/disciplines/presence.svg",
    );
    expect(
      screen
        .getByRole("region", { name: /Identidade em construção: Caitiff/ })
        .querySelector("img"),
    ).toBeNull();
    expect(client.update).not.toHaveBeenCalled();
  });

  it("preserva a origem Sangue-Ralo sem símbolos de Clã nem Disciplinas intrínsecas", async () => {
    const step = makeStep();
    client.load.mockResolvedValue({
      ...step,
      catalog: [],
      disciplines: [],
      creationContext: {
        ...context,
        origin: { kind: "THIN_BLOOD", clanId: null, id: "origin:thin-blood" },
      },
      policy: { ...step.policy, family: "THIN_BLOOD", requiredRatings: [] },
    });
    const { container } = render(<GuidedDisciplines characterId="character-one" />);
    expect(
      await screen.findByText(/não começa com Disciplinas intrínsecas/),
    ).toBeVisible();
    expect(container.querySelector("img")).toBeNull();
  });

  it("envia a distribuição e revela os Poderes devolvidos pela API", async () => {
    client.load.mockResolvedValue(makeStep());
    client.update.mockResolvedValue(makeStep({ pending: true, presenceRating: 2 }));
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    fireEvent.click(screen.getByRole("button", { name: "Definir Presença em 2" }));

    await waitFor(() => expect(client.update).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole("heading", { name: "Próxima escolha" })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Fascínio/ })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Amedrontar/ })).toBeVisible();
    expect(screen.getByText(/2 escolhas de Poder pendentes/)).toBeVisible();
  });

  it("salva o Poder, fecha os candidatos e oferece revisão discreta", async () => {
    client.load.mockResolvedValue(makeStep({ pending: true, presenceRating: 1 }));
    client.update.mockResolvedValue(
      makeStep({ acquired: true, presenceRating: 1, version: 10 }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: /Fascínio/ }));

    expect(await screen.findByRole("button", { name: "Remover" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Próxima escolha" })).toBeNull();
    expect(client.update).toHaveBeenCalledWith(
      "character-one",
      9,
      expect.any(Array),
      ["power:presence-awe"],
      false,
    );
  });

  it("reduz de 2 para 1 sem apagar silenciosamente e exige resolver o conflito", async () => {
    client.load.mockResolvedValue(
      makeStep({
        acquiredPowerIds: [power.id, levelTwoPower.id],
        presenceRating: 2,
      }),
    );
    client.update.mockResolvedValue(
      makeStep({ acquiredPowerIds: [power.id], presenceRating: 1, version: 10 }),
    );
    client.preview
      .mockResolvedValueOnce(
        makeStep({
          acquiredPowerIds: [power.id, levelTwoPower.id],
          powerAdjustments: [
            {
              disciplineId: "discipline:presence",
              incompatiblePowerIds: [levelTwoPower.id as `power:${string}`],
              minimumRequiredRemovals: 1,
              targetRating: 1,
            },
          ],
          presenceRating: 1,
        }),
      )
      .mockResolvedValueOnce(
        makeStep({ acquiredPowerIds: [power.id], presenceRating: 1 }),
      );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    fireEvent.click(await screen.findByRole("button", { name: "Definir Presença em 1" }));

    const adjustment = await screen.findByRole("region", { name: "Ajuste necessário" });
    expect(within(adjustment).getByText(/exige remover 1 Poder/)).toBeVisible();
    expect(screen.getByText("Não disponível no novo nível.")).toBeVisible();
    expect(screen.getByText("Ajuste pendente")).toBeVisible();
    expect(client.preview).toHaveBeenCalledTimes(1);
    expect(client.update).not.toHaveBeenCalled();

    const incompatibleRow = screen.getByText("Beijo Indelével").closest("div");
    expect(incompatibleRow).not.toBeNull();
    fireEvent.click(within(incompatibleRow!).getByRole("button", { name: "Remover" }));

    await waitFor(() =>
      expect(client.update).toHaveBeenCalledWith(
        "character-one",
        9,
        expect.arrayContaining([
          expect.objectContaining({ disciplineId: "discipline:presence", rating: 1 }),
        ]),
        ["power:presence-awe"],
        true,
      ),
    );
    expect(client.preview).toHaveBeenCalledTimes(2);
    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Ajuste necessário" })).toBeNull(),
    );
  });

  it("remove um Poder diretamente e preserva o rating para nova escolha", async () => {
    client.load.mockResolvedValue(makeStep({ acquired: true, presenceRating: 1 }));
    client.update.mockResolvedValue(makeStep({ pending: true, presenceRating: 1 }));
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("button", { name: "Remover" }));

    await waitFor(() =>
      expect(client.update).toHaveBeenCalledWith(
        "character-one",
        9,
        expect.any(Array),
        [],
        true,
      ),
    );
    expect(await screen.findByRole("heading", { name: "Próxima escolha" })).toBeVisible();
  });

  it("mostra um nível de Poder por vez e permite consultar os anteriores", async () => {
    client.load.mockResolvedValue(
      makeStep({
        acquired: true,
        pending: true,
        pendingOrdinal: 2,
        presenceRating: 2,
      }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));

    const chosen = screen.getByRole("region", { name: "Poderes escolhidos" });
    expect(within(chosen).getByRole("heading", { name: "Nível 1" })).toBeVisible();
    expect(within(chosen).getByText("Fascínio")).toBeVisible();

    const nextChoice = screen.getByRole("region", { name: "Próxima escolha" });
    expect(within(nextChoice).getByRole("heading", { name: "Nível 2" })).toBeVisible();
    expect(
      within(nextChoice).getByRole("button", {
        name: "Ver Poderes de Nível 2 (2)",
      }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(nextChoice).getByRole("radio", { name: /Beijo Indelével/ }),
    ).toBeVisible();
    expect(within(nextChoice).getByRole("radio", { name: /Melpominê/ })).toBeVisible();
    expect(within(nextChoice).queryByRole("radio", { name: /Amedrontar/ })).toBeNull();
    expect(within(nextChoice).queryByRole("radio", { name: /Fascínio/ })).toBeNull();

    fireEvent.click(
      within(nextChoice).getByRole("button", {
        name: "Ver Poderes de Nível 1 (1)",
      }),
    );

    expect(within(nextChoice).getByRole("heading", { name: "Nível 1" })).toBeVisible();
    expect(within(nextChoice).getByRole("radio", { name: /Amedrontar/ })).toBeVisible();
    expect(
      within(nextChoice).queryByRole("radio", { name: /Beijo Indelével/ }),
    ).toBeNull();
    expect(within(nextChoice).queryByRole("radio", { name: /Melpominê/ })).toBeNull();
  });

  it("escala para três níveis sem empilhar os catálogos", async () => {
    client.load.mockResolvedValue(
      makeStep({
        acquiredPowerIds: [power.id, levelTwoPower.id],
        pending: true,
        pendingOrdinal: 3,
        presenceRating: 3,
      }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));

    const nextChoice = screen.getByRole("region", { name: "Próxima escolha" });
    expect(within(nextChoice).getByRole("radio", { name: /Transe/ })).toBeVisible();
    expect(within(nextChoice).queryByRole("radio", { name: /Melpominê/ })).toBeNull();
    expect(within(nextChoice).queryByRole("radio", { name: /Amedrontar/ })).toBeNull();

    fireEvent.click(
      within(nextChoice).getByRole("button", {
        name: "Ver Poderes de Nível 2 (1)",
      }),
    );
    expect(within(nextChoice).getByRole("radio", { name: /Melpominê/ })).toBeVisible();
    expect(within(nextChoice).queryByRole("radio", { name: /Transe/ })).toBeNull();

    fireEvent.click(
      within(nextChoice).getByRole("button", {
        name: "Ver Poderes de Nível 1 (1)",
      }),
    );
    expect(within(nextChoice).getByRole("radio", { name: /Amedrontar/ })).toBeVisible();
    expect(within(nextChoice).queryByRole("radio", { name: /Melpominê/ })).toBeNull();
  });

  it("move a escolha salva de disponíveis para escolhidos e encerra a pendência", async () => {
    client.load.mockResolvedValue(
      makeStep({
        acquired: true,
        pending: true,
        pendingOrdinal: 2,
        presenceRating: 2,
      }),
    );
    client.update.mockResolvedValue(
      makeStep({
        acquiredPowerIds: [power.id, levelTwoPower.id],
        presenceRating: 2,
        version: 10,
      }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    const available = screen.getByRole("region", { name: "Próxima escolha" });
    fireEvent.click(within(available).getByRole("radio", { name: /Beijo Indelével/ }));

    await waitFor(() =>
      expect(screen.queryByRole("region", { name: "Próxima escolha" })).toBeNull(),
    );
    const chosen = screen.getByRole("region", { name: "Poderes escolhidos" });
    expect(within(chosen).getByText("Fascínio")).toBeVisible();
    expect(within(chosen).getByText("Beijo Indelével")).toBeVisible();
    expect(within(chosen).getByRole("heading", { name: "Nível 2" })).toBeVisible();
    expect(client.update).toHaveBeenCalledWith(
      "character-one",
      9,
      expect.any(Array),
      ["power:presence-awe", "power:presence-lingering-kiss"],
      false,
    );
  });

  it("rating 1 sem Poder mostra todos os elegíveis de nível 1 e nenhum escolhido", async () => {
    client.load.mockResolvedValue(
      makeStep({ pending: true, pendingOrdinal: 1, presenceRating: 1 }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));

    const chosen = screen.getByRole("region", { name: "Poderes escolhidos" });
    expect(within(chosen).getByText("Nenhum Poder escolhido ainda.")).toBeVisible();
    const available = screen.getByRole("region", { name: "Próxima escolha" });
    expect(within(available).getByRole("radio", { name: /Fascínio/ })).toBeVisible();
    expect(within(available).getByRole("radio", { name: /Amedrontar/ })).toBeVisible();
    expect(within(available).queryByText("Beijo Indelével")).toBeNull();
  });

  it("impede um quarto ponto e explica como reorganizar a distribuição", async () => {
    const current = makeStep({ pending: true, presenceRating: 1 });
    current.disciplines = [
      { disciplineId: "discipline:auspex", rating: 2, structuralMaximum: 5 },
      { disciplineId: "discipline:celerity", rating: 0, structuralMaximum: 5 },
      { disciplineId: "discipline:presence", rating: 1, structuralMaximum: 5 },
    ];
    client.load.mockResolvedValue(current);
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    fireEvent.click(screen.getByRole("button", { name: "Definir Presença em 2" }));

    expect(client.update).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "Não foi possível adicionar outro ponto: a distribuição já usa os 3 pontos permitidos. Para aumentar Presença, primeiro reduza uma das outras Disciplinas.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Distribuição correta")).toBeVisible();
  });

  it("orienta a correção de uma distribuição 2/2 já persistida", async () => {
    const invalid = makeStep();
    invalid.disciplines = [
      { disciplineId: "discipline:auspex", rating: 2, structuralMaximum: 5 },
      { disciplineId: "discipline:celerity", rating: 0, structuralMaximum: 5 },
      { disciplineId: "discipline:presence", rating: 2, structuralMaximum: 5 },
    ];
    client.load.mockResolvedValue(invalid);
    render(<GuidedDisciplines characterId="character-one" />);

    expect(await screen.findByText("Revise a distribuição")).toBeVisible();
    expect(
      screen.getByText(
        "Há 1 ponto a mais. Retire 1 de Auspícios ou Presença para formar 2/1.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Continuar →" })).toBeDisabled();
  });

  it("confirma claramente quando a etapa está concluída", async () => {
    const complete = makeStep({ acquired: true, presenceRating: 1 });
    complete.disciplines = [
      { disciplineId: "discipline:auspex", rating: 2, structuralMaximum: 5 },
      { disciplineId: "discipline:celerity", rating: 0, structuralMaximum: 5 },
      { disciplineId: "discipline:presence", rating: 1, structuralMaximum: 5 },
    ];
    complete.evaluation.complete = true;
    client.load.mockResolvedValue(complete);
    render(<GuidedDisciplines characterId="character-one" />);

    expect(await screen.findByText("Etapa concluída")).toBeVisible();
    expect(
      screen.getByText("2 em Auspícios e 1 em Presença. Você já pode continuar."),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "Continuar →" })).toBeEnabled();
  });

  it("abre os detalhes completos sem criar uma mutação", async () => {
    client.load.mockResolvedValue(makeStep({ pending: true, presenceRating: 1 }));
    render(<GuidedDisciplines characterId="character-one" />);

    const fascinationOption = (await screen.findByText("Fascínio")).closest("label");
    expect(fascinationOption).not.toBeNull();
    fireEvent.click(within(fascinationOption!).getByRole("button", { name: /Detalhes/ }));

    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Fascínio" })).toBeVisible();
    expect(screen.getByRole("dialog").querySelector("img")).toHaveAttribute(
      "src",
      "/assets/wod/disciplines/presence.svg",
    );
    expect(screen.queryByText("Parada de dados")).toBeNull();
    expect(client.update).not.toHaveBeenCalled();
  });

  it("mostra somente a mecânica aplicável e devolve o foco ao botão de origem", async () => {
    client.load.mockResolvedValue(
      makeStep({ acquired: true, pending: true, pendingOrdinal: 2, presenceRating: 2 }),
    );
    render(<GuidedDisciplines characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: "Presença" }));
    const opener = screen.getAllByRole("button", { name: /Detalhes →/ })[0]!;
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Custo")).toBeVisible();
    expect(within(dialog).getByText("Parada de dados / teste")).toBeVisible();
    expect(within(dialog).getByText("Dificuldade")).toBeVisible();
    expect(within(dialog).getByText("Duração")).toBeVisible();
    expect(within(dialog).getByText("Restrições")).toBeVisible();
    expect(within(dialog).getByText("Revisão normativa")).toBeVisible();
    expect(within(dialog).getByText("SRC-0001, p. 267–270")).toBeVisible();

    fireEvent.click(within(dialog).getByRole("button", { name: "Fechar detalhes" }));
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("consulta a Disciplina completa organizada do nível 1 ao 5", async () => {
    client.load.mockResolvedValue(makeStep());
    render(<GuidedDisciplines characterId="character-one" />);

    const opener = await screen.findByRole("button", {
      name: "Ver detalhes da Disciplina →",
    });
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Auspícios" })).toBeVisible();
    expect(dialog.querySelector("img")).toHaveAttribute(
      "src",
      "/assets/wod/disciplines/auspex.svg",
    );
    for (const level of [1, 2, 3, 4, 5])
      expect(
        within(dialog).getByRole("heading", { name: `Nível ${level}` }),
      ).toBeVisible();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(opener).toHaveFocus());
  });
});
