# Rules Engine

Pacote puro responsável pelas mecânicas aprovadas da Fatia 01 do teste básico.
Ele compõe a parada, distribui os Dados de Fome, valida a Dificuldade, conta
sucessos e críticos e classifica Crítico Bestial ou Falha Bestial.

## API pública

- `prepareBasicTest`: produz a prévia mecânica usada pelo Roll Builder;
- `evaluateBasicTest`: valida as faces conhecidas e produz o resultado completo;
- constantes de revisão: identificam o perfil, as regras e o avaliador usados.

O chamador informa a revisão do perfil, os componentes autorizados, a Fome, a
Dificuldade e, na avaliação, as faces. Totais derivados não são aceitos como
autoridade.

## Limites

Este pacote não:

- sorteia dados;
- acessa banco, rede, variáveis de ambiente ou filesystem;
- conhece HTTP, NestJS, React, Next.js ou Socket.IO;
- autentica ou autoriza pessoas;
- persiste tentativas;
- escolhe consequências narrativas.

Essas fronteiras são verificadas por testes de arquitetura.

## Comandos

Execute a partir da raiz do repositório:

```bash
corepack pnpm --filter @assistente-vampiro/rules-engine lint
corepack pnpm --filter @assistente-vampiro/rules-engine typecheck
corepack pnpm --filter @assistente-vampiro/rules-engine test
corepack pnpm --filter @assistente-vampiro/rules-engine build
```

## Rastreabilidade

- [Contrato do Rules Engine](../../documentacao/04-arquitetura/contratos/rules-engine-v0.1.md)
- [Matriz de testes da Fatia 01](../../documentacao/03-dominio-regras/matriz-testes-fatia-01-v0.1.md)
- [Especificações aprovadas](../../documentacao/03-dominio-regras/especificacoes/fatia-01/README.md)

Os 76 cenários normativos mantêm os mesmos identificadores nos testes. Fixtures
contêm apenas dados mecânicos próprios; livros, OCR e textos integrais não fazem
parte do pacote.
