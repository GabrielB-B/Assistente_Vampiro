# Especificações da Fatia 01

**Estado:** aprovada<br>
**Objetivo:** documentar o teste básico completo antes da implementação

Esta pasta contém apenas regras da primeira fatia executável. Cada arquivo possui proveniência, entradas, saídas, invariantes e cenários determinísticos próprios.

## Ordem de revisão

| Ordem | Especificação | Estado |
|---:|---|---|
| 1 | [RULE-ROLL-001 — Formação da parada de dados](./rule-roll-001-composicao-parada.md) | aprovada |
| 2 | [RULE-HUNGER-001 — Dados de Fome na rolagem](./rule-hunger-001-participacao-dados-fome.md) | aprovada |
| 3 | [RULE-DIFF-001 — Definição da Dificuldade](./rule-diff-001-definicao-dificuldade.md) | aprovada |
| 4 | [RULE-CRIT-001 — Contagem de críticos](./rule-crit-001-contagem-criticos.md) | aprovada |
| 5 | [RULE-RESULT-001 — Sucessos, falha e margem](./rule-result-001-resolucao-resultado.md) | aprovada |
| 6 | [RULE-MESSY-001 — Crítico Bestial](./rule-messy-001-critico-bestial.md) | aprovada |
| 7 | [RULE-BESTIAL-001 — Falha Bestial](./rule-bestial-001-falha-bestial.md) | aprovada |
| 8 | [RULE-ROLLFLOW-001 — Ordem de resolução](./rule-rollflow-001-ordem-resolucao.md) | aprovada |

Uma regra só passa a `aprovada` depois de cotejo visual da fonte, comparação de precedência, cenários suficientes e revisão humana. Aprovar uma regra não autoriza código de produção antes do gate da Architecture v0.1.

`RULE-CRIT-001` precede `RULE-RESULT-001` porque o bônus dos pares de resultados 10 entra no total antes da comparação com a Dificuldade.

## Incremento seguinte reservado

`RULE-WILL-001` documentará a rerrolagem de até três dados normais mediante gasto de Força de Vontade. Ela não será escondida dentro da regra de resultado: uma rerrolagem produzirá uma nova tentativa vinculada, que será avaliada novamente pelas mesmas regras.

## Resultado do gate

As oito especificações da Fatia 01 foram aprovadas em 8 de outubro de 2026. A prova de persistência, as ADRs e a Architecture v0.1 também foram concluídas; a implementação está liberada dentro dos limites da Engineering Foundation e do Vertical Slice 01.
