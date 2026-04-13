function wrapIcon(content, { background = '#fffaf2', accent = '#f1ddc2' } = {}) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img">
      <rect x="8" y="8" width="164" height="164" rx="34" fill="${background}" />
      <rect x="18" y="18" width="144" height="144" rx="28" fill="${accent}" opacity="0.35" />
      ${content}
    </svg>
  `.trim();
}

function stroke(content) {
  return `<g fill="none" stroke="#2d2419" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${content}</g>`;
}

function ingredientShape(iconKey) {
  const shapes = {
    egg: '<ellipse cx="90" cy="94" rx="36" ry="46" />',
    tomato: '<circle cx="90" cy="96" r="34" /><path d="M90 56l-10 10M90 56l10 10M90 56v-12" />',
    lettuce: '<path d="M58 118c0-26 16-46 32-46 8 0 14 5 19 12 5-7 11-12 19-12 16 0 32 20 32 46-16 6-33 10-51 10s-35-4-51-10z" /><path d="M90 74v48M70 90c6 8 12 12 20 15M110 90c-6 8-12 12-20 15" />',
    milk: '<path d="M68 54h44l-4 18v56H72V72z" /><path d="M76 54v-10h28v10" />',
    bread: '<path d="M60 78c0-16 12-30 30-30s30 14 30 30v42H60z" /><path d="M60 98h60" />',
    oats: '<path d="M66 116c0-16 10-28 24-28 7 0 12 3 17 8 5-5 10-8 17-8 14 0 24 12 24 28H66z" /><path d="M82 78c0-14 8-24 8-24M98 74c0-16 10-28 10-28M114 80c0-12 8-20 8-20" />',
    banana: '<path d="M60 108c26 18 54 14 76-10-8 26-26 42-52 42-12 0-20-12-24-32z" />',
    blueberry: '<circle cx="72" cy="98" r="16" /><circle cx="108" cy="98" r="16" /><circle cx="90" cy="74" r="16" />',
    avocado: '<path d="M90 48c26 16 40 38 40 60 0 22-18 40-40 40s-40-18-40-40c0-22 14-44 40-60z" /><circle cx="90" cy="106" r="14" />',
    yogurt: '<path d="M68 62h44v14l8 44H60l8-44z" /><path d="M80 62V50h20v12" />',
    cheese: '<path d="M58 118l22-54h42v54z" /><circle cx="100" cy="84" r="4" /><circle cx="92" cy="102" r="5" />',
    corn: '<path d="M90 56c18 0 28 14 28 34s-10 34-28 34-28-14-28-34 10-34 28-34z" /><path d="M70 74c-12 10-18 24-18 42M110 74c12 10 18 24 18 42" />',
    cucumber: '<path d="M62 108c0-24 16-42 36-42 12 0 22 8 26 20 4 12 0 30-12 42-6 6-16 10-26 10-14 0-24-12-24-30z" />',
    spinach: '<path d="M90 54c24 14 34 32 34 54-12 12-24 18-34 18s-22-6-34-18c0-22 10-40 34-54z" /><path d="M90 60v60" />',
    mushroom: '<path d="M58 92c6-18 18-28 32-28s26 10 32 28H58z" /><path d="M80 92v28h20V92" />',
    sweetPotato: '<path d="M56 102c0-24 18-42 40-42 16 0 28 14 28 28 0 26-18 44-42 44-14 0-26-10-26-30z" />',
    tofu: '<rect x="62" y="62" width="56" height="56" rx="10" /><path d="M74 76h32M74 92h20M74 108h28" />',
    chicken: '<path d="M72 74c14-8 34-6 46 6s12 30 0 42c-12 12-30 14-44 4-14-10-18-36-2-52z" /><path d="M66 72l-12-10M58 76l-10-4" />',
    beef: '<path d="M58 102c0-20 18-36 40-36 16 0 28 8 34 22-4 22-22 40-44 40-18 0-30-10-30-26z" />',
    pork: '<ellipse cx="90" cy="96" rx="36" ry="28" /><circle cx="78" cy="96" r="4" /><circle cx="102" cy="96" r="4" />',
    shrimp: '<path d="M120 84c0 26-18 44-42 44-14 0-24-10-24-22 0-12 8-18 18-20-4-10 0-20 10-26 12-8 26-8 38 0" /><path d="M120 84l12-12M120 98l16 0" />',
    broccoli: '<path d="M76 104c-14 0-24-10-24-22s10-22 24-22c6 0 12 2 16 6 4-4 10-6 16-6 14 0 24 10 24 22s-10 22-24 22H76z" /><path d="M90 104v26" />',
    bellPepper: '<path d="M68 74c0-12 8-18 22-18s22 6 22 18c14 10 16 42 0 54H68c-16-12-14-44 0-54z" /><path d="M90 56v-10" />',
    onion: '<path d="M90 54c20 18 30 34 30 52 0 18-12 34-30 34s-30-16-30-34c0-18 10-34 30-52z" /><path d="M90 58v58" />',
    carrot: '<path d="M74 68l32 48-24 14-20-54z" /><path d="M82 60l-8-10M90 58l4-12M98 62l10-10" />',
    rice: '<path d="M64 118c0-14 10-24 26-24 8 0 14 2 18 6 4-4 10-6 18-6 16 0 26 10 26 24H64z" />',
    noodles: '<path d="M58 110c18-14 46-14 64 0M62 96c16-12 40-12 56 0M70 82c10-8 20-8 30 0" /><path d="M56 118h68" />',
    eggplant: '<path d="M64 118c-6-24 6-50 28-58 10-4 20-2 28 6-2 18-12 36-30 48-10 6-20 8-26 4z" /><path d="M112 62l10-10" />',
    potato: '<ellipse cx="90" cy="98" rx="34" ry="28" /><circle cx="78" cy="90" r="3" /><circle cx="102" cy="106" r="3" />',
    garlic: '<path d="M90 62c18 0 28 16 28 30 0 18-12 34-28 34s-28-16-28-34c0-14 10-30 28-30z" /><path d="M90 62v-12" />',
    scallion: '<path d="M76 120c0-22 4-40 10-58M92 120c0-22 4-40 10-58M108 120c0-22 4-40 10-58" />',
    cabbage: '<path d="M62 108c0-26 18-44 40-44s40 18 40 44c-12 12-28 18-40 18s-28-6-40-18z" /><path d="M102 68c-6 10-10 22-10 42" />',
    blackFungus: '<path d="M68 120c-12-6-18-18-18-30 0-18 14-34 34-34 8 0 16 4 22 10 6-6 14-10 22-10 12 0 22 10 22 22 0 22-20 42-52 42-12 0-22 0-30 0z" />',
    peanut: '<path d="M76 76c0-10 8-18 18-18s18 8 18 18v28c0 10-8 18-18 18s-18-8-18-18z" /><path d="M76 90h36" />',
    salmon: '<path d="M56 96c14-18 34-28 56-28 8 0 16 2 24 6-8 22-28 42-60 42-10 0-18-6-20-20z" /><path d="M118 78l18 10-18 10" />',
    fish: '<path d="M54 94c18-18 38-28 58-28 10 0 20 2 28 8-8 20-28 38-58 38-12 0-24-6-28-18z" /><path d="M112 76l18 10-18 10" />',
    pumpkin: '<path d="M90 56c24 0 40 18 40 40s-16 40-40 40-40-18-40-40 16-40 40-40z" /><path d="M90 48v14M72 62c6 10 10 20 10 34M108 62c-6 10-10 20-10 34" />',
    lotusRoot: '<circle cx="90" cy="92" r="32" /><circle cx="90" cy="92" r="8" /><circle cx="76" cy="82" r="5" /><circle cx="104" cy="82" r="5" /><circle cx="76" cy="104" r="5" /><circle cx="104" cy="104" r="5" />',
    ginger: '<path d="M74 116c-10 0-18-8-18-18s8-18 18-18c0-10 8-18 18-18 10 0 18 8 18 18 10 0 18 8 18 18s-8 18-18 18H74z" />',
    chili: '<path d="M64 112c0-20 14-38 36-42 12-2 22 0 32 8-8 24-26 42-48 46-12 2-20-2-20-12z" /><path d="M114 68l8-10" />',
    bokChoy: '<path d="M76 126c-10-8-16-18-16-30 0-14 8-26 20-32 2 22 8 42 16 62-8 0-14 0-20 0zM104 126c10-8 16-18 16-30 0-14-8-26-20-32-2 22-8 42-16 62 8 0 14 0 20 0z" />',
    napaCabbage: '<path d="M90 54c22 14 34 36 34 56 0 20-14 34-34 34s-34-14-34-34c0-20 12-42 34-56z" /><path d="M90 60v66" />',
    tofuSkin: '<path d="M62 74h56v44H62z" /><path d="M62 86c14 8 42 8 56 0M62 100c14 8 42 8 56 0" />',
    snowPea: '<path d="M60 108c12-24 34-38 60-38 4 20-10 42-32 50-10 4-22 0-28-12z" /><circle cx="84" cy="92" r="3" /><circle cx="98" cy="88" r="3" /><circle cx="112" cy="86" r="3" />',
    cauliflower: '<path d="M76 108c-14 0-24-10-24-22s10-22 24-22c6 0 12 2 16 6 4-4 10-6 16-6 14 0 24 10 24 22s-10 22-24 22H76z" /><path d="M90 108v22" />',
    celery: '<path d="M74 124c0-30 4-48 8-60M90 124c0-30 4-48 8-60M106 124c0-30 4-48 8-60" /><path d="M72 64l-10-10M90 60l0-12M108 64l10-10" />',
    sausage: '<path d="M64 116c0-12 12-24 26-24h18c14 0 26 12 26 24-8 8-18 12-26 12H90c-8 0-18-4-26-12z" />',
    seaweed: '<path d="M72 126c0-30 0-48 10-68M92 126c0-28 4-50 16-72M112 126c0-20 6-40 18-56" />',
    zucchini: '<path d="M60 108c0-22 20-40 46-40 12 0 24 4 34 12-10 20-32 38-58 38-14 0-22-2-22-10z" />',
    radish: '<path d="M90 70c18 0 30 14 30 30 0 18-14 30-30 30S60 118 60 100c0-16 12-30 30-30z" /><path d="M90 70V52M74 58l-10-10M106 58l10-10" />',
  };

  return shapes[iconKey] ?? '<circle cx="90" cy="90" r="34" />';
}

function dishAccent(iconKey) {
  const colors = {
    tomato: '#ffd1cc',
    egg: '#fff0bf',
    broccoli: '#d9f3d8',
    tofu: '#f3efe3',
    beef: '#f4d2cf',
    bellPepper: '#d6efc9',
    shrimp: '#ffd9cf',
    noodles: '#f5e5bf',
    pumpkin: '#ffe0b2',
    salmon: '#ffd2c7',
    rice: '#f5f0dc',
    lettuce: '#dbefd7',
  };

  return colors[iconKey] ?? '#efe3d0';
}

function miniIngredient(iconKey, x, y, scale = 0.34) {
  return `<g transform="translate(${x} ${y}) scale(${scale})">${stroke(ingredientShape(iconKey))}</g>`;
}

export function buildIngredientIllustration(ingredient) {
  const svg = wrapIcon(stroke(ingredientShape(ingredient.iconKey)), {
    background: '#fffaf2',
    accent: dishAccent(ingredient.iconKey),
  });

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildRecipeIllustration(recipe) {
  const accent = dishAccent(recipe.iconKeys[0]);
  const icons = recipe.iconKeys.slice(0, 3);
  const svg = wrapIcon(
    `
      <ellipse cx="90" cy="112" rx="54" ry="22" fill="#fff" stroke="#2d2419" stroke-width="6" />
      <ellipse cx="90" cy="112" rx="38" ry="12" fill="${accent}" opacity="0.55" />
      ${miniIngredient(icons[0], 28, 42)}
      ${miniIngredient(icons[1] ?? icons[0], 70, 30)}
      ${miniIngredient(icons[2] ?? icons[0], 98, 54)}
    `,
    {
      background: '#fffaf2',
      accent,
    },
  );

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
