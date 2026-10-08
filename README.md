# Assistente Vampiro

Plataforma brasileira para aprender, criar, organizar e jogar **Vampiro: A Máscara**, integrando personagem, regras, lore, Crônica e sessão em uma experiência contextual e imersiva.

## Estado atual

O projeto está em **arquitetura de software**, com fundação de produto, direção visual, corpus inicial de regras, Modelo de Domínio e stack tecnológica aprovados.

Ainda não existe uma aplicação implementada. A Architecture v0.1 está em revisão; a etapa atual fecha permissões, a primeira regra executável e a prova de persistência antes da criação do código de produção.

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
- [Registro de Decisões](./documentacao/00-governanca/registro-decisoes.md)

## Próximo objetivo

Fechar a arquitetura técnica e os contratos necessários ao **Vertical Slice 01**:

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

1. prova comparativa de persistência e ADR-0004;
2. Permissions & Visibility Matrix v0.1;
3. primeira especificação executável de rolagem;
4. Rules Engine Scope v0.1;
5. revisão e aprovação da Architecture v0.1;
6. esqueleto executável, banco local e CI;
7. alpha técnico antes do MVP de playtest.

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
