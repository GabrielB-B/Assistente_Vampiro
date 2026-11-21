# RULE-CREATION-ATTRIBUTES-001 — Atributos iniciais V5

**Revisão:** `RULE-CREATION-ATTRIBUTES-001-r1`  
**Perfil:** `v5-core-companion-pg-2023-r1`  
**Estado:** formalizada para implementação

## Fontes

- Autoridade central: `SRC-0001`, Livro Básico, p. 136 e 144; definições e derivados nas p. 155–158.
- Republicação de maior precedência na mesma unidade: `SRC-0004`, Players Guide 2023, p. 64.
- Verificação de tipos adicionais: `SRC-0003`, Companion, p. 53, que aplica a mesma distribuição a carniçais; p. 45–46 para mortais.

## Paráfrase mecânica

Os nove Atributos começam com valor mínimo 1. Ao concluir a etapa, a distribuição exata deve conter:

| Valor | Quantidade de Atributos |
|---:|---:|
| 4 | 1 |
| 3 | 3 |
| 2 | 4 |
| 1 | 1 |

Nenhum Atributo pode ficar abaixo de 1 ou acima de 4 durante esta etapa de criação. As categorias Físicos, Sociais e Mentais organizam a ficha, mas não possuem suborçamentos independentes.

A escala estrutural da ficha possui cinco posições (`structuralMaximum = 5`). O limite `maximum = 4` pertence somente à distribuição inicial: a quinta posição deve permanecer visível na interface como parte da escala do Atributo, mas indisponível para seleção durante esta etapa.

## Identificadores canônicos

- Físicos: `attribute:strength`, `attribute:dexterity`, `attribute:stamina`.
- Sociais: `attribute:charisma`, `attribute:manipulation`, `attribute:composure`.
- Mentais: `attribute:intelligence`, `attribute:wits`, `attribute:resolve`.

## Entradas

- revisão do perfil;
- contexto de validação;
- mapa dos nove identificadores para valores inteiros;
- alteração pretendida, quando a avaliação ocorrer incrementalmente.

## Saída

- valores normalizados;
- contagem por valor;
- quantidade de incrementos acima da base: 13 no estado completo;
- Vitalidade derivada de Vigor;
- Força de Vontade derivada de Autocontrole e Determinação;
- estado `incomplete` ou `complete`;
- violações estruturadas com código e caminho.

## Regras por contexto

### `CREATION_STEP`

Aceita uma distribuição parcial. Bloqueia imediatamente:

- identificador desconhecido ou ausente da estrutura da etapa;
- valor não inteiro ou fora de 1–4;
- mais de um Atributo em 4;
- mais de três Atributos em 3;
- mais de quatro Atributos em 2;
- consumo superior aos 13 incrementos disponíveis.

Não exige a contagem final enquanto o jogador ainda estiver distribuindo.

### `CREATION_FINALIZATION`

Exige exatamente a distribuição completa da tabela. Uma configuração parcial bloqueia `draft → ready`.

### `ONGOING_EDIT`

Esta regra de orçamento inicial não é reaplicada. Permanecem apenas os limites definidos pela regra vigente de progressão, que está fora deste documento.

### `CHRONICLE_BINDING`

Não altera a distribuição inicial. Restrições futuras de campanha devem ser avaliadas por outra política.

## Derivados

- `healthMax = stamina + 3`.
- `willpowerMax = composure + resolve`.

Os derivados devem ser calculados pela regra; não são um segundo saldo editável.

## Estágio e experiência

As categorias de idade/estágio confirmadas no corpus não substituem esta distribuição. Seus efeitos entram depois, por pacote de Geração, Potência do Sangue, Vantagens/Defeitos, Humanidade e XP. Gastar XP inicial pode elevar Atributos segundo custos de progressão, mas isso é uma operação posterior à distribuição-base e não deve ser misturada ao saldo desta etapa.

## Cenários de teste

| ID | Cenário | Resultado esperado |
|---|---|---|
| RULE-CREATION-ATTRIBUTES-001-T01 | 1×4, 3×3, 4×2 e 1×1 | completa, sem violações |
| RULE-CREATION-ATTRIBUTES-001-T02 | todos em 1 | incompleta em `CREATION_STEP` |
| RULE-CREATION-ATTRIBUTES-001-T03 | dois valores 4 | bloqueio por cota de valor |
| RULE-CREATION-ATTRIBUTES-001-T04 | valor 0 ou 5 | bloqueio por faixa |
| RULE-CREATION-ATTRIBUTES-001-T05 | distribuição parcial em finalização | bloqueio por distribuição incompleta |
| RULE-CREATION-ATTRIBUTES-001-T06 | Vigor 3 | Vitalidade 6 |
| RULE-CREATION-ATTRIBUTES-001-T07 | Autocontrole 3 e Determinação 2 | Força de Vontade 5 |
| RULE-CREATION-ATTRIBUTES-001-T08 | mesma base para ancilla | distribuição-base idêntica; XP separado |

## Não decisões

Este documento não formaliza compra com XP, efeitos temporários, perda de Atributo nem limites de progressão após a criação.
