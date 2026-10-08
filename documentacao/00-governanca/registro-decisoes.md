# Registro de Decisões

**Status:** consolidado<br>
**Data de revisão:** 8 de outubro de 2026

Índice resumido das decisões vigentes e propostas. ADRs futuros fornecerão contexto, alternativas e consequências para decisões arquiteturais de alto impacto.

## Estados

- **Aceita:** orienta o trabalho atual.
- **Proposta:** hipótese a validar antes da implementação.
- **Substituída:** preservada apenas para histórico.

## Decisões

| ID | Decisão | Estado | Fonte principal |
|---|---|---|---|
| DEC-001 | O personagem é o centro da experiência do jogador. | Aceita | Product Foundation v0.2 |
| DEC-002 | Jogador e Narrador são papéis por Crônica, não tipos de conta. | Aceita | Product Foundation v0.2 |
| DEC-003 | Personagem pode existir sem Crônica. | Aceita | Product Foundation v0.2 |
| DEC-004 | Mesa é uma superfície persistente e centrada na cena. | Aceita | Product Foundation v0.2 |
| DEC-005 | Consultas rápidas abrem em camadas e retornam ao contexto anterior. | Aceita | Product Architecture v0.1 |
| DEC-006 | Biblioteca explica, Rules Engine executa e SIRE interpreta. | Aceita | Product Foundation v0.2 |
| DEC-007 | IA é opcional e não protege segredos. | Aceita | Product Foundation v0.2 |
| DEC-008 | Autorização filtra dados antes da recuperação e antes da IA. | Aceita | Product Foundation v0.2 |
| DEC-009 | A primeira versão não será um VTT tático. | Aceita | Product Foundation v0.2 |
| DEC-010 | Cada tela possui uma voz dominante. | Aceita | Art System v0.2 |
| DEC-011 | A direção “Boa noite, Marcus” está aprovada como calibração. | Aceita | Visual Calibration v0.1 |
| DEC-012 | O primeiro corte vertical persiste um `RollAttempt`, cria um Evento de Sessão separado que o referencia e projeta o resultado autorizado no Feed da Mesa. | Aceita | Product Architecture v0.1 |
| DEC-013 | A arquitetura inicial será um monólito modular. | Aceita | Product Architecture v0.1 e Modelo de Domínio v0.1 |
| DEC-014 | O Domain Model será precedido por descoberta mínima das regras. | Aceita | Rules Discovery Plan v0.1 |
| DEC-015 | Livros e fontes privadas ficam fora do Git por padrão. | Aceita | Rules Discovery Plan v0.1 |
| DEC-016 | Toda regra executável terá edição e proveniência. | Aceita | Product Foundation v0.2 |
| DEC-017 | Clareza para humanos prevalece sobre esperteza técnica. | Aceita | Padrões de Qualidade de Engenharia v0.1 |
| DEC-018 | Nenhuma regra candidata será implementada antes de fonte, revisão e casos rastreáveis. | Aceita | Área de Trabalho de Rules Discovery v0.1 |
| DEC-019 | Participação do Usuário e Vínculo de Personagem são relações distintas. | Aceita | Product Architecture v0.1 |
| DEC-020 | Resultado de Rolagem, Evento de Sessão, Feed da Mesa e Trilha de Auditoria são conceitos distintos. | Aceita | Product Architecture v0.1 |
| DEC-021 | Cada tentativa de rolagem confirmada é imutável e persistida antes da apresentação; reroll futuro cria uma tentativa vinculada. | Aceita | Product Architecture v0.1 |
| DEC-022 | Chat é a capacidade de entrada de mensagens; Feed da Mesa é a linha do tempo unificada autorizada. | Aceita | Product Architecture v0.1 |
| DEC-023 | Crônicas persistem o perfil fechado `v5-core-companion-pg-2023`; alterações futuras criam outro perfil, sem mudar partidas históricas. | Aceita | Linha Normativa v0.1 e Modelo de Domínio v0.1 |
| DEC-024 | Identidade da regra, revisão mecânica e localização são conceitos separados. | Aceita | Modelo de Domínio v0.1 |
| DEC-025 | Tipos de personagem são compostos por capacidades, sem hierarquia rígida de classes. | Aceita | Modelo de Domínio v0.1 |
| DEC-026 | Na v0.1, cada Personagem possui no máximo um Vínculo de Personagem ativo; outra Crônica exige cópia explícita. | Aceita | Modelo de Domínio v0.1 |
| DEC-027 | O runtime usa especificações próprias e não depende de PDFs nem de extrações integrais. | Aceita | Linha Normativa v0.1 e Modelo de Domínio v0.1 |
| DEC-028 | A stack inicial será Next.js 16 e NestJS 12 em monorepo TypeScript com pnpm e Turborepo. | Aceita | ADR-0001 e Opções Tecnológicas v0.1 |
| DEC-029 | A infraestrutura será portável, com PostgreSQL 18 como fonte de verdade e sem acesso direto do frontend ao banco. | Aceita | ADR-0001, ADR-0002 e Architecture v0.1 |
| DEC-030 | Uma alpha técnica validará o caminho de maior risco antes do MVP de playtest. | Aceita | Escopo do Alpha Técnico v0.1 |
| DEC-031 | A biblioteca de acesso a dados só será escolhida após prova comparativa e ADR próprio. | Aceita | Opções Tecnológicas v0.1 |
| DEC-032 | O primeiro MVP terá Feed de eventos e mensagens do sistema, sem chat livre integrado. | Aceita | Escopo do Alpha Técnico v0.1 e Architecture v0.1 |
| DEC-033 | Estado, Evento de Sessão e outbox são persistidos na mesma transação antes de qualquer publicação realtime. | Aceita | ADR-0002 e Architecture v0.1 |
| DEC-034 | Narrador cria NPCs, mas não cria Personagem de Jogador em nome de outra Conta na v0.1. | Aceita | Permissions & Visibility Matrix v0.1 |
| DEC-035 | Alterações permanentes em Personagem alheio exigem aceite explícito do proprietário. | Aceita | Permissions & Visibility Matrix v0.1 |
| DEC-036 | Liberar Vínculo durante Crônica ativa exige solicitação do proprietário e confirmação do Narrador; o histórico é preservado. | Aceita | Permissions & Visibility Matrix v0.1 |
| DEC-037 | O alpha permite rolagem compartilhada com a Crônica ou privada do Narrador; públicos mais granulares ficam posteriores. | Aceita | Permissions & Visibility Matrix v0.1 |
| DEC-038 | Administrador da plataforma não recebe acesso narrativo por padrão. | Aceita | Permissions & Visibility Matrix v0.1 |
| DEC-039 | O Rules Engine será puro e determinístico; recebe faces e revisões explícitas e não acessa framework, banco, rede, corpus ou IA. | Aceita | Rules Engine Scope v0.1 |
| DEC-040 | A primeira revisão imutável do perfil `v5-core-companion-pg-2023` será identificada como `v5-core-companion-pg-2023-r1`. | Aceita | aprovação da RULE-ROLL-001 |
| DEC-041 | A preparação da rolagem terá seleção de Dificuldade; em sessão narrada, o Narrador mantém a decisão final e pode ocultar o valor. | Aceita | revisão ampliada da RULE-ROLL-001 |
| DEC-042 | A Fome usada na rolagem vem do estado autorizado da ficha e não pode ser editada livremente no Roll Builder. | Aceita | RULE-HUNGER-001 |
| DEC-043 | O primeiro alpha exige Dificuldade visível; Dificuldade secreta fica documentada para uma evolução posterior. | Aceita | Rules Engine Scope v0.1 e RULE-DIFF-001 |
| DEC-044 | A contagem do bônus crítico acontece antes da comparação final com a Dificuldade; `RULE-RESULT-001` consome a saída de `RULE-CRIT-001`. | Aceita | Livro Básico, p. 120–121; RULE-CRIT-001 |
| DEC-045 | A rerrolagem com Força de Vontade terá regra e tentativa próprias: poderá substituir até três dados normais, nunca Dados de Fome, e exigirá nova avaliação completa sem sobrescrever a tentativa inicial. | Aceita | Livro Básico, p. 122 e 158; futura RULE-WILL-001 |
| DEC-046 | Crítico Bestial preserva vitória, sucessos e margem; sua consequência é uma decisão humana registrada separadamente da classificação mecânica. | Aceita | Livro Básico, p. 207; Companion, p. 62; RULE-MESSY-001 |
| DEC-047 | Uma falha com sucessos e resultado 1 de Fome preserva simultaneamente Falha Bestial e elegibilidade para Vencer a um Custo; a futura regra de custo comporá as consequências sem apagar a classificação. | Aceita | Livro Básico, p. 121 e 207; RULE-BESTIAL-001 |
| DEC-048 | O teste básico executa as oito revisões aprovadas em ordem determinística; sorteio, persistência, publicação e consequências narrativas permanecem fora do Rules Engine. | Aceita | RULE-ROLLFLOW-001 e Rules Engine Scope v0.1 |
| DEC-049 | Kysely 0.29.6 com `pg` 8.23.1 será a biblioteca inicial de acesso a dados, restrita aos adapters e migrações. | Aceita | ADR-0004 e Resultado da Prova de Persistência v0.1 |
| DEC-050 | Novos identificadores internos persistidos serão UUIDv7 gerados pela aplicação por meio de uma porta testável; ordem de negócio, idempotência e datas permanecem explícitas. | Aceita | ADR-0005 |
| DEC-051 | O projeto usará `main` estável e branches curtas por tarefa; `develop` só será criada se releases paralelos ou homologação permanente justificarem seu custo. | Aceita | Fluxo Git v0.1 |

## Pendências que exigirão ADR

- evolução futura para Personagem em múltiplas Crônicas, caso a DEC-026 precise ser substituída;
- autenticação;
- autorização;
- detalhamento técnico do versionamento de regras por edição;
- armazenamento de mídia;
- integração com IA;
- estratégia de implantação.

## Regra de manutenção

Ao aceitar, substituir ou rejeitar decisão relevante:

1. atualizar este índice;
2. criar ou atualizar o ADR correspondente;
3. apontar documentos afetados;
4. não apagar o histórico da decisão anterior.
