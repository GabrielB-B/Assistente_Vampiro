import type { AlphaIdentityAlias } from "@assistente-vampiro/contracts";

export interface ActorContext {
  readonly accountId: string;
  readonly authenticationMethod: "alpha";
  readonly identityAlias: AlphaIdentityAlias;
}
