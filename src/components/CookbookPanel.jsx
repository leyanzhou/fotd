export function CookbookPanel({ recipes }) {
  if (!recipes.length) {
    return (
      <section className="card panel-card">
        <div className="section-header section-header--compact">
          <div>
            <p className="eyebrow">My Cookbook</p>
            <h2>Your first recipe starts here</h2>
          </div>
        </div>
        <p className="empty-state">Combine saved ingredients in the kitchen to unlock your own dish cards.</p>
      </section>
    );
  }

  return (
    <section className="card panel-card">
      <div className="section-header section-header--compact">
        <div>
          <p className="eyebrow">My Cookbook</p>
          <h2>Collected dishes</h2>
        </div>
        <span className="status-pill">{recipes.length} saved</span>
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <article key={recipe.id} className="recipe-card">
            <img className="recipe-card__art" src={recipe.iconUrl} alt={recipe.name} />
            <div className="recipe-card__body">
              <h3>{recipe.name}</h3>
              <p>{recipe.ingredients.join(' + ')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
