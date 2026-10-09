import type { Server } from "node:http";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "../src/app.module.js";

describe("GET /api/v1/health", () => {
  let application: INestApplication;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    application = testingModule.createNestApplication();
    application.setGlobalPrefix("api/v1");
    await application.init();
  });

  afterAll(async () => {
    await application.close();
  });

  it("responde com o estado mínimo do serviço", async () => {
    const server = application.getHttpServer() as Server;
    const response = await request(server).get("/api/v1/health").expect(200);

    expect(response.body).toEqual({
      service: "assistente-vampiro-api",
      status: "ok",
    });
  });
});
