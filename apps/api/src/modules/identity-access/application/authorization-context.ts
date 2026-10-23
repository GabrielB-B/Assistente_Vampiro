export type MembershipRole = "PLAYER" | "STORYTELLER";
export type MembershipStatus = "active" | "invited" | "left" | "suspended";
export type BindingState = "active" | "approved" | "rejected" | "released" | "requested";
export type AuthorizedVisibility = "CHRONICLE_SHARED" | "STORYTELLER_PRIVATE";

export interface MembershipAuthorizationContext {
  readonly accountId: string;
  readonly chronicleId: string;
  readonly membershipId: string;
  readonly roles: readonly MembershipRole[];
  readonly status: MembershipStatus;
}

export interface CharacterAuthorizationContext {
  readonly binding:
    | {
        readonly characterId: string;
        readonly chronicleId: string;
        readonly membershipId: string;
        readonly state: BindingState;
      }
    | undefined;
  readonly characterId: string;
  readonly ownerAccountId: string;
}

export interface CharacterAccessContext {
  readonly character: CharacterAuthorizationContext;
  readonly membership: MembershipAuthorizationContext | undefined;
}
