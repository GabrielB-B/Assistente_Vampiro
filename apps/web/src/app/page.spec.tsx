import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "./page";

describe("HomePage", () => {
  it("identifica a tela como diagnóstico da fundação", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Assistente Vampiro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Engineering Foundation · FND-01")).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("Identidade visual final");
  });
});
