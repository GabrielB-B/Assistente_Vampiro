# Modelo de Ameaças — VS01-02 v0.1

**Status:** concluído e verificado<br>
**Data:** 21 de outubro de 2026<br>
**Última revisão:** 23 de outubro de 2026<br>
**Escopo:** identidade fictícia, seed, ficha mínima e políticas de acesso do alpha

## 1. Objetivo

Identificar como o contexto controlado do alpha pode conceder acesso indevido,
vazar um segredo ou contaminar outro ambiente. Este documento acompanha o
código e seus testes; não é uma lista genérica para revisão futura.

## 2. Ativos protegidos

- identidade da Conta que executa a ação;
- propriedade da Personagem;
- Participação e papel dentro de cada Crônica;
- Vínculo entre Personagem, Participação e Crônica;
- anotações privadas do Narrador;
- estado da Sessão e da Cena;
- configuração do ambiente e credenciais do banco.

Todos os dados do seed são fictícios. Mesmo assim, os controles usados para
decidir acesso são os mesmos que deverão receber a identidade real no MVP.

## 3. Fronteiras

```text
cabeçalho não confiável
→ AlphaIdentityProvider
→ ActorContext sem papel
→ leitura mínima de propriedade, Participação e Vínculo
→ política de acesso
→ futuro caso de uso autorizado
```

O alias prova somente qual fixture está sendo usada. Papel, propriedade e
visibilidade não vêm do cabeçalho e não são aceitos do cliente.

## 4. Ameaças e controles

| Ameaça | Impacto | Controle implementado | Evidência |
|---|---|---|---|
| cliente envia UUID ou alias inventado | assumir outra identidade | allowlist fechada de quatro aliases; UUID nunca é aceito como identidade | testes do `AlphaIdentityProvider` |
| adapter fictício inicia fora do alpha | acesso sem autenticação real | allowlist `local`, `test` e `ci`; `NODE_ENV=production` prevalece sobre qualquer `APP_ENV`; ausência ou outro ambiente falha no startup | testes de ambiente e ADR-0003 |
| Jogador troca o ID da Personagem | acesso horizontal | propriedade, Participação e Vínculo são lidos do banco e avaliados juntos | teste unitário e integração PostgreSQL |
| cliente declara papel de Narrador | elevação de privilégio | papéis vêm exclusivamente da Participação persistida | teste negativo da política de Crônica |
| Participação suspensa continua válida | acesso depois de revogação | apenas estado `active` concede acesso | teste negativo da política de Crônica |
| Vínculo ausente ou encerrado é ignorado | rolagem ou leitura fora da Crônica | controle e visão do Narrador exigem Vínculo `active` na mesma Crônica | testes da política de Personagem |
| evento privado chega ao Jogador | vazamento de segredo narrativo | política de visibilidade exige papel `STORYTELLER` | teste da política de Feed |
| seed roda em ambiente compartilhado | sobrescrita ou exposição operacional | mesma allowlist fechada do adapter e comando separado | teste de `assertAlphaEnvironment` |
| seed repetido duplica fixtures | estado inconsistente | IDs fixos, transação única e conflitos tratados por chave | integração PostgreSQL executa o seed duas vezes |
| falha no meio do seed deixa estado parcial | relações quebradas | todas as escritas acontecem em uma transação | implementação e teste de integridade |
| consulta carrega segredo antes de autorizar | exposição acidental em memória ou log | reader retorna somente IDs, estado, papéis e relações necessários | contrato de `CharacterAccessContext` |
| negação confirma recurso privado | enumeração | código externo `RESOURCE_NOT_AVAILABLE` para recurso alheio, Vínculo ausente e segredo | testes negativos das políticas |
| dependência vulnerável entra no build | execução de código, indisponibilidade ou comprometimento da cadeia | versões exatas, lockfile congelado e auditoria bloqueante na CI | `security:audit` e workflow de integração contínua |

## 5. Decisões de implementação

- `ActorContext` não contém papel nem permissão.
- As políticas são puras e não conhecem HTTP, NestJS ou o adapter de identidade.
- O reader de autorização faz uma única consulta e não retorna nome, conceito,
  Fome, características nem notas da Cena.
- A ficha mínima usa linhas tipadas por característica e IDs estáveis; o corpo
  inteiro não é armazenado em JSON opaco.
- A revisão publicada do perfil é imutável; repetir o seed não reescreve sua
  definição.
- O outsider possui Conta fictícia, mas nenhuma Participação. Assim, os testes
  separam autenticação válida de autorização na Crônica.

## 6. Riscos que permanecem fora deste incremento

- o endpoint funcional que lê `x-alpha-identity` foi entregue no VS01-03; seus
  controles e riscos estão registrados no
  [Modelo de Ameaças do VS01-03](./modelo-ameacas-vs01-03-v0.1.md);
- autenticação real, sessão, CSRF e ciclo de vida de Conta pertencem ao MVP de
  playtest e exigirão ADR próprio;
- revogação de inscrição Socket.IO será comprovada no VS01-06;
- não há dados reais nem implantação pública autorizada nesta fase.

Esses itens são limites explícitos, não autorizações para publicar o alpha.

## 7. Gate de encerramento

- [x] identidade arbitrária e ambiente indevido falham de forma fechada;
- [x] políticas de propriedade, Participação, papel, Vínculo e visibilidade têm
  testes positivos e negativos;
- [x] ficha mínima possui migração aditiva e constraints;
- [x] seed é transacional e idempotente por construção;
- [x] vulnerabilidades críticas do Next.js foram corrigidas e o framework foi
  atualizado para `16.4.2`;
- [x] dependência transitiva vulnerável e não utilizada foi removida do grafo;
- [x] migrações, seed e políticas passam contra PostgreSQL 18 na CI;
- [x] diff final não contém segredo, material privado ou bypass temporário;
- [x] revisão humana do lote concluída.

O gate foi encerrado em 23 de outubro de 2026. A execução local de integração
continua dependente de Docker ou PostgreSQL 18 disponível, mas a mesma suíte foi
executada com sucesso na CI protegida da `main` durante a entrega do VS01-02.
