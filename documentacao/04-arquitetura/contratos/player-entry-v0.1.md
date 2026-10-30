# Contrato de Entrada do Jogador e Ficha Mínima v0.1

**Status:** primeiro corte implementado e verificado localmente<br>
**Data:** 25 de outubro de 2026<br>
**Incremento:** VS01-03<br>
**Perfil inicial:** `v5-core-companion-pg-2023-r1`

## 1. Objetivo

Definir a fronteira HTTP usada para escolher uma identidade fictícia do alpha,
listar somente Personagens autorizados e carregar a projeção mínima da ficha em
Modo Jogar. Este contrato não confirma rolagens nem permite edição persistente.

Os tipos públicos vivem em `@assistente-vampiro/contracts`. A publicação e a
verificação automática do documento OpenAPI continuam como gate antes de encerrar
o VS01-03.

## 2. Identidade do alpha

As duas operações exigem:

```text
x-alpha-identity: player-one | player-two | storyteller-one | outsider-one
```

O cabeçalho é uma ferramenta local e não representa autenticação de produção. A
API aceita somente a allowlist do seed e falha ao iniciar fora de `local`, `test`
ou `ci`. Papel, propriedade e Vínculo nunca vêm do cabeçalho.

## 3. Entrada autorizada

```text
GET /api/v1/player-entry
```

Resposta:

```ts
type PlayerEntryView = {
  actor: {
    displayName: string;
    identityAlias: AlphaIdentityAlias;
  };
  characters: readonly {
    accessMode: "OWNER" | "STORYTELLER";
    characterId: string;
    characterName: string;
    characterState: "draft" | "ready" | "retired";
    chronicleId: string;
    chronicleTitle: string;
    concept: string | null;
  }[];
};
```

A lista é construída em duas fases:

1. ler somente propriedade, Participação, papel e Vínculo;
2. aplicar a política e buscar nomes e conceitos apenas para as referências
   autorizadas.

Uma identidade válida sem acesso recebe `200` com lista vazia. A resposta não
confirma a existência de Personagens fora do seu público.

## 4. Ficha mínima

```text
GET /api/v1/characters/{characterId}/sheet?chronicleId={chronicleId}
```

A projeção contém:

- acesso exercido (`OWNER` ou `STORYTELLER`);
- identidade mínima, estado, versão e Fome do Personagem;
- Crônica vinculada;
- Sessão ativa e Cena publicada, quando existirem;
- revisão do perfil de regras;
- Atributos e Habilidades persistidos como IDs canônicos e valores.

Notas privadas da Cena, dados de Conta, credenciais e conteúdo não autorizado não
fazem parte do tipo público.

## 5. Erros seguros

```ts
type PublicApiErrorResponse = {
  error: {
    code:
      | "AUTHENTICATION_REQUIRED"
      | "INVALID_REQUEST"
      | "RESOURCE_NOT_AVAILABLE"
      | "SERVICE_UNAVAILABLE";
    correlationId: string;
    message: string;
  };
};
```

| Situação | HTTP | Código |
|---|---:|---|
| alias ausente ou desconhecido | 401 | `AUTHENTICATION_REQUIRED` |
| UUID ou consulta inválida | 400 | `INVALID_REQUEST` |
| recurso inexistente ou não autorizado | 404 | `RESOURCE_NOT_AVAILABLE` |
| projeção indisponível | 503 | `SERVICE_UNAVAILABLE` |

O mesmo `404` cobre ausência e negação para reduzir enumeração. Stack trace,
papéis internos, motivo detalhado da política e conteúdo narrativo não saem da
API.

## 6. Estados da interface

O cliente cobre:

- carregando identidade e projeção;
- ficha autorizada;
- lista vazia sem revelar recursos;
- falha de rede ou contrato, com nova tentativa;
- campos não persistidos marcados como não carregados;
- edição desabilitada até existir comando persistente;
- troca explícita entre as quatro identidades do alpha.

O cliente valida a forma mínima das respostas em runtime. Ele não recebe nem
executa o Rules Engine e não calcula resultado oficial de rolagem.

## 7. Evidências

- testes unitários das políticas e casos de uso;
- testes de integração em PostgreSQL 18 para Jogadora, Narradora, segundo Jogador
  e outsider;
- teste HTTP manual com acesso autorizado e troca de ID negada com `404`;
- testes do frontend para carregamento, ação rápida, dificuldade explícita,
  campos ausentes e identidade sem Personagem;
- QA visual em 1440 × 1200 e 390 × 844.

## 8. Limites e próximo gate

- o cabeçalho fictício não será publicado como autenticação;
- a ficha persistida ainda contém somente quatro Características do alpha;
- edição, especializações, Disciplinas, Vantagens e históricos exigem seus
  próprios contratos e modelo de dados;
- a preparação exibida pelo Roll Builder ainda é local e não cria fato;
- OpenAPI gerado permanece necessário para encerrar o VS01-03; o envelope HTTP já
  possui teste automatizado;
- confirmação, faces, resultado e histórico pertencem ao VS01-04.
