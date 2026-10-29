# Registro de assets de implementação

Esta pasta registra a origem e a função dos assets usados pelo frontend. Imagens de
calibração permanecem separadas de candidatos de produção.

## Character Gateway v0.1

| Asset | Origem | Função | Estado | SHA-256 |
|---|---|---|---|---|
| `apps/web/public/images/character-gateway-background-v03.png` | geração e refinamento pelo recurso nativo de imagem da OpenAI em 28/10/2026, orientados pela composição da calibração aprovada | fundo atmosférico da rota `/personagens` | candidato de produção em 1672×941; sujeito à aprovação visual | `002B40EABE2D1A005096324C68F582EA57EB03E5B266FEBA5B82F1B89617F4C1` |
| `apps/web/src/app/personagens/ankh-mark.tsx` | traçado vetorial provisório baseado na silhueta incorporada à calibração aprovada | marca temporária e escalável na rota `/personagens` | provisório; substituir pelo arquivo-mestre aprovado | `473F658C6356A17F88C6FC1A5F3B2C16D63B6B9710E036A6603239668F0B2739` |

### Restrições registradas

- o fundo foi solicitado sem pessoas, texto, logos ou símbolos e não substitui a
  calibração como fonte da decisão visual;
- uma tentativa de saída 4K manteve 1672×941 no gerador nativo; a resolução real está
  registrada acima e não deve ser descrita como 4K;
- o Ankh provisório não cria uma nova decisão de marca e não resolve a pendência de
  autoria/direitos do arquivo de calibração;
- o arquivo-mestre do Ankh deve substituir o provisório antes de publicação;
- nenhuma imagem de livro, personagem licenciado ou material privado foi usada.
