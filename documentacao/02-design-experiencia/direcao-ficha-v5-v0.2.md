# Direção da Ficha V5 v0.2 - Folha Viva

**Status:** direção visual da Ficha Completa aprovada por Gabriel<br>
**Data:** 30 de outubro de 2026<br>
**Substitui:** aplicação visual da Rota C registrada no estudo v0.1<br>
**Escopo:** ficha de Personagem V5 em desktop e mobile

## 1. Registro da decisão

Gabriel rejeitou o primeiro protótipo visual por parecer um formulário
corporativo genérico. Os sinais rejeitados foram:

- nome do Personagem em escala de pôster;
- composição de dashboard com painel lateral permanente;
- excesso de espaço editorial onde a ficha exige densidade;
- campos tratados como cards e blocos administrativos;
- distância visual excessiva da ficha usada nos manuais e no Roll20.

Esse arranjo não deve retornar em futuras iterações da ficha.

## 2. Referências guardadas

### Fonte canônica fornecida por Gabriel

PDF local de duas páginas:

```text
D:\RPG\VAMPIRO A MASCARA\Material 1 - Fichas de personagem\
Vampiro - A Máscara - Ficha de personagem (branco) - Oficial Galápagos.pdf
```

O PDF não entra no Git. Ele foi inspecionado visualmente e permanece como fonte
local de comparação.

Gabriel também forneceu capturas da ficha oficial em português e da ficha V5 no
Roll20. As capturas orientam comparação, mas não são assets do produto.

### Fontes públicas do Roll20

- [Produto oficial V5 no Roll20](https://marketplace.roll20.net/browse/compendiumexpansion/11140/vampire-the-masquerade-core-rule-book)
- [Discussão da ficha V5 by Roll20](https://app.roll20.net/forum/post/10167852/vampire-the-masquerade-5th-edition-by-roll20/)
- [Repositório público de fichas comunitárias](https://github.com/Roll20/roll20-character-sheets)
- [HTML da ficha comunitária V5](https://github.com/Roll20/roll20-character-sheets/blob/master/vampire-v5/vampirev5.html)
- [Integração atual entre fichas Demiplane e Roll20](https://help.roll20.net/hc/en-us/articles/30050730960151-Demiplane-and-Roll20-Character-Sheet-Integration-Beta)

A ficha licenciada `by Roll20` é fechada. O código comunitário público é
benchmark de comportamento, não dependência nem base para cópia.

## 3. Anatomia extraída da ficha oficial

A primeira página define a ordem visual obrigatória:

1. marca central e moldura perimetral fina;
2. identidade em grade de três colunas por três linhas;
3. Atributos em Físicos, Sociais e Mentais;
4. Vitalidade e Força de Vontade;
5. Habilidades nas mesmas três famílias;
6. Disciplinas em tabela de três colunas;
7. Ressonância, Fome e Humanidade no rodapé.

A segunda página define:

1. Princípios da Crônica;
2. Pilares e Convicções;
3. Perdição do Clã;
4. Vantagens e Defeitos;
5. Potência do Sangue e seus efeitos;
6. experiência, biografia, aparência, história e notas.

## 4. Gramática visual obrigatória

- superfície clara com aparência de folha, dentro do ambiente noturno;
- proporção vertical e largura controlada;
- moldura fina vinho com cantos recortados, desenhada pelo produto;
- títulos centralizados entre filetes vinho;
- tipografia serifada clássica para seções e nomes mecânicos;
- sans discreta para estado, navegação e dados operacionais;
- círculos para valores de Características;
- quadrados para trilhas;
- pontilhado ou filete como condutor entre nome e valor;
- alta densidade organizada, sem cards para cada grupo;
- vermelho oxblood como tinta mecânica, nunca como preenchimento decorativo.

## 5. Adaptação digital própria

O produto não embute um PDF. A folha é HTML semântico e responsivo.

- o losango próprio identifica um traço carregado que pode iniciar jogada;
- clicar numa Habilidade abre o Roll Builder e pede o Atributo;
- Fome permanece na posição mecânica esperada da folha;
- as abas preservam frente, Crônica/Sangue e História;
- campos ainda ausentes usam marcas vazias e uma legenda honesta;
- nenhum valor mecânico é inventado para preencher a composição.

## 6. Responsividade

### Desktop

- folha central de até 72 rem, com densidade alta sem comprimir os marcadores;
- três colunas canônicas preservadas;
- primeira página mecânica legível sem painel lateral.

### Mobile

- identidade e famílias mecânicas passam para uma coluna;
- ordem canônica do DOM não muda;
- abas podem rolar horizontalmente sem sobrepor texto;
- linhas de traço e alvos interativos ocupam a largura disponível;
- nenhum conteúdo pode forçar rolagem horizontal da página.

## 6.1. Refinamento óptico v0.3

O segundo passe da Folha Viva preserva a anatomia já validada e corrige sinais de
compressão percebidos na primeira renderização:

- círculos ligeiramente maiores e preenchimento sólido, sem aro interno;
- mais distância entre nome, linha condutora e valor;
- linhas mecânicas mais altas e grupos com melhor separação;
- grade de identidade com mais altura para valores longos;
- abas e controles com alvos mais confortáveis;
- trilhas quadradas e ledger de Disciplinas em escala coerente com os círculos;
- mobile com alvos de traço de 48 px e marcadores maiores.

Esse passe não adiciona campos nem muda regras. Gabriel aprovou a direção visual
da Ficha Completa; a aprovação não abrange a Mesa, a Ficha Rápida, o entorno do
site ou qualquer tela de sessão ainda sem conceito de arte definido.

## 7. Limites de identidade e direitos

O Assistente Vampiro pode reproduzir a organização funcional necessária para
uma ficha compatível, mas não incorpora:

- logotipo oficial;
- fontes proprietárias;
- símbolos, ilustrações ou ícones extraídos dos livros;
- imagem da ficha como background;
- código da ficha licenciada do Roll20;
- trade dress exato ou assets do marketplace.

A marca provisória `AV`, a moldura, a textura procedural e os controles são
originais do projeto.

## 8. Critérios para validação de Gabriel

- [x] a tela é reconhecida imediatamente como ficha de Vampiro V5;
- [x] a ficha não parece dashboard ou formulário corporativo;
- [x] identidade, Atributos, Habilidades e Disciplinas seguem a hierarquia esperada;
- [x] a camada digital melhora o uso sem esconder a folha;
- [x] os controles de rolagem parecem parte natural da ficha;
- [x] desktop e mobile preservam a mesma identidade;
- [x] nenhum asset ou dado foi inventado apenas para decorar.

## 9. Limite desta aprovação

Este corte entrega exclusivamente a Ficha Completa. Não define nem implementa
o conceito de arte da Mesa, da Ficha Rápida, da tela `Boa noite` ou do shell
geral do produto.
