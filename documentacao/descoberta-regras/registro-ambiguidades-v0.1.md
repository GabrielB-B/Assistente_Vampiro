# Registro de Ambiguidades v0.1

**Status:** rascunho<br>
**Estado da fase:** iniciada; extração aguardando corpus autorizado<br>
**Escopo:** dúvidas que podem alterar comportamento, recorte ou aprovação

---

## 1. Regra de uso

Registrar aqui somente uma dúvida capaz de mudar regra, teste, autorização ou escopo. Dúvidas locais sem impacto transversal permanecem na especificação correspondente.

Quando uma ambiguidade for resolvida, preservar as alternativas consideradas, registrar a decisão e apontar a evidência. Não duplicar a resposta em vários documentos; os demais artefatos devem referenciar o ID `AMB-*`.

---

## 2. Itens abertos

| ID | Item afetado | Pergunta | Alternativas conhecidas | Impacto | Evidência necessária | Responsável | Estado |
|---|---|---|---|---|---|---|---|
| AMB-001 | corpus normativo | Qual edição e impressão serão normativas? | pendente de inventário | bloqueia aprovação de todas as `RULE-*` | exemplar e metadados editoriais | responsável pelo corpus | aberta |
| AMB-002 | idioma e precedência | Qual fonte prevalece se original, tradução e errata divergirem? | original; tradução; precedência por tipo | bloqueia regras com divergência | fontes correspondentes e erratas | revisor de regras | aberta |
| AMB-003 | recorte da fatia 01 | Quais regras opcionais afetam o teste básico? | incluir; excluir; não aplicável | altera escopo e cenários | seções normativas relevantes | responsável pelo produto e revisor | aberta |
| AMB-004 | RULE-WILL-001 | Quais são elegibilidade, custo, dados permitidos, limites e encerramento do reroll? | pendente de fonte | bloqueia somente o incremento seguinte | fonte normativa e errata | revisor de regras | adiada |

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
| — | nenhuma ambiguidade resolvida | — | — | — |
