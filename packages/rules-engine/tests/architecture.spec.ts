import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

const packageRoot = path.resolve(import.meta.dirname, "..");
const repositoryRoot = path.resolve(packageRoot, "../..");

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

describe("fronteiras do pacote", () => {
  it("não importa framework, transporte, banco, frontend ou ambiente", async () => {
    const sourceFiles = (await filesBelow(path.join(packageRoot, "src"))).filter((file) =>
      file.endsWith(".ts"),
    );
    const forbidden = [
      /from ["']@nestjs\//u,
      /from ["']kysely["']/u,
      /from ["']pg["']/u,
      /from ["']socket\.io/u,
      /from ["']react/u,
      /from ["']next\//u,
      /process\.env/u,
      /from ["']node:fs/u,
      /from ["']node:http/u,
      /from ["']node:https/u,
      /Math\.random/u,
    ];

    for (const file of sourceFiles) {
      const source = await readFile(file, "utf8");
      for (const pattern of forbidden) expect(source).not.toMatch(pattern);
    }
  });

  it("não é dependência do frontend", async () => {
    const webPackage = JSON.parse(
      await readFile(path.join(repositoryRoot, "apps/web/package.json"), "utf8"),
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    expect(webPackage.dependencies?.["@assistente-vampiro/rules-engine"]).toBeUndefined();
    expect(
      webPackage.devDependencies?.["@assistente-vampiro/rules-engine"],
    ).toBeUndefined();
  });

  it("não contém formatos reservados ao corpus privado", async () => {
    const files = await filesBelow(packageRoot);
    const forbiddenExtensions = new Set([".pdf", ".epub", ".mobi", ".azw", ".azw3"]);
    expect(
      files.filter((file) => forbiddenExtensions.has(path.extname(file).toLowerCase())),
    ).toEqual([]);
  });
});
