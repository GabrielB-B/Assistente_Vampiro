import { randomUUID } from "node:crypto";

export const CORRELATION_ID_HEADER = "x-correlation-id";

const correlationIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/;

export function resolveCorrelationId(
  headerValue: string | readonly string[] | undefined,
  generate: () => string = randomUUID,
): string {
  if (typeof headerValue === "string" && correlationIdPattern.test(headerValue)) {
    return headerValue;
  }

  return generate();
}
