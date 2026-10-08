# Escopo do Alpha Técnico v0.1

**Status:** aprovado<br>
**Data:** 8 de outubro de 2026<br>
**Objetivo:** reduzir os riscos arquiteturais antes do MVP de playtest

---

## 1. Resultado esperado

O alpha não é uma versão reduzida de todas as ideias do produto. Ele é uma prova executável do caminho que concentra maior risco: regra, autorização, persistência atômica, realtime e retomada depois de desconexão.

Ao final, duas pessoas em papéis distintos conseguem executar e observar uma rolagem autorizada usando dados fictícios, sem duplicação e sem depender de IA ou de material privado em runtime.

## 2. Fluxo incluído

```text
entrar com identidade fictícia controlada
→ selecionar personagem de teste
→ abrir a tela Boa noite
→ entrar em uma Crônica e Sessão de teste
→ abrir a ficha mínima
→ montar uma parada de dados
→ confirmar a rolagem com chave idempotente
→ resolver a regra no servidor
→ persistir RollAttempt + SessionEvent + outbox
→ publicar o resultado no Feed autorizado
→ desconectar e retomar a partir da última sequência
```

## 3. Capacidades incluídas

| Capacidade | Corte do alpha |
|---|---|
| identidade | adapter fictício restrito a local, teste e CI |
| autorização | Jogador e Narrador por Crônica; dono da personagem; visibilidade do evento |
| personagem | uma ficha pronta, criada por seed fictício |
| Crônica | uma Crônica, participações e vínculos de teste |
| sessão e cena | uma Sessão ativa e uma Cena ativa |
| regra | primeira rolagem determinística aprovada no catálogo |
| persistência | PostgreSQL real com migrações versionadas |
| realtime | outbox durável, relay e adapter Socket.IO |
| Feed | rolagens e mensagens do sistema; sem entrada de chat livre |
| observabilidade | correlation ID, logs estruturados e métricas mínimas do relay |
| interface | caminho funcional responsivo usando a calibração visual aprovada, sem exigir acabamento final |

## 4. Fora do escopo

- cadastro, login social, recuperação ou exclusão de conta;
- criação completa de personagem;
- edição completa de ficha;
- chat livre, voz ou vídeo;
- mapa tático, tokens ou dados 3D;
- áudio ambiente e animações pesadas;
- IA, busca vetorial ou ingestão de PDFs;
- Biblioteca completa;
- grafo de relações e mapa da cidade;
- integração com Foundry;
- operação pública ou dados reais de jogadores.

Essas exclusões são deliberadas. Nenhuma delas pode ser introduzida como dependência oculta do fluxo.

## 5. Dados de teste

Seeds usam somente conteúdo fictício e regras estruturadas cuja presença no repositório tenha sido aprovada. Nenhum PDF, extração integral, credencial pessoal ou asset sem licença entra no banco de desenvolvimento, imagem Docker, log ou fixture.

Identidades mínimas:

| Identidade | Papel | Condição esperada |
|---|---|---|
| `player-one` | Jogador | controla a personagem vinculada e vê eventos permitidos |
| `player-two` | Jogador | não controla a personagem de `player-one` |
| `storyteller-one` | Narrador | administra a Sessão e vê a projeção do Narrador |
| `outsider-one` | sem Participação | não acessa a Crônica, stream ou eventos |

## 6. Critérios de aceite

- [ ] ambiente sobe a partir de repositório limpo seguindo somente o README;
- [ ] migrações criam um PostgreSQL vazio e seeds fictícios são repetíveis;
- [ ] frontend não acessa banco nem contém regra autoritativa;
- [ ] mesma chave idempotente devolve a mesma tentativa sem novo evento;
- [ ] `RollAttempt`, `SessionEvent` e outbox são confirmados ou revertidos juntos;
- [ ] publicação só ocorre depois do `commit`;
- [ ] queda do relay não perde o evento e o retry não duplica o Feed;
- [ ] reconexão recupera eventos posteriores à última sequência conhecida;
- [ ] inscrição em stream não autorizado é negada e auditada;
- [ ] jogador não recebe campos reservados do Narrador;
- [ ] testes unitários, integração, contrato, arquitetura e ponta a ponta estão verdes;
- [ ] teclado, foco, contraste e redução de movimento foram verificados no fluxo;
- [ ] nenhum segredo ou conteúdo privado aparece em Git, build ou logs.

## 7. Saída do alpha

O alpha termina quando todos os critérios forem demonstrados em CI e numa execução local limpa, e quando a prova de persistência tiver escolhido a biblioteca de dados por ADR.

Depois disso, os experimentos descartáveis são removidos e começa o MVP de playtest, que adicionará autenticação real, acabamento de experiência, operação em ambiente compartilhado e testes com pessoas convidadas.

## 8. Evidências exigidas

- log da CI ligada ao commit avaliado;
- relatório da prova de persistência;
- ADR da biblioteca de dados;
- gravação curta ou roteiro reproduzível do fluxo;
- resultado dos testes negativos de autorização;
- confirmação de restauração de banco antes do primeiro ambiente compartilhado.
