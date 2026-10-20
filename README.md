# Assistente Vampiro

Plataforma brasileira para aprender, criar, organizar e jogar **Vampiro: A Máscara**, integrando personagem, regras, lore, Crônica e sessão em uma experiência contextual e imersiva.

## Estado atual

O projeto concluiu a **Engineering Foundation** e está pronto para iniciar o **Vertical Slice 01**, com fundação de produto, corpus inicial de regras, Modelo de Domínio, stack tecnológica e Architecture v0.1 aprovados.

FND-01, FND-02 e FND-03 estão concluídas. O esqueleto executável possui CI protegendo a `main`, persistência PostgreSQL, ambiente local reproduzível, observabilidade mínima e prova em clone limpo. A Fatia 01 de regras, a prova de persistência, as cinco ADRs do gate e a Architecture v0.1 também estão concluídas; funcionalidades do alpha ainda não começaram.

## Princípios centrais

- personagem como centro da experiência do jogador;
- papel de Jogador ou Narrador associado à Crônica, não à conta;
- mostrar complexidade somente quando ela for necessária;
- evitar trabalho duplicado e múltiplas fontes de verdade;
- Mesa persistente e centrada na cena;
- separação entre Biblioteca, Rules Engine e SIRE;
- IA opcional e sem responsabilidade por proteger segredos;
- regras e conteúdo com edição e proveniência;
- monólito modular como arquitetura inicial, sem distribuição prematura;
- desenvolvimento por cortes verticais testáveis.

## Documentação

O mapa oficial dos documentos, status e ordem de leitura está em:

- [Índice da documentação](./documentacao/README.md)
- [Roadmap de Engenharia v0.1](./documentacao/05-planejamento/roadmap-engenharia-v0.1.md)
- [Engineering Foundation v0.1](./documentacao/05-planejamento/engineering-foundation-v0.1.md)
- [Registro de Decisões](./documentacao/00-governanca/registro-decisoes.md)

## Ambiente de desenvolvimento

Pré-requisitos:

- Node.js 24.18.0;
- Corepack disponível;
- pnpm 12.10.1;
- Docker com Compose v2 ou PostgreSQL 18 instalado diretamente.

Prepare o ambiente local sem versionar credenciais:

```powershell
Copy-Item .env.example .env
```

Troque a senha ilustrativa nos campos `POSTGRES_PASSWORD` e `DATABASE_URL` pelo
mesmo valor, sem reutilizar credenciais de outros ambientes.

Para iniciar o PostgreSQL isolado do projeto:

```powershell
corepack pnpm infra:up
```

O banco fica acessível somente pela interface local. O volume é preservado ao
encerrar o serviço com `corepack pnpm infra:down`.

Depois instale, migre e valide:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm db:migrate
corepack pnpm check
corepack pnpm test:integration
```

Execução local:

```powershell
corepack pnpm dev
```

- web: `http://localhost:3000`;
- liveness da API: `http://localhost:3001/api/v1/health`;
- readiness da API e do banco: `http://localhost:3001/api/v1/health/ready`.

A API devolve `x-correlation-id` em toda resposta e escreve logs estruturados em
JSON, sem corpo, query string ou credenciais. O contrato está em
[Observabilidade Mínima v0.1](./documentacao/04-arquitetura/operacao/observabilidade-minima-v0.1.md).

O arquivo `.env.example` contém somente valores ilustrativos. Credenciais reais permanecem fora do Git. Os comandos e a política de migração estão em [database/README.md](./database/README.md). O contrato completo do ambiente está em [Ambiente Local v0.1](./documentacao/04-arquitetura/operacao/ambiente-local-v0.1.md).

## Próximo objetivo

Criar a fundação técnica necessária ao **Vertical Slice 01**:

```text
Autenticar
→ Selecionar personagem
→ Boa noite
→ Abrir ficha
→ Montar rolagem
→ Resolver regra
→ Persistir o evento de rolagem
→ Exibir o resultado no Feed da Mesa
```

Próximas entregas:

1. revisar e aprovar o plano de implementação do Vertical Slice 01;
2. iniciar o Rules Engine executável com os cenários aprovados da Fatia 01;
3. implementar e validar o alpha técnico antes do MVP de playtest;
4. especificar a rerrolagem com Força de Vontade no incremento previsto.

## Conteúdo protegido

Livros, PDFs, traduções não autorizadas e artes externas não devem ser adicionados ao Git.

O repositório registra:

- metadados;
- proveniência;
- análises;
- modelos;
- regras estruturadas quando a classificação de direitos e uso permitir;
- links para fontes públicas.

O conteúdo original privado deve permanecer fora do versionamento até a definição da política de licenciamento.
