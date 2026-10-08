# RULE-DIFF-001 — Definição da Dificuldade

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-DIFF-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

A Dificuldade é a quantidade de sucessos necessária para vencer um teste.

```text
Dificuldade 3 = o personagem precisa de pelo menos 3 sucessos
```

Ela não muda o valor necessário em cada dado. Um dado continua gerando sucesso quando apresenta resultado de 6 a 10.

```text
3 sucessos contra Dificuldade 3 = vitória
2 sucessos contra Dificuldade 3 = falha
```

## 2. Quem define a Dificuldade

Pela regra do Livro Básico, o Narrador define a Dificuldade. O valor pode ser informado aos jogadores ou mantido em segredo, dependendo do estilo da mesa.

No produto:

- a pessoa que prepara a rolagem terá um seletor de Dificuldade;
- em uma sessão narrada, o Narrador continua sendo a autoridade final;
- o sistema registra quem selecionou o valor;
- o Narrador pode alterar a Dificuldade antes da confirmação;
- depois da confirmação, a tentativa não é editada.

No primeiro alpha, a Dificuldade será visível. Dificuldade secreta está documentada, mas será implementada em uma etapa posterior.

## 3. Escala de Dificuldade

| Valor | Referência para a mesa |
|---:|---|
| 1 | fácil |
| 2 | rotineira |
| 3 | moderada |
| 4 | desafiadora |
| 5 | difícil |
| 6 | muito difícil |
| 7 ou mais | quase impossível |

O número não possui teto mecânico. Valores acima de 7 continuam válidos quando uma regra ou situação realmente exigir.

A escala serve como orientação. O Narrador considera a ação, o contexto e as consequências antes de escolher o valor.

## 4. Como o valor pode ser obtido

O Livro Básico apresenta mais de uma forma de determinar a Dificuldade:

- escolha direta pela escala;
- valor fixo definido por uma regra publicada;
- oposição representada por Dificuldade estática;
- metade da parada do personagem do Narrador, arredondada para baixo;
- valor da Habilidade do alvo, usando Dificuldade 1 quando a Habilidade for zero.

No primeiro corte, o Roll Builder aceita seleção direta ou um valor fixo fornecido por uma regra. Os cálculos automáticos de oposição ficam para uma especificação posterior, porque disputas não fazem parte do alpha inicial.

## 5. Modificadores

O Narrador pode alterar a parada ou a Dificuldade por causa das circunstâncias.

Esses ajustes não serão escondidos em um único número. Quando entrarem no produto, o sistema guardará:

- Dificuldade base;
- cada ajuste aplicado;
- motivo de cada ajuste;
- Dificuldade final.

O Livro Básico recomenda cautela com modificadores definidos no momento. A especificação detalhada pertence à futura `RULE-MOD-001`.

Na primeira fatia, que ainda não executa modificadores, a Dificuldade selecionada será igual à Dificuldade final.

## 6. Dificuldade aberta e secreta

### Primeiro alpha

Somente `OPEN` será aceita. O valor aparece para todas as pessoas autorizadas a acompanhar a rolagem.

### Evolução futura

`STORYTELLER_HIDDEN` permitirá que somente o Narrador conheça o valor antes da resolução. O Livro Básico permite essa escolha, e o Companion recomenda manter valores exatos em segredo quando sua expansão de `Pegar a Metade` estiver em uso.

Essa opção exige projeções diferentes para jogador e Narrador. Ela não será simulada ocultando apenas o número na tela enquanto ele continua exposto na API.

## 7. Comportamento do seletor

O Roll Builder deve oferecer:

- opções rápidas de 1 a 6;
- opção `7+`, que abre um campo para valor inteiro;
- descrição curta da escala;
- indicação de quem selecionou a Dificuldade;
- valor predefinido quando uma regra publicada já determinar a Dificuldade.

Não haverá valor padrão silencioso. Se nenhuma regra preencher o campo, a pessoa precisa escolher a Dificuldade antes de confirmar a rolagem.

Quando o valor vier de uma regra fixa, a interface informa a origem. Alterações manuais posteriores também ficam registradas.

## 8. Entrada e saída da regra mecânica

### Entrada

| Entrada | Regra |
|---|---|
| `difficulty` | número inteiro igual ou maior que 1 |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

### Saída

| Saída | Significado |
|---|---|
| `difficulty` | quantidade final de sucessos exigida |
| `difficultyBand` | faixa descritiva da escala |
| `appliedRuleRevisionId` | revisão usada na validação |

O Rules Engine não recebe Conta, papel ou permissão. Ele valida apenas o valor mecânico.

## 9. Metadados da preparação

O caso de uso registra separadamente:

| Campo | Regra |
|---|---|
| `sourceKind` | `MANUAL` ou `PUBLISHED_RULE` no primeiro alpha |
| `sourceId` | obrigatório quando o valor vier de regra publicada |
| `selectedByAccountId` | pessoa que informou o valor |
| `visibility` | somente `OPEN` no primeiro alpha |

Autorização, papel na Crônica e estado da Sessão são verificados antes da avaliação mecânica. Esses dados ficam no `RollAttempt`, não dentro da regra pura.

## 10. Regras que sempre devem ser verdadeiras

1. A Dificuldade é um número inteiro igual ou maior que 1.
2. Não existe limite máximo artificial.
3. Valor 7 ou maior pertence à faixa “quase impossível”.
4. O número necessário para sucesso em cada dado continua sendo 6 ou mais.
5. Nenhum valor padrão é aplicado sem aparecer na preparação.
6. A origem da Dificuldade permanece registrada pelo caso de uso.
7. A primeira versão aceita somente visibilidade `OPEN` na preparação.
8. A mesma entrada e revisão produzem a mesma saída.
9. A regra valida a Dificuldade, mas não conta sucessos.

## 11. Cenários de teste

| ID | Entrada | Resultado esperado |
|---|---|---|
| `RULE-DIFF-001-T01` | Dificuldade 1 | válida; faixa `EASY` |
| `RULE-DIFF-001-T02` | Dificuldade 3 | válida; faixa `MODERATE` |
| `RULE-DIFF-001-T03` | Dificuldade 6 | válida; faixa `VERY_HARD` |
| `RULE-DIFF-001-T04` | Dificuldade 7 | válida; faixa `NEARLY_IMPOSSIBLE` |
| `RULE-DIFF-001-T05` | Dificuldade 9 | válida; faixa `NEARLY_IMPOSSIBLE` |
| `RULE-DIFF-001-T06` | Dificuldade 0 | `InvalidDifficulty: BELOW_MINIMUM` |
| `RULE-DIFF-001-T07` | Dificuldade -2 | `InvalidDifficulty: BELOW_MINIMUM` |
| `RULE-DIFF-001-T08` | Dificuldade 2,5 | `InvalidDifficulty: NOT_INTEGER` |
| `RULE-DIFF-001-T09` | Dificuldade ausente | `InvalidDifficulty: REQUIRED` |

A comparação entre sucessos e Dificuldade será testada em `RULE-RESULT-001`.

## 12. Cenários de aceitação do produto

| ID | Situação | Resultado esperado |
|---|---|---|
| `REQ-ROLL-DIFFICULTY-001-T01` | nenhuma Dificuldade informada | confirmação permanece bloqueada |
| `REQ-ROLL-DIFFICULTY-001-T02` | jogador prepara a própria rolagem | pode informar uma Dificuldade aberta |
| `REQ-ROLL-DIFFICULTY-001-T03` | Narrador corrige antes da confirmação | novo valor e autoria ficam visíveis |
| `REQ-ROLL-DIFFICULTY-001-T04` | cliente envia `STORYTELLER_HIDDEN` no alpha | comando rejeitado antes da avaliação |

## 13. Responsabilidades

### Jogador

- pode preencher a Dificuldade ao preparar uma rolagem permitida;
- usa o valor informado ou aceito pelo Narrador em uma sessão;
- vê a Dificuldade no primeiro alpha.

### Narrador

- define a Dificuldade autoritativa da ação;
- pode corrigir o valor antes da confirmação;
- decide se uma situação futura usará Dificuldade secreta quando essa função existir.

### Sistema

- exige um valor válido;
- mostra a escala de forma simples;
- registra valor, origem e autoria;
- não inventa uma Dificuldade padrão;
- não revela uma Dificuldade secreta quando essa capacidade for implementada.

## 14. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 117 | autoridade do Narrador e possibilidade de segredo |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 119 | definição, escala e oposição estática |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 120 | modificadores e relação com resultados |
| `SRC-0003` — Companion PT-BR | p. 62 | recomendação opcional de segredo ligada a `Pegar a Metade` |
| `SRC-0004` — Players Guide EN | corpus comparado | nenhuma substituição da regra central encontrada |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0119.md`;
- `SRC-0001/ocr/paginas/pdf-0121.md`;
- `SRC-0001/ocr/paginas/pdf-0122.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0003/nativo/paginas-markdown/pdf-0062.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

As páginas com tabela e a página 62 do Companion também foram conferidas visualmente nos PDFs originais em 8 de outubro de 2026.

## 15. Relação com outras regras

| Assunto | Responsável |
|---|---|
| formação da parada | `RULE-ROLL-001` |
| modificadores | futura `RULE-MOD-001` |
| contagem de sucessos e comparação | `RULE-RESULT-001` |
| vitória automática | futura `RULE-AUTO-001` |
| oposição por disputa | futura `RULE-CONTEST-001` |
| oposição estática calculada | futura ampliação desta regra |
| ordem completa | `RULE-ROLLFLOW-001` |

## 16. Decisões confirmadas

- `RULE-DIFF-001-r1` é o identificador da primeira revisão;
- não haverá Dificuldade padrão silenciosa;
- o primeiro alpha aceitará somente Dificuldade aberta;
- o Narrador mantém a decisão final em uma sessão narrada.

## 17. Checklist

- [x] materiais Markdown consultados;
- [x] páginas normativas registradas;
- [x] tabela conferida visualmente;
- [x] Companion comparado e conferido visualmente;
- [x] Players Guide comparado;
- [x] escala e limites definidos;
- [x] comportamento da interface definido;
- [x] nove cenários mecânicos e quatro cenários de produto registrados;
- [x] regra separada da contagem de sucessos;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 18. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após leitura dos Markdown e cotejo visual | engenharia e revisão de regras |
| 2026-10-08 | identificador e comportamento aprovados | responsável do produto |
