# RULE-BESTIAL-001 — Falha Bestial

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-BESTIAL-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

Uma `Falha Bestial` acontece quando:

1. a rolagem não alcança a Dificuldade;
2. pelo menos um Dado de Fome apresenta resultado 1.

```text
falha + resultado 1 em Dado de Fome = Falha Bestial
```

A rolagem pode possuir alguns sucessos e ainda ser uma Falha Bestial. O que importa é não ter sucessos suficientes para vencer.

## 2. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| páginas impressas | 205–208 |
| páginas do PDF | 207–210 |
| apoio para Falha Total | p. 122 |
| cotejo visual | concluído em 8 de outubro de 2026 |
| Companion | comparado; nenhuma substituição da classificação encontrada |
| Players Guide | comparado; nenhuma substituição da classificação básica encontrada |

O Livro Básico define a condição e apresenta consequências possíveis. Companion e Players Guide acrescentam contextos, mas não substituem a regra central usada nesta revisão.

## 3. Condições da classificação

| Informação | Origem |
|---|---|
| a rolagem falhou | `RULE-RESULT-001` |
| existe ao menos um resultado 1 em Dado de Fome | faces preservadas por tipo |

As duas condições são obrigatórias.

### Exemplos rápidos

| Situação | Classificação |
|---|---|
| zero sucessos e um resultado 1 de Fome | Falha Total e Falha Bestial |
| dois sucessos contra Dificuldade 3 e um resultado 1 de Fome | Falha Bestial |
| vitória com um resultado 1 de Fome | vitória; não é Falha Bestial |
| falha com resultado 1 apenas em dado normal | falha comum |

## 4. Diferença entre Falha Total e Falha Bestial

Os conceitos podem aparecer juntos, mas não significam a mesma coisa:

- `Falha Total`: nenhum sucesso foi obtido;
- `Falha Bestial`: a rolagem falhou e existe um resultado 1 em Dado de Fome.

Portanto:

- uma Falha Total sem resultado 1 de Fome não é bestial;
- uma Falha Bestial com alguns sucessos não é Falha Total;
- uma rolagem com zero sucessos e resultado 1 de Fome possui as duas classificações.

O sistema precisa preservar ambas, sem usar um único campo que faça uma apagar a outra.

## 5. O que a classificação não altera

A Falha Bestial:

- não transforma a rolagem em vitória;
- não remove os sucessos obtidos;
- não altera a Dificuldade;
- não escolhe automaticamente uma consequência;
- não acontece em uma rolagem vencedora, ainda que vários Dados de Fome apresentem resultado 1.

## 6. Consequência narrativa

Depois da classificação, o sistema informa que existe uma decisão pendente. As fontes apresentam consequências como:

- uma Compulsão;
- perda ligada a uma Vantagem;
- dano Agravado à Vitalidade em situação apropriada;
- aumento da Fome quando nenhuma consequência melhor servir à cena.

Se o aumento ultrapassaria Fome 5, as regras exigem uma rolagem para resistir ao frenesi de fome. Esse encadeamento pertence às futuras regras de Fome e Frenesi.

O Rules Engine não escolhe a consequência:

```text
classificação: BESTIAL_FAILURE
decisão pendente: BESTIAL_FAILURE_CONSEQUENCE
```

O Narrador confirma a consequência, e a aplicação usa um comando autorizado quando houver alteração de ficha ou da Crônica.

## 7. Relação com Vencer a um Custo

Uma falha com pelo menos um sucesso pode ser elegível para `Vencer a um Custo`. Se essa mesma rolagem possuir um resultado 1 de Fome, o motor preserva as duas informações:

```text
specialResult: BESTIAL_FAILURE
winAtCostEligible: true
```

Esta regra não apaga uma classificação para favorecer a outra. A composição narrativa entre o custo e a consequência bestial será fechada na futura `RULE-COST-001`. A questão está registrada como `AMB-007` e não impede a identificação mecânica da Falha Bestial.

## 8. Relação com a Força de Vontade

O jogador pode tentar transformar a falha em vitória rerrolando até três dados normais elegíveis. O resultado 1 de Fome não pode ser rerrolado.

Depois da rerrolagem:

- se a nova tentativa vencer, não existe Falha Bestial nessa nova tentativa;
- se continuar falhando, o resultado 1 de Fome mantém a condição bestial;
- as faces e o resultado da tentativa anterior permanecem no histórico;
- nenhuma consequência é aplicada antes de a janela de rerrolagem terminar.

Essa ordem evita aplicar uma Compulsão ou outro efeito antes de o jogador decidir se gastará Força de Vontade.

## 9. Entradas

| Entrada | Regra |
|---|---|
| `outcome` | `VICTORY` ou `FAILURE`, produzido por `RULE-RESULT-001` |
| `hungerOneCount` | quantidade de resultados 1 em Dados de Fome |
| `isTotalFailure` | informa se a rolagem terminou com zero sucessos |
| `winAtCostEligible` | informa se a falha possui sucessos |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

Os resumos devem corresponder às faces persistidas na tentativa.

## 10. Saídas

| Saída | Significado |
|---|---|
| `specialResult` | `BESTIAL_FAILURE` ou `NONE` |
| `coexistsWithTotalFailure` | verdadeiro quando as duas classificações ocorrem |
| `winAtCostEligible` | preserva a indicação recebida da regra de resultado |
| `narratorDecisionRequired` | verdadeiro quando a consequência precisa ser escolhida |
| `narratorDecisionKind` | `BESTIAL_FAILURE_CONSEQUENCE` quando aplicável |
| `appliedRuleRevisionId` | revisão usada na classificação |

## 11. Regras que sempre devem ser verdadeiras

1. Falha Bestial exige uma rolagem fracassada.
2. Falha Bestial exige ao menos um resultado 1 em Dado de Fome.
3. Um resultado 1 em dado normal não satisfaz essa condição.
4. Uma vitória nunca é Falha Bestial.
5. Falha Bestial não exige zero sucessos.
6. Falha Total e Falha Bestial podem coexistir.
7. A classificação não altera sucessos nem Dificuldade.
8. A consequência só é resolvida depois da janela de rerrolagem.
9. O sistema não escolhe a consequência narrativa.
10. A mesma entrada e revisão sempre produzem a mesma saída.

## 12. Cenários de teste

| ID | Situação final | Resultado esperado |
|---|---|---|
| `RULE-BESTIAL-001-T01` | falha com zero sucessos e um resultado 1 de Fome | `BESTIAL_FAILURE`; também Falha Total |
| `RULE-BESTIAL-001-T02` | falha com dois sucessos contra Dificuldade 3 e um resultado 1 de Fome | `BESTIAL_FAILURE`; não é Falha Total; custo elegível |
| `RULE-BESTIAL-001-T03` | vitória com um resultado 1 de Fome | `NONE` |
| `RULE-BESTIAL-001-T04` | falha com resultado 1 somente em dado normal | `NONE` |
| `RULE-BESTIAL-001-T05` | falha sem resultados 1 | `NONE` |
| `RULE-BESTIAL-001-T06` | falha com dois resultados 1 de Fome | uma única classificação `BESTIAL_FAILURE` |
| `RULE-BESTIAL-001-T07` | vitória crítica com resultados 10 e 1 de Fome | nunca Falha Bestial; classificação crítica tratada separadamente |
| `RULE-BESTIAL-001-T08` | tentativa inicial bestial; nova tentativa vence após rerrolagem de dados normais | nova tentativa recebe `NONE`; anterior permanece histórica |
| `RULE-BESTIAL-001-T09` | entrada marca vitória e Falha Total ao mesmo tempo | `InvalidSpecialResultInput` |

## 13. Responsabilidades

### Sistema

- identifica a Falha Bestial;
- mantém Falha Total, custo elegível e classificação bestial em campos distintos;
- espera o encerramento da janela de rerrolagem antes de pedir consequência;
- não aplica efeitos narrativos automaticamente.

### Narrador

- confirma uma consequência adequada à cena e ao grupo;
- resolve futuramente a interação com Vencer a um Custo;
- usa fluxos autorizados para alterações persistentes.

### Jogador

- decide se fará uma rerrolagem elegível antes da resolução da consequência;
- participa da descrição;
- interpreta a consequência confirmada.

## 14. O que fica para outras regras

| Assunto | Responsável |
|---|---|
| vitória, falha e Falha Total | `RULE-RESULT-001` |
| Crítico Bestial | `RULE-MESSY-001` |
| rerrolagem | `RULE-WILL-001` |
| Vencer a um Custo | futura `RULE-COST-001` |
| aplicação de Compulsão | futura regra de Compulsões |
| aumento de Fome | futura regra de Fome |
| frenesi de fome | futura regra de Frenesi |
| ordem completa | `RULE-ROLLFLOW-001` |

## 15. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 121–122 | Vencer a um Custo e Falha Total |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 205–207 | Dados de Fome, exemplos e definição de Falha Bestial |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 158 | gasto de Força de Vontade |
| `SRC-0003` — Companion PT-BR | p. 62 | comparação das Compulsões bestiais |
| `SRC-0004` — Players Guide EN | corpus comparado | nenhum conflito com a classificação central |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0123.md`;
- `SRC-0001/ocr/paginas/pdf-0124.md`;
- `SRC-0001/ocr/paginas/pdf-0160.md`;
- `SRC-0001/ocr/paginas/pdf-0207.md`;
- `SRC-0001/ocr/paginas/pdf-0208.md`;
- `SRC-0001/ocr/paginas/pdf-0209.md`;
- `SRC-0001/ocr/paginas/pdf-0210.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0003/nativo/paginas-markdown/pdf-0062.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

## 16. Decisões confirmadas

- `RULE-BESTIAL-001-r1` é o identificador da primeira revisão;
- qualquer falha que contenha ao menos um resultado 1 em Dado de Fome recebe a classificação;
- Falha Total e Falha Bestial permanecem em campos independentes;
- nenhuma consequência é aplicada antes de encerrar a janela de rerrolagem;
- Falha Bestial e elegibilidade para Vencer a um Custo são preservadas simultaneamente;
- `RULE-COST-001` comporá o custo com a consequência bestial sem apagar a classificação.

## 17. Dependências

- [RULE-RESULT-001 — Sucessos, falha e margem](./rule-result-001-resolucao-resultado.md);
- [RULE-MESSY-001 — Crítico Bestial](./rule-messy-001-critico-bestial.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Registro de Ambiguidades v0.1](../../registro-ambiguidades-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md).

## 18. Checklist

- [x] materiais Markdown consultados;
- [x] páginas normativas registradas;
- [x] páginas do Livro Básico conferidas;
- [x] Companion e Players Guide comparados;
- [x] Falha Total e Falha Bestial separadas;
- [x] falha com sucessos coberta;
- [x] interação com Força de Vontade posicionada;
- [x] interação aberta com Vencer a um Custo registrada;
- [x] consequência separada da classificação;
- [x] nove cenários registrados;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 19. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após leitura dos Markdown e cotejo do Livro Básico | engenharia e revisão de regras |
| 2026-10-08 | classificação, estados coexistentes e integração futura com custo aprovados | responsável do produto |
