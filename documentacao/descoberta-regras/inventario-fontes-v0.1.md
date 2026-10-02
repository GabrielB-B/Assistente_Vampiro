# Inventário de Fontes v0.1

**Status:** rascunho<br>
**Estado da fase:** aguardando preenchimento<br>
**Escopo:** corpus mínimo do primeiro fluxo de rolagem

---

## 1. Instrução

Cadastrar somente fontes possuídas ou acessadas legitimamente. Não inserir neste arquivo links privados, credenciais, chaves ou trechos extensos protegidos.

Usar o [template detalhado](../templates/inventario-fonte-template.md) quando uma fonte exigir análise individual.

---

## 2. Fontes candidatas

Os identificadores abaixo reservam espaço para o corpus. Nenhuma versão, tradução ou precedência está confirmada ainda.

| ID | Fonte | Edição | Idioma | Versão/errata | Uso no primeiro lote | Direitos verificados | Estado |
|---|---|---|---|---|---|---|---|
| SRC-0001 | Livro-base a confirmar | V5 | a confirmar | a confirmar | regras centrais | não | candidata |
| SRC-0002 | Errata oficial aplicável | V5 | a confirmar | a confirmar | precedência | não | candidata |
| SRC-0003 | Edição ou tradução PT-BR a confirmar | V5 | pt-BR | a confirmar | glossário | não | candidata |

---

## 3. Ordem de precedência

A precedência será definida após verificar o corpus. Hipótese a validar:

1. errata oficial mais recente aplicável;
2. texto oficial da edição e impressão adotadas;
3. tradução oficial correspondente;
4. interpretação interna revisada;
5. material secundário apenas como apoio, nunca como fonte de verdade.

---

## 4. Decisões do corpus normativo

| Decisão | Valor atual | Impacto |
|---|---|---|
| edição e impressão exatas | pendente | bloqueia aprovação de regras |
| idioma normativo da mecânica | pendente | bloqueia regras com divergências |
| tradução usada na interface | pendente | bloqueia termos definitivos de UI |
| erratas aplicáveis | pendente | bloqueia aprovação das regras afetadas |
| ordem de precedência | hipótese ainda não aprovada | bloqueia aprovação quando houver conflito |
| regras opcionais excluídas | pendente | bloqueia o fechamento do recorte |
| acesso legítimo a cada fonte | pendente | bloqueia leitura e extração privada |
| direitos para publicação ou distribuição | pendente | não bloqueia descoberta privada; bloqueia o uso correspondente |

---

## 5. Checklist por fonte

- [ ] posse ou acesso legítimo confirmado;
- [ ] edição confirmada;
- [ ] impressão ou versão confirmada;
- [ ] idioma confirmado;
- [ ] errata localizada;
- [ ] capítulos relevantes identificados;
- [ ] permissão de armazenamento definida;
- [ ] permissão de exibição/distribuição definida;
- [ ] responsável pela revisão registrado.

---

## 6. Conteúdo fora do Git

Arquivos originais devem permanecer em:

```text
fontes-privadas/
```

Essa pasta é ignorada pelo repositório. O inventário registra metadados e decisões, não reproduções integrais.
