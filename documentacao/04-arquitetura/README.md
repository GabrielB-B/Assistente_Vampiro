# Arquitetura de software

**Estado:** Architecture v0.1 aprovada<br>
**Estilo aprovado:** monólito modular<br>
**Stack aprovada:** Next.js + NestJS + PostgreSQL em infraestrutura portável<br>
**Próximo gate:** setup limpo e reproduzível da Engineering Foundation

Esta área transforma as decisões de produto e domínio em limites técnicos verificáveis.

## Documentos atuais

- [Modelo de Domínio v0.1](./dominio/modelo-dominio-v0.1.md)
- [Opções Tecnológicas v0.1](./opcoes-tecnologicas-v0.1.md)
- [Pesquisa de Benchmarks de Plataformas de RPG v0.1](./pesquisa-benchmarks-plataformas-rpg-v0.1.md)
- [Architecture v0.1 — Arquitetura de Software](./arquitetura-software-v0.1.md)
- [Permissions & Visibility Matrix v0.1](./permissoes-visibilidade-v0.1.md)
- [Rules Engine Scope v0.1](./escopo-rules-engine-v0.1.md)
- [Provas de arquitetura](./provas/README.md)
- [Prova de Persistência v0.1](./provas/prova-persistencia-v0.1.md)
- [Resultado da Prova de Persistência v0.1](./provas/resultado-persistencia-v0.1.md)

## Áreas previstas

| Área | Responsabilidade | Quando materializar |
|---|---|---|
| visão geral | contexto C4, containers e dependências | definido na Architecture v0.1 |
| frontend | navegação, estado, design system, mídia e acessibilidade | definido; detalhar durante a foundation |
| backend | módulos, casos de uso, contratos e realtime | definido; detalhar por vertical slice |
| dados | PostgreSQL, migrações, transações e retenção | Kysely aprovado pela ADR-0004 |
| inteligência artificial | portas, segurança, proveniência e avaliação | antes da primeira integração com IA |
| segurança | ameaças, autenticação, autorização e segredos | junto da matriz de permissões |
| operação | implantação, observabilidade, backup e recuperação | antes do primeiro ambiente compartilhado |

Pastas vazias não serão criadas apenas para aparentar estrutura. Cada área nasce com seu primeiro documento aprovado.

## Trilhos de trabalho

Com a decisão tecnológica registrada, dois trilhos avançam em paralelo:

```text
trilho técnico: prova de persistência → ADR-0004 → ADR-0005 → foundation
trilho de domínio: permissões → Fatia 01 de regras → Rules Engine Scope
                                      ↓
                         aprovação da Architecture v0.1
                                      ↓
                         esqueleto + CI + Vertical Slice 01
```

O trilho de domínio foi concluído para a Fatia 01, a prova de persistência foi executada, as ADRs foram aceitas e a Architecture v0.1 foi aprovada. A Engineering Foundation é o próximo trabalho autorizado.
