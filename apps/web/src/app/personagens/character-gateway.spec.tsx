import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CharacterGateway } from "./character-gateway";
import type { CharacterGatewayList } from "./character-gateway.types";

const preview: CharacterGatewayList = {
  characters: [
    {
      characterId: "character-noemi",
      chronicleId: "chronicle-rain",
      chronicleTitle: "Ecos sob a Chuva",
      clan: null,
      lastActivityAt: null,
      name: "Noemi Vale",
      portraitUrl: null,
    },
    {
      characterId: "character-selene",
      chronicleId: "chronicle-ashes",
      chronicleTitle: "Ecos de Cinzas",
      clan: "Toreador",
      lastActivityAt: null,
      name: "Selene",
      portraitUrl: null,
    },
  ],
};

describe("CharacterGateway", () => {
  it("mantém avatares como seleção dominante e exibe apenas contexto essencial", () => {
    render(<CharacterGateway preview={preview} />);

    expect(screen.getByRole("heading", { name: "Seus personagens" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Selecionar Noemi Vale/u }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Ecos sob a Chuva")).toBeVisible();
    expect(screen.getByRole("button", { name: /Novo/u })).toBeVisible();
    expect(screen.queryByText("Fome")).not.toBeInTheDocument();
    expect(screen.queryByText("Humanidade")).not.toBeInTheDocument();
  });

  it("preserva a seleção no hover e só transfere o destaque no clique", () => {
    render(<CharacterGateway preview={preview} />);

    const noemi = screen.getByRole("button", { name: /Selecionar Noemi Vale/u });
    const selene = screen.getByRole("button", { name: /Selecionar Selene/u });
    fireEvent.mouseOver(selene);

    expect(noemi).toHaveAttribute("aria-pressed", "true");
    expect(selene).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(selene);

    expect(noemi).toHaveAttribute("aria-pressed", "false");
    expect(selene).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Ecos de Cinzas")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Selene selecionada");
  });

  it("permite percorrer personagens com setas e mantém foco visível semanticamente", () => {
    render(<CharacterGateway preview={preview} />);

    const noemi = screen.getByRole("button", { name: /Selecionar Noemi Vale/u });
    const selene = screen.getByRole("button", { name: /Selecionar Selene/u });
    noemi.focus();
    fireEvent.keyDown(noemi, { key: "ArrowRight" });

    expect(selene).toHaveFocus();
    expect(selene).toHaveAttribute("aria-pressed", "true");
  });

  it("mantém a criação visível sem iniciar um fluxo fora do escopo", () => {
    render(<CharacterGateway preview={preview} />);

    fireEvent.click(screen.getByRole("button", { name: /Novo/u }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "A criação de personagem será liberada em uma etapa futura",
    );
  });
});
