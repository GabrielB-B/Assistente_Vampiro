# Etapa Clã da Criação V5 v0.1

**Status:** aprovada para implementação<br>
**Revisão de regra:** `RULE-CREATION-CLAN-001-r1`<br>
**Perfil:** `v5-core-companion-pg-2023-r1`<br>
**Atualização:** 2026-10-31

## 1. Objetivo

Registrar na mesma entidade `Character` a origem vampírica escolhida durante a Criação
Guiada. A etapa não mantém estado paralelo à Ficha.

## 2. Catálogo autoritativo

O catálogo contém:

- 14 clãs: Banu Haqim, Brujah, Gangrel, Hecata, Lasombra, Malkavian, Ministry,
  Nosferatu, Ravnos, Salubri, Toreador, Tremere, Tzimisce e Ventrue;
- duas outras origens: Caitiff e Sangue-Ralo.

Cada clã declara Disciplinas por ID canônico, Perdição, Compulsão, mecânicas e
referências normativas. O catálogo do motor de regras não contém sinopses, arquétipos
ou rótulos de interface. Esses textos vivem em `ClanPresentation` e
`DisciplinePresentation` na camada web: são paráfrases editoriais rastreadas, não
transcrições das fontes.

Caitiff começa sob Suspeita, não compra Status na criação, escolhe duas Disciplinas
quaisquer no padrão 2/1 e avança Disciplinas por novo nível × 6 XP. Sangue-Ralo tem
Potência do Sangue 0, não possui Disciplinas intrínsecas, manifesta temporariamente
uma Disciplina pela Ressonância do sangue ingerido, recebe de uma a três Qualidades e
o mesmo número de Defeitos Sangue-Ralo e não escolhe Tipo de Predador na criação.
Esta tela explica essas consequências, mas delega as escolhas às etapas autoritativas.

A Perdição de cada clã preserva no catálogo a relação estrutural
`Gravidade da Perdição <- Potência do Sangue` (`SRC-0001`, p. 215–216). Esta etapa não
atribui nem calcula a gravidade: a política declara `HISTORY_AND_BLOOD` como etapa de
resolução, quando a Potência do Sangue autoritativa existir. O componente nunca inventa
um valor provisório.

## 3. Persistência

| Escolha | `Character.kind` | `Character.clan_id` |
|---|---|---|
| qualquer um dos 14 clãs | `CLAN_VAMPIRE` | ID canônico `clan:*` |
| Caitiff | `CAITIFF` | `null` |
| Sangue-Ralo | `THIN_BLOOD` | `null` |

A escrita exige proprietário autorizado, personagem em rascunho e `expectedVersion`
atual. Uma alteração bem-sucedida incrementa `version` e cria auditoria
`character.creation.clan.updated`.

## 4. Comportamento da etapa

- sem escolha persistida, a etapa está incompleta;
- uma origem do catálogo torna a etapa completa;
- `Continuar` só navega para Atributos depois da confirmação do servidor;
- recarregar a página recupera a escolha persistida;
- `Ver ficha até agora` projeta a mesma escolha na Ficha canônica;
- Caitiff e Sangue-Ralo não recebem Perdição, Compulsão ou símbolo de clã inventados;
- a Gravidade da Perdição dos clãs permanece derivada da Potência do Sangue e adiada
  explicitamente para `História & Sangue`;
- escolhas de Disciplinas para Caitiff, Alquimia Sangue-Ralo, Qualidades e Defeitos
  permanecem para etapas futuras, com suas consequências já explicadas nesta etapa;
- Geração e Humanidade estão fora desta etapa.

## 5. Fontes

| Recorte | Fonte | Páginas consultadas |
|---|---|---|
| Brujah, Gangrel, Malkavian, Nosferatu, Toreador, Tremere, Ventrue e Caitiff | `SRC-0001` | 65–109 |
| Sangue-Ralo e resumo de Disciplinas | `SRC-0001` | 111–113, 153–155 |
| Ravnos, Salubri e Tzimisce | `SRC-0003` | 7–19 |
| Banu Haqim, Hecata, Lasombra, Ministry e consolidação de criação | `SRC-0004` | 18–67, 124–130 |

`SRC-0004` é a autoridade mecânica quando republica o conteúdo. A terminologia PT-BR
usa primeiro as publicações oficiais traduzidas `SRC-0001` e `SRC-0003`; rótulos ainda
sem edição oficial em português permanecem sob revisão editorial.

## 6. Cenários verificáveis

1. catálogo contém exatamente 14 clãs e duas outras origens, sem IDs repetidos;
2. Toreador persiste como `CLAN_VAMPIRE` e `clan:toreador`;
3. Caitiff persiste como `CAITIFF` e `clan_id = null`;
4. Sangue-Ralo persiste como `THIN_BLOOD` e `clan_id = null`;
5. usuário sem propriedade recebe resposta indistinguível de recurso ausente;
6. versão obsoleta produz conflito e não altera a ficha;
7. recarga devolve a seleção salva;
8. a interface não habilita avanço antes da confirmação da escrita.
