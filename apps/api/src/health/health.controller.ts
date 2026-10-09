import { Controller, Get } from "@nestjs/common";

export interface HealthResponse {
  readonly service: "assistente-vampiro-api";
  readonly status: "ok";
}

@Controller("health")
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      service: "assistente-vampiro-api",
      status: "ok",
    };
  }
}
