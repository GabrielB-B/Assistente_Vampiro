import { defineConfig } from "vitest/config";

process.loadEnvFile(new URL("./.env", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["measurements/benchmark.test.ts"],
    fileParallelism: false,
    testTimeout: 120_000,
    reporters: ["verbose"],
  },
});
