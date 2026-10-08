const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl === undefined || databaseUrl.length === 0) {
  throw new Error("DATABASE_URL não foi definida para a prova de persistência.");
}

const parsedDatabaseUrl = new URL(databaseUrl);

if (!["127.0.0.1", "localhost", "::1"].includes(parsedDatabaseUrl.hostname)) {
  throw new Error("A prova só pode usar um PostgreSQL local.");
}

export const testDatabaseUrl = databaseUrl;

export function databaseUrlForSchema(schema: string): string {
  const url = new URL(testDatabaseUrl);
  url.searchParams.set("options", `--search_path=${schema}`);
  return url.toString();
}
