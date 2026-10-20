import type { Server } from "node:http";

import type { INestApplication } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { AppModule } from "../src/app.module.js";
import { applyHttpHardening } from "../src/bootstrap/http-hardening.js";
import { DatabaseService } from "../src/database/database.service.js";
import { StructuredLogger } from "../src/observability/structured-logger.js";

describe("GET /api/v1/health", () => {
  let application: INestApplication;
  const logger = {
    logEvent: vi.fn(),
    warnEvent: vi.fn(),
  };

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue({ checkConnection: () => Promise.resolve() })
      .overrideProvider(StructuredLogger)
      .useValue(logger)
      .compile();

    application = testingModule.createNestApplication(new ExpressAdapter());
    application.setGlobalPrefix("api/v1");
    await application.init();
    applyHttpHardening(application);
  });

  afterAll(async () => {
    await application.close();
  });

  it("responde com o estado mínimo do serviço", async () => {
    const server = application.getHttpServer() as Server;
    const response = await request(server)
      .get("/api/v1/health?token=nao-deve-aparecer-no-log")
      .set("x-correlation-id", "health-check-123")
      .expect(200)
      .expect("x-correlation-id", "health-check-123");

    expect(response.headers["x-powered-by"]).toBeUndefined();
    expect(response.body).toEqual({
      service: "assistente-vampiro-api",
      status: "ok",
    });
    expect(logger.logEvent).toHaveBeenCalledWith(
      "http.request.completed",
      expect.objectContaining({
        correlationId: "health-check-123",
        method: "GET",
        route: "/api/v1/health",
        statusCode: 200,
      }),
    );
    expect(JSON.stringify(logger.logEvent.mock.calls)).not.toContain(
      "nao-deve-aparecer-no-log",
    );
  });

  it("expõe prontidão sem acessar infraestrutura real no teste HTTP", async () => {
    const server = application.getHttpServer() as Server;
    const response = await request(server).get("/api/v1/health/ready").expect(200);

    expect(response.body).toEqual({
      database: "ready",
      service: "assistente-vampiro-api",
      status: "ready",
    });
    expect(response.headers["x-correlation-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
