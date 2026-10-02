# Assistente Vampiro

Plataforma brasileira para aprender, criar, organizar e jogar **Vampiro: A Máscara**, integrando personagem, regras, lore, Crônica e sessão em uma experiência contextual e imersiva.

## Estado atual

O projeto está em **descoberta estruturada e arquitetura de produto**.

Ainda não existe uma aplicação implementada. As decisões de produto, experiência e direção visual estão sendo formalizadas antes da escolha final da arquitetura técnica e da criação do primeiro corte executável.

## Princípios centrais

- personagem como centro da experiência do jogador;
- papel de Jogador ou Narrador associado à Crônica, não à conta;
- mostrar complexidade somente quando ela for necessária;
- evitar trabalho duplicado e múltiplas fontes de verdade;
- Mesa persistente e centrada na cena;
- separação entre Biblioteca, Rules Engine e SIRE;
- IA opcional e sem responsabilidade por proteger segredos;
- regras e conteúdo com edição e proveniência;
- monólito modular como hipótese inicial, sem distribuição prematura;
- desenvolvimento por cortes verticais testáveis.

## Documentação

O mapa oficial dos documentos, status e ordem de leitura está em:

- [Índice da documentação](./documentacao/README.md)
- [Roadmap de Engenharia v0.1](./documentacao/roadmap-engenharia-v0.1.md)
- [Registro de Decisões](./documentacao/registro-decisoes.md)

## Próximo objetivo

Executar **Rules & Content Discovery v0.1** com um corpus mínimo das regras necessárias ao primeiro corte vertical:

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

Após essa descoberta serão produzidos:

1. Domain Model v0.1;
2. Permissions & Visibility Matrix v0.1;
3. Rules Engine Scope v0.1;
4. Architecture v0.1;
5. ADRs iniciais;
6. esqueleto executável e CI.

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
