const foundationChecks = [
  ["Web", "Next.js ativo"],
  ["API", "Contrato de saúde disponível"],
  ["Produto", "Vertical Slice 01 ainda não iniciado"],
] as const;

export default function HomePage() {
  return (
    <main className="foundation-shell">
      <section aria-labelledby="foundation-title" className="foundation-panel">
        <p className="foundation-kicker">Engineering Foundation · FND-01</p>
        <h1 id="foundation-title">Assistente Vampiro</h1>
        <p className="foundation-summary">
          A base técnica está viva. Esta superfície confirma o ambiente sem antecipar a
          interface aprovada para o produto.
        </p>

        <dl aria-label="Estado da fundação" className="foundation-status">
          {foundationChecks.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <p className="foundation-note" role="status">
          Identidade visual final e fluxos de jogo entram somente nos cortes autorizados.
        </p>
      </section>
    </main>
  );
}
