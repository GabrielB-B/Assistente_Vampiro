# Registro de Riscos de Segurança v0.1

**Status:** ativo<br>
**Data:** 23 de outubro de 2026<br>
**Revisão obrigatória:** antes de cada ambiente compartilhado

Este registro existe para que uma exceção nunca fique escondida no código, no
lockfile ou no comando da CI. Risco crítico não pode ser aceito. Risco alto só
pode permanecer quando não houver correção disponível, o alcance estiver
limitado e houver responsável, prazo e controles compensatórios.

## RISK-SEC-001 — `braces` transitivo nas ferramentas de lint

| Campo | Registro |
|---|---|
| estado | mitigado; não aceito como risco residual |
| severidade publicada | alta |
| advisory | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |
| dependência original | `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces@3.0.3` |
| correção disponível | nenhuma em 23 de outubro de 2026 |
| correção local | uso de glob removido por patch versionado; dependência retirada da resolução pelo `.pnpmfile.cjs` |
| exposição atual | nenhuma; `braces` não pertence mais ao grafo instalado |
| impacto no projeto | esgotamento de pilha do processo de lint diante de padrões profundamente aninhados |
| impacto residual | a correção precisa ser revista antes de atualizar `@next/eslint-plugin-next` |
| responsável | engenharia do projeto |
| próxima revisão | junto da próxima atualização do Next.js ou de seu plugin ESLint |

### Correção e controles

- o único uso de `fast-glob` em `@next/eslint-plugin-next@16.4.2` foi substituído
  por resolução de diretórios explícitos, sem interpretação de glob;
- o patch e o hook se aplicam somente quando nome, versão do plugin e versão da
  dependência correspondem exatamente ao artefato revisado;
- padrões glob em `settings.next.rootDir` falham de forma explícita; caminhos
  concretos continuam aceitos;
- qualquer atualização deixa de receber a correção automaticamente e exige nova
  inspeção;
- o lockfile congelado torna a resolução reproduzível em desenvolvimento e CI;
- as auditorias de produção e do grafo completo executam sem lista de exceções;
- vulnerabilidades altas ou críticas continuam bloqueando a CI.

### Condições para reabrir o risco

- `braces` reaparece no lockfile ou no grafo instalado;
- o plugin passa a importar `fast-glob`;
- o Next.js ou `@next/eslint-plugin-next` é atualizado;
- a auditoria completa deixa de passar sem exceções.

## Histórico

| Data | Alteração |
|---|---|
| 23/10/2026 | registro criado após auditoria do VS01-02; aguarda aprovação humana |
| 23/10/2026 | dependência não utilizada removida da resolução; exceção de auditoria eliminada |
| 23/10/2026 | revisão aprovada; auditoria completa sem vulnerabilidades conhecidas e VS01-02 encerrado |
| 24/10/2026 | advisories altos de `body-parser`, `multer` e `undici` detectados pela CI/auditoria e corrigidos por overrides para `2.4.0`, `2.5.0` e `8.12.2`; nenhuma exceção aceita |
