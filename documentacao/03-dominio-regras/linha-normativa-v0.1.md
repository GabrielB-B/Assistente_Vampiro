# Linha Normativa v0.1

**Status:** aprovado<br>
**Data:** 6 de outubro de 2026<br>
**Data de aprovação:** 6 de outubro de 2026<br>
**Última revisão de coerência:** 7 de outubro de 2026<br>
**Perfil:** `v5-core-companion-pg-2023`<br>
**Revisão publicada:** `v5-core-companion-pg-2023-r1`

---

## 1. Propósito

Definir qual regra o sistema executa quando as fontes do corpus inicial se sobrepõem, sem depender da ordem em que arquivos foram importados e sem copiar o texto dos livros para o código.

## 2. Fontes

| Prioridade contextual | Fonte | Papel |
|---:|---|---|
| 1 | errata oficial ingerida e aplicável | corrige uma unidade identificada |
| 2 | SRC-0004 — Players Guide EN, 2023 | consolida e revisa o que republica |
| 3 | SRC-0003 — Companion PT-BR, 2021 | adiciona conteúdo e atualiza o Livro Básico |
| 4 | SRC-0001 — Livro Básico PT-BR | define a mecânica central e o vocabulário principal |
| 5 | decisão interna revisada | resolve somente lacunas documentadas |

Prioridade não significa substituir um livro inteiro. Cada `RuleRevision` declara quais revisões anteriores substitui.

## 3. Resultado do cotejo

### Mecânica central

O Livro Básico continua sendo a autoridade para formação de parada, Dificuldade, sucessos, Fome, críticos, Crítico Bestial e Falha Bestial. O Companion confirma atualizações já presentes na impressão local e amplia `Pegar a Metade` como regra opcional.

O Players Guide não republica o fluxo básico e não contém a tabela de Potência do Sangue. Ele não substitui o Livro Básico nesses pontos.

### Conteúdo consolidado

O Players Guide passa a ser a revisão mecânica preferida para:

- os clãs Banu Haqim, Hecata, Lasombra, Ministério, Ravnos, Salubri e Tzimisce;
- os poderes que republica;
- opções de Caitiff, Sangues-Ralos, carniçais e mortais que republica;
- sistemas de coterie, Pilares, Memoriam e Projetos nele apresentados.

### Divergências confirmadas

| Unidade | Decisão do perfil |
|---|---|
| Obeah / Panacea | ID único; revisão de 2023 chamada `Panacea`; `Obeah` é alias histórico PT-BR |
| Aliviando a Alma Bestial | revisão de 2023 permite alvo com Humanidade igual à do usuário |
| Valeren | nível 3 |
| Perdição Ravnos | aplica-se também em Torpor |
| terceiro olho Salubri | pode ser ocultado apenas quando o personagem inteiro é ocultado |
| Um com a Terra | alcance aproximado de 1 km na revisão de 2023 |
| Sangue Pernicioso | custo de 1 a 2 pontos |
| Maldição da Megaira / Crone's Curse | custo 2; rótulo PT-BR histórico preservado até revisão editorial |
| Presas Estranhas | custo 1 |
| Vivendo no Limite / Risk-Taker | custo 1; novo rótulo PT-BR ainda candidato |
| Vontade Fraca | custo 2 e penalidade social adicional da revisão de 2023 |

## 4. Terminologia

Termo oficial em português e regra vigente são dimensões separadas.

Exemplo: a edição inglesa pode revisar números de uma regra cujo nome em português veio do Companion. O sistema mantém:

- `ruleId` estável;
- `revisionId` mecânico;
- `locale` do rótulo;
- fonte do rótulo;
- fonte da mecânica.

Isso evita acoplar tradução a comportamento.

## 5. Perfil persistido

Uma Crônica referencia um `ruleSetProfileRevisionId` publicado. Toda tentativa de rolagem persistida registra a mesma revisão efetiva do perfil e a revisão de cada regra avaliada.

O perfil deve ser imutável após publicação. Uma correção cria nova revisão; não altera silenciosamente eventos passados.

Campos mínimos:

| Campo | Finalidade |
|---|---|
| `ruleSetProfileId` | identidade estável do conjunto |
| `ruleSetProfileRevisionId` | identidade imutável da revisão publicada |
| `revision` | versão fechada do perfil |
| `sourceSet` | fontes incluídas e hashes de seus manifestos |
| `enabledModules` | regras opcionais habilitadas |
| `precedencePolicy` | política de resolução de sobreposição |
| `publishedAt` | momento em que ficou disponível |
| `supersedes` | revisão anterior, quando houver |

## 6. Regras opcionais

- `Pegar a Metade`: módulo habilitável por Crônica; fora da primeira fatia executável.
- variantes de Perdição: uma escolha de variante por clã no perfil da Crônica.
- `Twice-Cursed`: acumula Perdição regular e variante quando permitido.
- Memoriam e Projetos: módulos catalogados, sem implementação no primeiro corte.

## 7. Conteúdo privado

O runtime não consulta PDF nem extração bruta para decidir uma regra. O caminho é:

```text
fonte privada
→ interpretação revisada
→ especificação própria
→ casos de teste
→ revisão de regra publicada
→ Rules Engine
```

Somente metadados, paráfrases, especificações próprias e referências entram no repositório.

## 8. Gate de implementação

Esta linha normativa fundamentou o Modelo de Domínio aprovado e autoriza sua evolução versionada. Ela não autoriza implementar automaticamente todas as 88 unidades de poder catalogadas.

Cada regra executável ainda precisa de:

- especificação própria;
- casos normais e limítrofes;
- aprovação humana contra a fonte;
- revisão de localização quando houver texto novo de interface.
