import { describe, expect, it } from "vitest";

import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  it("descreve o serviço sem consultar infraestrutura", () => {
    const controller = new HealthController();

    expect(controller.getHealth()).toEqual({
      service: "assistente-vampiro-api",
      status: "ok",
    });
  });
});
