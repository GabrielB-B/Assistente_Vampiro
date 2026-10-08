# Inventário de Fontes v0.1

**Status:** baseline técnico aprovado<br>
**Data de revisão:** 6 de outubro de 2026<br>
**Escopo:** corpus inicial para regras, criação de personagem e arquitetura do domínio

---

## 1. Resultado

O corpus inicial possui três publicações oficiais e legitimamente fornecidas pelo responsável do projeto. Os originais, extrações e cotejos completos permanecem em `fontes-privadas/`, fora do Git.

Este inventário registra metadados e decisões próprias. Ele não reproduz o conteúdo dos livros.

## 2. Fontes adotadas

| ID | Fonte | Edição | Idioma | Publicação | Páginas físicas | Uso | Estado |
|---|---|---|---|---:|---:|---|---|
| SRC-0001 | *Vampiro: A Máscara — Livro Básico* | V5 | pt-BR | Galápagos | 434 | mecânica central e terminologia | ingerida e auditada |
| SRC-0003 | *Vampiro: A Máscara — Companion: Guia Suplementar* | V5 | pt-BR | Galápagos, jul. 2021 | 68 | três clãs, carniçais, mortais, coteries e atualizações | ingerida, auditada e comparada |
| SRC-0004 | *Vampire: The Masquerade — Players Guide* | V5 | en-US | Renegade, 2023 | 250 | consolidação, clãs, poderes e sistemas ampliados | ingerida, auditada e comparada |

`SRC-0002` permanece reservado para uma errata oficial versionada. Nenhum arquivo foi atribuído a esse ID.

## 3. Integridade

| Fonte | SHA-256 |
|---|---|
| SRC-0001 | `d719807ea872174b6617bf41a4ebe4c2ce4e77e1f3facc946643afc52f2af311` |
| SRC-0003 | `89b49c22eb8dea3443cf1bd9bffe568b74476e88a7eb8778d24333590e632329` |
| SRC-0004 | `25577325c50f995c3ccfaa6c627c6a1352fb4a8f109b14927ecbc811ba7415d5` |

Os três originais foram preservados sem alteração. Cada página foi inventariada. As extrações são camadas de busca e cotejo, nunca a autoridade normativa.

## 4. Perfil de regras proposto

Identificador: `v5-core-companion-pg-2023`.

O identificador contém a composição e o marco temporal do corpus. Não usa palavras como `atual`, que perderiam significado com o tempo.

### Precedência

1. errata oficial aplicável, depois de identificada e ingerida;
2. `SRC-0004` quando republicar a mesma unidade de regra;
3. `SRC-0003` para adições e atualizações não republicadas;
4. `SRC-0001` para a mecânica central;
5. interpretação interna revisada somente quando houver lacuna explícita.

Uma fonte posterior não substitui integralmente uma anterior. A precedência é resolvida por unidade de regra.

## 5. Terminologia

Ordem de preferência para rótulos em português:

1. Livro Básico Galápagos;
2. Companion Galápagos;
3. glossário controlado do projeto;
4. tradução candidata do Players Guide, marcada como não oficial.

A mecânica do Players Guide prevalece nos casos republicados mesmo quando o rótulo PT-BR é reaproveitado do Companion.

## 6. Correções importantes

- o termo oficial é `Crítico Bestial`, não `Crítico Sangrento`;
- o termo oficial é `Checagem de Sangue`, não `Teste de Despertar`;
- o Players Guide não contém uma tabela de Potência do Sangue na página 248; essa página é um anúncio;
- Potência do Sangue continua sustentada pelo Livro Básico e pelo Companion;
- `Valeren` é de nível 3 no perfil de 2023;
- `Panacea` substitui o nome `Obeah` na revisão inglesa, mantendo `Obeah` como alias histórico da edição brasileira do Companion.

## 7. Regras opcionais

Regras opcionais não serão misturadas ao núcleo por condicionais dispersas. Cada uma pertence a um módulo de perfil com identidade e estado próprios.

| Regra | Estado no perfil proposto |
|---|---|
| expansão de `Pegar a Metade` do Companion | habilitada como opção recomendada da Crônica |
| variantes de Perdição | desabilitadas por padrão; escolha por clã e Crônica |
| `Twice-Cursed` | disponível somente quando a variante correspondente estiver catalogada |
| sistemas de Memoriam e Projetos | disponíveis no corpus, fora do primeiro corte executável |

## 8. Direitos e distribuição

O acesso legítimo permite a descoberta privada. Não foi registrada autorização para distribuir PDFs, extrações integrais, traduções completas, imagens ou texto editorial no Git ou no produto.

Documentos versionáveis podem conter:

- metadados;
- referências de página;
- identificadores;
- paráfrases próprias;
- decisões de precedência;
- especificações mecânicas próprias e testes.

## 9. Gates

| Gate | Estado |
|---|---|
| A — identificar e extrair privadamente | satisfeito nas três fontes |
| Controle técnico — integridade e baseline | satisfeito para o corpus inicial |
| B — aprovar uma regra executável | pendente por regra |
| C — fechar termos centrais PT-BR | satisfeito para o primeiro fluxo de rolagem |
| C — localizar todos os nomes inéditos do Players Guide | pendente e não bloqueante |
| D — publicar ou distribuir conteúdo editorial | não autorizado |

## 10. Limite da verdade estabelecida

O perfil representa estes três exemplares e suas decisões documentadas. Ele não afirma incluir todo suplemento V5 nem toda errata publicada no mundo. Novas fontes entram por revisão explícita, geram um novo perfil ou uma nova revisão e nunca alteram silenciosamente uma tentativa já persistida.
