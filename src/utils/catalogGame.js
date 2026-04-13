import { INGREDIENTS_BY_ID, INGREDIENT_IDS_BY_MEAL } from '../data/catalog';

function hashSeed(value) {
  return Array.from(value).reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);
}

export function getRandomIngredientId(mealType, seedHint = '') {
  const pool = INGREDIENT_IDS_BY_MEAL[mealType] ?? INGREDIENT_IDS_BY_MEAL.breakfast;
  const seed = hashSeed(`${mealType}-${seedHint}-${Date.now()}-${Math.random()}`);
  return pool[seed % pool.length];
}

export function buildIngredientCounts(inventory) {
  return inventory.reduce((result, item) => {
    if (!item.ingredientId || !INGREDIENTS_BY_ID[item.ingredientId]) {
      return result;
    }

    result[item.ingredientId] = (result[item.ingredientId] ?? 0) + 1;
    return result;
  }, {});
}

export function canCraftRecipe(recipe, inventoryCounts) {
  return recipe.ingredientIds.every((ingredientId) => (inventoryCounts[ingredientId] ?? 0) > 0);
}

export function consumeIngredients(inventory, ingredientIds) {
  const remaining = [...ingredientIds];

  return inventory.filter((item) => {
    const index = remaining.indexOf(item.ingredientId);
    if (index === -1) {
      return true;
    }

    remaining.splice(index, 1);
    return false;
  });
}

export function formatIngredientList(ids) {
  return ids.map((ingredientId) => INGREDIENTS_BY_ID[ingredientId]?.name ?? ingredientId).join(' + ');
}
