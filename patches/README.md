# Patches de dependências

Esta pasta contém correções temporárias e versionadas aplicadas a dependências
de terceiros pelo pnpm. Um patch só pode permanecer aqui quando houver motivo
documentado, versão fixa do pacote e validação automatizada.

## `@next/eslint-plugin-next@16.4.2`

O plugin utiliza `fast-glob`, que depende de `braces@3.0.3`. Essa versão de
`braces` é afetada por [CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
e ainda não possui correção publicada.

O patch preserva as regras oficiais do Next.js, mas substitui o processamento
de glob em `settings.next.rootDir` por diretórios explícitos. O
`.pnpmfile.cjs` correspondente remove `fast-glob` do grafo resolvido. Ambos são
restritos à versão `16.4.2`; uma atualização não herda a correção sem revisão.

O projeto configura `rootDir` com um caminho concreto e o lint exercita esse
fluxo durante `pnpm check`.

### Revisão durante uma atualização

1. verificar se o plugin oficial ainda depende de `fast-glob` e se o advisory
   possui versão corrigida;
2. remover temporariamente o patch, a entrada `patchedDependencies` e o hook do
   `.pnpmfile.cjs`;
3. atualizar Next.js e `eslint-config-next` juntos;
4. executar `pnpm install`, `pnpm security:audit` e `pnpm check`;
5. restaurar uma correção local apenas se a cadeia vulnerável continuar e o
   código oficial ainda exigir essa dependência.

O histórico e as condições para reabrir o risco estão no
[registro de riscos](../documentacao/04-arquitetura/seguranca/registro-riscos-seguranca-v0.1.md).
