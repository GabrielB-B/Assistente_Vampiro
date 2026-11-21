import { describe, expect, it } from "vitest";

import {
  determineCreationOriginChangeImpact,
  evaluateCreationProgress,
  projectCreationDisciplinePolicy,
} from "../src/index.js";

describe("contexto progressivo da criação", () => {
  it("projeta políticas distintas para clã, Caitiff e Sangue-Ralo", () => {
    expect(projectCreationDisciplinePolicy("clan:toreador")).toMatchObject({
      allowedDisciplines: [
        "discipline:auspex",
        "discipline:celerity",
        "discipline:presence",
      ],
      family: "CLAN",
      originId: "clan:toreador",
      selectionRules: "TWO_AND_ONE_FROM_ANY_TWO",
    });
    expect(projectCreationDisciplinePolicy("origin:caitiff")).toEqual({
      family: "CAITIFF",
      selectionScope: "ANY_STANDARD_DISCIPLINE",
      startingDistribution: "TWO_AND_ONE_FROM_ANY_TWO",
    });
    expect(projectCreationDisciplinePolicy("origin:thin-blood")).toEqual({
      family: "THIN_BLOOD",
      hasIntrinsicClanDisciplines: false,
      selectionRules: "NONE_UNLESS_THIN_BLOOD_ALCHEMIST_MERIT",
    });
  });

  it("calcula o progresso pelo estado real, não pela rota atual", () => {
    expect(
      evaluateCreationProgress({
        attributesComplete: false,
        attributesStarted: true,
        clanComplete: true,
        conceptComplete: true,
        conceptStarted: true,
      }).slice(0, 4),
    ).toEqual([
      { id: "concept", status: "complete" },
      { id: "clan", status: "complete" },
      { id: "attributes", status: "in_progress" },
      { id: "skills", status: "not_started" },
    ]);
  });

  it("detecta etapas posteriores preenchidas sem apagar qualquer escolha", () => {
    expect(
      determineCreationOriginChangeImpact("clan:toreador", "clan:ventrue", {
        advantages: "in_progress",
        disciplines: "complete",
        predator: "not_started",
      }),
    ).toEqual({
      changed: true,
      potentiallyAffectedSteps: [
        "disciplines",
        "predator",
        "advantages",
        "history-and-blood",
      ],
      requiresConfirmation: true,
      stepsRequiringReview: ["disciplines", "advantages"],
    });
  });

  it("não exige confirmação enquanto etapas afetadas ainda não existem", () => {
    expect(
      determineCreationOriginChangeImpact("origin:caitiff", "origin:thin-blood", {}),
    ).toMatchObject({
      changed: true,
      requiresConfirmation: false,
      stepsRequiringReview: [],
    });
  });
});
