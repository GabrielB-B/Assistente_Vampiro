# ADR-0003 — Identidade controlada no alpha técnico

**Status:** aceita<br>
**Data:** 2026-10-08<br>
**Responsável:** responsável do produto<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

O alpha precisa exercitar autorização por papel e recurso antes de o provedor de identidade do MVP estar escolhido. Um bypass improvisado poderia vazar para um ambiente compartilhado e invalidar os testes de segurança.

## Decisão

O alpha usa um adapter de identidade fictícia com usuários e papéis determinísticos. Ele só pode iniciar em `local`, `test` ou `ci`. Qualquer outro ambiente falha no startup se o adapter estiver selecionado.

As políticas de autorização são as mesmas que serão usadas com identidade real. O adapter substitui somente a prova de identidade; não concede acesso irrestrito nem contorna casos de uso.

## Consequências

- o fluxo técnico pode ser validado sem escolher fornecedor cedo demais;
- testes negativos de permissão continuam obrigatórios;
- nenhum ambiente compartilhado pode usar a identidade fictícia;
- autenticação real e ciclo de vida de conta permanecem gate do MVP de playtest.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---:|---:|---|
| adapter habilitado por engano | baixa | crítico | allowlist de ambientes e falha no startup |
| testes irreais | média | alto | mesmas claims mínimas e mesmas políticas do adapter futuro |
| código de bypass espalhado | baixa/média | alto | uma porta `IdentityProvider`; proibir condicionais por ambiente no domínio |

## Evidências e referências

- [Escopo do Alpha Técnico v0.1](../../05-planejamento/escopo-alpha-tecnica-v0.1.md)
- [Architecture v0.1](../../04-arquitetura/arquitetura-software-v0.1.md)
- DEC-007, DEC-008 e DEC-030.

## Critério de revisão

Este ADR deixa de reger a execução antes do primeiro ambiente compartilhado. A escolha de OIDC e sessão web exigirá ADR próprio.

## Plano de migração ou reversão

Implementar um novo adapter da mesma porta, mapear o identificador externo para `Account` e remover o adapter fictício dos artefatos de produção.
