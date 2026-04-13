export function RecipeCollectionDialogPanel({
  recipes,
  unlockedRecipeIds,
  selectedRecipe,
  inventoryCounts,
  canCraftSelectedRecipe,
  onSelectRecipe,
  onCraftRecipe,
}) {
  const hasSelection = Boolean(selectedRecipe);
  const selectedUnlocked = hasSelection && unlockedRecipeIds.includes(selectedRecipe.id);

  return (
    <div className="cookbook-layout">
      <section className="card panel-card cookbook-list-card">
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
                className="recipe-card recipe-card--button"
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
        <div className="modal-backdrop" onClick={() => onSelectRecipe(null)} role="presentation">
          <section
            className="modal card recipe-detail-card recipe-detail-modal"
            onClick={(event) => event.stopPropagation()}
            aria-label="Recipe detail"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Recipe Detail</p>
                <h2>{selectedRecipe.name}</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => onSelectRecipe(null)}
                type="button"
                aria-label="Close recipe detail"
              >
                x
              </button>
            </div>

            <span className={selectedUnlocked ? 'status-pill status-pill--complete' : 'status-pill'}>
              {selectedUnlocked ? '已点亮' : canCraftSelectedRecipe ? '可合成' : '灰色图鉴'}
            </span>

            <div className="recipe-detail">
              <img
                className={selectedUnlocked ? 'recipe-detail__art' : 'recipe-detail__art recipe-detail__art--locked'}
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
                    {selectedUnlocked
                      ? '这道菜已经在你的菜谱背包里点亮了。'
                      : canCraftSelectedRecipe
                        ? '材料已经到齐，现在可以把这道菜点亮。'
                        : '先去打卡收集缺少的食材，再回来解锁。'}
                  </p>
                  <button
                    className="primary-button"
                    type="button"
                    disabled={!canCraftSelectedRecipe || selectedUnlocked}
                    onClick={() => onCraftRecipe(selectedRecipe.id)}
                  >
                    {selectedUnlocked ? '已收录' : '点亮这道菜'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
