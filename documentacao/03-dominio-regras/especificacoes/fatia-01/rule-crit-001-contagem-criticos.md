# RULE-CRIT-001 — Contagem de críticos

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-CRIT-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

Cada dado com resultado 6 ou maior gera um sucesso básico. Quando aparecem dois resultados 10 na mesma rolagem, esse par acrescenta mais dois sucessos.

```text
dois resultados 10
= 2 sucessos básicos
+ 2 sucessos pelo par crítico
= 4 sucessos no total
```

Os resultados 10 dos dados normais e dos Dados de Fome são contados juntos. Um 10 normal pode formar um par com um 10 de Fome.

Esta regra conta os pares e o bônus. Ela ainda não decide se a rolagem venceu, porque essa decisão depende da Dificuldade.

## 2. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| idioma | PT-BR oficial da edição disponível |
| capítulo | Regras — Críticos e Margem |
| páginas impressas | 120–122 |
| páginas do PDF | 122–124 |
| cotejo visual | concluído em 8 de outubro de 2026 |
| errata aplicável | nenhuma catalogada no corpus atual |
| fontes comparadas | `SRC-0003` e `SRC-0004` |
| atualização encontrada | nenhuma alteração da contagem básica de críticos |

As páginas foram conferidas no original e nos arquivos Markdown derivados. O texto abaixo é uma especificação própria, escrita para implementação e teste.

## 3. Como contar os pares

O cálculo usa todos os resultados 10 da rolagem:

```text
quantidade de 10 = resultados 10 normais + resultados 10 de Fome
pares críticos = parte inteira da quantidade de 10 dividida por 2
bônus crítico = pares críticos × 2
```

Cada resultado 10 continua valendo seu sucesso básico. O bônus é somado depois.

| Resultados 10 | Pares críticos | Sucessos básicos dos 10 | Bônus | Contribuição total dos 10 |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 2 | 1 | 2 | 2 | 4 |
| 3 | 1 | 3 | 2 | 5 |
| 4 | 2 | 4 | 4 | 8 |
| 5 | 2 | 5 | 4 | 9 |

Um resultado 10 que sobra depois da formação dos pares continua sendo um sucesso básico.

## 4. Relação com o resultado final

O bônus crítico precisa entrar no total antes da comparação com a Dificuldade.

Exemplo:

```text
faces: 10, 10, 4
sucessos básicos: 2
bônus crítico: 2
total final: 4
```

Contra Dificuldade 4, essa rolagem vence. Se o sistema comparasse apenas os dois sucessos básicos, produziria uma falha incorreta.

Por isso, `RULE-CRIT-001` vem antes de `RULE-RESULT-001` na ordem documental. A regra de resultado recebe o bônus já calculado e decide vitória, falha e margem.

Ter um par crítico não basta, isoladamente, para declarar uma vitória crítica. A rolagem completa ainda precisa alcançar a Dificuldade. Essa classificação pertence a `RULE-RESULT-001`.

## 5. Relação com os Dados de Fome

Os dois tipos de dado participam da mesma contagem de resultados 10. A origem de cada face, porém, não pode ser perdida.

```text
10 normal + 10 de Fome = um par crítico e dois sucessos de bônus
```

Quando uma vitória crítica contém ao menos um resultado 10 em Dado de Fome, ela pode ser classificada como `Crítico Bestial`. Essa classificação será feita por `RULE-MESSY-001`, depois que a vitória estiver confirmada.

Não é necessário escolher artificialmente qual 10 pertence a qual par. O sistema registra:

- a quantidade total de pares;
- a existência de resultado 10 em Dado de Fome;
- as faces originais separadas por tipo.

## 6. Responsabilidades

### Jogador e Narrador

- não montam os pares manualmente;
- podem consultar a explicação do cálculo;
- continuam responsáveis apenas pelas decisões que as regras atribuem à mesa.

### Sistema

- conta os resultados 10 nos dois tipos de dado;
- forma todos os pares possíveis;
- calcula o bônus sem descartar o 10 que sobrar;
- preserva a origem normal ou de Fome de cada face;
- não decide a vitória nem a consequência narrativa nesta etapa.

## 7. Entradas

| Entrada | Regra |
|---|---|
| `normalFaces` | faces válidas dos dados normais |
| `hungerFaces` | faces válidas dos Dados de Fome |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

Cada face deve ser um número inteiro entre 1 e 10. A correspondência entre a quantidade de faces e a parada preparada é validada na composição do fluxo, não por esta regra isolada.

## 8. Saídas

| Saída | Significado |
|---|---|
| `normalTenCount` | resultados 10 em dados normais |
| `hungerTenCount` | resultados 10 em Dados de Fome |
| `totalTenCount` | soma dos dois grupos |
| `criticalPairCount` | quantidade de pares completos |
| `criticalBonusSuccesses` | sucessos adicionais produzidos pelos pares |
| `hasCriticalPair` | informa se existe ao menos um par |
| `hasHungerTen` | informa se existe ao menos um 10 de Fome |
| `appliedRuleRevisionId` | revisão usada no cálculo |

O total de sucessos não é uma saída desta regra. `RULE-RESULT-001` contará os sucessos básicos e acrescentará `criticalBonusSuccesses`.

## 9. Regras que sempre devem ser verdadeiras

1. Resultados 10 normais e de Fome participam da mesma contagem de pares.
2. Cada conjunto completo de dois resultados 10 forma um par crítico.
3. Cada par acrescenta exatamente dois sucessos aos sucessos básicos.
4. Um resultado 10 sem par continua valendo um sucesso básico, mas não gera bônus.
5. Nenhuma face pode ser descartada ou mudar de tipo durante o cálculo.
6. A presença de um par não decide sozinha se houve vitória.
7. A presença de um 10 de Fome não decide sozinha se houve Crítico Bestial.
8. A mesma entrada e revisão sempre produzem a mesma saída.

## 10. Cenários de teste

| ID | Faces normais | Faces de Fome | Resultado esperado |
|---|---|---|---|
| `RULE-CRIT-001-T01` | 8, 7, 2 | — | 0 resultado 10; 0 par; bônus 0 |
| `RULE-CRIT-001-T02` | 10, 7, 2 | — | 1 resultado 10; 0 par; bônus 0 |
| `RULE-CRIT-001-T03` | 10, 10, 2 | — | 2 resultados 10; 1 par; bônus 2 |
| `RULE-CRIT-001-T04` | 10, 10, 10 | — | 3 resultados 10; 1 par; bônus 2 |
| `RULE-CRIT-001-T05` | 10, 10, 10, 10 | — | 4 resultados 10; 2 pares; bônus 4 |
| `RULE-CRIT-001-T06` | 10, 7 | 10, 2 | 2 resultados 10; 1 par; bônus 2; `hasHungerTen = true` |
| `RULE-CRIT-001-T07` | 7, 2 | 10, 10 | 2 resultados 10; 1 par; bônus 2; `hasHungerTen = true` |
| `RULE-CRIT-001-T08` | 10, 0 | — | `InvalidDiceFace: OUT_OF_RANGE` |
| `RULE-CRIT-001-T09` | 10, 10, 10 | 10, 10 | 5 resultados 10; 2 pares; bônus 4; `hasHungerTen = true` |

Os cenários tratam apenas a contagem crítica. Vitória, falha, margem e classificações bestiais serão provadas nas regras responsáveis por essas decisões.

## 11. O que fica para outras regras

| Assunto | Responsável |
|---|---|
| formar a parada | `RULE-ROLL-001` |
| separar dados normais e de Fome | `RULE-HUNGER-001` |
| validar a Dificuldade | `RULE-DIFF-001` |
| contar sucessos básicos, somar o bônus e decidir o resultado | `RULE-RESULT-001` |
| identificar Crítico Bestial | `RULE-MESSY-001` |
| aplicar consequência narrativa | decisão posterior do Narrador |
| coordenar a ordem completa | `RULE-ROLLFLOW-001` |

## 12. Implicações para o domínio

| Item | Decisão inicial |
|---|---|
| valores candidatos | `CriticalPairCount`, `CriticalBonusSuccesses` |
| responsável pelo cálculo | Rules Engine puro |
| persistência | `RollAttempt` preserva as faces e o resumo do cálculo |
| evento próprio | nenhum nesta etapa |
| auditoria operacional | não se aplica ao cálculo puro |
| explicabilidade | resultado mostra pares formados e bônus acrescentado |

## 13. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 120 | formação do par e valor total de quatro sucessos |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 121 | múltiplos pares, margem e relação com a vitória |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 122 | distinção entre falha total e resultados especiais |
| `SRC-0003` — Companion PT-BR | corpus comparado | nenhuma substituição da contagem básica encontrada |
| `SRC-0004` — Players Guide EN | corpus comparado | nenhuma substituição da contagem básica encontrada |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0122.md`;
- `SRC-0001/ocr/paginas/pdf-0123.md`;
- `SRC-0001/ocr/paginas/pdf-0124.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0003/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

## 14. Decisões confirmadas

- `RULE-CRIT-001-r1` é o identificador da primeira revisão;
- resultados 10 normais e de Fome são contados em um único conjunto para formar os pares;
- a classificação de vitória permanece fora desta regra;
- a contagem crítica acontece antes de `RULE-RESULT-001`.

## 15. Dependências

- [RULE-HUNGER-001 — Dados de Fome na rolagem](./rule-hunger-001-participacao-dados-fome.md);
- [RULE-DIFF-001 — Definição da Dificuldade](./rule-diff-001-definicao-dificuldade.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md);
- [Linha Normativa v0.1](../../linha-normativa-v0.1.md).

## 16. Checklist

- [x] materiais Markdown consultados;
- [x] páginas normativas registradas;
- [x] páginas conferidas visualmente;
- [x] Companion e Players Guide comparados;
- [x] regra explicada em linguagem simples;
- [x] pares múltiplos e resultado 10 sem par cobertos;
- [x] interação com Dados de Fome coberta;
- [x] nove cenários registrados;
- [x] fronteira com resultado e consequência narrativa definida;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 17. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após leitura dos Markdown e cotejo visual | engenharia e revisão de regras |
| 2026-10-08 | identificador, contagem e posição no fluxo aprovados | responsável do produto |
