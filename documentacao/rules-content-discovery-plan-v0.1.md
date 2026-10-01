# Rules & Content Discovery Plan v0.1

**Status:** próxima fase recomendada  
**Data:** 1º de outubro de 2026  
**Edição inicial:** V5, sujeita à confirmação do corpus

---

## 1. Objetivo

Extrair evidências suficientes das fontes autorizadas para criar:

- Domain Model v0.1;
- Rules Engine Scope v0.1;
- glossário inicial;
- testes determinísticos do primeiro corte vertical;
- modelo de conhecimento com proveniência.

Não é objetivo desta fase importar todos os livros ou toda a lore.

---

## 2. Fronteiras da descoberta

### Trilha A — Produto

Já pode ser modelada a partir dos documentos internos:

- User;
- Character;
- Chronicle;
- Membership;
- Session;
- Scene;
- Permission;
- Activity Log.

### Trilha B — Game Rules

Exige leitura de fontes autoritativas:

- Trait;
- Dice Pool;
- Hunger;
- Difficulty;
- Roll;
- Roll Result;
- Critical;
- Messy Critical;
- Bestial Failure;
- Willpower Reroll.

### Trilha C — Knowledge e Lore

Nesta fase, modelar apenas a infraestrutura conceitual:

- Source;
- Edition;
- Chapter;
- Page Reference;
- Content Fragment;
- Translation;
- Glossary Term;
- Visibility;
- Citation.

Lore extensa será incorporada incrementalmente, depois do primeiro motor de regras.

---

## 3. Corpus mínimo

Selecionar somente trechos necessários para responder:

1. como uma parada de dados é formada?
2. quando dados de Fome substituem dados normais?
3. como dificuldade e sucessos funcionam?
4. como críticos são identificados e contabilizados?
5. o que caracteriza Crítico Sangrento?
6. o que caracteriza Falha Bestial?
7. quando Força de Vontade permite reroll?
8. quais dados podem ou não ser rerrolados?
9. quem define modificadores e dificuldade?
10. quais decisões permanecem com o Narrador?

---

## 4. Organização local das fontes

Estrutura sugerida, ignorada pelo Git:

```text
fontes-privadas/
├── inventario-local.md
├── v5/
│   ├── original/
│   ├── pt-br/
│   └── extracoes/
└── notas-locais/
```

Não usar essa pasta como produto final nem como fonte pública.

---

## 5. Inventário de fontes

Para cada obra, registrar:

| Campo | Descrição |
|---|---|
| source_id | identificador interno estável |
| título | título oficial |
| edição | V5, V20 ou outra |
| versão | impressão, errata ou revisão |
| idioma | idioma da fonte |
| publicador | responsável pela publicação |
| aquisição | origem legal do exemplar |
| uso permitido | privado, citação, implementação ou distribuição |
| escopo | capítulos relevantes |
| prioridade | primeiro corte ou futuro |

---

## 6. Pipeline de conteúdo

```mermaid
flowchart LR
    SOURCE[Fonte autorizada] --> EXTRACT[Extração privada]
    EXTRACT --> RAW[Original preservado]
    RAW --> STRUCTURE[Estrutura por regra ou conceito]
    STRUCTURE --> TRANSLATE[Tradução, se necessária]
    TRANSLATE --> REVIEW[Revisão humana]
    REVIEW --> KNOWLEDGE[Conhecimento publicável]
    REVIEW --> RULE_SPEC[Especificação executável]
    RULE_SPEC --> TESTS[Testes]
    RULE_SPEC --> ENGINE[Rules Engine]
```

### Separações obrigatórias

- original não é sobrescrito;
- tradução não substitui proveniência;
- resumo não vira regra executável automaticamente;
- IA pode auxiliar extração, nunca aprovar regra sozinha;
- regra executável precisa de exemplos e testes.

---

## 7. Estados de uma regra

| Estado | Significado |
|---|---|
| identificada | regra localizada na fonte |
| extraída | estrutura inicial registrada |
| interpretada | entradas, saídas e exceções descritas |
| revisada | conferida contra a fonte |
| especificada | pronta para testes |
| implementada | presente no Rules Engine |
| verificada | testes e revisão concluídos |
| substituída | nova edição ou errata assumiu precedência |

---

## 8. Matriz de rastreabilidade

Toda regra implementada deverá permitir o caminho:

```text
Comportamento no sistema
→ teste automatizado
→ especificação estruturada
→ interpretação revisada
→ fonte, edição, capítulo e página
```

Não implementar mecânica sem rastreabilidade mínima.

---

## 9. Glossário inicial

Campos:

- termo original;
- termo PT-BR;
- edição;
- fonte;
- definição curta;
- estado da tradução;
- aliases de busca;
- observações de uso.

Estados sugeridos:

- oficial;
- revisado internamente;
- provisório;
- tradução por IA não revisada;
- depreciado.

---

## 10. Critérios de qualidade

Uma especificação está pronta quando:

- identifica edição e fonte;
- separa regra de exemplo narrativo;
- descreve entradas e saídas;
- explicita escolhas do jogador;
- explicita autoridade do Narrador;
- registra exceções;
- possui exemplos normais e limítrofes;
- pode ser convertida em testes;
- não depende de texto protegido no runtime para funcionar.

---

## 11. Questões jurídicas

Antes de qualquer conteúdo entrar no produto ou no GitHub, classificar:

- o que pode ser armazenado privadamente;
- o que pode ser resumido;
- o que pode ser exibido;
- o que pode ser traduzido;
- o que pode ser distribuído;
- quais marcas e imagens exigem licença.

Na ausência de autorização clara, manter o material original fora do repositório.

---

## 12. Entregáveis

1. inventário de fontes;
2. glossário v0.1;
3. conjunto mínimo de especificações;
4. matriz de rastreabilidade;
5. lista de ambiguidades;
6. cenários de teste;
7. Rules & Content Discovery Report v0.1;
8. recomendações para o Domain Model.

---

## 13. Definition of Done

A fase termina quando:

- o primeiro fluxo de rolagem está completamente explicado;
- as regras possuem proveniência;
- as exceções relevantes foram identificadas;
- os exemplos principais viraram cenários de teste;
- termos PT-BR estão controlados;
- o conteúdo permitido no Git está separado do corpus privado;
- o Domain Model pode ser criado sem inventar a mecânica.
