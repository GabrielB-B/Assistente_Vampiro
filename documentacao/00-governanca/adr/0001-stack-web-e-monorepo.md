# ADR-0001 — Stack web e monorepo TypeScript

**Status:** aceita<br>
**Data:** 2026-10-08<br>
**Responsável:** responsável do produto<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

O produto combina uma interface editorial e imersiva, fluxos autenticados, regras autoritativas no servidor, realtime e futura integração com IA. A equipe inicial é pequena e precisa reduzir custo cognitivo sem misturar responsabilidades entre navegador e backend.

## Drivers da decisão

- liberdade visual e acessibilidade;
- manutenção por equipe pequena;
- contratos verificáveis entre frontend e backend;
- implantação portável;
- domínio independente de framework;
- evolução gradual sem microsserviços prematuros.

## Opções consideradas

1. Next.js + NestJS em TypeScript.
2. Next.js + ASP.NET Core.
3. React + Vite como SPA com backend separado.

A comparação completa permanece em [Opções Tecnológicas v0.1](../../04-arquitetura/opcoes-tecnologicas-v0.1.md).

## Decisão

Adotar:

- Next.js 16 com React e TypeScript em `apps/web`;
- NestJS 12 sobre uma linha LTS suportada do Node.js em `apps/api`;
- pnpm workspaces e Turborepo no monorepo;
- REST descrito por OpenAPI como contrato HTTP;
- monólito modular organizado por capacidade de negócio;
- pacotes compartilhados apenas para UI, contratos gerados, Rules Engine puro e configuração de ferramentas.

O frontend não acessa banco, não contém segredos e não executa regra autoritativa. Server Actions, quando usadas, pertencem à borda web e não substituem casos de uso da API.

## Consequências positivas

- uma linguagem principal no produto inicial;
- contratos e ferramentas compartilhados sem compartilhar modelos internos dos módulos;
- suporte a conteúdo editorial, aplicação autenticada e renderização híbrida;
- caminho direto para testes, Storybook e acessibilidade;
- possibilidade de implantar web e API em containers ou provedores diferentes.

## Consequências negativas e trade-offs

- duas aplicações Node precisam de limites claros;
- o ecossistema exige versões fixadas e atualização disciplinada;
- compartilhar TypeScript em excesso pode acoplar web e domínio;
- Next.js oferece caminhos que poderiam atrair regra para o frontend.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---:|---:|---|
| regra no frontend | média | alto | teste de arquitetura e API autoritativa |
| pacote `shared` genérico | média | alto | pacotes com finalidade única e proprietário explícito |
| atualização quebra build | média | médio | lockfile, Renovate em lotes e CI obrigatória |
| dependência circular entre módulos | média | alto | portas públicas e teste automatizado de dependências |

## Evidências e referências

- [Opções Tecnológicas v0.1](../../04-arquitetura/opcoes-tecnologicas-v0.1.md)
- [Architecture v0.1](../../04-arquitetura/arquitetura-software-v0.1.md)
- DEC-013, DEC-017 e DEC-028.

## Critério de revisão

Reavaliar se a equipe adquirir competência predominante em outra plataforma, se o runtime deixar de cumprir requisitos medidos ou se um módulo exigir isolamento operacional comprovado.

## Plano de migração ou reversão

OpenAPI, portas de domínio e banco independente do frontend reduzem o custo de substituir uma das aplicações. A troca exige ADR novo e migração incremental, sem reescrever o domínio por antecipação.
