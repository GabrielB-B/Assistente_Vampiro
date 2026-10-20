import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { applyHttpHardening } from "./bootstrap/http-hardening.js";
import { StructuredLogger } from "./observability/structured-logger.js";

function resolvePort(rawPort: string | undefined): number {
  const port = Number(rawPort ?? "3001");

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT deve ser um número inteiro entre 1 e 65535.");
  }

  return port;
}

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule, { bufferLogs: true });
  application.useLogger(application.get(StructuredLogger));
  applyHttpHardening(application);
  application.setGlobalPrefix("api/v1");
  application.enableShutdownHooks();

  await application.listen(resolvePort(process.env.PORT), "0.0.0.0");
}

void bootstrap();
