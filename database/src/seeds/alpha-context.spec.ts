import { describe, expect, it } from "vitest";

import { assertAlphaEnvironment } from "./alpha-context.js";

describe("assertAlphaEnvironment", () => {
  it.each(["local", "test", "ci"])("aceita o ambiente controlado %s", (value) => {
    expect(() => assertAlphaEnvironment(value)).not.toThrow();
  });

  it.each([undefined, "development", "staging", "production"])(
    "falha de forma fechada fora da allowlist: %s",
    (value) => {
      expect(() => assertAlphaEnvironment(value)).toThrow(
        "O contexto fictício do alpha só pode ser usado em local, test ou ci.",
      );
    },
  );
});
