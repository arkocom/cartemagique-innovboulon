import { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton d'aide flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110"
        title="Aide et conseils"
      >
        <HelpCircle className="w-6 h-6" />
      </button>

      {/* Modal d'aide */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">📖 Guide d'Utilisation</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Section 1 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">🎨 Personnaliser votre carte</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>✓ <strong>Ajouter du texte</strong> : Cliquez sur "Ajouter" pour créer un bloc de texte</li>
                  <li>✓ <strong>Changer les couleurs</strong> : Choisissez parmi 4 couleurs principales</li>
                  <li>✓ <strong>Modifier le style</strong> : Classique, Moderne, Élégant ou Festif</li>
                  <li>✓ <strong>Déplacer les éléments</strong> : Cliquez et glissez sur la carte</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">📸 Ajouter des images</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>✓ <strong>Format idéal</strong> : Carré (1:1) - 500×500px minimum</li>
                  <li>✓ <strong>Formats acceptés</strong> : JPG, PNG, WebP</li>
                  <li>✓ <strong>Logos</strong> : Préférez les images avec fond transparent</li>
                  <li>✓ <strong>Conseil</strong> : Utilisez max 3-4 images par carte</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">🖼️ Cadre blanc (Effet Polaroid)</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>✓ <strong>Activez le cadre</strong> : Cochez "Ajouter un cadre blanc"</li>
                  <li>✓ <strong>Ajustez l'épaisseur</strong> : De 0 à 40px avec le slider</li>
                  <li>✓ <strong>Effet photo</strong> : Parfait pour un rendu premium</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">🎯 Conseils de Design</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>✓ <strong>Combinaisons</strong> : Blanc + Noir + Or (classique) ou Blanc + Rouge + Or (festif)</li>
                  <li>✓ <strong>Positionnement</strong> : Centrez le texte principal au milieu</li>
                  <li>✓ <strong>Espacement</strong> : Laissez de l'espace blanc pour la lisibilité</li>
                  <li>✓ <strong>Images</strong> : Placez-les dans les coins ou en arrière-plan</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">📱 Partage & Export</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>✓ <strong>Partager</strong> : Envoyez directement par WhatsApp, email, etc.</li>
                  <li>✓ <strong>Télécharger</strong> : Récupérez le fichier PNG haute qualité</li>
                  <li>✓ <strong>Format</strong> : 400×600px avec cadre blanc optionnel</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="bg-gray-800 rounded-lg p-4 border border-blue-500/30">
                <h3 className="text-lg font-bold text-blue-400 mb-2">💡 Astuce Pro</h3>
                <p className="text-gray-300 text-sm">
                  Utilisez le cadre blanc pour un effet polaroid authentique. Augmentez l'épaisseur à 20-30px pour un rendu plus prononcé et professionnel !
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 p-6 rounded-b-lg border-t border-gray-700 flex justify-between items-center">
              <p className="text-gray-400 text-sm">Offert par <a href="https://innov-boulon.fr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Innov'BOULON</a></p>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
