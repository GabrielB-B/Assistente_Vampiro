# Cerimônias do Oblívio V5 v0.1

**Perfil:** `v5-core-companion-pg-2023-r1`<br>
**Catálogo:** `CATALOG-OBLIVION-CEREMONIES-V5-PG-2023-r1`<br>
**Status:** inventário, aquisição, requisitos e mecânicas auditados

## Regra geral

Cerimônia não é Poder de Oblívio. Salvo exceção do item, exige uma Checagem de Sangue, cinco minutos por nível e `Determinação + Oblívio` contra `nível + 1`. Cada Cerimônia exige um Poder de Oblívio específico. Fonte: `SRC-0004`, p. 91–92.

A regra comum está estruturada em `OBLIVION_CEREMONY_EXECUTION_POLICY`; pré-requisito, ingredientes, processo, teste excepcional, duração e restrições permanecem no item canônico.

Na criação, uma personagem com pelo menos um dos Poderes pré-requisitos pode escolher uma Cerimônia de nível 1 compatível. Depois, a compra custa `nível × 3 XP`, exige rating de Oblívio suficiente, o Poder pré-requisito, professor que conheça a Cerimônia e no mínimo `nível²` semanas. Acesso temporário a Oblívio não concede Cerimônias.

## Matriz auditada

| Cerimônia | Nível | Fonte | Página | Poder obrigatório | Status |
|---|---:|---|---:|---|---|
| Dádiva da Falsa Vida | 1 | SRC-0004 | 92 | Cinzas às Cinzas | VERIFIED |
| Invocar Espírito | 1 | SRC-0004 | 92–93 | O Grilhão Vinculante | VERIFIED |
| Despertar o Servo Homuncular | 2 | SRC-0004 | 93 | Onde o Véu se Torna Fino | VERIFIED |
| Compelir Espírito | 2 | SRC-0004 | 94 | Onde o Véu se Torna Fino | VERIFIED |
| Hospedar Espírito | 3 | SRC-0004 | 94–95 | Aura de Decomposição | VERIFIED |
| Hordas Cambaleantes | 3 | SRC-0004 | 95 | Aura de Decomposição | VERIFIED |
| Vincular o Espírito | 4 | SRC-0004 | 96 | Praga Necrótica | VERIFIED |
| Rasgar o Véu | 4 | SRC-0004 | 96–97 | Praga Necrótica | VERIFIED |
| Bênção Lazarena | 5 | SRC-0004 | 98 | Skuld Cumprido | VERIFIED |

Quantidades por nível: **2 / 2 / 2 / 2 / 1**, total **9**.

## Arquitetura

`OBLIVION_CEREMONY_CATALOG` possui tipo próprio, ingredientes, processo, teste, duração, requisito de Poder, proveniência e revisão. Aquisição futura deve persistir apenas a escolha da personagem e sua revisão; o catálogo permanece versionado no Rules Engine.
