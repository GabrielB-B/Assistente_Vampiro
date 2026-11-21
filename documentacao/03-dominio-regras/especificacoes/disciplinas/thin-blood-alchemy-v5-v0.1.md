# Alquimia Sangue-Ralo V5 v0.1

**Perfil:** `v5-core-companion-pg-2023-r1`<br>
**Catálogo:** `CATALOG-THIN-BLOOD-ALCHEMY-FORMULAS-V5-CORE-PG-2023-r1`<br>
**Status:** fundação, Fórmulas, métodos e aquisição auditados

## Separação normativa

Alquimia Sangue-Ralo é uma Disciplina com rating, mas seus efeitos executáveis são **Fórmulas**, não Poderes comuns de Disciplina. O catálogo canônico de Poderes exclui essas entradas. Os IDs históricos `power:tba-*` foram mantidos por compatibilidade de saves; o tipo e a coleção canônica são de Fórmula.

Cada ponto de Alquimia concede uma Fórmula gratuitamente. Fórmulas adicionais custam `nível × 3 XP` e exigem pesquisa e experimentação. Ao obter o primeiro ponto, o alquimista escolhe `Athanor Corporis`, `Calcinatio` ou `Fixatio`; aprender outro método inicia rating e conhecimento de Fórmulas independentes. Fontes: `SRC-0001`, p. 283–284 e 151.

Todas as Fórmulas exigem vitae do alquimista e sangue humano com a Ressonância apropriada, salvo exceção expressa. O custo de destilação equivale a uma Checagem de Sangue e o custo de ativação é o do efeito produzido. A rolagem de destilação depende do método: Vigor + Alquimia, Manipulação + Alquimia ou Inteligência + Alquimia. Fonte: `SRC-0001`, p. 282–284.

Essas regras compartilhadas estão estruturadas em `THIN_BLOOD_ALCHEMY_EXECUTION_POLICY`. Cada Fórmula conserva separadamente ingredientes, custo, parada, dificuldade, duração, limitações e referência normativa.

## Métodos

| Método | Athanor | Parada de destilação | Restrição central |
|---|---|---|---|
| Athanor Corporis | corpo do alquimista | Vigor + Alquimia | um efeito preparado por vez |
| Calcinatio | corpo de mortal condicionado | Manipulação + Alquimia | uma Fórmula por recipiente humano |
| Fixatio | equipamento alquímico | Inteligência + Alquimia | produção e armazenamento dependem do laboratório |

## Matriz auditada

| Fórmula | Nível | Método | Fonte | Página | Status |
|---|---:|---|---|---:|---|
| Longo Alcance | 1 | todos | SRC-0001 | 284–285 | VERIFIED |
| Neblina | 1 | todos | SRC-0001 | 285 | VERIFIED |
| Língua Mercúria | 1 | todos | SRC-0004 | 103 | VERIFIED |
| Plug-in | 1 | todos | SRC-0004 | 103–104 | VERIFIED |
| Envolver | 2 | todos | SRC-0001 | 285–286 | VERIFIED |
| Lista de Amigos | 2 | todos | SRC-0004 | 104 | VERIFIED |
| Desfracionar | 3 | todos | SRC-0001 | 286 | VERIFIED |
| Hieros Gamos Profano | 3 | todos | SRC-0001 | 286–287 | VERIFIED |
| Mandagloire | 3 | todos | SRC-0004 | 104–105 | VERIFIED |
| Tanque | 3 | todos | SRC-0004 | 105 | VERIFIED |
| Rumor | 3 | todos | SRC-0004 | 105 | VERIFIED |
| Ímpeto Aéreo | 4 | todos | SRC-0001 | 287 | VERIFIED |
| Curto-Circuito | 4 | todos | SRC-0004 | 105 | VERIFIED |
| Personalidade Tóxica | 4 | todos | SRC-0004 | 105–106 | VERIFIED |
| Despertar o Adormecido | 5 | todos | SRC-0001 | 287 | VERIFIED |
| Momento de Clareza | 5 | todos | SRC-0004 | 106 | VERIFIED |
| Amaranto Florido | 5 | todos | SRC-0004 | 106 | VERIFIED |

Quantidades por nível: **4 / 2 / 5 / 3 / 3**, total **17**.

## Sangue-Ralo e acesso temporário

Ressonância pode dar acesso temporário a Poder de outra Disciplina, mas isso não cria rating permanente nem deve ser gravado em `character_discipline`. Alquimia pode imitar efeitos permitidos, porém não Rituais de Feitiçaria de Sangue. O perfil futuro de persistência deve distinguir rating aprendido, Fórmula conhecida, preparo ativo e efeito temporário.

O Players Guide também permite a qualquer Sangue-Ralo aprender Alquimia pelo custo de Disciplina de Clã, mesmo sem a Qualidade de criação (`SRC-0004`, p. 103). Isso não transforma Alquimia em Disciplina intrínseca nem concede automaticamente rating na criação.
