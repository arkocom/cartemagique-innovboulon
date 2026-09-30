import { useId, useRef, useState } from 'react';
import { themes } from '@/lib/themes';
import { useAppStore } from '@/stores/appStore';
import type { Category } from '@/../../shared/types';

const THEME_CATEGORIES: Category[] = [
  'noel', 'nouvel-an', 'hiver', 'feerie', 'nature', 'artdeco', 'pro', 'famille',
];

const CATEGORY_NAMES: Record<Category, string> = {
  noel: 'Noël',
  'nouvel-an': 'Nouvel An',
  hiver: 'Hiver',
  feerie: 'Féerie',
  nature: 'Nature',
  artdeco: 'Art Déco',
  pro: 'Pro',
  famille: 'Famille',
  festifs: 'Festifs',
};

const CATEGORY_EMOJI: Record<Category, string> = {
  noel: '🎄',
  'nouvel-an': '🥂',
  hiver: '❄️',
  feerie: '✨',
  nature: '🌲',
  artdeco: '🎩',
  pro: '💼',
  famille: '❤️',
  festifs: '🎉',
};

export function getKeyboardOptionIndex(
  currentIndex: number,
  optionCount: number,
  key: string,
): number | null {
  if (optionCount <= 0) return null;
  if (key === 'Home') return 0;
  if (key === 'End') return optionCount - 1;
  if (key === 'ArrowRight' || key === 'ArrowDown') return (currentIndex + 1) % optionCount;
  if (key === 'ArrowLeft' || key === 'ArrowUp') return (currentIndex - 1 + optionCount) % optionCount;
  return null;
}

export default function ThemeSelectorComplete() {
  const idPrefix = useId();
  const [activeCategory, setActiveCategory] = useState<Category>('noel');
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const setSelectedThemeId = useAppStore((state) => state.setSelectedThemeId);
  const categoryTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const themeRadioRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredThemes = themes.filter((theme) =>
    theme.id.startsWith(activeCategory)
  );
  const selectedThemeIndex = filteredThemes.findIndex((theme) => theme.id === selectedThemeId);
  const themeTabStopIndex = selectedThemeIndex >= 0 ? selectedThemeIndex : 0;

  const handleCategoryKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex = getKeyboardOptionIndex(index, THEME_CATEGORIES.length, event.key);
    if (nextIndex === null) return;

    event.preventDefault();
    setActiveCategory(THEME_CATEGORIES[nextIndex]);
    categoryTabRefs.current[nextIndex]?.focus();
  };

  const handleThemeKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nextIndex = getKeyboardOptionIndex(index, filteredThemes.length, event.key);
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTheme = filteredThemes[nextIndex];
    if (!nextTheme) return;

    setSelectedThemeId(nextTheme.id);
    themeRadioRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div
        role="tablist"
        aria-label="Catégories de thèmes"
        aria-orientation="horizontal"
        className="flex gap-6 border-b border-gray-700 pb-4 mb-6 overflow-x-auto"
      >
        {THEME_CATEGORIES.map((category, index) => {
          const isActive = activeCategory === category;
          const categoryName = CATEGORY_NAMES[category];
          return (
            <button
              key={category}
              ref={(element) => { categoryTabRefs.current[index] = element; }}
              type="button"
              role="tab"
              id={`${idPrefix}-theme-category-tab-${category}`}
              aria-selected={isActive}
              aria-controls={`${idPrefix}-theme-category-panel`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveCategory(category)}
              onKeyDown={(event) => handleCategoryKeyDown(event, index)}
              className={`whitespace-nowrap rounded-sm font-medium pb-2 px-2 border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                isActive
                  ? 'text-white border-amber-400'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              {categoryName} <span aria-hidden="true">{CATEGORY_EMOJI[category]}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${idPrefix}-theme-category-panel`}
        role="tabpanel"
        aria-labelledby={`${idPrefix}-theme-category-tab-${activeCategory}`}
      >
        <div
          role="radiogroup"
          aria-label={`Thèmes de la catégorie ${CATEGORY_NAMES[activeCategory]}`}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
        >
          {filteredThemes.map((theme, index) => {
            const isSelected = selectedThemeId === theme.id;
            const isTabStop = index === themeTabStopIndex;
            return (
              <button
                key={theme.id}
                ref={(element) => { themeRadioRefs.current[index] = element; }}
                type="button"
                role="radio"
                aria-label={theme.name}
                aria-checked={isSelected}
                tabIndex={isTabStop ? 0 : -1}
                onClick={() => setSelectedThemeId(theme.id)}
                onKeyDown={(event) => handleThemeKeyDown(event, index)}
                className={`group block w-full rounded-xl border-2 text-left transition-all focus-visible:z-10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-transparent hover:border-gray-600'
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-800">
                  <img
                    src={theme.preview}
                    alt=""
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {isSelected && (
                    <div aria-hidden="true" className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                  )}
                </div>
                <div aria-hidden="true" className="p-2 text-center">
                  <p className="text-xs text-gray-300 truncate">{theme.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
