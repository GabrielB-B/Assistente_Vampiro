# RULE-ROLL-001 — Formação da parada de dados

**Maturidade:** aprovada<br>
**Implementação:** não iniciada<br>
**Edição:** V5<br>
**ruleSetProfileId:** `v5-core-companion-pg-2023`<br>
**ruleSetProfileRevisionId:** `v5-core-companion-pg-2023-r1`<br>
**RuleRevisionId:** `RULE-ROLL-001-r1`<br>
**Categoria:** parada de dados<br>
**Responsável pela revisão:** responsável do produto<br>
**Revisão reaberta:** 8 de outubro de 2026<br>
**Revisão aprovada:** 8 de outubro de 2026

---

## 1. Resumo simples

Uma rolagem começa quando o Narrador entende que existe dúvida, risco ou pressão suficiente para pedir um teste.

O jogador diz o que o personagem quer fazer. O Narrador escolhe as Características adequadas. Na maior parte dos casos, a parada é formada por:

```text
Atributo + Habilidade
```

Alguns testes usam:

```text
Atributo + Disciplina
```

Os valores marcados na ficha são somados. Essa soma é a parada base do personagem.

Exemplo próprio: se o personagem possui Atributo 3 e Habilidade 2, sua parada base é de 5 dados.

Essa ainda não é a rolagem completa. Antes de lançar os dados, o sistema precisa considerar modificadores, Dificuldade e Fome.

## 2. O fluxo completo de um teste

Para quem está jogando, a rolagem deve parecer um processo único e claro:

```text
o jogador descreve a ação
→ o Narrador decide se é necessário rolar
→ o Narrador escolhe as Características
→ o sistema soma os valores da ficha
→ modificadores aplicáveis ajustam a parada ou a Dificuldade
→ a Dificuldade é informada, sugerida ou mantida oculta
→ a Fome substitui parte dos dados normais
→ os dados normais e de Fome são rolados separadamente
→ o sistema conta sucessos e críticos
→ o resultado é comparado com a Dificuldade
→ o sistema identifica vitória, falha, Crítico Bestial ou Falha Bestial
→ o Narrador descreve o que acontece na história
```

Na tela, esse processo será contínuo. No código, cada parte continuará em uma regra pequena. Isso permite testar a formação da parada, a Fome, a Dificuldade e os resultados sem misturar responsabilidades.

## 3. Proveniência

| Campo | Valor |
|---|---|
| fonte principal | `SRC-0001` |
| obra | Vampiro: A Máscara — Livro Básico |
| versão | 1ª impressão em português, julho de 2021 |
| idioma | PT-BR oficial da edição disponível |
| capítulo | Regras — Testes Simples, Paradas, Especializações, Trilhas, Dificuldades, Modificadores e Resultados |
| páginas impressas | 117–123 |
| páginas do PDF | 119–125 |
| complemento sobre Fome | páginas impressas 205–208; páginas do PDF 207–210 |
| cotejo visual | refeito em 8 de outubro de 2026 |
| errata aplicável | nenhuma catalogada no corpus atual |
| fontes de precedência consultadas | `SRC-0003` e `SRC-0004` |
| atualização identificada | nenhuma substituição do teste básico encontrada no Companion ou Players Guide |

Os PDFs foram conferidos visualmente. As extrações privadas serviram apenas para localizar conteúdo. Este documento usa redação própria.

## 4. Quando pedir uma rolagem

Nem toda ação precisa de dados. O Narrador pode resolver diretamente uma ação simples ou sem risco relevante.

O teste costuma ser apropriado quando:

- existe incerteza sobre o resultado;
- a ação acontece sob pressão;
- há risco ou oposição;
- falhar produz uma consequência relevante;
- a rolagem ajuda a história a avançar.

A decisão de pedir ou dispensar o teste pertence ao Narrador. O sistema pode organizar a rolagem, mas não deve decidir sozinho se uma situação narrativa merece dados.

## 5. Como formar a parada base

### Combinação mais comum

A forma mais comum é somar um Atributo e uma Habilidade.

```text
parada base = valor do Atributo + valor da Habilidade
```

### Atributo e Disciplina

Quando uma regra de poder pedir essa combinação, soma-se um Atributo e uma Disciplina.

```text
parada base = valor do Atributo + valor da Disciplina
```

### Outras combinações previstas

O livro também permite situações menos comuns:

- um único Atributo;
- dois Atributos;
- uma Habilidade com valor zero, usando apenas o outro componente;
- uma trilha, usando seu valor atual quando a regra pedir;
- combinações específicas definidas por outra regra publicada.

O Narrador escolhe a combinação. O sistema não procura automaticamente a maior parada da ficha.

### Especializações e modificadores

Uma Especialização aplicável pode acrescentar um dado. Outras circunstâncias podem aumentar ou reduzir a parada, ou alterar a Dificuldade.

Esses ajustes acontecem depois da soma base e precisam aparecer claramente na tela. Nenhum bônus ou penalidade será aplicado de forma escondida.

Mesmo após penalidades, uma parada que deva ser rolada não fica abaixo de um dado.

## 6. Dificuldade

A Dificuldade informa quantos sucessos são necessários. Ela não muda o número mínimo que representa sucesso em cada dado: resultados de 6 a 10 continuam sendo sucessos.

Se o total de sucessos for igual ou maior que a Dificuldade, a ação é bem-sucedida. Se for menor, a ação falha. A quantidade que ultrapassa a Dificuldade é a margem do resultado.

O Livro Básico apresenta esta escala:

| Dificuldade | Leitura para a mesa | Sucessos necessários |
|---:|---|---:|
| 1 | fácil | 1 |
| 2 | rotineira | 2 |
| 3 | moderada | 3 |
| 4 | desafiadora | 4 |
| 5 | difícil | 5 |
| 6 | muito difícil | 6 |
| 7 ou mais | quase impossível | 7 ou mais |

Pela regra do livro, o Narrador define a Dificuldade e pode mantê-la em segredo.

No produto, a preparação da rolagem terá um seletor de Dificuldade. Durante uma sessão narrada:

- o Narrador possui a decisão final;
- o jogador pode preencher ou sugerir um valor quando tiver permissão para preparar a rolagem;
- o Narrador pode confirmar ou alterar a Dificuldade e, em uma versão futura, ocultá-la;
- uma rolagem manual ou sem Narrador pode usar o valor escolhido pelo próprio jogador.

A validação da Dificuldade e seus estados de visibilidade pertencem a `RULE-DIFF-001` e às permissões do caso de uso.

## 7. Como a Fome entra na parada

A Fome não acrescenta dados e não reduz a quantidade total. Ela substitui dados normais por Dados de Fome.

Exemplo próprio:

```text
parada preparada: 6 dados
Fome atual: 2
resultado: 4 dados normais + 2 Dados de Fome
```

Se a Fome for maior que a parada, todos os dados disponíveis serão Dados de Fome. Uma parada de 3 dados com Fome 5 continua tendo 3 dados.

Essa separação é obrigatória porque a origem das faces altera o resultado:

- cada resultado de 6 a 10 conta como sucesso;
- cada par de resultados 10 forma um crítico e vale quatro sucessos no total, em vez de dois;
- uma vitória crítica que inclua pelo menos um 10 em Dado de Fome é um `Crítico Bestial`;
- uma rolagem fracassada que contenha ao menos um resultado 1 em Dado de Fome é uma `Falha Bestial`;
- um 10 isolado em Dado de Fome continua sendo apenas um sucesso;
- um resultado 1 em Dado de Fome não cria Falha Bestial quando o teste foi bem-sucedido.

Não existe, na terminologia oficial adotada, uma categoria genérica chamada “sucesso bestial”. As classificações relevantes são `Crítico Bestial` e `Falha Bestial`.

`RULE-HUNGER-001` calcula quantos dados são de Fome. `RULE-MESSY-001` e `RULE-BESTIAL-001` classificam as consequências depois que as faces forem conhecidas.

## 8. Regras relacionadas que não entram no primeiro corte

A releitura também confirmou regras importantes que não devem ser esquecidas, mas que serão especificadas depois:

- vitória automática, quando o Narrador decide não rolar em uma situação permitida;
- vencer a um custo, quando há algum sucesso, mas não o bastante para alcançar a Dificuldade;
- rerrolagem de dados comuns com Força de Vontade;
- disputas contra outro personagem;
- Pegar a Metade;
- trabalho em equipe;
- testes repetidos;
- Checagens de Sangue e outras checagens de um dado.

Elas ficam fora desta primeira entrega para não tornar o fluxo inicial grande demais. Cada uma entrará com fonte, cenários e revisão próprios.

## 9. O que pertence à RULE-ROLL-001

Esta regra possui uma responsabilidade específica: receber componentes já escolhidos e calcular a parada base.

### Incluído

- ler os valores efetivos entregues pela ficha;
- somar um ou mais componentes autorizados;
- aceitar valor zero sem criar penalidade adicional;
- aplicar o piso de um dado quando a rolagem deve acontecer;
- preservar a origem de cada valor;
- permitir paradas acima de dez dados.

### Tratado por outras regras

| Assunto | Responsável |
|---|---|
| Especializações e modificadores | futura regra de modificadores |
| quantidade de dados normais e de Fome | `RULE-HUNGER-001` |
| Dificuldade e sua validação | `RULE-DIFF-001` |
| contagem de sucessos, falha e margem | `RULE-RESULT-001` |
| pares de resultados 10 | `RULE-CRIT-001` |
| Crítico Bestial | `RULE-MESSY-001` |
| Falha Bestial | `RULE-BESTIAL-001` |
| ordem completa da resolução | `RULE-ROLLFLOW-001` |

Separar essas responsabilidades não separa a experiência do jogador. A aplicação coordena todas elas antes de apresentar o resultado.

## 10. Entradas da formação da parada

| Entrada | Tipo conceitual | Obrigatória | Regra |
|---|---|---:|---|
| `components` | lista ordenada de componentes | sim | pelo menos um componente |
| `componentId` | identificador da origem | sim | aponta para a ficha ou contexto autorizado |
| `componentKind` | tipo controlado | sim | Atributo, Habilidade, Disciplina, trilha ou tipo publicado |
| `effectiveValue` | inteiro | sim | zero ou maior |
| `reason` | descrição curta ou código | sim | explica por que o valor participa |
| `ruleSetProfileRevisionId` | identificador imutável | sim | revisão publicada e compatível |

O valor efetivo já considera o estado válido da ficha. A regra não acessa o banco e não relê o personagem.

## 11. Saídas da formação da parada

| Saída | Significado |
|---|---|
| `rawPoolSize` | soma direta dos componentes |
| `basePoolSize` | soma após aplicar o mínimo de um dado |
| `appliedComponents` | valores e origens usados no cálculo |
| `floorApplied` | informa se o mínimo de um dado foi necessário |
| `appliedRuleRevisionId` | revisão mecânica usada |

`basePoolSize` ainda não é o resultado do teste. Ele segue para modificadores, Fome, rolagem e comparação com a Dificuldade.

## 12. Invariantes

1. Os valores recebidos são somados sem releitura da ficha.
2. Habilidade zero não causa penalidade extra.
3. Uma parada que deva ser rolada possui ao menos um dado.
4. A regra não cria um teto artificial de dez dados.
5. Mudar a ordem dos componentes não muda o total.
6. A mesma entrada e a mesma revisão produzem a mesma saída.
7. Todo componente preserva origem e justificativa.
8. Dificuldade e Fome não alteram a soma base.
9. A rolagem apresentada ao usuário não pode ignorar as etapas posteriores de Dificuldade e Fome.

## 13. Cenários da formação da parada

| ID | Componentes | Resultado esperado |
|---|---|---|
| `RULE-ROLL-001-T01` | Atributo 3 + Habilidade 2 | parada base 5 |
| `RULE-ROLL-001-T02` | Atributo 4 + Habilidade 0 | parada base 4, sem penalidade extra |
| `RULE-ROLL-001-T03` | Atributo 3 | parada base 3 |
| `RULE-ROLL-001-T04` | Atributo 2 + Atributo 3 | parada base 5 |
| `RULE-ROLL-001-T05` | Característica 0 | parada base 1; piso aplicado |
| `RULE-ROLL-001-T06` | componentes efetivos 6 + 5 | parada base 11; sem teto artificial |
| `RULE-ROLL-001-T07` | lista vazia | `InvalidPoolComposition` |
| `RULE-ROLL-001-T08` | componente com valor -1 | `InvalidPoolComponentValue` |

O cenário T06 usa valores abstratos apenas para provar que esta função não limita a soma. Os limites de cada Característica são validados antes, pela ficha e pelo perfil de regras.

## 14. Exemplo do fluxo integrado

Este exemplo mostra como as regras se conectam. Ele não transfere todas as responsabilidades para `RULE-ROLL-001`.

```text
1. O Narrador pede Atributo 3 + Habilidade 2.
2. RULE-ROLL-001 forma uma parada base de 5 dados.
3. Nenhum modificador é aplicado.
4. A Dificuldade selecionada é 3.
5. O personagem possui Fome 2.
6. RULE-HUNGER-001 divide a parada em 3 dados normais e 2 Dados de Fome.
7. O adaptador fornece as cinco faces, mantendo a origem de cada dado.
8. As regras de resultado contam sucessos, críticos e ocorrências bestiais.
9. O resultado é comparado com a Dificuldade 3.
10. O sistema explica o cálculo e o Narrador descreve a consequência.
```

## 15. Decisões humanas e comportamento do sistema

### Jogador

- descreve a ação e a abordagem;
- pode sugerir a combinação de Características;
- escolhe a Dificuldade em rolagens manuais ou propõe um valor quando o fluxo permitir;
- vê de onde vieram os dados da parada.

### Narrador

- decide se haverá teste;
- escolhe as Características autoritativas;
- define ou confirma a Dificuldade durante uma sessão narrada;
- pode manter a Dificuldade oculta;
- interpreta a consequência na história.

### Sistema

- lê os valores autorizados da ficha;
- mostra a soma e todos os ajustes;
- separa dados normais e de Fome;
- mantém a origem das faces;
- calcula e explica o resultado;
- não escolhe a ação, a combinação ou a consequência narrativa sozinho.

## 16. Implicações para a interface

A preparação da rolagem precisa mostrar, sem excesso de informação:

- Atributo escolhido e valor;
- Habilidade ou Disciplina escolhida e valor;
- Especialização e modificadores, quando existirem;
- total da parada antes da Fome;
- Fome atual e quantidade de Dados de Fome;
- seletor de Dificuldade;
- indicação de Dificuldade aberta ou oculta;
- responsável pela confirmação da rolagem.

O botão de rolar só deve ser habilitado quando a combinação, a Dificuldade exigida e a alocação de Fome forem válidas. O usuário não precisa conhecer os nomes internos das regras.

## 17. Evoluções encaminhadas

- `RULE-DIFF-001` detalha seleção, validação e visibilidade da Dificuldade;
- Especializações e modificadores receberão uma regra própria, sem campo genérico difícil de auditar;
- Dificuldade secreta permanece fora do primeiro alpha.

Nenhuma dúvida bloqueante permanece sobre a soma básica ou sua integração no primeiro fluxo.

## 18. Dependências

- [RULE-HUNGER-001 — Dados de Fome na rolagem](./rule-hunger-001-participacao-dados-fome.md);
- [Rules Engine Scope v0.1](../../../04-arquitetura/escopo-rules-engine-v0.1.md);
- [Permissions & Visibility Matrix v0.1](../../../04-arquitetura/permissoes-visibilidade-v0.1.md);
- [Glossário v0.1](../../glossario-v0.1.md);
- [Linha Normativa v0.1](../../linha-normativa-v0.1.md).

## 19. Checklist de revisão

- [x] fluxo básico relido nas páginas 117–123;
- [x] efeitos da Fome relidos nas páginas 205–208;
- [x] páginas conferidas visualmente;
- [x] tabela de Dificuldade registrada em linguagem própria;
- [x] diferença entre parada base e rolagem completa esclarecida;
- [x] impacto dos Dados de Fome esclarecido;
- [x] responsabilidades do jogador, Narrador e sistema definidas;
- [x] comportamento esperado da interface registrado;
- [x] cenários da soma básica preservados;
- [x] revisão humana ampliada concluída.

## 20. Histórico

| Data | Mudança | Responsável |
|---|---|---|
| 2026-10-08 | primeira especificação após cotejo visual | engenharia e revisão de regras |
| 2026-10-08 | perfil confirmado e primeira versão aprovada | responsável do produto |
| 2026-10-08 | revisão reaberta para explicar o teste completo, Dificuldade, Fome e interface | responsável do produto e engenharia |
| 2026-10-08 | revisão ampliada aprovada | responsável do produto |
