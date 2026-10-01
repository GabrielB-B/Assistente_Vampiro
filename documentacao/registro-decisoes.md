# Registro de Decisões

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
| DEC-012 | O primeiro corte vertical termina em uma rolagem registrada no log. | Proposta | Product Architecture v0.1 |
| DEC-013 | A arquitetura inicial será avaliada como monólito modular. | Proposta | Product Architecture v0.1 |
| DEC-014 | O Domain Model será precedido por descoberta mínima das regras. | Aceita | Rules Discovery Plan v0.1 |
| DEC-015 | Livros e fontes privadas ficam fora do Git por padrão. | Aceita | Rules Discovery Plan v0.1 |
| DEC-016 | Toda regra executável terá edição e proveniência. | Aceita | Product Foundation v0.2 |

## Pendências que exigirão ADR

- representação de Character em múltiplas Crônicas;
- estilo arquitetural final;
- stack web;
- persistência;
- autenticação;
- autorização;
- realtime;
- idempotência de rolagens;
- versionamento de regras por edição;
- armazenamento de mídia;
- integração com IA;
- estratégia de implantação.

## Regra de manutenção

Ao aceitar, substituir ou rejeitar decisão relevante:

1. atualizar este índice;
2. criar ou atualizar o ADR correspondente;
3. apontar documentos afetados;
4. não apagar o histórico da decisão anterior.
