# Padrões de Qualidade de Engenharia v0.1

**Status:** aprovado<br>
**Data:** 2 de outubro de 2026<br>
**Escopo:** documentação, arquitetura, código, testes e operação

---

## 1. Objetivo

Este documento define o padrão mínimo de qualidade do projeto.

O objetivo não é produzir código sofisticado nem documentação volumosa. É construir um sistema que outra pessoa consiga compreender, testar, alterar e operar sem depender de conhecimento oculto.

> **Clareza para humanos vem antes de esperteza técnica.**

---

## 2. Princípios

### 2.1 Linguagem humana

- escrever em português brasileiro direto e natural;
- explicar decisões pelo problema que resolvem;
- evitar texto promocional, frases genéricas e jargão sem necessidade;
- não repetir a mesma ideia para aumentar artificialmente um documento;
- usar exemplos concretos quando uma regra puder ser interpretada de mais de uma forma;
- assumir somente o que estiver registrado ou confirmado por uma fonte.

### 2.2 Código para leitura

O código será lido mais vezes do que será escrito.

Preferir:

- nomes ligados ao domínio;
- funções pequenas e coesas;
- fluxo explícito;
- tipos que expressem restrições;
- módulos com responsabilidade clara;
- erros compreensíveis;
- testes que expliquem comportamento.

Evitar:

- abreviações obscuras;
- abstração criada para uma única possibilidade hipotética;
- funções genéricas que escondem regras diferentes;
- comentários narrando linha por linha;
- metaprogramação sem benefício demonstrável;
- dependência implícita de estado global;
- “código temporário” sem rastreamento e prazo de remoção.

### 2.3 Simplicidade com limites

Simplicidade não significa misturar responsabilidades.

O primeiro sistema pode ser um monólito, mas deverá preservar limites entre:

- identidade e acesso;
- personagem;
- Crônica;
- sessão;
- regras do jogo;
- conhecimento e conteúdo;
- mídia.

### 2.4 Decisão proporcional ao custo de reversão

- decisões fáceis de reverter podem começar simples;
- decisões caras precisam de alternativas e consequências registradas;
- framework não define o domínio;
- tecnologia só entra quando resolve uma necessidade identificada.

---

## 3. Regras para documentação

Todo documento estrutural deve declarar:

- título e versão;
- status;
- data;
- propósito;
- escopo incluído;
- escopo excluído;
- decisões;
- pendências;
- próximo passo.

### Status permitidos

- rascunho;
- proposta;
- aprovado;
- consolidado;
- substituído;
- arquivado.

### Regra de manutenção

Uma mudança de comportamento exige revisão dos documentos relacionados. Decisões antigas não devem ser apagadas silenciosamente; quando relevante, devem ser substituídas por um ADR novo.

---

## 4. Regras para modelagem de domínio

- usar a linguagem adotada pelo produto e pela edição do jogo;
- separar identidade conceitual de estado mutável;
- registrar invariantes perto do agregado que as protege;
- não transformar cada substantivo em entidade;
- usar Value Objects quando identidade própria não fizer sentido;
- manter regras puras independentes de banco, HTTP e interface;
- declarar quando uma decisão pertence ao jogador, ao Narrador ou ao sistema;
- registrar edição e proveniência para toda regra mecânica.

### Pergunta de controle

> É possível explicar este comportamento sem mencionar framework, endpoint ou tabela?

Se não, o domínio provavelmente ainda está misturado à infraestrutura.

---

## 5. Regras para código

As regras abaixo independem da stack final.

### Estrutura

- módulos organizados por capacidade de negócio, não apenas por tipo técnico;
- evitar pastas globais de `controllers`, `services` e `repositories` que misturem capacidades diferentes;
- dependências apontam para dentro, em direção ao domínio;
- entrada externa é validada na fronteira;
- persistência e serviços externos são adaptadores;
- nenhuma regra crítica existe somente na UI;
- interfaces e camadas só existem quando protegem uma fronteira real, não para cumprir um diagrama.

### Funções e classes

- uma razão principal para mudar;
- nomes completos e específicos;
- parâmetros limitados e semanticamente relacionados;
- retorno previsível;
- efeitos colaterais visíveis;
- dependências recebidas explicitamente.

Nomes como `BaseService`, `Manager`, `Helper` e `utils` exigem revisão: normalmente escondem responsabilidades diferentes. Uma abstração deve possuir finalidade estreita e nome ligado ao problema que resolve.

### Tipos

- evitar tipos amplos quando o domínio conhece um conjunto menor;
- não usar `any` para contornar desenho incompleto;
- distinguir identificadores de entidades diferentes;
- representar estados impossíveis como impossíveis sempre que o custo for razoável;
- validar dados não confiáveis antes de convertê-los em tipos de domínio.

### Comentários

Comentários explicam:

- por que existe uma decisão não óbvia;
- qual restrição externa precisa ser preservada;
- qual risco ou trade-off motivou o código.

Comentários não substituem nomes claros nem documentação da regra.

---

## 6. Regras para testes

### Pirâmide inicial

- muitos testes unitários para regras puras;
- testes de integração para banco, autorização e adapters;
- poucos testes ponta a ponta para fluxos críticos;
- revisão visual e acessibilidade para experiências-chave.

### Testes de regras

Toda regra executável deve possuir:

- caminho normal;
- limites;
- exceções;
- interação relevante com Fome;
- exemplos derivados da fonte;
- rastreabilidade até a especificação;
- identificador `RULE-*` no nome ou nos metadados do teste.

### Qualidade dos testes

- nome descreve comportamento observável;
- teste não depende da ordem de outro teste;
- dados são mínimos e legíveis;
- falha explica qual comportamento foi quebrado;
- snapshot não substitui asserção de regra;
- aleatoriedade é controlável e reproduzível.

---

## 7. Segurança e privacidade

- negar por padrão;
- autorizar no backend por recurso e contexto;
- nunca enviar segredo para depois escondê-lo;
- não registrar tokens, senhas ou conteúdo secreto em logs;
- validar upload e tipo de arquivo;
- manter corpus protegido fora do Git;
- revisar dependências e segredos na CI;
- registrar ações sensíveis de forma proporcional ao risco.

---

## 8. Dados e persistência

- schema muda por migração versionada;
- migração deve funcionar em banco vazio;
- dados críticos possuem estratégia de recuperação;
- eventos confirmados têm identificador e horário confiáveis;
- submissões repetidas não podem duplicar rolagens;
- edição e versão pertencem aos dados que dependem de regras;
- exclusão e retenção serão definidas antes de dados reais de usuários.

---

## 9. Interface e acessibilidade

- HTML semântico antes de componentes complexos;
- teclado e foco visível;
- contraste verificado;
- estados de carregamento, vazio, erro e permissão;
- redução de movimento;
- texto separado da arte;
- layout funcional sem depender da imagem;
- mensagens de erro explicam como recuperar a ação.

---

## 10. Observabilidade

Quando existir aplicação, todo fluxo crítico deverá permitir responder:

- o que aconteceu?
- para qual usuário e contexto autorizado?
- qual operação falhou?
- foi possível repetir com segurança?
- qual versão da aplicação e da regra estava ativa?

Logs devem ajudar a operar o sistema sem expor conteúdo sensível.

---

## 11. Quality gates

Antes de integrar código:

- formatação;
- lint;
- typecheck;
- testes relevantes;
- verificação de dependências e segredos;
- migrações verificadas, quando houver;
- documentação afetada atualizada.

Antes de declarar uma fase concluída:

- critérios de saída atendidos;
- decisões registradas;
- riscos residuais conhecidos;
- artefatos localizáveis pelo índice;
- próximo responsável consegue continuar sem explicação oral obrigatória.

---

## 12. Dívida técnica

Dívida técnica consciente deve registrar:

- decisão tomada;
- motivo;
- impacto;
- risco;
- condição de pagamento;
- responsável ou fase prevista.

“Resolver depois” sem registro não é uma estratégia.

---

## 13. Regra para assistência por IA

IA pode auxiliar:

- exploração;
- revisão;
- geração de alternativas;
- testes iniciais;
- organização de conteúdo.

Fontes integrais protegidas e extrações extensas não serão enviadas a serviços externos de IA sem avaliação explícita de licença, privacidade, retenção e autorização. Sem essa avaliação, somente metadados públicos, paráfrases sanitizadas e material próprio podem sair do ambiente controlado do projeto.

Todo resultado precisa passar por:

- leitura humana;
- verificação contra fonte;
- adequação ao domínio;
- remoção de linguagem genérica;
- testes proporcionais ao risco.

O código e a documentação pertencem ao projeto. Devem ser compreensíveis sem depender da conversa que os gerou.

---

## 14. Critério final

Uma solução é considerada profissional quando:

- resolve o problema atual;
- expressa claramente suas regras;
- protege dados e segredos;
- pode ser testada;
- pode ser alterada sem medo desnecessário;
- possui trade-offs conhecidos;
- não transfere complexidade evitável para a próxima pessoa.
