# Contrato do Rules Engine v0.1

**Status:** aprovado e implementado<br>
**Data de aprovação:** 21 de outubro de 2026<br>
**Incremento:** VS01-01<br>
**Perfil suportado:** `v5-core-companion-pg-2023-r1`<br>
**Revisão inicial do avaliador:** `basic-test-evaluator-r1`

## 1. Objetivo

Fechar o contrato do primeiro motor executável antes de consolidar seu código. O
pacote recebe valores já autorizados e faces conhecidas, executa as oito regras da
Fatia 01 e devolve um resultado mecânico reproduzível.

O pacote não conhece Conta, Personagem, Sessão, HTTP, banco, interface, PDF ou IA.
Também não sorteia dados e não decide consequências narrativas.

## 2. API pública mínima

O pacote publicará somente duas operações:

```ts
prepareBasicTest(input): RuleEngineResult<BasicTestPreparation>
evaluateBasicTest(input): RuleEngineResult<BasicTestResult>
```

`prepareBasicTest` calcula a parada, a participação da Fome e a Dificuldade para
a prévia do Roll Builder. `evaluateBasicTest` repete essas validações, confere as
faces e produz o resultado final. Repetir a preparação evita confiar em dados
derivados enviados pelo cliente.

As funções de cada regra permanecem internas ao pacote. Elas são testadas
isoladamente, mas não ampliam a superfície pública sem uma necessidade de produto.

## 3. Entrada da preparação

```ts
type PrepareBasicTestInput = {
  ruleSetProfileRevisionId: string;
  components: readonly PoolComponent[];
  hunger: HungerInput;
  difficulty: number;
};

type PoolComponent = {
  componentId: string;
  kind: "ATTRIBUTE" | "SKILL" | "DISCIPLINE" | "TRACK" | "PUBLISHED_RULE";
  effectiveValue: number;
  reason: string;
};

type HungerInput =
  | {
      participation: "APPLIES";
      level: number;
    }
  | {
      participation: "EXCLUDED";
      level: number;
      reason: "ROUSE_CHECK" | "WILLPOWER" | "HUMANITY";
    };
```

O perfil entra como `string` porque sua origem pode ser externa. O motor aceita
somente `v5-core-companion-pg-2023-r1` e devolve
`UnsupportedRuleSetProfile` para outra revisão.

O tipo discriminado impede uma exclusão sem motivo em código TypeScript. A
validação de runtime continua obrigatória porque a entrada pode ter origem externa.

## 4. Entrada da avaliação

```ts
type EvaluateBasicTestInput = PrepareBasicTestInput & {
  faces: {
    normal: readonly number[];
    hunger: readonly number[];
  };
};
```

O chamador não informa `totalDice`, `normalDiceCount`, `hungerDiceCount`, bônus
crítico nem total de sucessos. Todos são derivados pelo motor. Isso elimina pares
de campos redundantes que poderiam discordar entre si.

Cada face precisa ser um inteiro entre 1 e 10. As quantidades precisam coincidir
exatamente com a alocação produzida pela parada e pela Fome.

## 5. Saída da preparação

```ts
type BasicTestPreparation = {
  ruleSetProfileId: "v5-core-companion-pg-2023";
  ruleSetProfileRevisionId: "v5-core-companion-pg-2023-r1";
  pool: {
    rawPoolSize: number;
    preparedPoolSize: number;
    floorApplied: boolean;
    components: readonly PoolComponent[];
  };
  hunger: {
    level: number;
    participation: "APPLIES" | "EXCLUDED";
    exclusionReason: "ROUSE_CHECK" | "WILLPOWER" | "HUMANITY" | null;
    normalDiceCount: number;
    hungerDiceCount: number;
  };
  difficulty: {
    value: number;
    band:
      | "EASY"
      | "ROUTINE"
      | "MODERATE"
      | "CHALLENGING"
      | "HARD"
      | "VERY_HARD"
      | "NEARLY_IMPOSSIBLE";
  };
  appliedRuleRevisions: readonly [
    "RULE-ROLL-001-r1",
    "RULE-HUNGER-001-r1",
    "RULE-DIFF-001-r1",
  ];
};
```

## 6. Saída da avaliação

```ts
type BasicTestResult = Omit<BasicTestPreparation, "appliedRuleRevisions"> & {
  evaluatorRevision: "basic-test-evaluator-r1";
  dice: {
    normalFaces: readonly D10Face[];
    hungerFaces: readonly D10Face[];
    normalOneCount: number;
    hungerOneCount: number;
    normalTenCount: number;
    hungerTenCount: number;
  };
  critical: {
    totalTenCount: number;
    criticalPairCount: number;
    criticalBonusSuccesses: number;
  };
  successes: {
    normalBaseSuccesses: number;
    hungerBaseSuccesses: number;
    baseSuccesses: number;
    criticalBonusSuccesses: number;
    totalSuccesses: number;
  };
  outcome: "VICTORY" | "FAILURE";
  margin: number | null;
  isCriticalVictory: boolean;
  isTotalFailure: boolean;
  coexistsWithTotalFailure: boolean;
  winAtCostEligible: boolean;
  specialResult: "MESSY_CRITICAL" | "BESTIAL_FAILURE" | "NONE";
  narratorDecisions: readonly NarratorDecision[];
  appliedRuleRevisions: AppliedRuleRevisions;
};

type D10Face = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type NarratorDecision = {
  kind: "MESSY_CRITICAL_CONSEQUENCE" | "BESTIAL_FAILURE_CONSEQUENCE";
  causedByRuleRevisionId: "RULE-MESSY-001-r1" | "RULE-BESTIAL-001-r1";
};
```

`margin` é zero ou maior em vitórias e `null` em falhas. Falha Total,
elegibilidade para Vencer a um Custo e resultado especial ficam em campos
independentes para que uma classificação não apague outra.

`appliedRuleRevisions` registra, nesta ordem:

1. `RULE-ROLL-001-r1`;
2. `RULE-HUNGER-001-r1`;
3. `RULE-DIFF-001-r1`;
4. `RULE-CRIT-001-r1`;
5. `RULE-RESULT-001-r1`;
6. `RULE-MESSY-001-r1`;
7. `RULE-BESTIAL-001-r1`;
8. `RULE-ROLLFLOW-001-r1`.

## 7. Resultado e erros

O motor não lança erro para uma entrada mecânica inválida. Ele devolve uma união
discriminada:

```ts
type RuleEngineResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: RuleEngineError };

type RuleEngineError = {
  code: RuleEngineErrorCode;
  reason: RuleEngineErrorReason;
  path: readonly (string | number)[];
};
```

`path` aponta o campo inválido sem carregar valor sensível. Mensagens para a
interface são responsabilidade da aplicação e não fazem parte da verdade mecânica.

### Códigos fechados

| Código | Motivo inicial | Uso |
|---|---|---|
| `UnsupportedRuleSetProfile` | `PROFILE_REVISION_UNSUPPORTED` | perfil não executável por esta versão |
| `InvalidPoolComposition` | `COMPONENTS_REQUIRED`, `COMPONENT_ID_REQUIRED`, `COMPONENT_KIND_UNSUPPORTED`, `COMPONENT_REASON_REQUIRED` | estrutura da parada inválida |
| `InvalidPoolComponentValue` | `NOT_INTEGER`, `BELOW_MINIMUM` | valor efetivo inválido |
| `InvalidHungerAllocation` | `BASE_POOL_OUT_OF_RANGE`, `HUNGER_OUT_OF_RANGE`, `EXCLUSION_REASON_REQUIRED`, `EXCLUSION_REASON_UNSUPPORTED` | participação da Fome inválida |
| `InvalidDifficulty` | `REQUIRED`, `NOT_INTEGER`, `BELOW_MINIMUM` | Dificuldade inválida |
| `InvalidDiceFace` | `NOT_INTEGER`, `OUT_OF_RANGE` | face fora do domínio do d10 |
| `DiceCountMismatch` | `NORMAL_COUNT_MISMATCH`, `HUNGER_COUNT_MISMATCH`, `TOTAL_COUNT_MISMATCH` | faces não correspondem à alocação |
| `InvalidCriticalSummary` | `PAIR_COUNT_MISMATCH`, `BONUS_MISMATCH` | defesa interna da composição |
| `InvalidSpecialResultInput` | `CRITICAL_VICTORY_WITHOUT_PAIR`, `TOTAL_FAILURE_WITH_VICTORY` | estados incompatíveis na classificação |
| `RuleRevisionUnavailable` | `REQUIRED_REVISION_NOT_LOADED` | revisão exigida ausente na composição |

Os motivos são fechados por código. Um mesmo texto como `NOT_INTEGER` pode
aparecer em categorias diferentes sem perder contexto.

### Ordem de validação

Quando a entrada possui mais de um defeito, o motor devolve somente o primeiro
erro encontrado nesta ordem estável:

1. perfil e revisões carregadas;
2. componentes da parada, na ordem recebida;
3. participação e nível de Fome;
4. Dificuldade;
5. domínio das faces normais e depois das faces de Fome;
6. quantidade total de faces;
7. quantidade de faces normais;
8. quantidade de faces de Fome;
9. resumos internos de crítico, resultado e classificação especial.

Essa precedência faz parte do contrato. Ela evita que a mesma entrada inválida
oscile entre erros conforme a implementação seja reorganizada.

## 8. Autoridade das revisões

O chamador escolhe somente uma revisão publicada do perfil. O próprio pacote
declara:

- a identidade estável do perfil;
- as oito revisões mecânicas carregadas;
- a revisão do avaliador que executou o cálculo.

Por isso, `evaluatorRevision` não entra como dado livre do chamador. Quando uma
reprodução histórica exigir outra implementação, a aplicação resolverá a versão
compatível do pacote antes de executar o contrato.

## 9. Imutabilidade e determinismo

- as entradas não são alteradas;
- a saída usa estruturas `readonly` no contrato;
- a execução não lê relógio, ambiente, filesystem, rede ou gerador aleatório;
- a ordem dos componentes não altera o total, mas é preservada para explicação;
- as mesmas entradas e a mesma versão do pacote produzem valores estruturais
  idênticos;
- o motor não persiste nem publica o resultado.

Imutabilidade persistida pertence a `RollAttempt`. O pacote entrega dados
imutáveis por contrato, sem fingir que `readonly` substitui a transação do banco.

## 10. Fronteira com a aplicação

```text
caso de uso autorizado
→ monta componentes com IDs canônicos
→ chama prepareBasicTest
→ solicita faces por DiceRoller
→ chama evaluateBasicTest
→ persiste tentativa, evento e outbox
```

A aplicação não pode aceitar do cliente o valor efetivo do traço, a Fome
autoritativa ou um total já calculado. Ela carrega esses dados da projeção
autorizada do Personagem e usa o contrato somente depois dessa etapa.

## 11. Organização prevista

```text
packages/rules-engine/
  src/
    basic-test/
      build-pool.ts
      allocate-hunger.ts
      validate-difficulty.ts
      count-criticals.ts
      resolve-result.ts
      classify-messy-critical.ts
      classify-bestial-failure.ts
      prepare-basic-test.ts
      evaluate-basic-test.ts
      types.ts
    errors/
      rule-engine-error.ts
    rule-set/
      v5-core-companion-pg-2023-r1.ts
    index.ts
  tests/
```

Não haverá arquivo genérico `utils.ts`, `helpers.ts` ou `manager.ts`.

## 12. Proteções de arquitetura

Os testes impedirão:

- dependências de NestJS, Kysely, PostgreSQL, HTTP, Socket.IO, React ou Next.js;
- acesso a variáveis de ambiente dentro do motor;
- importação do pacote por `apps/web`;
- inclusão de PDF, OCR, imagens ou texto integral dos livros;
- exportação acidental das funções internas como API pública.

O pacote terá apenas TypeScript, Vitest e ESLint como dependências de
desenvolvimento já padronizadas no workspace. Nenhuma dependência de produção é
necessária neste incremento.

## 13. Decisões aprovadas

1. manter `evaluatorRevision` sob autoridade do pacote, e não do chamador;
2. derivar totais e alocação no motor, evitando campos redundantes de entrada;
3. oferecer somente `prepareBasicTest` e `evaluateBasicTest` como API pública;
4. retornar erros tipados em vez de lançar exceções para entrada inválida;
5. preservar as três exclusões de Fome já aprovadas, sem implementar os fluxos
   completos de Checagem de Sangue, Humanidade ou Força de Vontade;
6. usar `basic-test-evaluator-r1` como primeira revisão do avaliador.

Os seis pontos foram aprovados pelo responsável do produto em 21 de outubro de
2026 e orientaram a implementação.

## 14. Resultado da implementação

O contrato foi implementado em `packages/rules-engine`. A API pública contém
somente as duas operações, os tipos e as identidades de revisão previstos. Os 76
cenários normativos, as provas complementares, lint, typecheck e build passaram
localmente junto do gate completo do monorepo.
