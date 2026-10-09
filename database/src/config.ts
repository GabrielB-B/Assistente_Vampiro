export interface DatabaseConfig {
  readonly connectionString: string;
  readonly maxConnections: number;
  readonly schema: string;
}

const schemaPattern = /^[a-z][a-z0-9_]{0,62}$/;

function parsePositiveInteger(rawValue: string | undefined, fallback: number): number {
  if (rawValue === undefined || rawValue.length === 0) {
    return fallback;
  }

  const value = Number(rawValue);
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new Error("DATABASE_POOL_MAX deve ser um inteiro entre 1 e 100.");
  }

  return value;
}

export function assertValidSchemaName(schema: string): void {
  if (!schemaPattern.test(schema)) {
    throw new Error(
      "DATABASE_SCHEMA deve começar com letra minúscula e conter apenas letras, números ou sublinhado.",
    );
  }
}

export function readDatabaseConfig(
  environment: NodeJS.ProcessEnv = process.env,
): DatabaseConfig {
  const connectionString = environment.DATABASE_URL;
  if (connectionString === undefined || connectionString.length === 0) {
    throw new Error("DATABASE_URL não foi definida.");
  }

  const parsedUrl = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(parsedUrl.protocol)) {
    throw new Error("DATABASE_URL deve usar o protocolo postgresql.");
  }

  const schema = environment.DATABASE_SCHEMA ?? "assistente_vampiro";
  assertValidSchemaName(schema);

  return {
    connectionString,
    maxConnections: parsePositiveInteger(environment.DATABASE_POOL_MAX, 10),
    schema,
  };
}

export function connectionStringForSchema(config: DatabaseConfig): string {
  const url = new URL(config.connectionString);
  url.searchParams.set("options", `-csearch_path=${config.schema},public -ctimezone=UTC`);
  return url.toString();
}
