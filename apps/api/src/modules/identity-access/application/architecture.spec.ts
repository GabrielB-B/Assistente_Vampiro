import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesBelow(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

describe("fronteira da aplicação de identidade e acesso", () => {
  it("não depende de NestJS, banco, transporte ou ambiente", async () => {
    const applicationDirectory = import.meta.dirname;
    const sourceFiles = (await filesBelow(applicationDirectory)).filter(
      (file) => file.endsWith(".ts") && !file.endsWith(".spec.ts"),
    );
    const forbidden = [
      /from ["']@assistente-vampiro\/database["']/u,
      /from ["']@nestjs\//u,
      /from ["']kysely["']/u,
      /from ["']node:http/u,
      /process\.env/u,
    ];

    for (const file of sourceFiles) {
      const source = await readFile(file, "utf8");
      for (const pattern of forbidden) expect(source).not.toMatch(pattern);
    }
  });
});
