import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";

import { DatabaseService } from "./database.service.js";

export interface ReadinessResponse {
  readonly database: "ready";
  readonly service: "assistente-vampiro-api";
  readonly status: "ready";
}

@Controller("health")
export class DatabaseReadinessController {
  constructor(private readonly database: DatabaseService) {}

  @Get("ready")
  async getReadiness(): Promise<ReadinessResponse> {
    try {
      await this.database.checkConnection();
    } catch {
      throw new ServiceUnavailableException({
        database: "unavailable",
        service: "assistente-vampiro-api",
        status: "unavailable",
      });
    }

    return {
      database: "ready",
      service: "assistente-vampiro-api",
      status: "ready",
    };
  }
}
