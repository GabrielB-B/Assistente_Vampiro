# Glossário Controlado v0.1

**Status:** baseline terminológico do primeiro fluxo aprovado<br>
**Estado da fase:** termos centrais confirmados no Livro Básico Galápagos<br>
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

## 3. Termos do jogo confirmados

As formas abaixo foram confirmadas em `SRC-0001`. O Companion (`SRC-0003`) confirma parte do vocabulário e fornece termos adicionais. O Players Guide (`SRC-0004`) permanece como fonte mecânica em inglês nos casos republicados.

| ID | Original | Forma de trabalho PT-BR | Estado | Fonte oficial | Observação |
|---|---|---|---|---|---|
| TERM-GAME-001 | Attribute | Atributo | oficial | SRC-0001, p. 118, 155+ | categoria de Característica |
| TERM-GAME-002 | Skill | Habilidade | oficial | SRC-0001, p. 118, 159+ | categoria de Característica |
| TERM-GAME-003 | dice pool | parada de dados | oficial | SRC-0001, p. 117–123 | evitar `pool` na interface PT-BR |
| TERM-GAME-004 | Hunger | Fome | oficial | SRC-0001, p. 205+ | trilha do vampiro |
| TERM-GAME-005 | Hunger Die / Dice | Dado de Fome / Dados de Fome | oficial | SRC-0001, p. 205+ | singular e plural explícitos |
| TERM-GAME-006 | Difficulty | Dificuldade | oficial | SRC-0001, p. 119+ | quantidade de sucessos necessária |
| TERM-GAME-007 | success | sucesso | oficial | SRC-0001, p. 118+ | resultado individual ou contagem contextual |
| TERM-GAME-008 | critical success / critical win | sucesso crítico / vitória crítica | oficial | SRC-0001, p. 120+ | manter a distinção contextual |
| TERM-GAME-009 | messy critical | Crítico Bestial | oficial | SRC-0001, p. 207 | `Crítico Sangrento` está depreciado |
| TERM-GAME-010 | bestial failure | Falha Bestial | oficial | SRC-0001, p. 207–208 | distinta de Falha Total |
| TERM-GAME-011 | Willpower | Força de Vontade | oficial | SRC-0001, p. 119, 157+ | trilha e recurso de rerrolagem |
| TERM-GAME-012 | reroll | rerrolagem | controlado | decisão editorial interna | manter o inglês como alias de busca |
| TERM-GAME-013 | Rouse Check | Checagem de Sangue | oficial | SRC-0001, p. 211+ | `Teste de Despertar` está depreciado |
| TERM-GAME-014 | Blood Surge | Surto de Sangue | oficial | SRC-0001, p. 218+ | ligado à Potência do Sangue |
| TERM-GAME-015 | Blood Potency | Potência do Sangue | oficial | SRC-0001, p. 215+ | valor versionado pelo perfil de regras |
| TERM-GAME-016 | Bane Severity | Gravidade da Perdição | oficial | SRC-0001, p. 216+ | derivada da Potência do Sangue |
| TERM-GAME-017 | Touchstone | Pilar | oficial | SRC-0001, p. 173, 236+ | mortal ligado a uma Convicção |
| TERM-GAME-018 | Stain | Mácula | oficial | SRC-0001, p. 239+ | plural: Máculas |
| TERM-GAME-019 | Loresheet | Ficha de Conhecimento | oficial | SRC-0001, p. 152, 382+ | plural: Fichas de Conhecimento |

---

## 4. Regras editoriais futuras

Quando um termo for confirmado:

1. registrar fonte, edição e página;
2. definir singular e plural;
3. definir capitalização;
4. registrar termo original como alias;
5. atualizar especificações afetadas;
6. não substituir silenciosamente conteúdo histórico.
