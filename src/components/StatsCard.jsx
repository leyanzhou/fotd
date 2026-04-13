export function StatsCard({ label, value, hint, accent = 'default' }) {
  return (
    <article className={`card stat-card stat-card--${accent}`}>
      <p className="eyebrow">{label}</p>
      <h2>{value}</h2>
      <p className="muted">{hint}</p>
    </article>
  );
}
