import {
  ALPHA_IDENTITY_OPTIONS,
  type AlphaIdentityAlias,
  type CharacterEntrySummaryView,
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
    isString(value.chronicleId) &&
    isString(value.chronicleTitle) &&
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

function isSessionView(value: unknown): boolean {
  return (
    value === null ||
    (isRecord(value) &&
      isString(value.id) &&
      ["active", "cancelled", "ended", "scheduled"].includes(String(value.state)) &&
      typeof value.version === "number")
  );
}

function isSceneView(value: unknown): boolean {
  return (
    value === null ||
    (isRecord(value) &&
      isString(value.id) &&
      isNullableString(value.publishedDescription) &&
      isString(value.title) &&
      typeof value.version === "number")
  );
}

function isCharacterSheetView(value: unknown): value is CharacterSheetView {
  if (
    !isRecord(value) ||
    (value.accessMode !== "OWNER" && value.accessMode !== "STORYTELLER") ||
    !isRecord(value.character) ||
    !isRecord(value.chronicle) ||
    !Array.isArray(value.traits)
  ) {
    return false;
  }

  const character = value.character;
  const chronicle = value.chronicle;
  return (
    isString(character.id) &&
    isString(character.name) &&
    isNullableString(character.concept) &&
    (character.hunger === null || typeof character.hunger === "number") &&
    ["CAITIFF", "CLAN_VAMPIRE", "GHOUL", "MORTAL", "THIN_BLOOD"].includes(
      String(character.kind),
    ) &&
    ["draft", "ready", "retired"].includes(String(character.state)) &&
    typeof character.version === "number" &&
    isString(chronicle.id) &&
    isString(chronicle.title) &&
    isNullableString(chronicle.description) &&
    isNullableString(value.ruleSetProfileRevisionId) &&
    isSceneView(value.scene) &&
    isSessionView(value.session) &&
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
): Promise<CharacterSheetView> {
  const query = new URLSearchParams({ chronicleId: character.chronicleId });
  const body = await requestJson(
    `/api/v1/characters/${character.characterId}/sheet?${query.toString()}`,
    identityAlias,
    signal,
  );
  if (!isCharacterSheetView(body)) {
    throw new CharacterApiError("A ficha recebida não respeita o contrato esperado.");
  }
  return body;
}
