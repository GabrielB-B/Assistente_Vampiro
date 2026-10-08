# ADR-0005 — Identificadores UUIDv7

**Status:** aceita<br>
**Data:** 2026-10-08<br>
**Responsáveis:** responsável do produto e engenharia<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

A Architecture v0.1 exige identificadores globais gerados pela aplicação, mas ainda não escolheu entre UUIDv4 e UUIDv7. Essa definição precisa existir antes das primeiras migrações, porque afeta chaves primárias, contratos, testes e a forma de criar novas entidades.

O projeto já usa Node.js 24.18.0 e PostgreSQL 18.6. As duas versões oferecem suporte nativo a UUIDv7, portanto a escolha não exige uma biblioteca adicional.

## Drivers da decisão

- gerar o identificador antes da persistência;
- reduzir inserções aleatórias nos índices em comparação com UUIDv4;
- manter unicidade global sem depender de uma sequência central;
- usar recursos nativos da stack;
- preservar contratos simples entre aplicação, banco e eventos;
- facilitar testes determinísticos.

## Opções consideradas

### Opção A — UUIDv4 gerado pela aplicação

É simples, amplamente suportado e não carrega informação temporal. Em contrapartida, distribui as inserções de forma aleatória no índice e deixa de aproveitar o suporte nativo a identificadores aproximadamente ordenáveis já disponível na stack.

### Opção B — UUIDv7 gerado pela aplicação

Mantém a geração distribuída e combina o tempo Unix em milissegundos com bits aleatórios. Sua ordenação temporal aproximada melhora a localidade das inserções sem transformar o identificador em sequência de negócio.

### Opção C — identidade gerada pelo banco

Sequências e identidades numéricas oferecem índices compactos, mas o identificador só existe depois do acesso ao banco e expõe uma numeração previsível. UUIDv7 gerado pelo banco tem as mesmas limitações de coordenação para os fluxos que precisam conhecer o ID antes de persistir.

## Decisão

Adotar **UUIDv7 gerado pela aplicação** para novos identificadores internos persistidos.

A geração usará `randomUUIDv7()` do módulo `node:crypto`. O código dependerá de uma porta pequena, como `IdGenerator`, para que testes forneçam valores determinísticos sem relógio real nem aleatoriedade.

O PostgreSQL armazenará esses valores em colunas `uuid`. A função `uuidv7()` do banco poderá ser usada apenas em ferramentas administrativas ou como default explicitamente justificado; o caminho normal continuará sob responsabilidade da aplicação.

### Limites

- a ordem de eventos usa `session_stream.last_sequence`, nunca a posição lexical do UUID;
- datas de negócio continuam em colunas próprias;
- autorização nunca depende do instante codificado no identificador;
- chaves de idempotência permanecem separadas;
- identificadores recebidos de provedores externos não serão convertidos para UUIDv7;
- registros UUIDv4 existentes continuam válidos em colunas `uuid`.

## Consequências positivas

- o ID existe antes de abrir a transação;
- não entra uma dependência de terceiros só para gerar UUID;
- inserções recentes tendem a ficar próximas no índice;
- aplicação e banco conseguem validar a versão do identificador;
- a troca futura de banco não depende de sequências proprietárias.

## Consequências negativas e trade-offs

- o identificador revela aproximadamente quando foi criado;
- UUID ocupa mais espaço que uma identidade numérica;
- a ordenação não é uma garantia de sequência causal;
- relógios incorretos podem afetar a ordenação aproximada, embora não devam afetar as regras de negócio.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---:|---:|---|
| tratar o UUID como ordem oficial | média | alto | manter sequência e timestamps explícitos; proibir essa leitura nos contratos |
| expor horário aproximado de criação | baixa | médio | não usar o identificador como segredo e avaliar IDs públicos por recurso |
| testes instáveis | baixa | médio | injetar `IdGenerator` e usar fixtures determinísticas |
| incompatibilidade em consumidor futuro | baixa | médio | trafegar como string canônica e validar na borda |

## Evidências e referências

- [RFC 9562 — UUIDs](https://www.rfc-editor.org/rfc/rfc9562.html), definição do UUIDv7;
- [PostgreSQL — tipo UUID](https://www.postgresql.org/docs/18/datatype-uuid.html);
- [PostgreSQL — funções UUID](https://www.postgresql.org/docs/18/functions-uuid.html);
- [Node.js 24.18 — módulo `node:crypto`](https://nodejs.org/download/release/v24.18.0/docs/api/crypto.html);
- validação local em Node.js 24.18.0 e PostgreSQL 18.6 em 2026-10-08.

## Critério de revisão

Reavaliar se a stack deixar de oferecer geração nativa, se algum protocolo externo exigir outra forma de identidade ou se medições reais mostrarem custo relevante no armazenamento e nos índices.

## Plano de migração ou reversão

Colunas `uuid` aceitam UUIDv4 e UUIDv7. Uma reversão muda a implementação de `IdGenerator` para novos registros, sem reescrever identificadores existentes. Contratos e relações permanecem no mesmo tipo.

## Aprovação

Aprovada pelo responsável do produto em 8 de outubro de 2026. Esta decisão entra em vigor na Engineering Foundation, depois da aprovação da Architecture v0.1.
