# Contrato do Roll Builder V5 v0.1

**Status:** proposta para aprovação<br>
**Data:** 25 de outubro de 2026<br>
**Escopo:** preparação, confirmação e apresentação de um teste básico V5<br>
**Perfil inicial:** `v5-core-companion-pg-2023-r1`<br>
**Implementação:** não autorizada por este documento

## 1. Objetivo

Definir a fronteira entre ficha, aplicação, Rules Engine, rolador de dados e
persistência. O jogador deve perceber um único fluxo de mesa; o sistema deve
preservar autoridade, proveniência, segurança e reprodução histórica.

O contrato cobre o teste básico já aprovado. Checagem de Sangue, disputas,
Força de Vontade, Humanidade, Frenesi, Remorso, poderes e dano terão contratos
próprios antes de se tornarem executáveis.

## 2. Fontes e precedência

- `SRC-0001`, Livro Básico Galápagos, páginas impressas 117–123 e 205–208;
- `RULE-ROLL-001-r1` a `RULE-ROLLFLOW-001-r1`;
- Contrato do Rules Engine v0.1;
- Modelo de Domínio e matriz de permissões vigentes;
- [Macros & Token Actions — Roll20](https://help.roll20.net/hc/en-us/articles/360037256794-Macros-Token-Actions);
- [Ficha comunitária V5 do Roll20](https://github.com/Roll20/roll20-character-sheets/tree/master/vampire-v5), apenas como benchmark de interação.

O manual determina a mecânica. Roll20 informa padrões de conveniência, nunca a
verdade da regra.

## 3. Decisões fundamentais

1. A pessoa escolhe uma intenção; o servidor resolve valores efetivos.
2. A Fome nunca é digitada ou alterada dentro do Roll Builder.
3. Atributo, Habilidade, Especialização e modificadores usam identificadores
   estruturados, nunca expressão livre.
4. A combinação proposta pelo Jogador pode exigir confirmação do Narrador.
5. Preparar não persiste um fato histórico; confirmar cria um `RollAttempt`.
6. Persistência acontece antes da apresentação do resultado.
7. A mesma confirmação idempotente devolve a tentativa original.
8. Uma ficha alterada depois da preparação força nova preparação.
9. Ações rápidas guardam seletores, não valores atuais nem código.
10. O cliente nunca fornece faces na operação normal.

## 4. Papéis e autoridade

| Decisão | Jogador | Narrador | Sistema |
|---|---|---|---|
| descrever intenção | sim | sim | não |
| propor Características | sim | sim | valida capacidade |
| confirmar Características em sessão | não por padrão | sim | registra origem |
| definir Dificuldade em sessão | pode propor | autoridade final | valida faixa |
| obter valores da ficha | não envia | não envia | projeção autorizada |
| aplicar Fome | não edita | não edita no builder | regra publicada |
| gerar faces | não | não | `DiceRoller` confiável |
| calcular resultado | não | não | Rules Engine |
| decidir consequência narrativa | participa | autoridade final | aponta decisões pendentes |

Uma rolagem manual fora de sessão pode permitir que o controlador do Personagem
confirme combinação e Dificuldade. Essa modalidade deve ser identificada no
resultado e não simula autoridade de Narrador.

## 5. Estados do fluxo

```text
IDLE
  -> COMPOSING
  -> PREPARING
  -> READY
  -> CONFIRMING
  -> RESOLVED
```

Saídas alternativas:

```text
COMPOSING -> INVALID
PREPARING -> DENIED | STALE | UNAVAILABLE
READY -> COMPOSING                 quando a pessoa altera a intenção
CONFIRMING -> DENIED | STALE | CONFLICT | FAILED
RESOLVED -> IDLE | SAVE_AS_QUICK_ACTION
```

`STALE` significa que ficha, Sessão, Cena, perfil ou permissão mudou. O sistema
não reaproveita silenciosamente a preparação anterior.

## 6. Intenção enviada pelo cliente

```ts
type BasicRollIntent = {
  characterId: string;
  context:
    | { mode: "SESSION"; sessionId: string; sceneId: string | null }
    | { mode: "SOLO"; sessionId: null; sceneId: null };
  source:
    | { kind: "SHEET" }
    | { kind: "QUICK_ACTION"; quickActionId: string }
    | { kind: "MANUAL" };
  components: readonly ComponentSelection[];
  specialtyId: string | null;
  modifiers: readonly ModifierSelection[];
  difficulty: DifficultySelection;
  visibility: "CHRONICLE_SHARED" | "STORYTELLER_PRIVATE";
};

type ComponentSelection = {
  componentId: string;
  expectedKind:
    | "ATTRIBUTE"
    | "SKILL"
    | "DISCIPLINE"
    | "TRACK"
    | "PUBLISHED_RULE";
};

type ModifierSelection = {
  modifierDefinitionId: string;
  direction: "BONUS" | "PENALTY";
  magnitude: number;
  reasonCode: string;
};

type DifficultySelection =
  | { mode: "OPEN"; value: number; selectedBy: "PLAYER" | "STORYTELLER" }
  | { mode: "STORYTELLER_PRIVATE"; value: null };
```

O cliente não envia:

- valor efetivo das Características;
- total da parada;
- Fome;
- quantidade de dados normais ou de Fome;
- revisão do perfil como autoridade;
- faces;
- sucessos, margem ou classificação.

`STORYTELLER_PRIVATE` permanece fora do primeiro corte executável, embora sua
forma seja reservada para evitar uma quebra futura de contrato.

## 7. Preparação

Operação proposta:

```text
POST /api/v1/roll-attempts/prepare
```

Fluxo interno:

```text
autenticar
-> autorizar Conta, Participação, Vínculo, Personagem e Sessão
-> carregar perfil e projeção da ficha
-> resolver componentes e valores efetivos
-> validar Especialização e modificadores publicados
-> obter Fome autorizada
-> chamar prepareBasicTest
-> devolver prévia explicável e efêmera
```

Saída conceitual:

```ts
type BasicRollPreparationView = {
  preparationId: string;
  expiresAt: string;
  characterVersion: number;
  sessionVersion: number | null;
  ruleSetProfileRevisionId: string;
  formula: readonly ResolvedTermView[];
  pool: {
    rawPoolSize: number;
    preparedPoolSize: number;
    normalDiceCount: number;
    hungerDiceCount: number;
  };
  hunger: { level: number; participation: "APPLIES" | "EXCLUDED" };
  difficulty: {
    mode: "OPEN" | "STORYTELLER_PRIVATE";
    value: number | null;
    confirmation: "FINAL" | "STORYTELLER_REQUIRED";
  };
  canConfirm: boolean;
  blockers: readonly RollPreparationBlocker[];
};
```

`preparationId` identifica uma prévia curta e assinada ou persistida de modo
efêmero. Ele não é um `RollAttempt` e não aparece no Feed.

## 8. Confirmação e execução

Operação aprovada em princípio pela arquitetura vigente:

```text
POST /api/v1/roll-attempts
Idempotency-Key: <chave opaca>
```

Corpo mínimo proposto:

```ts
type ConfirmBasicRollCommand = {
  preparationId: string;
  expectedCharacterVersion: number;
  expectedSessionVersion: number | null;
};
```

Fluxo transacional:

```text
reautorizar
-> reservar idempotência e validar impressão do comando
-> conferir validade e versões da preparação
-> reler ficha, Fome, perfil e contexto
-> repetir prepareBasicTest
-> solicitar faces ao DiceRoller
-> chamar evaluateBasicTest
-> inserir RollAttempt + SessionEvent + outbox
-> commit
-> devolver projeção autorizada
```

Nenhuma face é exibida antes do `commit`. Uma falha de publicação depois do
commit é recuperada pela outbox; não dispara uma segunda rolagem.

## 9. Cartão de resultado

O equivalente conceitual ao Roll Template do Roll20 será uma projeção própria,
não uma string de chat. Ela deve conter:

- nome do Personagem e título da ação;
- fórmula em linguagem humana;
- dados normais e Dados de Fome visualmente distinguíveis;
- total de sucessos e Dificuldade quando visível;
- vitória, falha, Crítico Bestial, Falha Bestial ou Falha Total;
- margem quando aplicável;
- decisões ainda pertencentes ao Narrador;
- revisão das regras acessível em detalhes;
- `eventId` e sequência apenas em metadados técnicos.

O cartão não inventa consequência narrativa e não transforma todo resultado com
um dado de Fome em resultado bestial.

## 10. Ações rápidas

```ts
type QuickActionDefinition = {
  quickActionId: string;
  characterId: string;
  name: string;
  kind: "ATTACK" | "GENERAL" | "POWER" | "SYSTEM";
  componentSelectors: readonly ComponentSelection[];
  specialtyId: string | null;
  modifierSelectors: readonly ModifierSelection[];
  difficultyPolicy: "ASK" | "NONE" | "FIXED_WHEN_ALLOWED";
  sourceReference: SourceReference | null;
  sortOrder: number;
  version: number;
  status: "ACTIVE" | "DISABLED";
};
```

Ao executar uma Ação rápida, o servidor resolve novamente todos os valores. Se
um traço, equipamento, poder ou regra não estiver mais disponível no perfil, a
ação retorna `QUICK_ACTION_STALE` e indica qual referência precisa ser revista.

Uma Ação rápida pode preencher o Roll Builder e pedir confirmação. Ela não deve
rolar imediatamente por padrão, pois a situação, os modificadores e a
Dificuldade podem ter mudado.

## 11. Erros de aplicação

| Código | Significado | Resposta da interface |
|---|---|---|
| `ROLL_FORBIDDEN` | ator não controla o recurso | negar sem revelar dados |
| `ROLL_CONTEXT_INACTIVE` | Sessão ou Vínculo deixou de ser válido | voltar ao contexto seguro |
| `ROLL_PREPARATION_STALE` | versão ou estado mudou | preparar novamente |
| `ROLL_COMPONENT_UNAVAILABLE` | traço não existe no perfil efetivo | destacar seletor |
| `ROLL_COMBINATION_INVALID` | combinação não é aceita | explicar sem sugerir regra falsa |
| `ROLL_DIFFICULTY_REQUIRED` | falta decisão necessária | focar Dificuldade |
| `ROLL_STORYTELLER_CONFIRMATION_REQUIRED` | autoridade pendente | manter como proposta |
| `ROLL_IDEMPOTENCY_CONFLICT` | mesma chave, outro comando | não tentar automaticamente |
| `ROLL_ENGINE_UNAVAILABLE` | revisão necessária não está carregada | bloquear com recuperação |
| `ROLL_DICE_UNAVAILABLE` | rolador não concluiu antes do fato | permitir nova confirmação segura |

Erros não incluem valores secretos, tokens, stack traces ou existência de
recursos fora do público autorizado.

## 12. Segurança e privacidade

- autorização ocorre antes de recuperar ficha ou dificuldade privada;
- a API valida UUIDs, enums, limites e cardinalidade na borda;
- componentes são revalidados no domínio;
- modificadores pertencem a definições publicadas ou a uma categoria controlada;
- campos narrativos não são interpolados em comandos;
- logs usam IDs e códigos, nunca faces secretas ou notas privadas por padrão;
- rate limit considera Conta, Sessão e Personagem;
- idempotência inclui Conta atuante, Sessão, versão da operação e chave;
- projeção de resultado obedece `CHRONICLE_SHARED` ou `STORYTELLER_PRIVATE`;
- tentativas confirmadas são imutáveis.

## 13. Acessibilidade e estados

- todo seletor possui rótulo, valor e explicação textual;
- a fórmula não depende de cor;
- foco retorna ao componente que causou erro;
- `Rolar` informa nome e tamanho da parada;
- resultado é anunciado por região viva sem ler todas as faces automaticamente;
- `prefers-reduced-motion` remove animações de dados sem ocultar o resultado;
- teclado percorre intenção, componentes, ajustes, Dificuldade, resumo e ação.

## 14. Critérios de aceite antes do código

- [ ] contrato aprovado por Gabriel;
- [ ] modificadores da primeira entrega possuem regra e limites próprios;
- [ ] política de Especialização está especificada e testada;
- [ ] endpoint de preparação definido no OpenAPI;
- [ ] expiração e proteção de `preparationId` decididas;
- [ ] gerador de faces e política de falha definidos;
- [ ] testes negativos de autorização detalhados;
- [ ] estados `STALE`, conflito e retry cobertos;
- [ ] wireframes validados em desktop e mobile;
- [ ] nenhuma regra nova inferida apenas do Roll20.

## 15. Decisões ainda abertas

1. Preparação efêmera assinada ou persistida com expiração curta.
2. Confirmação obrigatória do Narrador por rolagem ou apenas quando ele alterar a
   proposta.
3. Comportamento de Ações rápidas em modo solo.
4. Momento em que rolagem privada ao Narrador entra no roadmap.
5. Forma futura da rerrolagem com Força de Vontade, sempre como nova tentativa.
