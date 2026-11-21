import { describe, expect, it } from "vitest";

import {
  BLOOD_SORCERY_RITUAL_ACQUISITION_POLICY,
  BLOOD_SORCERY_RITUAL_CATALOG,
  BLOOD_SORCERY_RITUAL_EXECUTION_POLICY,
  DISCIPLINE_CATALOG,
  DISCIPLINE_POWER_CATALOG,
  OBLIVION_CEREMONY_ACQUISITION_POLICY,
  OBLIVION_CEREMONY_CATALOG,
  OBLIVION_CEREMONY_EXECUTION_POLICY,
  THIN_BLOOD_ALCHEMY_ACQUISITION_POLICY,
  THIN_BLOOD_ALCHEMY_EXECUTION_POLICY,
  THIN_BLOOD_ALCHEMY_FORMULA_CATALOG,
  eligibleDisciplinePowers,
  evaluateCreationDisciplines,
  projectCreationDisciplineSubchoices,
  resolveCreationDisciplinePolicy,
} from "../src/index.js";

describe("Disciplinas na criação V5", () => {
  it("mantém o catálogo completo, versionado e sem duplicidades", () => {
    const expectedCounts = new Map([
      ["discipline:animalism", 14],
      ["discipline:auspex", 13],
      ["discipline:blood-sorcery", 9],
      ["discipline:celerity", 13],
      ["discipline:dominate", 13],
      ["discipline:fortitude", 13],
      ["discipline:obfuscate", 13],
      ["discipline:oblivion", 18],
      ["discipline:potence", 13],
      ["discipline:presence", 13],
      ["discipline:protean", 12],
      ["discipline:thin-blood-alchemy", 17],
    ]);
    const powers = DISCIPLINE_CATALOG.flatMap((discipline) => discipline.powers);

    expect(DISCIPLINE_CATALOG).toHaveLength(expectedCounts.size);
    for (const discipline of DISCIPLINE_CATALOG) {
      expect(discipline.powers).toHaveLength(expectedCounts.get(discipline.id)!);
      expect(new Set(discipline.powers.map((power) => power.level))).toEqual(
        new Set([1, 2, 3, 4, 5]),
      );
    }
    expect(new Set(powers.map((power) => power.id)).size).toBe(powers.length);
    expect(powers).toHaveLength(161);
    expect(powers.every((power) => power.namePtBr && power.nameOriginal)).toBe(true);
    expect(powers.every((power) => power.descriptionPtBr.length > 0)).toBe(true);
    expect(
      powers.every(
        (power) =>
          power.presentation.contentKind === "PROJECT_PARAPHRASE" &&
          power.presentation.descriptionPtBr === power.descriptionPtBr,
      ),
    ).toBe(true);
    expect(
      DISCIPLINE_CATALOG.every(
        (discipline) => discipline.descriptionPtBr.length > discipline.summaryPtBr.length,
      ),
    ).toBe(true);
    expect(powers.every((power) => power.sourceRefs.length > 0)).toBe(true);
    expect(DISCIPLINE_CATALOG.map((discipline) => discipline.auditStatus)).not.toContain(
      "PENDING",
    );
    expect(powers.every((power) => power.auditStatus !== "PENDING")).toBe(true);
    expect(
      powers.every(
        (power) =>
          power.systemPtBr !== undefined &&
          power.cost !== undefined &&
          power.duration !== undefined,
      ),
    ).toBe(true);
    expect(
      powers.every((power) =>
        power.ruleRevisions.every((revision) => revision.sourceRefs.length > 0),
      ),
    ).toBe(true);
    expect(
      powers.every(
        (power) =>
          power.ruleRevisions.find((revision) => revision.status === "ACTIVE")?.id ===
          power.ruleRevisionId,
      ),
    ).toBe(true);
    expect(
      new Set(powers.flatMap((power) => power.sourceRefs.map((ref) => ref.sourceId))),
    ).toEqual(new Set(["SRC-0001", "SRC-0003", "SRC-0004"]));
  });

  it("oferece descrição editorial aprofundada para todas as Disciplinas do Toreador", () => {
    const toreadorDisciplineIds = new Set([
      "discipline:auspex",
      "discipline:celerity",
      "discipline:presence",
    ]);
    const powers = DISCIPLINE_CATALOG.filter((discipline) =>
      toreadorDisciplineIds.has(discipline.id),
    ).flatMap((discipline) => discipline.powers);

    expect(powers).toHaveLength(39);
    expect(
      powers.every((power) => power.descriptionPtBr.length > power.summaryPtBr.length),
    ).toBe(true);
    expect(powers.every((power) => power.rule.auditStatus !== "PENDING")).toBe(true);
    expect(powers.every((power) => power.rule.systemStepsPtBr.length >= 2)).toBe(true);
    expect(
      DISCIPLINE_CATALOG.flatMap((discipline) => discipline.powers).every(
        (power) => power.rule.auditStatus !== "PENDING",
      ),
    ).toBe(true);
  });

  it("separa Poderes, Rituais, Cerimônias e Fórmulas sem duplicar IDs", () => {
    expect(DISCIPLINE_POWER_CATALOG).toHaveLength(144);
    expect(BLOOD_SORCERY_RITUAL_CATALOG).toHaveLength(38);
    expect(OBLIVION_CEREMONY_CATALOG).toHaveLength(9);
    expect(THIN_BLOOD_ALCHEMY_FORMULA_CATALOG).toHaveLength(17);
    expect(
      DISCIPLINE_POWER_CATALOG.every(
        (item) => item.disciplineId !== "discipline:thin-blood-alchemy",
      ),
    ).toBe(true);
    expect(
      THIN_BLOOD_ALCHEMY_FORMULA_CATALOG.every(
        (item) => item.disciplineId === "discipline:thin-blood-alchemy",
      ),
    ).toBe(true);

    for (const catalog of [
      DISCIPLINE_POWER_CATALOG,
      BLOOD_SORCERY_RITUAL_CATALOG,
      OBLIVION_CEREMONY_CATALOG,
      THIN_BLOOD_ALCHEMY_FORMULA_CATALOG,
    ]) {
      expect(new Set(catalog.map((item) => item.id)).size).toBe(catalog.length);
      expect(catalog.every((item) => item.auditStatus !== "PENDING")).toBe(true);
      expect(
        catalog.every((item) => item.sourceRefs.every((ref) => ref.pages.length > 0)),
      ).toBe(true);
      expect(catalog.every((item) => item.ruleRevisionId.length > 0)).toBe(true);
    }
  });

  it("fecha o inventário de Rituais e Cerimônias por nível", () => {
    const countLevels = (items: readonly { level: number }[]) =>
      [1, 2, 3, 4, 5].map((level) => items.filter((item) => item.level === level).length);

    expect(countLevels(BLOOD_SORCERY_RITUAL_CATALOG)).toEqual([7, 9, 8, 8, 6]);
    expect(countLevels(OBLIVION_CEREMONY_CATALOG)).toEqual([2, 2, 2, 2, 1]);
    expect(
      OBLIVION_CEREMONY_CATALOG.every((ceremony) =>
        DISCIPLINE_POWER_CATALOG.some(
          (power) => power.id === ceremony.prerequisitePowerId,
        ),
      ),
    ).toBe(true);
  });

  it("formaliza aquisição inicial e posterior dos três subsistemas", () => {
    expect(BLOOD_SORCERY_RITUAL_ACQUISITION_POLICY.creation).toMatchObject({
      grantedChoices: 1,
      maximumLevel: 1,
      minimumBloodSorceryRating: 1,
    });
    expect(BLOOD_SORCERY_RITUAL_ACQUISITION_POLICY.duringPlay).toMatchObject({
      experienceCostFormula: "nível do Ritual × 3",
      maximumLevelFormula: "rating de Feitiçaria de Sangue",
    });
    expect(OBLIVION_CEREMONY_ACQUISITION_POLICY.creation).toMatchObject({
      grantedChoices: 1,
      maximumLevel: 1,
      requiresAnyMatchingPrerequisitePower: true,
    });
    expect(
      THIN_BLOOD_ALCHEMY_ACQUISITION_POLICY.formulaGrant.formulaePerAlchemyRating,
    ).toBe(1);
    expect(
      THIN_BLOOD_ALCHEMY_ACQUISITION_POLICY.temporaryDisciplineAccess
        .persistsAsPermanentRating,
    ).toBe(false);
  });

  it.each([1, 2])(
    "projeta exatamente um Ritual inicial de nível 1 com Feitiçaria de Sangue %i",
    (rating) => {
      const pending = projectCreationDisciplineSubchoices({
        bloodSorceryRitualIds: [],
        disciplines: [
          {
            disciplineId: "discipline:blood-sorcery",
            rating,
            structuralMaximum: 5,
          },
        ],
        oblivionCeremonyIds: [],
        powers: [],
        thinBloodAlchemyFormulaIds: [],
        thinBloodAlchemyMethod: null,
      });

      expect(pending).toHaveLength(1);
      expect(pending[0]).toMatchObject({
        kind: "BLOOD_SORCERY_RITUAL",
        ordinal: 1,
      });
      expect(pending[0]?.eligibleIds).toHaveLength(7);
      expect(
        pending[0]?.eligibleIds.every((id) =>
          BLOOD_SORCERY_RITUAL_CATALOG.some(
            (ritual) => ritual.id === id && ritual.level === 1,
          ),
        ),
      ).toBe(true);
    },
  );

  it("projeta Cerimônia somente quando existe Poder pré-requisito compatível", () => {
    const base = {
      bloodSorceryRitualIds: [],
      disciplines: [
        {
          disciplineId: "discipline:oblivion" as const,
          rating: 1,
          structuralMaximum: 5 as const,
        },
      ],
      oblivionCeremonyIds: [],
      thinBloodAlchemyFormulaIds: [],
      thinBloodAlchemyMethod: null,
    };

    expect(projectCreationDisciplineSubchoices({ ...base, powers: [] })).toEqual([]);
    expect(
      projectCreationDisciplineSubchoices({
        ...base,
        powers: [
          {
            disciplineId: "discipline:oblivion",
            powerId: "power:oblivion-ashes-to-ashes",
            powerRuleRevisionId: "test-r1",
          },
        ],
      }),
    ).toEqual([
      {
        eligibleIds: ["ceremony:oblivion:gift-of-false-life"],
        kind: "OBLIVION_CEREMONY",
        ordinal: 1,
      },
    ]);
  });

  it("projeta método antes da primeira Fórmula de Alquimia Sangue-Ralo", () => {
    const base = {
      bloodSorceryRitualIds: [],
      disciplines: [
        {
          disciplineId: "discipline:thin-blood-alchemy" as const,
          rating: 1,
          structuralMaximum: 5 as const,
        },
      ],
      oblivionCeremonyIds: [],
      powers: [],
      thinBloodAlchemyFormulaIds: [],
    };

    expect(
      projectCreationDisciplineSubchoices({
        ...base,
        thinBloodAlchemyMethod: null,
      }),
    ).toEqual([
      {
        eligibleIds: ["ATHANOR_CORPORIS", "CALCINATIO", "FIXATIO"],
        kind: "THIN_BLOOD_ALCHEMY_METHOD",
        ordinal: 1,
      },
    ]);
    expect(
      projectCreationDisciplineSubchoices({
        ...base,
        thinBloodAlchemyMethod: "FIXATIO",
      }),
    ).toMatchObject([
      {
        kind: "THIN_BLOOD_ALCHEMY_FORMULA",
        ordinal: 1,
      },
    ]);
  });

  it("formaliza a execução geral sem esconder as exceções de cada item", () => {
    expect(BLOOD_SORCERY_RITUAL_EXECUTION_POLICY).toMatchObject({
      castTime: "Cinco minutos por nível, salvo exceção expressa do Ritual",
      dicePool: "Inteligência + Feitiçaria de Sangue",
      difficultyFormula: "nível do Ritual + 1",
    });
    expect(BLOOD_SORCERY_RITUAL_EXECUTION_POLICY.wards).toMatchObject({
      criticalWinDamage: "Três pontos de dano Agravado à Vitalidade",
      forcedContactTriggersWard: false,
      successDamage: "Um ponto de dano Agravado à Vitalidade",
    });
    expect(BLOOD_SORCERY_RITUAL_EXECUTION_POLICY.wardingCircles).toMatchObject({
      cost: "Três Checagens de Sangue",
      extendedDurationDifficultyModifier: 2,
      radiusLimitMeters: 3,
    });
    expect(OBLIVION_CEREMONY_EXECUTION_POLICY).toMatchObject({
      dicePool: "Determinação + Oblívio",
      difficultyFormula: "nível da Cerimônia + 1",
      requiresMatchingPrerequisitePower: true,
    });
    expect(THIN_BLOOD_ALCHEMY_EXECUTION_POLICY.methods).toMatchObject({
      ATHANOR_CORPORIS: { dicePool: "Vigor + Alquimia Sangue-Ralo" },
      CALCINATIO: { dicePool: "Manipulação + Alquimia Sangue-Ralo" },
      FIXATIO: { dicePool: "Inteligência + Alquimia Sangue-Ralo" },
    });
  });

  it("preserva os tempos excepcionais dos Rituais auditados", () => {
    const castTime = (id: string) =>
      BLOOD_SORCERY_RITUAL_CATALOG.find((ritual) => ritual.id === id)?.rule.castTime;

    expect(castTime("ritual:blood-sorcery:clinging-of-the-insect")).toBe(
      "Cinco minutos por nível",
    );
    expect(castTime("ritual:blood-sorcery:blood-walk")).toBe("Uma hora");
    expect(castTime("ritual:blood-sorcery:craft-bloodstone")).toBe("Três noites");
    expect(castTime("ritual:blood-sorcery:warding-circle-against-lupines")).toBe(
      "Uma noite inteira",
    );
    expect(castTime("ritual:blood-sorcery:calix-secretus")).toBe("Uma hora");
  });

  it("mantém os níveis normativos corrigidos das Fórmulas", () => {
    expect(
      THIN_BLOOD_ALCHEMY_FORMULA_CATALOG.find(
        (formula) => formula.id === "power:tba-profane-hieros-gamos",
      )?.level,
    ).toBe(3);
    expect(
      THIN_BLOOD_ALCHEMY_FORMULA_CATALOG.find(
        (formula) => formula.id === "power:tba-rumor",
      )?.level,
    ).toBe(3);
    expect(
      THIN_BLOOD_ALCHEMY_FORMULA_CATALOG.every(
        (formula) => formula.ingredientsPtBr.length > 0 && formula.methods.length === 3,
      ),
    ).toBe(true);
  });

  it("confere o inventário canônico completo de cada Disciplina auditada", () => {
    const expected = new Map([
      [
        "discipline:auspex",
        [
          "auspex-heightened-senses",
          "auspex-sense-the-unseen",
          "auspex-premonition",
          "auspex-panacea",
          "auspex-scry-the-soul",
          "auspex-share-the-senses",
          "auspex-reveal-temper",
          "auspex-fatal-flaw",
          "auspex-spirits-touch",
          "auspex-clairvoyance",
          "auspex-possession",
          "auspex-telepathy",
          "auspex-unburdening-bestial-soul",
        ],
      ],
      [
        "discipline:celerity",
        [
          "celerity-cats-grace",
          "celerity-rapid-reflexes",
          "celerity-fleetness",
          "celerity-russian-work",
          "celerity-blink",
          "celerity-traversal",
          "celerity-weaving",
          "celerity-draught-of-elegance",
          "celerity-unerring-aim",
          "celerity-blurred-momentum",
          "celerity-lightning-strike",
          "celerity-split-second",
          "celerity-unseen-strike",
        ],
      ],
      [
        "discipline:presence",
        [
          "presence-awe",
          "presence-daunt",
          "presence-serpents-eyes",
          "presence-lingering-kiss",
          "presence-thrown-voice",
          "presence-melpominee",
          "presence-dread-gaze",
          "presence-entrancement",
          "presence-irresistible-voice",
          "presence-summon",
          "presence-blow-edifice",
          "presence-majesty",
          "presence-star-magnetism",
        ],
      ],
    ] as const);

    for (const [disciplineId, slugs] of expected) {
      const discipline = DISCIPLINE_CATALOG.find((item) => item.id === disciplineId);
      expect(discipline?.powers.map((item) => item.id)).toEqual(
        slugs.map((slug) => `power:${slug}`),
      );
    }

    const powers = DISCIPLINE_CATALOG.flatMap((item) => item.powers);
    expect(powers.find((item) => item.id === "power:auspex-panacea")?.sourceRefs).toEqual(
      [
        { pages: [24], sourceId: "SRC-0003" },
        { pages: [70], sourceId: "SRC-0004" },
      ],
    );
    expect(
      powers.find((item) => item.id === "power:celerity-russian-work")?.sourceRefs,
    ).toEqual([{ pages: [72], sourceId: "SRC-0004" }]);
    expect(
      powers.find((item) => item.id === "power:presence-thrown-voice")?.sourceRefs,
    ).toEqual([{ pages: [80], sourceId: "SRC-0004" }]);
  });

  it("devolve todas as opções elegíveis para rating 1 e para a segunda escolha", () => {
    const ratings = new Map([
      ["discipline:auspex" as const, 0],
      ["discipline:celerity" as const, 0],
      ["discipline:presence" as const, 2],
    ]);

    expect(
      eligibleDisciplinePowers("discipline:presence", 1, [], ratings).map(
        (item) => item.id,
      ),
    ).toEqual(["power:presence-awe", "power:presence-daunt"]);
    expect(
      eligibleDisciplinePowers(
        "discipline:presence",
        2,
        ["power:presence-awe"],
        ratings,
      ).map((item) => item.id),
    ).toEqual([
      "power:presence-daunt",
      "power:presence-lingering-kiss",
      "power:presence-melpominee",
    ]);
  });

  it("preserva integralmente as operações mecânicas auditadas no contrato estruturado", () => {
    const powers = DISCIPLINE_CATALOG.flatMap((discipline) => discipline.powers);
    const byId = (id: string) => powers.find((power) => power.id === id);

    expect(byId("power:auspex-heightened-senses")?.rule).toMatchObject({
      dicePool: "Raciocínio + Determinação",
      difficulty: "3 ou mais contra sobrecarga sensorial, conforme a intensidade",
      sourceRefs: [{ pages: [249], sourceId: "SRC-0001" }],
    });
    expect(
      byId("power:auspex-heightened-senses")?.rule.systemStepsPtBr.join(" "),
    ).toContain("penalidade de três dados");
    expect(byId("power:auspex-clairvoyance")?.rule.dicePool).toBe(
      "Inteligência + Auspícios",
    );
    expect(byId("power:auspex-clairvoyance")?.rule.systemStepsPtBr.join(" ")).toContain(
      "nível-base do Refúgio",
    );
    expect(
      byId("power:celerity-cats-grace")?.rule.systemStepsPtBr.join(" "),
    ).not.toContain("queda");
    expect(byId("power:celerity-unerring-aim")?.rule).toMatchObject({
      difficulty: "1 para o ataque",
      duration: "Um único ataque",
    });
    expect(byId("power:presence-lingering-kiss")?.rule.duration).toBe(
      "Até a vítima resistir com sucesso",
    );
    expect(byId("power:presence-star-magnetism")?.rule.restrictionsPtBr).toContain(
      "Imagens, áudios e mensagens gravados não preservam o efeito.",
    );
  });

  it("preserva a mecânica estruturada de Poderes representativos", () => {
    const powers = DISCIPLINE_CATALOG.flatMap((discipline) => discipline.powers);
    const panacea = powers.find((power) => power.id === "power:auspex-panacea");
    const fatalFlaw = powers.find((power) => power.id === "power:auspex-fatal-flaw");
    const mercurianTongue = powers.find(
      (power) => power.id === "power:tba-mercurian-tongue",
    );

    expect(panacea).toBeDefined();
    expect(panacea).toMatchObject({
      auditStatus: "CONFLICT_REVIEWED",
      dicePool: "Autocontrole + Auspícios",
      duration: "Não aplicável",
    });
    expect(panacea?.cost).toContain("Checagem de Sangue");
    expect(panacea?.difficulty).toContain("2");
    expect(panacea?.systemPtBr).toContain("Força de Vontade");
    expect(fatalFlaw).toMatchObject({
      amalgamRequirements: [{ disciplineId: "discipline:oblivion", rating: 1 }],
    });
    expect(fatalFlaw?.dicePool).toContain("Inteligência + Auspícios");
    expect(mercurianTongue).toMatchObject({
      level: 1,
      sourceRefs: [{ sourceId: "SRC-0004", pages: [103] }],
    });
  });

  it("projeta exatamente as três Disciplinas do Toreador e a política 2/1", () => {
    expect(resolveCreationDisciplinePolicy("clan:toreador")).toMatchObject({
      allowedDisciplineIds: [
        "discipline:auspex",
        "discipline:celerity",
        "discipline:presence",
      ],
      family: "CLAN",
      requiredRatings: [2, 1],
      structuralMaximum: 5,
    });
  });

  it("preserva os rótulos dos materiais PT-BR fornecidos", () => {
    const auspex = DISCIPLINE_CATALOG.find((item) => item.id === "discipline:auspex");
    const celerity = DISCIPLINE_CATALOG.find((item) => item.id === "discipline:celerity");
    const presence = DISCIPLINE_CATALOG.find((item) => item.id === "discipline:presence");
    const potence = DISCIPLINE_CATALOG.find((item) => item.id === "discipline:potence");
    const alchemy = DISCIPLINE_CATALOG.find(
      (item) => item.id === "discipline:thin-blood-alchemy",
    );

    expect(
      auspex?.powers.find((item) => item.id === "power:auspex-panacea"),
    ).toMatchObject({ namePtBr: "Panaceia" });
    expect(
      celerity?.powers.find((item) => item.id === "power:celerity-russian-work"),
    ).toMatchObject({ namePtBr: "Trabalho Russo" });
    expect(
      presence?.powers.find((item) => item.id === "power:presence-awe"),
    ).toMatchObject({
      namePtBr: "Fascínio",
      sourceRefs: [{ sourceId: "SRC-0001" }],
    });
    expect(
      presence?.powers.find((item) => item.id === "power:presence-thrown-voice"),
    ).toMatchObject({
      namePtBr: "Voz Lançada",
      sourceRefs: [{ sourceId: "SRC-0004" }],
    });
    expect(
      presence?.powers.find((item) => item.id === "power:presence-serpents-eyes"),
    ).toMatchObject({ namePtBr: "Olhos da Serpente" });
    expect(
      presence?.powers.find((item) => item.id === "power:presence-melpominee"),
    ).toMatchObject({ namePtBr: "Melpominê" });
    expect(
      potence?.powers.find((item) => item.id === "power:potence-crash-down"),
    ).toMatchObject({ namePtBr: "Queda", nameOriginal: "Crash Down" });
    expect(
      potence?.powers.find((item) => item.id === "power:potence-wrecker"),
    ).toMatchObject({ namePtBr: "Destruidor", nameOriginal: "Wrecker" });
    expect(
      alchemy?.powers.find((item) => item.id === "power:tba-mercurian-tongue"),
    ).toMatchObject({ namePtBr: "Língua Mercúria" });
    expect(
      alchemy?.powers.find((item) => item.id === "power:tba-blooming-amaranth"),
    ).toMatchObject({ namePtBr: "Amaranto Florido" });
  });

  it("conclui somente quando 2/1 possui um Poder por ponto", () => {
    const policy = resolveCreationDisciplinePolicy("clan:toreador");
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:auspex", rating: 0, structuralMaximum: 5 },
          { disciplineId: "discipline:celerity", rating: 1, structuralMaximum: 5 },
          { disciplineId: "discipline:presence", rating: 2, structuralMaximum: 5 },
        ],
        powers: [
          {
            disciplineId: "discipline:celerity",
            powerId: "power:celerity-cats-grace",
            powerRuleRevisionId: "CATALOG-V5-CORE-COMPANION-PG-2023-r1",
          },
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-awe",
            powerRuleRevisionId: "CATALOG-V5-CORE-COMPANION-PG-2023-r1",
          },
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-lingering-kiss",
            powerRuleRevisionId: "CATALOG-V5-CORE-COMPANION-PG-2023-r1",
          },
        ],
      },
      policy,
    );
    expect(evaluation).toMatchObject({
      complete: true,
      pendingPowerChoices: [],
      violations: [],
    });
  });

  it("rejeita o prefixo 2/2 por exceder o orçamento inicial 2/1", () => {
    const policy = resolveCreationDisciplinePolicy("clan:toreador");
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:auspex", rating: 2, structuralMaximum: 5 },
          { disciplineId: "discipline:celerity", rating: 0, structuralMaximum: 5 },
          { disciplineId: "discipline:presence", rating: 2, structuralMaximum: 5 },
        ],
        powers: [],
      },
      policy,
    );

    expect(evaluation.complete).toBe(false);
    expect(evaluation.violations).toContainEqual({
      code: "CREATION_DISCIPLINE_DISTRIBUTION_EXCEEDED",
      path: ["disciplines"],
    });
  });

  it("rejeita Poder acima do rating e duplicidade", () => {
    const policy = resolveCreationDisciplinePolicy("clan:toreador");
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:presence", rating: 1, structuralMaximum: 5 },
        ],
        powers: [
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-lingering-kiss",
            powerRuleRevisionId: "r1",
          },
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-lingering-kiss",
            powerRuleRevisionId: "r1",
          },
        ],
      },
      policy,
    );
    expect(evaluation.violations.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        "DISCIPLINE_POWER_DUPLICATE",
        "DISCIPLINE_POWER_LEVEL_INSUFFICIENT",
      ]),
    );
  });

  it("não oferece Amálgama quando o rating cruzado não existe", () => {
    const eligible = eligibleDisciplinePowers(
      "discipline:presence",
      1,
      [],
      new Map([["discipline:presence", 1]]),
    );
    expect(eligible.map((item) => item.id)).not.toContain("power:presence-serpents-eyes");
  });

  it("modela pré-requisito alternativo e Amálgama sem delegar a decisão à UI", () => {
    const ratings = new Map([
      ["discipline:animalism" as const, 3],
      ["discipline:dominate" as const, 1],
    ]);
    const withoutCommand = eligibleDisciplinePowers(
      "discipline:animalism",
      3,
      ["power:animalism-animal-messenger"],
      ratings,
    );
    const withCommand = eligibleDisciplinePowers(
      "discipline:animalism",
      3,
      ["power:animalism-animal-messenger", "power:dominate-compel"],
      ratings,
    );

    expect(withoutCommand.map((power) => power.id)).not.toContain(
      "power:animalism-messengers-command",
    );
    expect(withCommand.map((power) => power.id)).toContain(
      "power:animalism-messengers-command",
    );
  });

  it("revela primeiro Poder de nível 1 antes do slot de nível 2", () => {
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:presence", rating: 2, structuralMaximum: 5 },
        ],
        powers: [],
      },
      resolveCreationDisciplinePolicy("clan:toreador"),
    );
    const firstChoice = evaluation.pendingPowerChoices[0];
    expect(firstChoice?.ordinal).toBe(1);
    expect(firstChoice?.eligiblePowerIds).toContain("power:presence-awe");
    expect(firstChoice?.eligiblePowerIds).not.toContain("power:presence-lingering-kiss");
  });

  it("rejeita usar um Poder de nível 2 no primeiro slot", () => {
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:presence", rating: 2, structuralMaximum: 5 },
        ],
        powers: [
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-lingering-kiss",
            powerRuleRevisionId: "r1",
          },
        ],
      },
      resolveCreationDisciplinePolicy("clan:toreador"),
    );
    expect(evaluation.violations.map((item) => item.code)).toContain(
      "DISCIPLINE_POWER_LEVEL_SLOT_INVALID",
    );
  });

  it("rejeita reduzir o rating mantendo mais Poderes do que o novo nível", () => {
    const evaluation = evaluateCreationDisciplines(
      {
        disciplines: [
          { disciplineId: "discipline:presence", rating: 1, structuralMaximum: 5 },
        ],
        powers: [
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-awe",
            powerRuleRevisionId: "r1",
          },
          {
            disciplineId: "discipline:presence",
            powerId: "power:presence-lingering-kiss",
            powerRuleRevisionId: "r1",
          },
        ],
      },
      resolveCreationDisciplinePolicy("clan:toreador"),
    );

    expect(evaluation.violations.map((item) => item.code)).toContain(
      "DISCIPLINE_POWER_COUNT_EXCEEDED",
    );
    expect(evaluation.powerAdjustments).toEqual([
      {
        disciplineId: "discipline:presence",
        incompatiblePowerIds: ["power:presence-lingering-kiss"],
        minimumRequiredRemovals: 1,
        targetRating: 1,
      },
    ]);
    expect(evaluation.complete).toBe(false);
  });

  it("Caitiff recebe todas as Disciplinas padrão, nunca Alquimia Sangue-Ralo", () => {
    const policy = resolveCreationDisciplinePolicy("origin:caitiff");
    expect(policy.allowedDisciplineIds).toHaveLength(DISCIPLINE_CATALOG.length - 1);
    expect(policy.allowedDisciplineIds).not.toContain("discipline:thin-blood-alchemy");
  });

  it("Sangue-Ralo não recebe distribuição intrínseca", () => {
    expect(resolveCreationDisciplinePolicy("origin:thin-blood")).toMatchObject({
      family: "THIN_BLOOD",
      hasIntrinsicDisciplines: false,
      requiredRatings: [],
    });
  });
});
