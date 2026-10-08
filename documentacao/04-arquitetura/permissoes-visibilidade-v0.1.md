# Permissions & Visibility Matrix v0.1

**Status:** aprovado<br>
**Data:** 8 de outubro de 2026<br>
**Data de aprovação:** 8 de outubro de 2026<br>
**Escopo executável:** alpha técnico e primeiro MVP de playtest<br>
**Base:** Modelo de Domínio v0.1, Product Architecture v0.1 e Architecture v0.1

---

## 1. Objetivo

Definir quem pode executar cada operação e quais campos podem sair do backend. Esta matriz é fonte de requisitos para casos de uso, projeções, endpoints, inscrições realtime e testes negativos.

Ela não será traduzida em um `if role == STORYTELLER` global. Papel é apenas uma dimensão da decisão.

## 2. Princípio de decisão

Toda autorização avalia, nesta ordem:

```text
identidade
→ estado da Participação
→ papel na Crônica
→ relação com o recurso
→ ação solicitada
→ estado do recurso
→ visibilidade do conteúdo
→ política específica do caso de uso
```

Regras invariáveis:

1. negar por padrão;
2. autorizar no backend;
3. não recuperar segredo antes de saber se o ator pode recebê-lo;
4. retornar somente a projeção permitida, nunca a entidade completa para filtragem no cliente;
5. autenticar a conexão realtime e autorizar cada inscrição;
6. mudança de papel ou suspensão invalida novos comandos e inscrições;
7. acesso administrativo não equivale a acesso narrativo.

## 3. Atores e contextos

| Ator | Contexto | Observação |
|---|---|---|
| Visitante | sem identidade | não acessa dados privados |
| Conta autenticada | identidade válida | acessa apenas recursos próprios ou concedidos |
| Jogador | Participação ativa com `PLAYER` | permissões válidas somente naquela Crônica |
| Narrador | Participação ativa com `STORYTELLER` | administra a Crônica, não a Conta ou propriedade alheia |
| Jogador e Narrador | ambos os papéis explícitos | união controlada das capacidades; ações sensíveis registram o papel exercido |
| Administrador da plataforma | função operacional | não recebe segredos narrativos por padrão |
| Sistema | job ou relay identificado | executa somente a capacidade técnica concedida |

Uma Participação `invited`, `suspended` ou `left` não concede acesso de membro. Convite permite apenas consultar e aceitar ou rejeitar o próprio convite.

## 4. Classes de visibilidade

| Código | Significado | Público autorizado |
|---|---|---|
| `OWNER_PRIVATE` | privado da Conta proprietária | proprietário |
| `STORYTELLER_PRIVATE` | preparação e segredo da Crônica | Narradores ativos autorizados |
| `SUBJECT_PRIVATE` | dirigido a uma pessoa ou vínculo | destinatário e Narrador quando a política permitir |
| `COTERIE_SHARED` | compartilhado com uma Coterie | vínculos ativos da Coterie e Narradores |
| `CHRONICLE_SHARED` | publicado para a Crônica | Participações ativas da Crônica |
| `PLATFORM_PUBLIC` | conteúdo público aprovado | qualquer público previsto pelo estado editorial |

`PLATFORM_PUBLIC` não se aplica a ficha, rolagem, sessão ou material privado do Narrador no primeiro MVP.

## 5. Projeções de leitura

| Projeção | Conteúdo permitido |
|---|---|
| `CharacterOwnerView` | ficha completa própria, histórico permitido e controles de edição |
| `CharacterPlayerView` | campos publicados do personagem de outro jogador |
| `CharacterStorytellerView` | ficha vinculada necessária para condução, sem dados de Conta |
| `ChroniclePlayerView` | dados publicados, membros visíveis e regras ativas |
| `ChronicleStorytellerView` | dados publicados e preparação privada |
| `ScenePlayerView` | título, local, descrição e mídia ativados |
| `SceneStorytellerView` | preparação, notas privadas e versão publicada |
| `FeedProjection` | payload já reduzido ao público daquele evento |
| `AuditProjection` | metadados operacionais; nunca usada como Feed |

Projeções são contratos de saída. Não são filtros opcionais aplicados depois de serializar a entidade.

## 6. Matriz — Conta e Personagem

| Ator | Recurso e ação | Condição | Resultado ou campos visíveis | Auditoria | Teste negativo obrigatório |
|---|---|---|---|---|---|
| Conta | ler própria Conta | identidade corresponde | perfil próprio sem credenciais | não | outra Conta não é retornada |
| Conta | criar Personagem | identidade válida | torna-se proprietária | criação | não permite `ownerAccountId` arbitrário |
| proprietário | ler Personagem próprio | propriedade ativa | `CharacterOwnerView` | não | ID alheio não revela existência privada |
| proprietário | editar Personagem próprio | versão esperada e estado permite | campos editáveis pela política | alteração relevante | versão antiga gera conflito, não sobrescrita |
| proprietário | arquivar Personagem | sem operação incompatível em andamento | estado `retired`; histórico preservado | sim | exclusão física não é oferecida |
| Jogador | ler personagem de outro membro | mesma Crônica e campo publicado | `CharacterPlayerView` | não | campo privado não aparece no payload |
| Narrador | ler Personagem vinculado | mesma Crônica e Vínculo ativo | `CharacterStorytellerView` | acesso sensível amostrado | personagem não vinculado é negado |
| Narrador | criar Personagem para outra Conta | não permitido na v0.1 | negar | tentativa | não aceita proprietário arbitrário |
| Narrador | alterar identidade ou progressão permanente de personagem alheio | aceite explícito do proprietário; fluxo posterior ao alpha | proposta pendente, não alteração direta | sim | ausência de aceite mantém a ficha intacta |

### Decisão aprovada P-001

Na v0.1, Narrador cria NPCs pertencentes à Crônica, mas não cria Personagem de Jogador em nome de outra Conta. Isso evita transferência implícita de propriedade e recuperação de conta mal definida.

### Decisão aprovada P-002

Narrador pode registrar consequências de Sessão por casos de uso próprios e auditados. Alterações permanentes de conceito, progressão ou identidade da ficha exigem confirmação do proprietário. O alpha não implementa edição de ficha pelo Narrador.

## 7. Matriz — Crônica, Participação e Vínculo

| Ator | Recurso e ação | Condição | Resultado | Auditoria | Teste negativo obrigatório |
|---|---|---|---|---|---|
| Conta | criar Crônica | identidade válida | cria Crônica e Participação de Narrador | sim | não atribui outro proprietário sem fluxo explícito |
| membro | ler Crônica | Participação ativa | projeção conforme papel | não | Participação suspensa não lê |
| Narrador | editar Crônica | Participação ativa com papel | atualiza versão esperada | sim | Jogador não altera política ou perfil |
| Narrador | convidar Conta | Crônica editável | cria Participação `invited` | sim | convite duplicado é idempotente |
| convidado | aceitar ou rejeitar convite | convite pertence à Conta e está válido | ativa ou encerra Participação | sim | outra Conta não responde ao convite |
| Narrador | suspender Participação | alvo pertence à Crônica; política permite | bloqueia acesso imediatamente | sim | Narrador de outra Crônica é negado |
| membro | sair da Crônica | Participação própria; pendências tratadas | estado `left` | sim | não remove histórico nem eventos |
| proprietário | solicitar Vínculo | Participação de Jogador ativa e Personagem compatível | cria `requested` | sim | personagem alheio não pode ser vinculado |
| Narrador | aprovar ou rejeitar Vínculo | mesma Crônica; perfil compatível | ativa ou rejeita | sim | Jogador não autoaprova |
| proprietário | solicitar liberação | Vínculo próprio ativo | cria solicitação de liberação | sim | não libera vínculo alheio |
| Narrador | confirmar liberação | mesma Crônica e consistência preservada | estado `released` | sim | eventos históricos continuam vinculados |

### Decisão aprovada P-003

Durante Crônica ativa, liberar um Vínculo exige solicitação do proprietário e confirmação do Narrador. Suspensão ou saída bloqueia o uso imediatamente, mas não apaga nem reatribui o Vínculo. Em Crônica arquivada, o proprietário pode liberar o Vínculo sem reabrir a campanha; a operação preserva todo o histórico.

## 8. Matriz — Sessão e Cena

| Ator | Recurso e ação | Condição | Resultado ou campos visíveis | Auditoria | Teste negativo obrigatório |
|---|---|---|---|---|---|
| membro | entrar na Mesa | Participação ativa; Sessão acessível | contexto conforme papel | presença | pessoa externa não obtém stream |
| Narrador | iniciar ou encerrar Sessão | papel ativo e transição válida | estado alterado e Evento de Sessão | sim | Jogador não muda ciclo da Sessão |
| Jogador | ler Cena ativa | membro ativo | `ScenePlayerView` | não | Cena preparada não aparece |
| Narrador | criar ou editar Cena preparada | mesma Crônica | `SceneStorytellerView` | alteração relevante | segredo não entra na projeção de jogador |
| Narrador | pré-visualizar Cena | Cena preparada | somente projeção privada | não | preview não publica evento |
| Narrador | ativar Cena | Sessão ativa e versão esperada | publica projeção e `SceneActivated` | sim | duas Cenas não ficam ativas no primeiro corte |
| Narrador | revelar handout | material pertence à Crônica e público escolhido é válido | Evento de Sessão por público | sim | público não autorizado não recebe payload |

## 9. Matriz — Rolagem, Evento de Sessão e Feed

| Ator | Recurso e ação | Condição | Resultado ou campos visíveis | Auditoria | Teste negativo obrigatório |
|---|---|---|---|---|---|
| Jogador | confirmar rolagem do próprio Personagem | Participação e Vínculo ativos; Sessão ativa; comando válido | `RollAttempt` imutável e projeção autorizada | evento e metadados | não rola por personagem alheio |
| Narrador | confirmar rolagem de NPC ou do Narrador | papel ativo; recurso da Crônica | tentativa e projeção conforme público | evento e metadados | Jogador não usa identidade de NPC |
| membro | ler `RollAttempt` | é ator, controla o vínculo ou recebe permissão explícita | campos compatíveis com visibilidade | não | rolagem secreta não revela faces nem existência |
| sistema | criar `SessionEvent` de rolagem | tentativa confirmada e política calculada | evento referencia a tentativa | sim | cliente não cria evento arbitrário |
| membro | consultar Feed | Participação ativa e cursor válido | somente eventos do público autorizado | acesso anômalo | lacuna não inclui eventos secretos |
| membro | inscrever-se no realtime | conexão autenticada e Participação ativa | stream autorizado | conexão/rejeição | inscrição em outra Crônica é negada |
| relay | publicar outbox | mensagem durável, lease válido | mesmo `eventId` e sequência | operação | relay não amplia público do evento |
| cliente | retomar após desconexão | inscrição reautorizada e última sequência informada | eventos posteriores permitidos | não | mudança de papel remove eventos futuros não autorizados |

### Visibilidade de rolagem no primeiro corte

O alpha implementa dois públicos:

- `CHRONICLE_SHARED`: Jogadores e Narradores ativos recebem o resultado;
- `STORYTELLER_PRIVATE`: somente Narradores ativos recebem a projeção.

Rolagem dirigida a um único jogador, revelação atrasada e sussurro ficam fora do alpha. Os tipos podem ser acrescentados depois sem alterar tentativas históricas.

### Dificuldade no primeiro corte

- a pessoa autorizada a preparar a rolagem pode informar uma Dificuldade aberta;
- o Narrador mantém a autoridade narrativa e pode corrigir o valor antes da confirmação;
- a tentativa confirmada registra valor, origem e pessoa que fez a seleção;
- o primeiro alpha não aceita Dificuldade secreta;
- suporte futuro a Dificuldade secreta exigirá projeções próprias e não poderá depender apenas de ocultação visual no cliente.

## 10. Matriz — Conhecimento, regras e Auditoria

| Ator | Recurso e ação | Condição | Resultado | Auditoria | Teste negativo obrigatório |
|---|---|---|---|---|---|
| usuário | consultar regra ou artigo | estado editorial e licença permitem; público autorizado | conteúdo editorial permitido e citação | não | rascunho privado não aparece em busca |
| membro | consultar conteúdo da Crônica | Participação ativa e visibilidade compatível | artigo ou trecho autorizado | não | segredo do Narrador não é recuperado |
| Rules Engine | obter revisão executável | perfil da Crônica referencia revisão publicada | parâmetros estruturados | versão no resultado | tradução ou artigo não altera mecânica |
| SIRE futura | recuperar contexto | caso de uso autorizou primeiro | somente fontes autorizadas e citáveis | sim, com redaction | busca não recupera corpus por conveniência |
| Narrador | consultar preparação própria | papel ativo e mesma Crônica | conteúdo privado do Narrador | acesso sensível amostrado | Narrador de outra Crônica é negado |
| administrador | consultar Auditoria | função operacional e finalidade válida | `AuditProjection` mínima | toda consulta | não recebe conteúdo narrativo por padrão |
| membro | consultar Auditoria | não permitido no primeiro MVP | negar | tentativa sensível | Feed não expõe audit entries |

## 11. Respostas de negação

| Código | Uso | Semântica externa |
|---|---|---|
| `AUTHENTICATION_REQUIRED` | identidade ausente ou inválida | autenticar novamente |
| `MEMBERSHIP_INACTIVE` | convite, suspensão ou saída | participação não permite a ação |
| `ACTION_NOT_ALLOWED` | recurso conhecido, ação proibida | ação indisponível para o contexto |
| `RESOURCE_NOT_AVAILABLE` | recurso alheio ou secreto | não confirmar existência |
| `RESOURCE_STATE_CONFLICT` | estado incompatível | atualizar e tentar fluxo válido |
| `VERSION_CONFLICT` | versão esperada divergente | recarregar antes de editar |
| `IDEMPOTENCY_CONFLICT` | mesma chave, comando diferente | gerar nova intenção válida |

Mensagens explicam recuperação quando isso não revela segredo. Logs internos guardam o motivo técnico por código, sem copiar o conteúdo negado.

## 12. Realtime e mudança de permissão

1. handshake valida identidade, não autoriza automaticamente streams;
2. `subscribe(sessionId, lastSequence)` avalia Participação, estado e papel;
3. cada evento já possui público calculado e nunca é publicado numa sala mais ampla para filtragem no cliente;
4. suspensão, saída ou mudança de papel revoga a inscrição ativa;
5. na reconexão, toda autorização é refeita;
6. o histórico retornado é recalculado pela política vigente sem reescrever o evento canônico.

Se a visibilidade histórica precisar ser congelada no momento do evento, isso exigirá decisão explícita antes do MVP; o alpha trabalha com eventos cujo público é simples e persistido.

## 13. Auditoria mínima

Registrar sempre:

- convite, ativação, suspensão e saída de Participação;
- solicitação, aprovação, rejeição e liberação de Vínculo;
- mudança de papel;
- início e encerramento de Sessão;
- ativação de Cena e publicação de material;
- tentativa de rolagem confirmada e conflito de idempotência;
- alteração permanente de ficha;
- consulta administrativa;
- negações repetidas ou sensíveis.

Cada entrada contém ator, papel exercido, ação, recurso, decisão, data, `correlationId` e versão da aplicação. Não contém token, senha, prompt integral, PDF ou segredo narrativo desnecessário.

## 14. Cenários negativos obrigatórios do alpha

```gherkin
Cenário: jogador tenta rolar por personagem alheio
  Dado que a Conta possui Participação ativa na Crônica
  E que o Personagem pertence a outra Conta
  Quando confirma uma rolagem usando o Vínculo alheio
  Então o comando é negado
  E nenhum RollAttempt, SessionEvent ou outbox é criado
```

```gherkin
Cenário: pessoa externa tenta assinar o Feed
  Dado que a identidade é válida
  E que não possui Participação ativa na Crônica
  Quando solicita inscrição na Sessão
  Então a inscrição é negada sem revelar o estado da Sessão
```

```gherkin
Cenário: evento privado do Narrador é publicado
  Dado que uma rolagem possui visibilidade STORYTELLER_PRIVATE
  Quando o relay publica o Evento de Sessão
  Então somente inscrições atualmente autorizadas como Narrador recebem a projeção
  E Jogadores não recebem payload, placeholder ou contagem que revele o evento
```

```gherkin
Cenário: Participação é suspensa durante uma conexão
  Dado que um Jogador está inscrito no Feed
  Quando sua Participação é suspensa
  Então novos comandos são negados
  E sua inscrição é revogada
  E a reconexão não recupera novos eventos
```

## 15. Decisões confirmadas

Foram confirmadas pelo responsável do produto:

1. P-001: Narrador não cria Personagem de Jogador para outra Conta na v0.1;
2. P-002: mudanças permanentes em personagem alheio exigem aceite do proprietário;
3. P-003: liberação de Vínculo em Crônica ativa exige solicitação do proprietário e confirmação do Narrador;
4. o alpha terá apenas rolagem compartilhada com a Crônica e privada do Narrador;
5. Administrador da plataforma não terá acesso narrativo por padrão.

## 16. Definition of Done

- [x] atores, estados e classes de visibilidade definidos;
- [x] recursos do alpha cobertos;
- [x] projeções distintas por público;
- [x] realtime e reconexão cobertos;
- [x] negações e auditoria descritas;
- [x] cenários negativos mínimos registrados;
- [x] decisões P-001 a P-003 confirmadas;
- [x] revisão humana concluída;
- [ ] casos de uso e testes rastreados para esta matriz.

A matriz está aprovada. Casos de uso futuros devem apontar para suas linhas e manter testes positivos e negativos equivalentes.
