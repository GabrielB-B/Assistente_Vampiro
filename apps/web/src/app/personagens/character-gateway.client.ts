import type { CharacterGatewayList, CharacterSelection } from "./character-gateway.types";

export type GatewayFailure = "denied" | "error" | "unavailable";

export class CharacterGatewayClientError extends Error {
  constructor(readonly failure: GatewayFailure) {
    super(`Character gateway request failed: ${failure}`);
    this.name = "CharacterGatewayClientError";
  }
}

function identityHeader(): HeadersInit {
  const identity = process.env.NEXT_PUBLIC_ALPHA_IDENTITY;
  return identity === undefined ? {} : { "x-alpha-identity": identity };
}

function failureForStatus(status: number): GatewayFailure {
  if (status === 401 || status === 403 || status === 404) {
    return "denied";
  }
  if (status === 502 || status === 503 || status === 504) {
    return "unavailable";
  }
  return "error";
}

async function assertResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new CharacterGatewayClientError(failureForStatus(response.status));
  }
}

export async function listCharacters(
  signal?: AbortSignal,
): Promise<CharacterGatewayList> {
  try {
    const response = await fetch("/api/v1/player/characters", {
      credentials: "same-origin",
      headers: identityHeader(),
      ...(signal === undefined ? {} : { signal }),
    });
    await assertResponse(response);
    return (await response.json()) as CharacterGatewayList;
  } catch (error) {
    if (error instanceof CharacterGatewayClientError || error instanceof DOMException) {
      throw error;
    }
    throw new CharacterGatewayClientError("unavailable");
  }
}

export async function selectCharacter(
  characterId: string,
  chronicleId: string,
): Promise<CharacterSelection> {
  try {
    const response = await fetch(
      `/api/v1/player/characters/${encodeURIComponent(characterId)}/selection`,
      {
        body: JSON.stringify({ chronicleId }),
        credentials: "same-origin",
        headers: {
          ...identityHeader(),
          "content-type": "application/json",
        },
        method: "POST",
      },
    );
    await assertResponse(response);
    return (await response.json()) as CharacterSelection;
  } catch (error) {
    if (error instanceof CharacterGatewayClientError) {
      throw error;
    }
    throw new CharacterGatewayClientError("unavailable");
  }
}
