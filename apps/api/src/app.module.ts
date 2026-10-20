import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from "@nestjs/common";

import { DatabaseModule } from "./database/database.module.js";
import { HealthController } from "./health/health.controller.js";
import { ObservabilityModule } from "./observability/observability.module.js";
import { RequestObservabilityMiddleware } from "./observability/request-observability.middleware.js";

@Module({
  controllers: [HealthController],
  imports: [ObservabilityModule, DatabaseModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestObservabilityMiddleware)
      .forRoutes({ path: "{*path}", method: RequestMethod.ALL });
  }
}
