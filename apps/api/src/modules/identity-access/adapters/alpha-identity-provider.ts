import {
  ALPHA_IDENTITIES,
  assertAlphaEnvironment,
  type AlphaIdentityAlias,
} from "@assistente-vampiro/database";

import type { ActorContext } from "../application/actor-context.js";
import { AuthenticationError } from "../application/authentication-error.js";
import type { IdentityProvider } from "../application/identity-provider.js";

function isAlphaAlias(value: string): value is AlphaIdentityAlias {
  return Object.hasOwn(ALPHA_IDENTITIES, value);
}

export class AlphaIdentityProvider implements IdentityProvider {
  constructor(environment: string | undefined) {
    assertAlphaEnvironment(environment);
  }

  resolve(alias: string | undefined): Promise<ActorContext> {
    if (alias === undefined || !isAlphaAlias(alias)) {
      return Promise.reject(new AuthenticationError());
    }

    return Promise.resolve({
      accountId: ALPHA_IDENTITIES[alias].accountId,
      authenticationMethod: "alpha",
      identityAlias: alias,
    });
  }
}
