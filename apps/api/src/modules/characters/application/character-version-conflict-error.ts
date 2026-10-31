export class CharacterVersionConflictError extends Error {
  readonly code = "VERSION_CONFLICT" as const;

  constructor() {
    super("Character version does not match the expected version.");
    this.name = "CharacterVersionConflictError";
  }
}
