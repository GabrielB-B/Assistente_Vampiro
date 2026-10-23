import { describe, expect, it } from "vitest";

import { resolveAlphaEnvironment } from "./identity-access.module.js";

describe("resolveAlphaEnvironment", () => {
  it("prioriza a configuração explícita", () => {
    expect(
      resolveAlphaEnvironment({ APP_ENV: "local", CI: "true", NODE_ENV: "test" }),
    ).toBe("local");
  });

  it("reconhece CI e testes sem assumir local em ambiente desconhecido", () => {
    expect(resolveAlphaEnvironment({ CI: "true" })).toBe("ci");
    expect(resolveAlphaEnvironment({ NODE_ENV: "test" })).toBe("test");
    expect(resolveAlphaEnvironment({ NODE_ENV: "production" })).toBeUndefined();
  });
});
