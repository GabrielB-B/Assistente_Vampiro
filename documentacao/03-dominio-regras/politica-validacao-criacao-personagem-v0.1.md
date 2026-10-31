# Política de Validação — Criação e Evolução de Personagem v0.1

**Status:** DECISÃO DE PRODUTO APROVADA; VALORES NUMÉRICOS DEPENDEM DE REGRAS VERSIONADAS  
**Escopo:** criação guiada, preenchimento direto, Ficha pronta e vínculo futuro com Crônica  
**Caminho sugerido no repositório:** `documentacao/03-dominio-regras/politica-validacao-criacao-personagem-v0.1.md`

---

## 1. Propósito

Evitar dois extremos:

1. permitir que a Criação Guiada produza fichas mecanicamente inválidas;
2. tornar a Ficha pronta tão rígida que impeça XP, decisões do Narrador, progressão e exceções legítimas de uma Crônica.

A validação deve depender da fase de vida da Ficha.

---

## 2. Princípio central

> **Regra de criação não é regra eterna da Ficha.**

Uma limitação que existe para distribuir pontos durante a criação inicial não deve continuar bloqueando a Ficha depois que o Personagem estiver pronto.

Exemplo conceitual:

Se a política aprovada de criação disser que apenas uma Característica pode começar em determinado nível, a Criação Guiada deve impedir uma segunda escolha naquele nível.

Depois da criação, progressão legítima pode fazer com que várias Características alcancem esse nível.

Portanto, o backend não pode reutilizar indiscriminadamente o validador de distribuição inicial em toda edição futura.

---

## 3. Quatro contextos de validação

### 3.1 `CREATION_STEP`

Usado pela Criação Guiada durante uma etapa.

Objetivo:

- validar orçamento/distribuição da etapa;
- impedir escolhas mecanicamente incompatíveis com a política de criação;
- informar quanto ainda falta;
- permitir rascunho incompleto.

Comportamento:

**estrito para a escolha atual, tolerante com a Ficha incompleta.**

---

### 3.2 `CREATION_FINALIZATION`

Executado ao tentar concluir a criação.

Objetivo:

- validar todas as escolhas obrigatórias;
- verificar compatibilidade entre escolhas;
- verificar orçamento e distribuição inicial;
- aplicar a política de criação selecionada;
- decidir se o Character pode passar de `draft` para `ready`.

Comportamento:

**estrito.**

Um `Character ready` não deve nascer mecanicamente inválido para a política que o validou.

---

### 3.3 `ONGOING_EDIT`

Usado depois que o Personagem está pronto.

Objetivo:

- preservar invariantes estruturais do perfil;
- permitir progressão e alterações legítimas;
- não reaplicar orçamentos do momento de criação;
- sinalizar mudanças suspeitas ou sem histórico quando aplicável.

Comportamento:

**menos rígido do que a criação.**

Não bloquear uma alteração somente porque ela não poderia existir na distribuição inicial.

---

### 3.4 `CHRONICLE_BINDING`

Executado futuramente quando um Personagem for vinculado a uma Crônica.

Objetivo:

- verificar compatibilidade com o perfil da Crônica;
- verificar regras adicionais da campanha;
- apresentar divergências ao jogador/Narrador;
- permitir aprovação explícita do Narrador quando a política da Crônica exigir.

Comportamento:

**validação contextual + decisão humana.**

---

## 4. Três classes de regra

### 4.1 Invariantes permanentes

Sempre aplicáveis.

Exemplos conceituais:

- propriedade do Character;
- tipo de dado válido;
- valores dentro dos limites estruturais do perfil;
- referências a poderes/regras existentes;
- relações impossíveis para determinado `characterKind`;
- segurança e autorização;
- integridade e concorrência.

São autoritativas no backend.

---

### 4.2 Regras exclusivas da criação

Aplicáveis somente enquanto o Character está sendo criado.

Exemplos:

- distribuição inicial de Atributos;
- distribuição inicial de Habilidades;
- quantidade inicial de escolhas;
- orçamento de vantagens/defeitos;
- escolhas iniciais de poderes;
- pacote inicial de experiência, quando aplicável.

Depois de `ready`, essas regras não são reaplicadas como bloqueio de edição.

---

### 4.3 Regras contextuais/progressão

Dependem de:

- XP;
- estágio/idade do personagem;
- perfil da Crônica;
- decisões ou recompensas do Narrador;
- house rules formalizadas;
- migração de perfil.

Devem ser avaliadas no contexto apropriado.

---

## 5. Criação Guiada

A Criação Guiada é o modo mais normativo.

A UI pode antecipar a validação para evitar frustração, mas o backend é a autoridade.

Fluxo:

```text
usuário tenta escolha
    ↓
UI conhece orçamento atual e dá feedback imediato
    ↓
comando é validado pelo backend
    ↓
estado canônico é atualizado
    ↓
UI recebe orçamento/progresso atualizado
```

Não confiar em contadores calculados somente no cliente.

---

## 6. Orçamentos e distribuição

A UI não deve conter números de criação espalhados em componentes.

O backend deve expor uma política estruturada, por exemplo conceitualmente:

```text
CreationStepPolicy
- stepId
- ruleRevisionId
- allowedValues
- distribution
- remainingBudget
- prerequisites
- completionState
```

Os nomes reais devem respeitar o domínio existente.

A interface apenas apresenta esses dados.

A fonte normativa continua sendo a `RuleRevision`/política aprovada, nunca um texto de Markdown interpretado em runtime.

---

## 7. Markdown e Biblioteca

Os Markdown e Knowledge Articles podem fornecer:

- explicações;
- dicas;
- exemplos;
- glossário;
- contexto;
- links de aprofundamento.

Eles **não executam regra**.

Separação obrigatória:

> **Biblioteca explica. Política estruturada valida. Rules Engine executa mecânica.**

Não fazer parsing de uma frase como “distribua X pontos” para decidir o que o backend permite.

---

## 8. Modo direto — Preencher Ficha

O modo direto deve ser mais próximo de uma ficha de papel.

Durante edição:

- permitir navegação livre;
- não bloquear cada clique por regra de criação;
- exibir warnings e pendências;
- permitir salvar como `draft`;
- fornecer validação sob demanda.

Ao concluir:

- executar `CREATION_FINALIZATION`;
- apresentar inconsistências de forma consolidada;
- não perder o que foi preenchido.

Isso oferece liberdade sem transformar `ready` em estado mecanicamente sem significado.

---

## 9. Ficha pronta

Depois que o Character está `ready`:

- não reaplicar distribuição inicial;
- não limitar a quantidade de Características em um valor porque a criação inicial limitava;
- permitir evolução;
- preservar invariantes permanentes;
- apresentar warnings quando uma alteração não possui contexto suficiente.

A validação de progressão deve evoluir separadamente conforme XP e regras forem formalizados.

---

## 10. Papel do Narrador

O Narrador não substitui validações estruturais do backend.

Ele entra onde existe decisão contextual de Crônica.

Exemplos:

- aceitar um Personagem na Crônica;
- autorizar pacote de criação/experiência permitido pela campanha;
- aprovar exceção suportada por perfil/house rule;
- revisar uma Ficha criada em modo direto;
- conceder ou validar progressão quando o fluxo correspondente existir.

A plataforma deve tornar essa revisão fácil, não transformar toda edição em bloqueio preventivo.

---

## 11. Categorias de personagem e experiência inicial

O produto deve suportar políticas de criação que possam variar conforme categoria/estágio inicial do Personagem ou pacote de experiência previsto pelas regras.

Exemplos mencionados na direção de produto incluem categorias como personagens mais jovens, neófitos, ancillae e anciões.

**Os nomes canônicos, requisitos e valores de XP/pontos devem ser confirmados no corpus antes de implementação.**

Não hardcodar números ou terminologia ainda não formalizados.

### Direção de UX

Na Criação Guiada:

- começar com a política padrão;
- no momento apropriado, permitir selecionar um pacote inicial apenas quando ele existir em regra aprovada;
- explicar o impacto;
- atualizar automaticamente os orçamentos seguintes;
- registrar a revisão da política utilizada.

Se o Personagem estiver sendo criado para uma Crônica que já definiu esse pacote, a Crônica futuramente poderá fornecer essa escolha/política.

---

## 12. Compatibilidade com Crônica

Um Personagem pode existir sem Crônica.

Quando futuramente for solicitado vínculo:

```text
Character
    ↓
validar contra Chronicle rule profile
    ↓
compatível
ou
divergências para revisão
    ↓
Narrador aprova/rejeita quando aplicável
```

Não reescrever automaticamente a Ficha para fazê-la caber na Crônica.

---

## 13. Estados de validação sugeridos

Sem exigir nova enumeração persistida neste documento, a interface deve conseguir representar conceitos equivalentes a:

- válido para esta etapa;
- incompleto;
- possui pendências;
- conflito de versão;
- incompatível com regra;
- requer revisão;
- pronto.

A forma técnica deve ser definida pela implementação e pelos contratos existentes.

---

## 14. Concorrência

Toda edição persistente deve respeitar a versão otimista já prevista no domínio.

Comandos de escrita devem utilizar `expectedVersion`.

Conflito:

- não usar “última gravação vence”;
- não apagar alterações;
- informar conflito;
- permitir recarregar e reconciliar.

---

## 15. Segurança

O backend deve garantir:

- proprietário derivado da identidade autenticada;
- cliente não escolhe `ownerAccountId`;
- Character alheio não pode ser lido ou alterado;
- falha de autorização não confirma existência do recurso;
- regra mecânica autoritativa não depende do cliente;
- campos inesperados são rejeitados.

---

## 16. Anti-patterns

Não fazer:

- `if` de distribuição de criação espalhado em React;
- duplicar regra no frontend e backend sem uma fonte estruturada;
- usar Markdown como máquina de regras;
- reaplicar regras de nascimento durante progressão;
- bloquear toda edição da Ficha pronta;
- confiar apenas no Narrador para integridade estrutural;
- permitir `ready` inválido silenciosamente;
- alterar automaticamente a Ficha ao vincular a uma Crônica.

---

## 17. Critérios de aceitação da política

- [ ] Guided Creation bloqueia escolhas inválidas da etapa;
- [ ] frontend mostra orçamento/progresso retornado de fonte autoritativa;
- [ ] backend valida novamente cada comando relevante;
- [ ] rascunho pode permanecer incompleto;
- [ ] finalização executa validação integral;
- [ ] regras exclusivas de criação não bloqueiam evolução posterior;
- [ ] modo direto permite edição livre e salva rascunho;
- [ ] modo direto recebe resumo de pendências na conclusão;
- [ ] Ficha pronta permanece editável sem reaplicar orçamento inicial;
- [ ] invariantes permanentes continuam protegidas;
- [ ] Chronicle Binding possui validação própria no futuro;
- [ ] exceções de Crônica dependem de política/decisão explícita;
- [ ] Markdown explica, mas não executa regras;
- [ ] nenhum número de XP ou distribuição não aprovado é hardcodado.

---

## 18. Pendências normativas

Antes de implementar a criação V5 completa, o corpus deve formalizar e aprovar:

- ordem/obrigatoriedade das etapas;
- distribuição inicial de Atributos;
- distribuição inicial de Habilidades;
- regras de Clã/Caitiff/Sangue-Ralo etc.;
- Disciplinas e poderes iniciais;
- Predador;
- Vantagens e Defeitos;
- Humanidade e derivados;
- pacotes de experiência/estágio inicial;
- critérios completos de `draft → ready`.

Esses itens devem virar especificações rastreáveis antes de serem usados como regra de negócio.
