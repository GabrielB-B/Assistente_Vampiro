# RULE-ROLLFLOW-001 — Ordem de resolução do teste básico

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-ROLLFLOW-001-r1`<br>
**Responsável pela revisão:** responsável do produto<br>
**Data de aprovação:** 8 de outubro de 2026

---

## 1. Resumo simples

Esta regra organiza as regras já aprovadas. Ela não cria uma mecânica nova.

```text
formar a parada
→ separar Dados de Fome
→ validar a Dificuldade
→ receber as faces
→ contar pares críticos
→ calcular vitória ou falha
→ classificar Crítico Bestial ou Falha Bestial
→ devolver um resultado explicável
```

O Rules Engine executa somente o cálculo. Autorização, sorteio, persistência, Feed e consequências narrativas permanecem fora dele.

## 2. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` — Livro Básico V5 PT-BR |
| páginas do teste básico | 118–123 |
| páginas dos Dados de Fome | 205–208 |
| Força de Vontade relacionada | 122 e 158 |
| atualização aplicada | `SRC-0003`, Companion, p. 62 |
| Players Guide | comparado por unidade; nenhuma substituição do fluxo básico encontrada |
| cotejo visual | concluído em 8 de outubro de 2026 |

A ordem abaixo também depende das sete especificações aprovadas da fatia 01. Cada uma mantém sua própria proveniência e seus cenários.

## 3. Limites de responsabilidade

### Aplicação

A aplicação:

- autentica e autoriza a pessoa;
- carrega o estado permitido do Personagem e da Sessão;
- resolve a revisão fechada do perfil;
- solicita as faces ao adaptador de dados;
- chama o Rules Engine;
- persiste tentativa, evento e outbox;
- publica somente a projeção autorizada;
- coleta decisões do Narrador.

### Rules Engine

O Rules Engine:

- recebe dados já autorizados;
- executa as regras na ordem definida;
- rejeita entradas inconsistentes;
- devolve cálculo, classificação, explicação e revisões aplicadas;
- não acessa banco, rede, PDF, IA ou interface.

### Adaptador de dados

O adaptador gera as faces. Ele não conta sucessos e não interpreta resultados.

## 4. Fase A — Preparação

### 4.1 Formação da parada

`RULE-ROLL-001` recebe os componentes autorizados e produz o tamanho da parada preparada.

### 4.2 Participação da Fome

`RULE-HUNGER-001` preserva o total e informa quantos dados são normais e quantos são Dados de Fome.

### 4.3 Dificuldade

`RULE-DIFF-001` valida a quantidade de sucessos necessária. No primeiro alpha, a Dificuldade é aberta.

### 4.4 Confirmação

A interface mostra a composição, a Fome e a Dificuldade antes da confirmação. Nenhuma face é gerada nessa prévia.

## 5. Fase B — Obtenção das faces

Depois da confirmação, a aplicação solicita exatamente:

```text
normalDiceCount faces normais
hungerDiceCount faces de Fome
```

Antes da avaliação, o sistema verifica:

- cada face é um inteiro entre 1 e 10;
- a quantidade total coincide com a parada;
- a quantidade de faces de Fome coincide com a alocação;
- nenhuma face pertence aos dois grupos.

Uma inconsistência encerra o fluxo com erro explícito. O motor não tenta corrigir ou completar faces.

## 6. Fase C — Avaliação mecânica

### 6.1 Críticos

`RULE-CRIT-001` conta todos os resultados 10, forma os pares e calcula o bônus crítico.

### 6.2 Resultado

`RULE-RESULT-001`:

- conta resultados de 6 a 10 como sucessos básicos;
- acrescenta o bônus crítico;
- compara o total com a Dificuldade;
- calcula margem, Falha Total e elegibilidade para Vencer a um Custo;
- identifica uma vitória crítica.

### 6.3 Resultado especial

As classificações partem do resultado já calculado:

```text
se venceu criticamente e existe 10 de Fome
→ RULE-MESSY-001

se falhou e existe 1 de Fome
→ RULE-BESTIAL-001
```

Crítico Bestial e Falha Bestial não podem ocorrer juntos na mesma tentativa: um exige vitória e o outro exige falha.

Falha Total e Falha Bestial podem coexistir.

## 7. Fase D — Resultado estruturado

O motor devolve um objeto que permite explicar:

- como a parada foi formada;
- quantos dados eram normais e de Fome;
- quais faces foram avaliadas;
- quantos sucessos básicos foram obtidos;
- quantos pares e sucessos de bônus existiram;
- qual Dificuldade foi usada;
- se houve vitória, falha ou Falha Total;
- qual foi a margem, quando aplicável;
- se houve Crítico Bestial ou Falha Bestial;
- quais decisões ainda pertencem ao Narrador;
- quais revisões de regra produziram o resultado.

Texto de interface não é a fonte de verdade. A apresentação traduz os dados estruturados para uma explicação humana.

## 8. Fase E — Persistência e publicação

Esta fase pertence à aplicação, não ao Rules Engine:

```text
resultado mecânico
→ persistir RollAttempt + SessionEvent + outbox na mesma transação
→ confirmar a transação
→ apresentar o resultado e liberar a outbox confirmada
→ relay publica a projeção autorizada no Feed
```

A resposta da aplicação e o relay podem avançar de forma independente depois do commit. A garantia necessária é que nenhum dos dois observe um fato ainda não confirmado.

Regras obrigatórias:

1. `RollAttempt` é imutável depois da confirmação.
2. `SessionEvent` referencia a tentativa; não duplica sua função.
3. A outbox é confirmada na mesma transação.
4. Nenhum resultado é publicado antes do commit.
5. Retry com a mesma chave de idempotência não cria outra tentativa.
6. O Feed recebe somente os campos permitidos para seu público.

## 9. Consequências narrativas

O motor pode devolver uma decisão pendente para Crítico Bestial ou Falha Bestial. Ele não escolhe Compulsão, Mácula, dano, perda ou qualquer outra consequência.

No alpha sem rerrolagem, a tentativa termina após a avaliação e a decisão pode seguir para o Narrador.

Quando `RULE-WILL-001` for implementada, a consequência aguardará o encerramento da janela de rerrolagem.

## 10. Extensão reservada para Força de Vontade

A rerrolagem não será adicionada como condição escondida dentro do avaliador. O fluxo futuro será:

```text
persistir e apresentar tentativa inicial
→ verificar elegibilidade
→ jogador decide gastar ou encerrar
→ selecionar de 1 a 3 dados normais
→ marcar 1 dano Superficial de Força de Vontade
→ gerar apenas as faces substitutas
→ criar nova tentativa ligada à anterior
→ executar novamente toda a avaliação
→ encerrar ou oferecer nova decisão somente se a regra permitir
```

Dados de Fome e dados normais não selecionados mantêm suas faces. Nenhuma tentativa anterior é alterada.

A quantidade de usos permitida sobre a mesma cadeia e o fechamento exato da janela serão formalizados em `RULE-WILL-001` antes do MVP de playtest.

## 11. Entrada conceitual

```ts
type EvaluateBasicTestInput = {
  ruleSetProfileRevisionId: RuleSetProfileRevisionId;
  evaluatorRevision: EvaluatorRevision;
  pool: {
    components: readonly PoolComponent[];
    totalDice: number;
    hungerDice: number;
  };
  difficulty: number;
  faces: {
    normal: readonly D10Face[];
    hunger: readonly D10Face[];
  };
};
```

O contrato é conceitual. A prova técnica e a Architecture v0.1 já foram concluídas; os nomes de código definitivos serão congelados durante a Engineering Foundation, sem alterar a linguagem aprovada do domínio.

## 12. Saída conceitual

```ts
type BasicTestResult = {
  pool: PoolExplanation;
  dice: DiceSummary;
  successes: SuccessSummary;
  difficulty: number;
  margin: number | null;
  outcome: 'VICTORY' | 'FAILURE';
  isTotalFailure: boolean;
  isCriticalVictory: boolean;
  specialResult: 'MESSY_CRITICAL' | 'BESTIAL_FAILURE' | 'NONE';
  winAtCostEligible: boolean;
  narratorDecisions: readonly NarratorDecision[];
  appliedRuleRevisions: readonly RuleRevisionId[];
  evaluatorRevision: EvaluatorRevision;
};
```

O resultado não contém consequência narrativa já escolhida nem mensagem pronta de interface.

## 13. Ordem das revisões aplicadas

Uma avaliação bem-sucedida registra:

1. `RULE-ROLL-001-r1`;
2. `RULE-HUNGER-001-r1`;
3. `RULE-DIFF-001-r1`;
4. `RULE-CRIT-001-r1`;
5. `RULE-RESULT-001-r1`;
6. `RULE-MESSY-001-r1`;
7. `RULE-BESTIAL-001-r1`;
8. `RULE-ROLLFLOW-001-r1`.

Registrar uma revisão não significa que ela produziu uma classificação especial. Significa que participou da avaliação.

## 14. Regras que sempre devem ser verdadeiras

1. Todas as etapas usam a mesma revisão imutável do perfil.
2. A origem normal ou de Fome de uma face nunca é perdida.
3. O bônus crítico é somado exatamente uma vez.
4. Classificações especiais usam o resultado final da tentativa avaliada.
5. Crítico Bestial exige vitória crítica; Falha Bestial exige falha.
6. Falha Total e Falha Bestial permanecem campos independentes.
7. Uma etapa inválida impede a produção de resultado parcial tratável como sucesso.
8. O motor não realiza I/O nem escolhe consequência narrativa.
9. Persistência e publicação acontecem fora do motor.
10. A mesma entrada, faces e revisões sempre produzem a mesma saída.

## 15. Cenários de composição

| ID | Faces finais e Dificuldade | Resultado esperado |
|---|---|---|
| `RULE-ROLLFLOW-001-T01` | normais 7, 6, 2; Fome —; Dif. 2 | vitória; 2 sucessos; margem 0; sem especial |
| `RULE-ROLLFLOW-001-T02` | normais 7, 2, 2; Fome —; Dif. 2 | falha; 1 sucesso; custo elegível |
| `RULE-ROLLFLOW-001-T03` | normais 5, 2, 1; Fome —; Dif. 1 | Falha Total; sem especial |
| `RULE-ROLLFLOW-001-T04` | normais 10, 10, 2; Fome —; Dif. 3 | vitória crítica; 4 sucessos; margem 1 |
| `RULE-ROLLFLOW-001-T05` | normais 10, 2; Fome 10; Dif. 4 | Crítico Bestial; 4 sucessos; margem 0 |
| `RULE-ROLLFLOW-001-T06` | normais 6, 2; Fome 1; Dif. 2 | Falha Bestial; 1 sucesso; custo elegível |
| `RULE-ROLLFLOW-001-T07` | normais 2; Fome 1; Dif. 1 | Falha Total e Falha Bestial |
| `RULE-ROLLFLOW-001-T08` | normais 6; Fome 1; Dif. 1 | vitória; nunca Falha Bestial |
| `RULE-ROLLFLOW-001-T09` | normais 6; Fome 10; Dif. 2 | vitória comum; um 10 sem par não é Crítico Bestial |
| `RULE-ROLLFLOW-001-T10` | normais 10; Fome 10, 1; Dif. 5 | 4 sucessos; falha; Falha Bestial; nunca Crítico Bestial |
| `RULE-ROLLFLOW-001-T11` | parada 3; somente 2 faces recebidas | `DiceCountMismatch`; nada persistido |
| `RULE-ROLLFLOW-001-T12` | repetir T05 com as mesmas revisões | saída mecânica idêntica |

Os testes de aplicação provarão transação, idempotência, autorização e projeção no Feed separadamente.

## 16. Erros do fluxo

| Erro | Momento |
|---|---|
| `UnsupportedRuleSetProfile` | resolução do perfil |
| `InvalidPoolComposition` | formação da parada |
| `InvalidHungerAllocation` | separação dos Dados de Fome |
| `InvalidDifficulty` | validação da Dificuldade |
| `InvalidDiceFace` | validação das faces |
| `DiceCountMismatch` | comparação entre parada e faces |
| `InvalidCriticalSummary` | composição entre crítico e resultado |
| `InvalidSpecialResultInput` | composição das classificações especiais |
| `RuleRevisionUnavailable` | carregamento de uma revisão exigida |

Erros de autorização, persistência e publicação pertencem às camadas responsáveis e não são convertidos em resultado mecânico.

## 17. Referências consultadas

### Fontes normativas

| Fonte | Referência | Uso |
|---|---|---|
| `SRC-0001` — Livro Básico V5 PT-BR | p. 118–123 | parada, Dificuldade, sucessos, crítico, margem e falha |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 158 | gasto de Força de Vontade |
| `SRC-0001` — Livro Básico V5 PT-BR | p. 205–208 | Dados de Fome e resultados bestiais |
| `SRC-0003` — Companion PT-BR | p. 62 | Compulsões derivadas de Críticos Bestiais |
| `SRC-0004` — Players Guide EN | delta normativo | precedência e ausência de substituição do fluxo básico |

### Materiais Markdown usados para leitura

- `SRC-0001/ocr/paginas/pdf-0120.md` a `pdf-0125.md`;
- `SRC-0001/ocr/paginas/pdf-0160.md`;
- `SRC-0001/ocr/paginas/pdf-0207.md` a `pdf-0210.md`;
- `SRC-0001/estruturado/regras/inventario-mecanicas-v0.1.md`;
- `SRC-0001/estruturado/glossario/glossario-ptbr-v0.1.md`;
- `SRC-0003/nativo/paginas-markdown/pdf-0062.md`;
- `SRC-0004/estruturado/regras/delta-core-companion-players-guide-v0.1.md`.

## 18. Decisões confirmadas

- `RULE-ROLLFLOW-001-r1` é o identificador da primeira revisão;
- a ordem mecânica das oito regras está aprovada;
- sorteio, persistência e publicação permanecem fora do Rules Engine;
- todas as revisões que participaram do cálculo são registradas;
- a tentativa termina imediatamente no alpha, que ainda não oferece rerrolagem;
- a janela de Força de Vontade será um fluxo externo de nova tentativa;
- consequências narrativas são resolvidas somente após o encerramento dessa janela.

## 19. Dependências

- [RULE-ROLL-001 — Formação da parada](./rule-roll-001-composicao-parada.md);
- [RULE-HUNGER-001 — Dados de Fome](./rule-hunger-001-participacao-dados-fome.md);
- [RULE-DIFF-001 — Dificuldade](./rule-diff-001-definicao-dificuldade.md);
- [RULE-CRIT-001 — Críticos](./rule-crit-001-contagem-criticos.md);
- [RULE-RESULT-001 — Resultado](./rule-result-001-resolucao-resultado.md);
- [RULE-MESSY-001 — Crítico Bestial](./rule-messy-001-critico-bestial.md);
- [RULE-BESTIAL-001 — Falha Bestial](./rule-bestial-001-falha-bestial.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Modelo de Domínio v0.1](../../../04-arquitetura/dominio/modelo-dominio-v0.1.md);
- [ADR-0002 — Persistência, eventos e realtime](../../../00-governanca/adr/0002-persistencia-eventos-e-realtime.md).

## 20. Checklist

- [x] sete regras anteriores aprovadas;
- [x] ordem mecânica definida;
- [x] fronteiras entre motor e aplicação definidas;
- [x] sorteio mantido fora do avaliador;
- [x] persistência e Feed posicionados;
- [x] extensão de Força de Vontade reservada;
- [x] decisões narrativas separadas;
- [x] doze cenários de composição registrados;
- [x] erros por etapa definidos;
- [x] identificador confirmado;
- [x] revisão humana concluída.

## 21. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação composta após aprovação das sete regras anteriores | engenharia e revisão de regras |
| 2026-10-08 | ordem completa, fronteiras e extensão futura aprovadas | responsável do produto |
