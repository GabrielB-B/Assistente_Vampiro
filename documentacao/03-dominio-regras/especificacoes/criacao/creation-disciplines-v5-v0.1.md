# Criação — Disciplinas V5 v0.1

**Status:** regra de criação executável; fundação normativa integral auditada

**Revisão:** `RULE-CREATION-DISCIPLINES-001-r1`

**Catálogo:** `CATALOG-V5-CORE-COMPANION-PG-2023-r1`

## 1. Escopo e fontes

Esta especificação resolve somente a etapa Disciplinas da criação guiada. A autoridade é aplicada por unidade: errata ingerida; `SRC-0004` quando republica ou revisa; `SRC-0003` para adições não republicadas; `SRC-0001` para a regra central. As sínteses do produto são paráfrases próprias. PDFs e extrações integrais continuam fora do Git.

Referências centrais:

- `SRC-0001`, p. 136 e 149–150: criação e escolha inicial;
- `SRC-0001`, p. 244–287: Disciplinas, Poderes e regras gerais;
- `SRC-0004`, p. 65: resumo consolidado da criação;
- `SRC-0004`, p. 69–106: Poderes adicionais/revisados, Oblívio e Alquimia Sangue-Ralo.

## 2. Regra inicial confirmada

Para `CLAN_VAMPIRE`, o jogador escolhe duas das três Disciplinas do Clã: uma recebe rating 2 e outra rating 1; a terceira permanece em 0. Para `CAITIFF`, escolhe duas Disciplinas padrão quaisquer e aplica a mesma distribuição 2/1. Esta é uma política de `CREATION_STEP`, não o limite estrutural do traço.

Toda Disciplina usa escala estrutural 0–5. A criação normal não pode gravar uma quarta Disciplina de Clã, rating acima de 2, mais de duas Disciplinas ativas ou uma distribuição diferente de 2/1 ao concluir.

## 3. Relação rating ↔ Poder

As fontes confirmam um Poder conhecido por ponto de Disciplina. Ao adquirir um novo ponto, escolhe-se um Poder do novo nível ou de nível inferior. Nunca se escolhe Poder acima do rating. Um personagem com rating 2 pode conhecer um Poder de nível 1 e um de nível 2, ou dois de nível 1.

Pré-requisitos e Amálgamas são cumulativos. O catálogo informa requisitos; a política calcula elegibilidade com os ratings e Poderes atuais. O mesmo Poder não pode ser adquirido duas vezes. Rating e Poderes são escolhas persistidas separadamente.

Ao reduzir rating, Poderes excedentes ou acima do novo rating não são apagados automaticamente. Antes de qualquer escrita, a interface solicita ao backend uma projeção não persistente. O Rules Engine devolve `powerAdjustments`, com quantidade mínima de remoções e IDs incompatíveis; somente depois de o jogador remover explicitamente os Poderes necessários a API aceita a mutação com confirmação.

### 3.1 Transparência dos níveis seguintes

Quando uma Disciplina já recebeu rating 2, mas o primeiro Poder ainda não foi
escolhido, a escolha válida continua restrita ao nível 1. O bloco **Poderes
disponíveis** mostra exclusivamente os IDs elegíveis devolvidos pelo Rules Engine;
portanto, Poderes de nível 2 só entram nesse bloco depois que a primeira escolha
válida tiver sido persistida. A consulta ampla da Disciplina permanece disponível
para planejamento, sem misturar itens bloqueados com a escolha pendente.

A área central separa definitivamente **Poderes escolhidos** de **Poderes
disponíveis**. Ambos são agrupados pelo nível mecânico real do Poder, nunca pela
ordem de aquisição. Um Poder persistido é removido da elegibilidade, e o bloco de
disponíveis desaparece quando `pendingPowerChoices` fica vazio.

Quando mais de um nível possui Poderes elegíveis, a interface apresenta um nível
por vez. O nível elegível mais alto abre por padrão, pois representa a capacidade
recém-liberada, e um seletor com a contagem de Poderes permite consultar os níveis
anteriores sem empilhar catálogos. A navegação é apenas uma revelação progressiva:
não altera `eligiblePowerIds`, não remove alternativas e deve escalar do nível 1 ao
5 mantendo somente a lista ativa visível.

Resumo de lista, descrição editorial e sistema mecânico são campos distintos. A
descrição pode aprofundar ficção e manifestação do Poder, mas permanece uma
paráfrase própria; números, testes, custos, duração e condições ficam na seção
estruturada de mecânica.

## 4. Contextos

| Contexto | Política |
|---|---|
| `CREATION_STEP` | permite construção incremental; conclusão exige distribuição e Poderes completos |
| `CREATION_FINALIZATION` | exige 2/1 e exatamente um Poder por ponto, com requisitos satisfeitos |
| `ONGOING_EDIT` | não aplica o teto inicial; exige autorização e preserva revisões adquiridas |
| `FUTURE_XP_PROGRESSION` | reutilizará catálogo e elegibilidade; custo/compra não são implementados aqui |

### 4.1 Subescolhas normativas

- Feitiçaria de Sangue com rating 1 ou 2 na criação concede um Ritual de nível 1, separado dos Poderes. A política está em `BLOOD_SORCERY_RITUAL_ACQUISITION_POLICY` (`SRC-0001`, p. 272).
- Oblívio concede uma Cerimônia de nível 1 somente quando a personagem possui o Poder pré-requisito correspondente. A política está em `OBLIVION_CEREMONY_ACQUISITION_POLICY` (`SRC-0004`, p. 91–92).
- Cada ponto de Alquimia Sangue-Ralo concede uma Fórmula, vinculada a um método de destilação. Fórmulas não integram `DisciplinePowerCatalog`.
- `projectCreationDisciplineSubchoices` projeta, sem persistir, a próxima escolha de Ritual, Cerimônia, método ou Fórmula a partir dos ratings e itens já conhecidos. Rating 1 e rating 2 de Feitiçaria de Sangue projetam a mesma e única escolha inicial de Ritual de nível 1.
- Essas subescolhas estão formalizadas no domínio, mas não receberam UI nesta tarefa; qualquer composição nova continua sujeita ao gate visual.

## 5. Origens

### Vampiro de Clã

As três opções vêm da revisão de Clã projetada pelo backend. O React não associa Clã e Disciplina.

### Caitiff

Pode escolher duas entre as Disciplinas padrão do perfil e usa 2/1. Alquimia Sangue-Ralo não integra o catálogo padrão Caitiff. O multiplicador futuro de XP Caitiff permanece no domínio da origem, mas compra por XP está fora desta etapa.

### Sangue-Ralo

Não possui Disciplinas intrínsecas nem recebe 2/1. Ressonância pode produzir acesso temporário, que não deve ser persistido como rating permanente desta etapa. Alquimia Sangue-Ralo só pode começar em 1 mediante a Qualidade Alquimista Sangue-Ralo; como Vantagens ainda não foi implementada, a projeção atual é informativa e não cria a Qualidade nem concede Alquimia artificialmente. A futura integração deverá transformar a escolha da Qualidade em autorização contextual explícita.

## 6. Camadas e persistência

```text
DisciplineCatalog / PowerCatalog
        ↓
Rule revision + Creation policy
        ↓
Eligibility evaluator
        ↓
API projection
        ↓
Guided creation / ficha / consulta futura
```

- catálogo versionado em `packages/rules-engine`, sem dependência de React ou banco;
- `PowerPresentation` contém resumo, descrição e efeito em paráfrase editorial
  versionada; sua proveniência distingue paráfrase do projeto, conteúdo fornecido
  pelo proprietário e conteúdo licenciado;
- `PowerRule` contém custo, teste, dificuldade, ativação, alcance, alvo, duração,
  requisitos, condições e passos ordenados de Sistema, sempre associados às
  fontes e à revisão normativa;
- os campos planos anteriores continuam como aliases de compatibilidade durante
  a migração dos consumidores; a interface de consulta já consome os dois blocos;
- estado da personagem em `character_discipline` e `character_discipline_power`;
- cada Poder adquirido preserva `power_rule_revision_id`;
- conteúdo editorial é paráfrase versionada; texto integral protegido não entra no banco nem no Git;
- alteração de Clã inclui Disciplinas entre as etapas impactadas e exige revisão, sem zerar silenciosamente.
- a prévia `previewOnly` avalia uma proposta no backend e nunca chama o writer;
  React apenas apresenta `pendingPowerChoices` e `powerAdjustments` autoritativos.

## 7. Matriz de auditoria do perfil

Contagens abaixo abrangem a projeção compatível de 161 itens da tela atual. O catálogo canônico contém 144 Poderes; as 17 entradas de Alquimia são Fórmulas com tipo próprio. Rituais e Cerimônias também possuem catálogos e políticas independentes.

| Disciplina | Fonte principal | Páginas | PG comparado | Companion comparado | Poderes | Termo PT-BR | Estado |
|---|---|---:|---|---|---:|---|---|
| Animalismo | SRC-0001/SRC-0004 | 244–249 / 69–71 | sim | comparado | 14 | conferido | VERIFIED |
| Auspícios | SRC-0001/SRC-0003/SRC-0004 | 249–252 / 24–28 / 71–72 | sim | sim | 13 | conferido | CONFLICT_REVIEWED |
| Celeridade | SRC-0001/SRC-0004 | 252–255 / 72–73 | sim | sim, sem adição vigente | 13 | conferido | VERIFIED |
| Dominação | SRC-0001/SRC-0003/SRC-0004 | 255–258 / 24–28 / 73–74 | sim | comparado | 13 | conferido | CONFLICT_REVIEWED |
| Fortitude | SRC-0001/SRC-0003/SRC-0004 | 258–261 / 24–28 / 74–76 | sim | comparado | 13 | conferido | CONFLICT_REVIEWED |
| Ofuscação | SRC-0001/SRC-0003/SRC-0004 | 261–264 / 24–28 / 76–79 | sim | comparado | 13 | conferido | CONFLICT_REVIEWED |
| Potência | SRC-0001/SRC-0004 | 264–267 / 79–80 | sim | comparado | 13 | conferido | VERIFIED |
| Presença | SRC-0001/SRC-0004 | 267–270 / 80–81 | sim | sim, sem adição vigente | 13 | conferido | VERIFIED |
| Proteanismo | SRC-0001/SRC-0003/SRC-0004 | 270–273 / 24–28 / 81–84 | sim | comparado | 12 | conferido | CONFLICT_REVIEWED |
| Oblívio | SRC-0004 | 84–97 | sim | consolidado no PG | 18 | glossário controlado | VERIFIED |
| Feitiçaria de Sangue | SRC-0001/SRC-0004 | 272–281 / 98–103 | sim | comparado | 9 | conferido | VERIFIED |
| Alquimia Sangue-Ralo | SRC-0001/SRC-0004 | 282–287 / 103–106 | sim | comparado | 17 Fórmulas | glossário controlado | VERIFIED |

## 8. Conflitos e precedência

- Poder republicado no Players Guide usa a mecânica de `SRC-0004`; nomes oficiais já publicados em PT-BR são preservados como rótulo localizado.
- `Panacea` é o nome vigente da unidade anteriormente apresentada como `Obeah`; o alias histórico não vira segundo Poder.
- `Valeren` permanece nível 3 conforme a linha normativa, mas não integra a seleção inicial de rating 1–2.
- Conteúdo novo do Players Guide sem edição oficial PT-BR recebe rótulo candidato controlado; `nameOriginal` e referência são preservados para revisão editorial futura.
- Oblívio consolida material antes disperso; a revisão do Players Guide é a projeção preferida.
- Na interface PT-BR, os Poderes do Livro Básico preservam os rótulos oficiais
  Galápagos (por exemplo, `Fascínio`, `Transe`, `Convocar` e
  `Elegância Direto da Fonte`).
- Para as adições de `SRC-0004`, a cópia PT-BR do *Guia do Jogador* fornecida
  pelo responsável do projeto é a referência terminológica da interface, sem
  substituir `SRC-0004` como autoridade mecânica. Entre os termos auditados
  para Toreador estão `Panaceia`, `Trabalho Russo`, `Olhos da Serpente`,
  `Voz Lançada` e `Melpominê`. Também foram cotejados `Queda`, `Destruidor`,
  `Língua Mercúria` e `Amaranto Florido`.

A matriz completa, o inventário poder a poder, os conflitos, o relatório
terminológico e a decisão de persistência estão em
[Auditoria do Catálogo de Disciplinas V5 — r1](../../auditorias/catalogo-disciplinas-v5-r1.md).

## 9. Critérios verificáveis

1. Clã recebe exatamente as três Disciplinas projetadas pela origem.
2. Caitiff recebe todas as Disciplinas padrão e consegue concluir 2/1.
3. Sangue-Ralo não recebe três opções falsas nem 2/1.
4. Cinco dots são sempre visíveis; somente 0–2 são alcançáveis nesta criação.
5. Cada ponto pendente abre uma escolha elegível e, depois de salva, a lista recolhe.
6. Reload preserva ratings, Poderes e revisão de cada Poder.
7. Nível, duplicidade, pré-requisito e Amálgama inválidos são rejeitados no backend.
8. Redução destrutiva requer confirmação explícita.
9. Consulta ampla mostra Poderes por nível e não modifica a personagem.
10. Nenhuma rota ou UI de Predador é criada por este incremento.
11. A consulta de Poder separa apresentação e sistema, omite campos não
    aplicáveis e preserva custo, teste, dificuldade, duração e requisitos.
12. A consulta de Disciplina apresenta o catálogo integral agrupado por nível.
13. Diálogo abre com foco controlado, prende o foco, fecha com `Escape` e
    devolve o foco ao acionador exato.
14. Com rating 2 e nenhum Poder adquirido, o primeiro bloco disponível contém
    todos e somente os Poderes elegíveis de nível 1; após a primeira escolha, a
    nova pendência contém todas as alternativas elegíveis de níveis 1 e 2.
15. Painel lateral e modal usam descrição aprofundada; os cartões continuam
    usando resumo curto para preservar a leitura da etapa.
16. Poderes escolhidos e disponíveis ficam em blocos distintos, agrupados por
    nível real, sem duplicação e sem rótulos de “1º ponto” ou “2º ponto”.
17. Reduzir rating com excesso de Poderes abre `AJUSTE NECESSÁRIO`, preserva o
    estado persistido e usa a projeção do Rules Engine para marcar incompatíveis.
18. O inventário canônico exato de cada Disciplina auditada é comparado por teste,
    incluindo adições e revisões do Companion e do Players Guide.
