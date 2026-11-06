import type {
  CharacterDraftMutationView,
  CreationConceptStepView,
  CreationAttributeId,
  CreationAttributesMutationView,
  CreationAttributesStepView,
  CreationClanStepView,
  CreationOriginId,
} from "@assistente-vampiro/contracts";

function identityHeaders(): HeadersInit {
  const identity = process.env.NEXT_PUBLIC_ALPHA_IDENTITY ?? "player-one";
  return { "x-alpha-identity": identity };
}

async function responseJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String((body as { error?: { message?: unknown } }).error?.message)
        : "Não foi possível concluir a operação.";
    throw new Error(message);
  }
  return body as T;
}

export async function startCharacterDraft(
  idempotencyKey: string,
): Promise<CharacterDraftMutationView> {
  const response = await fetch("/api/v1/characters/drafts", {
    body: JSON.stringify({ idempotencyKey }),
    credentials: "same-origin",
    headers: { ...identityHeaders(), "content-type": "application/json" },
    method: "POST",
  });
  return responseJson(response);
}

export async function loadCreationAttributes(
  characterId: string,
  signal?: AbortSignal,
): Promise<CreationAttributesStepView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/attributes`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: identityHeaders(),
      ...(signal === undefined ? {} : { signal }),
    },
  );
  return responseJson(response);
}

export async function loadCreationConcept(
  characterId: string,
  signal?: AbortSignal,
): Promise<CreationConceptStepView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/concept`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: identityHeaders(),
      ...(signal === undefined ? {} : { signal }),
    },
  );
  return responseJson(response);
}

export async function loadCreationClan(
  characterId: string,
  signal?: AbortSignal,
): Promise<CreationClanStepView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/clan`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: identityHeaders(),
      ...(signal === undefined ? {} : { signal }),
    },
  );
  return responseJson(response);
}

export async function updateCreationClan(
  characterId: string,
  expectedVersion: number,
  originId: CreationOriginId,
): Promise<CreationClanStepView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/clan`,
    {
      body: JSON.stringify({ expectedVersion, originId }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
  return responseJson(response);
}

export async function updateCreationConcept(
  characterId: string,
  expectedVersion: number,
  identity: CreationConceptStepView["identity"],
  convictionPairs: readonly {
    readonly conviction: string | null;
    readonly touchstone: string | null;
  }[],
): Promise<CreationConceptStepView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/concept`,
    {
      body: JSON.stringify({ convictionPairs, expectedVersion, identity }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
  return responseJson(response);
}

export async function updateCreationAttribute(
  characterId: string,
  expectedVersion: number,
  attributeId: CreationAttributeId,
  value: number,
): Promise<CreationAttributesMutationView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/attributes`,
    {
      body: JSON.stringify({
        attributes: { [attributeId]: value },
        expectedVersion,
      }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
  return responseJson(response);
}
