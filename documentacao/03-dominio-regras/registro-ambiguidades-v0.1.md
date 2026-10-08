# Registro de Ambiguidades v0.1

**Status:** rascunho<br>
**Estado da fase:** corpus inicial comparado; cinco decisões resolvidas e localização completa ainda pendente<br>
**Escopo:** dúvidas que podem alterar comportamento, recorte ou aprovação

---

## 1. Regra de uso

Registrar aqui somente uma dúvida capaz de mudar regra, teste, autorização ou escopo. Dúvidas locais sem impacto transversal permanecem na especificação correspondente.

Quando uma ambiguidade for resolvida, preservar as alternativas consideradas, registrar a decisão e apontar a evidência. Não duplicar a resposta em vários documentos; os demais artefatos devem referenciar o ID `AMB-*`.

---

## 2. Itens abertos

| ID | Item afetado | Pergunta | Alternativas conhecidas | Impacto | Evidência necessária | Responsável | Estado |
|---|---|---|---|---|---|---|---|
| AMB-005 | localização do Players Guide | Como rotular nomes sem edição PT-BR disponível no corpus? | manter inglês; tradução candidata; tradução oficial futura | afeta UI, não o identificador nem a mecânica | revisão editorial humana ou publicação oficial | responsável editorial | aberta, não bloqueante |
| AMB-006 | errata posterior | Existe errata oficial posterior aplicável ao corpus de 2023? | nenhuma ingerida; errata futura; impressão revisada | pode criar nova revisão de regra | fonte oficial versionada | responsável pelo corpus | aberta, não bloqueante para o perfil fechado |

---

## 3. Estados

- `aberta`: precisa de evidência ou decisão;
- `em revisão`: alternativas e fontes estão sendo comparadas;
- `resolvida`: decisão e evidência foram registradas;
- `adiada`: não bloqueia o recorte atual;
- `substituída`: outra ambiguidade passou a representar a questão.

---

## 4. Histórico de resolução

| ID | Decisão | Evidência | Data | Responsável |
|---|---|---|---|---|
| AMB-001 | Adotar o perfil fechado `v5-core-companion-pg-2023`, composto por `SRC-0001`, `SRC-0003` e `SRC-0004`. | inventário das três fontes, hashes e relatórios privados de ingestão | 2026-10-06 | responsável pelo corpus |
| AMB-002 | Resolver precedência por unidade: errata ingerida → Players Guide quando republica → Companion → Livro Básico → interpretação revisada. Terminologia: Livro Básico Galápagos → Companion Galápagos → glossário controlado. | cotejo dos três livros e linha normativa v0.1 | 2026-10-06 | responsável pelo corpus |
| AMB-003 | A fatia 01 sempre executa a rolagem. `Pegar a Metade` permanece no perfil como opção posterior e não cria um ramo no primeiro avaliador. | corte vertical do Product Architecture e delta do Companion | 2026-10-06 | responsável pelo produto |
| AMB-004 | Gastar um ponto de Força de Vontade marca um dano Superficial e permite rerrolar até três dados normais elegíveis, nunca Dados de Fome. Checagens, rolagens de trilha e demais proibições expressas ficam excluídas. O produto preserva a tentativa inicial e cria outra tentativa vinculada para as novas faces. | Livro Básico, p. 122, 158 e 205–206; DEC-021 e DEC-045 | 2026-10-08 | responsável pelo produto e revisor de regras |
| AMB-007 | Preservar simultaneamente Falha Bestial e elegibilidade para Vencer a um Custo. Quando o custo for oferecido, `RULE-COST-001` deverá compor uma consequência coerente com a manifestação bestial, sem apagar a classificação original. | Livro Básico, p. 121 e 207; DEC-047; RULE-BESTIAL-001 | 2026-10-08 | responsável do produto e revisor de regras |
