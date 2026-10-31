export class CharacterNotAvailableError extends Error {
  readonly code = "RESOURCE_NOT_AVAILABLE" as const;

  constructor() {
    super("Character is not available to the acting account.");
    this.name = "CharacterNotAvailableError";
  }
}
