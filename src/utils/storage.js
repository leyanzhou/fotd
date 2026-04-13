const MEAL_ENTRIES_KEY = 'fotd.mealEntries.v1';
const INVENTORY_KEY = 'fotd.inventory.v2';
const RECIPES_KEY = 'fotd.cookbook.v2';
const USER_PROFILE_KEY = 'fotd.userProfile.v1';

function loadArray(key, label) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to load ${label}`, error);
    return [];
  }
}

function saveArray(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadMealEntries() {
  return loadArray(MEAL_ENTRIES_KEY, 'meal entries');
}

export function saveMealEntries(entries) {
  saveArray(MEAL_ENTRIES_KEY, entries);
}

export function loadInventory() {
  return loadArray(INVENTORY_KEY, 'inventory');
}

export function saveInventory(items) {
  saveArray(INVENTORY_KEY, items);
}

export function loadRecipes() {
  return loadArray(RECIPES_KEY, 'recipes');
}

export function saveRecipes(recipes) {
  saveArray(RECIPES_KEY, recipes);
}

export function loadUserProfile() {
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed?.name ? parsed : null;
  } catch (error) {
    console.error('Failed to load user profile', error);
    return null;
  }
}

export function saveUserProfile(profile) {
  window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}
