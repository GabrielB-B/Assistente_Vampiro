import { describe, expect, it } from "vitest";

import { CorrelationContext } from "./correlation-context.js";

describe("CorrelationContext", () => {
  it("mantém contextos assíncronos concorrentes isolados", async () => {
    const context = new CorrelationContext();
    const observedIds = await Promise.all(
      ["request-a", "request-b"].map((correlationId) =>
        context.run(correlationId, async () => {
          await Promise.resolve();
          return context.getCorrelationId();
        }),
      ),
    );

    expect(observedIds).toEqual(["request-a", "request-b"]);
    expect(context.getCorrelationId()).toBeUndefined();
  });
});
