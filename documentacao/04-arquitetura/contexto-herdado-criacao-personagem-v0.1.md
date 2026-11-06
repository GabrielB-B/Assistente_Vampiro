# Contexto herdado da Criação de Personagem v0.1

Status: implementado no recorte Clã/Origem → Atributos. Habilidades e Disciplinas ainda não possuem tela.

## Decisão

A Criação Guiada não mantém uma ficha paralela. Cada etapa consulta o mesmo `Character` em estado `draft`, sob concorrência otimista por `version`, e recebe uma projeção `CharacterCreationContext` apropriada à rota atual.

```text
Character persistido
  → CharacterCreationContext
  → policy da etapa
  → apresentação
```

`localStorage`, `sessionStorage` e estado global do React não são fontes de verdade. Recarregar a rota ou alternar entre Ficha direta e Criação Guiada reconstrói o contexto do banco.

## Projeção

O contrato público `CharacterCreationContextView` expõe somente o necessário para a criação:

- `characterId`, `version` e revisão do perfil de criação;
- etapa atual, etapas concluídas e estado real de cada etapa;
- nome e conceito já informados, sem placeholders;
- origem persistida (`characterKind`, `clanId` quando aplicável);
- família da política futura de Disciplinas.

A aplicação monta essa projeção em `character-creation-context.ts`. O adaptador Kysely lê identidade, origem, revisão de perfil, Atributos e Convicções do mesmo `Character`.

## Identidade visual herdada

`CharacterCreationIdentity` é um componente único e pequeno junto ao status da criação:

- vampiro de Clã: nome e asset oficial já aprovado na etapa Clã;
- Caitiff: `ORIGEM / CAITIFF`, sem símbolo;
- Sangue-Ralo: `ORIGEM / SANGUE-RALO`, sem símbolo;
- nome da personagem somente quando realmente preenchido.

A cor do Clã é um acento local. Ankh, papel, fundo, botões, navegação e composição de Atributos continuam sob a identidade global do produto.

## Políticas futuras

O Rules Engine já distingue três projeções, sem implementar a tela de Disciplinas:

- `CLAN`: recebe `originId` e as Disciplinas do catálogo normativo da origem;
- `CAITIFF`: recebe sua família própria, sem seção falsa de “Disciplinas do Clã”;
- `THIN_BLOOD`: recebe sua família própria, preparada para regras de ressonância e Alquimia Sangue-Ralo;
- `ORIGIN_REQUIRED`: bloqueio estrutural quando ainda não há origem.

O React não contém `switch` de Clã para decidir mecânica.

## Progresso

Os estados `not_started`, `in_progress`, `complete` e `blocked` pertencem ao contrato. Neste incremento, Conceito, Clã/Origem e Atributos são calculados a partir dos dados persistidos. Etapas ainda não implementadas permanecem `not_started`.

## Troca retroativa de origem

`determineCreationOriginChangeImpact` calcula as etapas potencialmente afetadas por uma troca de origem e separa aquelas que já possuem estado e exigirão revisão. O escritor registra a lista potencial no evento de auditoria da mudança.

Neste recorte ainda não há dados de Disciplinas, Predador, Vantagens ou História & Sangue para preservar ou invalidar. Por isso, a arquitetura detecta o impacto, mas a confirmação e a marcação persistida para revisão só devem ser conectadas quando a primeira dessas etapas passar a existir. Nenhuma troca atual executa reset global.

## Limites deste incremento

- não implementa Habilidades;
- não implementa Disciplinas nem poderes;
- não implementa confirmação visual de troca retroativa;
- não altera regras, composição, painel lateral ou fundo de Atributos;
- não cria símbolo para Caitiff ou Sangue-Ralo.

## Verificação

Os testes cobrem:

- projeção persistida para Clã, Caitiff e Sangue-Ralo;
- progresso real independente da rota;
- políticas futuras distintas por família;
- detecção de impacto retroativo sem apagamento;
- identidade com símbolo para dois Clãs;
- identidade textual, sem imagem, para Caitiff e Sangue-Ralo;
- integração PostgreSQL entre escolha de origem e leitura posterior de Atributos.
