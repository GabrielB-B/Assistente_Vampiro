# Índice da documentação

Este arquivo é a entrada oficial para decisões de produto, design e engenharia.

## Ordem de leitura

### 1. Fundação do produto

1. [Product & Experience Foundation v0.2](<./Product & Experience Foundation v0.2 — Plataforma de Vampiro_ A Máscara.md>)  
   **Status:** referência consolidada.

### 2. Direção visual

2. [Visual Identity & Design Direction v0.1](<./Visual Identity & Design Direction v0.1 — Reference Board & Art Principles.md>)  
   **Status:** direção consolidada para revisão.

3. [Art System & Screen Archetypes v0.2](./art-system-screen-archetypes-v0.2.md)  
   **Status:** proposta revisada que orienta as calibrações.

4. [Reference Board v0.1](./reference-board-v0.1.md)  
   **Status:** consolidado para explorações visuais.

5. [Visual Calibration — Boa noite, Marcus v0.1](./visual-calibration-boa-noite-marcus-v0.1.md)  
   **Status:** direção de experiência aprovada.

### 3. Arquitetura do produto

6. [Product Architecture & Core User Flows v0.1](./product-architecture-core-user-flows-v0.1.md)  
   **Status:** proposta estrutural para validação.

### 4. Planejamento de engenharia

7. [Roadmap de Engenharia v0.1](./roadmap-engenharia-v0.1.md)  
   **Status:** plano de execução atual.

8. [Rules & Content Discovery Plan v0.1](./rules-content-discovery-plan-v0.1.md)  
   **Status:** próxima fase recomendada.

9. [Registro de Decisões](./registro-decisoes.md)  
   **Status:** índice vivo das decisões.

## Templates

- [Template de ADR](./adr/0000-template.md)
- [Template de especificação de regra](./templates/regra-executavel-template.md)

## Artefatos planejados

| Ordem | Documento | Estado |
|---:|---|---|
| 1 | Rules & Content Discovery Report v0.1 | próximo |
| 2 | Domain Model v0.1 | aguardando descoberta de regras |
| 3 | Permissions & Visibility Matrix v0.1 | aguardando Domain Model |
| 4 | Rules Engine Scope v0.1 | aguardando corpus mínimo |
| 5 | Architecture v0.1 | aguardando decisões anteriores |
| 6 | ADRs iniciais | aguardando Architecture v0.1 |
| 7 | Test Strategy v0.1 | planejado |
| 8 | Security & Threat Model v0.1 | planejado |
| 9 | Observability Plan v0.1 | planejado |

## Política de status

| Status | Significado |
|---|---|
| rascunho | material incompleto e ainda exploratório |
| proposta | pronto para discussão e validação |
| aprovado | decisão vigente |
| consolidado | base estável que reúne decisões aprovadas |
| substituído | preservado por histórico, mas não vigente |
| arquivado | não faz mais parte do plano ativo |

## Regra de precedência

Quando dois documentos divergirem:

1. instrução explícita e mais recente aprovada;
2. ADR aceito mais recente;
3. documento de maior versão;
4. documento de data mais recente;
5. registrar a divergência antes da implementação.

Nenhuma divergência relevante deve ser resolvida silenciosamente no código.
