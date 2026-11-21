# Fundação de Character/Ficha v0.1

**Status:** fundação técnica implementada; primeiro recorte de criação integrado<br>
**Data:** 30 de outubro de 2026<br>
**Escopo:** Ficha canônica independente, contexto opcional e escrita parcial versionada

## 1. Decisões aplicadas

- `Character` pertence à Conta e pode existir sem Crônica;
- `draft`, `guided`, `direct` e `play` não criam modelos de personagem distintos;
- a Ficha canônica não contém Sessão ou Cena;
- Crônica é contexto opcional, separado da Ficha;
- somente o proprietário altera os campos canônicos neste corte;
- a interface de criação e qualquer direção visual nova continuam fora do escopo.

## 2. Entrada de personagem

`GET /api/v1/player-entry` representa personagens próprios `draft` ou `ready` e
personagens vinculados visíveis à Narradora. O resumo usa:

```ts
type CharacterEntrySummaryView = {
  characterId: string;
  characterState: "draft" | "ready" | "retired";
  chronicleId: string | null;
  chronicleTitle: string | null;
  // demais campos existentes
};
```

Ausência de Crônica é um estado válido. Ela não exige `CharacterBinding` nem
`ChronicleMembership` para o proprietário.

## 3. Ficha canônica e contexto

```text
GET /api/v1/characters/{characterId}/sheet
GET /api/v1/characters/{characterId}/sheet?chronicleId={chronicleId}
```

A resposta separa dados próprios do Personagem de contexto externo:

```ts
type CharacterSheetDocumentView = {
  sheet: CharacterSheetView;
  context: {
    chronicle: ChronicleContextView | null;
  };
};
```

`CharacterSheetView` contém somente identidade, estado, versão, revisão do perfil
e Características persistidas. Sessão e Cena não pertencem a esse contrato.

Sem `chronicleId`, somente o proprietário pode obter a Ficha. Com `chronicleId`,
o proprietário continua autorizado por propriedade e a Narradora depende de
Participação e Vínculo ativos. A remoção concorrente do Vínculo impede que a
projeção da Narradora seja produzida.

## 4. Escrita parcial

```text
PATCH /api/v1/characters/{characterId}/sheet
```

Primeiro comando canônico:

```ts
type UpdateCharacterSheetRequest = {
  expectedVersion: number;
  identity: {
    name?: string;
    concept?: string | null;
  };
};
```

O corpo não aceita `ownerAccountId`, Crônica, Sessão, Cena, modo guiado ou modo
direto. O backend deriva o proprietário da identidade atuante, autoriza antes da
escrita e repete a restrição de propriedade no `UPDATE`.

A atualização:

1. compara `expectedVersion` no PostgreSQL;
2. altera somente campos presentes;
3. incrementa `version`;
4. grava `audit_entry` na mesma transação;
5. devolve `{ characterId, version }`;
6. responde `VERSION_CONFLICT` sem aplicar overwrite quando a versão diverge.

Criação Guiada e preenchimento direto deverão chamar esse mesmo comando. Não há
endpoint de edição visual neste corte.

## 5. Início do rascunho

`POST /api/v1/characters/drafts` cria um `Character` independente com chave de
idempotência por proprietário. O rascunho admite `kind = null`, usa a revisão V5
publicada e começa com os nove Atributos persistidos no valor base. O modo guiado
ou direto não faz parte do estado do domínio.

O contrato detalhado, a etapa de Atributos e os limites atuais estão em
`character-creation-slice-v0.1.md`.

## 6. Limites

- nenhuma composição visual nova;
- nenhuma edição visível na Ficha;
- nenhuma regra completa de criação V5;
- nenhuma expansão de Mesa, Quick Sheet, Feed, Cena ou Narrador;
- nenhuma incorporação do protótipo de Mesa existente em outra branch.
