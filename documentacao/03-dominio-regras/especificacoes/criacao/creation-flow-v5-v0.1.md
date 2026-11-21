# Fluxo de Criação V5 v0.1

**Status:** formalização parcial revisável  
**Perfil:** `v5-core-companion-pg-2023-r1`  
**Escopo:** mapa normativo da criação; Conceito e Atributos estão prontos para execução

## Fontes e precedência

- `SRC-0001`, *Vampiro: A Máscara — Livro Básico* (Galápagos, pt-BR), p. 135–153, 155–159, 172–195 e 205–215: fluxo e mecânica centrais.
- `SRC-0003`, *Companion: Guia Suplementar* (Galápagos, pt-BR), p. 45–55: criação opcional de mortais e carniçais.
- `SRC-0004`, *Vampire: The Masquerade Players Guide* (2023, en), p. 62–66 e 212: republica o resumo consolidado, adiciona opções e altera a unidade de Convicções.

A precedência é aplicada por unidade de regra: errata oficial ingerida, `SRC-0004` quando republica a mesma unidade, `SRC-0003` para suas adições, e `SRC-0001` para a base. A divergência de integridade da cópia disponível de `SRC-0004` está registrada em `AMB-008`; as páginas usadas foram conferidas visualmente na edição inglesa de 2023 e não alteram Atributos em relação ao Livro Básico.

## Mapa normativo

| Etapa | Fonte | Regra resumida | Obrigatória? | Orçamento? | Dependência? | Incompleta no draft? | Bloqueia finalização? | Formalização |
|---|---|---|---|---|---|---|---|---|
| Conceito e nome | SRC-0001 p. 139–141, 148; SRC-0004 p. 64 | Define a identidade central; nome pode permanecer vazio apenas no rascunho | sim | não | nenhuma | sim | sim | **formalizada** |
| Tipo de personagem (`kind`) | SRC-0001 p. 139–141; SRC-0003 p. 45–55 | Distingue vampiro de clã, Caitiff, sangue-ralo, carniçal e mortal | sim | não | perfil permitido | sim, inclusive `null` | sim | decisão de domínio aprovada |
| Clã e Senhor | SRC-0001 p. 140–143; SRC-0004 p. 64 | Clã define linhagem e conjunto de Disciplinas; Caitiff e sangue-ralo seguem exceções | condicional | não | `kind` | sim | sim quando aplicável | mapeada |
| Atributos | SRC-0001 p. 136, 144, 155–158; SRC-0004 p. 64 | Distribui os nove valores e calcula Vitalidade e Força de Vontade | sim | distribuição fechada | perfil | sim | sim | **formalizada** |
| Habilidades | SRC-0001 p. 136, 145–147; SRC-0004 p. 64 | Escolhe um de três pacotes de distribuição ou o método detalhado admitido pela fonte | sim | sim | conceito | sim | sim | mapeada |
| Especializações | SRC-0001 p. 136, 145–147, 159; SRC-0004 p. 64 | Algumas Habilidades concedem especialização ao serem adquiridas; há uma escolha livre adicional | sim quando aplicável | concessões | Habilidades | sim | sim | mapeada |
| Disciplinas e poderes | SRC-0001 p. 136, 149–150; SRC-0004 p. 65 | Vampiros recebem distribuição inicial por clã; Caitiff e sangue-ralo possuem exceções | condicional | sim | `kind`, clã | sim | sim | mapeada |
| Tipo de Predador | SRC-0001 p. 136, 150, 175–178; SRC-0004 p. 64 | Aplica pacote de especialização, Disciplina e Vantagens/Defeitos; não se aplica a mortal/carçal e pode faltar a vampiro muito recente | condicional | pacote | `kind`, estágio | sim | depende do perfil | mapeada |
| Vantagens e Defeitos | SRC-0001 p. 136, 150–151, 179–195; SRC-0004 p. 65 | Orçamento-base separado dos efeitos do Predador; sangue-ralo possui pareamento adicional | sim | sim | `kind`, Predador | sim | sim | mapeada |
| Convicções e Pilares | SRC-0001 p. 137, 146, 172–173; SRC-0004 p. 65, 212 | `SRC-0004` permite zero a três; cada Convicção escolhida exige um Pilar associado | não para zero; pares obrigatórios se houver | cardinalidade | nenhuma | sim | não por ausência; sim por par inconsistente | **formalizada** |
| Humanidade | SRC-0001 p. 137, 149, 236–241; SRC-0004 p. 65 | Base 7, sujeita a Predador e pacote inicial | sim | ajuste | Predador, estágio | sim | sim | mapeada |
| Ambição | SRC-0001 p. 148, 173–174; SRC-0004 p. 65 | Objetivo concreto de longo prazo | sim | não | conceito | sim | sim | **formalizada** |
| Desejo | SRC-0001 p. 148, 174–175; SRC-0004 p. 65 | Objetivo curto e substituível; pode ser escolhido para a sessão | não na criação | não | contexto de jogo | sim | não | **formalizada** |
| Geração e Potência do Sangue | SRC-0001 p. 137, 141, 149, 214–215; SRC-0004 p. 65 | Derivadas do pacote de estágio e da natureza do personagem | sim para vampiro | pacote | `kind`, estágio | sim | sim | mapeada; pacote não implementado |
| Experiência inicial | SRC-0001 p. 137, 151–152; SRC-0004 p. 65 | Neófitos e ancillae recebem XP inicial diferente; crianças da noite não recebem o pacote de XP listado | condicional | XP | estágio | sim | sim após selecionar pacote | mapeada; não implementada |
| Derivados | SRC-0001 p. 136, 144, 157–158; SRC-0004 p. 64 | Vitalidade = Vigor + 3; Força de Vontade = Autocontrole + Determinação | sim | não | Atributos | calculável durante draft | sim | **formalizada** |
| Revisão/finalização | política interna aprovada | Executa validação consolidada do perfil antes de `draft → ready` | sim | consolida anteriores | todas as etapas aplicáveis | draft pode ser inválido | sim | contrato de contexto aprovado; implementação futura |

## Ordem de produto

O corpus apresenta uma ordem de apoio, não uma exigência de persistência separada. O produto revela primeiro Conceito, depois Clã e então Atributos, sempre sobre o mesmo `Character`. Atributos foi implementado antecipadamente por não depender de Clã, Predador ou pacote de idade; isso não altera a ordem apresentada ao usuário.

## Contextos de validação

- `CREATION_STEP`: bloqueia uma escolha que exceda os limites conhecidos da etapa, mas aceita distribuição parcial.
- `CREATION_FINALIZATION`: exige distribuição completa e todas as dependências aplicáveis.
- `ONGOING_EDIT`: não reaplica o orçamento inicial a personagem `ready`.
- `CHRONICLE_BINDING`: reservado para compatibilidade futura com uma Crônica.

## Fora deste incremento

Nenhuma regra de Mesa, Quick Sheet, cena, convite, área de Narrador ou vínculo com Crônica participa deste fluxo.
