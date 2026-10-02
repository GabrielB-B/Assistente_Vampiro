# Catálogo de Rastreabilidade v0.1

**Status:** rascunho<br>
**Estado da fase:** fontes e comportamentos ainda não confirmados<br>
**Escopo:** primeiro fluxo de rolagem

---

## 1. Objetivo

Manter uma ligação verificável entre necessidades do produto, regras do jogo, fontes, especificações e testes.

Regras normativas (`RULE-*`) e requisitos internos (`REQ-*`) possuem autoridades diferentes e não devem ser tratados como se viessem da mesma origem. Nenhum item sem maturidade aprovada autoriza implementação.

---

## 2. Regras normativas do jogo

| Regra | Recorte | Capacidade | Fonte (`SRC-*`) | Especificação | Cenários (`RULE-*-T*`) | Revisão humana | Maturidade | Implementação |
|---|---|---|---|---|---|---|---|---|
| RULE-ROLL-001 — composição da parada | fatia 01 | Roll Builder | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-HUNGER-001 — participação da Fome | fatia 01 | Roll Builder | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-DIFF-001 — dificuldade | fatia 01 | Roll Builder | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-RESULT-001 — sucessos e falha | fatia 01 | resultado | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-CRIT-001 — crítico | fatia 01 | resultado | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-MESSY-001 — Crítico Sangrento | fatia 01 | resultado | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-BESTIAL-001 — Falha Bestial | fatia 01 | resultado | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-ROLLFLOW-001 — ordem de resolução | fatia 01 | Rules Engine | pendente | pendente | pendente | não | candidata | não iniciada |
| RULE-WILL-001 — reroll com Força de Vontade | incremento seguinte | resultado e decisão | pendente | pendente | pendente | não | candidata | não iniciada |

---

## 3. Requisitos internos do produto

| Requisito | Recorte | Capacidade | Decisão | Especificação | Cenários (`REQ-*-T*`) | Revisão humana | Maturidade | Implementação |
|---|---|---|---|---|---|---|---|---|
| REQ-ROLL-ATTEMPT-001 — persistir tentativa imutável antes da apresentação | fatia 01 | Evento de Sessão | DEC-012, DEC-020 e DEC-021 | pendente | pendente | sim | candidato | não iniciada |
| REQ-TABLE-FEED-001 — projetar resultado autorizado | fatia 01 | Feed da Mesa | DEC-012, DEC-020 e DEC-022 | pendente | pendente | sim | candidato | não iniciada |

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
