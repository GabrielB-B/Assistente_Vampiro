export type AccessDenialCode =
  "ACTION_NOT_ALLOWED" | "MEMBERSHIP_INACTIVE" | "RESOURCE_NOT_AVAILABLE";

export type AccessDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly code: AccessDenialCode };

export const allowAccess: AccessDecision = { allowed: true };

export function denyAccess(code: AccessDenialCode): AccessDecision {
  return { allowed: false, code };
}
