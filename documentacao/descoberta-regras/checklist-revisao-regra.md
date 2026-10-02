# Checklist de Revisão de Regra

Usar antes de alterar a maturidade de uma regra para `revisada` ou `aprovada`.

## Fonte

- [ ] edição confirmada;
- [ ] ID da fonte (`source_id`) registrado;
- [ ] RuleSetId registrado;
- [ ] versão ou impressão confirmada;
- [ ] capítulo e página registrados;
- [ ] errata procurada;
- [ ] precedência entre fontes resolvida;
- [ ] nenhum texto protegido desnecessário foi copiado para o Git.

## Interpretação

- [ ] intenção da regra descrita em linguagem própria;
- [ ] entradas e saídas explícitas;
- [ ] invariantes explícitas;
- [ ] exceções registradas;
- [ ] termos conferidos no glossário;
- [ ] separação entre texto da regra e decisão de design do sistema.

## Autoridade

- [ ] decisões do jogador identificadas;
- [ ] decisões do Narrador identificadas;
- [ ] automações permitidas identificadas;
- [ ] o sistema não toma decisão narrativa indevida;
- [ ] informações potencialmente secretas classificadas.

## Casos

- [ ] caminho normal;
- [ ] limite inferior;
- [ ] limite superior relevante;
- [ ] entrada inválida;
- [ ] interação com Fome, quando aplicável;
- [ ] exceção ou conflito relevante;
- [ ] faces dos dados fornecidas explicitamente ao avaliador;
- [ ] dados normais e de Fome identificados separadamente;
- [ ] estado anterior, dificuldade e resultado esperado registrados;
- [ ] custo, próximas ações e decisão do Narrador registrados;
- [ ] geração aleatória separada da avaliação da regra.

## Domínio

Para cada item, `não aplicável` ou `nenhum candidato` é uma resposta válida quando acompanhada de justificativa curta.

- [ ] entidades candidatas registradas, quando aplicável;
- [ ] Value Objects candidatos registrados, quando aplicável;
- [ ] agregado responsável sugerido, quando aplicável;
- [ ] evento de domínio candidato registrado, quando aplicável;
- [ ] necessidade de persistência de domínio registrada, quando aplicável;
- [ ] necessidade de auditoria operacional registrada separadamente, quando aplicável;
- [ ] nenhuma escolha de framework vazou para a regra.

## Rastreabilidade

- [ ] catálogo atualizado;
- [ ] especificação vinculada;
- [ ] casos identificados;
- [ ] revisão humana registrada;
- [ ] pendências restantes explícitas.
