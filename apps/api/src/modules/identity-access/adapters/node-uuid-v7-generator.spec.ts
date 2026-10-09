import { describe, expect, it } from "vitest";

import { NodeUuidV7Generator } from "./node-uuid-v7-generator.js";

describe("NodeUuidV7Generator", () => {
  it("gera um UUIDv7 canônico sem dependência externa", () => {
    const identifier = new NodeUuidV7Generator().next();

    expect(identifier).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
});
