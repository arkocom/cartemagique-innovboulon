import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Stage, Layer, Image as KonvaImage, Text } from 'react-konva';
import useImage from 'use-image';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSelectorComplete from '@/components/ThemeSelectorComplete';

function BackgroundImage({ src }: { src: string }) {
  const [image] = useImage(src);
  return <KonvaImage image={image} width={600} height={750} />;
}

export default function EditorWithCanvas() {
  const [isClient, setIsClient] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [textValue, setTextValue] = useState('Joyeux Noël !');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const stageRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleExport = () => {
    if (!stageRef.current) return;
    
    try {
      const uri = stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: 'image/png',
      });

      const link = document.createElement('a');
      link.download = `carte-magique-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✅ Carte téléchargée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export.');
    }
  };

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
      <header className="py-4 px-4 border-b border-gray-800 flex items-center justify-between">
        <Link href="/">
          <button className="text-gray-400 hover:text-white transition-colors">
            ← Retour
          </button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-1">
          ✨ CarteMagique
        </h1>
        <div className="w-20"></div>
      </header>

      {/* Contenu principal */}
      <main className="py-8">
        {!showCanvas ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Choisissez votre fond</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                30 modèles festifs pour célébrer la fin d'année.
              </p>
            </div>

            <ThemeSelectorComplete />

            <div className="text-center mt-10">
              <Button
                onClick={() => setShowCanvas(true)}
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600"
              >
                ✨ Personnaliser ma carte
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Personnalisez votre carte</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Ajoutez votre message personnalisé.
              </p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Canvas */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                    <Stage
                      ref={stageRef}
                      width={600}
                      height={750}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    >
                      <Layer>
                        <BackgroundImage src={selectedTheme.image} />
                        <Text
                          text={textValue}
                          x={50}
                          y={350}
                          fontSize={fontSize}
                          fontFamily="Arial"
                          fill={textColor}
                          width={500}
                          align="center"
                          shadowColor="black"
                          shadowBlur={10}
                          shadowOpacity={0.8}
                        />
                      </Layer>
                    </Stage>
                  </div>
                </div>

                {/* Panneau de contrôle */}
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold">Votre message</h3>
                    <Input
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder="Votre message..."
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold">Couleur du texte</h3>
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#000000', '#ff0000', '#fbbf24', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'].map(
                        (color) => (
                          <button
                            key={color}
                            onClick={() => setTextColor(color)}
                            className={`w-10 h-10 rounded-full border-2 ${
                              textColor === color ? 'border-white ring-2 ring-white' : 'border-gray-600'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    <h3 className="text-lg font-bold">Taille: {fontSize}px</h3>
                    <input
                      type="range"
                      min="24"
                      max="96"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10 space-x-4">
              <Button
                onClick={() => setShowCanvas(false)}
                variant="outline"
                size="lg"
                className="px-8 py-4"
              >
                ← Changer de fond
              </Button>
              <Button
                onClick={handleExport}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                📥 Télécharger ma carte
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
