# Registro de assets de implementação

Esta pasta registra a origem e a função dos assets usados pelo frontend. Imagens de
calibração permanecem separadas de candidatos de produção.

## Character Gateway v0.1

| Asset | Origem | Função | Estado | SHA-256 |
|---|---|---|---|---|
| `apps/web/public/images/character-gateway-background-v03.png` | geração e refinamento pelo recurso nativo de imagem da OpenAI em 28/10/2026, orientados pela composição da calibração aprovada | fundo atmosférico da rota `/personagens` | candidato de produção em 1672×941; sujeito à aprovação visual | `002B40EABE2D1A005096324C68F582EA57EB03E5B266FEBA5B82F1B89617F4C1` |
| `apps/web/src/app/personagens/ankh-mark.tsx` | traçado vetorial provisório baseado na silhueta incorporada à calibração aprovada | marca temporária e escalável na rota `/personagens` | provisório; substituir pelo arquivo-mestre aprovado | `473F658C6356A17F88C6FC1A5F3B2C16D63B6B9710E036A6603239668F0B2739` |

## Criação de Personagem v0.1

| Asset | Origem | Função | Estado | SHA-256 |
|---|---|---|---|---|
| `apps/web/public/images/character-creation-background-v01.png` | geração original pelo recurso nativo de imagem da OpenAI em 30/10/2026, orientada pela especificação visual aprovada e sem referência a estilo nominal | primeira exploração de fundo atmosférico das rotas de criação | preservado como histórico; substituído visualmente pelo candidato v02 | `5F6341F1E50054CC6C7E2E399187BBDA20E1FAF76D889E336DF6147D137C507C` |
| `apps/web/public/images/character-creation-background-v02.png` | edição original pelo recurso nativo de imagem da OpenAI em 30/10/2026, derivada da composição A01 aprovada com remoção da interface incorporada e reconstrução do cenário | fundo compartilhado das telas de escolha e Atributos; lua, figuras e cidade nas bordas com centro de baixo contraste | candidato de produção em 1536×1024; sujeito à aprovação visual | `7F24B5EDE19D70156D6DB2CB7BA1CF3AD004D1F47A417C03E47BC006394AB78F` |

### Restrições registradas

- o fundo v01 foi solicitado sem pessoas; o v02 preserva as figuras da composição
  A01 aprovada, mas remove papel, interface, texto, logos e símbolos incorporados;
- os fundos de produção não substituem a calibração como fonte da decisão visual;
- uma tentativa de saída 4K manteve 1672×941 no gerador nativo; a resolução real está
  registrada acima e não deve ser descrita como 4K;
- o Ankh provisório não cria uma nova decisão de marca e não resolve a pendência de
  autoria/direitos do arquivo de calibração;
- o arquivo-mestre do Ankh deve substituir o provisório antes de publicação;
- nenhuma imagem de livro, personagem licenciado ou material privado foi usada.
