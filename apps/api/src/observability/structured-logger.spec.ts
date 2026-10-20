import { describe, expect, it, vi } from "vitest";

import { CorrelationContext } from "./correlation-context.js";
import { serializeLogRecord, StructuredLogger } from "./structured-logger.js";

describe("StructuredLogger", () => {
  it("emite uma linha JSON com o correlation ID do contexto", () => {
    const write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
    const context = new CorrelationContext();
    const logger = new StructuredLogger(context);

    context.run("request-123", () => {
      logger.logEvent("http.request.completed", { method: "GET", statusCode: 200 });
    });

    expect(write).toHaveBeenCalledOnce();
    const line = String(write.mock.calls[0]?.[0]);
    expect(line.endsWith("\n")).toBe(true);
    expect(JSON.parse(line) as unknown).toEqual(
      expect.objectContaining({
        correlationId: "request-123",
        event: "http.request.completed",
        level: "info",
        method: "GET",
        service: "assistente-vampiro-api",
        statusCode: 200,
      }),
    );
  });

  it("degrada com segurança quando um atributo é circular", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    const line = serializeLogRecord({
      circular,
      event: "test.circular",
      level: "info",
      service: "assistente-vampiro-api",
      timestamp: "2026-10-20T00:00:00.000Z",
    });

    expect(JSON.parse(line) as unknown).toEqual({
      event: "logging.serialization_failed",
      level: "error",
      message: "Um registro não pôde ser serializado.",
      service: "assistente-vampiro-api",
      timestamp: "2026-10-20T00:00:00.000Z",
    });
  });
});
