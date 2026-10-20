import { performance } from "node:perf_hooks";
import type { IncomingMessage, ServerResponse } from "node:http";

import { Injectable, type NestMiddleware } from "@nestjs/common";

import { CorrelationContext } from "./correlation-context.js";
import { CORRELATION_ID_HEADER, resolveCorrelationId } from "./correlation-id.js";
import { StructuredLogger } from "./structured-logger.js";

type NextFunction = () => void;

interface RoutedIncomingMessage extends IncomingMessage {
  readonly baseUrl?: unknown;
  readonly route?: {
    readonly path?: unknown;
  };
}

@Injectable()
export class RequestObservabilityMiddleware implements NestMiddleware<
  RoutedIncomingMessage,
  ServerResponse
> {
  constructor(
    private readonly correlationContext: CorrelationContext,
    private readonly logger: StructuredLogger,
  ) {}

  use(
    request: RoutedIncomingMessage,
    response: ServerResponse,
    next: NextFunction,
  ): void {
    const correlationId = resolveCorrelationId(request.headers[CORRELATION_ID_HEADER]);
    const startedAt = performance.now();
    const method = request.method ?? "UNKNOWN";
    let finished = false;

    response.setHeader(CORRELATION_ID_HEADER, correlationId);
    response.once("finish", () => {
      finished = true;
      this.correlationContext.run(correlationId, () => {
        this.logger.logEvent("http.request.completed", {
          correlationId,
          durationMs: this.elapsedMilliseconds(startedAt),
          method,
          route: this.readRouteTemplate(request),
          statusCode: response.statusCode,
        });
      });
    });
    response.once("close", () => {
      if (finished) {
        return;
      }

      this.correlationContext.run(correlationId, () => {
        this.logger.warnEvent("http.request.aborted", {
          correlationId,
          durationMs: this.elapsedMilliseconds(startedAt),
          method,
          route: this.readRouteTemplate(request),
          statusCode: response.statusCode,
        });
      });
    });

    this.correlationContext.run(correlationId, next);
  }

  private elapsedMilliseconds(startedAt: number): number {
    return Math.round((performance.now() - startedAt) * 100) / 100;
  }

  private readRouteTemplate(request: RoutedIncomingMessage): string {
    const baseUrl = typeof request.baseUrl === "string" ? request.baseUrl : "";
    const routePath = request.route?.path;

    return typeof routePath === "string" ? `${baseUrl}${routePath}` : "unmatched";
  }
}
