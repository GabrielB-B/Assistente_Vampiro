# RULE-RESULT-001 — Sucessos, falha e margem

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-RESULT-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

Cada resultado de 6 a 10 gera um sucesso básico. Depois, o sistema acrescenta o bônus dos pares críticos e compara o total com a Dificuldade.

```text
total de sucessos = sucessos básicos + bônus crítico
```

- total igual ou maior que a Dificuldade: vitória;
- total menor que a Dificuldade: falha;
- total igual a zero: falha total.

Exemplo:

```text
faces: 10, 10, 5, 3
sucessos básicos: 2
bônus de um par crítico: 2
total: 4
Dificuldade: 3
resultado: vitória crítica com margem 1
```

## 2. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| idioma | PT-BR oficial da edição disponível |
| capítulo | Regras — Resultados das Paradas de Dados |
| páginas impressas | 118 e 120–122 |
| páginas do PDF | 120 e 122–124 |
| cotejo visual | concluído em 8 de outubro de 2026 |
| errata aplicável | nenhuma catalogada no corpus atual |
| fontes comparadas | `SRC-0003` e `SRC-0004` |
| atualização encontrada | nenhuma substituição da resolução básica |

O texto abaixo é uma especificação própria. Os Markdown serviram para busca e o PDF original permaneceu como fonte normativa.

## 3. Ordem do cálculo

1. contar um sucesso básico para cada face de 6 a 10;
2. receber de `RULE-CRIT-001` o bônus produzido pelos pares de resultados 10;
3. somar sucessos básicos e bônus crítico;
4. comparar o total com a Dificuldade;
5. calcular a margem quando houver vitória;
6. indicar situações que ainda dependem de outra regra ou do Narrador.

O bônus crítico entra antes da comparação. Sem isso, um par de resultados 10 poderia ser tratado incorretamente como falha.

## 4. Vitória, falha e margem

### Vitória

A rolagem vence quando o total de sucessos é igual ou maior que a Dificuldade.

### Falha

A rolagem falha quando o total de sucessos é menor que a Dificuldade.

Uma falha que ainda possui ao menos um sucesso pode permitir `Vencer a um Custo`. Essa é uma escolha do Narrador, não uma conversão automática feita pelo sistema.

### Falha total

Quando nenhum sucesso é obtido, existe uma `Falha Total`. Seu significado narrativo é decidido pelo Narrador.

### Margem

Em uma vitória, a margem é o total de sucessos que excede a Dificuldade.

```text
margem = total de sucessos - Dificuldade
```

Uma vitória com total igual à Dificuldade possui margem zero.

## 5. Vitória crítica

Uma vitória é crítica quando duas condições são verdadeiras:

1. existe ao menos um par crítico calculado por `RULE-CRIT-001`;
2. o total final alcança a Dificuldade.

Um par de resultados 10 em uma rolagem que ainda ficou abaixo da Dificuldade não produz vitória crítica.

Se a vitória crítica também possuir um resultado 10 em Dado de Fome, `RULE-MESSY-001` poderá classificá-la como `Crítico Bestial`.

## 6. Relação com a Falha Bestial

Esta regra decide apenas se a rolagem falhou. `RULE-BESTIAL-001` verificará depois se existe ao menos um resultado 1 em Dado de Fome.

É importante separar `Falha Total` de `Falha Bestial`:

- Falha Total: a rolagem terminou com zero sucessos;
- Falha Bestial: a rolagem não alcançou a Dificuldade e possui ao menos um resultado 1 em Dado de Fome.

Uma Falha Bestial pode ocorrer mesmo quando existem alguns sucessos. Basta que eles sejam insuficientes para vencer.

## 7. Relação com a Força de Vontade

`RULE-WILL-001` será uma regra separada. Ela permitirá gastar um ponto de Força de Vontade para rerrolar até três dados normais elegíveis. Dados de Fome não podem ser rerrolados dessa forma.

O gasto marca um nível de dano Superficial na trilha de Força de Vontade. Rolagens de trilha, Checagens e outros casos que proíbem expressamente esse uso não serão considerados elegíveis. A especificação própria detalhará todas as exceções antes da implementação.

A rerrolagem não altera esta fórmula. Ela produz um novo conjunto de faces e uma tentativa vinculada à anterior. O resultado é então calculado novamente.

```text
tentativa inicial
→ escolha de até 3 dados normais
→ gasto de Força de Vontade
→ novas faces para os dados escolhidos
→ nova avaliação completa
```

As faces anteriores nunca são sobrescritas.

## 8. Entradas

| Entrada | Regra |
|---|---|
| `normalFaces` | faces válidas dos dados normais |
| `hungerFaces` | faces válidas dos Dados de Fome |
| `difficulty` | Dificuldade validada por `RULE-DIFF-001` |
| `criticalPairCount` | pares calculados por `RULE-CRIT-001` |
| `criticalBonusSuccesses` | bônus calculado por `RULE-CRIT-001` |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

O resultado deve rejeitar um resumo crítico incompatível com as faces recebidas.

## 9. Saídas

| Saída | Significado |
|---|---|
| `normalBaseSuccesses` | sucessos básicos em dados normais |
| `hungerBaseSuccesses` | sucessos básicos em Dados de Fome |
| `baseSuccesses` | soma dos sucessos básicos |
| `criticalBonusSuccesses` | bônus recebido da regra de críticos |
| `totalSuccesses` | sucessos básicos mais bônus crítico |
| `outcome` | `VICTORY` ou `FAILURE` |
| `margin` | sucessos acima da Dificuldade; presente em vitórias |
| `isCriticalVictory` | vitória que contém ao menos um par crítico |
| `isTotalFailure` | falha com zero sucessos |
| `winAtCostEligible` | falha com ao menos um sucesso |
| `appliedRuleRevisionId` | revisão usada no cálculo |

`winAtCostEligible` apenas informa que o Narrador pode avaliar a opção. Ele não muda `outcome` automaticamente.

## 10. Regras que sempre devem ser verdadeiras

1. Somente faces de 6 a 10 geram sucesso básico.
2. Dados normais e de Fome usam o mesmo limite de sucesso.
3. O bônus crítico é somado uma única vez.
4. Total igual à Dificuldade é vitória.
5. Margem zero pode representar uma vitória válida.
6. Vitória crítica exige vitória e ao menos um par crítico.
7. Falha total exige zero sucessos.
8. Falha com sucessos pode ser elegível para Vencer a um Custo.
9. Esta regra não escolhe consequências narrativas.
10. A mesma entrada e revisão sempre produzem a mesma saída.

## 11. Cenários de teste

| ID | Faces normais | Faces de Fome | Dificuldade | Crítico | Resultado esperado |
|---|---|---|---:|---|---|
| `RULE-RESULT-001-T01` | 6, 7, 4 | — | 2 | nenhum | vitória; total 2; margem 0 |
| `RULE-RESULT-001-T02` | 6, 4, 3 | — | 2 | nenhum | falha; total 1; elegível para Vencer a um Custo |
| `RULE-RESULT-001-T03` | 5, 4, 1 | — | 1 | nenhum | falha total; total 0 |
| `RULE-RESULT-001-T04` | 10, 10, 4 | — | 4 | 1 par; bônus 2 | vitória crítica; total 4; margem 0 |
| `RULE-RESULT-001-T05` | 10, 10, 4 | — | 5 | 1 par; bônus 2 | falha; total 4; não é vitória crítica |
| `RULE-RESULT-001-T06` | 8, 2 | 7, 3 | 2 | nenhum | vitória; 1 sucesso normal e 1 de Fome |
| `RULE-RESULT-001-T07` | 8, 2 | 1, 3 | 3 | nenhum | falha; total 1; candidata à avaliação de Falha Bestial |
| `RULE-RESULT-001-T08` | 10, 7 | 10, 2 | 3 | 1 par; bônus 2 | vitória crítica; total 5; candidata à avaliação de Crítico Bestial |
| `RULE-RESULT-001-T09` | 10, 10 | — | 3 | resumo informa bônus 0 | `InvalidCriticalSummary` |

## 12. Responsabilidades

### Sistema

- conta e explica o resultado;
- diferencia falha, falha total e vitória crítica;
- encaminha candidatos para as classificações bestiais;
- nunca escolhe uma consequência narrativa.

### Narrador

- decide se oferece Vencer a um Custo;
- descreve o significado da margem e da falha;
- escolhe consequências quando outra regra exigir decisão narrativa.

### Jogador

- confere o resultado apresentado;
- poderá escolher uma rerrolagem elegível quando `RULE-WILL-001` for implementada;
- não altera manualmente o total calculado.

## 13. O que fica para outras regras

| Assunto | Responsável |
|---|---|
| contar pares e bônus críticos | `RULE-CRIT-001` |
| identificar Crítico Bestial | `RULE-MESSY-001` |
| identificar Falha Bestial | `RULE-BESTIAL-001` |
| rerrolar dados normais | `RULE-WILL-001` |
| decidir consequência narrativa | Narrador |
| vitória automática | futura `RULE-AUTO-001` |
| disputas | futura `RULE-CONTEST-001` |
| coordenar a ordem completa | `RULE-ROLLFLOW-001` |

## 14. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 118 | limite de sucesso e comparação com a Dificuldade |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 120–121 | críticos, margem e Vencer a um Custo |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 122 | Falha Total e rerrolagem com Força de Vontade |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 158 | gasto e usos da Força de Vontade |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 207 | Crítico Bestial e Falha Bestial |
| `SRC-0003` — Companion PT-BR | corpus comparado | nenhuma substituição da resolução básica encontrada |
| `SRC-0004` — Players Guide EN | corpus comparado | nenhuma substituição da resolução básica encontrada |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0120.md`;
- `SRC-0001/ocr/paginas/pdf-0122.md`;
- `SRC-0001/ocr/paginas/pdf-0123.md`;
- `SRC-0001/ocr/paginas/pdf-0124.md`;
- `SRC-0001/ocr/paginas/pdf-0160.md`;
- `SRC-0001/ocr/paginas/pdf-0209.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

## 15. Decisões confirmadas

- `RULE-RESULT-001-r1` é o identificador da primeira revisão;
- igualdade com a Dificuldade é vitória de margem zero;
- Falha Total e Falha Bestial permanecem conceitos diferentes;
- Vencer a um Custo é apenas indicado, mantendo a decisão com o Narrador;
- uma futura rerrolagem com Força de Vontade produz nova tentativa e novo cálculo.

## 16. Dependências

- [RULE-DIFF-001 — Definição da Dificuldade](./rule-diff-001-definicao-dificuldade.md);
- [RULE-CRIT-001 — Contagem de críticos](./rule-crit-001-contagem-criticos.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md).

## 17. Checklist

- [x] materiais Markdown consultados;
- [x] páginas normativas registradas;
- [x] páginas conferidas visualmente;
- [x] Companion e Players Guide comparados;
- [x] sucessos básicos, bônus e Dificuldade separados;
- [x] vitória, falha, Falha Total e margem definidos;
- [x] fronteiras com classificações bestiais definidas;
- [x] futura rerrolagem com Força de Vontade posicionada;
- [x] nove cenários registrados;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 18. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após leitura dos Markdown e cotejo visual | engenharia e revisão de regras |
| 2026-10-08 | resultado, margem e posição da rerrolagem aprovados | responsável do produto |
