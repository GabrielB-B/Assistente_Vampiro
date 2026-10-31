# Estágio e experiência inicial V5 v0.1

**Estado:** investigado e mapeado; não implementado  
**Fontes:** `SRC-0001` p. 137, 141 e 151–152; `SRC-0004` p. 65

## Pacotes identificados

| Termo do corpus | Janela indicada | Geração / Potência do Sangue | Ajustes iniciais | Autoridade |
|---|---|---|---|---|
| Criança da Noite (`Childer`) | Abraço nos últimos 15 anos | 12ª/13ª com PS 1; sangue-ralo 14ª–16ª com PS 0 | sem pacote adicional listado | padrão no Players Guide |
| Neófito | entre 1940 e cerca de uma década antes da crônica | 12ª/13ª, PS 1 | 15 XP | requer definição do grupo/Narrador |
| Ancilla | entre 1780 e 1940 | 10ª/11ª, PS 2 | +2 Vantagens, +2 Defeitos, -1 Humanidade e 35 XP | requer definição do grupo/Narrador |

O Livro Básico descreve anciões no enquadramento ficcional, mas o resumo de criação consultado não fornece um pacote-base de personagem jogador equivalente aos três acima. Portanto `elder` não deve virar uma opção mecânica inventada.

## Decisão arquitetural

Representar futuramente essa escolha como um pacote versionado do perfil, não como condicionais espalhadas pela UI. Nome de trabalho: `StartingExperiencePackage`. O pacote deve declarar:

- tipos de personagem elegíveis;
- Geração e Potência do Sangue iniciais;
- ajustes de Vantagens, Defeitos e Humanidade;
- saldo de XP;
- autoridade necessária (`player`, `group-agreement`, `storyteller`);
- ordem de aplicação e revisão normativa.

O nome permanece provisório até a formalização do fluxo completo de XP. Nenhum desses pacotes altera `RULE-CREATION-ATTRIBUTES-001`; XP posterior é outra operação.
