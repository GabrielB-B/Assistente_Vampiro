import type { ActorContext } from "./actor-context.js";

export interface IdentityProvider {
  resolve(alias: string | undefined): Promise<ActorContext>;
}

export const IDENTITY_PROVIDER = Symbol("IDENTITY_PROVIDER");
