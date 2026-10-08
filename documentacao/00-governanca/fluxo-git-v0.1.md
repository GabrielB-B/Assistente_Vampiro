# Fluxo Git v0.1

**Status:** aprovado<br>
**Data:** 8 de outubro de 2026<br>
**Escopo:** branches, commits, revisão e publicação no GitHub

## Objetivo

Manter um histórico legível, proteger a `main` e permitir que cada tarefa seja revisada sem criar branches permanentes desnecessárias.

## Modelo adotado

O projeto usará GitHub Flow:

```text
main estável
  └── branch curta da tarefa
        ├── commits coerentes
        ├── validação local
        └── pull request para main
```

A branch `develop` não será criada agora. Ela adicionaria outra linha de integração, merges extras e risco de divergência para uma equipe pequena. Essa decisão será revista somente se o projeto passar a manter releases paralelos ou um ambiente permanente de homologação que não possa acompanhar a `main`.

## Responsabilidade das branches

### `main`

- contém somente entregas revisadas e reproduzíveis;
- deve permanecer em condição de build e teste;
- não recebe trabalho incompleto;
- não recebe `push --force`;
- será protegida por regras do GitHub quando a primeira CI estiver disponível.

### Branches de tarefa

São curtas, possuem um objetivo e são removidas depois da integração.

| Prefixo | Uso | Exemplo |
|---|---|---|
| `docs/` | documentação e decisões | `docs/architecture-v0-1` |
| `feat/` | nova capacidade do produto | `feat/roll-attempt` |
| `fix/` | correção de comportamento | `fix/idempotency-scope` |
| `refactor/` | mudança interna sem alterar comportamento | `refactor/session-module` |
| `test/` | cobertura ou infraestrutura de teste | `test/outbox-concurrency` |
| `chore/` | ferramentas, dependências e manutenção | `chore/ci-foundation` |

O nome usa minúsculas, palavras separadas por hífen e descreve o resultado, não o nome da pessoa.

## Procedimento de uma tarefa

1. confirmar que a tarefa possui objetivo e critério de conclusão;
2. atualizar a referência local da `main` sem apagar trabalho existente;
3. criar uma branch curta a partir da `main`;
4. implementar somente o escopo da tarefa;
5. revisar arquivos alterados e executar os gates aplicáveis;
6. mostrar o conteúdo da entrega ao responsável do produto antes de publicar;
7. criar commits pequenos e coerentes;
8. enviar a branch e abrir pull request para `main`;
9. integrar somente com checks verdes e revisão concluída;
10. remover a branch integrada e atualizar a `main` local.

Uma tarefa nova não começa na branch da tarefa anterior.

## Padrão de commits

Os commits seguem Conventional Commits, com texto curto no imperativo:

```text
docs(architecture): aprovar arquitetura de software v0.1
feat(sessions): persistir tentativa de rolagem
fix(persistence): isolar idempotência por contexto
test(outbox): cobrir reserva concorrente
chore(ci): adicionar gates iniciais
```

Regras:

- um commit representa uma mudança coerente;
- documentação, código gerado sem necessidade e formatação alheia não são misturados;
- segredo, `.env`, livro, PDF ou arte sem autorização nunca entra no commit;
- mensagem como `ajustes`, `mudanças` ou `final` não é aceita;
- correção posterior recebe outro commit; histórico publicado não é reescrito sem motivo e autorização.

## Pull request

O pull request deve informar:

- problema resolvido;
- decisões tomadas;
- arquivos ou módulos afetados;
- validações executadas;
- riscos, limites e trabalho posterior;
- confirmação de que não há segredo nem conteúdo protegido.

Para este projeto, o merge preferencial será **squash** quando os commits intermediários não tiverem valor histórico. Uma entrega com commits independentes e bem formados poderá usar merge commit. Rebase de branch local é permitido antes da publicação; rebase de histórico já compartilhado exige coordenação.

## Gates antes do envio

- `git diff --check` sem erro;
- nenhum arquivo inesperado no stage;
- links e documentos válidos quando a tarefa for documental;
- typecheck, testes e build aplicáveis aprovados;
- varredura de segredos sem ocorrência;
- arquivos privados confirmados como ignorados;
- autorização explícita do responsável do produto para o envio.

## Proteção futura da `main`

Quando a Engineering Foundation criar a CI, a `main` deverá exigir pull request, checks obrigatórios, resolução de conversas e bloqueio de force push. Até lá, a disciplina será aplicada pelo processo documentado e pela revisão antes de cada envio.

## Referências

- [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow);
- [Branches protegidas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches);
- [Métodos de merge de pull requests](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github).

## Critério de revisão

Revisar este fluxo quando houver mais pessoas contribuindo, releases paralelos, ambiente permanente de homologação ou necessidade comprovada de manter linhas de versão distintas.
