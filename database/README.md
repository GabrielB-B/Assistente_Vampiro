# Banco de dados

Este pacote concentra somente infraestrutura PostgreSQL: tipos das tabelas, criação do cliente Kysely, migrações e verificações de integração. Domínio e casos de uso não podem importar Kysely.

## Configuração local

Copie `.env.example` para `.env` na raiz e use uma role e um banco exclusivos do projeto. O schema padrão é `assistente_vampiro`.

```powershell
Copy-Item .env.example .env
corepack pnpm db:status
corepack pnpm db:migrate
```

O valor real de `DATABASE_URL` nunca entra no Git.

## Regras das migrações

- uma migração aplicada em ambiente compartilhado não é editada;
- correções entram em um novo arquivo;
- `up` e `down` são revisados juntos;
- o schema é validado antes de ser usado na conexão;
- todos os acessos usam UTC;
- o teste de integração cria e remove apenas um schema local com prefixo `av_test_`.

Para validar contra PostgreSQL real:

```powershell
corepack pnpm test:integration
```

O rollback disponível pela CLI reverte somente a última migração. Em produção, a decisão entre rollback e migração corretiva deve considerar perda de dados antes da execução.
