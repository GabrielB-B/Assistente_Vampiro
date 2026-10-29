export class CharacterNotAvailableError extends Error {
  readonly code = "RESOURCE_NOT_AVAILABLE";

  constructor() {
    super("O personagem solicitado não está disponível para esta identidade.");
    this.name = "CharacterNotAvailableError";
  }
}
