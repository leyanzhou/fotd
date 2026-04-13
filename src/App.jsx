import { useEffect, useState } from 'react';
import { CalendarView } from './components/CalendarPanel';
import { CollectionKitchenPanel } from './components/CollectionKitchenPanel';
import { DayDetails } from './components/DayDetails';
import { HistoryList } from './components/HistoryList';
import { LoginScreen } from './components/LoginScreen';
import { QuickAddMeal } from './components/QuickAddMealDialog';
import { RecipeCollectionPanel } from './components/RecipeCollectionPanel';
import { StatsCard } from './components/StatsCard';
import { INGREDIENTS_BY_ID, MEAL_LABELS, RECIPES, RECIPES_BY_ID } from './data/catalog';
import {
  buildIngredientCounts,
  canCraftRecipe,
  consumeIngredients,
  getRandomIngredientId,
} from './utils/catalogGame';
import { toDateKey } from './utils/date';
import { buildIngredientIllustration, buildRecipeIllustration } from './utils/rewardArt';
import {
  loadInventory,
  loadMealEntries,
  loadRecipes,
  loadUserProfile,
  saveInventory,
  saveMealEntries,
  saveRecipes,
  saveUserProfile,
} from './utils/storage';
import { buildDailySummary, getCurrentStreak, getLongestStreak } from './utils/streaks';

const TABS = {
  dashboard: 'dashboard',
  history: 'history',
  kitchen: 'kitchen',
  cookbook: 'cookbook',
};

const ENRICHED_RECIPES = RECIPES.map((recipe) => ({
  ...recipe,
  ingredients: recipe.ingredientIds.map((ingredientId) => INGREDIENTS_BY_ID[ingredientId]),
  iconUrl: buildRecipeIllustration(recipe),
}));

function normalizeInventory(items) {
  return items.filter((item) => item.ingredientId && INGREDIENTS_BY_ID[item.ingredientId]);
}

function normalizeUnlockedRecipes(recipeIds) {
  return recipeIds.filter((recipeId) => RECIPES_BY_ID[recipeId]);
}

function createMealEntry(values) {
  const now = new Date();
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${now.getTime()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    createdAt: now.toISOString(),
    dateKey: toDateKey(now),
    mealType: values.mealType,
    text: values.text,
    imageUrl: values.imageUrl,
  };
}

export default function App() {
  const [entries, setEntries] = useState(() => loadMealEntries());
  const [inventory, setInventory] = useState(() => normalizeInventory(loadInventory()));
  const [unlockedRecipeIds, setUnlockedRecipeIds] = useState(() => normalizeUnlockedRecipes(loadRecipes()));
  const [activeTab, setActiveTab] = useState(TABS.dashboard);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(new Date()));
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [latestReward, setLatestReward] = useState('');
  const [rewardModal, setRewardModal] = useState(null);
  const [userProfile, setUserProfile] = useState(() => loadUserProfile());

  useEffect(() => {
    window.localStorage.removeItem('fotd.recipes.v1');
    window.localStorage.removeItem('fotd.inventory.v1');
  }, []);

  useEffect(() => {
    saveMealEntries(entries);
  }, [entries]);

  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);

  useEffect(() => {
    saveRecipes(unlockedRecipeIds);
  }, [unlockedRecipeIds]);

  const sortedEntries = [...entries].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const summaryByDate = buildDailySummary(entries);
  const currentStreak = getCurrentStreak(entries);
  const longestStreak = getLongestStreak(entries);
  const todayKey = toDateKey(new Date());
  const todayEntries = summaryByDate[todayKey]?.entries.length ?? 0;
  const selectedEntries = summaryByDate[selectedDateKey]?.entries ?? [];
  const inventoryCounts = buildIngredientCounts(inventory);
  const availableIngredientIds = Object.keys(inventoryCounts).sort((left, right) =>
    (INGREDIENTS_BY_ID[left]?.name ?? left).localeCompare(INGREDIENTS_BY_ID[right]?.name ?? right, 'zh-Hans-CN'),
  );
  const selectedRecipe = ENRICHED_RECIPES.find((recipe) => recipe.id === selectedRecipeId) ?? null;
  const canCraftSelectedRecipe = selectedRecipe ? canCraftRecipe(selectedRecipe, inventoryCounts) : false;
  const craftableRecipes = ENRICHED_RECIPES.filter(
    (recipe) => !unlockedRecipeIds.includes(recipe.id) && canCraftRecipe(recipe, inventoryCounts),
  );

  const handleAddMeal = async (values) => {
    const entry = createMealEntry(values);
    const ingredientId = getRandomIngredientId(values.mealType, entry.id);
    const ingredient = INGREDIENTS_BY_ID[ingredientId];
    const reward = {
      id: `${entry.id}-ingredient`,
      ingredientId,
      name: ingredient.name,
      mealType: values.mealType,
      earnedAt: entry.createdAt,
      sourceEntryId: entry.id,
      iconUrl: buildIngredientIllustration(ingredient),
    };

    setEntries((current) => [entry, ...current]);
    setInventory((current) => [reward, ...current]);
    setSelectedDateKey(entry.dateKey);
    setVisibleMonth(new Date(entry.createdAt));
    setRewardModal(reward);
    return reward;
  };

  const handleChangeMonth = (direction) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1),
    );
  };

  const handleJumpToMonth = (year, month) => {
    setVisibleMonth(new Date(year, month, 1));
  };

  const handleCraftRecipe = (recipeId) => {
    const recipe = RECIPES_BY_ID[recipeId];
    if (!recipe || unlockedRecipeIds.includes(recipeId) || !canCraftRecipe(recipe, inventoryCounts)) {
      return;
    }

    setInventory((current) => consumeIngredients(current, recipe.ingredientIds));
    setUnlockedRecipeIds((current) => [...current, recipeId]);
  };

  const completedDays = Object.keys(summaryByDate).length;

  const handleLogin = (name) => {
    const profile = {
      name,
      createdAt: new Date().toISOString(),
    };

    saveUserProfile(profile);
    setUserProfile(profile);
  };

  if (!userProfile) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">fotd</p>
          <h1>Track one meal a day. Keep the streak alive.</h1>
          <p className="hero-copy">
            Log one meal, keep your streak alive, and unlock ingredients to build your own playful cookbook.
          </p>
        </div>
        <div className="hero-chip">
          <span className="hero-chip__label">Player</span>
          <strong>{userProfile.name}</strong>
        </div>
        <div className="hero-chip">
          <span className="hero-chip__label">Today</span>
          <strong>{todayEntries ? 'Completed' : 'Still open'}</strong>
          {latestReward ? <p className="hero-chip__hint">{latestReward}</p> : null}
        </div>
      </header>

      <nav className="tab-bar" aria-label="Main navigation">
        <button
          className={activeTab === TABS.dashboard ? 'tab-bar__button tab-bar__button--active' : 'tab-bar__button'}
          onClick={() => setActiveTab(TABS.dashboard)}
          type="button"
        >
          Dashboard
        </button>
        <button
          className={activeTab === TABS.history ? 'tab-bar__button tab-bar__button--active' : 'tab-bar__button'}
          onClick={() => setActiveTab(TABS.history)}
          type="button"
        >
          History
        </button>
        <button
          className={activeTab === TABS.kitchen ? 'tab-bar__button tab-bar__button--active' : 'tab-bar__button'}
          onClick={() => setActiveTab(TABS.kitchen)}
          type="button"
        >
          My Kitchen
        </button>
        <button
          className={activeTab === TABS.cookbook ? 'tab-bar__button tab-bar__button--active' : 'tab-bar__button'}
          onClick={() => setActiveTab(TABS.cookbook)}
          type="button"
        >
          My Cookbook
        </button>
      </nav>

      {activeTab === TABS.dashboard ? (
        <main className="dashboard-layout">
          <section className="stats-grid">
            <StatsCard
              label="Current streak"
              value={`${currentStreak} day${currentStreak === 1 ? '' : 's'}`}
              hint={todayEntries ? '今天已经保住连胜。' : '今天打卡一餐就能保住连胜。'}
              accent="warm"
            />
            <StatsCard
              label="Longest streak"
              value={`${longestStreak} day${longestStreak === 1 ? '' : 's'}`}
              hint="目前为止最好的记录。"
              accent="cool"
            />
            <StatsCard
              label="Pantry items"
              value={inventory.length}
              hint="还没使用的食材正在厨房里等你。"
            />
          </section>

          <div className="content-grid">
            <CalendarView
              monthDate={visibleMonth}
              selectedDateKey={selectedDateKey}
              summaryByDate={summaryByDate}
              onChangeMonth={handleChangeMonth}
              onJumpToMonth={handleJumpToMonth}
              onSelectDate={setSelectedDateKey}
            />
            <DayDetails dateKey={selectedDateKey} entries={selectedEntries} />
          </div>
        </main>
      ) : activeTab === TABS.history ? (
        <main>
          <HistoryList entries={sortedEntries} />
        </main>
      ) : activeTab === TABS.kitchen ? (
        <main>
          <section className="stats-grid stats-grid--dual">
            <StatsCard
              label="Completed days"
              value={completedDays}
              hint="Every logged day adds to your food trail."
            />
            <StatsCard
              label="Available ingredients"
              value={inventory.length}
              hint="Use them to unlock fixed cookbook dishes."
              accent="cool"
            />
          </section>
          <CollectionKitchenPanel
            inventoryCounts={inventoryCounts}
            availableIngredientIds={availableIngredientIds}
            craftableRecipes={craftableRecipes}
            onCraftRecipe={handleCraftRecipe}
          />
        </main>
      ) : (
        <main>
          <RecipeCollectionPanel
            recipes={ENRICHED_RECIPES}
            unlockedRecipeIds={unlockedRecipeIds}
            selectedRecipe={selectedRecipe}
            inventoryCounts={inventoryCounts}
            canCraftSelectedRecipe={canCraftSelectedRecipe}
            onSelectRecipe={setSelectedRecipeId}
            onCraftRecipe={handleCraftRecipe}
          />
        </main>
      )}

      <QuickAddMeal onAddMeal={handleAddMeal} />

      {rewardModal ? (
        <div className="modal-backdrop" onClick={() => setRewardModal(null)} role="presentation">
          <section
            className="modal card reward-modal"
            onClick={(event) => event.stopPropagation()}
            aria-label="Ingredient reward"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Reward unlocked</p>
                <h2>You got a new ingredient</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setRewardModal(null)}
                type="button"
                aria-label="Close reward dialog"
              >
                x
              </button>
            </div>

            <div className="reward-modal__content">
              <img className="reward-modal__art" src={rewardModal.iconUrl} alt={rewardModal.name} />
              <div className="reward-modal__copy">
                <p className="reward-modal__headline">Congrats! You earned {rewardModal.name}.</p>
                <p className="muted">
                  Logged as {MEAL_LABELS[rewardModal.mealType]}. This ingredient is now waiting in My Kitchen.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setRewardModal(null)} type="button">
                Nice
              </button>
              <button
                className="primary-button"
                onClick={() => {
                  setActiveTab(TABS.kitchen);
                  setRewardModal(null);
                }}
                type="button"
              >
                Open kitchen
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
