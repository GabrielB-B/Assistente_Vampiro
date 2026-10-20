# Assistente Vampiro

Plataforma brasileira para aprender, criar, organizar e jogar **Vampiro: A Máscara**, integrando personagem, regras, lore, Crônica e sessão em uma experiência contextual e imersiva.

## Estado atual

O projeto está na **Engineering Foundation**, com fundação de produto, corpus inicial de regras, Modelo de Domínio, stack tecnológica e Architecture v0.1 aprovados.

O esqueleto executável da FND-01 e a persistência PostgreSQL da FND-02 estão concluídos. A Fatia 01 de regras, a prova de persistência, as cinco ADRs do gate e a Architecture v0.1 também estão concluídas; funcionalidades do alpha ainda não começaram.

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
- PostgreSQL 18 para migrações e testes de integração.

Prepare o ambiente local sem versionar credenciais:

```powershell
Copy-Item .env.example .env
```

Edite somente o `.env` e informe uma role e um banco exclusivos do projeto. Depois instale, migre e valide:

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

O arquivo `.env.example` contém somente valores ilustrativos. Credenciais reais permanecem fora do Git. Os comandos e a política de migração estão em [database/README.md](./database/README.md).

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

1. criar CI, containers locais e observabilidade mínima na FND-03;
2. comprovar o setup em clone limpo ao concluir a Foundation;
3. especificar a rerrolagem com Força de Vontade no incremento previsto;
4. implementar o alpha técnico antes do MVP de playtest.

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
