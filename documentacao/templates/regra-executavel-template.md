# RULE-AREA-000 — Nome da regra

Substituir `AREA` por um código curto e estável da capacidade, como `ROLL`, `HUNGER` ou `WILL`.

**Maturidade:** candidata<br>
**Implementação:** não iniciada<br>
**Edição:** V5  
**RuleSetId:**<br>
**Categoria:** parada | Fome | dificuldade | resultado | crítico | reroll | dano | composição | outra<br>
**Responsável pela revisão:**

## 1. Proveniência

| Campo | Valor |
|---|---|
| ID da fonte (`source_id`) | SRC-0000 |
| Obra | |
| Versão ou impressão | |
| Idioma | |
| Capítulo | |
| Página | |
| Errata aplicável | |
| Termo original | |
| Termo PT-BR | |

## 2. Intenção da regra

Explique o problema mecânico resolvido pela regra sem copiar desnecessariamente o texto da fonte.

## 3. Entradas

| Entrada | Tipo conceitual | Obrigatória | Restrições |
|---|---|---:|---|
| exemplo | inteiro | sim | maior ou igual a zero |

## 4. Saídas

| Saída | Tipo conceitual | Significado |
|---|---|---|
| exemplo | resultado | interpretação mecânica |

## 5. Invariantes

- invariante 1;
- invariante 2.

## 6. Algoritmo conceitual

Descrever em linguagem independente de framework e linguagem de programação.

```text
entrada
→ validação
→ resolução
→ classificação
→ resultado
```

## 7. Decisões humanas

### Jogador

- decisões permitidas;
- momento da decisão.

### Narrador

- decisões permitidas;
- informações que podem permanecer secretas.

### Sistema

- o que pode ser automatizado;
- o que nunca deve ser decidido automaticamente.

## 8. Exceções e interações

- exceção;
- interação com outra regra;
- precedência entre fontes.

## 9. Cenários determinísticos

Cada cenário fornece as faces ao avaliador. A geração aleatória não faz parte da verificação da regra.

### RULE-AREA-000-T01 — Caminho normal

| Campo | Valor |
|---|---|
| Estado anterior | |
| RuleSetId | |
| Dados normais | quantidade |
| Dados de Fome | quantidade |
| Faces fornecidas | separar normais e Fome |
| Dificuldade | |
| Ação avaliada | |
| Resultado mecânico esperado | |
| Custo aplicado | nenhum ou valor explícito |
| Próximas ações permitidas | |
| Decisão reservada ao Narrador | nenhuma ou decisão explícita |

Cobertura mínima:

- caminho normal;
- limite inferior ou superior relevante;
- entrada inválida ou comportamento não permitido;
- interação crítica com outra regra, quando aplicável.

## 10. Casos de teste candidatos

| ID do cenário | Teste futuro | Estado |
|---|---|---|
| RULE-AREA-000-T01 | nome do teste automatizado | conceitual |

## 11. Dúvidas

- dúvida a confirmar na fonte ou errata.

Se a dúvida puder alterar comportamento, teste ou escopo, registrar um `AMB-*` no [Registro de Ambiguidades](../descoberta-regras/registro-ambiguidades-v0.1.md) e referenciar o ID aqui.

## 12. Dependências

- regra relacionada;
- glossário;
- entidade ou value object candidato.

## 13. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| AAAA-MM-DD | criação | |
