# Experimento de persistência

Código descartável para comparar Kysely, Drizzle ORM e Prisma no PostgreSQL real.

O protocolo, os casos P01–P10 e os pesos da decisão estão em
[`documentacao/04-arquitetura/provas/prova-persistencia-v0.1.md`](../../documentacao/04-arquitetura/provas/prova-persistencia-v0.1.md).

## Limites

- este diretório não contém código da aplicação;
- cada candidato usa um schema isolado no mesmo banco;
- nenhum conteúdo dos livros ou dado pessoal entra no banco;
- `.env` é local e ignorado pelo Git;
- Kysely foi aprovado pela ADR-0004; este código continua sendo evidência experimental, não base de produção.
- o contrato de idempotência cobre repetição concorrente, escopo por Sessão, impressão diferente e replay estável.

## Ambiente local

- Node.js 24.18.0;
- pnpm 12.10.1, executado por `corepack pnpm` nesta máquina;
- PostgreSQL 18.6 em `localhost`;
- banco e usuário exclusivos para a prova.

## Execução

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm db:generate:prisma
corepack pnpm typecheck
corepack pnpm test
```

Os comandos devem ser executados dentro desta pasta.
