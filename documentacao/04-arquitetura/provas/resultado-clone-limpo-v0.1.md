# Resultado da Prova em Clone Limpo v0.1

**Status:** concluída<br>
**Data:** 20 de outubro de 2026<br>
**Escopo:** gate final da Engineering Foundation<br>
**Revisão validada:** `3f664db`

## Objetivo

Comprovar que uma pessoa consegue obter uma cópia nova do repositório, preparar
o ambiente, validar a base técnica e executar web, API e PostgreSQL seguindo o
README. A prova também deveria terminar sem deixar alterações no worktree.

## Ambiente usado

| Componente | Versão ou condição |
|---|---|
| sistema operacional | Windows 11 Pro, versão 10.0.26200 |
| Git | 2.49.0.windows.1 |
| Node.js | 24.18.0 |
| pnpm | 12.10.1 |
| PostgreSQL | 18.6, configurado em UTC |
| Docker | indisponível nesta máquina |

O README permite usar Docker Compose ou uma instalação local do PostgreSQL 18.
Esta execução usou o servidor local. O caminho com Compose foi validado de forma
independente pelo job `Local PostgreSQL container` da
[CI da `main`](https://github.com/GabrielB-B/Assistente_Vampiro/actions/runs/39437002554).

## Procedimento

1. criar um clone sem atalhos de cópia local e selecionar a branch candidata;
2. copiar `.env.example` para `.env`;
3. fornecer ao processo uma credencial válida do PostgreSQL local, mantida fora
   do repositório e sem escrevê-la na saída;
4. executar `corepack pnpm install --frozen-lockfile`;
5. executar `corepack pnpm db:migrate`;
6. executar `corepack pnpm check`;
7. executar `corepack pnpm test:integration`;
8. executar `corepack pnpm dev` e consultar as três URLs documentadas;
9. encerrar os processos e verificar novamente o estado do Git e das portas.

Nenhum pacote, comando corretivo ou conhecimento estrutural externo ao README
foi necessário. A única informação específica da máquina foi a credencial do
banco já instalado.

## Falhas encontradas na primeira execução

A primeira tentativa foi feita sobre a `main` no commit `e4e446c`. Os gates de
qualidade e os artefatos compilados passaram, mas o comando de desenvolvimento
documentado revelou dois problemas.

| Problema | Causa | Correção |
|---|---|---|
| API não iniciava por `pnpm dev` | `watch` estava depois de uma opção encaminhada ao Node e foi interpretado como caminho de módulo | alterar para `tsx watch --env-file-if-exists=../../.env src/main.ts` |
| dependências do Nest ficavam indefinidas no executor de desenvolvimento | o runtime TypeScript não emitia os mesmos metadados usados pelo build | declarar os tokens com `@Inject` nos três pontos de injeção |
| `next-env.d.ts` deixava o Git sujo | Next.js 16 regenera o arquivo de forma diferente em `dev` e `build` | ignorar o artefato e executar `next typegen` antes do typecheck |
| Turborepo emitia aviso de opção obsoleta | `--parallel` tornou-se redundante com tarefas `persistent` | remover a opção do script raiz |

A prova não foi considerada aprovada nessa tentativa. As correções foram
aplicadas antes de criar o segundo clone.

## Resultado final

| Verificação | Resultado |
|---|---|
| clone iniciou limpo | passou |
| instalação congelada | passou; 537 pacotes conforme o lockfile |
| migrações | passaram no schema `assistente_vampiro` |
| formatação | passou |
| lint | 3 tarefas aprovadas |
| typecheck | 3 tarefas aprovadas, incluindo `next typegen` |
| testes regulares | 22 aprovados: API 15, banco 6 e web 1 |
| builds | API, banco e web aprovados |
| integração PostgreSQL | 4 testes aprovados |
| web | HTTP 200 e identificação do produto presente |
| liveness | HTTP 200 e estado `ok` |
| readiness | HTTP 200, API e banco prontos |
| correlation ID | valores enviados foram preservados nas respostas e nos logs |
| exposição do framework | cabeçalho `X-Powered-By` ausente |
| encerramento | portas 3000 e 3001 liberadas |
| estado final do clone | zero alterações no worktree |

Os logs HTTP continham somente o identificador de correlação, método, template
da rota, status, duração, serviço, evento, nível e data. Nenhum corpo, query
string, cabeçalho sensível ou credencial foi registrado.

## Conclusão

O critério de reprodução foi atendido depois das correções encontradas pela
própria prova. A FND-03 e a Engineering Foundation podem ser encerradas.

Esta conclusão não valida deploy, escala ou observabilidade externa. Esses temas
continuam pertencendo aos gates do primeiro ambiente compartilhado.
