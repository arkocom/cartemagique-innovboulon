import { useState } from 'react';
import { galleryThemes } from '@/lib/themes';
import { useAppStore } from '@/stores/appStore';
import type { Category } from '@/../../shared/types';

export default function ThemeSelector() {
  const [activeCategory, setActiveCategory] = useState<Category>('noel');
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const setSelectedThemeId = useAppStore((state) => state.setSelectedThemeId);

  const filteredThemes = galleryThemes.filter((theme) =>
    theme.id.startsWith(activeCategory)
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Onglets de catégories */}
      <div className="flex gap-6 border-b border-gray-700 pb-4 mb-6 overflow-x-auto">
        {(['noel', 'nouvel-an', 'hiver'] as Category[]).map((cat) => {
          const isActive = activeCategory === cat;
          const label =
            cat === 'noel'
              ? 'Noël 🎄'
              : cat === 'nouvel-an'
              ? 'Nouvel An 🥂'
              : 'Hiver ❄️';
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap font-medium pb-2 px-2 border-b-2 transition-colors ${
                isActive
                  ? 'text-white border-amber-400'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grille de thèmes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {filteredThemes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              className={`cursor-pointer group rounded-xl overflow-hidden border-2 transition-all ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-transparent hover:border-gray-600'
              }`}
            >
              <div className="relative aspect-[4/5] bg-slate-800">
                <img
                  src={theme.preview}
                  alt={theme.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">✓</span>
                  </div>
                )}
              </div>
              <div className="p-2 text-center">
                <p className="text-xs text-gray-300 truncate">{theme.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
