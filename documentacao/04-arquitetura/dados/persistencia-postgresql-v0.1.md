# Persistência PostgreSQL v0.1

**Status:** implementada na FND-02<br>
**Data:** 9 de outubro de 2026<br>
**Base:** ADR-0002, ADR-0004, ADR-0005 e Architecture v0.1

## Objetivo

Transformar o modelo aprovado em uma fundação de dados executável, sem antecipar os casos de uso do alpha. O PostgreSQL é a fonte de verdade; Kysely fica restrito ao pacote `database` e aos adapters de infraestrutura.

## Fronteira

O diretório `database` é um pacote privado do monorepo. Ele possui:

- configuração validada da conexão;
- tipos das tabelas para Kysely;
- migrações ordenadas;
- comandos de aplicação, status e rollback;
- teste de integração contra PostgreSQL real.

Domínio, Rules Engine e casos de uso não importam Kysely. A API recebe o cliente por `DatabaseService`, que também fecha o pool no encerramento da aplicação.

## Schema inicial

| Grupo | Tabelas |
|---|---|
| identidade e regras | `account`, `rule_set_profile_revision` |
| personagem e Crônica | `character`, `chronicle`, `chronicle_membership`, `character_binding` |
| jogo em andamento | `game_session`, `scene`, `roll_attempt`, `session_stream` |
| histórico e operação | `session_event`, `outbox_message`, `audit_entry` |

As duas primeiras migrações separam o domínio inicial do histórico de Sessão. Essa divisão permite reverter o segundo incremento sem remover Conta, Personagem ou Crônica.

## Invariantes protegidas no banco

- chaves internas usam colunas `uuid`; novos IDs serão UUIDv7 gerados pela aplicação;
- um Personagem possui no máximo um Vínculo ativo;
- uma Sessão possui no máximo uma Cena ativa;
- Cena e tentativa pertencem à mesma Sessão;
- Vínculo e tentativa referenciam o mesmo Personagem;
- idempotência de rolagem considera Conta atuante, Sessão, versão da operação e chave;
- impressão do comando aceita somente SHA-256 hexadecimal canônico;
- sequência é única e crescente por Sessão, mantida por `session_stream`;
- Crítico Bestial exige vitória e Falha Bestial exige falha;
- `roll_attempt`, `session_event` e `audit_entry` são append-only;
- a outbox possui índice parcial para mensagens pendentes;
- timestamps usam `timestamptz` e toda conexão configura UTC.

Políticas que dependem de contexto narrativo ou autorização permanecem nos casos de uso. O banco não tenta substituir o domínio.

## Migrações

Comandos executados pela raiz:

```powershell
corepack pnpm db:status
corepack pnpm db:migrate
corepack pnpm db:rollback
```

Migração aplicada em ambiente compartilhado é imutável. Uma correção recebe outro arquivo. O rollback da CLI atua somente sobre a última migração e não deve ser usado em produção sem avaliar perda de dados.

## Validação

O teste de integração:

1. aceita apenas PostgreSQL local;
2. cria um schema isolado com prefixo `av_test_`;
3. aplica as migrações em vazio;
4. verifica tabelas, constraints, índices, triggers e UTC;
5. reverte e reaplica o último incremento;
6. remove somente o schema temporário ao terminar.

```powershell
corepack pnpm test:integration
```

## Trabalho posterior

A FND-02 não implementa confirmação de rolagem nem relay. O Vertical Slice 01 usará esta base para persistir estado, tentativa, evento e outbox na mesma transação. Containers, CI e observabilidade entram na FND-03.

## Rastreabilidade

- [Architecture v0.1](../arquitetura-software-v0.1.md)
- [ADR-0002 — Persistência, eventos e realtime](../../00-governanca/adr/0002-persistencia-eventos-e-realtime.md)
- [ADR-0004 — Biblioteca de acesso a dados](../../00-governanca/adr/0004-biblioteca-acesso-dados.md)
- [ADR-0005 — Identificadores UUIDv7](../../00-governanca/adr/0005-identificadores-uuidv7.md)
- [Resultado da prova de persistência](../provas/resultado-persistencia-v0.1.md)
