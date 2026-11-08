import type {
  CreationSkillId,
  CreationSkillsStepView,
} from "@assistente-vampiro/contracts";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createCreationSpecialty,
  deleteCreationSpecialty,
  loadCreationSkills,
  updateCreationSkills,
  updateCreationSpecialty,
} from "../../../criar/creation-client";
import { GuidedSkills } from "./guided-skills";

const push = vi.fn();

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

vi.mock("../../../criar/creation-client", () => ({
  createCreationSpecialty: vi.fn(),
  deleteCreationSpecialty: vi.fn(),
  loadCreationSkills: vi.fn(),
  updateCreationSkills: vi.fn(),
  updateCreationSpecialty: vi.fn(),
}));

vi.mock("../../../../character-api", () => ({
  loadCharacterSheetById: vi.fn(),
}));

const skills = {
  "skill:athletics": 0,
  "skill:etiquette": 0,
  "skill:science": 0,
} as Record<CreationSkillId, number>;

function step(overrides: Partial<CreationSkillsStepView> = {}): CreationSkillsStepView {
  const base: CreationSkillsStepView = {
    catalog: [
      {
        group: "PHYSICAL",
        id: "skill:athletics",
        labelPtBr: "Atletismo",
        summaryPtBr: "Movimento, corrida e agilidade corporal.",
      },
      {
        group: "SOCIAL",
        id: "skill:etiquette",
        labelPtBr: "Etiqueta",
        summaryPtBr: "Normas sociais e costumes em diferentes círculos.",
      },
      {
        group: "MENTAL",
        id: "skill:science",
        labelPtBr: "Ciência",
        summaryPtBr: "Conhecimento e método das ciências naturais e exatas.",
      },
    ],
    characterId: "character-one",
    creationContext: {
      characterId: "character-one",
      completedSteps: ["concept", "clan", "attributes"],
      creationProfileRevisionId: "v5-core-companion-pg-2023-r1",
      currentStep: "skills",
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
      origin: {
        clanId: "clan:toreador",
        id: "clan:toreador",
        kind: "CLAN_VAMPIRE",
      },
      steps: [
        { id: "concept", status: "complete" },
        { id: "clan", status: "complete" },
        { id: "attributes", status: "complete" },
        { id: "skills", status: "not_started" },
        { id: "disciplines", status: "not_started" },
        { id: "predator", status: "not_started" },
        { id: "advantages", status: "not_started" },
        { id: "history-and-blood", status: "not_started" },
        { id: "review", status: "not_started" },
      ],
      version: 1,
    },
    evaluation: {
      automaticSpecialtiesPending: [],
      complete: false,
      distributionComplete: false,
      freeSpecialtiesPending: 1,
      pointsAllocated: 0,
      pointsRemaining: 26,
      violations: [{ code: "SKILL_METHOD_REQUIRED", path: ["methodId"] }],
    },
    methodId: null,
    policy: {
      automaticSpecialtySkillIds: [
        "skill:academics",
        "skill:craft",
        "skill:performance",
        "skill:science",
      ],
      freeSpecialtyCount: 1,
      maximumRating: 4,
      methods: [
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
        },
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
        },
        {
          descriptionPtBr: "Organize as escolhas pela história de vida.",
          detailed: true,
          id: "DETAILED_GENERALIST",
          labelPtBr: "Detalhado — Generalista",
          ratingCounts: [
            { count: 1, rating: 3 },
            { count: 8, rating: 2 },
            { count: 10, rating: 1 },
          ],
        },
        {
          descriptionPtBr: "Organize as escolhas pela história de vida.",
          detailed: true,
          id: "DETAILED_SPECIALIST",
          labelPtBr: "Detalhado — Especialista",
          ratingCounts: [
            { count: 1, rating: 4 },
            { count: 3, rating: 3 },
            { count: 3, rating: 2 },
            { count: 3, rating: 1 },
          ],
        },
      ],
      ruleRevision: "RULE-CREATION-SKILLS-001-r1",
    },
    skills: { ...skills },
    specialties: [],
    version: 1,
  };
  return { ...base, ...overrides };
}

describe("GuidedSkills", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(loadCreationSkills).mockResolvedValue(step());
  });

  it("não mostra 0/0 antes do método e habilita os pontos após selecionar", async () => {
    const balanced = step({
      evaluation: {
        ...step().evaluation,
        violations: [],
      },
      methodId: "QUICK_BALANCED",
      version: 2,
    });
    vi.mocked(updateCreationSkills).mockResolvedValue(balanced);
    render(<GuidedSkills characterId="character-one" />);

    expect(
      await screen.findByText(
        "Selecione um método para ver sua distribuição disponível.",
      ),
    ).toBeVisible();
    expect(screen.queryByText("Pontos restantes")).toBeNull();
    expect(screen.getByRole("button", { name: "Definir Atletismo em 1" })).toBeDisabled();

    fireEvent.click(screen.getByRole("radio", { name: /Equilibrado/i }));
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: /Equilibrado/i })).toBeChecked(),
    );
    expect(screen.getByText("7 restantes")).toBeVisible();
    expect(screen.getByRole("button", { name: "Definir Atletismo em 1" })).toBeEnabled();
  });

  it("reconcilia uma seleção salva quando a confirmação da rede falha", async () => {
    const balanced = step({ methodId: "QUICK_BALANCED", version: 2 });
    vi.mocked(updateCreationSkills).mockRejectedValueOnce(
      new Error("A conexão com o serviço local foi interrompida."),
    );
    vi.mocked(loadCreationSkills)
      .mockResolvedValueOnce(step())
      .mockResolvedValueOnce(balanced);
    render(<GuidedSkills characterId="character-one" />);

    fireEvent.click(await screen.findByRole("radio", { name: /Equilibrado/i }));

    expect(
      await screen.findByText(/a alteração já estava salva e foi sincronizada/i),
    ).toBeVisible();
    expect(screen.getByRole("radio", { name: /Equilibrado/i })).toBeChecked();
    expect(updateCreationSkills).toHaveBeenCalledTimes(1);
  });

  it("oferece somente os três métodos de distribuição aprovados", async () => {
    render(<GuidedSkills characterId="character-one" />);

    expect(await screen.findByRole("radio", { name: /Equilibrado/i })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Especialista/i })).toBeVisible();
    expect(screen.getByRole("radio", { name: /Pau pra toda obra/i })).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.queryByText(/distribuir manualmente/i)).toBeNull();
    expect(screen.queryByText(/método detalhado/i)).toBeNull();
  });

  it("não permite avançar com um método detalhado legado", async () => {
    vi.mocked(loadCreationSkills).mockResolvedValue(
      step({
        evaluation: {
          ...step().evaluation,
          complete: true,
          distributionComplete: true,
          freeSpecialtiesPending: 0,
          violations: [],
        },
        methodId: "DETAILED_SPECIALIST",
      }),
    );
    render(<GuidedSkills characterId="character-one" />);

    expect(await screen.findByText("Escolha um método")).toBeVisible();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Continuar →" })).toBeDisabled();
  });

  it("mantém avisos de inelegibilidade no tooltip e usa conteúdo editorial no painel", async () => {
    render(<GuidedSkills characterId="character-one" />);

    const specialtyAction = await screen.findByRole("button", {
      name: "Adicionar ou editar especialização de Atletismo",
    });
    expect(specialtyAction).toHaveAttribute("aria-disabled", "true");
    expect(specialtyAction).toHaveAccessibleDescription(
      "Adicione ao menos 1 ponto para definir uma especialização.",
    );
    expect(screen.queryByText(/Distribua ao menos 1 ponto para vincular/i)).toBeNull();
    expect(screen.getByRole("heading", { name: "O que são Habilidades?" })).toBeVisible();
    expect(
      screen.getByText(
        /Habilidades representam tudo aquilo que seu personagem aprendeu/i,
      ),
    ).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Como pensar esta etapa" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Ajuda" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Para continuar" })).toBeNull();
  });

  it("separa tooltip, expansão e edição inline de Especialização", async () => {
    const scienceSkills = { ...skills, "skill:science": 1 };
    const withScience = step({
      evaluation: {
        ...step().evaluation,
        automaticSpecialtiesPending: ["skill:science"],
        violations: [],
      },
      methodId: "QUICK_BALANCED",
      skills: scienceSkills,
    });
    const withSpecialty = step({
      ...withScience,
      evaluation: {
        ...withScience.evaluation,
        automaticSpecialtiesPending: [],
      },
      specialties: [
        {
          id: "019a0000-0000-7000-8000-000000000001",
          label: "Química",
          origin: "CREATION_AUTOMATIC",
          skillId: "skill:science",
        },
      ],
      version: 2,
    });
    vi.mocked(loadCreationSkills).mockResolvedValue(withScience);
    vi.mocked(createCreationSpecialty).mockResolvedValue(withSpecialty);
    render(<GuidedSkills characterId="character-one" />);

    const science = await screen.findByRole("button", {
      name: "Ciência: mostrar ajuda",
    });
    expect(science).toHaveAttribute("aria-describedby", "skill:science-help");
    fireEvent.focus(science);
    expect(
      screen.getByRole("tooltip", { name: /Conhecimento e método/i }),
    ).toBeInTheDocument();
    fireEvent.click(science);
    expect(screen.queryByRole("textbox")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Adicionar ou editar especialização de Ciência",
      }),
    );
    const input = screen.getByRole("textbox", {
      name: "Nova Especialização de Ciência",
    });
    fireEvent.change(input, { target: { value: "Química" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(await screen.findByText("↳ Química")).toBeVisible();
    expect(
      screen.queryByRole("textbox", { name: "Nova Especialização de Ciência" }),
    ).toBeNull();
    expect(
      screen.getByRole("button", {
        name: "Adicionar ou editar especialização de Ciência",
      }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(createCreationSpecialty).toHaveBeenCalledWith(
      "character-one",
      1,
      "skill:science",
      "CREATION_AUTOMATIC",
      "Química",
    );
  });

  it("mantém somente uma linha aberta e fecha com Escape", async () => {
    vi.mocked(loadCreationSkills).mockResolvedValue(
      step({
        evaluation: { ...step().evaluation, violations: [] },
        methodId: "QUICK_BALANCED",
        skills: { ...skills, "skill:athletics": 1, "skill:etiquette": 1 },
      }),
    );
    render(<GuidedSkills characterId="character-one" />);

    const athletics = await screen.findByRole("button", {
      name: "Adicionar ou editar especialização de Atletismo",
    });
    const etiquette = screen.getByRole("button", {
      name: "Adicionar ou editar especialização de Etiqueta",
    });
    fireEvent.click(athletics);
    expect(athletics).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(etiquette);
    expect(athletics).toHaveAttribute("aria-expanded", "false");
    expect(etiquette).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(etiquette).toHaveAttribute("aria-expanded", "false");
  });

  it("edita e remove Especialização sem oferecer uma segunda acima do limite", async () => {
    const specialty = {
      id: "019a0000-0000-7000-8000-000000000001",
      label: "Química",
      origin: "CREATION_AUTOMATIC" as const,
      skillId: "skill:science" as const,
    };
    const withSpecialty = step({
      evaluation: { ...step().evaluation, violations: [] },
      methodId: "QUICK_BALANCED",
      skills: { ...skills, "skill:science": 1 },
      specialties: [specialty],
    });
    const edited = step({
      ...withSpecialty,
      specialties: [{ ...specialty, label: "Química Orgânica" }],
      version: 2,
    });
    const removed = step({
      ...withSpecialty,
      evaluation: {
        ...withSpecialty.evaluation,
        automaticSpecialtiesPending: ["skill:science"],
      },
      specialties: [],
      version: 3,
    });
    vi.mocked(loadCreationSkills).mockResolvedValue(withSpecialty);
    vi.mocked(updateCreationSpecialty).mockResolvedValue(edited);
    vi.mocked(deleteCreationSpecialty).mockResolvedValue(removed);
    render(<GuidedSkills characterId="character-one" />);

    expect(await screen.findByText("↳ Química")).toBeVisible();
    const scienceSpecialtyAction = screen.getByRole("button", {
      name: "Adicionar ou editar especialização de Ciência",
    });
    expect(scienceSpecialtyAction).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(scienceSpecialtyAction);
    expect(
      screen.queryByRole("button", { name: "+ Adicionar especialização" }),
    ).toBeNull();
    fireEvent.change(screen.getByRole("textbox", { name: "Nome da Especialização" }), {
      target: { value: "Química Orgânica" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(await screen.findByText("↳ Química Orgânica")).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Nome da Especialização" })).toBeNull();
    expect(scienceSpecialtyAction).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(scienceSpecialtyAction);
    fireEvent.click(screen.getByRole("button", { name: "Remover Química Orgânica" }));
    await waitFor(() => expect(screen.queryByText("↳ Química Orgânica")).toBeNull());
    expect(scienceSpecialtyAction).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("textbox", { name: "Nome da Especialização" })).toBeNull();
  });

  it("mantém o valor salvo no reload e fecha o editor ao cancelar", async () => {
    const specialty = {
      id: "019a0000-0000-7000-8000-000000000001",
      label: "História",
      origin: "CREATION_AUTOMATIC" as const,
      skillId: "skill:science" as const,
    };
    vi.mocked(loadCreationSkills).mockResolvedValue(
      step({
        evaluation: { ...step().evaluation, violations: [] },
        methodId: "QUICK_BALANCED",
        skills: { ...skills, "skill:science": 1 },
        specialties: [specialty],
      }),
    );
    render(<GuidedSkills characterId="character-one" />);

    expect(await screen.findByText("↳ História")).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Nome da Especialização" })).toBeNull();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Adicionar ou editar especialização de Ciência",
      }),
    );
    expect(screen.getByRole("textbox", { name: "Nome da Especialização" })).toHaveValue(
      "História",
    );
    expect(screen.queryByText("↳ História")).toBeNull();

    fireEvent.change(screen.getByRole("textbox", { name: "Nome da Especialização" }), {
      target: { value: "História Antiga" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("textbox", { name: "Nome da Especialização" })).toBeNull();
    expect(screen.getByText("↳ História")).toBeVisible();
  });

  it("mantém o editor e o texto digitado quando o salvamento falha", async () => {
    const specialty = {
      id: "019a0000-0000-7000-8000-000000000001",
      label: "História",
      origin: "CREATION_AUTOMATIC" as const,
      skillId: "skill:science" as const,
    };
    const persisted = step({
      evaluation: { ...step().evaluation, violations: [] },
      methodId: "QUICK_BALANCED",
      skills: { ...skills, "skill:science": 1 },
      specialties: [specialty],
    });
    vi.mocked(loadCreationSkills).mockResolvedValue(persisted);
    vi.mocked(updateCreationSpecialty).mockRejectedValue(new Error("Falha ao salvar."));
    render(<GuidedSkills characterId="character-one" />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: "Adicionar ou editar especialização de Ciência",
      }),
    );
    const input = screen.getByRole("textbox", { name: "Nome da Especialização" });
    fireEvent.change(input, { target: { value: "História Antiga" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Falha ao salvar.");
    expect(input).toHaveValue("História Antiga");
    expect(input).toBeVisible();
    expect(screen.queryByText("↳ História")).toBeNull();
  });

  it("orienta a escolha livre, abre a linha elegível e atualiza o resumo ao salvar", async () => {
    const readyForFreeSpecialty = step({
      evaluation: { ...step().evaluation, violations: [] },
      methodId: "QUICK_BALANCED",
      skills: { ...skills, "skill:athletics": 1 },
    });
    const withFreeSpecialty = step({
      ...readyForFreeSpecialty,
      evaluation: {
        ...readyForFreeSpecialty.evaluation,
        freeSpecialtiesPending: 0,
      },
      specialties: [
        {
          id: "019a0000-0000-7000-8000-000000000002",
          label: "Corrida",
          origin: "CREATION_FREE",
          skillId: "skill:athletics",
        },
      ],
      version: 2,
    });
    vi.mocked(loadCreationSkills).mockResolvedValue(readyForFreeSpecialty);
    vi.mocked(createCreationSpecialty).mockResolvedValue(withFreeSpecialty);
    render(<GuidedSkills characterId="character-one" />);

    fireEvent.click(
      await screen.findByRole("button", { name: "+ Escolher especialização livre" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Escolha uma Habilidade para receber sua especialização livre.",
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Adicionar ou editar especialização de Atletismo",
      }),
    );
    const input = screen.getByRole("textbox", {
      name: "Nova Especialização de Atletismo",
    });
    await waitFor(() => expect(input).toHaveFocus());
    fireEvent.change(input, { target: { value: "Corrida" } });
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(await screen.findByText(/Atletismo — Corrida/)).toBeVisible();
    expect(createCreationSpecialty).toHaveBeenCalledWith(
      "character-one",
      1,
      "skill:athletics",
      "CREATION_FREE",
      "Corrida",
    );
  });

  it("leva a pendência automática do painel diretamente ao editor com foco", async () => {
    const waitingForScience = step({
      evaluation: {
        ...step().evaluation,
        automaticSpecialtiesPending: ["skill:science"],
        violations: [],
      },
      methodId: "QUICK_BALANCED",
      skills: { ...skills, "skill:science": 1 },
    });
    vi.mocked(loadCreationSkills).mockResolvedValue(waitingForScience);
    render(<GuidedSkills characterId="character-one" />);

    fireEvent.click(await screen.findByRole("button", { name: /Ciência — definir/i }));
    const input = screen.getByRole("textbox", {
      name: "Nova Especialização de Ciência",
    });
    await waitFor(() => expect(input).toHaveFocus());
  });
});
