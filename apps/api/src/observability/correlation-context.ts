import { AsyncLocalStorage } from "node:async_hooks";

import { Injectable } from "@nestjs/common";

interface RequestContext {
  readonly correlationId: string;
}

@Injectable()
export class CorrelationContext {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  getCorrelationId(): string | undefined {
    return this.storage.getStore()?.correlationId;
  }

  run<T>(correlationId: string, callback: () => T): T {
    return this.storage.run({ correlationId }, callback);
  }
}
