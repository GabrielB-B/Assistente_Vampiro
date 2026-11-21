# Estudo Visual da Ficha V5 v0.1

**Status:** substituído pela Direção da Ficha V5 v0.2<br>
**Data:** 25 de outubro de 2026<br>
**Voz dominante:** função<br>
**Art Level:** 0–1<br>
**Densidade:** D3 na ficha; D4 somente em edição avançada<br>
**Implementação:** primeira aplicação rejeitada por Gabriel em 25 de outubro de 2026

> **Registro histórico:** a composição com nome em escala de pôster e painel
> `Jogar agora` lateral foi rejeitada por parecer um formulário corporativo
> genérico. Não reutilizar essa composição. A substituição está em
> [Direção da Ficha V5 v0.2](./direcao-ficha-v5-v0.2.md).

## 1. Problema visual

A ficha precisa conciliar quatro forças:

- familiaridade da ficha padrão V5;
- leitura prolongada durante a sessão;
- identidade própria de horror urbano contemporâneo;
- controles digitais rápidos sem aparência de dashboard SaaS.

Ela não deve parecer um PDF embutido, um formulário administrativo ou uma cópia
do trade dress oficial.

## 2. Referências e limites

### Referência funcional

A ficha oficial orienta o mapa mental: cabeçalho de identidade, Atributos,
trilhas, Habilidades, Disciplinas, Fome e Humanidade.

### Leitura visual da ficha oficial fornecida

A inspeção das duas páginas confirmou os elementos que produzem familiaridade:

- folha clara de alta densidade, com três colunas mecânicas bem marcadas;
- identidade organizada em nove campos, antes de qualquer valor mecânico;
- títulos editoriais centralizados e separadores finos;
- círculos como linguagem dominante para valores e trilhas;
- moldura angular muito discreta e grandes áreas de respiro nas zonas narrativas;
- primeira página orientada a consulta mecânica;
- segunda página orientada a Crônica, Sangue, biografia e história.

O produto preserva essa hierarquia e esse ritmo, mas não reproduz logotipo,
moldura, fontes, proporções exatas ou ornamentos. A familiaridade virá da ordem e
do comportamento dos dados, não da imitação gráfica.

### Referência artística

- Amy Wilkins: presença, detalhe seletivo, figura e silêncio;
- Michael Gaydos: enquadramento, cidade e narrativa espacial;
- linha editorial V5: ritmo entre atmosfera e informação.

Na ficha, essas referências aparecem como princípios de hierarquia e
materialidade, não como imitação de traço. A função domina e a arte recua.

O portfólio de Amy Wilkins reforça figura, emoção, gesto e detalhe seletivo. O de
Michael Gaydos reforça enquadramento urbano, contraste de tinta e narrativa
espacial. Essas leituras orientam áreas narrativas e materiais autorais futuros;
não autorizam reproduzir obras, personagens, composições ou a assinatura visual
dos artistas.

## 3. Rotas cromáticas estudadas

### A — Livro-caixa noturno

Ficha inteira em azul-preto, texto marfim e linhas frias.

**Força:** integra-se facilmente à Mesa noturna.<br>
**Risco:** pode virar dashboard dark e cansar em uso prolongado.

### B — Folha de marfim

Superfície clara e quente, tinta escura, linhas discretas e oxblood pontual.

**Força:** aproxima a familiaridade de uma ficha de papel.<br>
**Risco:** rompe demais com a entrada noturna e pode parecer PDF digitalizado.

### C — Limiar: noite por fora, ficha por dentro

Shell azul-preto; ficha em marfim gasto; camada “Jogar agora” escura; vermelho
reservado para Fome, risco e confirmação destrutiva.

**Força:** separa atmosfera de operação, preserva familiaridade e cria identidade
própria.<br>
**Risco:** exige transições e contraste cuidadosamente controlados.

**Recomendação:** rota C — Limiar.

A rota C não tenta “escurecer” a ficha oficial. Ela cria duas camadas distintas:
a folha clara serve à leitura densa; o entorno noturno serve ao contexto da
Crônica e às ações de mesa. O vermelho aparece apenas quando o Sangue altera o
estado ou o resultado.

## 4. Paleta estrutural proposta

Esta paleta serve à ficha e ainda depende de aprovação visual em protótipo.

| Token conceitual | Valor | Uso |
|---|---|---|
| `night-ink` | `#0B0F12` | shell e camada Jogar agora |
| `night-text` | `#E8E0D4` | texto primário no shell |
| `night-muted` | `#AAA69E` | texto secundário no shell |
| `night-line` | `#63727C` | borda/foco não textual no shell |
| `sheet-bone` | `#E7E0D4` | superfície principal da ficha |
| `sheet-ink` | `#191B1D` | texto principal da ficha |
| `sheet-muted` | `#5D5A55` | texto secundário da ficha |
| `sheet-line` | `#76716A` | divisores e controles vazios |
| `oxblood` | `#8A2835` | Fome e ações críticas sobre marfim |
| `blood-light` | `#B64955` | acento acessível sobre fundo noturno |
| `focus-gold` | `#D0A85C` | foco e atenção não destrutiva |
| `success` | `#426B58` | confirmação sem competir com Fome |

Contrastes medidos para os pares principais:

- `sheet-ink` / `sheet-bone`: 13,17:1;
- `sheet-muted` / `sheet-bone`: 5,23:1;
- `oxblood` / `sheet-bone`: 6,57:1;
- `night-text` / `night-ink`: 14,70:1;
- `night-muted` / `night-ink`: 7,93:1;
- `focus-gold` / `night-ink`: 8,65:1.

## 5. Tipografia proposta

### Newsreader

Uso restrito a:

- nome do Personagem;
- títulos de seção importantes;
- frases editoriais curtas.

Foi criada para leitura contínua em tela, possui suporte latino amplo e licença
SIL Open Font License 1.1.

### IBM Plex Sans

Uso em:

- rótulos;
- campos;
- números;
- controles;
- Roll Builder;
- mensagens e estados.

Foi desenhada para ambientes de interface, oferece pesos e larguras adequados à
densidade e usa SIL Open Font License 1.1.

### Regras

- serif nunca em corpo operacional pequeno;
- caixa alta somente em rótulos curtos, com tracking moderado;
- números tabulares em trilhas e fórmulas;
- peso, espaço e posição criam hierarquia antes da cor;
- fonte decorativa ou gótica é rejeitada.

Fontes públicas:

- [Newsreader](https://github.com/productiontype/Newsreader);
- [IBM Plex](https://github.com/IBM/plex).

## 6. Grid e ritmo

- base espacial: 4 px;
- intervalos funcionais: 8, 12, 16, 24 e 32 px;
- largura confortável da ficha: 720–960 px;
- camada Jogar agora: 288–360 px;
- divisores de 1 px; hierarquia principal por espaço, não por caixas;
- raio da ficha: 2 px ou nenhum;
- raio de controles: 2–4 px;
- cards só quando representam um objeto independente, nunca cada seção.

## 7. Anatomia visual dos componentes

### Campo de identidade

- rótulo pequeno em sans;
- valor em sans ou Newsreader quando for o nome;
- leitura usa linha silenciosa, sem caixa;
- edição introduz superfície e contorno visíveis;
- erro aparece abaixo, não por tooltip isolado.

### Linha de traço

- rótulo é o principal alvo de rolagem;
- valor numérico sempre visível;
- cinco pontos reforçam reconhecimento, mas não substituem o número;
- hover realça a linha inteira;
- seleção para rolagem usa barra lateral e `aria-pressed`;
- edição dos pontos só aparece no Modo Editar.

### Ponto de nível

- vazio: contorno `sheet-line`;
- preenchido: `sheet-ink`;
- Fome: `oxblood`, somente no controle correspondente;
- foco: anel `focus-gold` de 2 px;
- tamanho visual mínimo 12 px dentro de alvo de 44 px quando interativo.

### Trilha

- forma diferente para vazio, superficial e agravado;
- resumo textual acompanha o desenho;
- animação curta de 120–180 ms, sem pulsação contínua;
- mudança perigosa exige confirmação ou desfazer.

### Ação rápida

- linha compacta, não card;
- nome, fórmula resolvida, origem e ação `Preparar`;
- ataque pode exibir dano como metadado separado;
- favorito/reordenação não compete com o botão principal;
- preset inválido mostra o componente que deixou de existir.

### Roll Builder

- painel contextual sobre a camada Jogar agora;
- fórmula em linguagem humana antes de números;
- cada parcela pode ser aberta para explicação;
- Fome possui tratamento vermelho localizado;
- `Rolar` é o único botão forte no estado pronto;
- erros permanecem próximos ao campo responsável.

## 8. Estados visuais obrigatórios

| Estado | Tratamento |
|---|---|
| leitura | sem aparência de formulário |
| hover | mudança moderada de fundo/linha |
| foco | contorno `focus-gold`, nunca só cor de texto |
| selecionado | barra, fundo e estado semântico |
| edição | campo claramente delimitado |
| inválido | mensagem + ícone/forma + cor |
| salvando | indicador local sem bloquear toda a ficha |
| salvo | confirmação breve e silenciosa |
| desabilitado | contraste reduzido com explicação disponível |
| negado | mensagem genérica sem confirmar segredo |
| vazio | instrução e próxima ação, não traços falsos |
| erro | recuperação explícita |

## 9. Arte e textura

A ficha usa arte somente em:

- retrato opcional;
- cabeçalho de contexto;
- marca atmosférica muito discreta da Crônica.

Textura deve ser procedural ou própria, com contraste mínimo, nunca uma obra de
referência incorporada. Amy Wilkins e Michael Gaydos não serão imitados.

## 10. Responsividade

### Desktop

- ficha e Jogar agora podem coexistir;
- ordem familiar das três colunas é preservada;
- painel lateral pode recolher.

### Tablet

- ficha ocupa a área principal;
- Jogar agora abre em drawer;
- grupos podem passar de três para duas colunas sem reordenar o DOM.

### Mobile

- uma coluna;
- resumo e ações rápidas primeiro;
- seções recolhíveis preservam ordem;
- nenhum ponto exige precisão fina;
- retorno à Mesa restaura rolagem e foco.

## 11. O que está rejeitado

- reproduzir a folha oficial como background;
- usar o logo oficial no cabeçalho da ficha;
- borda ornamental copiada;
- dashboard de cards escuros;
- sangue decorativo;
- serif gótica;
- vermelho em todos os controles;
- vidro, neon e gradiente roxo/azul;
- textura simulando arte humana em cada componente;
- esconder densidade com menus imprevisíveis.

## 12. Gate de aprovação

- [x] Rota C adotada como direção de trabalho;
- [x] Newsreader e IBM Plex Sans aplicadas em PT-BR;
- [x] ficha e páginas representativas do manual comparadas com a anatomia;
- [x] portfólios oficiais dos artistas reconsultados sem importar suas obras;
- [x] wireframes desktop e mobile implementados;
- [ ] estados de erro, conflito, carregamento e permissão validados com dados reais;
- [ ] QA de contraste e zoom de 200% repetido após a integração.
