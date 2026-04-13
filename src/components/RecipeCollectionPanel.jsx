export function RecipeCollectionPanel({
  recipes,
  unlockedRecipeIds,
  selectedRecipe,
  inventoryCounts,
  canCraftSelectedRecipe,
  onSelectRecipe,
  onCraftRecipe,
}) {
  const hasSelection = Boolean(selectedRecipe);

  return (
    <div className={hasSelection ? 'cookbook-layout cookbook-layout--selected' : 'cookbook-layout'}>
      <section className={hasSelection ? 'card panel-card cookbook-list-card' : 'card panel-card'}>
        <div className="section-header section-header--compact">
          <div>
            <p className="eyebrow">My Cookbook</p>
            <h2>Dish collection</h2>
          </div>
          <span className="status-pill">{unlockedRecipeIds.length} / {recipes.length}</span>
        </div>

        <div className="recipe-grid">
          {recipes.map((recipe) => {
            const unlocked = unlockedRecipeIds.includes(recipe.id);

            return (
              <button
                key={recipe.id}
                className={
                  selectedRecipe?.id === recipe.id
                    ? 'recipe-card recipe-card--button recipe-card--selected'
                    : 'recipe-card recipe-card--button'
                }
                type="button"
                onClick={() => onSelectRecipe(recipe.id)}
              >
                <img
                  className={unlocked ? 'recipe-card__art' : 'recipe-card__art recipe-card__art--locked'}
                  src={recipe.iconUrl}
                  alt={recipe.name}
                />
                <div className="recipe-card__body">
                  <h3>{recipe.name}</h3>
                  <p>{unlocked ? '已收录' : '未解锁'}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {hasSelection ? (
        <section className="card panel-card recipe-detail-card">
          <div className="section-header section-header--compact">
            <div>
              <p className="eyebrow">Recipe Detail</p>
              <h2>{selectedRecipe.name}</h2>
            </div>
            <span
              className={
                unlockedRecipeIds.includes(selectedRecipe.id)
                  ? 'status-pill status-pill--complete'
                  : 'status-pill'
              }
            >
              {unlockedRecipeIds.includes(selectedRecipe.id) ? '已点亮' : canCraftSelectedRecipe ? '可合成' : '灰色图鉴'}
            </span>
          </div>

          <div className="recipe-detail">
            <img
              className={
                unlockedRecipeIds.includes(selectedRecipe.id)
                  ? 'recipe-detail__art'
                  : 'recipe-detail__art recipe-detail__art--locked'
              }
              src={selectedRecipe.iconUrl}
              alt={selectedRecipe.name}
            />
            <div className="recipe-detail__body">
              <p className="muted">合成材料</p>
              <div className="recipe-requirements">
                {selectedRecipe.ingredients.map((ingredient) => {
                  const count = inventoryCounts[ingredient.id] ?? 0;
                  const ready = count > 0;

                  return (
                    <div
                      key={ingredient.id}
                      className={ready ? 'requirement-chip requirement-chip--ready' : 'requirement-chip'}
                    >
                      <span>{ingredient.name}</span>
                      <small>{ready ? `已拥有 x ${count}` : '未拥有'}</small>
                    </div>
                  );
                })}
              </div>

              <div className="kitchen-actions">
                <p className="muted">
                  {unlockedRecipeIds.includes(selectedRecipe.id)
                    ? '这道菜已经在你的菜谱背包里点亮了。'
                    : canCraftSelectedRecipe
                      ? '材料已经到齐，现在可以把这道菜点亮。'
                      : '先去打卡收集缺少的食材，再回来解锁。'}
                </p>
                <button
                  className="primary-button"
                  type="button"
                  disabled={!canCraftSelectedRecipe || unlockedRecipeIds.includes(selectedRecipe.id)}
                  onClick={() => onCraftRecipe(selectedRecipe.id)}
                >
                  {unlockedRecipeIds.includes(selectedRecipe.id) ? '已收录' : '点亮这道菜'}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
