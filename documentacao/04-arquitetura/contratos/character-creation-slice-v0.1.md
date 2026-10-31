# Contrato do primeiro recorte de Criação de Personagem v0.1

**Status:** implementado para validação de produto  
**Data:** 31 de outubro de 2026  
**Escopo:** escolha do modo, rascunho canônico e etapas guiadas de Conceito e Atributos

## 1. Decisão estrutural

Criação Guiada e Preencher Ficha são modos de editar o mesmo `Character`. O modo
de interface não é persistido como personagem paralelo e alterná-lo não cria novo
registro.

```text
Novo
  → POST /characters/drafts
  → Character draft único
      ├─ /personagens/{id}/criar/conceito
      ├─ /personagens/{id}/criar/atributos
      └─ /ficha/{id}?mode=direct
```

Os dois caminhos compartilham `characterId`, `version`, revisão do perfil,
Características, auditoria e concorrência otimista.

## 2. Início idempotente

```text
POST /api/v1/characters/drafts
```

Entrada:

```ts
type StartCharacterDraftRequest = {
  idempotencyKey: string;
};
```

O proprietário vem da identidade autenticada. A chave é única por proprietário e
o replay devolve o mesmo `characterId`. O rascunho começa com:

- `state = draft`;
- `kind = null`;
- revisão V5 publicada explícita;
- nove Atributos persistidos em 1;
- `version = 0`;
- nenhuma Crônica ou Sessão.

`ready` e `retired` continuam exigindo `kind`. Regras finais de compatibilidade
entre tipo, Fome e demais escolhas não são congeladas em constraints de rascunho;
pertencem futuramente à validação `CREATION_FINALIZATION` do perfil.

## 3. Etapa guiada de Conceito

```text
GET   /api/v1/characters/{characterId}/creation/concept
PATCH /api/v1/characters/{characterId}/creation/concept
```

O `GET` devolve identidade narrativa, pares Convicção–Pilar, contexto opcional de
Crônica, versão, progresso e política estruturada. O `PATCH` substitui a projeção
da etapa de forma atômica, preserva pares incompletos no rascunho, compara
`expectedVersion` e registra auditoria.

Nome, Conceito e Ambição são o mínimo para avançar; Senhor e Desejo são opcionais.
Zero pares é válido. Um par iniciado precisa dos dois lados para a etapa ficar
concluída. A cardinalidade máxima vem de `RULE-CREATION-CONCEPT-001-r1`.

## 4. Etapa guiada de Atributos

```text
GET   /api/v1/characters/{characterId}/creation/attributes
PATCH /api/v1/characters/{characterId}/creation/attributes
```

O `GET` devolve valores, versão, derivados, saldo e política estruturada. O React
não contém os números normativos. O Rules Engine avalia a revisão
`RULE-CREATION-ATTRIBUTES-001-r1` no contexto `CREATION_STEP`.

O `PATCH`:

1. autoriza somente o proprietário;
2. combina a alteração parcial com o estado persistido;
3. rejeita escolha que torne a distribuição inalcançável;
4. compara `expectedVersion`;
5. persiste valores e auditoria na mesma transação;
6. devolve versão, saldo e derivados recalculados.

Rascunho incompleto é válido. Conclusão desta etapa exige a distribuição integral
formalizada em `creation-attributes-v5-v0.1.md`.

## 5. Ficha direta A03

A Ficha completa aprovada permanece visível. Neste recorte:

- `Nome`, `Conceito`, `Senhor`, `Ambição` e `Desejo` são editáveis e persistem por
  `PATCH /characters/{characterId}/sheet`;
- Atributos persistidos são exibidos e podem ser editados pela etapa guiada do
  mesmo personagem;
- Habilidades, Disciplinas, Vantagens, Defeitos e demais áreas ainda sem contrato
  aparecem honestamente indisponíveis;
- nenhum campo simula salvamento local ou cria estado paralelo.

## 6. Concorrência, segurança e auditoria

- o cliente nunca envia `ownerAccountId`;
- recurso ausente e recurso alheio compartilham a resposta pública de
  indisponibilidade;
- toda escrita usa `expectedVersion` e não aplica “última gravação vence”;
- início, identidade, Conceito e Atributos geram `audit_entry`;
- campos inesperados são rejeitados no limite HTTP;
- a revisão de regras usada pelo rascunho é explícita e persistida.

## 7. Limites do recorte

Não estão implementados:

- `draft → ready` e `CREATION_FINALIZATION`;
- pacote de estágio/experiência inicial;
- demais etapas mecânicas da criação;
- tela e regra executável de Clã;
- vínculo com Crônica;
- Mesa, Quick Sheet, Cena, Feed ou interface Roll20-like.

Esses limites não autorizam valores fictícios. As próximas mecânicas dependem das
especificações rastreáveis do mapa normativo de criação.
