export type PublicApiErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_REQUEST"
  | "RESOURCE_NOT_AVAILABLE"
  | "SERVICE_UNAVAILABLE";

export interface PublicApiErrorResponse {
  readonly error: {
    readonly code: PublicApiErrorCode;
    readonly correlationId: string;
    readonly message: string;
  };
}
