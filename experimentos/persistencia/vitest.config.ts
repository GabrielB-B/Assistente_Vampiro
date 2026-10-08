import { defineConfig } from "vitest/config";

process.loadEnvFile(new URL("./.env", import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    sequence: { concurrent: false },
    testTimeout: 15_000,
    hookTimeout: 30_000,
    exclude: ["measurements/**", "**/node_modules/**"],
    reporters: ["verbose"],
  },
});
