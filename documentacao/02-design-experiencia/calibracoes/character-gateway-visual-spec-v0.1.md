# Character Gateway — Visual Specification v0.1

**Status:** APROVADO<br>
**Superfície:** Pós-login / Seleção de personagem<br>
**Modo:** Jogar<br>
**Função:** permitir ao usuário escolher o personagem ativo e entrar no contexto pessoal do personagem.<br>
**Issue de implementação:** [#12 — VS01-03A](https://github.com/GabrielB-B/Assistente_Vampiro/issues/12)<br>
**Referência visual aprovada:** [Character Gateway v0.1](../assets/calibracoes/character-gateway-visual-v01.png)

## Registro do artefato visual

| Campo | Registro |
|---|---|
| origem | arquivo fornecido pelo responsável do projeto em 28 de outubro de 2026 |
| autoria e ferramenta | não informadas; registro pendente de complementação pelo responsável |
| função atual | calibração visual e compositiva da issue #12; não é asset obrigatório de produção |
| publicação ou uso comercial | pendente de confirmação de autoria, ferramenta e direitos aplicáveis |
| arquivo versionado | `../assets/calibracoes/character-gateway-visual-v01.png` |

Antes de divulgação pública ou uso comercial, complementar o registro de autoria,
ferramenta e direitos de uso. Se a confirmação não for suficiente, substituir a
imagem por um asset de produção com proveniência comprovada.

---

## 1. Intenção

A tela deve transmitir:

> **“Escolha por qual identidade você entrará na noite.”**

Ela deve ser minimalista, artística, silenciosa e sombria. Não deve parecer dashboard, catálogo de cards, launcher genérico, carrossel de streaming ou página administrativa.

---

## 2. Decisões congeladas

Não reinterpretar durante a implementação:

1. fundo atmosférico pictórico, com aparência de pintura feita à mão;
2. base azul-noite/carvão, com luz quente localizada;
3. igreja/catedral predominantemente à direita;
4. área central limpa para leitura e seleção;
5. personagens apresentados por avatares circulares;
6. personagem selecionado maior e com acento vermelho discreto;
7. personagens não selecionados visualmente secundários;
8. `Novo / Criar personagem` integrado à mesma lógica espacial;
9. contexto do personagem selecionado abaixo da seleção;
10. CTA `Entrar` simples e contido;
11. `Mestre` no topo como acesso secundário;
12. sem sidebar;
13. sem cards tradicionais;
14. sem badges/chips desnecessários;
15. vermelho como acento, não como superfície dominante.

---

## 3. Simbologia

Usar o **Ankh fornecido e aprovado pelo projeto** como símbolo principal.

Aplicações:

- canto superior esquerdo;
- acima do título `Seus personagens`;
- outros usos institucionais aprovados.

> **Não criar, reinterpretar ou gerar símbolos fictícios para substituir iconografia já definida.**

Símbolos de clã, quando usados, devem vir do conjunto canônico aprovado pelo projeto.

---

## 4. Estrutura

```text
[Ankh / marca]                         [Personagens] [Mestre] [Configurações] [Sair]


                              [Ankh]

                        Seus personagens
                 Escolha com quem você vai continuar


               ○              ◉              ○              ⊕
             Selene          Marcus          Cael           Novo
             Toreador        Ventrue         Brujah


                           CRÔNICA  Ecos de Cinzas
                           STATUS   Última sessão há 2 dias

                               Entrar →
```

A responsividade pode adaptar medidas, mas não deve transformar os itens em cards.

---

## 5. Avatares

### Padrão

- circular;
- portrait recortado dentro do círculo;
- sem moldura pesada;
- sem glow constante;
- sem efeito tridimensional.

### Selecionado

- maior;
- contraste ligeiramente superior;
- borda/acento oxblood/vermelho;
- informação contextual visível.

### Não selecionado

- menor;
- contraste reduzido;
- reconhecível sem competir.

### Sem imagem

Usar fallback neutro coerente com o sistema.

**Imagem de corpo inteiro não pertence a esta superfície.** Pode ser usada posteriormente em ficha, perfil e telas narrativas.

---

## 6. Fundo

O fundo pertence ao **sistema**, não ao personagem.

Direção:

- pintura/manualidade perceptível;
- terror atmosférico, não explícito;
- arquitetura religiosa/gótica à direita;
- sem figura humana obrigatória;
- profundidade por luz, sombra e textura;
- azul-noite/carvão como base;
- luz quente localizada na igreja;
- transição suave para a área central de leitura.

Não usar:

- fotografia de igreja;
- render 3D hiperpolido;
- neon/cyberpunk;
- sangue decorativo;
- névoa excessiva;
- skyline genérico;
- figuras ajoelhadas;
- elementos que disputem atenção com os avatares.

---

## 7. Tipografia

Direção:

- **serif editorial humanista** para título e nomes;
- **sans humanista** para navegação, estados e ações;
- marfim quente em vez de branco puro;
- evitar gótico ornamental;
- evitar serif de luxo excessivamente contrastada;
- evitar aparência corporativa.

Candidatas já registradas:

1. Newsreader + IBM Plex Sans;
2. Fraunces + Source Sans 3;
3. Source Serif 4 + IBM Plex Sans.

Nenhuma família está fechada ainda.

---

## 8. Cor

Direção, ainda sem tokens finais:

**Base:** azul-negro, carvão, cinza frio, marfim/osso.<br>
**Acento:** vermelho sangue / oxblood, usado com restrição.<br>
**Atmosfera:** azuis e cinzas profundos, com âmbar/ocre apenas na área iluminada da arquitetura.

> **A noite domina; o calor aparece dentro dela.**

---

## 9. Navegação superior

Itens previstos nesta calibração:

- `Personagens`;
- `Mestre`;
- `Configurações`;
- `Sair`.

`Mestre` deve permanecer secundário. Seu comportamento completo será definido em especificação própria.

---

## 10. Conteúdo contextual

Após selecionar um personagem, mostrar apenas o essencial:

```text
CRÔNICA   Ecos de Cinzas
STATUS    Última sessão há 2 dias
```

Não mostrar nesta tela:

- Fome;
- Humanidade;
- Vitalidade;
- Força de Vontade;
- XP;
- Disciplinas;
- inventário;
- relações;
- métricas da ficha.

---

## 11. Motion

Permitido:

- dissolve;
- pequena mudança de escala;
- alteração discreta de contraste;
- deslocamento sutil;
- transição suave do avatar selecionado.

Evitar:

- bounce;
- glow pulsante;
- partículas;
- movimento contínuo do fundo;
- carrossel exagerado.

Respeitar `prefers-reduced-motion`.

---

## 12. Responsividade

### Desktop

A composição aprovada é a referência principal.

### Tablet

Manter avatares circulares, reduzir distâncias e preservar o fundo como atmosfera. Não converter automaticamente para grid de cards.

### Mobile

Exige composição própria. Prioridades:

1. seleção;
2. nome;
3. contexto;
4. CTA.

O crop do fundo deve ser dirigido para mobile.

---

## 13. Acessibilidade

Obrigatório:

- navegação por teclado;
- foco visível;
- contraste suficiente;
- áreas clicáveis adequadas;
- texto em HTML/CSS;
- estado selecionado não identificado apenas por cor;
- fallback funcional sem arte;
- suporte à redução de movimento.

---

## 14. Anti-patterns

Rejeitar alterações que introduzam:

- cards retangulares em torno de personagens;
- retratos gigantes;
- colagem de várias artes;
- UI “Netflix”;
- dashboard;
- sidebar;
- vermelho em grandes superfícies;
- símbolos inventados;
- excesso de ornamento;
- animações chamativas;
- fundo mais importante que a seleção.

---

## 15. Limites da aprovação

Esta especificação fecha **direção e composição**, mas ainda não fecha:

- família tipográfica final;
- HEX finais;
- medidas/tokens;
- comportamento completo do modo Mestre;
- assets finais dos personagens;
- asset final de produção do fundo;
- mobile high-fidelity.

A imagem aprovada é uma **calibração visual e compositiva**, não um asset obrigatório de produção.

---

## 16. Critérios de aceitação

- [ ] seleção de personagem é compreendida imediatamente;
- [ ] avatares são o mecanismo dominante;
- [ ] fundo cria atmosfera sem disputar com a interface;
- [ ] selecionado é inequívoco sem depender só do vermelho;
- [ ] `Criar personagem` está disponível sem card;
- [ ] `Mestre` aparece como ação secundária;
- [ ] Ankh aprovado é usado;
- [ ] nenhum símbolo fictício foi introduzido;
- [ ] não há sidebar ou dashboardização;
- [ ] densidade permanece baixa;
- [ ] teclado e foco funcionam;
- [ ] tela funciona sem a arte carregada.

---

## 17. Instrução resumida para implementação

> Leia esta especificação e os documentos de Design e Experiência antes de modificar o frontend. Preserve a composição aprovada. Não “modernize” a tela adicionando cards, sidebar, badges, gradientes genéricos, novos símbolos ou elementos não especificados. Trate o fundo como atmosfera e os avatares como mecanismo principal de seleção. Use dados reais/autorizados do fluxo existente, mantenha estados de carregamento/erro/vazio e forneça evidência de teclado, foco e responsividade. Alterações de direção visual exigem nova aprovação.

---

## 18. Próximo passo visual

Especificar:

**Character Gateway — Modo Mestre / Narrar v0.1**

A nova superfície deve compartilhar a mesma gramática visual, mas usar **Crônicas/mundos** como unidade principal em vez de personagens.
