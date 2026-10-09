# Índice da documentação

**Estado do projeto:** Engineering Foundation<br>
**Atualização:** 9 de outubro de 2026<br>
**Entrada oficial:** este arquivo

Esta documentação está organizada por área de conhecimento. Os prefixos numéricos mantêm uma ordem previsível; eles não representam sprints nem obrigam que as áreas evoluam isoladamente.

## Mapa

| Área | Conteúdo | Entrada |
|---|---|---|
| `00-governanca` | decisões, padrões e ADRs | [Governança](./00-governanca/README.md) |
| `01-produto` | visão, limites e fluxos do produto | [Produto](./01-produto/README.md) |
| `02-design-experiencia` | identidade, arte aplicada e calibrações | [Design e experiência](./02-design-experiencia/README.md) |
| `03-dominio-regras` | corpus, linguagem, regras e rastreabilidade | [Domínio e regras](./03-dominio-regras/README.md) |
| `04-arquitetura` | domínio, opções técnicas e arquitetura executável | [Arquitetura](./04-arquitetura/README.md) |
| `05-planejamento` | fases, gates e sequência de entregas | [Planejamento](./05-planejamento/README.md) |
| `99-modelos` | modelos para novos documentos | [Modelos](./99-modelos/README.md) |

## Ordem de leitura recomendada

1. [Fundação de Produto e Experiência v0.2](./01-produto/fundacao-produto-experiencia-v0.2.md)
2. [Arquitetura de Produto e Fluxos Principais v0.1](./01-produto/arquitetura-produto-fluxos-principais-v0.1.md)
3. [Calibração visual — Boa noite, Marcus v0.1](./02-design-experiencia/calibracoes/boa-noite-marcus-v0.1.md)
4. [Inventário de Fontes v0.1](./03-dominio-regras/inventario-fontes-v0.1.md)
5. [Linha Normativa v0.1](./03-dominio-regras/linha-normativa-v0.1.md)
6. [Modelo de Domínio v0.1](./04-arquitetura/dominio/modelo-dominio-v0.1.md)
7. [Opções Tecnológicas v0.1](./04-arquitetura/opcoes-tecnologicas-v0.1.md)
8. [Pesquisa de Benchmarks de Plataformas de RPG v0.1](./04-arquitetura/pesquisa-benchmarks-plataformas-rpg-v0.1.md)
9. [Architecture v0.1 — Arquitetura de Software](./04-arquitetura/arquitetura-software-v0.1.md)
10. [Permissions & Visibility Matrix v0.1](./04-arquitetura/permissoes-visibilidade-v0.1.md)
11. [Rules Engine Scope v0.1](./04-arquitetura/escopo-rules-engine-v0.1.md)
12. [Prova de Persistência v0.1](./04-arquitetura/provas/prova-persistencia-v0.1.md)
13. [Resultado da Prova de Persistência v0.1](./04-arquitetura/provas/resultado-persistencia-v0.1.md)
14. [ADR-0004 — Biblioteca de acesso a dados](./00-governanca/adr/0004-biblioteca-acesso-dados.md)
15. [ADR-0005 — Identificadores UUIDv7](./00-governanca/adr/0005-identificadores-uuidv7.md)
16. [Escopo do Alpha Técnico v0.1](./05-planejamento/escopo-alpha-tecnica-v0.1.md)
17. [Registro de Decisões](./00-governanca/registro-decisoes.md)
18. [Roadmap de Engenharia v0.1](./05-planejamento/roadmap-engenharia-v0.1.md)
19. [Engineering Foundation v0.1](./05-planejamento/engineering-foundation-v0.1.md)

## Situação por etapa

| Etapa | Estado | Resultado ou próximo gate |
|---|---|---|
| fundação de produto | concluída | visão e limites consolidados |
| direção visual | em evolução controlada | calibração aprovada; sistema visual ainda em proposta |
| corpus inicial | concluído | três fontes auditadas e linha normativa aprovada |
| Modelo de Domínio v0.1 | aprovado | decisões registradas e versionadas |
| arquitetura técnica | aprovada | Architecture v0.1 e cinco ADRs aceitas |
| permissões e Rules Engine | concluída para a Fatia 01 | matriz, escopo e oito regras aprovados |
| Engineering Foundation | em andamento | FND-01 concluída; FND-02 é o próximo corte |
| Vertical Slice 01 | não iniciado | após os gates da Engineering Foundation |
| MVP de playtest | planejado | após validar o corte vertical interno |

## Documentos de governança obrigatórios

- [Registro de Decisões](./00-governanca/registro-decisoes.md)
- [Padrões de Qualidade de Engenharia v0.1](./00-governanca/padroes-qualidade-engenharia-v0.1.md)
- [Fluxo Git v0.1](./00-governanca/fluxo-git-v0.1.md)
- [Template de ADR](./00-governanca/adr/0000-template.md)
- [ADR-0001 — Stack web e monorepo TypeScript](./00-governanca/adr/0001-stack-web-e-monorepo.md)
- [ADR-0002 — Persistência, eventos e realtime confiável](./00-governanca/adr/0002-persistencia-eventos-e-realtime.md)
- [ADR-0003 — Identidade controlada no alpha técnico](./00-governanca/adr/0003-identidade-da-alpha.md)
- [ADR-0004 — Biblioteca de acesso a dados](./00-governanca/adr/0004-biblioteca-acesso-dados.md) — aceita.
- [ADR-0005 — Identificadores UUIDv7](./00-governanca/adr/0005-identificadores-uuidv7.md) — aceita.
- [Roadmap de Engenharia v0.1](./05-planejamento/roadmap-engenharia-v0.1.md)

## Política de status

| Status | Significado |
|---|---|
| `rascunho` | material incompleto e exploratório |
| `proposta` | pronto para discussão, ainda sem força de decisão |
| `aprovado` | decisão vigente |
| `consolidado` | base estável que reúne decisões aprovadas |
| `substituído` | preservado por histórico, mas não vigente |
| `arquivado` | fora do plano ativo |

## Convenções de organização

- caminhos usam minúsculas, ASCII e `kebab-case`;
- títulos internos permanecem em português natural;
- cada assunto possui uma fonte de verdade identificável;
- documentos grandes não são divididos junto com mudanças de conteúdo;
- novas pastas só são criadas quando houver um artefato real;
- PDFs, extrações integrais e outros materiais privados permanecem em `fontes-privadas/`, fora do Git.

## Precedência documental

Quando houver divergência:

1. instrução explícita e mais recente aprovada;
2. ADR aceito mais recente;
3. decisão aceita no Registro de Decisões;
4. documento de maior versão;
5. documento de data mais recente.

Nenhuma divergência relevante deve ser resolvida silenciosamente no código.
