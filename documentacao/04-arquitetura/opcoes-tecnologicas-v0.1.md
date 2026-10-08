# Opções Tecnológicas v0.1

**Status:** consolidado<br>
**Data da pesquisa:** 7 de outubro de 2026<br>
**Data da decisão:** 8 de outubro de 2026<br>
**Escopo:** frontend, backend, dados, realtime, operação e preparação para IA<br>
**Decisão:** F1 + A + I + alpha + prova de persistência + Feed sem chat

---

## 1. Resumo executivo

A recomendação é uma stack TypeScript ponta a ponta, em monorepo, com frontend Next.js e backend NestJS formando um monólito modular sobre PostgreSQL. Serviços gerenciados podem operar essa base, mas não devem assumir o domínio da aplicação.

```text
Next.js + React
        ↓ REST/OpenAPI + canal realtime
NestJS modular e autoritativo
        ↓
PostgreSQL
```

Essa composição oferece o melhor equilíbrio para este projeto entre:

- liberdade visual e ecossistema de interface;
- contratos tipados;
- realtime controlado pelo backend;
- manutenção por equipe pequena;
- implantação portátil;
- evolução futura para IA sem torná-la dependência do produto.

A recomendação não significa colocar regra de negócio no Next.js nem distribuir o backend em microsserviços.

As escolhas são tratadas por eixos independentes. NestJS versus ASP.NET Core é uma decisão de backend; infraestrutura portável versus Supabase é uma decisão de operação. Misturar esses eixos produziria uma comparação enganosa.

## 2. Restrições que orientam a escolha

A tecnologia precisa sustentar:

- interface artística sem aparência de painel administrativo genérico;
- composição responsiva, overlays, drawers e transições contextuais;
- acessibilidade por teclado e redução de movimento;
- Feed da Mesa e mudanças de Cena em tempo real;
- backend autoritativo para regras, autorização e segredos;
- tentativas de rolagem idempotentes e persistidas antes da apresentação;
- regras e traduções versionadas;
- execução sem IA;
- futura recuperação de conhecimento filtrada antes de chegar ao modelo;
- implantação inicial simples, sem impedir crescimento.

## 3. Decisões que não devem depender da stack

Estas fronteiras permanecem válidas em qualquer opção:

1. domínio não importa framework, ORM ou SDK de IA;
2. frontend não acessa tabelas diretamente;
3. PDFs e extrações privadas não entram no runtime público;
4. regra canônica e texto gerado por IA possuem estados diferentes;
5. evento é persistido antes de ser transmitido;
6. autorização ocorre antes da recuperação de segredo;
7. integrações externas entram por portas e adaptadores;
8. migrações são versionadas e revisadas;
9. contratos públicos possuem versão;
10. observabilidade não fica presa a um fornecedor.

## 4. Eixo 1 — frontend e imersão

### Opções avaliadas

| Opção | Quando faz mais sentido | Vantagens | Custos e riscos |
|---|---|---|---|
| **F1 — Next.js 16 + React** | aplicação, entrada pública e Biblioteca convivem no mesmo produto | layouts, renderização híbrida, streaming, mídia, PWA e implantação em Node ou Docker | exige disciplina na fronteira cliente/servidor; Server Actions não podem receber regra de domínio |
| **F2 — React + Vite como SPA** | produto inteiramente autenticado, sem necessidade relevante de conteúdo público ou SSR | cadeia menor, hospedagem estática e fronteiras explícitas com a API | SSR e conteúdo editorial público exigiriam integração ou aplicação adicional; mais decisões manuais de roteamento e dados |

**Recomendação: F1.** A Biblioteca, as páginas de lore, a entrada do personagem e uma futura presença pública justificam a flexibilidade do Next.js. A opção F2 continua válida caso o escopo seja reduzido a uma aplicação fechada de mesa.

Next.js 16 está em Active LTS na data desta pesquisa e admite implantação fora da Vercel. Vite também é uma alternativa madura e portável; a diferença aqui é de necessidades do produto, não de capacidade visual.

### Base visual comum

- **React + TypeScript:** componentes e contratos de interface;
- **Radix Primitives:** comportamento acessível sem impor aparência;
- **tokens próprios em CSS:** cor, tipografia, espaço, elevação, textura, movimento e níveis de arte;
- **Tailwind CSS:** utilitários de composição, sem assumir a identidade visual;
- **Motion:** transições, microinterações e continuidade contextual;
- **Storybook:** catálogo vivo dos componentes e estados de interface.

### Imersão sem sacrificar manutenção

A interface principal deve usar HTML, CSS, SVG e imagens responsivas. Canvas ou WebGL entram apenas como melhoria progressiva em cenas específicas.

| Necessidade | Ferramenta inicial | Evolução opcional |
|---|---|---|
| transição entre estados | CSS + Motion | sequências mais complexas sob demanda |
| retratos e arte de cena | imagens responsivas | parallax leve e shaders pontuais |
| dados | DOM/SVG acessível | camada 3D carregada sob demanda |
| partículas ambientais | CSS/SVG | PixiJS quando a medição justificar |
| áudio ambiente | Web Audio por adapter | mixer e cenas sonoras posteriores |

Não se recomenda construir toda a aplicação como canvas ou engine de jogo. Isso pioraria formulários, leitura, acessibilidade, consumo de energia e testes sem melhorar necessariamente a imersão.

### Regras de qualidade visual

- o sistema visual nasce de tokens próprios, não de tema pronto;
- componentes Radix recebem aparência do projeto;
- toda animação respeita `prefers-reduced-motion`;
- efeitos caros são carregados sob demanda e possuem fallback estático;
- texto continua selecionável e acessível;
- Storybook documenta estados normal, hover, foco, loading, vazio, erro e permissão negada;
- orçamento de performance é definido antes de adicionar WebGL ou áudio persistente.

## 5. Eixo 2 — backend da aplicação

### Opção A — TypeScript modular com NestJS

**Recomendação do projeto.**

| Camada | Proposta |
|---|---|
| runtime | NestJS 12 sobre Node.js 24.15 ou superior da linha LTS |
| HTTP | REST documentado por OpenAPI |
| realtime | Socket.IO encapsulado por adapter |
| dados | PostgreSQL 18 |
| acesso a dados | adapter a validar por prova técnica curta |
| monorepo | pnpm workspaces + Turborepo |
| assets | interface compatível com S3 |
| observabilidade | logs estruturados; traces e métricas com OpenTelemetry |
| trabalho assíncrono | outbox durável no PostgreSQL; fila externa somente quando a carga justificar |

Vantagens:

- uma linguagem no frontend, backend e futuros workers;
- menor custo cognitivo para equipe pequena;
- ecossistema React muito forte para interfaces autorais;
- módulos NestJS combinam com os limites já modelados;
- geração de clientes HTTP a partir de OpenAPI reduz duplicação de contratos;
- boa disponibilidade de bibliotecas para futura integração com IA.

Riscos:

- ecossistema Node muda rapidamente;
- compartilhamento excessivo pode acoplar frontend e backend;
- Server Actions podem atrair regra de negócio para o frontend;
- ORM escolhido sem isolamento pode contaminar o domínio.

Controles:

- versões fixadas e lockfile obrigatório;
- dependências atualizadas em lotes pequenos;
- regra de negócio somente no backend e no Rules Engine puro;
- OpenAPI como fonte do contrato HTTP;
- repositórios escondem a biblioteca de dados;
- testes de arquitetura impedem imports proibidos.

### Opção B — Backend ASP.NET Core

| Camada | Proposta |
|---|---|
| runtime | ASP.NET Core 10 LTS em C# |
| HTTP | REST documentado por OpenAPI |
| realtime | SignalR |
| dados | PostgreSQL 18 com Npgsql |
| acesso a dados | adapter a validar entre EF Core e SQL tipado/manual |
| repositório | solução .NET e frontend no mesmo repositório, com comandos unificados |
| assets | interface compatível com S3 |
| observabilidade | logs estruturados; traces e métricas com OpenTelemetry |
| trabalho assíncrono | outbox durável no PostgreSQL; worker externo quando necessário |

Vantagens:

- backend maduro, performático e fortemente tipado;
- suporte LTS claro;
- SignalR trata conexão, grupos e fallback de transporte;
- ecossistema sólido para domínio, segurança e jobs.

Desvantagens:

- duas linguagens e duas cadeias de ferramentas;
- contratos exigem geração ou manutenção entre C# e TypeScript;
- maior custo cognitivo para uma pessoa ou equipe pequena;
- futura equipe precisa dominar os dois ecossistemas.

Escolher esta opção se robustez do backend em C# for mais importante que a simplicidade operacional de uma única linguagem.

## 6. Eixo 3 — estratégia de infraestrutura

Esta escolha pode ser combinada tanto com NestJS quanto com ASP.NET Core.

### Opção I — serviços portáveis

| Capacidade | Direção |
|---|---|
| aplicação | container padrão do backend escolhido |
| banco | PostgreSQL gerenciado, sem API direta para o navegador |
| arquivos | armazenamento compatível com S3 por adapter |
| realtime | Socket.IO ou SignalR operado pela aplicação |
| identidade | provedor OIDC escolhido em ADR próprio |

Vantagens:

- fronteiras de domínio e autorização permanecem na aplicação;
- menor acoplamento a um fornecedor;
- mudança de hospedagem não altera o modelo do produto.

Custos:

- mais decisões operacionais;
- autenticação, backup, storage e observabilidade precisam ser compostos;
- ambiente compartilhado exige configuração mais cuidadosa.

### Opção II — Supabase como infraestrutura gerenciada

| Capacidade | Direção |
|---|---|
| banco | PostgreSQL do Supabase |
| identidade | Supabase Auth, se aprovado no ADR de autenticação |
| arquivos | Supabase Storage atrás de adapter |
| realtime | Broadcast como transporte opcional, sem substituir outbox e replay |
| domínio | permanece integralmente no backend escolhido |

Vantagens:

- autenticação, banco, storage e realtime disponíveis com menos operação inicial;
- PostgreSQL continua sendo a fonte de verdade;
- bom caminho quando a principal restrição for operar o primeiro ambiente.

Riscos e controles:

- Auth, Storage e Realtime aumentam o custo de troca de plataforma;
- regra não pode se espalhar entre cliente, RLS, triggers e funções;
- frontend não acessa tabelas diretamente;
- RLS funciona como defesa adicional, nunca como única autorização;
- banco e objetos exigem políticas próprias de backup e restauração.

**Recomendação: Opção I.** A Opção II é aceitável quando a redução de esforço operacional inicial tiver prioridade explícita e os adapters forem preservados.

## 7. Comparação das combinações mais prováveis

A pontuação abaixo usa escala de 1 a 5. Os pesos representam as prioridades atuais do projeto e devem ser revistos se a equipe ou a operação mudarem; não são um benchmark universal.

| Critério | Peso | F1 + A + I | F1 + B + I | F1 + A + II |
|---|---:|---:|---:|---:|
| manutenção por equipe pequena | 25% | 5 | 3 | 5 |
| controle de domínio e segurança | 20% | 5 | 5 | 4 |
| portabilidade de longo prazo | 15% | 5 | 5 | 3 |
| velocidade operacional inicial | 15% | 3 | 3 | 5 |
| realtime e confiabilidade | 10% | 4 | 5 | 4 |
| ecossistema de interface | 5% | 5 | 5 | 5 |
| preparação para IA | 10% | 5 | 4 | 5 |
| **resultado ponderado** | **100%** | **4,60** | **4,10** | **4,40** |

Conclusão: **F1 + A + I** oferece o melhor equilíbrio geral. **F1 + A + II** reduz trabalho operacional no início, mas aceita mais acoplamento. **F1 + B + I** é tecnicamente forte e deve ser escolhido quando houver preferência real por C# e capacidade de manter duas cadeias de ferramentas.

## 8. PostgreSQL e camada de dados

PostgreSQL deve ser a fonte de verdade em todas as combinações propostas.

- entidades e relações centrais usam tabelas e restrições explícitas;
- `jsonb` fica reservado a snapshots ou estruturas realmente variáveis;
- transações protegem rolagem, Evento de Sessão e outbox;
- Row-Level Security pode atuar como defesa adicional, nunca como única autorização;
- busca textual nativa vem antes de um banco vetorial;
- `pgvector` só entra depois de uma avaliação demonstrar ganho real.

### Decisão de ORM ou query builder

Não é profissional congelar essa escolha sem um teste curto no cenário real. Em outubro de 2026:

- Drizzle possui API SQL-like e migrações revisáveis, mas sua linha estável ainda é pré-1.0;
- Prisma 7 é suportado, enquanto Prisma 8 ainda está em transição de release;
- Kysely oferece SQL tipado e migrações, com menos abstração de domínio.

A prova técnica da Opção A terá no máximo três dias de engenharia e comparará versões fixadas de Kysely 0.29.x, Drizzle 0.45.x e Prisma 7.x. Não será usado o identificador `latest` durante a transição do Prisma 8.

Cada candidato executará o mesmo cenário:

1. transação de `RollAttempt + SessionEvent + Outbox`;
2. bloqueio otimista da ficha;
3. tipos próprios e enums versionados;
4. migração reversível ou recuperável;
5. testes com PostgreSQL real;
6. facilidade de usar SQL nativo sem escapar do controle do repositório.

| Critério | Peso |
|---|---:|
| clareza da transação e da outbox | 25% |
| migrações previsíveis e SQL revisável | 20% |
| segurança de tipos e mapeamento do domínio | 15% |
| escape controlado para SQL nativo | 10% |
| integração com testes em PostgreSQL real | 10% |
| manutenção e estabilidade do ecossistema | 10% |
| diagnóstico e desempenho | 10% |

O resultado foi registrado no relatório da prova e na ADR-0004. Kysely 0.29.6 com `pg` 8.23.1 foi aprovado após os três candidatos passarem pelo mesmo contrato em PostgreSQL 18.6.

A aplicação dependerá das interfaces de repositório, não da biblioteca vencedora.

## 9. Realtime confiável

Socket.IO resolve transporte, salas e reconexão; ele não substitui persistência. Sua garantia padrão é de entrega no máximo uma vez.

Fluxo obrigatório:

```text
validar comando
→ autorizar
→ reservar idempotência
→ persistir estado + evento + outbox
→ confirmar transação
→ relay durável lê a outbox
→ publicar evento identificado no canal autorizado
→ registrar despacho ou reagendar com backoff
→ cliente confirma ou retoma pela última sequência vista
```

Cada mensagem possui `eventId` e sequência no stream. Relay e consumidores são idempotentes porque uma queda após a publicação e antes da confirmação pode causar duplicata. Eventos não confirmados continuam disponíveis para retry; falhas repetidas seguem para inspeção operacional.

No primeiro ambiente, o relay pode executar no mesmo processo do backend, mas seu estado e seus retries permanecem no PostgreSQL. Não será aceito o padrão “commit e publicação apenas em memória”, pois ele perde eventos se o processo cair entre essas duas etapas. Redis ou outro broker só entra quando múltiplas instâncias, volume ou latência demonstrarem a necessidade.

Se Supabase for escolhido, Broadcast pode substituir o transporte inicial. Persistência, ordenação, autorização e replay continuam responsabilidades da aplicação.

## 10. Autenticação e sessão

Autenticação é uma decisão própria e precisa de ADR antes do primeiro ambiente compartilhado.

### Alpha técnica

- identidade fictícia fornecida por adapter de desenvolvimento;
- disponível somente em ambiente local ou de CI;
- papéis e permissões reais continuam sendo exercitados;
- nenhum bypass de desenvolvimento é compilado ou habilitado em produção.

### MVP de playtest

A decisão deve comparar um provedor gerenciado compatível com OpenID Connect, Supabase Auth quando a infraestrutura II for escolhida e uma alternativa autogerida somente se houver capacidade operacional. O ADR precisa cobrir:

- sessão em cookie `HttpOnly`, `Secure` e política `SameSite` explícita;
- criação, recuperação e exclusão de conta;
- rotação e revogação de sessão;
- autenticação da conexão realtime e autorização de cada inscrição ou comando;
- proteção contra CSRF, abuso e enumeração de contas;
- exportação de identidade e custo de troca do provedor.

Autenticação confirma quem é a pessoa. A matriz de permissões continua responsável por decidir o que ela pode fazer em cada Crônica.

## 11. Preparação para IA

A arquitetura deve ficar pronta para IA sem construir a IA agora.

```text
aplicação
→ porta AiAssistant
→ política de autorização e redaction
→ adapter de provedor
```

Preparação necessária desde o início:

- IDs estáveis e proveniência;
- conteúdo separado de regra executável;
- permissões resolvidas antes da recuperação;
- citações por fonte, edição, página e revisão;
- eventos estruturados;
- registro de modelo, versão de política, referências recuperadas, custo, duração e decisão humana;
- jobs de indexação fora das transações críticas;
- possibilidade de substituir o provedor.

Prompts, respostas e trechos de fontes não serão gravados integralmente por padrão. Logs de IA passam por redaction, controle de acesso, criptografia e política de retenção; conteúdo privado só pode ser recuperado depois da autorização e nunca aparece em telemetria comum.

Não são necessários no primeiro corte:

- framework de agentes como fundação do sistema;
- banco vetorial separado;
- GraphRAG;
- fine-tuning;
- IA com autoridade para alterar regra ou mundo.

Se OpenAI for adotada futuramente, o uso deve ocorrer no backend por adapter. A Responses API e os controles de retenção precisam ser avaliados novamente na data da integração.

## 12. Estrutura proposta do repositório após a decisão

A estrutura abaixo corresponde à combinação recomendada F1 + A + I. Se ASP.NET Core for escolhido, `apps/api` passa a ser uma solução .NET e os contratos TypeScript continuam sendo gerados a partir de OpenAPI.

```text
apps/
  web/                         # Next.js e experiência do usuário
  api/                         # NestJS e monólito modular
    src/modules/
      identity-access/
      characters/
      chronicles/
      sessions/
      rules/
      knowledge/
      audit/
packages/
  ui/                          # design system autoral
  contracts/                   # cliente HTTP gerado e schemas de eventos públicos
  rules-engine/                # avaliador puro de uso servidor; sem corpus protegido
  config/                      # configurações compartilhadas de tooling
database/
  migrations/
  seeds/                       # somente dados fictícios de desenvolvimento
infrastructure/
  docker/
  observability/
documentacao/
```

Não criar inicialmente:

- `apps/worker` sem trabalho assíncrono real;
- pacote genérico `shared`;
- microsserviços por módulo;
- Kubernetes;
- abstrações para bancos que o produto não usa.

Entidades de domínio não serão compartilhadas com o frontend. OpenAPI é a fonte do contrato HTTP; `packages/contracts` contém código gerado e schemas explícitos de eventos, não uma cópia dos objetos internos do backend.

## 13. Operação e controles de qualidade

Antes do primeiro ambiente compartilhado, a Architecture v0.1 deve definir:

- objetivos de recuperação `RPO` e `RTO` proporcionais ao playtest;
- backup automático do PostgreSQL, recuperação pontual quando disponível e teste real de restauração;
- versionamento ou política de recuperação dos objetos armazenados;
- segredos fora do repositório, com rotação e separação por ambiente;
- retenção e exclusão de conta, eventos, chat futuro e telemetria;
- logs estruturados com redaction;
- traces e métricas de backend via OpenTelemetry;
- procedimento de migração e recuperação quando rollback direto não for seguro.

OpenTelemetry será usado primeiro para traces e métricas do backend. Logs permanecem sob um logger estruturado próprio, e instrumentação no navegador só entra depois de avaliação de estabilidade, privacidade e custo.

Os gates automatizados mínimos serão:

| Nível | Verificação |
|---|---|
| unidade | domínio e Rules Engine puros, determinísticos |
| integração | repositórios, transações e migrações contra PostgreSQL real |
| contrato | OpenAPI e schemas de eventos compatíveis |
| arquitetura | dependências proibidas entre módulos falham no CI |
| ponta a ponta | fluxo do Vertical Slice em navegador real |
| interface | acessibilidade automatizada e revisão de redução de movimento |
| segurança | autorização negativa, segredo não recuperado e idempotência |

## 14. Marcos de entrega

### Marco A — Vertical Slice 01 / alpha técnica

Valida a arquitetura; ainda não é o MVP de playtest:

- login de desenvolvimento;
- Personagem e Crônica previamente preparados;
- tela “Boa noite”;
- ficha mínima;
- Roll Builder básico;
- Fome, Dificuldade, sucessos e resultados especiais;
- `RollAttempt` imutável persistido;
- `SessionEvent` separado e referenciando a tentativa;
- outbox, relay durável e Feed autorizado;
- papéis de Jogador e Narrador;
- idempotência, erro, retry e replay após reconexão.

### Marco B — MVP de playtest privado

Adiciona somente o necessário para uma pequena mesa usar o sistema:

- autenticação real;
- criação mínima de Personagem com os 14 clãs, Caitiff ou Sangue-Ralo;
- criação de Crônica, convite, Participação e Vínculo;
- início e encerramento de Sessão;
- uma Cena ativa;
- ficha utilizável;
- Feed de mensagens de sistema e eventos;
- rolagem básica rastreável;
- consulta curta da regra aplicada.

Suportar uma categoria de personagem no MVP não significa implementar imediatamente todos os 88 poderes catalogados.

Chat livre fica fora do MVP recomendado até um playtest demonstrar que o Feed e a ferramenta de voz já usada pelo grupo não atendem à mesa. Isso evita antecipar retenção de mensagens, moderação, abuso e privacidade sem validar o valor central do produto.

### Fora dos dois primeiros marcos

- SIRE e IA narrativa;
- criação integral com todas as exceções;
- dados 3D finais;
- escrita offline e sincronização;
- voz e vídeo;
- mapa tático;
- marketplace;
- microserviços e Kubernetes.

## 15. Decisões aprovadas

1. **Frontend:** F1, Next.js 16 com React e TypeScript.
2. **Backend:** A, NestJS 12 em monólito modular.
3. **Infraestrutura:** I, serviços portáveis com PostgreSQL 18.
4. **Sequência:** alpha técnica antes do MVP de playtest.
5. **Persistência:** prova técnica de até três dias antes do ADR de acesso a dados.
6. **MVP:** Feed sem chat livre integrado.

A decisão foi registrada como **F1 + A + I + alpha + prova de persistência + Feed sem chat**.

Os detalhes vigentes estão no [ADR-0001](../00-governanca/adr/0001-stack-web-e-monorepo.md), no [ADR-0002](../00-governanca/adr/0002-persistencia-eventos-e-realtime.md), no [ADR-0003](../00-governanca/adr/0003-identidade-da-alpha.md), no [ADR-0004](../00-governanca/adr/0004-biblioteca-acesso-dados.md), no [ADR-0005](../00-governanca/adr/0005-identificadores-uuidv7.md) e na [Architecture v0.1](./arquitetura-software-v0.1.md). O gate arquitetural foi aprovado; a criação de código começa pela Engineering Foundation, sem antecipar funcionalidades.

## 16. Fontes primárias consultadas

- [Política de suporte do Next.js](https://nextjs.org/support-policy)
- [App Router do Next.js](https://nextjs.org/docs/app)
- [PWA no Next.js](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [Implantação do Next.js](https://nextjs.org/docs/app/getting-started/deploying)
- [Motivação e arquitetura do Vite](https://vite.dev/guide/why.html)
- [Implantação de aplicações Vite](https://vite.dev/guide/static-deploy.html)
- [Ciclo de versões do Node.js](https://nodejs.org/en/about/previous-releases)
- [Módulos do NestJS](https://docs.nestjs.com/modules)
- [Gateways WebSocket do NestJS](https://docs.nestjs.com/websockets/gateways)
- [Migração para NestJS 12](https://docs.nestjs.com/migration-guide)
- [Radix Primitives](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [Motion para React](https://motion.dev/docs/react)
- [Testes de interface no Storybook](https://storybook.js.org/docs/writing-tests/index)
- [Estrutura de monorepo no Turborepo](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository)
- [Garantias de entrega do Socket.IO](https://socket.io/docs/v4/delivery-guarantees/)
- [Tipos JSON do PostgreSQL](https://www.postgresql.org/docs/current/datatype-json.html)
- [Row-Level Security do PostgreSQL](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Kysely e SQL tipado](https://www.kysely.dev/docs/intro)
- [Migrações com Drizzle](https://orm.drizzle.team/docs/migrations)
- [Estado de releases do Prisma](https://www.prisma.io/docs/orm/release-status)
- [pgvector](https://github.com/pgvector/pgvector)
- [Arquitetura do Supabase](https://supabase.com/docs/guides/getting-started/architecture)
- [SignalR no ASP.NET Core](https://learn.microsoft.com/aspnet/core/signalr/introduction)
- [Política de suporte do .NET](https://dotnet.microsoft.com/platform/support/policy)
- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [OpenTelemetry para JavaScript](https://opentelemetry.io/docs/languages/js/)
- [OpenAI API — início rápido e Responses API](https://platform.openai.com/docs/quickstart)
- [Controles de dados da OpenAI API](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)
