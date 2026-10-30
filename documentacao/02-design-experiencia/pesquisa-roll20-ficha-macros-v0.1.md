# Pesquisa Roll20 - Ficha V5 e Macros v0.1

**Status:** pesquisa concluída para orientar produto<br>
**Data:** 25 de outubro de 2026<br>
**Escopo:** ficha oficial, ficha comunitária, macros, ações e resultados<br>
**Uso:** benchmark funcional; não é fonte normativa de regras

## 1. Pergunta de pesquisa

Como o Roll20 reduz o trabalho de montar rolagens de Vampiro V5 e quais padrões
podem ser incorporados ao Assistente Vampiro sem copiar código, interface,
conteúdo licenciado ou limitações da plataforma?

## 2. Fontes examinadas

### 2.1 Ficha licenciada “by Roll20”

A ficha oficial lançada em 2021 foi apresentada com:

- ficha de Personagem Jogador;
- Roll Templates próprios para Atributos e Habilidades;
- arrastar e soltar Disciplinas, Vantagens e Defeitos;
- evolução posterior de SPCs, trilhas e integração do compêndio.

O código da ficha licenciada não é público. O produto do marketplace declara uso
pessoal dentro do Roll20 e proíbe distribuição dos ativos. Ela é benchmark de
integração, não base de implementação.

Fontes:

- [anúncio e acompanhamento da ficha oficial](https://app.roll20.net/forum/post/10167852/vampire-the-masquerade-5th-edition-by-roll20/);
- [Vampire: The Masquerade 5th Edition no marketplace](https://marketplace.roll20.net/browse/bundle/11261/vampire-the-masquerade-5th-edition-core-rulebook).

### 2.2 Ficha comunitária V5

A implementação comunitária pública é anterior e distinta da ficha “by
Roll20”. Seu código mostra estes padrões:

- abas para núcleo, Crônica, Sangue/Experiência, detalhes, rolagens e coterie;
- botão ao lado de cada Atributo e Habilidade;
- escolha de um segundo componente e modificador no momento da rolagem;
- separação de dados comuns e Dados de Fome;
- rolagens próprias para Disciplinas, Checagem de Sangue, Frenesi, Remorso e
  Humanidade;
- seções repetíveis para Disciplinas, poderes, rituais, armas e jogadas
  personalizadas;
- jogadas personalizadas com nome, dois traços, Fome e Potência de Sangue.

Essa ficha possui dois caminhos de rolagem: um baseado em script de API e outro
em rolagens inline. O histórico público registra diferenças de comportamento e
correções entre os dois. Isso reforça que o Assistente Vampiro deve manter um
único avaliador mecânico no servidor.

Fontes:

- [código da ficha comunitária](https://github.com/Roll20/roll20-character-sheets/tree/master/vampire-v5);
- [script comunitário de dados V5](https://github.com/Roll20/roll20-api-scripts/tree/master/vampire-v5);
- [guia da ficha comunitária](https://wiki.roll20.net/Vampire_The_Masquerade_5th_edition).

### 2.3 Macros e Token Actions

A documentação do Roll20, atualizada em julho de 2026, estabelece:

- macros são atalhos pertencentes ao jogo;
- Token Actions pertencem a um Personagem;
- atributos podem ser referenciados e acompanham alterações da ficha;
- Roll Queries pedem escolhas ou modificadores durante a execução;
- Quick Bar mantém atalhos acessíveis e reordenáveis;
- Roll Templates estruturam a apresentação no chat;
- linhas repetíveis devem ser referenciadas por identidade estável quando a
  posição pode mudar.

Fonte:

- [Macros & Token Actions](https://help.roll20.net/hc/en-us/articles/360037256794-Macros-Token-Actions).

## 3. Anatomia funcional observada

```text
atalho ou botão da ficha
-> obter traços do Personagem
-> perguntar escolhas variáveis
-> montar comando de dados
-> executar
-> formatar resultado
-> publicar no chat
```

No Assistente Vampiro, a mesma intenção será separada em responsabilidades:

```text
Ação rápida ou traço da ficha
-> Roll Builder estruturado
-> servidor resolve valores e Fome
-> Rules Engine prepara a parada
-> pessoa autorizada confirma
-> DiceRoller gera faces
-> Rules Engine avalia
-> transação persiste tentativa, evento e outbox
-> projeção autorizada apresenta o resultado
```

## 4. Padrões que serão adotados

| Padrão | Motivo | Adaptação própria |
|---|---|---|
| atalho ligado ao Personagem | reduz repetição | `QuickActionDefinition` |
| valores atuais da ficha | evita preset obsoleto | resolução no servidor |
| pergunta no momento de usar | contexto muda | campos do Roll Builder |
| barra reordenável | memória espacial | Ações rápidas ordenáveis |
| resultado estruturado | leitura imediata | cartão semântico de resultado |
| linhas com ID estável | reorder não quebra referência | UUIDv7 |
| botão junto ao traço | descoberta natural | rótulo inteiro como ação |
| detalhe de poder sob demanda | reduz densidade | revelação progressiva |

## 5. Padrões que serão rejeitados

- linguagem de macro exposta ao jogador;
- JavaScript, expressão de dados ou HTML fornecido pelo usuário;
- dependência do nome visível do Personagem ou do traço como identidade;
- valor da Fome ou do traço congelado no atalho;
- dois avaliadores com resultados diferentes;
- restrição artificial de modificador a uma lista curta;
- linhas referenciadas por posição;
- execução silenciosa sem resumo quando a situação pode ter mudado;
- resultado apresentado antes de persistir o fato;
- regra inferida a partir de comportamento ou bug do Roll20.

## 6. Ataques preparados

Na ficha comunitária, armas registram nome, tipo, dano e notas, enquanto as
jogadas personalizadas ficam em outra seção. O Assistente Vampiro pode melhorar
essa separação com uma Ação rápida que referencia o equipamento, sem transformar
o equipamento em código executável.

Uma ação `Pistola` deverá guardar:

- identidade do equipamento;
- seletores de Atributo e Habilidade;
- Especialização opcional;
- modificadores publicados aplicáveis;
- metadados de dano e observações permitidas;
- política de Dificuldade;
- versão e estado da ação.

No uso, valores, Fome, regra da arma e disponibilidade são resolvidos novamente.

## 7. Limitações observadas que viram requisitos

| Limitação externa | Requisito do produto |
|---|---|
| macros podem quebrar por escape e composição | nenhum parser de macro |
| referência por nome é frágil | IDs canônicos e aliases localizados |
| API e inline podem divergir | um Rules Engine determinístico |
| edição de seção repetível pode sobrescrever dados | versão otimista e identidade estável |
| compêndio pode substituir conteúdo local | importação mostra diff e exige confirmação |
| dificuldade e modificadores podem ser rígidos | valores estruturados com limites da regra |
| resultado no chat mistura público | projeção por audiência autorizada |

## 8. Relação com múltiplas edições

Uma Ação rápida não referencia `V5` por condicional. Ela referencia componentes
e capacidades pertencentes à revisão do perfil da Crônica. Ao migrar de edição,
uma operação assistida identifica:

- componentes equivalentes;
- componentes sem equivalente;
- ações que precisam ser recriadas;
- mudança de fórmula ou de participação da Fome;
- nova revisão que passará a validar a ação.

Não existe compatibilidade automática entre mecânicas diferentes.

## 9. Limite jurídico

Esta pesquisa não autoriza copiar:

- código GPL sem cumprir integralmente sua licença;
- código fechado da ficha “by Roll20”;
- imagens, dados, ícones, logos ou layout do marketplace;
- texto editorial de livros ou compêndios;
- trade dress de Vampire: The Masquerade.

O projeto implementará conceitos funcionais gerais por código e identidade
próprios. Uso público ou comercial da propriedade intelectual permanece sujeito
à estratégia de licenciamento definida pelo produto.

## 10. Resultado para o Assistente Vampiro

O termo principal será **Ação rápida**, não “macro”. A experiência manterá o que
há de melhor no conceito - preparar jogadas frequentes e usar valores atuais -
sem oferecer uma linguagem de programação ao jogador.

O contrato técnico correspondente está em
`../04-arquitetura/contratos/roll-builder-v0.1.md`.
