import { describe, expect, it } from "vitest";

import { CREATION_CONCEPT_POLICY, evaluateCreationConcept } from "../src/index.js";

const complete = {
  ambition: "Encontrar quem apagou suas memórias.",
  concept: "Investigadora da própria noite.",
  convictionPairs: [],
  desire: null,
  name: "Noemi Vale",
  sire: null,
} as const;

describe("RULE-CREATION-CONCEPT-001-r1", () => {
  it("considera concluído o núcleo obrigatório sem exigir campos opcionais", () => {
    expect(evaluateCreationConcept(complete, "CREATION_STEP")).toMatchObject({
      complete: true,
      incompletePairPositions: [],
      missingRequiredFields: [],
      violations: [],
    });
  });

  it("mantém o rascunho salvável enquanto informa campos mínimos ausentes", () => {
    expect(
      evaluateCreationConcept(
        { ...complete, ambition: null, concept: null, name: "" },
        "CREATION_STEP",
      ),
    ).toMatchObject({
      complete: false,
      missingRequiredFields: ["name", "concept", "ambition"],
      violations: [],
    });
  });

  it("trata Convicção e Pilar como um único par progressivo", () => {
    expect(
      evaluateCreationConcept(
        {
          ...complete,
          convictionPairs: [
            { conviction: "Nunca abandonar inocentes.", touchstone: null },
          ],
        },
        "CREATION_STEP",
      ),
    ).toMatchObject({ complete: false, incompletePairPositions: [0] });
  });

  it("obtém o limite do perfil e rejeita apenas o excesso estrutural", () => {
    const pair = { conviction: "Um princípio.", touchstone: "Uma pessoa." };
    const evaluation = evaluateCreationConcept(
      {
        ...complete,
        convictionPairs: Array.from(
          { length: CREATION_CONCEPT_POLICY.maximumConvictionPairs + 1 },
          () => pair,
        ),
      },
      "CREATION_STEP",
    );

    expect(evaluation.violations).toEqual([
      { code: "CONVICTION_PAIR_LIMIT_EXCEEDED", path: ["convictionPairs"] },
    ]);
  });
});
