export class PersistenceConflictError extends Error {
  readonly code = "PERSISTENCE_CONFLICT";

  constructor(message = "O estado do personagem foi alterado por outra operação.") {
    super(message);
    this.name = "PersistenceConflictError";
  }
}

export class IdempotencyConflictError extends Error {
  readonly code = "IDEMPOTENCY_CONFLICT";

  constructor() {
    super("A chave de idempotência já foi usada com outro comando.");
    this.name = "IdempotencyConflictError";
  }
}

export function assertSameIdempotentCommand(
  persistedFingerprint: string,
  receivedFingerprint: string,
): void {
  if (persistedFingerprint !== receivedFingerprint) {
    throw new IdempotencyConflictError();
  }
}

export class PersistenceConstraintError extends Error {
  readonly code = "PERSISTENCE_CONSTRAINT";

  constructor(
    message: string,
    readonly databaseCode: string,
    readonly constraint?: string,
  ) {
    super(message);
    this.name = "PersistenceConstraintError";
  }
}

export class PersistenceTimeoutError extends Error {
  readonly code = "PERSISTENCE_TIMEOUT";

  constructor(message = "A operação excedeu o tempo permitido.") {
    super(message);
    this.name = "PersistenceTimeoutError";
  }
}

export class PersistenceConnectionError extends Error {
  readonly code = "PERSISTENCE_CONNECTION";

  constructor(message = "Não foi possível conectar ao banco de dados.") {
    super(message);
    this.name = "PersistenceConnectionError";
  }
}

function structuredErrorObjects(error: unknown): readonly Record<string, unknown>[] {
  const pending: unknown[] = [error];
  const visited = new Set<object>();
  const objects: Record<string, unknown>[] = [];

  while (pending.length > 0 && objects.length < 12) {
    const current = pending.shift();
    if (typeof current !== "object" || current === null || visited.has(current)) {
      continue;
    }

    visited.add(current);
    const record = current as Record<string, unknown>;
    objects.push(record);

    for (const key of ["cause", "meta", "driverAdapterError"]) {
      if (key in record) {
        pending.push(record[key]);
      }
    }
  }

  return objects;
}

function databaseErrorCodes(error: unknown): readonly string[] {
  return structuredErrorObjects(error).flatMap((item) =>
    [item.code, item.originalCode].filter(
      (value): value is string => typeof value === "string",
    ),
  );
}

export function databaseErrorCode(error: unknown): string | undefined {
  return databaseErrorCodes(error)[0];
}

export function translateDatabaseError(error: unknown): Error {
  const structuredObjects = structuredErrorObjects(error);
  const codes = databaseErrorCodes(error);
  const kinds = structuredObjects
    .map((item) => item.kind)
    .filter((value): value is string => typeof value === "string");

  if (codes.includes("23505") || codes.includes("P2002")) {
    const constraint = structuredObjects.find(
      (item) => typeof item.constraint === "string",
    )?.constraint;

    return new PersistenceConstraintError(
      "A operação viola uma restrição de unicidade.",
      codes.includes("23505") ? "23505" : "P2002",
      typeof constraint === "string" ? constraint : undefined,
    );
  }

  if (
    codes.includes("57014") ||
    codes.includes("P1008") ||
    codes.includes("P2024")
  ) {
    return new PersistenceTimeoutError();
  }

  if (
    codes.includes("ECONNREFUSED") ||
    codes.includes("08001") ||
    codes.includes("08006") ||
    codes.includes("P1001") ||
    kinds.includes("DatabaseNotReachable")
  ) {
    return new PersistenceConnectionError();
  }

  return error instanceof Error ? error : new Error("Falha desconhecida de persistência.");
}
