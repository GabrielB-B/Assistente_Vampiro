import { Module } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service.js";
import { AlphaIdentityProvider } from "./adapters/alpha-identity-provider.js";
import { KyselyAccessContextReader } from "./adapters/kysely-access-context-reader.js";
import { ACCESS_CONTEXT_READER } from "./application/access-context-reader.js";
import { IDENTITY_PROVIDER } from "./application/identity-provider.js";

export function resolveAlphaEnvironment(
  environment: NodeJS.ProcessEnv = process.env,
): string | undefined {
  if (environment.APP_ENV !== undefined) {
    return environment.APP_ENV;
  }
  if (environment.CI === "true") {
    return "ci";
  }
  if (environment.NODE_ENV === "test") {
    return "test";
  }
  return undefined;
}

@Module({
  exports: [ACCESS_CONTEXT_READER, IDENTITY_PROVIDER],
  providers: [
    {
      inject: [DatabaseService],
      provide: ACCESS_CONTEXT_READER,
      useFactory: (database: DatabaseService) =>
        new KyselyAccessContextReader(database.client),
    },
    {
      provide: IDENTITY_PROVIDER,
      useFactory: () => new AlphaIdentityProvider(resolveAlphaEnvironment()),
    },
  ],
})
export class IdentityAccessModule {}
