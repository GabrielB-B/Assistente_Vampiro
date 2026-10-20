import { Global, Module } from "@nestjs/common";

import { CorrelationContext } from "./correlation-context.js";
import { RequestObservabilityMiddleware } from "./request-observability.middleware.js";
import { StructuredLogger } from "./structured-logger.js";

@Global()
@Module({
  exports: [CorrelationContext, StructuredLogger],
  providers: [CorrelationContext, RequestObservabilityMiddleware, StructuredLogger],
})
export class ObservabilityModule {}
