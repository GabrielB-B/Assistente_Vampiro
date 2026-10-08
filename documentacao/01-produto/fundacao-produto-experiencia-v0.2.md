# Product & Experience Foundation v0.2

**Status:** consolidado<br>
**Uso:** referência de produto<br>
**Última revisão de coerência:** 7 de outubro de 2026<br>
**Fase:** descoberta e definição de produto  
**Objetivo:** registrar a visão, princípios, experiências, funcionalidades, limites, referências e decisões aprovadas antes da identidade visual, wireframes e arquitetura técnica.

---

# 1. Propósito

Criar uma plataforma digital em português voltada inicialmente a **Vampiro: A Máscara**, reunindo em uma única experiência:

- criação e gestão de personagens;
- consulta de regras;
- aprendizado de mecânicas;
- exploração de lore;
- gestão de crônicas;
- apoio ao Narrador;
- rolagens;
- experiência de sessão;
- cidade e locais da crônica;
- Coterie;
- Refúgios;
- relações entre personagens;
- conteúdo oficial e conteúdo próprio da mesa.

O produto deve reduzir a fragmentação hoje existente entre livros, PDFs, fichas, VTTs, anotações, wikis e ferramentas auxiliares.

A primeira versão **não pretende ser um VTT tradicional**.

---

# 2. Visão do produto

A plataforma deve fazer o usuário sentir que está **entrando em seu personagem e em seu Mundo das Trevas**, e não acessando um software administrativo.

Para o jogador:

> criar um personagem, entender como ele funciona, aprender regras e lore, explorar sua cidade, jogar e consultar informações sem precisar alternar continuamente entre livro, PDF, Google, ficha e Roll20.

Para o Narrador:

> preparar e conduzir uma crônica com o mínimo possível de trabalho administrativo, encontrando rapidamente regras, NPCs, locais, relações, imagens, cenas e acontecimentos.

A plataforma deve continuar relevante **entre as sessões**.

---

# 3. Proposta central

**Uma plataforma brasileira para aprender, criar, organizar e jogar Vampiro: A Máscara, integrando regras, lore, personagem, cidade, crônica e sessão em uma experiência limpa, contextual, didática e imersiva.**

---

# 4. O que o produto não deve ser

Não deve se limitar a:

- ficha digital;
- chatbot com PDFs;
- wiki;
- gerenciador de campanha;
- leitor de livros;
- Roll20 simplificado;
- VTT completo;
- banco de NPCs;
- enciclopédia.

Esses recursos podem existir, mas devem fazer parte de uma experiência integrada.

---

# 5. Diferenciais

## 5.1 Português primeiro

Português brasileiro deve ser tratado como elemento central.

Isso inclui:

- interface;
- pesquisa;
- terminologia;
- explicações;
- conteúdo didático;
- lore;
- tradução;
- respostas da IA.

Quando existir terminologia oficial brasileira, ela deve ser priorizada.

Quando não existir, usar tradução controlada por glossário, preservando o termo original como referência.

---

## 5.2 Aprender enquanto usa

O usuário não deve precisar estudar centenas de páginas antes de começar.

Conceitos devem ser explicados **onde aparecem**.

Exemplo:

### Atributos

Visão inicial:

> Representam as capacidades naturais do personagem.

O jogador veterano continua imediatamente.

O iniciante pode abrir:

**Entender melhor**

O mesmo princípio se aplica a:

- Habilidades;
- Disciplinas;
- Fome;
- Humanidade;
- Força de Vontade;
- Vantagens;
- Defeitos;
- combate;
- críticos;
- dano;
- cura;
- Frenesi;
- ações;
- demais sistemas.

---

## 5.3 Personagem como centro

A principal experiência do jogador começa pelo personagem.

Fluxo:

**Login → Escolha do personagem → “Boa noite, Marcus.”**

A experiência deve lembrar entrada em um jogo, e não navegação em dashboard.

---

## 5.4 Imersão com baixa complexidade

A imersão deve vir de:

- imagens;
- fotografia;
- cidade;
- mapas;
- relações;
- Refúgios;
- lore;
- cenas;
- pequenos efeitos;
- contexto;
- acontecimentos da crônica.

Não de excesso de controles.

---

# 6. Princípios obrigatórios de UX

## 6.1 Progressive Disclosure

Mostrar primeiro o necessário.

Detalhes aparecem sob demanda.

---

## 6.2 Zero Duplicate Work

Uma informação deve ser registrada uma única vez e reaproveitada.

Exemplos:

Criou Boon:

> atualizar Favores e Relationship Graph.

Criou NPC:

> disponibilizar para cenas, busca, relações e crônica.

Jogou cena em um local:

> atualizar histórico do local.

Avançou Clock:

> registrar também na timeline.

---

## 6.3 Linguagem do mundo

Evitar termos administrativos quando houver alternativa temática.

Preferir:

- Relações;
- Cidade;
- Favores;
- Recursos;
- A Máscara;
- Refúgio.

Em vez de:

- Relationship Manager;
- Location Database;
- Finance Module;
- Masquerade Tracker.

---

## 6.4 Complexidade contextual

A interface só deve mostrar complexidade quando ela for necessária naquele momento.

---

## 6.5 Mesa persistente

Durante a sessão, consultas rápidas não devem tirar o usuário da Mesa.

Ficha, regras, NPCs, locais e relações aparecem como **camadas temporárias**.

---

## 6.6 Conteúdo não controla regra

Separar:

**Biblioteca**

> explica.

**Rules Engine**

> executa e valida.

**SIRE**

> interpreta e ensina.

---

## 6.7 IA opcional

A aplicação deve funcionar sem API de IA.

---

## 6.8 Ferramentas avançadas opt-in

Recursos complexos da crônica devem ser ativados somente se o Narrador quiser.

---

# 7. Usuário, Jogador e Narrador

Não devem existir contas permanentemente classificadas como “Jogador” ou “Narrador”.

Um usuário pode ser:

- jogador na Crônica A;
- Narrador na Crônica B;
- jogador na Crônica C.

O papel pertence à relação com a crônica.

---

# 8. Personagem independente da crônica

Um personagem pode existir sem crônica.

O usuário pode:

- criar;
- estudar;
- testar;
- jogar futuramente;
- consultar regras e lore.

O vínculo com Chronicle é opcional.

Conceitualmente, existem duas relações distintas:

```text
Usuário → Participação na Crônica → Crônica
Personagem → Vínculo de Personagem → Crônica
```

O Vínculo representa a presença do Personagem na Crônica. A localização do estado compartilhado ou específico será definida no Domain Model.

---

# 9. Entrada do jogador

## 9.1 Login

Entrada simples por conta.

---

## 9.2 Seleção de personagem

Interface inspirada em seleção de personagem de videogame.

Cada personagem pode apresentar:

- retrato;
- nome;
- clã;
- crônica;
- última atividade.

Sempre disponível:

**+ Criar novo personagem**

---

# 10. Hub pessoal

Após escolher:

# Boa noite, Marcus.

Se pertence a uma crônica:

- Entrar na Mesa;
- Ficha;
- Cidade;
- Crônica;
- Coterie;
- Relações;
- Regras;
- Lore;
- Refúgio;
- Diário;
- conteúdos sugeridos.

Se não pertence:

- Ficha;
- Regras;
- Lore;
- Biblioteca;
- possibilidade futura de entrar em crônica.

---

# 11. Criação de personagem

A criação deve ser:

- rápida;
- simples;
- didática;
- amigável para iniciantes;
- rápida para veteranos.

Cada etapa pode possuir ajuda opcional.

Exemplo:

### Disciplinas

Auspícios

> Percepção e sentidos sobrenaturais.

**Escolher**

**Entender esta Disciplina**

---

# 12. Ficha

A ficha terá três níveis.

## 12.1 Resumo

Durante a sessão:

- nome;
- Fome;
- Saúde;
- Força de Vontade;
- recursos essenciais.

---

## 12.2 Painel rápido

Aberto sobre a Mesa:

- paradas de dados;
- ações rápidas;
- poderes;
- condições;
- informações usadas durante jogo.

---

## 12.3 Ficha completa

Tela ampliada:

- atributos;
- habilidades;
- vantagens;
- defeitos;
- Disciplinas;
- histórico;
- relações;
- Pilares;
- demais campos.

---

# 13. Modo Jogar e Modo Editar

## Modo Jogar

Permitir interação rápida com:

- Fome;
- Saúde;
- Força de Vontade;
- rolagens;
- poderes;
- estados temporários.

## Modo Editar

Para alterações estruturais:

- atributos;
- habilidades;
- vantagens;
- defeitos;
- estrutura permanente.

---

# 14. Ficha em camada

A ficha não deve permanecer aberta ao lado da cena.

Também não deve exigir outra página para consultas simples.

Padrão:

- drawer/painel lateral amplo;
- cena permanece visível;
- fundo atenuado;
- painel pode expandir para tela cheia.

Futuro:

**Abrir em janela separada**

para múltiplos monitores.

No mobile:

> ficha ocupa a tela e retorna à Mesa ao fechar.

---

# 15. Sistema de rolagens

Três níveis.

## 15.1 Rolagem livre

O usuário pode iniciar por:

- Atributo;
- Habilidade.

Exemplo:

Clica em:

**Ciência ●●●**

Depois seleciona:

**Inteligência**

Pode adicionar:

- especialidade;
- bônus;
- penalidade;
- dificuldade.

Fome é automática.

---

## 15.2 Ações rápidas

Não utilizar “macro” como linguagem principal.

Utilizar:

# Ações rápidas

Exemplos:

- Pistola;
- Ataque desarmado;
- Investigação;
- Intimidação;
- Sentir o Invisível.

Podem ser:

- geradas pelo sistema;
- associadas a armas;
- associadas a poderes;
- salvas pelo usuário.

---

## 15.3 Rolagens especiais

Automatizar quando aplicável:

- Checagem de Sangue;
- Frenesi;
- Remorso;
- Humanidade;
- Força de Vontade;
- rerrolagens;
- demais testes específicos.

---

# 16. Roll Builder

Pequeno painel contextual.

Exemplo:

### Ciência

Atributo: Inteligência  
Ciência: ●●●  
Especialidade: Biologia  
Modificador: +1  
Dificuldade: 3  
Fome: ●●

**Pool final: X dados**

**ROLAR**

A dificuldade pode ser:

- definida;
- não informada;
- secreta;
- contestada.

---

# 17. Roll Templates

Combinações padrão devem ser configuráveis.

Não hardcodar regras universais como:

> Destreza + Armas Brancas

quando a regra ou contexto puder variar.

Armas, poderes e ações devem carregar configuração própria de parada.

---

# 18. Dados 3D

Os dados 3D fazem parte da experiência da Mesa.

Devem diferenciar:

- dados normais;
- Dados de Fome.

O Rules Engine determina o resultado.

A animação apenas o representa.

---

# 19. Resultado da rolagem

O sistema deve interpretar:

- sucessos;
- falhas;
- críticos;
- Críticos Bestiais;
- Falhas Bestiais;
- demais efeitos da edição.

Quando aplicável:

**Usar Força de Vontade para rerrolar**

---

# 20. Mesa de Sessão

A Mesa é uma experiência minimalista.

Elementos principais:

- imagem central da cena;
- nome/local;
- texto da cena;
- Scene Beats do Narrador;
- chat e Feed da Mesa;
- rolagens;
- acesso contextual a fichas e NPCs.

Não incluir inicialmente:

- grid;
- tokens;
- fog of war;
- walls;
- iluminação;
- combate tático;
- vídeo;
- voz.

---

# 21. Chat e Feed da Sessão

A Mesa deve possuir um **Feed compartilhado em tempo real**. O Chat, quando presente, é somente a capacidade de entrada de mensagens de texto; ele não é o contêiner dos demais eventos.

O Feed não substitui Discord ou voz. Ele funciona como a linha do tempo operacional e narrativa da sessão.

O Feed pode exibir, conforme autorização:

- mensagens de texto;
- rolagens;
- resultados;
- rolagens de NPC;
- rerolls;
- uso de Força de Vontade;
- handouts;
- alterações de cena;
- eventos importantes do sistema.

Exemplo:

### Marcus

Inteligência + Ciência

🎲 🎲 🔴 🎲 🔴 🎲

**4 sucessos**

---

### Annabelle

Intimidação

🎲 🎲 🎲 🎲 🎲 🎲

**3 sucessos**

---

### Narrador

> Novo handout revelado:  
> Recorte do Chicago Tribune.

O Feed pode ser lateral ou recolhível para não competir com a imagem central. A entrada de Chat aparece dentro dessa superfície somente quando o recurso estiver habilitado.

Questões futuras do Chat:

- IC/OOC;
- mensagens privadas;
- whisper;
- rolagens secretas do Narrador.

---

# 22. Mesa como superfície persistente

Sobre a Mesa podem abrir:

- ficha;
- NPC;
- regra;
- local;
- relação;
- imagem;
- Clock;
- Roll Builder.

Depois fecham sem perder contexto.

---

# 23. Experiência do Narrador

Objetivo:

> reduzir o trabalho do Mestre.

A aplicação não pode virar mais uma obrigação de manutenção.

---

# 24. Ciclo do Narrador

## Preparar

- cenas;
- NPCs;
- locais;
- imagens;
- relações;
- clocks;
- notas.

## Conduzir

- cena;
- NPCs;
- rolagens;
- regras;
- consulta rápida.

## Encerrar

- registrar acontecimentos;
- atualizar a crônica;
- futuramente gerar resumo e consequências.

---

# 25. Tela do Narrador

Elementos principais:

- imagem central;
- texto da cena;
- Scene Beats;
- NPCs On Deck;
- chat e rolagens;
- busca global;
- acesso rápido a regras, cidade e crônica.

---

# 26. Scene Beats

Notas curtas vinculadas à cena.

Exemplo:

### Objetivo

Descobrir quem encontrou Keller.

### Pontos

- Damien está nervoso.
- A câmera desapareceu.
- alguém observa a saída.

### Se os jogadores...

- pressionarem Damien → ...
- examinarem a câmera → ...

Evitar grandes blocos de texto.

---

# 27. NPCs On Deck

Narrador destaca poucos NPCs relevantes para a sessão.

Exemplo:

- Annabelle;
- Damien;
- Jackson.

Evita navegar por centenas de NPCs.

---

# 28. Painel rápido de NPC

Ao clicar em NPC:

- retrato;
- Saúde;
- Força de Vontade;
- paradas de dados;
- ataques;
- poderes;
- Disciplinas;
- ações rápidas.

Ações:

- Rolar;
- Ficha completa;
- Relações;
- Notas.

---

# 29. Edição de fichas pelo Narrador

Dentro da crônica, o Narrador pode auxiliar jogadores e editar fichas vinculadas.

A propriedade global continua sendo do jogador.

Alterações importantes devem poder possuir histórico.

---

# 30. Biblioteca

Deve ser estruturada por assunto, não apenas livro.

## Como jogar

- testes;
- Fome;
- combate;
- Humanidade;
- Frenesi;
- dano;
- cura;
- Força de Vontade;
- críticos;
- ações;
- demais mecânicas.

## Seu vampiro

- Atributos;
- Habilidades;
- Disciplinas;
- Vantagens;
- Defeitos;
- Tipo de Predador;
- Convicções;
- Pilares.

## Mundo das Trevas

- Caim;
- Livro de Nod;
- Clãs;
- Camarilla;
- Anarquistas;
- Sabbat;
- Gehenna;
- Segunda Inquisição;
- demais conceitos.

---

# 31. Pesquisa universal

Pesquisa sempre acessível.

Exemplo:

**Ctrl+K → Annabelle**

Resultados:

- NPC;
- lore;
- sessões;
- relações;
- imagens;
- locais.

**Ctrl+K → Frenesi**

Resultados:

- regra;
- exemplo;
- conceitos relacionados.

Tudo respeitando permissões.

---

# 32. SIRE

Assistente futuro baseado em IA.

Função:

> explicar rapidamente regras, lore e informações autorizadas da crônica.

Princípio:

**Biblioteca = fonte de verdade**

**SIRE = intérprete**

---

# 33. SIRE para regras

Exemplo:

> “Não entendi Crítico Bestial.”

Resposta simples.

Opções:

- Ver regra;
- Ver exemplo;
- Ver conceito relacionado;
- Ver fonte.

---

# 34. SIRE para lore

Exemplo:

> “Por que os Tremere têm problemas com os Salubri?”

Pode responder em:

- resumo;
- explicação;
- história;
- linha do tempo.

---

# 35. Personalidade do SIRE

Pode possuir tom discreto de mentor vampírico.

Evitar teatralidade excessiva.

Possíveis modos:

- Resposta rápida;
- Explique como meu Senhor.

---

# 36. Segurança da IA

A IA nunca será responsável por proteger segredos.

O backend deve impedir que dados proibidos cheguem ao modelo.

Fluxo:

**Usuário → Identidade → Crônica → Permissão → Recuperação autorizada → IA**

---

# 37. Spoiler Firewall

Nunca:

> enviar todos os segredos para a IA e pedir que não conte.

Sempre:

> filtrar antes.

Aplicável a:

- banco;
- embeddings;
- vector search;
- ferramentas;
- documentos.

---

# 38. Lore

A lore deve ser explorável e narrativa.

Não apenas artigos estilo wiki.

Exemplo:

# Livro de Nod

Caim  
↓  
Maldição  
↓  
Lilith  
↓  
Enoch  
↓  
Segunda Geração  
↓  
Antediluvianos  
↓  
Dilúvio

---

# 39. Modos de leitura

Possíveis:

- Resumo;
- Aprender;
- Lore completa;
- Narrativo;
- Linha do tempo.

---

# 40. Clãs e facções

Experiência própria.

Exemplo:

# Tremere

- visão geral;
- história;
- cultura;
- política;
- Disciplinas;
- maldição;
- personagens;
- linha do tempo;
- relações.

Mesmo padrão adaptado para:

- Camarilla;
- Anarquistas;
- Sabbat;
- outras facções.

---

# 41. Lore da crônica

Jogadores vinculados podem acessar:

- cidade;
- acontecimentos;
- locais;
- conteúdo publicado pelo Narrador;
- rumores;
- handouts;
- lore particular.

Inicialmente:

> somente conteúdo explicitamente publicado.

---

# 42. Cidade

A cidade é parte importante da experiência.

Objetivos:

- situar;
- contextualizar;
- criar territorialidade;
- conectar mundo real e ficcional.

---

# 43. Mapa geográfico

Direção preliminar:

**MapLibre + dados baseados em OpenStreetMap**

Evitar dependência inicial de Google Maps.

Suportar:

- lugares reais;
- fictícios;
- Refúgios;
- Elysiums;
- domínios;
- territórios.

---

# 44. Local

Cada local pode possuir:

- nome;
- localização;
- imagem;
- descrição;
- contexto real;
- contexto da crônica;
- histórico;
- relações;
- visibilidade.

---

# 45. Camadas do mapa

Filtros possíveis:

- locais conhecidos;
- Refúgios;
- Elysiums;
- domínios;
- territórios;
- eventos.

Evitar poluição.

---

# 46. Refúgio

Dois tipos:

## Refúgio pessoal

ligado ao personagem.

## Refúgio da Coterie

compartilhado.

Ambos podem aparecer no mapa.

---

# 47. Refúgio evolutivo

Ideia aprovada para futuro.

Inspirado no prazer de progressão visual de browser RPGs antigos como MonstersGame.

Não copiar:

- grind;
- PvP;
- economia artificial.

Aproveitar:

- imagem;
- poucos atributos;
- melhorias;
- sensação de evolução.

Exemplo:

Segurança ●●  
Ocultação ●●●  
Conforto ●

A imagem pode evoluir conforme o Refúgio melhora.

---

# 48. Coterie

Entidade de primeira classe.

Pode possuir:

- membros;
- ficha;
- domínio;
- Refúgio coletivo;
- recursos;
- Méritos/Defeitos;
- relações;
- Favores;
- histórico.

---

# 49. Relationship Graph

O mapa de relações é um grafo estruturado.

Possui:

- nodes;
- edges;
- direção;
- tipos;
- descritores;
- visibilidade;
- histórico.

---

# 50. Estética do grafo

Principal inspiração visual:

**Graph View do Obsidian**

Usar:

- force-directed layout;
- clusters;
- zoom;
- foco;
- expansão progressiva;
- atenuação de contexto;
- conexões orgânicas.

Evitar aparência de fluxograma empresarial.

---

# 51. Semântica Vampiro

Nós podem representar:

- PCs;
- NPCs;
- mortais;
- locais;
- Coteries;
- facções;
- eventos.

Relações:

- Senhor;
- Childe;
- aliado;
- inimigo;
- Touchstone;
- Boon;
- dívida;
- suspeita;
- amor;
- medo;
- controle;
- confiança.

---

# 52. Relações assimétricas

Cada lado pode possuir percepção diferente.

Marcus:

> “Desconfio de Annabelle.”

Annabelle:

> “Marcus é útil.”

O jogador pode conhecer apenas um lado.

---

# 53. Percepção versus verdade

O grafo do jogador representa o que ele sabe ou acredita.

O Narrador pode possuir visão completa.

---

# 54. Filtros do grafo

Obrigatórios.

Exemplos:

- personagem;
- Coterie;
- facção;
- clã;
- Favores;
- aliados;
- inimigos;
- Pilares;
- capítulo;
- sessão;
- status.

---

# 55. Grafo local

Mostrar inicialmente relações próximas ao personagem.

Permitir:

- primeiro nível;
- segundo nível;
- rede completa.

---

# 56. Favores / Boons

Ferramenta opcional.

Apresentação simples:

# Favores

### Você deve

Annabelle — Minor Boon

### Devem a você

Victor — Major Boon

Esses dados também alimentam o grafo.

---

# 57. Clocks

Ferramenta genérica.

Pode representar:

- Segunda Inquisição;
- Máscara;
- ritual;
- investigação;
- conspiração;
- consequência.

Campos:

- nome;
- segmentos;
- valor;
- descrição;
- visibilidade;
- histórico.

---

# 58. Máscara

Módulo opcional.

Exemplo:

# A Máscara em Chicago

○ ○ ○ ○ ○ ○

Quando ocorrer algo relevante:

- Ignorar;
- Registrar incidente;
- Avançar Clock.

Nunca automatizar consequências sem confirmação do Narrador.

---

# 59. Segunda Inquisição

Outro uso de Clock.

Futuramente pode se relacionar com:

- locais;
- incidentes;
- personagens;
- acontecimentos.

---

# 60. Recursos e riqueza

Manter simples.

Inicialmente:

**Resources ●●●**

Pode registrar:

- fontes;
- patrimônio;
- obrigações.

Evitar transformar a plataforma em sistema contábil.

---

# 61. Knife Theory / Ganchos pessoais

Não criar formulário redundante.

Derivar quando possível de:

- Pilares;
- Senhor;
- inimigos;
- Favores;
- Ambição;
- Desejo;
- Convicções;
- Defeitos;
- histórico.

Apresentar ao Narrador como:

# Ganchos de Marcus

---

# 62. Inteligência da crônica

Objetivo futuro:

ajudar o Narrador a perceber conexões.

Exemplo:

Marcus  
→ Annabelle  
→ Facção  
→ Local  
→ Plot Thread

IA pode futuramente sugerir possibilidades.

Nunca agir automaticamente.

---

# 63. Mundo vivo

Automatizar administração, não narrativa.

Exemplo:

Cena no Green Mill:

> registrar visita.

Novo Boon:

> atualizar Favores e relações.

Clock avançado:

> atualizar histórico.

---

# 64. Eventos de Sessão e Feed da Mesa

Registrar Eventos de Sessão estruturados e projetar no Feed da Mesa somente o que cada participante puder ver.

Exemplos:

- Scene Started;
- Location Visited;
- Roll Performed;
- Boon Created;
- NPC Status Changed;
- Clock Advanced;
- Relationship Changed;
- Character Updated;
- Note Created.

Os eventos persistidos podem alimentar:

- timeline;
- histórico;
- resumo;
- IA futura, quando houver autorização.

A Trilha de Auditoria operacional é separada desses eventos e não integra a experiência narrativa.

---

# 65. NPCs oficiais

Conteúdo canônico não deve ser alterado diretamente.

Usar:

**Canon + Chronicle Override**

Exemplo:

Annabelle canônica permanece intacta.

Na crônica:

> relação hostil com a Coterie.

---

# 66. NPCs próprios

Narrador pode criar:

- NPC;
- retrato;
- ficha;
- relações;
- facção;
- local;
- notas;
- ações rápidas.

---

# 67. Biblioteca de imagens

Imagens podem ser associadas a:

- NPC;
- local;
- cena;
- facção;
- handout.

Pesquisa simples.

Futuramente:

IA pode sugerir tags.

---

# 68. Pipeline de livros

Fluxo:

PDF  
→ extração  
→ estruturação  
→ Markdown original  
→ tradução  
→ glossário  
→ Markdown PT-BR  
→ classificação  
→ indexação.

---

# 69. Estrutura do Markdown

Evitar um único arquivo enorme.

Dividir por:

- capítulo;
- seção;
- regra;
- clã;
- Disciplina;
- lore.

---

# 70. Proveniência

Todo conteúdo deve registrar:

- obra;
- edição;
- capítulo;
- página;
- idioma;
- estado da tradução.

---

# 71. Original e tradução

Nunca apagar o original.

Manter:

- inglês/original;
- português.

---

# 72. Tradução

Perfis diferentes:

## Rule

precisão.

## Lore

fluidez e tom.

## Fiction

preservação narrativa.

## Table

estrutura.

---

# 73. Glossário

Memória terminológica controlada.

Campos:

- original;
- pt-BR;
- edição;
- fonte;
- status.

Estados:

- oficial;
- revisado;
- IA não revisada.

---

# 74. Fonte, conhecimento e regra

Três níveis:

## Fonte

texto extraído.

## Conhecimento

conteúdo organizado.

## Regra executável

mecânica utilizada pelo software.

A IA não valida regra sozinha.

---

# 75. Edições

A arquitetura deve suportar `edition`.

Não assumir V5 como única edição futura.

Possíveis:

- V5;
- V6;
- V20;
- outros.

---

# 76. Portabilidade

Character deve possuir modelo canônico independente da UI.

Possíveis saídas futuras:

- JSON;
- PDF;
- Foundry;
- outras integrações.

---

# 77. VTT futuro

Não construir inicialmente.

Se houver necessidade futura:

> preferir integração com Foundry.

Nossa plataforma continua sendo centro de:

- personagem;
- crônica;
- conhecimento;
- cidade;
- preparação.

---

# 78. Custos

Princípio:

> desenvolvimento inicial com custo adicional mínimo.

A aplicação básica não depende de IA paga.

Direção preliminar:

- Next.js;
- TypeScript;
- PostgreSQL/Supabase;
- serviços gratuitos ou baratos.

Decisões finais pertencem ao documento de arquitetura.

---

# 79. Identidade visual

A direção visual e a calibração da tela “Boa noite, Marcus” estão definidas. Tipografia, tokens e aplicações nas demais telas continuam em evolução controlada.

Direção conceitual:

> noir urbano contemporâneo + editorial sofisticado + investigação + horror discreto.

Evitar:

- excesso de vermelho;
- sangue decorativo;
- morcegos;
- gótico caricatural;
- fontes ilegíveis;
- aparência de dashboard corporativo.

---

# 80. Visual desejado

- escuro;
- limpo;
- moderno;
- legível;
- espaçoso;
- atmosférico.

A imersão deve vir principalmente de:

- fotografia;
- retratos;
- mapas;
- cena;
- cidade;
- motion sutil.

---

# 81. Design System

Antes de grande implementação de frontend, definir:

- marca;
- cores;
- tipografia;
- spacing;
- radius;
- sombras;
- iconografia;
- fotografia;
- motion;
- estados;
- feedback;
- acessibilidade;
- design tokens.

---

# 82. Benchmarks permanentes

As seguintes ferramentas devem continuar sendo pesquisadas durante produto, design e arquitetura.

## Demiplane Vampire Nexus

Referências:

- criação guiada;
- Click-To-Know;
- conteúdo contextual.

## GhoulApp

Referências:

- ficha + rolagem + crônica;
- módulos opcionais;
- NPCs On Deck;
- planning;
- mapas;
- Havens;
- relações;
- Live Session.

## Progeny

Referências:

- simplicidade;
- portabilidade;
- Foundry.

## Alchemy

Referências:

- Scenes;
- theater of the mind;
- imagem central;
- notas do Narrador.

## Realm of Darkness

Referências:

- View Mode;
- Edit Mode;
- realtime.

## V-Relations

Referências:

- Relationship Map;
- segredos;
- visibilidade.

## Kindred Companion

Referências:

- mapas;
- pins;
- wiki;
- relações.

## VtM Assistant

Referência:

- livros próprios pesquisáveis por IA.

## MonstersGame

Referência:

- progressão simples e visual de Refúgio.

## Obsidian

Referências:

- Graph View;
- force-directed graph;
- clusters;
- exploração.

## Roll20 V5

Referências:

- rolagens;
- Custom Rolls;
- Fome;
- rerolls;
- facilidade de sessão.

## Foundry WoD5E

Referências:

- Roll Builder;
- modificadores;
- automações;
- dados 3D;
- futura integração.

---

# 83. Horizonte funcional da primeira versão jogável

Este horizonte descreve a primeira experiência jogável desejada, não um único incremento de implementação. O Vertical Slice 01 e o MVP de playtest são recortes posteriores e menores, definidos pela Arquitetura de Produto e pelo Roadmap de Engenharia.

## Conta

- login;
- seleção de personagem.

## Personagem

- criação guiada;
- ficha;
- Modo Jogar;
- Modo Editar.

## Biblioteca

- regras essenciais;
- lore inicial;
- busca.

## Rolagens

- Roll Builder;
- Fome;
- ações rápidas;
- dados 3D;
- Evento de Sessão, Chat e Feed da Mesa.

## Crônica

- criação;
- vínculo;
- personagens;
- Coterie básica.

## Mesa

- imagem central;
- cena;
- chat compartilhado;
- rolagens;
- notas básicas;
- NPC rápido.

---

# 84. Evolução natural

Após o núcleo:

- SIRE;
- mapa da cidade;
- lore da crônica;
- Relationship Graph;
- Refúgios;
- Favores;
- clocks;
- timeline;
- diário;
- busca semântica;
- inteligência da crônica.

---

# 85. Laboratório / futuro

- Refúgio visualmente evolutivo;
- GraphRAG;
- IA analisando ganchos;
- automações de mundo;
- domínio territorial avançado;
- integração profunda com Foundry;
- música;
- ambientação avançada;
- recursos adicionais de VTT.

---

# 86. O que não construiremos inicialmente

- VTT tático;
- tokens;
- grid;
- walls;
- fog of war;
- iluminação dinâmica;
- voz;
- vídeo;
- gestão financeira detalhada;
- GraphRAG completo;
- simulador complexo de Refúgio;
- IA como Narrador;
- automações que retirem decisão humana;
- dezenas de módulos ativos por padrão.

---

# 87. Princípios de IA

IA deve:

- explicar;
- resumir;
- relacionar;
- ensinar;
- sugerir.

IA não deve:

- validar regra sozinha;
- definir canon;
- revelar segredo;
- alterar mundo sem confirmação;
- substituir o Narrador.

---

# 88. Experiência-alvo do jogador

O jogador deve conseguir:

- entrar rapidamente;
- escolher personagem;
- entender onde está;
- abrir ficha;
- rolar;
- consultar regra;
- explorar lore;
- visualizar cidade;
- entender relações;
- participar da sessão;

sem sentir que está usando uma ferramenta complexa.

---

# 89. Experiência-alvo do Narrador

O Narrador deve conseguir:

- preparar uma cena rapidamente;
- adicionar imagem;
- registrar poucos pontos;
- destacar NPCs;
- conduzir quase tudo em uma tela;
- abrir NPC;
- rolar testes;
- consultar regras;
- buscar cidade e informações;
- registrar consequência;

sem administrar constantemente a plataforma.

---

# 90. Métricas conceituais

Sempre perguntar:

**Isso aumenta a imersão ou apenas adiciona funcionalidade?**

**Isso reduz ou aumenta o trabalho do Narrador?**

**Um iniciante entende sem ler manual?**

**Um veterano consegue ignorar explicações?**

**Esta informação já existe em outro lugar?**

**Estamos mostrando isso porque é necessário agora?**

**Esse recurso pode ser opcional?**

---

# 91. Identidade do produto

A plataforma deve ser reconhecida por:

- português de qualidade;
- conteúdo acessível;
- imersão;
- personagem como centro;
- cidade viva;
- relações visuais;
- interface limpa;
- aprendizado contextual;
- SIRE;
- baixa fricção.

Não pela quantidade de funcionalidades.

---

# 92. Questões abertas

## Marca

- nome;
- símbolo;
- linguagem verbal;
- posicionamento visual.

## Identidade visual

- paleta;
- tipografia;
- iconografia;
- fotografia;
- direção de arte.

## Biblioteca

- conteúdo inicial;
- fluxo de revisão de tradução.

## Crônica

- granularidade de permissões da V1.

## Coterie

- profundidade na V1.

## Cidade

- V1 ou primeira evolução.

## Chat

- IC/OOC;
- mensagens privadas;
- whisper;
- rolagens secretas.

## IA

- momento de introdução;
- provedor;
- orçamento futuro.

## Conteúdo

- limites jurídicos;
- licenciamento;
- distribuição de material protegido.

---

# 93. Documentos derivados e estado atual

| Documento | Estado | Papel atual |
|---|---|---|
| Visual Identity & Design Direction v0.1 | em evolução | direção artística consolidada; tipografia e tokens ainda pendentes |
| Product Architecture & Core User Flows v0.1 | aprovado | formaliza navegação, atores e fluxos principais |
| Modelo de Domínio v0.1 | aprovado | formaliza entidades, agregados, invariantes e decisões estruturais |
| Architecture v0.1 | aprovado | stack, módulos, dados, segurança, realtime, operação e limites de IA definidos |
| Engineering Foundation | próximo | criar esqueleto, CI, banco e ambiente reproduzível |
| ADRs | contínuo | registrar decisões de alto impacto ou difícil reversão |

A dúvida original sobre reutilização de Personagem entre Crônicas foi resolvida: na v0.1, cada Personagem possui no máximo um Vínculo ativo; outra Crônica exige uma cópia explícita. Mudanças nessa política exigem decisão versionada.

---

# 94. Princípio final

O projeto deve seguir uma regra central:

> **Quanto mais complexo for o Mundo das Trevas por trás da aplicação, mais simples deve parecer a experiência para quem está usando.**

O jogador deve enxergar:

> personagem, mundo, história e escolhas.

O Narrador deve enxergar:

> contexto, relações e ferramentas úteis.

A aplicação fica responsável pela complexidade existente por baixo dessas experiências.

O objetivo não é substituir os livros, o Narrador ou a imaginação.

É tornar Vampiro: A Máscara **mais fácil de compreender, organizar, explorar e viver**.
