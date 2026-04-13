import { useMemo, useState } from 'react';

export function KitchenPanel({ inventory, onCreateRecipe }) {
  const availableIngredients = useMemo(
    () => inventory.filter((item) => !item.usedInRecipeId),
    [inventory],
  );
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [recipeName, setRecipeName] = useState('');

  const toggleIngredient = (ingredientId) => {
    setSelectedIngredientIds((current) =>
      current.includes(ingredientId)
        ? current.filter((id) => id !== ingredientId)
        : [...current, ingredientId],
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!recipeName.trim() || selectedIngredientIds.length === 0) {
      return;
    }

    onCreateRecipe({
      name: recipeName.trim(),
      ingredientIds: selectedIngredientIds,
    });
    setRecipeName('');
    setSelectedIngredientIds([]);
  };

  return (
    <section className="card kitchen-panel">
      <div className="section-header section-header--compact">
        <div>
          <p className="eyebrow">My Kitchen</p>
          <h2>Mix what you have today</h2>
        </div>
        <span className="status-pill">{availableIngredients.length} ingredients ready</span>
      </div>

      <form className="kitchen-form" onSubmit={handleSubmit}>
        <label>
          Dish name
          <input
            className="kitchen-input"
            placeholder="Tomato egg scramble"
            value={recipeName}
            onChange={(event) => setRecipeName(event.target.value)}
          />
        </label>

        <div>
          <p className="kitchen-subtitle">Choose ingredients</p>
          {availableIngredients.length ? (
            <div className="ingredient-grid">
              {availableIngredients.map((item) => {
                const selected = selectedIngredientIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    className={selected ? 'ingredient-chip ingredient-chip--selected' : 'ingredient-chip'}
                    type="button"
                    onClick={() => toggleIngredient(item.id)}
                  >
                    <span>{item.name}</span>
                    <small>{item.mealType}</small>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="empty-state">
              No free ingredients yet. Log a meal and we will drop one into your kitchen.
            </p>
          )}
        </div>

        <div className="kitchen-actions">
          <p className="muted">
            {selectedIngredientIds.length
              ? `${selectedIngredientIds.length} ingredient${selectedIngredientIds.length === 1 ? '' : 's'} selected`
              : 'Select one or more ingredients to start cooking.'}
          </p>
          <button
            className="primary-button"
            type="submit"
            disabled={!recipeName.trim() || selectedIngredientIds.length === 0}
          >
            Save to cookbook
          </button>
        </div>
      </form>
    </section>
  );
}
