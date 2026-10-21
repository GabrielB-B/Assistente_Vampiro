# Matriz de Testes da Fatia 01 v0.1

**Status:** aprovada e implementada<br>
**Data de aprovação:** 21 de outubro de 2026<br>
**Escopo:** regras do teste básico, de `RULE-ROLL-001` a `RULE-ROLLFLOW-001`<br>
**Total:** 76 cenários normativos

## 1. Objetivo

Transformar os cenários aprovados das oito especificações em provas executáveis,
sem depender de texto dos livros no código ou nos testes.

Cada linha abaixo preserva o identificador da especificação. O teste automatizado
usará esse identificador em seu nome, de modo que uma falha na CI possa ser ligada
diretamente à regra, à revisão e à fonte já catalogada.

## 2. Convenção de implementação

| Coluna | Significado |
|---|---|
| cenário | identificador normativo que aparecerá no teste |
| prova principal | comportamento mínimo que o teste precisa demonstrar |
| destino | arquivo de teste previsto dentro de `packages/rules-engine` |
| camada | unidade para uma regra isolada; composição para o fluxo completo |

Os valores completos de entrada e saída continuam nas especificações vinculadas.
A matriz não cria regra nova e não substitui a fonte normativa.

## 3. Formação da parada — `RULE-ROLL-001-r1`

Especificação: [Formação da parada de dados](./especificacoes/fatia-01/rule-roll-001-composicao-parada.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-ROLL-001-T01` | Atributo 3 e Habilidade 2 formam parada 5 | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T02` | componente com valor zero não cria penalidade | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T03` | um único componente válido forma a parada | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T04` | dois Atributos podem compor uma parada publicada | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T05` | soma zero aplica o piso de um dado | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T06` | a regra não cria teto artificial de dez dados | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T07` | lista vazia retorna `InvalidPoolComposition` | `build-pool.spec.ts` | unidade |
| `RULE-ROLL-001-T08` | valor negativo retorna `InvalidPoolComponentValue` | `build-pool.spec.ts` | unidade |

## 4. Participação da Fome — `RULE-HUNGER-001-r1`

Especificação: [Dados de Fome na rolagem](./especificacoes/fatia-01/rule-hunger-001-participacao-dados-fome.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-HUNGER-001-T01` | parada 6 e Fome 2 resultam em 4 dados normais e 2 de Fome | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T02` | Fome acima da parada substitui todos os dados, sem acrescentar dados | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T03` | Fome zero mantém todos os dados normais | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T04` | parada mínima pode ser totalmente composta por Fome | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T05` | Humanidade exclui a participação da Fome | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T06` | Checagem de Sangue exclui a participação da Fome | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T07` | rolagem de Força de Vontade exclui a participação da Fome | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T08` | Fome negativa retorna `HUNGER_OUT_OF_RANGE` | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T09` | Fome acima de 5 retorna `HUNGER_OUT_OF_RANGE` | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T10` | exclusão sem motivo retorna `EXCLUSION_REASON_REQUIRED` | `allocate-hunger.spec.ts` | unidade |
| `RULE-HUNGER-001-T11` | parada menor que um retorna `BASE_POOL_OUT_OF_RANGE` | `allocate-hunger.spec.ts` | unidade |

## 5. Dificuldade — `RULE-DIFF-001-r1`

Especificação: [Definição da Dificuldade](./especificacoes/fatia-01/rule-diff-001-definicao-dificuldade.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-DIFF-001-T01` | Dificuldade 1 pertence à faixa `EASY` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T02` | Dificuldade 3 pertence à faixa `MODERATE` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T03` | Dificuldade 6 pertence à faixa `VERY_HARD` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T04` | Dificuldade 7 pertence à faixa `NEARLY_IMPOSSIBLE` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T05` | valores acima de 7 continuam válidos e sem teto artificial | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T06` | zero retorna `BELOW_MINIMUM` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T07` | valor negativo retorna `BELOW_MINIMUM` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T08` | valor fracionário retorna `NOT_INTEGER` | `validate-difficulty.spec.ts` | unidade |
| `RULE-DIFF-001-T09` | valor ausente em runtime retorna `REQUIRED` | `validate-difficulty.spec.ts` | unidade |

## 6. Contagem de críticos — `RULE-CRIT-001-r1`

Especificação: [Contagem de críticos](./especificacoes/fatia-01/rule-crit-001-contagem-criticos.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-CRIT-001-T01` | rolagem sem resultado 10 não forma par | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T02` | um único resultado 10 não gera bônus | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T03` | dois resultados 10 formam um par e concedem bônus 2 | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T04` | três resultados 10 formam um par e preservam o sucesso restante | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T05` | quatro resultados 10 formam dois pares e concedem bônus 4 | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T06` | um 10 normal e um 10 de Fome formam o mesmo par | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T07` | dois resultados 10 de Fome formam um par | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T08` | face fora do d10 retorna `InvalidDiceFace` | `count-criticals.spec.ts` | unidade |
| `RULE-CRIT-001-T09` | cinco resultados 10 formam dois pares, sem descartar o restante | `count-criticals.spec.ts` | unidade |

## 7. Resultado — `RULE-RESULT-001-r1`

Especificação: [Sucessos, falha e margem](./especificacoes/fatia-01/rule-result-001-resolucao-resultado.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-RESULT-001-T01` | igualdade com a Dificuldade é vitória de margem zero | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T02` | falha com sucesso é elegível para Vencer a um Custo | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T03` | zero sucessos produz Falha Total | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T04` | bônus crítico entra antes da comparação e produz vitória crítica | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T05` | par crítico insuficiente para a Dificuldade continua sendo falha | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T06` | dados normais e de Fome usam o mesmo limite de sucesso | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T07` | falha com 1 de Fome permanece candidata à classificação bestial | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T08` | par misto pode produzir vitória crítica | `resolve-result.spec.ts` | unidade |
| `RULE-RESULT-001-T09` | resumo crítico incompatível retorna `InvalidCriticalSummary` | `resolve-result.spec.ts` | unidade |

## 8. Crítico Bestial — `RULE-MESSY-001-r1`

Especificação: [Crítico Bestial](./especificacoes/fatia-01/rule-messy-001-critico-bestial.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-MESSY-001-T01` | vitória crítica com 10 de Fome é `MESSY_CRITICAL` | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T02` | dois resultados 10 de Fome produzem uma única classificação | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T03` | vitória crítica só com resultados 10 normais não é bestial | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T04` | um 10 de Fome sem par não basta | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T05` | falha com par crítico nunca é Crítico Bestial | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T06` | resultado 1 de Fome não transforma vitória comum | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T07` | vitória crítica com 10 e 1 de Fome continua apenas Crítico Bestial | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T08` | vitória crítica sem Dados de Fome não é bestial | `classify-messy-critical.spec.ts` | unidade |
| `RULE-MESSY-001-T09` | vitória crítica sem par correspondente retorna `InvalidSpecialResultInput` | `classify-messy-critical.spec.ts` | unidade |

## 9. Falha Bestial — `RULE-BESTIAL-001-r1`

Especificação: [Falha Bestial](./especificacoes/fatia-01/rule-bestial-001-falha-bestial.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-BESTIAL-001-T01` | Falha Total com 1 de Fome também é Falha Bestial | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T02` | falha com sucessos e 1 de Fome é bestial e elegível para custo | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T03` | vitória com 1 de Fome não é Falha Bestial | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T04` | resultado 1 apenas em dado normal não satisfaz a condição | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T05` | falha sem resultado 1 não é bestial | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T06` | vários resultados 1 de Fome produzem uma única classificação | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T07` | vitória crítica nunca recebe Falha Bestial | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T08` | uma nova tentativa vencedora é classificada por suas próprias faces | `classify-bestial-failure.spec.ts` | unidade |
| `RULE-BESTIAL-001-T09` | vitória marcada como Falha Total retorna `InvalidSpecialResultInput` | `classify-bestial-failure.spec.ts` | unidade |

O cenário T08 não implementa rerrolagem. Ele prova que o classificador é puro e
não herda a classificação de uma tentativa anterior. O vínculo e o histórico
pertencerão à futura `RULE-WILL-001` e ao caso de uso.

## 10. Ordem completa — `RULE-ROLLFLOW-001-r1`

Especificação: [Ordem de resolução](./especificacoes/fatia-01/rule-rollflow-001-ordem-resolucao.md)

| Cenário | Prova principal | Destino | Camada |
|---|---|---|---|
| `RULE-ROLLFLOW-001-T01` | vitória comum, dois sucessos e margem zero | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T02` | falha com um sucesso e custo elegível | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T03` | Falha Total sem classificação especial | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T04` | vitória crítica comum com bônus aplicado uma vez | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T05` | par misto vencedor produz Crítico Bestial | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T06` | falha com sucesso e 1 de Fome produz Falha Bestial | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T07` | Falha Total e Falha Bestial coexistem | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T08` | vitória com 1 de Fome não é bestial | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T09` | 10 de Fome sem par produz vitória comum | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T10` | par com 10 de Fome que falha é Falha Bestial, não Crítico Bestial | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T11` | quantidade incorreta de faces retorna `DiceCountMismatch` | `evaluate-basic-test.spec.ts` | composição |
| `RULE-ROLLFLOW-001-T12` | repetir a mesma entrada produz valor estruturalmente idêntico | `evaluate-basic-test.spec.ts` | composição |

## 11. Provas complementares

Os 76 cenários normativos serão acompanhados por testes que não criam novas
regras, mas defendem as fronteiras aprovadas.

| Prova | Destino | Critério |
|---|---|---|
| contrato público | `public-contract.spec.ts` | exports, enums, revisões e resultado permanecem fechados |
| arquitetura | `architecture.spec.ts` | fonte não importa Nest, banco, HTTP, Socket.IO, React ou Next.js |
| separação do frontend | `architecture.spec.ts` | `apps/web` não declara dependência do motor autoritativo |
| invariantes da parada | `pool-properties.spec.ts` | ordem dos componentes não muda a soma e nunca há teto artificial |
| invariantes da Fome | `hunger-properties.spec.ts` | normais mais Fome sempre preservam o total |
| invariantes do resultado | `result-properties.spec.ts` | bônus entra uma vez; vitória e falha são mutuamente exclusivas |
| conteúdo distribuível | `architecture.spec.ts` | pacote e fixtures não contêm PDFs, OCR nem trechos integrais das fontes |

Os testes de propriedades usarão laços determinísticos sobre limites pequenos.
Não será adicionada uma biblioteca nova apenas para essa etapa. Mutação de testes
será reavaliada quando o pacote já possuir uma linha de base estável.

## 12. Critério para considerar a matriz atendida

- os 76 identificadores aparecem na suíte e passam;
- cada erro é conferido por `code` e `reason`, não por texto de mensagem;
- os testes de composição usam faces explícitas;
- nenhum snapshot é a única prova de uma regra;
- a execução não acessa rede, relógio, gerador aleatório, banco ou filesystem;
- a cobertura complementar protege as condições críticas e os limites do pacote.

## 13. Resultado da implementação

Os 76 cenários normativos e dez provas complementares foram implementados em
`packages/rules-engine/tests`. Em 21 de outubro de 2026, lint, typecheck, 86 testes,
build do pacote e o gate integrado do monorepo passaram localmente.
