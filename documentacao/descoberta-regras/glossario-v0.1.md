# Glossário Controlado v0.1

**Status:** rascunho<br>
**Estado da fase:** termos do jogo aguardam validação nas fontes<br>
**Escopo:** primeiro fluxo de rolagem

---

## 1. Regra de uso

Um termo só recebe estado `oficial` quando sua forma em português for confirmada em uma fonte oficial da edição adotada.

Estados:

- **canônico do produto:** aprovado nos documentos internos;
- **oficial:** confirmado em publicação oficial;
- **revisado:** interpretação interna conferida;
- **provisório:** forma de trabalho ainda não confirmada;
- **depreciado:** não deve aparecer em conteúdo novo.

---

## 2. Vocabulário do produto

| ID | Termo | Definição curta | Estado | Fonte interna |
|---|---|---|---|---|
| TERM-PROD-001 | Usuário | pessoa autenticada na plataforma | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-002 | Personagem | identidade jogável pertencente ao usuário | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-003 | Crônica | contexto compartilhado de campanha | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-004 | Participação na Crônica | relação entre Usuário e Crônica que contém papel e permissões | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-005 | Vínculo de Personagem | relação que representa a presença de um Personagem em uma Crônica | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-006 | Mesa | superfície persistente da sessão | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-007 | Biblioteca | conteúdo editorial que explica regras e lore | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-008 | Rules Engine | sistema determinístico que resolve mecânicas | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-009 | Resultado de Rolagem | saída mecânica produzida pelo Rules Engine | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-010 | Evento de Sessão | ocorrência persistida de uma ação confirmada durante a sessão | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-011 | Chat | capacidade de enviar mensagens autorizadas durante a sessão | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-012 | Feed da Mesa | linha do tempo que projeta mensagens, resultados e materiais autorizados | canônico do produto | Product Architecture v0.1 |
| TERM-PROD-013 | Trilha de Auditoria | registro operacional ou de segurança, separado da experiência narrativa | canônico do produto | Product Architecture v0.1 |

---

## 3. Termos do jogo a validar

As traduções abaixo são somente formas de trabalho já presentes no planejamento. Não representam confirmação editorial.

| ID | Original | Forma de trabalho PT-BR | Estado | Fonte oficial | Observação |
|---|---|---|---|---|---|
| TERM-GAME-001 | Attribute | Atributo | provisório | pendente | confirmar edição adotada |
| TERM-GAME-002 | Skill | Habilidade | provisório | pendente | verificar terminologia oficial PT-BR |
| TERM-GAME-003 | Dice Pool | Parada de dados | provisório | pendente | registrar aliases de busca depois |
| TERM-GAME-004 | Hunger | Fome | provisório | pendente | confirmar capitalização editorial |
| TERM-GAME-005 | Hunger Die | Dado de Fome | provisório | pendente | confirmar singular e plural oficiais |
| TERM-GAME-006 | Difficulty | Dificuldade | provisório | pendente | separar número e conceito |
| TERM-GAME-007 | Success | Sucesso | provisório | pendente | validar contagem |
| TERM-GAME-008 | Critical | Crítico | provisório | pendente | validar terminologia completa |
| TERM-GAME-009 | Messy Critical | Crítico Sangrento | provisório | pendente | tradução precisa ser confirmada |
| TERM-GAME-010 | Bestial Failure | Falha Bestial | provisório | pendente | tradução precisa ser confirmada |
| TERM-GAME-011 | Willpower | Força de Vontade | provisório | pendente | confirmar usos mecânicos |
| TERM-GAME-012 | Reroll | Reroll / nova rolagem | provisório | pendente | escolher termo de interface depois |
| TERM-GAME-013 | Rouse Check | Teste de Despertar a confirmar | provisório | pendente | não usar como oficial ainda |

---

## 4. Regras editoriais futuras

Quando um termo for confirmado:

1. registrar fonte, edição e página;
2. definir singular e plural;
3. definir capitalização;
4. registrar termo original como alias;
5. atualizar especificações afetadas;
6. não substituir silenciosamente conteúdo histórico.
