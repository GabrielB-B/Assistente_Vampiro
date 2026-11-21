import type { CreationOriginId } from "@assistente-vampiro/contracts";
import { describe, expect, it } from "vitest";

import { CLAN_PRESENTATIONS, DISCIPLINE_PRESENTATIONS } from "./clan-presentation";

const clanIds = Object.keys(CLAN_PRESENTATIONS).filter((id) =>
  id.startsWith("clan:"),
) as CreationOriginId[];

describe("conteúdo editorial de Clã", () => {
  it("cobre os 14 clãs com texto próprio e rastreabilidade", () => {
    expect(clanIds).toHaveLength(14);
    expect(
      new Set(clanIds.map((id) => CLAN_PRESENTATIONS[id].summaryParagraphs.join(" ")))
        .size,
    ).toBe(14);
    for (const id of clanIds) {
      const presentation = CLAN_PRESENTATIONS[id];
      const summaryWords = presentation.summaryParagraphs.join(" ").split(/\s+/u);
      const deepDiveWords = [
        ...presentation.summaryParagraphs,
        ...presentation.deepDiveParagraphs,
      ]
        .join(" ")
        .split(/\s+/u);
      expect(presentation.summaryParagraphs).toHaveLength(2);
      expect(presentation.deepDiveParagraphs.length).toBeGreaterThanOrEqual(2);
      expect(summaryWords.length).toBeGreaterThanOrEqual(100);
      expect(summaryWords.length).toBeLessThanOrEqual(160);
      expect(deepDiveWords.length).toBeGreaterThanOrEqual(250);
      expect(deepDiveWords.length).toBeLessThanOrEqual(450);
      expect(presentation.archetypes).toHaveLength(3);
      expect(presentation.sourceRefs.length).toBeGreaterThan(0);
    }
  });

  it("apresenta o Ministry como fé, libertação e risco de exploração", () => {
    const ministry = [
      ...CLAN_PRESENTATIONS["clan:ministry"].summaryParagraphs,
      ...CLAN_PRESENTATIONS["clan:ministry"].deepDiveParagraphs,
    ].join(" ");
    expect(ministry).toMatch(/liberta/i);
    expect(ministry).toMatch(/fé|sagrada|culto/i);
    expect(ministry).toMatch(/explora/i);
    expect(ministry).toMatch(/Set/i);
  });

  it("mantém toda Disciplina em uma apresentação reutilizável e rastreada", () => {
    expect(Object.keys(DISCIPLINE_PRESENTATIONS)).toHaveLength(12);
    for (const presentation of Object.values(DISCIPLINE_PRESENTATIONS)) {
      expect(presentation.descriptionPtBr.length).toBeGreaterThan(40);
      expect(presentation.sourceRefs.length).toBeGreaterThan(0);
    }
  });

  it("não atribui símbolos editoriais a Caitiff ou Sangue-Ralo", () => {
    expect(CLAN_PRESENTATIONS["origin:caitiff"].namePtBr).toBe("Caitiff");
    expect(CLAN_PRESENTATIONS["origin:thin-blood"].namePtBr).toBe("Sangue-Ralo");
    expect(Object.keys(CLAN_PRESENTATIONS["origin:caitiff"])).not.toContain("symbol");
    expect(Object.keys(CLAN_PRESENTATIONS["origin:thin-blood"])).not.toContain("symbol");
  });
});
