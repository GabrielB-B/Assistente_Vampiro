export class AuthenticationError extends Error {
  readonly code = "AUTHENTICATION_REQUIRED";

  constructor() {
    super("A identidade informada não é válida para este ambiente.");
    this.name = "AuthenticationError";
  }
}
