import { describe, expect, it } from "vitest";

import { resolveCorrelationId } from "./correlation-id.js";

describe("resolveCorrelationId", () => {
  const generatedId = "019a0000-0000-7000-8000-000000000001";
  const generate = (): string => generatedId;

  it("preserva um identificador recebido quando ele é seguro", () => {
    expect(resolveCorrelationId("request-123:attempt_2", generate)).toBe(
      "request-123:attempt_2",
    );
  });

  it.each([
    undefined,
    ["request-1", "request-2"],
    "contém espaço",
    "quebra\nde-linha",
    "a".repeat(65),
  ])("gera um novo identificador para um valor ausente ou inválido", (value) => {
    expect(resolveCorrelationId(value, generate)).toBe(generatedId);
  });
});
