# Prova de Persistência v0.1

**Status:** executada; decisão aprovada<br>
**Data do protocolo:** 8 de outubro de 2026<br>
**Decisão resultante:** ADR-0004 aceita<br>
**Código:** experimental e descartável<br>
**Ambiente usado:** PostgreSQL 18.6 local, restrito a `localhost`, com role e banco exclusivos

---

## 1. Objetivo

Escolher a biblioteca de acesso a dados que represente com mais clareza e segurança a transação central do primeiro corte:

```text
atualizar estado com controle de concorrência
+ avançar o cursor da Sessão
+ inserir RollAttempt
+ inserir SessionEvent
+ inserir OutboxMessage
= uma única transação
```

A prova não procura a biblioteca com menos linhas em um exemplo simples. Ela procura a opção mais previsível para manutenção humana, revisão de SQL, diagnóstico de falhas e evolução do domínio.

## 2. Candidatos e versões fixadas

| Candidato | Versão da prova | Driver ou ferramenta | Motivo do recorte |
|---|---:|---|---|
| Kysely | `0.29.6` | `pg 8.23.1` | SQL tipado, pouca abstração e migrações explícitas |
| Drizzle ORM | `0.45.4` | `pg 8.23.1`; Drizzle Kit `0.31.11` | API próxima de SQL e schema TypeScript |
| Prisma ORM | `7.10.0` | adapter PostgreSQL oficial da mesma linha | versão estável suportada durante a transição da linha 8 |

Ferramentas comuns:

| Ferramenta | Versão |
|---|---:|
| Node.js | `24.18.0` |
| pnpm | `12.10.1` |
| TypeScript | `7.0.2` |
| Vitest | `5.0.3` |
| PostgreSQL | `18.6` |

Não será usado `latest` no manifesto. Cada pacote será gravado com versão exata e um único lockfile.

O pacote `prisma` publicado como padrão no registro aponta atualmente para uma versão 8 candidata a lançamento, enquanto a linha 7.10 permanece estável e compatível com Node 24. Comparar uma versão candidata com duas linhas estáveis distorceria a decisão.

## 3. Ambiente necessário

### Execução local recomendada

PostgreSQL 18.6 instalado diretamente no Windows, escutando apenas em `localhost`, com banco e usuário exclusivos para a prova.

Essa opção exige menos mudanças nesta máquina porque Docker, WSL e Podman não estão disponíveis. O ambiente de CI poderá usar um container de PostgreSQL depois que a Engineering Foundation for iniciada.

### Regras de segurança

- credenciais somente em `.env`, já ignorado pelo Git;
- `.env.example` contém apenas nomes e valores fictícios;
- usuário da prova sem privilégios administrativos globais;
- banco exclusivo, sem dados pessoais ou conteúdo dos livros;
- schema e dados totalmente descartáveis;
- nenhum serviço exposto para a rede externa;
- nenhuma senha impressa em logs ou relatório.

SQLite, mocks e PGlite podem ajudar em testes unitários futuros, mas não substituem PostgreSQL real nesta decisão.

## 4. Estrutura temporária esperada

```text
experimentos/
  persistencia/
    README.md
    package.json
    pnpm-lock.yaml
    .env.example
    shared/
      contract.ts
      fixtures.ts
      assertions.ts
    kysely/
      migrations/
      src/
      tests/
    drizzle/
      migrations/
      src/
      tests/
    prisma/
      migrations/
      src/
      tests/
    results/
      measurements.json
      report.md
```

O experimento não será colocado em `apps/`, `packages/` ou outro caminho que sugira código definitivo.

## 5. Modelo mínimo comum

Os três candidatos representarão as mesmas restrições:

### `character_state`

- identificador;
- versão inteira para concorrência otimista;
- Fome atual;
- data de atualização.

### `roll_attempt`

- identificador imutável;
- chave de idempotência única no contexto da Sessão;
- impressão digital obrigatória do comando;
- personagem, Sessão e Cena;
- versão esperada do estado do personagem;
- revisões do perfil, das regras e do avaliador;
- composição, faces e resultado estruturados;
- tentativa anterior opcional;
- data de confirmação.

O laboratório reduz o contexto de idempotência a Sessão + chave porque não implementa identidade. Na aplicação, o contexto também inclui a Conta atuante e a versão da operação, conforme a Architecture v0.1.

### `session_stream`

- identificador da Sessão;
- última sequência confirmada;
- incremento atômico por linha, sem `MAX(sequence) + 1`.

### `session_event`

- identificador;
- sequência crescente por Sessão;
- referência única à tentativa;
- tipo e público autorizados;
- data de ocorrência.

### `outbox_message`

- identificador;
- referência ao Evento de Sessão;
- tópico, payload e público;
- quantidade de tentativas de envio;
- instante da próxima tentativa e do despacho, quando houver.

## 6. Casos obrigatórios

### P01 — Migração em banco vazio

Aplicar todas as migrações em um banco limpo e conferir tabelas, chaves, índices, checks e tipos.

### P02 — Caminho feliz atômico

Atualizar a versão do personagem, avançar o cursor da Sessão e inserir tentativa, evento e outbox. As cinco alterações precisam aparecer juntas.

### P03 — Rollback real

Provocar falha na inserção da outbox. Nenhuma alteração anterior pode permanecer, incluindo a versão do personagem.

### P04 — Idempotência

Enviar o mesmo comando concorrentemente com a mesma chave e Sessão. Deve existir uma tentativa, um evento e uma mensagem de outbox, e ambas as chamadas recebem a resposta original.

A mesma chave em outra Sessão é independente. Reutilizar a chave na Sessão original com outra impressão de comando produz conflito, sem alterar estado. Um replay posterior continua devolvendo a resposta original mesmo que o Personagem já tenha avançado.

### P05 — Concorrência otimista

Duas transações usam a mesma versão do personagem. Somente uma avança; a outra recebe conflito explícito e não deixa registros parciais.

### P06 — Reserva do relay

Selecionar mensagens pendentes de forma concorrente, usando bloqueio adequado, sem entregar o mesmo item simultaneamente a dois workers.

### P07 — Migração evolutiva

Adicionar um campo obrigatório usando expansão, preenchimento e validação antes da contração. O SQL precisa ser revisável e a recuperação precisa estar documentada.

### P08 — Tipos do domínio

Comprovar tipos fechados para visibilidade, resultado e revisão, além do uso controlado de `jsonb` para snapshots estruturados.

### P09 — Diagnóstico

Provocar violação de unicidade, conflito de versão, timeout e erro de conexão. O adapter precisa permitir tradução para erros próprios sem depender de texto frágil.

### P10 — Consulta operacional

Ler a outbox atrasada e o histórico de uma tentativa com SQL compreensível, plano observável e sem carregar campos desnecessários.

## 7. Contrato comum do experimento

Cada implementação fornecerá a mesma porta:

```ts
interface PersistenceCandidate {
  migrateEmptyDatabase(): Promise<void>;
  confirmRoll(command: ConfirmRollFixture): Promise<ConfirmedRollFixture>;
  findByIdempotencyKey(
    sessionId: string,
    key: string,
  ): Promise<ConfirmedRollFixture | null>;
  claimOutbox(batchSize: number): Promise<readonly ClaimedMessageFixture[]>;
  close(): Promise<void>;
}
```

Os testes compartilhados não importarão APIs específicas dos candidatos. Código específico ficará atrás dessa porta.

## 8. Critérios e pesos

| Critério | Peso | Evidência |
|---|---:|---|
| clareza da transação e da outbox | 25% | revisão do caso P02, rollback e passagem do contexto transacional |
| migrações previsíveis e SQL revisável | 20% | arquivos gerados ou escritos, diff de P01 e P07 |
| segurança de tipos e mapeamento do domínio | 15% | typecheck e quantidade de coerções manuais |
| escape controlado para SQL nativo | 10% | implementação de P06 e consulta de P10 |
| integração com PostgreSQL real | 10% | setup, isolamento e tempo dos testes |
| manutenção e estabilidade | 10% | maturidade, superfície de dependências e risco de atualização |
| diagnóstico e desempenho | 10% | erros de P09, planos e medições repetíveis |

Cada nota vai de 1 a 5 e precisa apontar para evidência. Preferência pessoal não é evidência.

## 9. Medições

Desempenho possui peso baixo, mas será medido de forma consistente:

- uma rodada de aquecimento;
- no mínimo 100 execuções válidas por candidato;
- mesma máquina, banco e tamanho de pool;
- mediana e percentil 95;
- tempo de startup e geração registrado separadamente;
- nenhum resultado será apresentado como benchmark universal.

Uma diferença pequena de velocidade não supera transações confusas, migrações opacas ou diagnóstico ruim.

## 10. Regras de comparação justa

- mesmo schema lógico e mesmas restrições;
- mesmos fixtures e assertions;
- mesmo driver `pg` quando a biblioteca permitir;
- nenhum cache exclusivo para um candidato;
- nenhuma consulta raw usada para esconder limitação sem ser contabilizada;
- SQL nativo é permitido quando explícito, testado e encapsulado;
- tempo de aprendizado e complexidade acidental são registrados;
- problemas encontrados permanecem no relatório, mesmo quando corrigidos.

## 11. Entregas

1. três implementações experimentais;
2. testes compartilhados executados em PostgreSQL 18;
3. `measurements.json` com resultados brutos;
4. relatório curto com notas e justificativas;
5. ADR-0004 com a decisão;
6. remoção ou arquivamento explícito do código descartável depois da aprovação.

## 12. Critério de saída

A prova termina quando:

- P01 a P10 foram executados nos três candidatos;
- falhas e limitações estão registradas;
- a matriz possui evidência suficiente para revisão humana;
- ADR-0004 está pronto para aprovação;
- nenhum candidato vazou para o código de produção antes da decisão.

## 13. Estado do ambiente em 8 de outubro de 2026

| Item | Estado |
|---|---|
| Node.js 24.18.0 | disponível |
| npm 11.16.0 | disponível |
| Corepack 0.35.0 | disponível |
| pnpm 12.10.1 | disponível por Corepack |
| PostgreSQL 18.6 | instalado e validado em `localhost` |
| Docker Desktop | não instalado |
| Podman | não instalado |
| WSL | não instalado |
| role da prova | sem privilégios administrativos globais e configurada em UTC |

A prova foi executada em três schemas isolados no banco `assistente_vampiro_persistence_lab`. Credenciais permaneceram somente no `.env` ignorado pelo Git.

## 14. Referências técnicas

- [Kysely — Getting started](https://www.kysely.dev/docs/getting-started);
- [Drizzle — PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql);
- [Drizzle — Transações](https://orm.drizzle.team/docs/transactions);
- [Drizzle — Migrações](https://orm.drizzle.team/docs/migrations);
- [Prisma ORM 7 — Transações](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions);
- [PostgreSQL — Documentação](https://www.postgresql.org/docs/18/).

## 15. Resultado

- P01 a P10 passaram nas três candidatas;
- 30 testes de integração foram aprovados;
- 300 confirmações válidas foram medidas depois do aquecimento;
- Kysely obteve a melhor avaliação ponderada;
- ADR-0004 foi aceita, adotando Kysely 0.29.6 com `pg` 8.23.1.

O relatório completo está em [Resultado da Prova de Persistência v0.1](./resultado-persistencia-v0.1.md).
