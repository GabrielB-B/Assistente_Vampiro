# Assistente Vampiro

Plataforma brasileira para aprender, criar, organizar e jogar **Vampiro: A Máscara**, integrando personagem, regras, lore, Crônica e sessão em uma experiência contextual e imersiva.

## Estado atual

O projeto entra na **Engineering Foundation**, com fundação de produto, corpus inicial de regras, Modelo de Domínio, stack tecnológica e Architecture v0.1 aprovados.

Ainda não existe uma aplicação implementada. A Fatia 01 de regras, a prova de persistência, as cinco ADRs do gate e a Architecture v0.1 foram concluídas. O próximo corte cria a fundação executável antes das funcionalidades do alpha.

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

1. criar o esqueleto executável, as migrações iniciais e a CI;
2. comprovar instalação limpa e ambiente local reproduzível;
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
