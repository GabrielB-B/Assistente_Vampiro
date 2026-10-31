# Modelo de Ameaças — VS01-03 v0.1

**Status:** primeiro corte e fundação da Ficha independente implementados e verificados<br>
**Data:** 30 de outubro de 2026<br>
**Escopo:** entrada do Jogador, projeção HTTP e escrita parcial da Ficha

## 1. Ativos e fronteiras

Ativos protegidos:

- propriedade e conteúdo da Personagem;
- Participação, papel e Vínculo na Crônica;
- notas privadas do Narrador;
- identidade atuante;
- configuração e credenciais do banco.

Fronteira principal:

```text
navegador não confiável
→ alias do alpha em allowlist
→ ActorContext sem papel
→ leitura mínima de autorização
→ política de acesso
→ projeção narrativa reduzida
```

## 2. Ameaças e controles

| Ameaça | Controle | Evidência |
|---|---|---|
| trocar `characterId` ou `chronicleId` | política combina propriedade, Participação e Vínculo; negação retorna `404` genérico | unidade, PostgreSQL e teste HTTP |
| declarar papel ou proprietário no cliente | contrato não aceita esses campos; ambos vêm do banco | tipos públicos e adapter |
| buscar narrativa antes da autorização | listagem separa candidatos mínimos da projeção; consulta direta autoriza antes de `readSheet` | teste que confirma que o reader narrativo não é chamado |
| enumerar Personagens por diferença de erro | ausência e negação usam `RESOURCE_NOT_AVAILABLE` e `404` | controller e teste HTTP |
| acoplar ou expor dados de Sessão/Cena pela Ficha | contrato canônico e reader da Ficha não consultam nem publicam Sessão ou Cena | tipos públicos e integração PostgreSQL |
| usar alias inventado ou UUID como identidade | `AlphaIdentityProvider` aplica allowlist fechada | testes existentes de identidade |
| ativar identidade fictícia em ambiente compartilhado | startup falha fora de `local`, `test` e `ci` | ADR-0003 e testes de ambiente |
| confiar cegamente no JSON da API | cliente valida envelope, identidade, lista, ficha e Características antes de renderizar | testes do frontend |
| registrar segredo em erro ou log | erros públicos usam código, mensagem segura e correlation ID; observabilidade aplica campos controlados | contrato e middleware |
| exigir Crônica para autorizar o proprietário | contexto mínimo lê somente `characterId` e proprietário; política decide antes da projeção | unidade e integração PostgreSQL |
| sobrescrever edição concorrente | `expectedVersion` participa do `UPDATE`; divergência retorna `VERSION_CONFLICT` | unidade, HTTP e PostgreSQL |
| enviar proprietário no corpo | contrato rejeita campos desconhecidos; Conta atuante vem do adapter de identidade | teste HTTP |
| alterar ficha sem trilha | atualização e `audit_entry` confirmam ou falham na mesma transação | integração PostgreSQL |

## 3. Riscos restantes

- `x-alpha-identity` não é autenticação e não autoriza implantação compartilhada;
- ainda não existe rate limit por Conta e recurso;
- o contrato TypeScript precede a geração OpenAPI, que continua como gate;
- autenticação real, cookie, CSRF e sessão pertencem ao MVP de playtest;
- o frontend usa uma prévia de parada local; a API autoritativa entra no VS01-04.
- criação persistente do rascunho aguarda decisões sobre `kind` e perfil V5;
- autenticação real e proteção CSRF continuam obrigatórias antes de escrita em ambiente compartilhado.

## 4. Decisão operacional

Este corte pode ser usado somente em desenvolvimento, teste e demonstração local
com dados fictícios. Não há autorização para expor a API do alpha na internet.
