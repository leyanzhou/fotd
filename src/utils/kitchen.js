const INGREDIENT_POOLS = {
  breakfast: ['Egg', 'Tomato', 'Spinach', 'Avocado', 'Oats', 'Blueberries', 'Yogurt', 'Mushroom'],
  lunch: ['Chicken', 'Beef', 'Broccoli', 'Rice', 'Tofu', 'Bell Pepper', 'Corn', 'Shrimp'],
  dinner: ['Salmon', 'Pork', 'Potato', 'Carrot', 'Pumpkin', 'Noodles', 'Onion', 'Cabbage'],
};

function hashSeed(value) {
  return Array.from(value).reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0);
}

export function getRandomIngredient(mealType, seedHint = '') {
  const pool = INGREDIENT_POOLS[mealType] ?? INGREDIENT_POOLS.breakfast;
  const seed = hashSeed(`${mealType}-${seedHint}-${Date.now()}-${Math.random()}`);
  return pool[seed % pool.length];
}

function getRecipePalette(name) {
  const palettes = [
    ['#ffb36a', '#ff7a59', '#fff0d2'],
    ['#7fd1b9', '#2d8f85', '#effcf7'],
    ['#f7a6c6', '#db4f89', '#fff1f7'],
    ['#9db5ff', '#5a72d8', '#eef2ff'],
    ['#ffd36b', '#d68b2d', '#fff8dc'],
  ];

  return palettes[hashSeed(name) % palettes.length];
}

export function buildRecipeIllustration(name, ingredients) {
  const [primary, accent, background] = getRecipePalette(name);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || 'FD';
  const ingredientText = ingredients.slice(0, 3).join(' • ');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" role="img" aria-label="${name}">
      <rect width="160" height="160" rx="28" fill="${background}" />
      <circle cx="48" cy="46" r="20" fill="${primary}" opacity="0.92" />
      <circle cx="117" cy="54" r="14" fill="${accent}" opacity="0.82" />
      <rect x="24" y="78" width="112" height="58" rx="24" fill="${primary}" />
      <rect x="33" y="87" width="94" height="40" rx="20" fill="white" opacity="0.25" />
      <text x="80" y="113" text-anchor="middle" font-size="30" font-family="Arial, sans-serif" font-weight="700" fill="#2d2419">${initials}</text>
      <text x="80" y="146" text-anchor="middle" font-size="9" font-family="Arial, sans-serif" fill="#5f5140">${ingredientText}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getAvailableIngredients(inventory) {
  return inventory.filter((item) => !item.usedInRecipeId);
}
