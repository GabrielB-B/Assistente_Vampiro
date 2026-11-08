import { describe, expect, it } from "vitest";
import {
  CREATION_SKILL_IDS,
  CREATION_SKILL_METHODS,
  evaluateCreationSkills,
  type CreationSkillId,
  type CreationSkillMethodId,
} from "../src/index.js";

function valuesFor(methodId: CreationSkillMethodId): Record<CreationSkillId, number> {
  const method = CREATION_SKILL_METHODS.find((item) => item.id === methodId)!;
  const values = Object.fromEntries(CREATION_SKILL_IDS.map((id) => [id, 0])) as Record<
    CreationSkillId,
    number
  >;
  let index = 0;
  for (const { count, rating } of method.ratingCounts) {
    for (let slot = 0; slot < count; slot += 1)
      values[CREATION_SKILL_IDS[index++]!] = rating;
  }
  return values;
}

describe("política de criação de Habilidades V5", () => {
  for (const method of CREATION_SKILL_METHODS) {
    it(`aceita a distribuição completa de ${method.id}`, () => {
      const skills = valuesFor(method.id);
      const specialties = [
        ...(
          [
            "skill:academics",
            "skill:craft",
            "skill:performance",
            "skill:science",
          ] as const
        )
          .filter((skillId) => skills[skillId] > 0)
          .map((skillId, index) => ({
            id: `auto-${index}`,
            label: `Foco ${index}`,
            origin: "CREATION_AUTOMATIC" as const,
            skillId,
          })),
        {
          id: "free",
          label: "Foco livre",
          origin: "CREATION_FREE" as const,
          skillId: CREATION_SKILL_IDS.find((id) => skills[id] > 0)!,
        },
      ];
      expect(
        evaluateCreationSkills(skills, method.id, specialties, "CREATION_FINALIZATION")
          .complete,
      ).toBe(true);
    });
  }

  it("aceita progresso parcial alcançável e rejeita excesso", () => {
    const partial = Object.fromEntries(CREATION_SKILL_IDS.map((id) => [id, 0])) as Record<
      CreationSkillId,
      number
    >;
    partial["skill:athletics"] = 3;
    expect(
      evaluateCreationSkills(partial, "QUICK_BALANCED", [], "CREATION_STEP").violations,
    ).toEqual([]);
    partial["skill:brawl"] = 4;
    expect(
      evaluateCreationSkills(
        partial,
        "QUICK_BALANCED",
        [],
        "CREATION_STEP",
      ).violations.map((item) => item.code),
    ).toContain("SKILL_DISTRIBUTION_UNREACHABLE");
  });

  it("não permite Especialização sem Habilidade nem acima do valor", () => {
    const skills = Object.fromEntries(CREATION_SKILL_IDS.map((id) => [id, 0])) as Record<
      CreationSkillId,
      number
    >;
    const zero = evaluateCreationSkills(
      skills,
      "QUICK_BALANCED",
      [
        {
          id: "one",
          label: "Formal",
          origin: "CREATION_FREE",
          skillId: "skill:etiquette",
        },
      ],
      "CREATION_STEP",
    );
    expect(zero.violations.map((item) => item.code)).toContain(
      "SPECIALTY_REQUIRES_SKILL",
    );
    skills["skill:etiquette"] = 1;
    const excess = evaluateCreationSkills(
      skills,
      "QUICK_BALANCED",
      [
        {
          id: "one",
          label: "Formal",
          origin: "CREATION_FREE",
          skillId: "skill:etiquette",
        },
        {
          id: "two",
          label: "Camarilla",
          origin: "CREATION_AUTOMATIC",
          skillId: "skill:etiquette",
        },
      ],
      "CREATION_STEP",
    );
    expect(excess.violations.map((item) => item.code)).toContain(
      "SPECIALTY_LIMIT_EXCEEDED",
    );
  });

  it("não aceita origem automática inventada para outra Habilidade", () => {
    const skills = Object.fromEntries(CREATION_SKILL_IDS.map((id) => [id, 0])) as Record<
      CreationSkillId,
      number
    >;
    skills["skill:etiquette"] = 1;

    const evaluation = evaluateCreationSkills(
      skills,
      "QUICK_BALANCED",
      [
        {
          id: "invalid-origin",
          label: "Etiqueta formal",
          origin: "CREATION_AUTOMATIC",
          skillId: "skill:etiquette",
        },
      ],
      "CREATION_STEP",
    );

    expect(evaluation.violations.map((item) => item.code)).toContain(
      "SPECIALTY_ORIGIN_INVALID",
    );
  });
});
