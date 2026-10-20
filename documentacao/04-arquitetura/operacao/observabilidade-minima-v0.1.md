# Observabilidade Mínima v0.1

**Status:** proposta<br>
**Escopo:** API da Engineering Foundation

## Objetivo

Permitir que uma requisição seja localizada e diagnosticada sem registrar seu
conteúdo. Esta base antecede métricas, tracing distribuído e ferramentas externas
de coleta.

## Correlation ID

A API usa o cabeçalho `x-correlation-id`.

- um valor recebido é preservado quando possui de 1 a 64 caracteres e usa
  somente letras ASCII, números, ponto, sublinhado, dois-pontos ou hífen;
- valores ausentes, repetidos ou inválidos são substituídos por um UUID aleatório;
- o identificador efetivo sempre retorna no cabeçalho da resposta;
- o contexto é propagado internamente com `AsyncLocalStorage`;
- UUIDv4 é suficiente porque correlation IDs são efêmeros e não são
  identificadores do domínio.

## Formato dos logs

Cada registro ocupa uma linha JSON em `stdout` ou `stderr`.

| Campo | Regra |
|---|---|
| `timestamp` | data UTC em ISO 8601 |
| `level` | `debug`, `info`, `warn`, `error`, `fatal` ou `verbose` |
| `service` | sempre `assistente-vampiro-api` nesta aplicação |
| `event` | nome estável e pesquisável do acontecimento |
| `correlationId` | presente quando existe contexto de requisição |
| `context` | componente de origem quando informado pelo Nest |

O processo escreve os registros e a plataforma é responsável por coleta,
rotação, retenção e consulta. A aplicação não grava arquivos de log.

## Eventos HTTP iniciais

| Evento | Nível | Atributos permitidos |
|---|---|---|
| `http.request.completed` | `info` | correlation ID, método, template da rota, status e duração |
| `http.request.aborted` | `warn` | correlation ID, método, template da rota, status e duração |

O template da rota, como `/characters/:id`, é usado no lugar da URL recebida.
Isso evita registrar query strings e valores dinâmicos enviados pelo cliente.
Requisições sem uma rota conhecida usam `unmatched`.

## Restrições de segurança e privacidade

Logs não podem conter:

- corpo de requisição ou resposta;
- query string ou parâmetros de rota resolvidos;
- cabeçalhos `Authorization`, `Cookie` ou `Set-Cookie`;
- senhas, tokens, chaves, `DATABASE_URL` ou outros segredos;
- nomes de personagens, mensagens narrativas ou informações pessoais;
- conteúdo de livros ou material protegido.

Novos eventos devem declarar atributos permitidos e possuir teste proporcional ao
risco. Um objeto que não possa ser serializado produz um evento técnico seguro em
vez de interromper a aplicação.

## Sinais operacionais

- `/api/v1/health` informa que o processo está vivo;
- `/api/v1/health/ready` confirma que a API e o PostgreSQL estão prontos;
- o correlation ID conecta a resposta aos registros emitidos durante a requisição;
- status e duração permitem identificar erros e lentidão sem inspecionar conteúdo.
- o cabeçalho de identificação do framework HTTP é removido das respostas.

## Limites desta versão

OpenTelemetry, tracing distribuído, métricas de negócio, alertas, dashboards e
política definitiva de retenção ficam para o ambiente compartilhado. Métricas do
relay da outbox serão adicionadas quando esse componente existir.
