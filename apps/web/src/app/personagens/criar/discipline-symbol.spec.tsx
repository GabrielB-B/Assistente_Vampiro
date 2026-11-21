import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { CREATION_DISCIPLINE_IDS } from "@assistente-vampiro/contracts";
import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import { DisciplineSymbol, disciplineVisualAssets } from "./discipline-symbol";

it("associa cada ID a um único SVG vetorial local", () => {
  expect(Object.keys(disciplineVisualAssets).sort()).toEqual(
    [...CREATION_DISCIPLINE_IDS].sort(),
  );
  const files = Object.values(disciplineVisualAssets);
  expect(new Set(files).size).toBe(files.length);
  for (const id of CREATION_DISCIPLINE_IDS) {
    const file = disciplineVisualAssets[id];
    expect(file).toBe(id.slice("discipline:".length) + ".svg");
    const art = readFileSync(resolve("public/assets/wod/disciplines", file), "utf8");
    expect(art).toContain("<path");
    expect(art).not.toMatch(/<image\b|(?:href|src)="(?:\/\/|https?:)/i);
    const { container, unmount } = render(<DisciplineSymbol id={id} />);
    const icon = container.querySelector("img");
    expect(icon).toHaveAttribute("src", "/assets/wod/disciplines/" + file);
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("alt", "");
    unmount();
  }
});
