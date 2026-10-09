import { ServiceUnavailableException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import { DatabaseReadinessController } from "./database-readiness.controller.js";
import type { DatabaseService } from "./database.service.js";

function createDatabaseService(checkConnection: () => Promise<void>): DatabaseService {
  return { checkConnection } as DatabaseService;
}

describe("DatabaseReadinessController", () => {
  it("informa que a API pode receber tráfego quando o banco responde", async () => {
    const controller = new DatabaseReadinessController(
      createDatabaseService(vi.fn().mockResolvedValue(undefined)),
    );

    await expect(controller.getReadiness()).resolves.toEqual({
      database: "ready",
      service: "assistente-vampiro-api",
      status: "ready",
    });
  });

  it("responde indisponível sem expor a causa interna", async () => {
    const controller = new DatabaseReadinessController(
      createDatabaseService(vi.fn().mockRejectedValue(new Error("segredo interno"))),
    );

    await expect(controller.getReadiness()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
