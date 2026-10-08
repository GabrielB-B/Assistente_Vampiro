# ADR-0004 — Biblioteca de acesso a dados

**Status:** aceita<br>
**Data:** 2026-10-08<br>
**Responsável:** responsável do produto<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

O primeiro corte técnico precisa confirmar uma rolagem em uma única transação: atualizar o estado do Personagem, avançar o cursor da Sessão, inserir `RollAttempt`, inserir `SessionEvent` e registrar a mensagem de outbox.

Essa operação também precisa lidar com idempotência, concorrência otimista, rollback, reserva concorrente da outbox e diagnóstico por códigos estruturados.

Kysely, Drizzle e Prisma foram implementados contra o mesmo contrato e o mesmo PostgreSQL 18.6. As três opções passaram pelos casos P01–P10.

## Drivers da decisão

- transação e concorrência fáceis de revisar;
- migrações previsíveis;
- SQL do PostgreSQL visível quando necessário;
- tipos úteis sem esconder o banco;
- diagnóstico por códigos, sem interpretar mensagens;
- manutenção por uma equipe humana pequena;
- baixo acoplamento do domínio à biblioteca.

## Opções consideradas

1. Kysely 0.29.6 com `pg` 8.23.1;
2. Drizzle ORM 0.45.4 com Drizzle Kit 0.31.11 e `pg` 8.23.1;
3. Prisma ORM 7.10.0 com `@prisma/adapter-pg` 7.10.0.

## Decisão

Adotar **Kysely 0.29.6 com `pg` 8.23.1** para a primeira versão do sistema.

Kysely será usado somente nos adapters de persistência e nas migrações. O domínio, o Rules Engine e os casos de uso não importarão tipos da biblioteca.

Recursos específicos do PostgreSQL, como `FOR UPDATE SKIP LOCKED`, `jsonb`, checks e `INSERT ... ON CONFLICT ... RETURNING`, poderão usar SQL explícito dentro do adapter. Esse SQL deve possuir teste de integração e nome ligado ao caso de uso.

## Motivo

Kysely teve a melhor combinação entre clareza da transação, controle do SQL, tipos e diagnóstico. Drizzle ficou próximo e continua sendo uma alternativa viável, mas exigiu uma superfície maior entre schema TypeScript e migrações SQL. Prisma trouxe mais adaptação para schema, tipos JSON, `bigint`, erros e operações nativas do PostgreSQL.

O desempenho não foi o fator decisivo. Na medição local, Kysely e Drizzle ficaram próximos; ambos foram mais simples de observar no caminho crítico.

## Consequências positivas

- SQL e transações permanecem legíveis;
- uso de recursos do PostgreSQL não depende de contornos do ORM;
- tipos de consulta ajudam sem entrar no domínio;
- não existe etapa de geração de cliente;
- troca futura continua possível atrás das portas de persistência.

## Consequências negativas e trade-offs

- o schema TypeScript de tipos precisa acompanhar as migrações;
- relações e agregados não possuem API declarativa de alto nível;
- consultas complexas exigem conhecimento de SQL;
- migrações precisam de revisão cuidadosa, inclusive em `down` ou no plano de recuperação;
- tipos de `jsonb`, datas e colunas geradas exigem declarações explícitas.

## Regras de implementação

- uma transação recebe seu contexto explicitamente; nenhum repositório abre transação oculta;
- `session_stream.last_sequence` é incrementado por linha, sem `MAX(sequence) + 1`;
- idempotência é consultada pelo contexto e pela chave, guarda a impressão do comando e trata repetições concorrentes;
- outbox é confirmada na mesma transação do evento;
- migrações funcionam em banco vazio e passam por teste de integração;
- todos os ambientes usam UTC no PostgreSQL;
- erros externos são traduzidos por código estruturado;
- SQL nativo não pode vazar para controllers, UI ou Rules Engine.

## Evidências

- [Protocolo da prova](../../04-arquitetura/provas/prova-persistencia-v0.1.md);
- [Resultado da prova](../../04-arquitetura/provas/resultado-persistencia-v0.1.md);
- [ADR-0002 — Persistência, eventos e realtime confiável](./0002-persistencia-eventos-e-realtime.md);
- código experimental em `experimentos/persistencia`;
- 30 testes de integração aprovados;
- 300 medições válidas preservadas no experimento.

## Critério de revisão

Reavaliar quando houver evidência de pelo menos uma destas condições:

- o mapeamento manual de tipos causar defeitos recorrentes;
- a equipe não conseguir manter migrações e consultas com segurança;
- uma mudança de banco ou infraestrutura invalidar o uso atual;
- medições reais mostrarem gargalo atribuível à biblioteca;
- outro adapter demonstrar redução clara de risco no mesmo contrato.

## Plano de migração ou reversão

Os casos de uso dependem de portas do projeto, não de Kysely. Uma substituição implementa novos adapters, mantém as tabelas e migrações compatíveis e executa novamente os contratos de integração antes da troca.

## Aprovação

A recomendação foi aprovada explicitamente pelo responsável do produto em 8 de outubro de 2026. Esta decisão passa a orientar a Engineering Foundation e o primeiro código de produção.

