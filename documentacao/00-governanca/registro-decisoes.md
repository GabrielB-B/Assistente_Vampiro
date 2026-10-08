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

## Pendências que exigirão ADR

- evolução futura para Personagem em múltiplas Crônicas, caso a DEC-026 precise ser substituída;
- escolha da biblioteca de acesso a dados após a prova técnica;
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
