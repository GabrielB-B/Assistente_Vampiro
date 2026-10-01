# Contribuição e governança

## Princípio

Toda mudança deve ser pequena, rastreável, revisável e coerente com os documentos aprovados.

## Fluxo de trabalho

1. partir da branch `main` atualizada;
2. criar branch curta por objetivo;
3. alterar somente o necessário;
4. atualizar documentação afetada;
5. executar verificações e testes relevantes;
6. abrir pull request com contexto, decisão e evidências;
7. integrar somente após os critérios de aceite.

Convenção sugerida de branches:

```text
docs/<assunto>
feat/<capacidade>
fix/<problema>
chore/<manutencao>
```

## Commits

Preferir commits atômicos com mensagem descritiva:

```text
docs: formaliza arquitetura de produto e fluxos principais
feat: adiciona composição básica da parada de dados
fix: impede reroll de dados de fome
```

## Pull requests

Uma pull request deve informar:

- problema ou decisão;
- escopo incluído;
- escopo excluído;
- documentos relacionados;
- testes executados;
- riscos e pendências;
- imagens, quando houver alteração visual.

## Definition of Done

Uma mudança está concluída quando:

- atende aos critérios de aceite;
- possui testes proporcionais ao risco;
- não expõe segredos ou conteúdo sem autorização;
- mantém acessibilidade relevante;
- atualiza documentação e ADRs afetados;
- não introduz duplicação de fonte de verdade;
- pode ser revertida ou migrada de forma conhecida;
- passa nas verificações automatizadas disponíveis.

## Conteúdo e propriedade intelectual

Não versionar:

- livros ou PDFs protegidos;
- traduções integrais sem autorização;
- imagens de artistas usadas apenas como referência;
- chaves, tokens ou credenciais;
- dumps de banco ou dados pessoais.

Ao estruturar uma regra, registrar sempre a proveniência sem copiar mais texto do que o juridicamente permitido.

## Decisões arquiteturais

Decisões de alto impacto devem utilizar o template em:

`documentacao/adr/0000-template.md`

Não reescrever silenciosamente uma decisão aceita. Criar novo ADR que a substitua.
