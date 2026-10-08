# ADR-0002 — Persistência, eventos e realtime confiável

**Status:** aceita<br>
**Data:** 2026-10-08<br>
**Responsável:** responsável do produto<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

Uma rolagem confirmada não pode desaparecer, duplicar ou chegar ao Feed como fato antes de ser persistida. Banco e transporte em tempo real têm garantias diferentes, e uma publicação direta após `commit` deixa uma janela de perda.

## Drivers da decisão

- consistência do histórico da sessão;
- idempotência;
- reconexão e replay;
- operação inicial simples;
- portabilidade de infraestrutura;
- separação entre Evento de Sessão, Feed e Auditoria.

## Opções consideradas

1. publicar em memória depois do `commit`;
2. broker externo desde o início;
3. outbox transacional no PostgreSQL e relay desacoplado.

## Decisão

Adotar PostgreSQL 18 como fonte de verdade e o padrão outbox transacional:

1. validar e autorizar o comando;
2. reservar a chave de idempotência;
3. avaliar a regra;
4. persistir `RollAttempt`, `SessionEvent` e registro de outbox na mesma transação;
5. confirmar a transação;
6. o relay lê a outbox e publica por um adapter de realtime;
7. o cliente deduplica por `eventId` e retoma por sequência.

Socket.IO será o primeiro adapter de transporte. O relay pode executar no processo da API no alpha, mas estado, tentativa e próxima execução permanecem duráveis no PostgreSQL. Chat livre não faz parte do primeiro MVP.

A biblioteca de acesso a dados não está decidida. Kysely, Drizzle e Prisma serão comparados numa prova curta usando exatamente essa transação.

## Consequências positivas

- nenhum evento aceito depende apenas da memória do processo;
- retries e duplicatas possuem comportamento explícito;
- o transporte pode ser substituído sem alterar o domínio;
- o Feed pode recuperar lacunas após reconexão.

## Consequências negativas e trade-offs

- consistência do Feed é eventual após o `commit`;
- relay, limpeza e observabilidade da outbox precisam ser mantidos;
- consumidores devem ser idempotentes;
- o fluxo possui mais estados operacionais do que publicação direta.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---:|---:|---|
| relay publica duas vezes | média | médio | `eventId`, consumidor idempotente e confirmação durável |
| relay para de processar | baixa/média | alto | métrica de atraso, alerta e retry com backoff |
| ordem divergente | média | alto | sequência monotônica por stream da sessão |
| outbox cresce sem limite | média | médio | retenção e arquivamento definidos antes do ambiente compartilhado |

## Evidências e referências

- [Modelo de Domínio v0.1](../../04-arquitetura/dominio/modelo-dominio-v0.1.md)
- [Opções Tecnológicas v0.1](../../04-arquitetura/opcoes-tecnologicas-v0.1.md)
- [Architecture v0.1](../../04-arquitetura/arquitetura-software-v0.1.md)
- DEC-012, DEC-020, DEC-021, DEC-029, DEC-032 e DEC-033.

## Critério de revisão

Reavaliar o relay interno quando medições demonstrarem necessidade de múltiplas instâncias, throughput superior à capacidade definida, isolamento de falhas ou consumidores externos.

## Plano de migração ou reversão

O adapter de publicação permite introduzir Redis Streams, NATS ou outro broker sem alterar o formato canônico dos eventos. A outbox continua como origem durável durante a migração.
