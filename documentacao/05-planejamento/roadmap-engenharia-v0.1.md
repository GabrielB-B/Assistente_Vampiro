# Roadmap de Engenharia v0.1

**Status:** aprovado<br>
**Data:** 1º de outubro de 2026  
**Última revisão:** 8 de outubro de 2026<br>
**Horizonte:** descoberta de regras até primeiro corte executável

---

## 1. Objetivo

Organizar a evolução do projeto em fases verificáveis, com decisões explícitas, riscos controlados e entregas pequenas.

O roadmap evita:

- começar pela tecnologia;
- modelar regras por memória;
- implementar toda a plataforma de uma vez;
- fechar telas antes dos fluxos;
- distribuir o sistema prematuramente;
- adicionar IA antes de permissões e fontes confiáveis;
- versionar livros e assets sem autorização.

---

## 2. Princípios de engenharia adotados

### Domain-Driven Design

- linguagem ubíqua;
- limites de domínio explícitos;
- modelo construído a partir de regras reais;
- separação entre Core, Game Rules e Knowledge.

### Clean Architecture

- regra de negócio independente de framework;
- dependências apontam para o domínio;
- UI, banco e serviços externos são detalhes substituíveis.

### Arquitetura evolutiva

- decisões reversíveis permanecem simples;
- decisões difíceis são registradas;
- qualidade é verificada continuamente;
- decomposição ocorre quando houver evidência.

### Entrega contínua

- branches curtas;
- commits pequenos;
- build reproduzível;
- testes automatizados;
- integração frequente;
- deploy sem depender de mudanças manuais ocultas.

### Vertical slicing

Cada incremento atravessa UI, domínio, persistência e testes, entregando comportamento observável.

---

## 3. Visão das fases

```mermaid
flowchart LR
    F0[Fase 0\nGovernança] --> F1[Fase 1\nRules Discovery]
    F1 --> F2[Fase 2\nDomain Model]
    F2 --> F3[Fase 3\nPermissions e Rules Scope]
    F2 --> F4[Fase 4\nArchitecture e ADRs]
    F3 --> G[Gate de arquitetura]
    F4 --> G
    G --> F5[Fase 5\nEngineering Foundation]
    F5 --> F6[Fase 6\nVertical Slice 01]
    F6 --> F7[Fase 7\nValidação e evolução]
```

---

## 4. Fase 0 — Governança e baseline documental

### Entregas

- README do projeto;
- índice da documentação;
- roadmap;
- registro de decisões;
- política de contribuição;
- `.gitignore` protegendo conteúdo privado;
- templates de ADR e regra.

### Critério de saída

- repositório pode ser clonado em outro computador;
- documentos possuem ordem de leitura;
- nenhuma fonte protegida está versionada;
- próximos passos estão explícitos.

### Estado

**Concluído nesta baseline.**

---

## 5. Fase 1 — Rules & Content Discovery v0.1

### Objetivo

Construir um corpus mínimo e rastreável para modelar a primeira mecânica executável.

### Escopo inicial

- edição V5;
- testes básicos;
- parada de dados;
- dificuldade;
- Fome;
- sucessos e falhas;
- críticos;
- Crítico Bestial;
- Falha Bestial.

### Entregas

- inventário de fontes;
- glossário inicial;
- regras estruturadas pelo template;
- catálogo regra → fonte → cenário → teste;
- dúvidas e conflitos registrados;
- classificação de direitos e uso sobre o que pode entrar no Git.

### Critério de saída

- todas as regras do primeiro Roll Builder possuem fonte;
- exceções conhecidas estão registradas;
- exemplos podem virar testes determinísticos;
- nenhuma regra depende apenas de interpretação informal.

### Estado

**Corpus inicial ingerido; especificações em elaboração.** Livro Básico, Companion e Players Guide foram identificados, extraídos e auditados em `fontes-privadas/`. A linha normativa dos três livros foi registrada. O Gate A foi satisfeito; a aprovação humana das regras executáveis continua obrigatória antes da implementação.

---

## 6. Fase 2 — Domain Model v0.1

### Objetivo

Formalizar linguagem, entidades, agregados, invariantes e eventos.

### Módulos candidatos

```text
Identity & Access
Character
Chronicle
Session
Game Rules
Knowledge
Media
```

### Decisões prioritárias

- Character canônico versus estado por Crônica;
- Participação do Usuário, papéis e Vínculo de Personagem;
- propriedade e edição de ficha;
- sessão, cena, Resultado de Rolagem, Evento de Sessão, Feed da Mesa e Trilha de Auditoria;
- identidade e imutabilidade de cada `RollAttempt` e sua referência por um Evento de Sessão separado;
- edição e versionamento de regra;
- proveniência de conteúdo.

### Entregas

- mapa de bounded contexts;
- glossário canônico;
- agregados e invariantes;
- eventos de domínio;
- diagramas conceituais;
- riscos de consistência.

### Critério de saída

- o primeiro corte vertical pode ser explicado sem citar framework ou banco;
- invariantes possuem responsável claro;
- fronteiras entre conteúdo e regra são explícitas;
- termos ambíguos foram eliminados ou registrados.

### Estado

**Concluída.** O Modelo de Domínio v0.1 foi aprovado em 6 de outubro de 2026. Evoluções permanecem versionadas e sujeitas ao Registro de Decisões.

---

## 7. Fase 3 — Permissões e escopo do Rules Engine

### Entregas

- Permissions & Visibility Matrix v0.1;
- Rules Engine Scope v0.1;
- estados de publicação;
- política de segredo;
- contratos conceituais de rolagem;
- cenários Given/When/Then.

### Critério de saída

- cada operação do corte vertical possui ator autorizado;
- dados proibidos são filtrados antes da recuperação;
- entradas e saídas do Rules Engine estão definidas;
- idempotência e auditoria do primeiro corte possuem comportamento conhecido;
- reroll está explicitamente adiado e não bloqueia a primeira fatia.

### Estado

**Em andamento.** A matriz de permissões e a primeira regra executável evoluem em paralelo à prova técnica de persistência, sem iniciar código de produção.

---

## 8. Fase 4 — Architecture v0.1 e ADRs

### Entregas

- diagrama de contexto C4;
- diagrama de containers;
- módulos do monólito;
- persistência;
- autenticação e autorização;
- estratégia de realtime;
- armazenamento de mídia;
- limites de integração com IA;
- implantação inicial;
- ADRs das decisões relevantes.

### ADRs do gate atual

1. ADR-0001 — stack web e monorepo TypeScript: **aceita**;
2. ADR-0002 — persistência, eventos e realtime confiável: **aceita**;
3. ADR-0003 — identidade controlada no alpha: **aceita**;
4. ADR-0004 — biblioteca de acesso a dados: **após a prova técnica**.

Autenticação real, storage, IA e decomposição só recebem ADR quando entrarem num corte aprovado. Não serão criadas decisões ornamentais para tecnologia ainda não usada.

### Critério de saída

- trade-offs estão documentados;
- dependências externas possuem justificativa;
- segurança e operação foram consideradas;
- a arquitetura suporta o corte vertical sem antecipar o produto inteiro.

### Estado

**Em revisão.** A stack foi aceita, os três primeiros ADRs foram registrados e a Architecture v0.1 foi produzida. A aprovação final depende da matriz de permissões, da primeira regra executável e da prova de persistência com ADR-0004.

---

## 9. Fase 5 — Engineering Foundation

### Entregas

- estrutura do projeto;
- gerenciador de dependências e lockfile;
- lint e formatação;
- testes unitários e de integração;
- validação de tipos;
- pipeline de CI;
- ambiente local documentado;
- migrações de banco;
- dados de desenvolvimento seguros;
- observabilidade mínima;
- política de branches e releases.

### Quality gates iniciais

- build reproduzível;
- lint sem erros;
- typecheck sem erros;
- testes verdes;
- nenhuma credencial no Git;
- migração aplicável em banco vazio;
- documentação de setup validada em máquina limpa.

### Critério de saída

Um novo colaborador consegue clonar, configurar, testar e executar o esqueleto seguindo somente o README.

---

## 10. Fase 6 — Vertical Slice 01

### Fluxo

```text
Autenticar
→ Selecionar personagem
→ Boa noite
→ Abrir ficha
→ Montar rolagem
→ Resolver regra
→ Persistir o evento de rolagem
→ Exibir o resultado no Feed da Mesa
```

### Entregas funcionais

- autenticação mínima;
- personagem de teste;
- Crônica, Participação do Usuário e Vínculo de Personagem de teste;
- ficha mínima;
- Roll Builder;
- Fome;
- Rules Engine determinístico;
- Evento de Sessão persistido;
- resultado projetado no Feed da Mesa;
- visualização por Jogador e Narrador;
- tratamento de erro e reconexão essencial.

### Estratégia de testes

- unitários para regras puras;
- tabelados para resultados e exceções;
- integração para persistência e autorização;
- contrato para eventos;
- ponta a ponta para o caminho crítico;
- acessibilidade automatizada básica;
- revisão manual da experiência visual.

### Critério de saída

- fluxo completo executável;
- resultados reproduzíveis;
- autorização validada no backend;
- submissões repetidas não duplicam Eventos de Sessão;
- falhas críticas são observáveis;
- documentação corresponde ao comportamento.

---

## 11. Fase 7 — Validação e evolução

### Atividades

- testar com jogadores e Narradores;
- medir fricção;
- revisar linguagem;
- corrigir modelo com evidência;
- priorizar próximo corte;
- registrar novas decisões em ADRs.

### Próximos cortes candidatos

1. reroll com Força de Vontade;
2. criação guiada;
3. Scene Beats e mudança de cena;
4. NPCs On Deck;
5. Biblioteca contextual;
6. Cidade e locais;
7. Coterie e relações;
8. SIRE.

---

## 12. Estratégia de branches e releases

### Durante documentação

- `main` deve permanecer utilizável como fonte de verdade;
- mudanças maiores entram por branch e pull request;
- versões relevantes recebem tag.

### Sugestão de tags

```text
docs-baseline-v0.1
domain-model-v0.1
architecture-v0.1
vertical-slice-v0.1
```

### Releases

Não usar versão `1.0.0` antes de existir produto jogável e política de compatibilidade.

---

## 13. Riscos principais

| Risco | Impacto | Tratamento |
|---|---:|---|
| Escopo amplo demais | alto | cortes verticais e critérios de saída |
| Regras interpretadas incorretamente | alto | proveniência, exemplos e revisão |
| Vazamento de segredos da Crônica | alto | autorização antes da recuperação |
| Conteúdo sem licença | alto | corpus privado fora do Git e revisão jurídica |
| UI bonita sem fluxo sustentável | médio/alto | arquitetura da informação antes de novas telas finais |
| Acoplamento de regra à UI | alto | domínio e Rules Engine independentes |
| Realtime complexo prematuramente | médio | validar necessidade no primeiro corte |
| Microsserviços prematuros | médio/alto | monólito modular inicial |
| Dependência obrigatória de IA | alto | produto funcional sem IA |
| Ausência de testes de regras | alto | exemplos executáveis e testes tabelados |

---

## 14. Métricas de saúde do projeto

### Produto

- tempo até primeira rolagem;
- passos para abrir uma regra contextual;
- capacidade de retomar sessão sem perder contexto;
- compreensão por iniciante;
- trabalho administrativo do Narrador.

### Engenharia

- build e testes verdes;
- tempo de feedback da CI;
- defeitos por regra alterada;
- migrações reversíveis ou recuperáveis;
- incidentes de autorização;
- diferença entre documentação e comportamento.

### Arquitetura

- dependências entre módulos;
- regras puras sem dependência de infraestrutura;
- cobertura dos cenários críticos;
- quantidade de decisões não registradas;
- capacidade de substituir integrações externas.

---

## 15. Referências metodológicas

Este plano é influenciado por princípios apresentados em:

- *Domain-Driven Design*, Eric Evans;
- *Implementing Domain-Driven Design*, Vaughn Vernon;
- *Clean Architecture*, Robert C. Martin;
- *Fundamentals of Software Architecture*, Mark Richards e Neal Ford;
- *Building Evolutionary Architectures*, Neal Ford, Rebecca Parsons e Patrick Kua;
- *Software Architecture: The Hard Parts*, Neal Ford, Mark Richards, Pramod Sadalage e Zhamak Dehghani;
- *Designing Data-Intensive Applications*, Martin Kleppmann;
- *Continuous Delivery*, Jez Humble e David Farley;
- *Accelerate*, Nicole Forsgren, Jez Humble e Gene Kim;
- *User Story Mapping*, Jeff Patton.

As referências orientam o raciocínio. Elas não substituem decisões baseadas nas restrições reais do produto.

---

## 16. Próxima ação concreta

1. executar a prova de persistência com Kysely, Drizzle e Prisma em código descartável;
2. registrar o resultado no ADR-0004;
3. concluir Permissions & Visibility Matrix, `RULE-ROLL-001` a `RULE-ROLLFLOW-001` e Rules Engine Scope;
4. revisar e aprovar a Architecture v0.1;
5. criar o esqueleto executável e o CI somente após esse gate;
6. implementar e validar o alpha técnico antes do MVP de playtest.
