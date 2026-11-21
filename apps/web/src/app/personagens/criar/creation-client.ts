import type {
  CharacterDraftMutationView,
  CreationConceptStepView,
  CreationAttributeId,
  CreationAttributesMutationView,
  CreationAttributesStepView,
  CreationClanStepView,
  CreationOriginId,
  CreationSkillId,
  CreationSkillMethodId,
  CreationSkillsStepView,
  CreationSpecialtyOrigin,
  CreationDisciplinesStepView,
  CreationDisciplineId,
  DisciplinePowerId,
} from "@assistente-vampiro/contracts";

function identityHeaders(): HeadersInit {
  const identity = process.env.NEXT_PUBLIC_ALPHA_IDENTITY ?? "player-one";
  return { "x-alpha-identity": identity };
}

const transientStatuses = new Set([502, 503, 504]);

interface PublicErrorBody {
  readonly error?: {
    readonly code?: unknown;
    readonly correlationId?: unknown;
    readonly message?: unknown;
  };
}

export class CreationClientError extends Error {
  readonly code: string | undefined;
  readonly correlationId: string | undefined;
  readonly status: number | undefined;
  readonly transient: boolean;

  constructor(
    message: string,
    options: {
      readonly cause?: unknown;
      readonly code?: string;
      readonly correlationId?: string;
      readonly status?: number;
      readonly transient?: boolean;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "CreationClientError";
    this.code = options.code;
    this.correlationId = options.correlationId;
    this.status = options.status;
    this.transient = options.transient ?? false;
  }
}

async function responseJson<T>(response: Response): Promise<T> {
  const responseText = await response.text();
  let body: unknown = null;
  if (responseText.length > 0) {
    try {
      body = JSON.parse(responseText) as unknown;
    } catch {
      body = responseText;
    }
  }
  if (!response.ok) {
    const publicError =
      typeof body === "object" && body !== null
        ? (body as PublicErrorBody).error
        : undefined;
    const message =
      typeof publicError?.message === "string"
        ? publicError.message
        : transientStatuses.has(response.status)
          ? "O serviço local reiniciou durante a operação. A ficha será sincronizada."
          : `O serviço não respondeu corretamente (HTTP ${response.status}).`;
    throw new CreationClientError(message, {
      ...(typeof publicError?.code === "string" ? { code: publicError.code } : {}),
      ...(typeof publicError?.correlationId === "string"
        ? { correlationId: publicError.correlationId }
        : {}),
      status: response.status,
      transient: transientStatuses.has(response.status),
    });
  }
  return body as T;
}

async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  options: { readonly retryTransientRead?: boolean } = {},
): Promise<T> {
  const maximumAttempts = options.retryTransientRead === true ? 3 : 1;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    try {
      const response = await fetch(input, init);
      if (
        options.retryTransientRead === true &&
        transientStatuses.has(response.status) &&
        attempt < maximumAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 150));
        continue;
      }
      return await responseJson<T>(response);
    } catch (error) {
      if (init.signal?.aborted === true) {
        throw error;
      }
      const normalized =
        error instanceof CreationClientError
          ? error
          : new CreationClientError(
              "A conexão com o serviço local foi interrompida. A ficha será sincronizada.",
              { cause: error, transient: true },
            );
      if (
        options.retryTransientRead === true &&
        normalized.transient &&
        attempt < maximumAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 150));
        continue;
      }
      throw normalized;
    }
  }

  throw new CreationClientError("A etapa não respondeu após novas tentativas.", {
    transient: true,
  });
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

export async function loadCreationSkills(
  characterId: string,
  signal?: AbortSignal,
): Promise<CreationSkillsStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/skills`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: identityHeaders(),
      ...(signal === undefined ? {} : { signal }),
    },
    { retryTransientRead: true },
  );
}

export async function updateCreationSkills(
  characterId: string,
  expectedVersion: number,
  skills: Partial<Record<CreationSkillId, number>>,
  methodId?: CreationSkillMethodId,
): Promise<CreationSkillsStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/skills`,
    {
      body: JSON.stringify({
        expectedVersion,
        ...(methodId === undefined ? {} : { methodId }),
        skills,
      }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
}

export async function createCreationSpecialty(
  characterId: string,
  expectedVersion: number,
  skillId: CreationSkillId,
  origin: CreationSpecialtyOrigin,
  label: string,
): Promise<CreationSkillsStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/skills/specialties`,
    {
      body: JSON.stringify({ expectedVersion, label, origin, skillId }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "POST",
    },
  );
}

export async function updateCreationSpecialty(
  characterId: string,
  specialtyId: string,
  expectedVersion: number,
  label: string,
): Promise<CreationSkillsStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/skills/specialties/${encodeURIComponent(specialtyId)}`,
    {
      body: JSON.stringify({ expectedVersion, label }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
}

export async function deleteCreationSpecialty(
  characterId: string,
  specialtyId: string,
  expectedVersion: number,
): Promise<CreationSkillsStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/skills/specialties/${encodeURIComponent(specialtyId)}`,
    {
      body: JSON.stringify({ expectedVersion }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "DELETE",
    },
  );
}

export async function loadCreationDisciplines(
  characterId: string,
  signal?: AbortSignal,
): Promise<CreationDisciplinesStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/disciplines`,
    {
      cache: "no-store",
      credentials: "same-origin",
      headers: identityHeaders(),
      ...(signal === undefined ? {} : { signal }),
    },
    { retryTransientRead: true },
  );
}

export async function updateCreationDisciplines(
  characterId: string,
  expectedVersion: number,
  disciplines: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly rating: number;
  }[],
  powerIds: readonly DisciplinePowerId[],
  confirmPowerInvalidation = false,
): Promise<CreationDisciplinesStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/disciplines`,
    {
      body: JSON.stringify({
        confirmPowerInvalidation,
        disciplines: disciplines.map(({ disciplineId, rating }) => ({
          disciplineId,
          rating,
        })),
        expectedVersion,
        powerIds,
      }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
}

export async function previewCreationDisciplines(
  characterId: string,
  expectedVersion: number,
  disciplines: readonly {
    readonly disciplineId: CreationDisciplineId;
    readonly rating: number;
  }[],
  powerIds: readonly DisciplinePowerId[],
): Promise<CreationDisciplinesStepView> {
  return requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/creation/disciplines`,
    {
      body: JSON.stringify({
        disciplines: disciplines.map(({ disciplineId, rating }) => ({
          disciplineId,
          rating,
        })),
        expectedVersion,
        powerIds,
        previewOnly: true,
      }),
      credentials: "same-origin",
      headers: { ...identityHeaders(), "content-type": "application/json" },
      method: "PATCH",
    },
  );
}
