import { randomUUIDv7 } from "node:crypto";

import type { IdGenerator } from "../application/id-generator.js";

export class NodeUuidV7Generator implements IdGenerator {
  next(): string {
    return randomUUIDv7();
  }
}
