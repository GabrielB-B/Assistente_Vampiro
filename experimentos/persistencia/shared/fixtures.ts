import type { ConfirmRollFixture } from "./contract.js";

export const ids = {
  character: "00000000-0000-4000-8000-000000000001",
  session: "00000000-0000-4000-8000-000000000002",
  scene: "00000000-0000-4000-8000-000000000003",
  secondSession: "00000000-0000-4000-8000-000000000004",
} as const;

export function confirmedRollFixture(
  suffix = 1,
  overrides: Partial<ConfirmRollFixture> = {},
): ConfirmRollFixture {
  const sequence = suffix.toString(16).padStart(12, "0");
  const base: ConfirmRollFixture = {
    attemptId: `10000000-0000-4000-8000-${sequence}`,
    eventId: `20000000-0000-4000-8000-${sequence}`,
    outboxMessageId: `30000000-0000-4000-8000-${sequence}`,
    characterId: ids.character,
    sessionId: ids.session,
    sceneId: ids.scene,
    idempotencyKey: `roll-${suffix}`,
    commandFingerprint: `sha256:roll-${suffix}`,
    expectedStateVersion: suffix - 1,
    profileRevision: "profile-v1",
    rulesRevision: "v5-core-2026-10-08",
    evaluatorRevision: "rules-engine-v0.1",
    composition: { regularDice: 3, hungerDice: 2, difficulty: 2 },
    faces: { regular: [10, 6, 2], hunger: [10, 1] },
    resultKind: "MESSY_CRITICAL",
    result: { successes: 4, margin: 2 },
    audience: ["PUBLIC"],
  };

  return { ...base, ...overrides };
}
