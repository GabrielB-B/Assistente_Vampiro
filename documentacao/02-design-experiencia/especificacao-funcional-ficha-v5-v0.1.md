# Especificação Funcional da Ficha V5 v0.1

**Status:** base funcional da Ficha Completa implementada e aprovada<br>
**Data:** 30 de outubro de 2026<br>
**Escopo:** anatomia da ficha, comportamento dos campos, rolagens e ações rápidas<br>
**Implementação:** Ficha Completa integrada à projeção autorizada de personagem

> **Limite da aprovação:** Gabriel aprovou somente a Ficha Completa. As seções
> históricas que descrevem Mesa, Ficha Rápida, painel `Jogar agora` ou contexto
> de sessão registram requisitos futuros e não autorizam sua implementação nem
> sua direção de arte.

## 1. Objetivo

Definir a ficha digital antes de escrever componentes. A experiência deve ser
imediatamente reconhecível por quem usa a ficha padrão da V5, mas aproveitar o
meio digital para reduzir procura, preparar jogadas e impedir erros.

O produto preserva o **mapa mental** da ficha oficial; não copia seu logo, borda,
tipografia, trade dress ou composição gráfica literal.

## 2. Fontes da decisão

- ficha preenchível oficial da V5 disponibilizada pela Renegade Game Studios;
- ficha oficial branca em PT-BR fornecida por Gabriel e conferida visualmente nas
  duas páginas;
- Livro Básico Galápagos, páginas impressas 117–123 e 205–208, para o fluxo de
  testes, Dificuldade, modificadores e Dados de Fome;
- Product & Experience Foundation v0.2, seções 12 a 17;
- Modelo de Domínio v0.1;
- `RULE-ROLL-001` e contrato do Rules Engine;
- Art System & Screen Archetypes v0.2;
- referências de Amy Wilkins e Michael Gaydos aprovadas por Gabriel como direção
  conceitual, nunca como estilo a ser imitado.

Referências públicas:

- [Ficha preenchível oficial da V5](https://renegadegamestudios.com/vampire-the-masquerade-5th-edition-roleplaying-game-pdf-fillable-character-sheet/);
- [Vampire: The Masquerade 5th Edition by Roll20](https://app.roll20.net/forum/post/10167852/vampire-the-masquerade-5th-edition-by-roll20/);
- [Macros & Token Actions — Roll20](https://help.roll20.net/hc/en-us/articles/360037256794-Macros-Token-Actions);
- [Ficha comunitária V5 — código e documentação](https://github.com/Roll20/roll20-character-sheets/tree/master/vampire-v5);
- [Dark Pack Agreement](https://www.paradoxinteractive.com/games/world-of-darkness/community/dark-pack-agreement).

### 2.1 Hierarquia das fontes

1. Livro Básico e ficha Galápagos definem termos, campos e mecânica central.
2. Companion e Players Guide seguem a linha normativa já aprovada por unidade de
   regra.
3. A ficha oficial do Roll20 é benchmark de integração e operação digital.
4. A ficha comunitária do Roll20 é apenas evidência técnica de interação.
5. Nenhuma macro, texto editorial, imagem ou composição visual externa entra no
   produto por cópia.

## 3. Princípios obrigatórios

1. **Familiaridade sem réplica.** Seções e relações familiares permanecem; a
   expressão visual é própria.
2. **Jogar antes de editar.** A ficha abre em Modo Jogar. Alterações permanentes
   exigem entrada explícita no Modo Editar.
3. **Um clique inicia uma intenção.** Clicar em Habilidade ou Atributo inicia a
   montagem da rolagem; nunca altera pontos por acidente.
4. **Estado atual vem do servidor.** Fome, valores e permissões não são aceitos
   cegamente do navegador.
5. **Presets não são macros.** Ações rápidas guardam escolhas declarativas e
   validadas; não executam código ou expressões livres.
6. **Multiedição por perfil.** A tela renderiza capacidades do perfil fixado pela
   Crônica, sem condicionais de edição espalhadas nos componentes.
7. **Sem dados inventados.** Campo ausente na projeção não recebe placeholder que
   pareça valor real.

## 4. Estrutura-alvo da ficha completa

### 4.1 Identidade

| Campo | Tipo | Modo Jogar | Modo Editar | Regra |
|---|---|---|---|---|
| Nome | texto principal | leitura | edição | obrigatório para Personagem `ready` |
| Conceito | texto curto | leitura | edição | linguagem livre com limite definido no contrato |
| Tipo de Predador | seleção versionada | leitura contextual | seleção | opções vêm do perfil |
| Crônica | vínculo | link autorizado | fora da ficha | nunca alterado como texto livre |
| Ambição | texto narrativo | leitura | edição | mudança deliberada |
| Clã | conceito versionado | leitura contextual | seleção assistida | depende de `characterKind` |
| Senhor | referência/texto | leitura | edição | não concede acesso a outro Personagem |
| Desejo | texto narrativo | leitura | edição rápida controlada | pode mudar com maior frequência |
| Geração | valor derivado/validado | leitura | edição assistida | nunca inteiro arbitrário |

### 4.2 Atributos

A ordem familiar da V5 permanece como orientação inicial:

| Físicos | Sociais | Mentais |
|---|---|---|
| Força | Carisma | Inteligência |
| Destreza | Manipulação | Raciocínio |
| Vigor | Autocontrole | Determinação |

Cada linha possui rótulo, valor de 1 a 5, affordance de rolagem e explicação
contextual acessível. O ponto visual não é o único portador do valor: leitores de
tela recebem rótulo e número.

### 4.3 Trilhas e estados

| Controle | Representação | Interação no Modo Jogar |
|---|---|---|
| Vitalidade | capacidade + dano superficial/agravado | abrir controle de dano; nunca editar o máximo |
| Força de Vontade | capacidade + dano superficial/agravado | abrir controle de dano e futura rerrolagem |
| Fome | valor atual de 0 a 5 | ação explícita de aumentar/reduzir, auditável quando persistida |
| Humanidade | valor e manchas quando o perfil exigir | leitura no alpha; edição por caso de uso próprio |
| Potência do Sangue | valor + resumo derivado | leitura e explicação contextual |
| Ressonância | conceito/estado | leitura e edição contextual futura |

Trilhas não usam apenas cor. Cada estado combina forma, preenchimento, rótulo e
texto alternativo.

### 4.4 Habilidades

A ficha completa preserva as 27 Habilidades agrupadas visualmente em três colunas,
seguindo a ordem familiar da ficha V5:

| Coluna 1 | Coluna 2 | Coluna 3 |
|---|---|---|
| Armas Brancas | Empatia com Animais | Ciência |
| Armas de Fogo | Etiqueta | Erudição |
| Atletismo | Intimidação | Finanças |
| Briga | Liderança | Investigação |
| Condução | Manha | Medicina |
| Furtividade | Performance | Ocultismo |
| Ladroagem | Persuasão | Percepção |
| Ofícios | Sagacidade | Política |
| Sobrevivência | Subterfúgio | Tecnologia |

Estes são os rótulos e a ordem da ficha oficial Galápagos examinada. IDs
canônicos permanecem independentes da localização e preservam aliases históricos
somente na camada de conteúdo versionado.

### 4.5 Disciplinas e poderes

Cada Disciplina mostra:

- nome localizado e nível;
- poderes conhecidos por nível;
- custo/checagem apenas por metadado permitido;
- ação de consulta;
- ação de rolagem quando houver configuração executável;
- proveniência e revisão acessíveis sem ocupar a leitura principal.

Não haverá linhas livres que permitam transformar texto digitado em regra.

### 4.6 Segunda página canônica

A segunda página da ficha oficial possui uma função narrativa e mecânica própria.
Sua ordem semântica será preservada em uma seção digital dedicada:

1. Princípios da Crônica;
2. Pilares e Convicções;
3. Perdição do Clã;
4. Vantagens e Defeitos;
5. Notas;
6. Potência de Sangue e seus valores derivados;
7. Experiência Total e Experiência Gasta;
8. Idade Verdadeira, Idade Aparente, Data de Nascimento e Data de Morte;
9. Aparência, Traços Distintivos e História.

Equipamento e Ações rápidas são extensões digitais próprias. Não serão inseridos
visualmente dentro da segunda página como se pertencessem ao documento oficial.
Esses blocos completos serão implementados em cortes posteriores e não serão
simulados no VS01-03.

## 5. Recorte real do VS01-03

O VS01-03 não implementa a ficha completa. Ele prova somente:

- Nome e Conceito;
- Crônica e Sessão autorizadas;
- Fome;
- Atributos presentes no seed;
- Habilidades presentes no seed;
- entrada do Roll Builder;
- estados carregando, vazio, indisponível, negado e erro;
- projeções distintas para Jogador e Narrador conforme a matriz vigente.

Vitalidade, Força de Vontade, Humanidade, Disciplinas e demais campos só entram
quando domínio, banco, API e testes correspondentes existirem.

## 6. Arquitetura da experiência

### 6.1 Ficha completa no desktop

```text
┌ contexto: personagem · Crônica · Modo Jogar/Editar ┐
├───────────────────────────────┬─────────────────────┤
│ ficha canônica digital        │ Jogar agora         │
│ identidade                    │ ações rápidas        │
│ atributos + trilhas           │ jogadas recentes     │
│ habilidades                   │ Roll Builder         │
│ disciplinas e demais seções   │ contexto da sessão   │
└───────────────────────────────┴─────────────────────┘
```

A coluna “Jogar agora” é uma camada digital própria. Ela não altera a ordem da
ficha nem finge fazer parte da folha oficial.

### 6.2 Quick Sheet sobre a Mesa

- drawer lateral amplo;
- resumo de Fome, Vitalidade e Força de Vontade;
- ações rápidas;
- Atributos e Habilidades pesquisáveis;
- expansão para ficha completa;
- retorno preserva a cena e o foco anterior.

### 6.3 Mobile

```text
Personagem + Fome
Ações rápidas
Resumo de trilhas
Atributos
Habilidades
Disciplinas
Demais seções
```

A versão mobile não reduz a folha desktop. Ela preserva a ordem semântica e usa
seções recolhíveis, busca e ações fixadas apenas quando necessárias.

## 7. Contrato de interação dos traços

### 7.1 Modo Jogar

- clicar no nome da Habilidade inicia `Escolher Atributo` para compor a proposta
  de parada;
- clicar no nome do Atributo inicia `Adicionar segundo componente`;
- clicar nos pontos não muda o valor;
- `Enter` ou `Espaço` executa a mesma ação do clique;
- menu contextual oferece `Consultar`, `Rolar` e `Adicionar às ações rápidas`;
- especialidades aparecem depois da escolha da Habilidade;
- Fome é carregada automaticamente da projeção autorizada.

O clique não muda a autoridade da regra: em uma sessão narrada, o Narrador
continua escolhendo ou confirmando as Características e a Dificuldade. Fora de
uma sessão narrada, o jogador pode confirmar a própria combinação para uma
rolagem manual.

### 7.2 Fluxo Habilidade → Atributo → rolagem

```text
Habilidade escolhida
→ sugestões contextuais de Atributo
→ escolha explícita do jogador
→ especialidade aplicável
→ bônus/penalidade estruturado
→ Dificuldade conforme contexto
→ resumo da parada
→ confirmar
→ resultado persistido
```

Sugestões aceleram, mas não transformam uma combinação comum em regra universal.
O perfil de regras decide quais componentes são válidos.

### 7.3 Modo Editar

- um controle separado ativa a edição;
- campos editáveis recebem borda/estado inequívocos;
- mudanças estruturais mostram validação antes de publicar;
- sair com alterações pendentes exige salvar ou descartar;
- conflitos usam versão otimista, nunca “última gravação vence”.

## 8. Ações rápidas

Nome apresentado ao usuário: **Ações rápidas**. “Macro” não será a linguagem
principal.

### 8.1 Categorias

- Ataque;
- jogada geral;
- poder;
- ação de sistema;
- preset sugerido pelo Narrador.

### 8.2 Dados declarativos planejados

| Campo | Finalidade |
|---|---|
| `presetId` | UUIDv7 |
| `characterId` | proprietário funcional |
| `name` | nome curto dado pelo jogador |
| `kind` | `ATTACK`, `GENERAL`, `POWER`, `SYSTEM` |
| `components` | IDs canônicos de Atributo, Habilidade, Disciplina ou componente publicado |
| `specialtyId` | especialidade opcional |
| `defaultModifier` | bônus/penalidade estruturado e limitado |
| `difficultyPolicy` | perguntar, ausente, fixa quando a regra permitir |
| `hungerPolicy` | aplicar conforme a regra ou excluir por motivo publicado |
| `bloodPotencyPolicy` | ausente ou calculada por uma regra publicada futura |
| `sourceReference` | arma, poder ou regra que originou o preset |
| `sortOrder` | ordenação do jogador |
| `version` | concorrência otimista |

O preset não guarda o valor atual dos traços nem a Fome. Esses valores são
resolvidos novamente no momento da rolagem.

### 8.3 Ataques preparados

Exemplos: `Pistola`, `Ataque desarmado`, `Faca`. Um ataque poderá guardar a
referência do equipamento e sua configuração publicada, mas dano, alcance e regra
não serão texto executável criado pelo usuário.

### 8.4 Operações

- criar a partir de uma rolagem válida;
- renomear;
- duplicar;
- reordenar;
- desativar;
- excluir de forma recuperável quando houver histórico;
- executar abrindo o resumo para confirmação.

### 8.5 Segurança e permissões

- jogador administra presets do próprio Personagem;
- Narrador pode sugerir um preset, não sobrescrever silenciosamente;
- servidor revalida propriedade, Vínculo, componentes e perfil;
- nenhum campo aceita JavaScript, expressão arbitrária ou consulta dinâmica;
- executar preset cria uma nova tentativa; nunca altera uma tentativa anterior.

### 8.6 Lições do Roll20

O Roll20 usa macros e Token Actions como atalhos para comandos repetidos. Seus
conceitos úteis são preservados sem importar sua linguagem de macro:

| Roll20 | Assistente Vampiro |
|---|---|
| macro global da mesa | não entra no primeiro corte |
| Token Action ligada ao personagem | Ação rápida ligada ao Personagem |
| referência `@{atributo}` | `componentId` resolvido pelo servidor |
| Roll Query em tempo de execução | campo estruturado do Roll Builder |
| Macro Quick Bar reordenável | lista de Ações rápidas reordenável |
| Roll Template no chat | cartão de resultado versionado da sessão |
| repeating row por índice/ID | referência estável por UUIDv7, nunca posição |

O produto rejeita os problemas observados no modelo de macros:

- nenhuma expressão textual é executada;
- nenhuma sintaxe de escape ou HTML define regra;
- renomear, excluir ou reordenar uma linha não muda sua identidade;
- valores atuais, Fome e revisão do perfil são relidos no servidor;
- uma Ação rápida inválida falha com explicação e não tenta improvisar a regra;
- o usuário vê linguagem de jogo, não código de macro.

## 9. Estados obrigatórios por campo

Todo componente da ficha precisa especificar:

- leitura;
- hover quando aplicável;
- foco visível;
- selecionado para rolagem;
- edição;
- inválido;
- salvando;
- salvo;
- conflito de versão;
- desabilitado por regra;
- indisponível por permissão;
- sem dado;
- erro recuperável.

“Indisponível por permissão” não revela se um recurso secreto existe.

## 10. Acessibilidade

- alvo mínimo de toque de 44 × 44 CSS px;
- pontos possuem nome e valor acessíveis;
- navegação completa por teclado;
- foco nunca depende apenas de vermelho;
- ordem do DOM acompanha a ordem de leitura;
- zoom de 200% sem perda de operação;
- nenhuma trilha depende apenas de cor;
- motion respeita `prefers-reduced-motion`;
- mensagens de salvamento e erro usam regiões vivas sem interromper a leitura.

## 11. Multiedição

A ficha é composta por um `SheetDefinition` resolvido pelo perfil publicado:

- seções e ordem;
- capacidades aplicáveis;
- traços e limites;
- trilhas;
- ações especiais;
- localização;
- revisão da definição.

A V5 fornece a primeira definição. Edições futuras podem trocar seção ou
comportamento sem criar `if (edition)` em cada componente. A Crônica continua
presa à revisão de perfil que validou sua ficha.

## 12. Limite jurídico e comercial

O Dark Pack permite fichas, geradores e roladores em projetos de fãs sob suas
condições, incluindo gratuidade para aplicativos abrangidos. Um produto comercial
que use propriedade intelectual, marcas ou trade dress de World of Darkness exige
uma estratégia de licença própria.

Até essa decisão:

- protótipo permanece interno;
- não importar o PDF ou imagens oficiais para o produto;
- não reproduzir logo, ícones, bordas ou layout literal;
- manter links e proveniência;
- usar conteúdo próprio/fictício nos testes.

## 13. Decisões futuras de produto

1. revisar o protótipo concreto e solicitar ajustes, sem novo gate abstrato antes
   de cada iteração;
2. definir o objetivo comercial antes de qualquer publicação usando a IP;
3. aprovar o contrato HTTP e as projeções de permissão antes de conectar a ficha
   a dados reais;
4. decidir quando Dificuldade secreta e rerrolagem com Força de Vontade entram no
   roadmap.

## 14. Estado do gate

- [x] ficha oficial e manuais revisados;
- [x] direção artística recebida e aplicada sem imitação;
- [x] wireframe desktop traduzido para protótipo responsivo;
- [x] wireframe mobile traduzido para protótipo responsivo;
- [x] campos do VS01-03 separados dos campos futuros na documentação;
- [ ] estados de erro, vazio, permissão e conflito ligados a casos reais;
- [ ] contrato HTTP e projeções autorizadas aprovados;
- [ ] decisão de licenciamento registrada para o destino pretendido.

Documentos do gate:

- [estudo visual](./estudo-visual-ficha-v5-v0.1.md);
- [wireframes de baixa fidelidade](./wireframes-ficha-v5-v0.1.md);
- [pesquisa de interação no Roll20](./pesquisa-roll20-ficha-macros-v0.1.md);
- [contrato do Roll Builder](../04-arquitetura/contratos/roll-builder-v0.1.md).
