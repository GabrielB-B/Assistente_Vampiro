import {
  type MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from "@nestjs/common";

import { DatabaseModule } from "./database/database.module.js";
import { HealthController } from "./health/health.controller.js";
import { CharacterGatewayModule } from "./modules/character-gateway/character-gateway.module.js";
import { CharactersModule } from "./modules/characters/characters.module.js";
import { IdentityAccessModule } from "./modules/identity-access/identity-access.module.js";
import { ObservabilityModule } from "./observability/observability.module.js";
import { RequestObservabilityMiddleware } from "./observability/request-observability.middleware.js";

@Module({
  controllers: [HealthController],
  imports: [
    ObservabilityModule,
    DatabaseModule,
    IdentityAccessModule,
    CharacterGatewayModule,
    CharactersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestObservabilityMiddleware)
      .forRoutes({ path: "{*path}", method: RequestMethod.ALL });
  }
}
