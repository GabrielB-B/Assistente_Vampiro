import { defineConfig } from "prisma/config";

process.loadEnvFile(new URL("./.env", import.meta.url));

const baseUrl = process.env.DATABASE_URL;

if (baseUrl === undefined || baseUrl.length === 0) {
  throw new Error("DATABASE_URL não foi definida para o Prisma.");
}

const datasourceUrl = new URL(baseUrl);
datasourceUrl.searchParams.set("schema", "prisma_lab");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: datasourceUrl.toString(),
  },
});
