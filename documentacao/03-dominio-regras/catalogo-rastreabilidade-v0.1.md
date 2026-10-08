# Catálogo de Rastreabilidade v0.1

**Status:** rascunho<br>
**Estado da fase:** fontes confirmadas; oito especificações e cenários da Fatia 01 aprovados<br>
**Escopo:** primeiro fluxo de rolagem

---

## 1. Objetivo

Manter uma ligação verificável entre necessidades do produto, regras do jogo, fontes, especificações e testes.

Regras normativas (`RULE-*`) e requisitos internos (`REQ-*`) possuem autoridades diferentes e não devem ser tratados como se viessem da mesma origem. Nenhum item sem maturidade aprovada autoriza implementação.

---

## 2. Regras normativas do jogo

| Regra | Recorte | Capacidade | Fonte (`SRC-*`) | Especificação | Cenários (`RULE-*-T*`) | Revisão humana | Maturidade | Implementação |
|---|---|---|---|---|---|---|---|---|
| RULE-ROLL-001 — formação da parada | fatia 01 | Roll Builder | SRC-0001, p. 117–123; 205–208 | [especificação](./especificacoes/fatia-01/rule-roll-001-composicao-parada.md) | T01–T08 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-HUNGER-001 — Dados de Fome na rolagem | fatia 01 | Roll Builder | SRC-0001, p. 205–207 | [especificação](./especificacoes/fatia-01/rule-hunger-001-participacao-dados-fome.md) | T01–T11 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-DIFF-001 — definição da Dificuldade | fatia 01 | Roll Builder | SRC-0001, p. 117, 119–120; SRC-0003, p. 62 | [especificação](./especificacoes/fatia-01/rule-diff-001-definicao-dificuldade.md) | T01–T09 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-CRIT-001 — contagem de críticos | fatia 01 | resultado | SRC-0001, p. 120–122 | [especificação](./especificacoes/fatia-01/rule-crit-001-contagem-criticos.md) | T01–T09 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-RESULT-001 — sucessos e falha | fatia 01 | resultado | SRC-0001, p. 118, 120–122, 207 | [especificação](./especificacoes/fatia-01/rule-result-001-resolucao-resultado.md) | T01–T09 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-MESSY-001 — Crítico Bestial | fatia 01 | resultado | SRC-0001, p. 207; SRC-0003, p. 62 | [especificação](./especificacoes/fatia-01/rule-messy-001-critico-bestial.md) | T01–T09 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-BESTIAL-001 — Falha Bestial | fatia 01 | resultado | SRC-0001, p. 121–122, 205–208 | [especificação](./especificacoes/fatia-01/rule-bestial-001-falha-bestial.md) | T01–T09 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-ROLLFLOW-001 — ordem de resolução | fatia 01 | Rules Engine | SRC-0001, p. 118–123, 158, 205–208; SRC-0003, p. 62 | [especificação](./especificacoes/fatia-01/rule-rollflow-001-ordem-resolucao.md) | T01–T12 | concluída em 2026-10-08 | aprovada | não iniciada |
| RULE-WILL-001 — rerrolagem com Força de Vontade | incremento seguinte | resultado e decisão | SRC-0001, p. 122, 158 | pendente | pendente | não | candidata; prevista antes do MVP de playtest | não iniciada |

---

## 3. Requisitos internos do produto

| Requisito | Recorte | Capacidade | Decisão | Especificação | Cenários (`REQ-*-T*`) | Revisão humana | Maturidade | Implementação |
|---|---|---|---|---|---|---|---|---|
| REQ-ROLL-ATTEMPT-001 — persistir tentativa imutável antes da apresentação | fatia 01 | persistência de rolagem | DEC-012, DEC-020 e DEC-021 | pendente | pendente | sim | candidato | não iniciada |
| REQ-TABLE-FEED-001 — projetar resultado autorizado | fatia 01 | Feed da Mesa | DEC-012, DEC-020 e DEC-022 | pendente | pendente | sim | candidato | não iniciada |
| REQ-ROLL-DIFFICULTY-001 — selecionar e confirmar Dificuldade | fatia 01 | Roll Builder | DEC-041 e DEC-043 | [comportamento inicial](./especificacoes/fatia-01/rule-diff-001-definicao-dificuldade.md) | T01–T04 | concluída em 2026-10-08 | aprovada | não iniciada |

---

## 4. Cobertura esperada

| Dimensão | Pergunta |
|---|---|
| Proveniência | A autoridade é uma fonte `SRC-*` ou uma decisão `DEC-*`? |
| Fonte normativa | Para `RULE-*`, de qual edição, versão, capítulo e página vem? |
| Intenção | Qual decisão mecânica ou de produto o item resolve? |
| Entrada | Quais dados são necessários? |
| Invariante | O que nunca pode acontecer? |
| Autoridade | O que cabe ao jogador, Narrador ou sistema? |
| Exceção | Que regra ou decisão altera o comportamento? |
| Teste | Como provar o comportamento sem interface? |
| Registro de domínio | O que precisa ser persistido ou emitido como Evento de Sessão? |
| Auditoria operacional | Existe ação sensível a auditar? `Não aplicável` é uma resposta válida. |

---

## 5. Gate para implementação

Uma regra `RULE-*` só pode mudar para `aprovada` quando possuir:

- fonte confirmada;
- especificação revisada;
- termos confirmados ou conscientemente provisórios;
- ao menos um caso normal, um limite e uma exceção aplicável;
- implicações de domínio registradas;
- revisão humana indicada no catálogo.

Um requisito `REQ-*` só pode mudar para `aprovado` quando possuir decisão aceita, critérios de aceitação, cenários e implicações de autorização registradas.

Somente regras e requisitos aprovados podem entrar no planejamento de implementação.
