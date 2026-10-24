# ADR-0006 — Estratégia multiedição

**Status:** aceita<br>
**Data:** 2026-10-23<br>
**Responsáveis:** Gabriel Bomfim Bispo e engenharia do projeto<br>
**Substitui:** nenhum<br>
**Substituído por:** nenhum

## Contexto

O primeiro produto executável usa regras da V5, mas a visão inclui edições
anteriores e a V6. Tratar a V5 como estrutura definitiva criaria migrações caras;
tentar implementar todas as edições agora aumentaria o escopo antes de o fluxo
principal estar validado. As diferenças não se limitam a rótulos: conceitos,
composições e mecânicas podem mudar entre edições e fontes.

O projeto já separa identidade da regra, revisão mecânica, localização, perfil de
regras e revisão publicada. É necessário tornar explícito como essa base será
usada para crescer sem reescrever o histórico das Crônicas.

## Drivers da decisão

- entregar valor cedo com uma linha de regras conhecida;
- preservar resultados históricos e proveniência;
- permitir evolução gradual sem condicionais dispersas;
- respeitar diferenças reais entre edições;
- controlar escopo, conteúdo protegido e fontes ainda provisórias.

## Opções consideradas

### V5 como modelo definitivo

É simples no curto prazo, mas força outras edições a caberem em conceitos da V5
e transfere o custo para migrações futuras.

### Modelo universal pelo menor denominador comum

Parece reutilizável, porém empobrece cada edição, cria campos vagos e esconde
diferenças mecânicas importantes.

### Aplicações separadas por edição

Isola regras, mas duplica identidade, Crônicas, segurança, operação e experiência,
além de fragmentar os usuários.

### Núcleo comum com perfis e revisões por edição

Mantém capacidades compartilhadas no domínio central e isola diferenças em
perfis, módulos, revisões e adapters explícitos. Exige disciplina de modelagem,
mas acompanha a arquitetura já aprovada.

## Decisão

Adotar núcleo comum com perfis e revisões por edição.

1. A V5 é a primeira e, por enquanto, a única edição com regras executáveis.
2. Cada `RuleSetProfileRevision` é uma composição publicada e imutável de edição,
   fontes, módulos e revisões mecânicas.
3. Cada Crônica fixa uma revisão do perfil. Atualizações nunca alteram uma
   Crônica histórica silenciosamente.
4. Resultados históricos registram revisão do perfil, das regras e do avaliador.
5. Conceitos só compartilham identidade canônica quando sua semântica for
   equivalente. Diferenças reais recebem modelos ou adapters explícitos.
6. Condicionais de edição não podem ficar dispersas por controllers, casos de
   uso, repositórios ou componentes visuais.
7. Migração entre edições será um caso de uso explícito, assistido e auditável,
   com relatório do que foi convertido, preservado ou exige decisão humana.
8. Edições anteriores entram em cortes próprios depois da validação do fluxo V5.
9. A V6 só recebe perfil executável quando a fonte usada estiver estável,
   rastreável e juridicamente autorizada; material preliminar é sempre provisório.

## Consequências positivas

- a entrega V5 continua focada;
- novas edições não exigem duplicar a plataforma;
- Crônicas e rolagens permanecem reproduzíveis;
- diferenças mecânicas ficam visíveis e testáveis;
- a proveniência jurídica e editorial pode ser tratada por revisão.

## Consequências negativas e trade-offs

- perfis, revisões e adapters acrescentam trabalho de modelagem;
- não haverá conversão automática perfeita entre edições;
- cada edição exigirá corpus, contratos e matrizes de teste próprios;
- abstrações só poderão ser extraídas depois de equivalência comprovada.

## Riscos e mitigação

| Risco | Probabilidade | Impacto | Mitigação |
|---|---:|---:|---|
| abstração prematura | média | alto | implementar apenas capacidades exigidas pelo corte V5 atual |
| condicionais dispersas | média | alto | testes de arquitetura e composição por perfil/adapters |
| mudança retroativa | baixa | alto | revisões publicadas imutáveis e IDs gravados no histórico |
| regra provisória tratada como definitiva | média | alto | estado provisório explícito e bloqueio de publicação executável |
| conteúdo sem licença | média | alto | proveniência obrigatória e conteúdo privado fora do Git |

## Evidências e referências

- Product & Experience Foundation v0.2, seção 75;
- Modelo de Domínio v0.1, `RuleSetProfile` e `RuleRevision`;
- Rules Engine Scope v0.1;
- contrato atual `v5-core-companion-pg-2023-r1`;
- DEC-016, DEC-023, DEC-024, DEC-027 e DEC-040.

## Critério de revisão

Reavaliar antes do primeiro corte executável de uma edição diferente da V5 ou se
uma regra não puder ser isolada pelos limites definidos aqui.

## Plano de migração ou reversão

Não há dados reais a migrar agora. O código V5 existente permanece como a primeira
implementação de perfil. Uma futura substituição desta estratégia exigirá nova ADR
e migração explícita de perfis, preservando IDs históricos e seus avaliadores.
