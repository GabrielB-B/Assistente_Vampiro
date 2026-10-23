# Baseline de Segurança v0.1

**Status:** aprovado<br>
**Data:** 21 de outubro de 2026<br>
**Aplicação:** código, API, banco, observabilidade, CI, realtime e futuras integrações<br>
**Responsáveis:** toda pessoa que projeta, implementa ou revisa uma entrega

## 1. Compromisso

Segurança faz parte da arquitetura e da Definition of Done. Não será tratada
como uma revisão tardia.

Nenhum sistema sério pode prometer risco zero ou impossibilidade absoluta de
vazamento. O compromisso do projeto é reduzir esse risco de forma contínua e
verificável: negar acesso por padrão, expor o mínimo necessário, usar mais de uma
camada de proteção e bloquear entregas que mantenham vulnerabilidade crítica ou
risco alto sem tratamento aprovado.

No alpha, somente dados claramente fictícios podem ser usados. Dados de pessoas
reais ou de mesas reais só entrarão depois que identidade, operação,
recuperação e resposta a incidentes estiverem prontas para o ambiente
compartilhado.

## 2. Princípios obrigatórios

1. **Negar por padrão.** A ausência de uma permissão explícita sempre termina em
   negação.
2. **Autorizar no servidor.** Interface, URL, cabeçalho e estado do cliente nunca
   são autoridade.
3. **Menor privilégio.** Cada pessoa, serviço e processo acessa somente o que
   precisa durante o tempo necessário.
4. **Mínima exposição.** Consultas, respostas, eventos e logs carregam apenas os
   campos necessários para aquela finalidade e aquele público.
5. **Defesa em profundidade.** Validação, autorização, projeção, banco, rede,
   logs e monitoramento não dependem de uma única barreira.
6. **Falhar de forma segura.** Erros, indisponibilidade ou configuração ausente
   não liberam acesso nem ativam adapters de desenvolvimento.
7. **Evidência antes de confiança.** Controles relevantes precisam de testes
   positivos e negativos, não apenas de intenção documentada.
8. **Segurança compatível com manutenção humana.** Políticas ficam centralizadas,
   com nomes do domínio e caminhos auditáveis; regras escondidas em controllers
   ou componentes não são aceitas.

## 3. Classificação dos dados

| Classe | Exemplos | Tratamento mínimo |
|---|---|---|
| público | página institucional e conteúdo editorial liberado | integridade, proveniência e cache controlado |
| autenticado | preferências e lista autorizada de Crônicas | identidade válida e resposta mínima |
| privado do jogador | ficha, anotações e vínculo de personagem | dono ou política explícita da Crônica |
| secreto do Narrador | cenas ocultas, NPCs reservados e rolagens privadas | somente Narradores autorizados; nunca enviar placeholder ou contagem ao Jogador |
| operacional sensível | tokens, cookies, chaves, URLs com credenciais e backups | fora do Git e dos logs; acesso restrito, rotação e auditoria |
| fonte privada | livros, PDFs e extrações integrais | fora do runtime e do Git; uso editorial controlado |

Todo novo campo deve receber uma classe e um público antes da migração ou do
contrato público. Na dúvida, ele nasce como secreto.

## 4. Fronteiras de confiança

- navegador, aplicativo cliente e qualquer dado recebido por HTTP ou Socket.IO
  são não confiáveis;
- a API é a autoridade para identidade, autorização, regras e projeções;
- o frontend nunca acessa o banco diretamente;
- o banco não deve ficar publicamente acessível;
- processos internos também recebem permissões mínimas e não são confiáveis só
  por estarem na mesma rede;
- provedores externos, inclusive uma futura IA, recebem apenas o recorte já
  autorizado para a finalidade aprovada.

## 5. Identidade e autorização

Autenticação prova quem é o ator. Autorização decide o que esse ator pode fazer
naquele recurso. Uma não substitui a outra.

Toda operação protegida verifica, conforme o caso:

- identidade e estado da conta;
- Participação ativa na Crônica;
- papel exercido naquela Crônica;
- propriedade e Vínculo do Personagem;
- Sessão, Cena e estado do recurso;
- público e visibilidade do campo ou evento;
- ação solicitada, não somente permissão genérica de leitura.

Essas verificações ocorrem em cada requisição e em cada objeto. Trocar um UUID
na URL, no corpo ou em um evento nunca pode conceder acesso. UUID difícil de
adivinhar reduz colisões; não é um mecanismo de autorização.

Consultas devem restringir o conjunto de dados antes de materializá-lo sempre
que possível. Depois disso, uma projeção explícita remove campos que não
pertencem ao público. Filtrar segredos no React ou depois da serialização é uma
falha de arquitetura.

Para reduzir enumeração, respostas negadas não confirmam a existência de recurso
secreto. A política entre `403` e `404` será estável por tipo de endpoint e terá
teste automatizado.

## 6. API protegida

Toda API funcional ficará versionada sob `/api/v1` e seguirá estes controles:

- rotas e métodos HTTP expostos por allowlist;
- schemas fechados, tipos esperados, enums, limites de tamanho e paginação;
- DTO de entrada convertido para comando interno; entidades do banco não são
  vinculadas diretamente ao corpo recebido;
- campos mutáveis aceitos por allowlist, evitando alteração indevida de
  propriedades reservadas;
- consultas parametrizadas pelo adapter de persistência; SQL montado por
  concatenação de entrada externa é proibido;
- limites de frequência e de custo para autenticação, mutações, busca, realtime
  e futuras chamadas de IA, com `429` quando aplicável;
- CORS restrito às origens necessárias; não usar origem curinga com credenciais;
- credenciais, tokens e chaves nunca aparecem em URL ou query string;
- erros públicos usam códigos estáveis e não expõem stack trace, SQL, caminhos,
  configuração ou detalhes internos;
- operações mutáveis sensíveis adotam idempotência, controle de concorrência e
  auditoria conforme o risco.

TLS será obrigatório em qualquer ambiente compartilhado. Cookies de sessão,
quando a autenticação real for escolhida, serão `Secure`, `HttpOnly` e terão
`SameSite` definido conforme o fluxo. A proteção contra CSRF será decidida junto
do modelo de sessão, nunca presumida pela interface.

### 6.1 Navegador e borda

- a aplicação envia Content Security Policy compatível com os recursos realmente
  usados, `frame-ancestors`, proteção contra MIME sniffing e política de referrer;
- HSTS é habilitado na borda depois que o domínio operar integralmente em HTTPS;
- texto vindo de pessoa, livro ou integração é tratado como dado e recebe escape
  pelo contexto; HTML arbitrário não é renderizado;
- links e redirecionamentos aceitam somente destinos e protocolos previstos;
- assets e scripts de terceiros exigem justificativa e revisão de privacidade;
- mensagens privadas não ficam em cache público, analytics ou telemetria de
  terceiros.

### 6.2 Banco e serviços externos

- a credencial usada em runtime tem somente os privilégios necessários; migração
  usa uma identidade separada quando houver ambiente compartilhado;
- constraints do banco reforçam invariantes e isolamento, sem substituir a
  autorização da aplicação;
- conexões externas usam destinos permitidos, timeouts, limites de resposta e
  validação de protocolo, reduzindo risco de SSRF;
- backup e exportação são criptografados, têm acesso restrito e seguem a mesma
  retenção do dado original;
- upload de arquivo, quando existir, terá tipo e tamanho permitidos, nome gerado
  pelo servidor, armazenamento fora da área executável e verificação própria
  antes de publicação.

## 7. Proteção específica do alpha

O adapter `x-alpha-identity` é uma ferramenta local, não autenticação:

- funciona apenas em `local`, `test` e `ci`;
- aceita somente aliases publicados pelo seed;
- nunca aceita UUID arbitrário como identidade;
- falha no startup se for selecionado em outro ambiente;
- não cria atalho dentro das políticas de autorização;
- seed e reset de dados têm a mesma restrição de ambiente e são idempotentes.

A aplicação não será publicada para uso real enquanto depender desse adapter.

## 8. Segredos, configuração e supply chain

- segredos entram por configuração externa e nunca são commitados;
- arquivos locais de ambiente permanecem ignorados; exemplos contêm somente
  nomes e valores inofensivos;
- logs, mensagens de erro, artefatos de build e saída da CI não exibem segredos;
- credenciais possuem escopo mínimo e procedimento de rotação e revogação;
- dependências usam versão exata e lockfile congelado na CI;
- pacote novo exige justificativa, revisão de manutenção, licença e superfície
  de instalação;
- varreduras de segredos e vulnerabilidades entram na CI de forma progressiva e
  bloqueiam achados críticos ou altos sem exceção documentada;
- scripts de instalação e atualização não recebem confiança automática.

Uma exceção temporária precisa registrar responsável, motivo, impacto, controle
compensatório e data de expiração. Exceção sem prazo não é aceita.

## 9. Logs, auditoria e privacidade

Logs usam campos permitidos, correlation ID e sanitização contra injeção. Não
registram:

- senha, token, cookie ou identificador de sessão bruto;
- string de conexão, chave ou segredo de configuração;
- corpo completo de requisição ou resposta;
- anotações privadas, texto narrativo secreto ou fonte privada;
- dado pessoal sem finalidade operacional aprovada.

Identificadores técnicos podem ser pseudonimizados quando a investigação não
exigir o valor original. Acesso aos logs será restrito e auditável. Eventos de
auditoria de negócio são separados dos logs técnicos e não se tornam um atalho
para consultar conteúdo secreto.

Antes de usar dados reais serão definidos retenção, exclusão, exportação,
backup, restauração e finalidade de cada categoria. Backup sem teste de
restauração não conta como recuperação comprovada.

## 10. Realtime

Conexão, inscrição em stream e envio de comando são autorizados separadamente.
Salas representam públicos já autorizados; o cliente não recebe um evento
secreto para depois escondê-lo.

Alteração de Participação, papel ou Vínculo revoga a próxima operação e a
inscrição ativa dentro do limite operacional definido. Reconexão repete a
autorização e recupera lacunas pela API, sem confiar no cursor do cliente como
fonte de verdade.

## 11. Preparação para IA

IA não será usada para decidir permissão, regra oficial ou classificação de
segredo. Antes de qualquer integração:

1. o ator e a finalidade são autorizados;
2. as fontes permitidas são selecionadas no servidor;
3. somente o menor contexto necessário é enviado;
4. conteúdo recuperado e instruções externas são tratados como entrada não
   confiável, inclusive contra prompt injection;
5. provedor, retenção, treinamento, região, contrato e exclusão de dados são
   avaliados;
6. saída recebe proveniência, validação e limites de uso.

O corpus privado integral e segredos de outras pessoas nunca compõem um prompt
por conveniência. Uma integração de IA não pode ampliar o acesso que a pessoa já
possui no produto.

## 12. Cenários negativos mínimos

Cada entrega aplicável deve provar que:

- uma pessoa externa não lê nem altera a Crônica;
- Participação inativa é negada;
- Jogador não assume papel de Narrador por parâmetro ou payload;
- um Personagem alheio continua inacessível após troca de UUID;
- campo ou evento secreto não aparece em payload, placeholder, contagem ou log;
- alias desconhecido e header de identidade ausente falham de forma segura;
- adapter ou seed do alpha não inicia em ambiente compartilhado;
- entrada inválida, grande demais ou com campo inesperado é rejeitada sem efeito
  colateral;
- repetição de comando não duplica estado;
- falha interna não revela detalhes técnicos.

Os testes usam PostgreSQL real quando a política depende de estado persistido.
Mocks isolados não bastam como prova de autorização entre objetos.

## 13. Gates por fase

| Incremento | Evidência de segurança obrigatória |
|---|---|
| VS01-02 | identidade fictícia falha fechada; seed restrito; políticas de propriedade, Participação, papel, Vínculo e visibilidade com testes positivos e negativos |
| VS01-03 | autorização por objeto; projeções mínimas; troca de IDs e campos secretos cobertos por integração |
| VS01-04 | validação fechada; Fome e parada derivadas no servidor; idempotência, transação e auditoria testadas |
| VS01-05 | filtro no servidor antes da serialização; ausência de payload, placeholder e contagem privada comprovada |
| VS01-06 | conexão, inscrição e comando autorizados; revogação, limites e reconexão testados |
| VS01-07 | varreduras, inspeção de logs, testes negativos, dependências e execução em clone limpo aprovados |

## 14. Definition of Done de segurança

Uma entrega não está concluída até que:

- os dados e públicos novos estejam classificados;
- ameaças do incremento e fronteiras afetadas estejam registradas;
- caminho permitido e negações relevantes estejam automatizados;
- logs e erros tenham sido inspecionados com entradas sensíveis simuladas;
- segredo, material privado e dependência vulnerável não tenham entrado no Git ou
  nos artefatos;
- risco residual esteja explícito e possua responsável;
- nenhum achado crítico ou alto permaneça aberto sem decisão formal.

Antes do primeiro ambiente compartilhado também serão obrigatórios: modelo de
ameaças do fluxo implantado, hardening da borda, política de backup e retenção,
monitoramento de abuso e procedimento de resposta a incidentes com revogação,
contenção, investigação, recuperação e comunicação.

## 15. Referências de engenharia

- [OWASP ASVS 5.0.0](https://asvs.owasp.org/) — catálogo de requisitos para
  projeto, desenvolvimento e verificação de aplicações e serviços web;
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
  — negação por padrão e verificação de permissão em toda requisição;
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
  — transporte, métodos, CORS, limites, erros e credenciais em APIs;
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
  — dados que não devem ser registrados e proteção dos logs;
- [OWASP API Security Top 10 — 2023](https://api-security.owasp.org/editions/2023/en/0x03-introduction/)
  — riscos recorrentes de autorização por objeto, autenticação, consumo de
  recursos e configuração;
- [NIST Secure Software Development Framework 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
  — práticas de desenvolvimento seguro ao longo do ciclo de vida.

Essas referências orientam a verificação, mas não substituem o modelo de ameaças
específico do Assistente Vampiro nem a legislação aplicável ao ambiente real.
