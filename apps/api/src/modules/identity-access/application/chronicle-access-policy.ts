import type { ActorContext } from "./actor-context.js";
import { allowAccess, denyAccess, type AccessDecision } from "./access-decision.js";
import type { MembershipAuthorizationContext } from "./authorization-context.js";

export class ChronicleAccessPolicy {
  authorizeActiveMembership(
    actor: ActorContext,
    membership: MembershipAuthorizationContext | undefined,
  ): AccessDecision {
    if (membership === undefined || membership.accountId !== actor.accountId) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }
    if (membership.status !== "active") {
      return denyAccess("MEMBERSHIP_INACTIVE");
    }
    return allowAccess;
  }

  authorizeRole(
    actor: ActorContext,
    membership: MembershipAuthorizationContext | undefined,
    role: "PLAYER" | "STORYTELLER",
  ): AccessDecision {
    if (membership === undefined) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }
    const membershipDecision = this.authorizeActiveMembership(actor, membership);
    if (!membershipDecision.allowed) {
      return membershipDecision;
    }
    if (!membership.roles.includes(role)) {
      return denyAccess("ACTION_NOT_ALLOWED");
    }
    return allowAccess;
  }
}
