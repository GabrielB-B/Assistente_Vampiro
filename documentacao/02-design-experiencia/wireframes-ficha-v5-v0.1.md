# Wireframes da Ficha V5 v0.1

**Status:** registro histórico; composição visual substituída<br>
**Data:** 25 de outubro de 2026<br>
**Direção aplicada:** Rota C - Limiar<br>
**Escopo:** desktop, Roll Builder e mobile<br>
**Implementação visual:** primeira tradução rejeitada; consultar a direção v0.2

> O painel lateral permanente e o cabeçalho de personagem deste wireframe não
> são mais direção vigente. A anatomia funcional continua útil, mas sua
> composição foi substituída pela
> [Direção da Ficha V5 v0.2](./direcao-ficha-v5-v0.2.md).

## 1. Objetivo

Validar hierarquia, ordem de leitura e comportamento antes de escolher detalhes
de acabamento. Estes wireframes não definem arte final, ilustrações, logotipo,
texturas ou aparência de componentes.

A ficha oficial Galápagos fornece a ordem canônica. O painel `Jogar agora` e o
Roll Builder são camadas digitais próprias e não fingem fazer parte da folha.

## 2. Princípios observáveis

- leitura é o estado inicial;
- edição é um modo explícito;
- nome do traço, e não os pontos, inicia uma rolagem;
- Fome permanece visível durante a preparação;
- Ações rápidas mostram a fórmula resolvida antes de confirmar;
- a segunda página canônica continua identificável;
- painel lateral pode desaparecer sem tornar a ficha inutilizável;
- nenhuma ação depende apenas de hover ou cor.

## 3. Desktop - ficha e contexto de jogo

Viewport de referência: 1440 x 900. A ficha ocupa entre 760 e 960 px. O painel
operacional ocupa entre 300 e 360 px e pode ser recolhido.

```text
+--------------------------------------------------------------------------------------+
| Assistente Vampiro     Marcus Reed / Sangue Novo       [Jogar] [Editar] [Voltar]    |
+-------------------------------------------------------------+------------------------+
| FICHA ESSENCIAL                                             | JOGAR AGORA            |
| [Essencial] [Crônica & Sangue] [História]                   |                        |
|                                                             | Fome  2 de 5           |
| Nome     Marcus Reed   Conceito Investigador   Predador ...  | Vitalidade  5          |
| Crônica  Sangue Novo   Ambição  ...             Clã      ...  | Vontade     6          |
| Senhor   ...           Desejo   ...             Geração ...  |                        |
|                                                             | AÇÕES RÁPIDAS          |
|                                                             | > Pistola              |
| ATRIBUTOS                                                   |   Destreza + Armas...  |
| Físicos              Sociais              Mentais            | > Examinar uma cena    |
| Força        2 ooooo Carisma       3 ooooo Inteligência 3   |   Inteligência + ...  |
| Destreza     3 ooooo Manipulação   2 ooooo Raciocínio   3   | > Intimidar            |
| Vigor        2 ooooo Autocontrole  3 ooooo Determinação 3   |                        |
|                                                             | [+ Nova ação rápida]   |
| Vitalidade  [ ][ ][ ][ ][ ]  Força de Vontade [ ][ ][...]  |                        |
|                                                             | JOGADAS RECENTES       |
| HABILIDADES                                                 | 21:18 Investigação     |
| Armas Brancas   1   Empatia com Animais 0   Ciência      0  | 21:12 Percepção        |
| Armas de Fogo   3   Etiqueta           2   Erudição     1  |                        |
| Atletismo       2   Intimidação        1   Finanças     0  | [Abrir ficha rápida]   |
| ...                 ...                    ...              |                        |
|                                                             |                        |
| DISCIPLINAS                                                 |                        |
| [linhas resumidas; poderes abrem sob demanda]               |                        |
|                                                             |                        |
| Ressonância ........   Fome .....   Humanidade ..........   |                        |
+-------------------------------------------------------------+------------------------+
```

### Anotações

1. A primeira aba preserva a leitura da primeira página oficial.
2. `Crônica & Sangue` preserva Princípios, Pilares, Convicções, Perdição,
   Vantagens, Defeitos, Potência de Sangue e Experiência.
3. `História` reúne biografia, aparência, traços, história e notas sem quebrar a
   ordem semântica da segunda página.
4. Os pontos são leitura no Modo Jogar. O alvo de rolagem é o rótulo inteiro.
5. O painel lateral não usa cards para cada bloco; divisores e espaço organizam.
6. Ações rápidas abrem uma preparação. Não rolam silenciosamente.

## 4. Roll Builder - Habilidade para Atributo

O painel abre sobre `Jogar agora` no desktop e como drawer no mobile. O contexto
da ficha permanece visível sempre que houver espaço.

```text
+----------------------------------------------------+
| PREPARAR JOGADA                            [Fechar] |
| Examinar uma cena                                  |
+----------------------------------------------------+
| Habilidade                                         |
| Investigação                                  3    |
|                                                    |
| Escolha o Atributo                                 |
| ( ) Inteligência 3   raciocinar e pesquisar        |
| ( ) Raciocínio   3   notar e reagir                |
| ( ) Outro...       exige escolha explícita         |
|                                                    |
| Especialização                                     |
| [Cena de crime                                  v] |
|                                                    |
| Ajustes                                             |
| [+1 Especialização] [Adicionar ajuste]             |
|                                                    |
| Dificuldade                                         |
| [3 - Moderada                                   v] |
| Aguardando confirmação do Narrador                  |
|                                                    |
| RESUMO                                              |
| Inteligência 3 + Investigação 3 + Especialização 1 |
| Parada: 7 dados                                     |
| Fome: 2 -> 5 normais + 2 Dados de Fome             |
|                                                    |
| [Salvar como ação rápida]            [Confirmar]   |
+----------------------------------------------------+
```

### Comportamento

- selecionar uma Habilidade não escolhe automaticamente o Atributo;
- sugestões são exemplos contextuais, nunca regra universal;
- em sessão, o Narrador confirma Características e Dificuldade;
- a fórmula é preparada no servidor com valores atuais;
- alterar qualquer escolha volta o estado para `COMPOSING`;
- alteração concorrente da ficha produz `STALE` e exige nova preparação;
- `Confirmar` muda para `Rolando...` e não aceita segundo envio;
- fechar preserva um rascunho local curto, nunca uma tentativa histórica.

## 5. Resultado da rolagem

```text
+----------------------------------------------------+
| INVESTIGAÇÃO - Marcus Reed                         |
| Inteligência 3 + Investigação 3 + Especialização 1 |
| Dificuldade 3                                      |
|                                                    |
| Dados comuns:  [8] [7] [6] [4] [2]                |
| Dados de Fome: [10] [3]                            |
|                                                    |
| 4 sucessos - VITÓRIA                               |
| Margem 1                                           |
|                                                    |
| A consequência narrativa pertence ao Narrador.     |
| [Ver cálculo] [Salvar ação] [Fechar]               |
+----------------------------------------------------+
```

O exemplo valida hierarquia, não fixa faces nem conteúdo de produção. Resultado
especial deve alterar título, ícone, texto e semântica; vermelho sozinho não é
suficiente.

## 6. Mobile - consulta e ação em mesa

Viewport de referência: 360 x 800.

```text
+----------------------------------+
| < Mesa       Marcus Reed    ...  |
| Sangue Novo                      |
+----------------------------------+
| Fome 2   Vitalidade 5   Vontade 6|
| [Preparar jogada]                |
+----------------------------------+
| AÇÕES RÁPIDAS                    |
| Pistola                     >    |
| Examinar uma cena           >    |
| Intimidar                   >    |
+----------------------------------+
| FICHA                            |
| [Essencial] [Crônica & Sangue]   |
|                                  |
| Identidade                  v    |
| Atributos                   v    |
|   Força                  2  >    |
|   Destreza               3  >    |
|   ...                            |
| Habilidades                 v    |
|   [Buscar habilidade...]         |
|   Investigação            3  >   |
|   Percepção               2  >   |
| Disciplinas                  >   |
| Trilhas e estados             >  |
+----------------------------------+
| [Voltar à Mesa]   [Jogar agora]  |
+----------------------------------+
```

### Regras mobile

- uma coluna e ordem de DOM estável;
- resumo de mesa antes da ficha completa;
- grupos recolhíveis informam estado e quantidade de itens;
- busca filtra visualmente sem reordenar a taxonomia oficial;
- toque mínimo de 44 x 44 CSS px;
- drawer do Roll Builder ocupa a tela e mantém retorno previsível;
- o rodapé fixo aparece apenas durante contexto de sessão;
- zoom de 200% não esconde confirmação nem mensagem de erro.

## 7. Estados que precisam de protótipo

| Estado | Evidência necessária |
|---|---|
| carregando | esqueleto da estrutura sem dados falsos |
| vazio | orientação para preencher sem inventar personagem |
| erro recuperável | causa segura, tentar novamente e retorno |
| permissão negada | mensagem sem revelar recurso secreto |
| indisponível por regra | explicação e perfil efetivo |
| salvando | progresso local e prevenção de duplo envio |
| salvo | confirmação breve |
| conflito | comparar versão e recarregar com segurança |
| preparação obsoleta | manter intenção e recalcular valores |
| offline durante confirmação | não afirmar falha antes de consultar idempotência |

## 8. Hipóteses aplicadas no protótipo

1. Rota C - shell noturno e folha clara - como direção de trabalho.
2. Ações rápidas visíveis no desktop e antes da ficha no mobile.
3. A segunda página dividida em `Crônica & Sangue` e `História`, preservando a
   ordem canônica.
4. Roll Builder aberto a partir de Habilidade ou Ação rápida.
5. Áreas mecânicas densas sem arte de personagem concorrendo com a leitura.

## 9. Gate de saída

- [x] hierarquia desktop implementada e inspecionada em 1440 px;
- [x] ordem mobile implementada e inspecionada em 390 px;
- [x] posição responsiva de Ações rápidas implementada;
- [x] fluxo Habilidade → Atributo → ajustes → preparação implementado;
- [x] autoridade final do Narrador indicada no seletor de Dificuldade;
- [ ] estados de erro e conflito aceitos;
- [ ] conectar confirmação ao servidor somente depois do contrato HTTP.
