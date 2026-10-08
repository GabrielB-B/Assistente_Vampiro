# RULE-MESSY-001 — Crítico Bestial

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-MESSY-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

Um `Crítico Bestial` acontece quando:

1. a rolagem é uma vitória crítica;
2. pelo menos um Dado de Fome apresenta resultado 10.

```text
vitória crítica + resultado 10 em Dado de Fome = Crítico Bestial
```

O personagem vence e recebe os sucessos do crítico. A diferença é que a Fome interfere na forma como esse sucesso acontece e exige uma consequência narrativa.

O termo oficial em português é `Crítico Bestial`. Não usaremos “sucesso bestial” como nome técnico.

## 2. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| página impressa | 207 |
| página do PDF | 209 |
| atualização aplicada | `SRC-0003`, Companion, p. 62 |
| cotejo visual | concluído em 8 de outubro de 2026 |
| Players Guide | nenhuma substituição encontrada |

O Livro Básico define a classificação e apresenta consequências possíveis. O Companion confirma que uma Compulsão também pode resultar de um Crítico Bestial. O Players Guide não substitui essa atualização no corpus atual.

## 3. Condições da classificação

As três informações abaixo precisam estar presentes:

| Informação | Origem |
|---|---|
| a rolagem venceu | `RULE-RESULT-001` |
| a vitória contém ao menos um par crítico | `RULE-CRIT-001` e `RULE-RESULT-001` |
| existe ao menos um resultado 10 em Dado de Fome | faces preservadas por tipo |

Se qualquer condição faltar, não existe Crítico Bestial.

### Exemplos rápidos

| Situação | Classificação |
|---|---|
| 10 normal + 10 de Fome; total alcança a Dificuldade | Crítico Bestial |
| dois resultados 10 de Fome; total alcança a Dificuldade | Crítico Bestial |
| dois resultados 10 normais; vitória | vitória crítica comum |
| um resultado 10 de Fome sem outro 10; vitória | vitória comum |
| par com 10 de Fome, mas total abaixo da Dificuldade | falha; não é Crítico Bestial |

Não importa qual resultado 10 seria colocado em um par. Se a vitória é crítica e existe ao menos um 10 de Fome na rolagem, a classificação é bestial.

## 4. O que o Crítico Bestial não altera

O Crítico Bestial:

- não remove a vitória;
- não reduz o total de sucessos;
- não modifica a margem já calculada;
- não transforma automaticamente o resultado em Falha Bestial;
- não escolhe sozinho qual consequência acontecerá na história.

Mesmo que também exista um resultado 1 em Dado de Fome, uma rolagem bem-sucedida não pode ser uma Falha Bestial.

## 5. Consequência narrativa

Depois da classificação, o sistema informa que existe uma decisão pendente. O Narrador e o jogador trabalham juntos para representar como a Besta contaminou o sucesso, mantendo o Narrador como árbitro final.

As fontes apresentam possibilidades como:

- uma Compulsão;
- Máculas por uma ação monstruosa;
- quebra da Máscara;
- perda ligada a uma Vantagem;
- outra complicação coerente quando as opções anteriores não servirem à cena.

O Rules Engine não escolhe uma dessas opções. Na primeira fatia, ele produz:

```text
classificação: MESSY_CRITICAL
decisão pendente: MESSY_CRITICAL_CONSEQUENCE
```

A aplicação futura registra a decisão do Narrador como comando e Evento de Sessão separados. Efeitos que alterem ficha ou Crônica usam os fluxos próprios e suas permissões.

## 6. Relação com a Força de Vontade

A classificação usa as faces da tentativa que está sendo avaliada.

Quando `RULE-WILL-001` permitir uma rerrolagem:

- somente dados normais poderão ser escolhidos;
- os resultados dos Dados de Fome permanecerão;
- a nova tentativa recalculará pares, vitória e classificação bestial;
- a tentativa anterior continuará preservada no histórico.

Um resultado 10 de Fome não garante sozinho o Crítico Bestial. Uma rerrolagem de dados normais ainda pode criar ou remover o par necessário para a vitória crítica.

A consequência não deve ser aplicada enquanto a janela de rerrolagem estiver aberta. Se houver uma nova tentativa, somente o resultado final confirmado segue para a decisão narrativa.

## 7. Entradas

| Entrada | Regra |
|---|---|
| `outcome` | resultado produzido por `RULE-RESULT-001` |
| `isCriticalVictory` | verdadeiro somente para uma vitória com par crítico |
| `criticalPairCount` | quantidade de pares produzida por `RULE-CRIT-001` |
| `hungerTenCount` | quantidade de resultados 10 em Dados de Fome |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

A regra recebe resumos já calculados, mas a composição do fluxo deve garantir que eles correspondam às faces persistidas.

## 8. Saídas

| Saída | Significado |
|---|---|
| `specialResult` | `MESSY_CRITICAL` ou `NONE` |
| `narratorDecisionRequired` | verdadeiro quando a consequência precisa ser escolhida |
| `narratorDecisionKind` | `MESSY_CRITICAL_CONSEQUENCE` quando aplicável |
| `appliedRuleRevisionId` | revisão usada na classificação |

A consequência escolhida não faz parte desta saída mecânica.

## 9. Regras que sempre devem ser verdadeiras

1. Crítico Bestial exige uma vitória crítica.
2. Crítico Bestial exige ao menos um resultado 10 em Dado de Fome.
3. Um resultado 10 de Fome isolado não é suficiente.
4. Uma falha nunca é classificada como Crítico Bestial.
5. Um resultado 1 de Fome não transforma uma vitória em Falha Bestial.
6. A classificação não altera sucessos, resultado nem margem.
7. A consequência permanece uma decisão humana.
8. A mesma entrada e revisão sempre produzem a mesma saída.

## 10. Cenários de teste

| ID | Situação final | Resultado esperado |
|---|---|---|
| `RULE-MESSY-001-T01` | vitória crítica; um 10 normal e um 10 de Fome | `MESSY_CRITICAL`; decisão pendente |
| `RULE-MESSY-001-T02` | vitória crítica; dois resultados 10 de Fome | `MESSY_CRITICAL`; decisão pendente |
| `RULE-MESSY-001-T03` | vitória crítica; dois resultados 10 normais; nenhum 10 de Fome | `NONE` |
| `RULE-MESSY-001-T04` | vitória comum; um único resultado 10 de Fome | `NONE` |
| `RULE-MESSY-001-T05` | falha; existe par crítico e um 10 de Fome | `NONE` |
| `RULE-MESSY-001-T06` | vitória comum; existe resultado 1 de Fome, mas nenhum 10 de Fome | `NONE` |
| `RULE-MESSY-001-T07` | vitória crítica; existem resultados 10 e 1 em Dados de Fome | `MESSY_CRITICAL`; nunca Falha Bestial |
| `RULE-MESSY-001-T08` | vitória crítica em rolagem sem Dados de Fome | `NONE` |
| `RULE-MESSY-001-T09` | entrada marca vitória crítica sem par crítico correspondente | `InvalidSpecialResultInput` |

## 11. Responsabilidades

### Sistema

- identifica o Crítico Bestial;
- preserva o resultado vencedor e sua margem;
- informa que existe uma decisão narrativa pendente;
- não aplica consequência sem confirmação.

### Narrador

- confirma a consequência adequada à cena;
- mantém coerência com o nível de sucesso e a manifestação da Besta;
- usa um fluxo autorizado quando a consequência altera estado persistente.

### Jogador

- participa da descrição do sucesso;
- interpreta a consequência confirmada;
- não escolhe unilateralmente remover a classificação bestial.

## 12. O que fica para outras regras

| Assunto | Responsável |
|---|---|
| pares e bônus críticos | `RULE-CRIT-001` |
| vitória e margem | `RULE-RESULT-001` |
| Falha Bestial | `RULE-BESTIAL-001` |
| rerrolagem | `RULE-WILL-001` |
| aplicação de Compulsão | futura regra de Compulsões |
| Máculas e Humanidade | futura regra de Humanidade |
| alterações em Vantagens | caso de uso autorizado de Personagem |
| ordem completa | `RULE-ROLLFLOW-001` |

## 13. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 207 | definição, preservação da vitória e consequências possíveis |
| `SRC-0003` — Companion PT-BR | p. 62 | Compulsões derivadas de Críticos Bestiais |
| `SRC-0004` — Players Guide EN | delta normativo | confirma que a atualização do Companion não foi substituída |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0209.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0003/nativo/paginas-markdown/pdf-0062.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

## 14. Decisões confirmadas

- `RULE-MESSY-001-r1` é o identificador da primeira revisão;
- `Crítico Bestial` é o termo técnico da interface em português;
- qualquer vitória crítica que contenha ao menos um resultado 10 de Fome recebe a classificação;
- vitória, sucessos e margem permanecem preservados;
- a consequência é uma decisão humana registrada separadamente;
- Compulsão está entre as consequências permitidas pelo perfil inicial.

## 15. Dependências

- [RULE-CRIT-001 — Contagem de críticos](./rule-crit-001-contagem-criticos.md);
- [RULE-RESULT-001 — Sucessos, falha e margem](./rule-result-001-resolucao-resultado.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Permissions & Visibility Matrix v0.1](../../../04-arquitetura/permissoes-visibilidade-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md).

## 16. Checklist

- [x] materiais Markdown consultados;
- [x] páginas normativas registradas;
- [x] página do Livro Básico conferida;
- [x] atualização do Companion incorporada;
- [x] Players Guide comparado;
- [x] pré-condições mecânicas definidas;
- [x] vitória preservada depois da classificação;
- [x] consequência separada da mecânica;
- [x] interação futura com Força de Vontade posicionada;
- [x] nove cenários registrados;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 17. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após leitura do Livro Básico, Companion e delta do Players Guide | engenharia e revisão de regras |
| 2026-10-08 | classificação, termo e separação da consequência aprovados | responsável do produto |
