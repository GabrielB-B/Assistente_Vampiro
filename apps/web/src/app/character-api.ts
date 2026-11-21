import {
  ALPHA_IDENTITY_OPTIONS,
  type AlphaIdentityAlias,
  type CharacterEntrySummaryView,
  type CharacterSheetMutationView,
  type CharacterSheetContextView,
  type CharacterSheetDocumentView,
  type CharacterSheetView,
  type PlayerEntryView,
  type PublicApiErrorResponse,
} from "@assistente-vampiro/contracts";

const knownAliases = new Set<string>(
  ALPHA_IDENTITY_OPTIONS.map((identity) => identity.alias),
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value);
}

function isCharacterSummary(value: unknown): value is CharacterEntrySummaryView {
  return (
    isRecord(value) &&
    (value.accessMode === "OWNER" || value.accessMode === "STORYTELLER") &&
    isString(value.characterId) &&
    isString(value.characterName) &&
    ["draft", "ready", "retired"].includes(String(value.characterState)) &&
    isNullableString(value.chronicleId) &&
    isNullableString(value.chronicleTitle) &&
    ((value.chronicleId === null && value.chronicleTitle === null) ||
      (isString(value.chronicleId) && isString(value.chronicleTitle))) &&
    isNullableString(value.concept)
  );
}

function isPlayerEntryView(value: unknown): value is PlayerEntryView {
  return (
    isRecord(value) &&
    isRecord(value.actor) &&
    isString(value.actor.displayName) &&
    isString(value.actor.identityAlias) &&
    knownAliases.has(value.actor.identityAlias) &&
    Array.isArray(value.characters) &&
    value.characters.every(isCharacterSummary)
  );
}

function isCharacterSheetView(value: unknown): value is CharacterSheetView {
  if (
    !isRecord(value) ||
    (value.accessMode !== "OWNER" && value.accessMode !== "STORYTELLER") ||
    !isRecord(value.character) ||
    !Array.isArray(value.traits)
  ) {
    return false;
  }

  const character = value.character;
  return (
    isString(character.id) &&
    isString(character.name) &&
    isNullableString(character.ambition) &&
    isNullableString(character.concept) &&
    isNullableString(character.desire) &&
    isNullableString(character.sire) &&
    (character.hunger === null || typeof character.hunger === "number") &&
    (character.kind === null ||
      ["CAITIFF", "CLAN_VAMPIRE", "GHOUL", "MORTAL", "THIN_BLOOD"].includes(
        String(character.kind),
      )) &&
    ["draft", "ready", "retired"].includes(String(character.state)) &&
    typeof character.version === "number" &&
    isNullableString(value.ruleSetProfileRevisionId) &&
    Array.isArray(value.convictionPairs) &&
    value.convictionPairs.every(
      (pair) =>
        isRecord(pair) &&
        typeof pair.position === "number" &&
        Number.isInteger(pair.position) &&
        isNullableString(pair.conviction) &&
        isNullableString(pair.touchstone),
    ) &&
    value.traits.every(
      (trait) =>
        isRecord(trait) &&
        (trait.kind === "ATTRIBUTE" || trait.kind === "SKILL") &&
        isString(trait.traitId) &&
        typeof trait.value === "number" &&
        Number.isInteger(trait.value),
    )
  );
}

function isCharacterSheetContextView(value: unknown): value is CharacterSheetContextView {
  return (
    isRecord(value) &&
    (value.chronicle === null ||
      (isRecord(value.chronicle) &&
        isString(value.chronicle.id) &&
        isString(value.chronicle.title) &&
        isNullableString(value.chronicle.description)))
  );
}

function isCharacterSheetDocumentView(
  value: unknown,
): value is CharacterSheetDocumentView {
  return (
    isRecord(value) &&
    isCharacterSheetContextView(value.context) &&
    isCharacterSheetView(value.sheet)
  );
}

function isPublicApiError(value: unknown): value is PublicApiErrorResponse {
  return (
    isRecord(value) &&
    isRecord(value.error) &&
    isString(value.error.code) &&
    isString(value.error.correlationId) &&
    isString(value.error.message)
  );
}

export class CharacterApiError extends Error {
  constructor(
    message: string,
    readonly code = "SERVICE_UNAVAILABLE",
    readonly correlationId: string | null = null,
  ) {
    super(message);
    this.name = "CharacterApiError";
  }
}

async function requestJson(
  path: string,
  identityAlias: AlphaIdentityAlias,
  signal: AbortSignal,
): Promise<unknown> {
  const response = await fetch(path, {
    cache: "no-store",
    headers: { "x-alpha-identity": identityAlias },
    signal,
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (isPublicApiError(body)) {
      throw new CharacterApiError(
        body.error.message,
        body.error.code,
        body.error.correlationId,
      );
    }
    throw new CharacterApiError("A API devolveu uma resposta inesperada.");
  }

  return body;
}

export async function loadPlayerEntry(
  identityAlias: AlphaIdentityAlias,
  signal: AbortSignal,
): Promise<PlayerEntryView> {
  const body = await requestJson("/api/v1/player-entry", identityAlias, signal);
  if (!isPlayerEntryView(body)) {
    throw new CharacterApiError("A entrada recebida não respeita o contrato esperado.");
  }
  return body;
}

export async function loadCharacterSheet(
  identityAlias: AlphaIdentityAlias,
  character: CharacterEntrySummaryView,
  signal: AbortSignal,
): Promise<CharacterSheetDocumentView> {
  const query =
    character.chronicleId === null
      ? ""
      : `?${new URLSearchParams({ chronicleId: character.chronicleId }).toString()}`;
  const body = await requestJson(
    `/api/v1/characters/${character.characterId}/sheet${query}`,
    identityAlias,
    signal,
  );
  if (!isCharacterSheetDocumentView(body)) {
    throw new CharacterApiError("A ficha recebida não respeita o contrato esperado.");
  }
  return body;
}

export async function loadCharacterSheetById(
  identityAlias: AlphaIdentityAlias,
  characterId: string,
  signal: AbortSignal,
): Promise<CharacterSheetDocumentView> {
  const body = await requestJson(
    `/api/v1/characters/${encodeURIComponent(characterId)}/sheet`,
    identityAlias,
    signal,
  );
  if (!isCharacterSheetDocumentView(body)) {
    throw new CharacterApiError("A ficha recebida não respeita o contrato esperado.");
  }
  return body;
}

export async function updateCharacterIdentity(
  identityAlias: AlphaIdentityAlias,
  characterId: string,
  expectedVersion: number,
  identity: {
    readonly ambition: string | null;
    readonly concept: string | null;
    readonly desire: string | null;
    readonly name: string;
    readonly sire: string | null;
  },
): Promise<CharacterSheetMutationView> {
  const response = await fetch(
    `/api/v1/characters/${encodeURIComponent(characterId)}/sheet`,
    {
      body: JSON.stringify({ expectedVersion, identity }),
      credentials: "same-origin",
      headers: {
        "content-type": "application/json",
        "x-alpha-identity": identityAlias,
      },
      method: "PATCH",
    },
  );
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (isPublicApiError(body)) {
      throw new CharacterApiError(
        body.error.message,
        body.error.code,
        body.error.correlationId,
      );
    }
    throw new CharacterApiError("Não foi possível salvar a ficha.");
  }
  if (
    !isRecord(body) ||
    !isString(body.characterId) ||
    typeof body.version !== "number"
  ) {
    throw new CharacterApiError("A alteração não respeita o contrato esperado.");
  }
  return body as unknown as CharacterSheetMutationView;
}
