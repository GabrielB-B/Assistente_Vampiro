# Resultado da Prova de Persistência v0.1

**Status:** concluída; decisão aprovada<br>
**Data:** 8 de outubro de 2026<br>
**Protocolo:** [Prova de Persistência v0.1](./prova-persistencia-v0.1.md)<br>
**Decisão:** [ADR-0004 — Biblioteca de acesso a dados](../../00-governanca/adr/0004-biblioteca-acesso-dados.md)

---

## 1. Resultado

Kysely, Drizzle e Prisma cumpriram os dez casos obrigatórios no PostgreSQL 18.6. A recomendação é adotar **Kysely 0.29.6 com `pg` 8.23.1**.

Kysely não venceu por uma diferença pequena de tempo. Venceu porque deixou mais visíveis a transação, o controle de concorrência, o cursor da Sessão, a outbox e os erros do PostgreSQL. Esse perfil combina melhor com um sistema cujo histórico precisa ser confiável e fácil de revisar.

A recomendação foi aprovada pelo responsável do produto e registrada na ADR-0004.

## 2. O que foi executado

- três implementações isoladas pelo mesmo contrato;
- cinco tabelas de domínio e apoio: `character_state`, `roll_attempt`, `session_stream`, `session_event` e `outbox_message`;
- sete etapas de migração, com expansão, preenchimento e obrigatoriedade de `correlation_id` e `command_fingerprint`;
- PostgreSQL real, sem mocks ou banco em memória;
- `typecheck` estrito;
- 30 testes de integração, dez por candidata;
- uma rodada de aquecimento e 100 confirmações válidas por candidata;
- pool máximo de quatro conexões e papel de banco configurado em UTC.

Resultado funcional: **30 de 30 testes aprovados**.

## 3. Casos P01–P10

| Caso | Kysely | Drizzle | Prisma |
|---|---:|---:|---:|
| P01 — banco vazio | passou | passou | passou |
| P02 — transação atômica | passou | passou | passou |
| P03 — rollback real | passou | passou | passou |
| P04 — idempotência concorrente e contextual | passou | passou | passou |
| P05 — concorrência otimista | passou | passou | passou |
| P06 — reserva concorrente da outbox | passou | passou | passou |
| P07 — migração evolutiva | passou | passou | passou |
| P08 — tipos do domínio | passou | passou | passou |
| P09 — diagnóstico | passou | passou | passou |
| P10 — consulta operacional | passou | passou | passou |

O cursor `session_stream.last_sequence` substituiu `MAX(sequence) + 1` antes da medição final. A linha da Sessão é criada ou incrementada de forma atômica na mesma transação da rolagem.

Na revisão final da arquitetura, o P04 foi ampliado. Os três adapters agora consultam idempotência por Sessão e chave, preservam a resposta original depois de mudanças posteriores no Personagem e rejeitam a mesma chave com outra impressão de comando.

## 4. Medições locais

Os números abaixo descrevem somente esta máquina e esta carga. Eles não são um benchmark universal.

| Candidata | Migração em banco vazio | Aquecimento | Mediana de P02 | p95 de P02 |
|---|---:|---:|---:|---:|
| Kysely | 92,352 ms | **12,098 ms** | **1,924 ms** | **3,189 ms** |
| Drizzle | **74,864 ms** | 14,395 ms | 2,338 ms | 4,136 ms |
| Prisma | 1.022,839 ms | 162,652 ms | 3,364 ms | 5,491 ms |

As 300 amostras estão em [`results/measurements.json`](../../../experimentos/persistencia/results/measurements.json). A diferença entre Kysely e Drizzle é pequena e não foi usada como argumento principal.

## 5. Evidências encontradas

### Kysely

- a transação ficou próxima do SQL sem perder tipos;
- o cursor da Sessão e o `UPDATE ... RETURNING` ficaram explícitos;
- `FOR UPDATE SKIP LOCKED` foi encapsulado sem esconder o comportamento;
- as migrações são fáceis de ler e reverter;
- não exige geração de cliente;
- o mapeamento de `jsonb` e datas exige tipos de coluna bem declarados.

### Drizzle

- o schema TypeScript expressa bem tabelas, enums, checks e índices;
- as operações comuns são claras e tipadas;
- o schema final e os arquivos SQL de migração repetem parte da estrutura;
- erros do driver chegam encapsulados em `cause`; a tradução precisou percorrer essa cadeia;
- a definição do schema e os arquivos SQL de migração ampliam a superfície que precisa permanecer sincronizada.

### Prisma

- as consultas simples e relações têm boa ergonomia;
- o schema precisou declarar `@@schema("prisma_lab")` em modelos e enums; `search_path` não foi suficiente para o Client;
- checks do PostgreSQL continuam somente no SQL de migração e não aparecem integralmente no schema Prisma;
- `jsonb` exigiu normalização para `InputJsonValue`, e sequências `bigint` exigiram conversão explícita;
- a reserva da outbox e o cursor da Sessão continuaram dependentes de SQL nativo;
- os erros usam códigos Prisma e metadados aninhados além dos códigos PostgreSQL;
- com a sessão no fuso `America/Sao_Paulo`, o adapter gravou `next_attempt_at` três horas à frente. A prova só ficou correta após padronizar a role em UTC, como a arquitetura já determina;
- o Client gerado ocupou 13 arquivos, 10.230 linhas e 425.920 bytes locais. Ele não será versionado.

## 6. Matriz ponderada

Notas de 1 a 5, aplicadas aos pesos definidos no protocolo.

| Critério | Peso | Kysely | Drizzle | Prisma |
|---|---:|---:|---:|---:|
| transação e outbox | 25% | 5,0 | 4,6 | 3,8 |
| migrações e SQL revisável | 20% | 4,8 | 4,4 | 3,5 |
| tipos e domínio | 15% | 4,5 | 4,8 | 4,3 |
| escape para SQL nativo | 10% | 5,0 | 4,7 | 3,6 |
| PostgreSQL real | 10% | 5,0 | 5,0 | 3,5 |
| manutenção e estabilidade | 10% | 4,5 | 4,2 | 3,6 |
| diagnóstico e desempenho | 10% | 4,7 | 4,5 | 3,4 |
| **total ponderado** | **100%** | **96,1** | **91,8** | **74,1** |

## 7. Recomendação

Adotar Kysely como biblioteca de acesso a dados, mantendo estas regras:

- domínio e casos de uso não importam Kysely;
- SQL nativo fica encapsulado no adapter de persistência;
- toda mudança de schema passa por migração versionada;
- idempotência usa Sessão, chave e impressão do comando, com resposta estável em retries concorrentes;
- `session_stream`, estado, tentativa, evento e outbox participam da mesma transação;
- consultas operacionais importantes mantêm SQL e plano observáveis;
- produção e testes usam UTC no banco; a interface converte para o fuso do usuário;
- a versão será reavaliada na Engineering Foundation antes do primeiro lockfile de produção.

## 8. Limites da conclusão

- a carga foi pequena e local;
- não houve latência de rede entre API e banco;
- não foram medidos milhões de eventos nem manutenção prolongada;
- a prova avaliou o corte crítico atual, não todos os recursos possíveis de um ORM;
- desempenho não substitui profiling no sistema real.

Esses limites não impedem a decisão inicial. O adapter e as migrações preservam uma rota de troca caso evidências futuras contrariem a escolha.

## 9. Próximo passo

1. iniciar a Engineering Foundation e o esqueleto de produção;
2. transformar o contrato aprovado em migrações e adapters de produção;
3. arquivar ou remover o código experimental quando ele deixar de ser necessário para auditoria.

