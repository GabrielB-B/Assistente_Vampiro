# Criação de personagem V5 — Habilidades e Especializações v0.1

## Estado e escopo

- Estado: formalizada para implementação do recorte `Habilidades + Especializações`.
- Perfil: `v5-core-companion-pg-2023-r1`.
- Superfície canônica: a mesma Ficha do personagem; a criação guiada não mantém dados paralelos.
- Contextos de validação: `CREATION_STEP` aceita progresso parcial alcançável; `CREATION_FINALIZATION` exige distribuição e Especializações completas; `ONGOING_EDIT` não reaplica o orçamento de criação.
- Fora deste recorte: Disciplinas, Tipo de Predador, Vantagens, Mesa, Quick Sheet e cena.

## Fontes normativas

| Fonte | Páginas impressas | Uso |
| --- | ---: | --- |
| `SRC-0001` — Livro Básico V5 PT-BR | 145–147 | método detalhado, distribuições rápidas e Especializações da criação |
| `SRC-0001` — Livro Básico V5 PT-BR | 159 | natureza, aplicação, quantidade e concessões de Especializações |
| `SRC-0001` — Livro Básico V5 PT-BR | 159–171 | catálogo e agrupamento das 27 Habilidades |
| `SRC-0004` — Guia do Jogador V5 PT-BR | 64 | republicação de referência; não substitui o Livro Básico neste recorte |

A autoridade desta versão é `SRC-0001`, cujo arquivo privado foi conferido pelo SHA-256 registrado no inventário de fontes. Nenhum texto protegido é reproduzido aqui; descrições de interface são paráfrases autorais curtas.

## Catálogo canônico

Os identificadores são estáveis e independentes do rótulo editorial.

### Físicas

`skill:athletics`, `skill:brawl`, `skill:craft`, `skill:drive`, `skill:firearms`, `skill:larceny`, `skill:melee`, `skill:stealth`, `skill:survival`.

Rótulos PT-BR: Atletismo, Briga, Ofícios, Condução, Armas de Fogo, Ladroagem, Armas Brancas, Furtividade e Sobrevivência.

### Sociais

`skill:animal-ken`, `skill:etiquette`, `skill:insight`, `skill:intimidation`, `skill:leadership`, `skill:performance`, `skill:persuasion`, `skill:streetwise`, `skill:subterfuge`.

Rótulos PT-BR: Empatia com Animais, Etiqueta, Sagacidade, Intimidação, Liderança, Performance, Persuasão, Manha e Subterfúgio.

### Mentais

`skill:academics`, `skill:awareness`, `skill:finance`, `skill:investigation`, `skill:medicine`, `skill:occult`, `skill:politics`, `skill:science`, `skill:technology`.

Rótulos PT-BR: Erudição, Percepção, Finanças, Investigação, Medicina, Ocultismo, Política, Ciência e Tecnologia.

## Métodos de Habilidades

### Distribuições rápidas

| `methodId` | Rótulo editorial | Distribuição final | Máximo |
| --- | --- | --- | ---: |
| `QUICK_JACK_OF_ALL_TRADES` | Pau pra toda obra | 1 Habilidade em 3; 8 em 2; 10 em 1 | 3 |
| `QUICK_BALANCED` | Equilibrado | 3 Habilidades em 3; 5 em 2; 7 em 1 | 3 |
| `QUICK_SPECIALIST` | Especialista | 1 Habilidade em 4; 3 em 3; 3 em 2; 3 em 1 | 4 |

Habilidades não incluídas na distribuição permanecem em zero.

### Método detalhado

O método detalhado organiza as escolhas pela história de vida, sem criar um segundo modelo de dados:

1. profissionais: duas Habilidades em 3 e duas em 2;
2. eventos-chave: uma Habilidade em 3 e uma em 2;
3. recreativas: três Habilidades em 1;
4. acabamento Especialista: mais uma Habilidade em 4; ou
5. acabamento Generalista: mais duas Habilidades em 2 e quatro em 1.

Os acabamentos produzem, respectivamente, as mesmas distribuições finais de `QUICK_SPECIALIST` e `QUICK_BALANCED`. A aplicação pode orientar as escolhas por fase, mas persiste somente o método, o acabamento e os valores canônicos da Ficha. Não existe DTO de personagem paralelo.

## Avaliação parcial e completa

- Cada valor é inteiro de 0 a 4 durante a criação.
- Uma distribuição parcial é válida quando ainda pode alcançar o histograma final do método sem reduzir escolhas já feitas.
- Exceder a quantidade permitida em qualquer faixa torna o estado inalcançável.
- A etapa está completa somente quando o histograma final coincide exatamente com o método selecionado e todas as pendências de Especialização foram resolvidas.
- Trocar de método nunca apaga valores ou Especializações. O novo método pode revelar incompatibilidades que devem ser corrigidas explicitamente antes de continuar.

## Especializações

- Uma Especialização concede o bônus previsto pela regra quando se aplica; somente uma Especialização pode ser aplicada à mesma rolagem.
- Os exemplos dos livros não são listas fechadas. O jogador pode registrar um nome específico, sujeito à mesa.
- A Especialização exige ao menos 1 ponto na Habilidade relacionada.
- Para a maioria das Habilidades, a quantidade de Especializações não pode superar o valor da Habilidade.
- `skill:craft` (Ofícios) é a exceção estrutural descrita no corpus e não usa esse teto simples.
- Ao adquirir o primeiro ponto em Erudição, Ciência, Ofícios ou Performance, surge uma pendência de Especialização automática para essa Habilidade.
- A criação concede ainda uma Especialização livre, vinculada a qualquer Habilidade com ao menos 1 ponto.
- A Especialização profissional do método detalhado ocupa essa concessão livre; ela não cria uma concessão extra.
- A Especialização concedida posteriormente pelo Tipo de Predador não pertence a esta etapa e não é antecipada.
- Reduzir uma Habilidade de modo a invalidar uma Especialização existente não a apaga: a mutação é recusada e informa quais relações precisam ser resolvidas.

Cada registro persistido contém identidade própria, `skillId`, rótulo, origem (`CREATION_AUTOMATIC` ou `CREATION_FREE`) e posição estável. Criar, editar e remover são operações versionadas sobre o mesmo personagem.

## Estado de conclusão

`Habilidades` está completa quando:

1. um método válido foi escolhido;
2. a distribuição final está completa;
3. todas as Especializações automáticas exigidas pelas Habilidades adquiridas existem;
4. a Especialização livre da criação existe;
5. nenhum registro viola valor mínimo, teto ou vínculo.

## Herança de origem

Clã, Caitiff e Sangue-Ralo fornecem identidade visual e contexto de domínio à tela. Não alteram a distribuição de Habilidades neste perfil porque o corpus não estabelece esse efeito. Caitiff e Sangue-Ralo permanecem textuais; símbolos novos não são inventados.

## Precedência e lacunas

- Livro Básico V5 confirmado > republicação do Guia do Jogador > mockup visual.
- O mockup determina composição e hierarquia, não números de regra.
- A aprovação narrativa de nomes de Especialização continua pertencendo à mesa; nesta fase o sistema valida estrutura, vínculo e limites, não semântica narrativa.
- Regras de Especialização do Tipo de Predador serão formalizadas somente na etapa correspondente.
