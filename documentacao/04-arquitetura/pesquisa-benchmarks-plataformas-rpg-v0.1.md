# Pesquisa de Benchmarks de Plataformas de RPG v0.1

**Status:** concluída<br>
**Data da pesquisa:** 8 de outubro de 2026<br>
**Uso:** insumo para a Architecture v0.1; não substitui decisões de produto<br>
**Escopo:** plataformas estrangeiras já citadas na documentação do projeto

---

## 1. Objetivo

Verificar, em documentação pública e preferencialmente oficial, quais padrões das plataformas de RPG de referência resolvem problemas semelhantes aos deste projeto. A pesquisa procura reduzir retrabalho de produto e arquitetura, não reproduzir aparência, código, conteúdo protegido ou modelo comercial de terceiros.

Cada conclusão abaixo distingue:

- **evidência:** comportamento descrito pela própria plataforma;
- **inferência para o projeto:** decisão ou hipótese derivada dessa evidência;
- **limite:** parte da referência que não deve ser trazida para o primeiro corte.

## 2. Referências prioritárias

Os documentos internos já colocavam cinco produtos no centro da análise:

1. Demiplane / Vampire: The Masquerade Nexus;
2. Alchemy RPG;
3. Roll20;
4. Foundry Virtual Tabletop;
5. Obsidian, como referência de navegação em relações.

GhoulApp, Progeny, Realm of Darkness, V-Relations, Kindred Companion, VtM Assistant e MonstersGame permanecem referências secundárias. Elas ajudam a levantar hipóteses, mas não possuem o mesmo peso quando faltam documentação oficial estável, escopo comparável ou evidência suficiente.

## 3. Síntese executiva

| Problema do projeto | Referência mais útil | Padrão aproveitado | Consequência arquitetural |
|---|---|---|---|
| entrada e gestão do personagem | Demiplane | criação guiada, progresso recuperável e detalhe sob demanda | `CharacterDraft` persistente e conteúdo contextual identificado |
| imersão durante a sessão | Alchemy | cena como superfície principal; controles ao redor dela | `Scene` é estado explícito; UI funciona sem mídia e recebe arte progressivamente |
| rolagem e consulta operacional | Roll20 | ficha, regra e ação ligadas no ponto de uso | contratos ligam característica, regra e tentativa sem duplicar a mecânica no cliente |
| segredo e colaboração | Foundry | papéis mais permissão por documento | autorização por recurso e contexto, sempre no backend |
| integração futura | Foundry | manifestos, compatibilidade e importação/exportação | adapters versionados; domínio não depende do formato do VTT |
| exploração de relações | Obsidian | grafo local, filtros e profundidade | relações abrem pelo entorno do objeto atual, não por um grafo global carregado de início |
| uso em mesa física | Roll20 e Demiplane | ficha e consulta em navegador móvel | fluxos essenciais responsivos; mapa tático não é requisito móvel |

Conclusão: a diferenciação do produto não virá de inventar novos padrões de navegação para tudo. Ela virá de combinar padrões já compreensíveis com a identidade editorial, a centralidade da personagem e regras de Vampiro corretamente rastreadas.

## 4. Demiplane / Vampire Nexus

### Evidência observada

A documentação oficial apresenta um construtor guiado dividido em etapas, com indicação de pendências, salvamento para retomada e três zonas de informação: progresso, escolha e detalhe. Na ficha, características clicáveis abrem regra contextual, rastreadores registram estados frequentes e características alimentam a parada de dados.

### Inferência para o projeto

- a criação deve ser recuperável e aceitar rascunho incompleto;
- a pessoa deve conseguir seguir uma ordem sugerida sem perder liberdade de navegação;
- regra e lore devem abrir em camada contextual e devolver a pessoa ao ponto anterior;
- o cliente monta uma intenção de rolagem, mas o servidor valida e resolve a regra;
- compartilhar ou vincular uma personagem exige permissão explícita, não conhecimento de URL como única proteção.

### Limite

Não adotar o vínculo entre compra de livros e capacidades do domínio antes de existir uma estratégia jurídica e comercial própria. Também não assumir que recursos de grupo ou campanha de terceiros representam requisitos maduros do nosso produto.

## 5. Alchemy RPG

### Evidência observada

Alchemy define a cena como a experiência central. Uma cena pode reunir imagem, local, movimento, áudio, notas privadas do Narrador e uma camada tática opcional. A interface diferencia o que o Narrador prepara, pré-visualiza e publica do que o jogador recebe. A plataforma também oferece redução de movimento e permite que temas controlem fontes, cores e assets.

### Inferência para o projeto

- `Scene` precisa ser estado de domínio, não apenas um fundo visual;
- preparar, pré-visualizar e ativar uma cena são ações diferentes;
- conteúdo reservado do Narrador e projeção publicada ao jogador são modelos de leitura distintos;
- arte, som e movimento entram por adapters e carregamento progressivo;
- a experiência deve continuar utilizável sem imagem, áudio ou animação;
- tokens visuais e zonas seguras de composição precisam existir no design system desde o início.

### Limite

Não incorporar mapa tático, vídeo, voz, marketplace ou automação genérica ao primeiro MVP. Esses recursos aumentariam operação e superfície de falha sem validar a proposta central.

## 6. Roll20

### Evidência observada

Roll20 conecta fichas a compêndios e permite abrir uma entrada ou seção exata no contexto de uso. Também separa papéis de criador, GM e jogador, possui permissões de visualização e edição e mantém fichas e compêndios acessíveis por navegador móvel. A participação móvel pode ocorrer sem carregar toda a experiência de mapas e tokens.

### Inferência para o projeto

- links de regra devem usar IDs canônicos e âncoras estáveis, não busca por texto traduzido;
- papel na Crônica e permissão sobre o recurso são verificações diferentes;
- a ficha e o Roll Builder devem funcionar em viewport móvel;
- a experiência móvel pode priorizar ficha, Feed, regras e rolagens sem prometer paridade com uma mesa tática;
- revisões de regras e contratos precisam coexistir durante migrações, em vez de substituir silenciosamente dados antigos.

### Limite

Não transportar toolbar permanente, macros, grid, tokens ou densidade de VTT para todas as telas. A clareza operacional é a referência; o arranjo visual não é.

## 7. Foundry Virtual Tabletop

### Evidência observada

Foundry combina papéis do usuário com níveis de propriedade por documento. Seus Actors podem ser importados e exportados em JSON. Compêndios mantêm conteúdo reutilizável separado do mundo ativo; ao importar, o documento passa a ser uma cópia local. Módulos possuem manifesto, versão, compatibilidade, dependências, conteúdo, localização e permissões declaradas.

### Inferência para o projeto

- autorização deve considerar pessoa, papel, Crônica, recurso, ação e visibilidade;
- catálogo reutilizável e estado específico da Crônica não devem compartilhar a mesma identidade mutável;
- integração com Foundry deve ser adapter de importação/exportação com versão e relatório de compatibilidade;
- o modelo canônico da plataforma não deve usar tipos internos do Foundry;
- grandes catálogos devem ser consultados sob demanda, sem carregar tudo na sessão ativa.

### Limite

Foundry é destino de integração futuro, não fundação do produto. Não adotar seu modelo de World, Actor ou Document como modelo interno nem construir módulo antes de o fluxo próprio estar estável.

## 8. Obsidian

### Evidência observada

O Graph View usa nós, relações, filtros, grupos e forças de layout. O Local Graph limita a visualização ao entorno da nota atual e permite controlar profundidade. Backlinks preservam o caminho inverso entre conteúdos relacionados.

### Inferência para o projeto

- Cidade, relações e lore devem abrir por foco local;
- filtros e grupos precisam refletir visibilidade e tipo de relação;
- backlinks são uma projeção útil, não uma nova fonte de verdade;
- nenhum grafo completo deve ser enviado ao cliente antes da autorização.

### Limite

O grafo não entra no alpha técnico nem no primeiro MVP. Quando entrar, será uma projeção progressiva, não a navegação obrigatória do sistema.

## 9. Referências secundárias

| Referência | Hipótese útil | Tratamento |
|---|---|---|
| Realm of Darkness | separar modo de consulta do modo de edição e mostrar estado de sincronização | validar em protótipo; não copiar a ficha |
| Progeny | exportação de personagem e integração futura | manter portabilidade no modelo canônico |
| GhoulApp | reunir personagem, Crônica e sessão; ativar módulos sob demanda | requer revisão manual antes de virar requisito |
| V-Relations | relações com visibilidade diferente por público | coberto pela matriz de permissões e grafo focal |
| Kindred Companion | campanha, notas, relações e mapa no mesmo contexto | usar somente como hipótese pós-MVP |
| VtM Assistant | consulta assistida sobre material do usuário | usar como benchmark de risco; autorização precede recuperação e IA |
| MonstersGame | progressão visual simples | baixa relevância; não adotar economia, grind ou PvP |

## 10. Padrões adotados

1. Personagem como porta de entrada do jogador.
2. Cena como superfície dominante da Mesa.
3. Detalhe de regra e lore aberto no contexto.
4. Preparação privada separada da projeção publicada.
5. Ação, resultado mecânico, Evento de Sessão, Feed e Auditoria como conceitos distintos.
6. Permissão por recurso além do papel geral.
7. Fluxos essenciais responsivos e utilizáveis por teclado.
8. Integrações externas por adapters versionados.
9. Catálogo reutilizável separado do estado da Crônica.
10. Arte e movimento como melhoria progressiva, nunca pré-condição funcional.

## 11. Antipadrões rejeitados

- transformar o produto em VTT tático genérico;
- usar chat como banco de eventos do sistema;
- enviar segredos ao cliente para ocultá-los com CSS;
- carregar o corpus ou grafo completo na sessão;
- duplicar a regra no frontend;
- acoplar personagem, conteúdo ou permissões ao formato de uma integração;
- exigir animação, áudio ou WebGL para realizar uma tarefa essencial;
- copiar identidade visual, textos ou assets das referências.

## 12. Consequências para a primeira entrega

O alpha técnico deve provar apenas o caminho mais arriscado:

```text
identidade fictícia segura
→ personagem e vínculo autorizados
→ Roll Builder mínimo
→ avaliação determinística
→ RollAttempt + SessionEvent + outbox na mesma transação
→ publicação no Feed autorizado
→ reconexão por sequência
```

O primeiro MVP de playtest amplia esse caminho com autenticação real, usabilidade, visual aprovado e operação compartilhada. Criação completa, chat livre, grafo, mapa, áudio, IA e integração Foundry permanecem posteriores.

## 13. Fontes públicas consultadas

### Demiplane

- [Character Tools Overview — Vampire: The Masquerade Nexus](https://resources.demiplane.com/nexus/vampire/tools/character-tools-overview)
- [Vampire: The Masquerade Nexus FAQ](https://support.demiplane.com/hc/en-us/articles/25833361090711-Vampire-The-Masquerade-Nexus-Frequently-Asked-Questions)

### Alchemy

- [Creating a Scene](https://help.alchemyrpg.com/en/articles/9821311-creating-a-scene)
- [Player Orientation](https://help.alchemyrpg.com/en/articles/9821384-player-orientation)
- [Gamemaster Orientation](https://help.alchemyrpg.com/en/articles/9714185-gamemaster-orientation)
- [Universe Themes](https://help.alchemyrpg.com/en/articles/9821732-universe-themes)

### Roll20

- [Compendium Integration](https://help.roll20.net/hc/en-us/articles/360043790493-Compendium-Integration)
- [Invite, Promote and Manage Players](https://help.roll20.net/hc/en-us/articles/29620515876375-Invite-Promote-and-Manage-Players)
- [Using Roll20 on Mobile Devices](https://help.roll20.net/hc/en-us/articles/4411213438231-Using-Roll20-on-Mobile-Devices)

### Foundry VTT

- [Users and Permissions](https://foundryvtt.com/article/users/)
- [Actors](https://foundryvtt.com/article/actors/)
- [Compendium Packs](https://foundryvtt.com/article/compendium/)
- [Introduction to Module Development](https://foundryvtt.com/article/module-development/)

### Obsidian

- [Graph View](https://obsidian.md/help/plugins/graph)
- [Backlinks](https://obsidian.md/help/plugins/backlinks)

## 14. Resultado da pesquisa

A direção existente está validada, com uma correção importante de escopo: devemos aproveitar o modo como essas plataformas organizam contexto, permissões, progressão e integração, mas manter nosso produto centrado em personagem, cena e narrativa. A Architecture v0.1 aplica essa conclusão e não inclui capacidades de VTT que ainda não foram validadas.
