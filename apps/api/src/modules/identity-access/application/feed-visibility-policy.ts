import type { ActorContext } from "./actor-context.js";
import { allowAccess, denyAccess, type AccessDecision } from "./access-decision.js";
import type {
  AuthorizedVisibility,
  MembershipAuthorizationContext,
} from "./authorization-context.js";
import { ChronicleAccessPolicy } from "./chronicle-access-policy.js";

export class FeedVisibilityPolicy {
  private readonly chroniclePolicy = new ChronicleAccessPolicy();

  authorize(
    actor: ActorContext,
    membership: MembershipAuthorizationContext | undefined,
    visibility: AuthorizedVisibility,
  ): AccessDecision {
    if (membership === undefined) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }
    const membershipDecision = this.chroniclePolicy.authorizeActiveMembership(
      actor,
      membership,
    );
    if (!membershipDecision.allowed) {
      return membershipDecision;
    }

    if (
      visibility === "STORYTELLER_PRIVATE" &&
      !membership.roles.includes("STORYTELLER")
    ) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }

    return allowAccess;
  }
}
