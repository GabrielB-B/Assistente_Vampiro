import { createHmac, timingSafeEqual } from "node:crypto";

import type { ActorContext } from "../../identity-access/application/actor-context.js";
import type { CharacterGatewayItem } from "../application/character-gateway-repository.js";

interface ActiveCharacterPayload {
  readonly accountId: string;
  readonly characterId: string;
  readonly chronicleId: string;
  readonly issuedAt: string;
  readonly version: 1;
}

const localDevelopmentSecret =
  "local-only-active-character-context-secret-not-for-production";

export function resolveActiveCharacterCookieSecret(
  environment: NodeJS.ProcessEnv = process.env,
): string {
  const configured = environment.ACTIVE_CHARACTER_COOKIE_SECRET?.trim();
  if (configured !== undefined && configured.length >= 32) {
    return configured;
  }
  if (environment.NODE_ENV === "production") {
    throw new Error(
      "ACTIVE_CHARACTER_COOKIE_SECRET deve possuir pelo menos 32 caracteres em produção.",
    );
  }
  return localDevelopmentSecret;
}

export class ActiveCharacterCookie {
  constructor(
    private readonly secret: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  encode(actor: ActorContext, character: CharacterGatewayItem): string {
    const payload: ActiveCharacterPayload = {
      accountId: actor.accountId,
      characterId: character.characterId,
      chronicleId: character.chronicleId,
      issuedAt: this.now().toISOString(),
      version: 1,
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
      "base64url",
    );
    return `${encodedPayload}.${this.sign(encodedPayload)}`;
  }

  verify(value: string): ActiveCharacterPayload | undefined {
    const [encodedPayload, providedSignature, extra] = value.split(".");
    if (
      encodedPayload === undefined ||
      providedSignature === undefined ||
      extra !== undefined
    ) {
      return undefined;
    }

    const expectedSignature = this.sign(encodedPayload);
    const expected = Buffer.from(expectedSignature, "utf8");
    const provided = Buffer.from(providedSignature, "utf8");
    if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
      return undefined;
    }

    try {
      const parsed: unknown = JSON.parse(
        Buffer.from(encodedPayload, "base64url").toString("utf8"),
      );
      if (!isActiveCharacterPayload(parsed)) {
        return undefined;
      }
      return parsed;
    } catch {
      return undefined;
    }
  }

  private sign(encodedPayload: string): string {
    return createHmac("sha256", this.secret)
      .update(encodedPayload, "utf8")
      .digest("base64url");
  }
}

function isActiveCharacterPayload(value: unknown): value is ActiveCharacterPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<ActiveCharacterPayload>;
  return (
    candidate.version === 1 &&
    typeof candidate.accountId === "string" &&
    typeof candidate.characterId === "string" &&
    typeof candidate.chronicleId === "string" &&
    typeof candidate.issuedAt === "string"
  );
}
