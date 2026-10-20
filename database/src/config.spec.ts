import { describe, expect, it } from "vitest";

import {
  assertValidSchemaName,
  connectionStringForSchema,
  readDatabaseConfig,
} from "./config.js";

describe("configuração do PostgreSQL", () => {
  it("exige uma URL PostgreSQL e aplica valores seguros", () => {
    const config = readDatabaseConfig({
      DATABASE_URL: "postgresql://user:password@localhost:5432/database",
    });

    expect(config).toEqual({
      connectionString: "postgresql://user:password@localhost:5432/database",
      maxConnections: 10,
      schema: "assistente_vampiro",
    });
    expect(connectionStringForSchema(config)).toContain(
      "search_path%3Dassistente_vampiro",
    );
  });

  it.each(["Public", "contains-hyphen", "1invalid", ""])(
    "rejeita o schema inválido %s",
    (schema) => {
      expect(() => assertValidSchemaName(schema)).toThrow("DATABASE_SCHEMA");
    },
  );

  it("não aceita protocolo de banco diferente", () => {
    expect(() =>
      readDatabaseConfig({ DATABASE_URL: "mysql://localhost/database" }),
    ).toThrow("protocolo postgresql");
  });
});
