# Rules Engine Scope v0.1

**Status:** aprovado<br>
**Data:** 8 de outubro de 2026<br>
**Data de aprovação:** 8 de outubro de 2026<br>
**Escopo:** teste básico da fatia 01<br>
**Perfil inicial:** `v5-core-companion-pg-2023`<br>
**Revisão inicial do perfil:** `v5-core-companion-pg-2023-r1`<br>
**Implementação:** não iniciada

---

## 1. Objetivo

Definir a fronteira do componente que executa mecânicas aprovadas. O Rules Engine recebe entradas explícitas e uma revisão fechada de regras, produz um resultado determinístico e não conhece HTTP, banco, interface, Conta, permissões, PDF ou IA.

```text
entrada validada + faces conhecidas + perfil fechado
                         ↓
                 resultado mecânico
```

O componente não narra a cena e não substitui decisões do Narrador.

## 2. Responsabilidades

O Rules Engine pode:

- validar a estrutura mecânica da entrada;
- compor uma parada quando os componentes já estiverem autorizados e identificados;
- determinar quantos dados normais e de Fome participam;
- avaliar faces fornecidas;
- contar sucessos e críticos;
- comparar o resultado com a Dificuldade;
- classificar resultados especiais confirmados pelas regras publicadas;
- informar decisões que permanecem com o Narrador;
- registrar quais revisões de regra participaram da avaliação.

O Rules Engine não pode:

- autenticar ou autorizar pessoas;
- escolher personagem, Cena ou alvo;
- ler a ficha diretamente;
- buscar texto em livros ou artigos;
- definir modificadores contextuais por conta própria;
- gerar consequência narrativa;
- persistir `RollAttempt` ou `SessionEvent`;
- publicar no Feed;
- sortear dados internamente na função de avaliação;
- chamar IA ou serviço externo.

## 3. Fronteiras com outros componentes

| Componente | Entrega ao Rules Engine | Recebe do Rules Engine |
|---|---|---|
| Characters | valores autorizados e identificadores dos traços | nenhuma mutação direta |
| Chronicles | revisão fechada do perfil e módulos habilitados | nenhuma mutação direta |
| Sessions | comando validado, Dificuldade e faces | resultado mecânico estruturado |
| Dice adapter | faces separadas por tipo | nenhuma interpretação |
| Knowledge | nada em runtime | IDs para abrir explicações autorizadas |
| Feed | nada | nunca recebe o resultado diretamente |

O caso de uso em Sessions coordena autorização, aleatoriedade, Rules Engine, persistência e publicação. O avaliador permanece puro.

## 4. Capacidades da fatia 01

| Ordem | Regra | Responsabilidade | Estado documental |
|---:|---|---|---|
| 1 | `RULE-ROLL-001` | formação da parada e integração no teste básico | aprovada |
| 2 | `RULE-HUNGER-001` | Dados de Fome na rolagem | aprovada |
| 3 | `RULE-DIFF-001` | validação e aplicação da Dificuldade | aprovada |
| 4 | `RULE-CRIT-001` | identificação e contagem de crítico | aprovada |
| 5 | `RULE-RESULT-001` | sucessos, falha e margem | aprovada |
| 6 | `RULE-MESSY-001` | classificação de Crítico Bestial | aprovada |
| 7 | `RULE-BESTIAL-001` | classificação de Falha Bestial | aprovada |
| 8 | `RULE-ROLLFLOW-001` | ordem de resolução do teste básico | aprovada |

A ordem acima é de descoberta e dependência. A contagem crítica precede o resultado porque seu bônus altera o total comparado com a Dificuldade. A ordem mecânica definitiva pertence a `RULE-ROLLFLOW-001` e só será fechada após revisão das oito especificações.

## 5. Fora da fatia 01

- testes resistidos;
- Dificuldade secreta;
- ações rápidas e testes especiais;
- Pegar a Metade;
- Checagem de Sangue;
- Surto de Sangue;
- rerrolagem com Força de Vontade;
- dano, armas e combate;
- Disciplinas, poderes e efeitos específicos;
- modificadores de ambiente ou equipamento ainda não especificados;
- consequências narrativas de Crítico Bestial e Falha Bestial;
- rolagens dirigidas a uma única pessoa ou reveladas com atraso.

Itens adiados entram por nova regra e nova revisão de perfil. Eles não serão antecipados com flags genéricas.

A extensão para Força de Vontade já possui um ponto de entrada definido: a tentativa inicial permanece imutável, a pessoa gasta um ponto, escolhe até três dados normais elegíveis e uma nova tentativa vinculada recebe as faces substitutas. Dados de Fome nunca entram nessa seleção. O avaliador executa novamente crítico, resultado e classificações especiais. A especificação completa, incluindo custo e exceções, pertencerá a `RULE-WILL-001` antes do MVP de playtest.

## 6. Contrato conceitual de entrada

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

O exemplo expressa o contrato, não congela nomes de arquivo ou representação final.

### Invariantes de entrada

1. `ruleSetProfileRevisionId` referencia um perfil publicado e imutável.
2. `evaluatorRevision` identifica a implementação que produziu o resultado.
3. `totalDice` coincide com a quantidade total de faces.
4. `hungerDice` coincide com as faces marcadas como Fome.
5. nenhuma face pertence simultaneamente aos dois conjuntos.
6. toda face pertence ao domínio permitido de um d10.
7. Dificuldade e limites da parada obedecem à especificação publicada.
8. componentes da parada preservam origem e justificativa; não são apenas um total opaco.

Validação de autorização, estado da Sessão, propriedade do Personagem e visibilidade acontece antes dessa entrada.

## 7. Contrato conceitual de saída

```ts
type BasicTestResult = {
  totalSuccesses: number;
  difficulty: number;
  margin: number | null;
  outcome: BasicOutcome;
  critical: CriticalClassification;
  normalDiceSummary: DiceSummary;
  hungerDiceSummary: DiceSummary;
  appliedRuleRevisions: readonly RuleRevisionId[];
  narratorDecisions: readonly NarratorDecision[];
};
```

### Requisitos da saída

- não conter texto integral de fonte;
- não conter mensagem final de interface como fonte de verdade;
- preservar dados suficientes para explicar o cálculo;
- diferenciar classificação mecânica de consequência narrativa;
- usar enums fechados e versionados, nunca strings livres para estados mecânicos;
- permitir reprodução com as mesmas entradas, faces e revisões.

## 8. Tipos de erro

| Erro | Significado | Responsável pela tradução externa |
|---|---|---|
| `UnsupportedRuleSetProfile` | perfil não suportado pelo avaliador | caso de uso |
| `InvalidPoolComposition` | componentes ou total inconsistentes | caso de uso e Roll Builder |
| `InvalidHungerAllocation` | quantidade ou separação de Fome inválida | caso de uso |
| `InvalidDifficulty` | Dificuldade fora do contrato publicado | caso de uso |
| `InvalidDiceFace` | face fora do domínio | adapter de dados e caso de uso |
| `DiceCountMismatch` | faces não correspondem à parada | caso de uso |
| `RuleRevisionUnavailable` | revisão exigida não foi carregada | composição da aplicação |

Erro mecânico não inclui código HTTP. A camada de transporte escolhe a representação pública sem expor detalhe interno.

## 9. Determinismo e aleatoriedade

A geração das faces acontece por uma porta externa:

```text
DiceRoller.roll(normalCount, hungerCount) → DiceFaces
```

No uso real, o adapter usa fonte aleatória apropriada. Nos testes, recebe faces fixas. O Rules Engine avalia somente as faces entregues.

Essa separação permite:

- testes reproduzíveis;
- reprocessamento histórico;
- importação futura de resultados externos;
- investigação de divergência sem repetir o sorteio.

## 10. Versionamento

Três identidades permanecem separadas:

| Identidade | Exemplo de papel | Muda quando |
|---|---|---|
| `RuleDefinitionId` | conceito estável da regra | conceito é substituído por outro |
| `RuleRevisionId` | mecânica publicada | parâmetro, ordem ou comportamento muda |
| `EvaluatorRevision` | implementação verificável | código que executa a mecânica muda |

Uma correção de tradução não cria revisão mecânica. Uma correção de código que não altera resultado ainda cria nova revisão do avaliador para rastreabilidade, mas pode manter as mesmas `RuleRevisionId`.

Resultados persistidos guardam as três informações necessárias à reprodução.

## 11. Explicabilidade

O resultado deve permitir responder:

- quais componentes formaram a parada;
- quantos dados foram substituídos por Fome;
- quais faces foram avaliadas;
- quantos sucessos foram obtidos;
- qual Dificuldade foi aplicada;
- quais classificações mecânicas ocorreram;
- quais regras e avaliador produziram a resposta;
- qual decisão ainda pertence ao Narrador.

Explicabilidade é dado estruturado. A interface decide como apresentá-la e a Biblioteca fornece a explicação editorial autorizada.

## 12. Política para decisões do Narrador

O engine pode declarar uma pendência, por exemplo:

```ts
type NarratorDecision = {
  kind: NarratorDecisionKind;
  causedByRuleRevisionId: RuleRevisionId;
  allowedOptions: readonly NarratorOption[];
};
```

Ele não escolhe a opção. A decisão confirmada pelo Narrador vira outro comando ou Evento de Sessão quando o fluxo correspondente existir.

Não serão usados campos genéricos como `aiSuggestion` ou `freeformEffect` dentro do resultado canônico.

## 13. Estratégia de testes

Cada `RULE-*` deve possuir:

- caminho normal;
- limite inferior;
- limite superior relevante;
- entrada inválida;
- interação com Fome quando aplicável;
- resultado crítico ou especial aplicável;
- exemplo com faces explícitas;
- fonte, edição e página;
- resultado mecânico esperado;
- decisão remanescente do Narrador.

Camadas de teste:

| Camada | Finalidade |
|---|---|
| unidade tabelada | provar cada revisão de regra com faces fixas |
| propriedades | garantir invariantes gerais sem substituir exemplos oficiais |
| composição | provar a ordem de `RULE-ROLLFLOW-001` |
| contrato | congelar schemas públicos do resultado |
| regressão | preservar todo caso que já revelou defeito |

Não usar snapshot como única prova de regra.

## 14. Integração com o caso de uso

```text
AuthorizeRoll
→ LoadCharacterProjection
→ ResolveRuleSetProfile
→ BuildPool
→ ObtainDiceFaces
→ EvaluateBasicTest
→ Persist RollAttempt + SessionEvent + outbox
→ Commit
→ Relay authorized Feed projection
```

Somente `BuildPool` e `EvaluateBasicTest` pertencem ao escopo mecânico. A transação pertence à aplicação e segue ADR-0002.

## 15. Organização esperada do pacote

```text
packages/rules-engine/
  src/
    basic-test/
      build-pool.ts
      evaluate-basic-test.ts
      types.ts
    rule-set/
      resolve-profile.ts
      types.ts
    errors/
    index.ts
  tests/
    fixtures/
```

A estrutura é uma direção, não autorização para criar o pacote antes do gate arquitetural. Arquivos devem refletir capacidades; não haverá `utils.ts`, `helpers.ts` ou `manager.ts` genéricos.

## 16. Critérios de aceite para implementação futura

- mesma entrada, faces e revisões sempre produzem a mesma saída;
- pacote não importa framework, banco, HTTP, Socket.IO ou SDK de IA;
- todos os casos `RULE-ROLL-001` a `RULE-ROLLFLOW-001` aprovados passam;
- entradas inválidas falham por tipo explícito;
- resultado registra revisões aplicadas;
- cobertura de mutação ou técnica equivalente é considerada para condições críticas;
- bundle do frontend não contém o avaliador autoritativo;
- nenhum texto protegido é necessário para executar os testes.

## 17. Gates antes da implementação

1. produzir e revisar as oito especificações `RULE-*` da fatia 01;
2. confirmar os limites numéricos e a ordem de resolução diretamente nas fontes catalogadas;
3. transformar exemplos aprovados em vetores de teste sem copiar texto protegido;
4. vincular cada cenário ao catálogo de rastreabilidade;
5. revisar o contrato final depois da prova de persistência, sem acoplá-lo à biblioteca escolhida.

## 18. Definition of Done

- [x] responsabilidade e exclusões definidas;
- [x] fronteiras com aplicação e infraestrutura definidas;
- [x] entrada, saída e erros conceituais definidos;
- [x] determinismo, versionamento e explicabilidade definidos;
- [x] estratégia de testes definida;
- [x] oito especificações da fatia 01 aprovadas;
- [x] revisão humana deste documento concluída;
- [x] Architecture v0.1 aprovada.

O escopo está liberado para implementação dentro da Engineering Foundation e do Vertical Slice 01. Mudanças nas fronteiras exigem revisão deste documento ou ADR quando forem estruturais.
