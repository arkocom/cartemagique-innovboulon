import { useRef, useState } from 'react';
import { galleryThemes } from '@/lib/themes';
import { useAppStore } from '@/stores/appStore';
import type { Category } from '@/../../shared/types';

export default function ThemeSelectorComplete({ onPersonalize }: { onPersonalize?: () => void }) {
  const lastTap = useRef<{ id: string; time: number } | null>(null);
  const personalize = (id: string) => { setSelectedThemeId(id); onPersonalize?.(); };
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
        {(['noel', 'nouvel-an', 'hiver', 'feerie', 'nature', 'artdeco', 'pro', 'famille'] as Category[]).map((cat) => {
          const isActive = activeCategory === cat;
          let label = '';
          switch (cat) {
            case 'noel': label = 'Noël 🎄'; break;
            case 'nouvel-an': label = 'Nouvel An 🥂'; break;
            case 'hiver': label = 'Hiver ❄️'; break;
            case 'feerie': label = 'Féerie ✨'; break;
            case 'nature': label = 'Nature 🌲'; break;
            case 'artdeco': label = 'Art Déco 🎩'; break;
            case 'pro': label = 'Pro 💼'; break;
            case 'famille': label = 'Famille ❤️'; break;
          }
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap font-medium pb-2 px-2 border-b-2 transition-colors ${
                isActive
                  ? 'text-foreground border-amber-400'
                  : 'text-gray-500 hover:text-gray-300 border-transparent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">Touchez un fond pour le choisir. Double-cliquez ou touchez-le deux fois rapidement pour le personnaliser.</p>
      {/* Grille de thèmes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {filteredThemes.map((theme) => {
          const isSelected = selectedThemeId === theme.id;
          return (
            <button
              type="button"
              aria-label={`Choisir ${theme.name} — ${theme.description}`}
              aria-pressed={isSelected}
              key={theme.id}
              onClick={() => setSelectedThemeId(theme.id)}
              onDoubleClick={() => personalize(theme.id)}
              onPointerUp={(event) => {
                if (event.pointerType !== 'touch') return;
                const now = Date.now();
                if (lastTap.current?.id === theme.id && now - lastTap.current.time < 400) {
                  lastTap.current = null;
                  personalize(theme.id);
                } else lastTap.current = { id: theme.id, time: now };
              }}
              style={{ touchAction: 'manipulation' }}
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
            </button>
          );
        })}
      </div>
    </div>
  );
}

