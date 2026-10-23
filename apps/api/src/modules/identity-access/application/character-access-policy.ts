import type { ActorContext } from "./actor-context.js";
import { allowAccess, denyAccess, type AccessDecision } from "./access-decision.js";
import type { CharacterAccessContext } from "./authorization-context.js";
import { ChronicleAccessPolicy } from "./chronicle-access-policy.js";

export class CharacterAccessPolicy {
  private readonly chroniclePolicy = new ChronicleAccessPolicy();

  authorizeOwnerView(
    actor: ActorContext,
    context: CharacterAccessContext,
  ): AccessDecision {
    return context.character.ownerAccountId === actor.accountId
      ? allowAccess
      : denyAccess("RESOURCE_NOT_AVAILABLE");
  }

  authorizePlayerControl(
    actor: ActorContext,
    context: CharacterAccessContext,
  ): AccessDecision {
    const ownerDecision = this.authorizeOwnerView(actor, context);
    if (!ownerDecision.allowed) {
      return ownerDecision;
    }

    const membership = context.membership;
    if (membership === undefined) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }
    const roleDecision = this.chroniclePolicy.authorizeRole(actor, membership, "PLAYER");
    if (!roleDecision.allowed) {
      return roleDecision;
    }

    const binding = context.character.binding;
    if (
      binding === undefined ||
      binding.state !== "active" ||
      binding.characterId !== context.character.characterId ||
      binding.chronicleId !== membership.chronicleId ||
      binding.membershipId !== membership.membershipId
    ) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }

    return allowAccess;
  }

  authorizeStorytellerView(
    actor: ActorContext,
    context: CharacterAccessContext,
  ): AccessDecision {
    const membership = context.membership;
    if (membership === undefined) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }
    const roleDecision = this.chroniclePolicy.authorizeRole(
      actor,
      membership,
      "STORYTELLER",
    );
    if (!roleDecision.allowed) {
      return roleDecision;
    }

    const binding = context.character.binding;
    if (
      binding === undefined ||
      binding.state !== "active" ||
      binding.characterId !== context.character.characterId ||
      binding.chronicleId !== membership.chronicleId
    ) {
      return denyAccess("RESOURCE_NOT_AVAILABLE");
    }

    return allowAccess;
  }
}
