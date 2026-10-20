import type { INestApplication } from "@nestjs/common";

interface FrameworkHeaderControl {
  disable(setting: string): void;
}

function supportsFrameworkHeaderControl(value: unknown): value is FrameworkHeaderControl {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    "disable" in value &&
    typeof value.disable === "function"
  );
}

export function applyHttpHardening(application: INestApplication): void {
  const httpFramework: unknown = application.getHttpAdapter().getInstance();

  if (!supportsFrameworkHeaderControl(httpFramework)) {
    throw new Error(
      "O adapter HTTP não permite desabilitar cabeçalhos de identificação.",
    );
  }

  httpFramework.disable("x-powered-by");
}
