import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    settings: {
      next: {
        rootDir: import.meta.dirname,
      },
    },
  },
  globalIgnores([".next/**", "coverage/**", "next-env.d.ts"]),
]);
