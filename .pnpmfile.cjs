/**
 * Ajusta o manifesto do plugin que também recebe o patch versionado em
 * patches/@next__eslint-plugin-next@16.4.2.patch.
 *
 * O patch remove o uso de fast-glob do código distribuído. Este hook remove a
 * mesma dependência da resolução, pois o pnpm calcula o grafo antes de aplicar
 * patches aos arquivos do pacote.
 *
 * A condição exata impede que uma versão futura receba a correção sem revisão.
 */
function readPackage(packageManifest) {
  const fastGlobVersion = packageManifest.dependencies?.["fast-glob"];

  if (
    packageManifest.name !== "@next/eslint-plugin-next" ||
    packageManifest.version !== "16.4.2" ||
    fastGlobVersion !== "3.3.1"
  ) {
    return packageManifest;
  }

  const { ["fast-glob"]: _patchedDependency, ...requiredDependencies } =
    packageManifest.dependencies;

  return {
    ...packageManifest,
    dependencies: requiredDependencies,
  };
}

module.exports = {
  hooks: {
    readPackage,
  },
};
