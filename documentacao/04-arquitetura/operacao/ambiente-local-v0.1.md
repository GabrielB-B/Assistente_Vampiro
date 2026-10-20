# Ambiente Local v0.1

**Status:** proposta<br>
**Escopo:** PostgreSQL local da Engineering Foundation

## Objetivo

Oferecer o mesmo PostgreSQL 18 usado pela CI sem exigir uma instalação manual
do servidor. O Compose é uma opção de execução; ele não altera os contratos
da aplicação nem impede o uso de um PostgreSQL local equivalente.

## Contrato

- imagem oficial `postgres:18.6-bookworm`;
- banco, usuário, senha e porta recebidos do `.env` ignorado pelo Git;
- porta publicada somente em `127.0.0.1`;
- healthcheck baseado em `pg_isready`;
- volume nomeado montado em `/var/lib/postgresql`, conforme o layout do
  PostgreSQL 18;
- `no-new-privileges` habilitado;
- encerramento normal preserva os dados.

O valor de `POSTGRES_PASSWORD` deve ser igual à senha codificada em
`DATABASE_URL`. A credencial é exclusiva da máquina de desenvolvimento e nunca
deve ser reutilizada em ambientes compartilhados.

## Operação normal

Depois de copiar `.env.example` para `.env` e trocar a senha ilustrativa:

```powershell
corepack pnpm infra:up
corepack pnpm infra:status
corepack pnpm db:migrate
corepack pnpm test:integration
```

Logs podem ser acompanhados com:

```powershell
corepack pnpm infra:logs
```

Para encerrar sem perder os dados:

```powershell
corepack pnpm infra:down
```

## Proteções

- o repositório não fornece comando de remoção do volume;
- o serviço não publica a porta na rede local;
- o Compose falha antes de iniciar se banco, usuário ou senha estiverem
  ausentes;
- a CI valida o modelo, aguarda o healthcheck e confirma a versão principal;
- valores do `.env.example` são apenas ilustrativos.

## Limites

Este ambiente não representa produção. Ele não define backup, alta
disponibilidade, TLS, rotação de segredos ou retenção. Esses temas serão
especificados antes do primeiro ambiente compartilhado.
