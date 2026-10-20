# Engineering Foundation v0.1

**Status:** em andamento<br>
**Início:** 9 de outubro de 2026<br>
**Base:** Architecture v0.1 e ADR-0001 a ADR-0005

## Objetivo

Criar uma fundação executável e reproduzível antes das funcionalidades do alpha. Esta fase entrega estrutura, automação e operação mínima; não antecipa regras, autenticação real nem interface definitiva.

## Linha de base técnica

| Ferramenta | Versão inicial | Motivo |
|---|---:|---|
| Node.js | 24.18.0 | linha LTS usada no ambiente aprovado |
| pnpm | 12.10.1 | workspace e lockfile único de produção |
| Turborepo | 2.11.7 | orquestração dos gates do monorepo |
| TypeScript | 6.0.3 | versão mais nova dentro da faixa suportada pelo `typescript-eslint` 8.71.1 |
| Next.js | 16.4.0 | frontend definido pela ADR-0001 |
| React | 19.3.0 | versão estável compatível com Next.js 16.4.0 |
| NestJS | 12.1.2 | backend definido pela ADR-0001 |
| ESLint | 9.39.5 | última linha aceita simultaneamente pelos plugins oficiais do Next.js 16.4.0 |
| Vitest | 5.0.3 | testes rápidos e comuns às duas aplicações |

TypeScript 7.0.2 não será usado no código de produção enquanto o linter declarar suporte somente até a linha 6.0. O experimento de persistência permanece isolado e não define a toolchain da aplicação.

As dependências usam versões exatas e respeitam a janela de segurança do pnpm para publicações recentes. Scripts de instalação ficam bloqueados por padrão; somente `esbuild`, `pnpm` e `unrs-resolver`, necessários à toolchain atual, estão autorizados nominalmente.

## Incrementos

| ID | Entrega | Estado | Gate |
|---|---|---|---|
| FND-01 | monorepo, web, API e quality baseline | concluído | instalar, lintar, testar, tipar e compilar pela raiz |
| FND-02 | PostgreSQL, migrações e adapter Kysely de produção | concluído | banco vazio e contrato de integração aprovados |
| FND-03 | CI, containers locais e observabilidade mínima | em andamento | clone limpo reproduz todos os gates |

Cada incremento usa branch e pull request próprios. Um incremento não mistura funcionalidade do Vertical Slice 01.

## Escopo do FND-01

- workspace pnpm com versões fixadas;
- Turborepo para `build`, `lint`, `typecheck` e `test`;
- `apps/web` com Next.js e uma superfície diagnóstica, sem identidade visual definitiva;
- `apps/api` com NestJS e endpoint `/api/v1/health`;
- configuração TypeScript compartilhada com consumidores reais;
- testes unitários e HTTP mínimos;
- exemplos de ambiente sem segredo;
- instruções de instalação e execução.

## Fora do FND-01

- autenticação e autorização de produto;
- persistência de produção;
- Rules Engine;
- Roll Builder, Ficha ou Feed;
- design system definitivo;
- deploy e ambiente compartilhado.

## Escopo do FND-02

- pacote `database` como fronteira exclusiva do Kysely;
- PostgreSQL 18 com schema configurável e conexões em UTC;
- migrações iniciais do domínio e do histórico de Sessão;
- constraints, índices parciais e proteção append-only;
- comandos de migração, status e rollback;
- endpoint de readiness separado do liveness;
- UUIDv7 nativo atrás de uma porta testável;
- teste de integração isolado contra PostgreSQL real.

## Fora do FND-02

- caso de uso de confirmação da rolagem;
- relay da outbox e Socket.IO;
- dados fictícios de desenvolvimento;
- containers e execução do PostgreSQL pela CI;
- autenticação e autorização.

## Plano do FND-03

O incremento será entregue em cortes pequenos e verificáveis:

1. **CI baseline:** executar instalação congelada, formatação, lint, tipagem,
   testes, builds e integração com PostgreSQL 18 em toda pull request;
2. **ambiente local:** fornecer containers com versões fixadas, healthcheck e
   persistência previsível, sem substituir a execução local direta;
3. **observabilidade mínima:** padronizar correlation ID, logs estruturados e
   sinais operacionais necessários para diagnosticar web, API e banco;
4. **prova de reprodução:** executar o roteiro completo a partir de um clone
   limpo usando somente a documentação versionada.

Cada corte usa branch e pull request próprios. A proteção da `main` será
configurada depois que o primeiro workflow estiver aprovado no GitHub, evitando
registrar como obrigatório um check que ainda não existe.

## Gates do FND-01

- [x] instalação com lockfile em modo congelado;
- [x] formatação verificada;
- [x] lint sem warning;
- [x] typecheck estrito;
- [x] testes web, unitário e HTTP verdes;
- [x] builds independentes de web e API;
- [x] nenhuma credencial ou conteúdo protegido versionado;
- [x] documentação executável revisada.

## Gates do FND-02

- [x] migrações aplicadas em schema vazio no PostgreSQL 18;
- [x] rollback e reaplicação do último incremento;
- [x] tabelas, constraints, índices e triggers verificados;
- [x] conexão configurada em UTC;
- [x] readiness da API coberta por teste;
- [x] UUIDv7 nativo coberto por teste;
- [x] lint, typecheck, testes e builds aprovados;
- [x] nenhuma credencial real versionada.

## Gates do FND-03

- [x] CI aprovada em pull request e em `main`;
- [x] instalação congelada, quality gates e build reproduzidos pela CI;
- [x] migrações verificadas pela CI contra PostgreSQL 18 real;
- [x] actions fixadas por commit e workflow com permissões mínimas;
- [x] ambiente local reproduzível por containers;
- [ ] liveness, readiness, correlation ID e logs estruturados documentados;
- [ ] clone limpo validado usando somente o README.

## Saída da Foundation completa

A Engineering Foundation só termina depois de FND-01, FND-02 e FND-03. O critério final permanece: uma pessoa consegue clonar, configurar, validar e executar o esqueleto usando apenas o README.
