import { useState, useEffect } from 'react';
import ThemeSelectorComplete from '@/components/ThemeSelectorComplete';
import { useAppStore } from '@/stores/appStore';

export default function Editor() {
  const [isClient, setIsClient] = useState(false);
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Chargement…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* En-tête */}
      <header className="py-6 px-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">
          ✨ CarteMagique - Créateur de Cartes de Vœux
        </h1>
      </header>

      {/* Contenu principal */}
      <main className="py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choisissez votre fond</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            30 modèles festifs pour célébrer la fin d'année.
          </p>
        </div>

        <ThemeSelectorComplete />

        <div className="text-center mt-10 space-y-4">
          <div className="text-sm text-gray-500 mb-4">
            Thème sélectionné : {selectedThemeId}
          </div>
          <button
            onClick={() => alert('Éditeur Canvas avec Konva - En développement')}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
          >
            ✨ Personnaliser ma carte
          </button>
          <div>
            <button
              onClick={() => alert('Export PNG avec html2canvas - En développement')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
            >
              📥 Télécharger ma carte
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
