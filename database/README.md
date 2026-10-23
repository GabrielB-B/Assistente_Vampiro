# Banco de dados

Este pacote concentra somente infraestrutura PostgreSQL: tipos das tabelas, criação do cliente Kysely, migrações e verificações de integração. Domínio e casos de uso não podem importar Kysely.

## Configuração local

Copie `.env.example` para `.env` na raiz e use uma role e um banco exclusivos do projeto. O schema padrão é `assistente_vampiro`.

```powershell
Copy-Item .env.example .env
corepack pnpm infra:up
corepack pnpm db:status
corepack pnpm db:migrate
corepack pnpm db:seed:alpha
```

O valor real de `DATABASE_URL` nunca entra no Git.

O seed aceita somente `APP_ENV=local`, `test` ou `ci`. Ele cria quatro
identidades e uma Crônica inteiramente fictícias, usa IDs determinísticos e pode
ser repetido sem duplicar registros. Ele não substitui autenticação e não pode
ser usado em ambiente compartilhado.

`corepack pnpm infra:down` encerra o container sem apagar o volume. A remoção
do volume é uma operação destrutiva e, por isso, não possui atalho no projeto.

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
