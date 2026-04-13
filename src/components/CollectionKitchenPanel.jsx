import { INGREDIENTS_BY_ID, MEAL_LABELS } from '../data/catalog';

export function CollectionKitchenPanel({
  inventoryCounts,
  availableIngredientIds,
  craftableRecipes,
  onCraftRecipe,
}) {
  return (
    <div className="kitchen-layout">
      <section className="card panel-card">
        <div className="section-header section-header--compact">
          <div>
            <p className="eyebrow">My Kitchen</p>
            <h2>Pantry ingredients</h2>
          </div>
          <span className="status-pill">{availableIngredientIds.length} kinds</span>
        </div>

        {availableIngredientIds.length ? (
          <div className="ingredient-grid">
            {availableIngredientIds.map((ingredientId) => {
              const ingredient = INGREDIENTS_BY_ID[ingredientId];

              return (
                <article key={ingredientId} className="ingredient-chip ingredient-chip--static">
                  <span>{ingredient.name}</span>
                  <small>
                    {MEAL_LABELS[ingredient.mealType]} x {inventoryCounts[ingredientId]}
                  </small>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="empty-state">还没有食材，先去打卡一餐领一份奖励吧。</p>
        )}
      </section>

      <section className="card panel-card">
        <div className="section-header section-header--compact">
          <div>
            <p className="eyebrow">Craftable</p>
            <h2>Ready to cook</h2>
          </div>
          <span className="status-pill">{craftableRecipes.length} ready</span>
        </div>

        {craftableRecipes.length ? (
          <div className="recipe-mini-grid">
            {craftableRecipes.map((recipe) => (
              <button
                key={recipe.id}
                className="recipe-mini-card"
                type="button"
                onClick={() => onCraftRecipe(recipe.id)}
              >
                <img src={recipe.iconUrl} alt={recipe.name} />
                <span>{recipe.name}</span>
                <small>材料已集齐，点击点亮</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="empty-state">继续收集食材，凑齐配方后这里就会亮起来。</p>
        )}
      </section>
    </div>
  );
}
