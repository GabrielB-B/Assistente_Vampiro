import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module.js";
import { DatabaseService } from "../../database/database.service.js";
import { IdentityAccessModule } from "../identity-access/identity-access.module.js";
import {
  ACCESS_CONTEXT_READER,
  type AccessContextReader,
} from "../identity-access/application/access-context-reader.js";
import {
  ActiveCharacterCookie,
  resolveActiveCharacterCookieSecret,
} from "./adapters/active-character-cookie.js";
import { KyselyCharacterGatewayRepository } from "./adapters/kysely-character-gateway-repository.js";
import {
  CHARACTER_GATEWAY_REPOSITORY,
  type CharacterGatewayRepository,
} from "./application/character-gateway-repository.js";
import { CharacterGatewayService } from "./application/character-gateway.service.js";
import { CharacterGatewayController } from "./character-gateway.controller.js";

@Module({
  controllers: [CharacterGatewayController],
  imports: [DatabaseModule, IdentityAccessModule],
  providers: [
    {
      inject: [DatabaseService],
      provide: CHARACTER_GATEWAY_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new KyselyCharacterGatewayRepository(database.client),
    },
    {
      inject: [CHARACTER_GATEWAY_REPOSITORY, ACCESS_CONTEXT_READER],
      provide: CharacterGatewayService,
      useFactory: (
        repository: CharacterGatewayRepository,
        accessContextReader: AccessContextReader,
      ) => new CharacterGatewayService(repository, accessContextReader),
    },
    {
      provide: ActiveCharacterCookie,
      useFactory: () => new ActiveCharacterCookie(resolveActiveCharacterCookieSecret()),
    },
  ],
})
export class CharacterGatewayModule {}
