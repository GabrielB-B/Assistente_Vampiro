# RULE-HUNGER-001 — Dados de Fome na rolagem

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-HUNGER-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

A Fome não aumenta nem diminui a parada. Ela substitui dados normais por Dados de Fome.

```text
parada preparada: 6 dados
Fome atual: 2
rolagem: 4 dados normais + 2 Dados de Fome
```

Se a Fome for maior que a parada, todos os dados serão de Fome:

```text
parada preparada: 3 dados
Fome atual: 5
rolagem: 3 Dados de Fome
```

O total continua sendo 3. A Fome nunca cria dados adicionais.

## 2. Por que os Dados de Fome precisam ficar separados

Dados normais e Dados de Fome usam a mesma escala de sucesso: resultados de 6 a 10 contam como sucesso.

A diferença aparece em duas situações:

- um resultado 10 em Dado de Fome pode transformar uma vitória crítica em `Crítico Bestial`;
- um resultado 1 em Dado de Fome pode transformar uma rolagem fracassada em `Falha Bestial`.

Essas consequências dependem do resultado completo:

- um 10 isolado em Dado de Fome é apenas um sucesso;
- um resultado 1 em Dado de Fome não causa Falha Bestial se a rolagem venceu;
- os Dados de Fome não podem ser rerrolados com Força de Vontade.

Por isso, o sistema nunca pode guardar apenas uma lista de números. Cada face precisa continuar marcada como normal ou de Fome.

## 3. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| idioma | PT-BR oficial da edição disponível |
| capítulo | Vampiros — Fome, Dados de Fome, Crítico Bestial e Falha Bestial |
| páginas impressas | 205–207 |
| páginas do PDF | 207–209 |
| cotejo visual | concluído em 8 de outubro de 2026 |
| errata aplicável | nenhuma catalogada no corpus atual |
| fontes comparadas | `SRC-0003` e `SRC-0004` |
| atualização encontrada | nenhuma alteração da substituição básica |

As páginas foram conferidas visualmente no original. O texto abaixo é uma especificação própria e não uma reprodução do livro.

## 4. Regra de substituição

Quando a Fome participa da rolagem:

```text
Dados de Fome = menor valor entre Fome atual e tamanho da parada
Dados normais = tamanho da parada - Dados de Fome
```

Exemplos rápidos:

| Parada | Fome | Dados normais | Dados de Fome |
|---:|---:|---:|---:|
| 6 | 2 | 4 | 2 |
| 3 | 5 | 0 | 3 |
| 5 | 0 | 5 | 0 |
| 1 | 1 | 0 | 1 |

## 5. Quando a Fome não participa

O Livro Básico não inclui Dados de Fome em:

- Checagens de Sangue;
- rolagens de Força de Vontade;
- rolagens de Humanidade.

Essas exclusões precisam ser explícitas. O sistema não deve depender de um campo genérico como “ignorar Fome”. O motivo deve ser um dos três casos publicados.

Personagens que não usam Fome, como mortais comuns, serão tratados por outro perfil. Eles não entram nesta revisão.

## 6. Como isso aparece na tela

O Roll Builder deve mostrar:

- o total da parada;
- a Fome atual do personagem;
- quantos dados são normais;
- quantos são Dados de Fome;
- qualquer exclusão aplicada e seu motivo.

A Fome vem do estado atual da ficha. Ela não deve ser alterada livremente dentro da janela de rolagem. Se estiver incorreta, o jogador ou o Narrador precisa corrigir o estado do personagem pelo fluxo apropriado antes de confirmar.

Na animação, os dois tipos de dado precisam ser fáceis de distinguir. Essa diferença também deve existir nos dados persistidos, não apenas na cor exibida.

## 7. Responsabilidades

### Jogador

- confere a Fome mostrada antes de confirmar;
- não escolhe quantos Dados de Fome serão usados;
- pode cancelar a preparação se encontrar uma divergência.

### Narrador

- escolhe o tipo de teste;
- pode corrigir a preparação antes da confirmação;
- não remove Dados de Fome de um teste comum por conveniência.

### Sistema

- lê a Fome autorizada da ficha;
- aplica a substituição automaticamente;
- mantém dados normais e de Fome separados;
- impede uma combinação inválida;
- não decide a consequência narrativa de um resultado bestial.

## 8. Entradas

| Entrada | Regra |
|---|---|
| `preparedPoolSize` | inteiro igual ou maior que 1, depois de Especializações e modificadores |
| `hungerLevel` | inteiro entre 0 e 5 |
| `participationPolicy` | `APPLIES` ou `EXCLUDED` |
| `exclusionReason` | obrigatório quando excluída: `ROUSE_CHECK`, `WILLPOWER` ou `HUMANITY` |
| `ruleSetProfileRevisionId` | revisão imutável do perfil |

A regra recebe valores prontos. Na primeira fatia, sem modificadores, `preparedPoolSize` será igual à parada produzida por `RULE-ROLL-001`. A regra não acessa banco, ficha, PDF ou interface.

## 9. Saídas

| Saída | Significado |
|---|---|
| `totalDice` | total preservado da parada |
| `normalDiceCount` | quantidade de dados normais |
| `hungerDiceCount` | quantidade de Dados de Fome |
| `hungerParticipation` | informa se a Fome foi aplicada ou excluída |
| `exclusionReason` | motivo da exclusão, quando houver |
| `appliedRuleRevisionId` | revisão da regra usada no cálculo |

## 10. Regras que sempre devem ser verdadeiras

1. Dados normais mais Dados de Fome são sempre iguais ao total da parada.
2. A substituição não altera o total de dados.
3. A quantidade de Dados de Fome não passa da Fome atual.
4. A quantidade de Dados de Fome não passa do tamanho da parada.
5. Fome zero produz zero Dados de Fome.
6. Uma exclusão exige um motivo publicado.
7. A mesma entrada sempre produz a mesma saída.
8. Nenhuma face é rolada ou interpretada nesta etapa.

## 11. Cenários de teste

| ID | Entrada | Resultado esperado |
|---|---|---|
| `RULE-HUNGER-001-T01` | parada 6; Fome 2 | 4 normais e 2 de Fome |
| `RULE-HUNGER-001-T02` | parada 3; Fome 5 | 0 normais e 3 de Fome |
| `RULE-HUNGER-001-T03` | parada 5; Fome 0 | 5 normais e 0 de Fome |
| `RULE-HUNGER-001-T04` | parada 1; Fome 1 | 0 normais e 1 de Fome |
| `RULE-HUNGER-001-T05` | parada 4; Fome 3; Humanidade | 4 normais e exclusão `HUMANITY` |
| `RULE-HUNGER-001-T06` | parada 1; Fome 5; Checagem de Sangue | 1 normal e exclusão `ROUSE_CHECK` |
| `RULE-HUNGER-001-T07` | parada 5; Fome 2; Força de Vontade | 5 normais e exclusão `WILLPOWER` |
| `RULE-HUNGER-001-T08` | Fome -1 | `InvalidHungerAllocation: HUNGER_OUT_OF_RANGE` |
| `RULE-HUNGER-001-T09` | Fome 6 | `InvalidHungerAllocation: HUNGER_OUT_OF_RANGE` |
| `RULE-HUNGER-001-T10` | exclusão sem motivo | `InvalidHungerAllocation: EXCLUSION_REASON_REQUIRED` |
| `RULE-HUNGER-001-T11` | parada 0 | `InvalidHungerAllocation: BASE_POOL_OUT_OF_RANGE` |

As faces não aparecem nesses cenários porque esta regra termina antes da rolagem.

## 12. O que fica para outras regras

| Assunto | Responsável |
|---|---|
| formar o total da parada | `RULE-ROLL-001` |
| contar sucessos | `RULE-RESULT-001` |
| calcular críticos | `RULE-CRIT-001` |
| identificar Crítico Bestial | `RULE-MESSY-001` |
| identificar Falha Bestial | `RULE-BESTIAL-001` |
| rerrolar dados comuns com Força de Vontade | futura `RULE-WILL-001` |
| aumentar ou reduzir Fome | regras de Checagem de Sangue e alimentação |

## 13. Implicações para o domínio

| Item | Decisão inicial |
|---|---|
| valores candidatos | `HungerLevel`, `DiceAllocation`, `HungerParticipationPolicy` |
| responsável pelo cálculo | Rules Engine puro |
| persistência | `RollAttempt` guarda Fome, dados normais e Dados de Fome usados |
| evento próprio | nenhum nesta etapa |
| auditoria operacional | não se aplica ao cálculo puro |
| visibilidade | definida fora desta regra |

## 14. Decisões confirmadas

- `RULE-HUNGER-001-r1` é o identificador da primeira revisão;
- a Fome usada vem do estado autorizado da ficha;
- a Fome não pode ser editada livremente dentro do Roll Builder;
- correções usam o fluxo próprio do estado do personagem antes da confirmação.

## 15. Dependências

- [RULE-ROLL-001 — Formação da parada de dados](./rule-roll-001-composicao-parada.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md);
- [Linha Normativa v0.1](../../linha-normativa-v0.1.md).

## 16. Checklist

- [x] fonte e páginas registradas;
- [x] páginas conferidas visualmente;
- [x] Companion e Players Guide pesquisados;
- [x] regra explicada em linguagem simples;
- [x] entradas, saídas e limites definidos;
- [x] três exclusões cobertas;
- [x] onze cenários registrados;
- [x] responsabilidades da interface definidas;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 17. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após cotejo visual | engenharia e revisão de regras |
| 2026-10-08 | texto simplificado e comportamento da interface esclarecido | engenharia e revisão de regras |
| 2026-10-08 | identificador e comportamento aprovados | responsável do produto |
