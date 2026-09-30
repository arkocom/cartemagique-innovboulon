import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeSelectorComplete from '@/components/ThemeSelectorComplete';

type TextStyle = 'classic' | 'modern' | 'elegant' | 'festive';

const textStyles = {
  classic: {
    name: 'Classique',
    fontFamily: 'Georgia, serif',
    shadowBlur: 8,
    shadowColor: 'rgba(0, 0, 0, 0.7)',
    outline: false,
    outlineWidth: 0,
    outlineColor: '#000000',
  },
  modern: {
    name: 'Moderne',
    fontFamily: 'Arial, sans-serif',
    shadowBlur: 15,
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    outline: true,
    outlineWidth: 3,
    outlineColor: '#000000',
  },
  elegant: {
    name: 'Élégant',
    fontFamily: 'Palatino, serif',
    shadowBlur: 20,
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    outline: false,
    outlineWidth: 0,
    outlineColor: '#000000',
  },
  festive: {
    name: 'Festif',
    fontFamily: 'Impact, sans-serif',
    shadowBlur: 10,
    shadowColor: 'rgba(255, 215, 0, 0.8)',
    outline: true,
    outlineWidth: 4,
    outlineColor: '#FFD700',
  },
};

export default function EditorEnhanced() {
  const [isClient, setIsClient] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [textValue, setTextValue] = useState('Joyeux Noël !');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(48);
  const [textStyle, setTextStyle] = useState<TextStyle>('modern');
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dessiner la carte sur le canvas
  useEffect(() => {
    if (!canvasRef.current || !showCanvas) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Dessiner l'image de fond
      ctx.drawImage(img, 0, 0, 600, 750);
      
      const style = textStyles[textStyle];
      
      // Configurer le texte
      ctx.font = `bold ${fontSize}px ${style.fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Ombre
      ctx.shadowColor = style.shadowColor;
      ctx.shadowBlur = style.shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Gérer le retour à la ligne pour les textes longs
      const maxWidth = 500;
      const words = textValue.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      // Centrer verticalement les lignes
      const lineHeight = fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = (750 - totalHeight) / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // Contour si activé
        if (style.outline) {
          ctx.strokeStyle = style.outlineColor || '#000000';
          ctx.lineWidth = style.outlineWidth || 2;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, 300, y);
        }
        
        // Texte principal
        ctx.fillText(line, 300, y);
      });
    };
    img.src = selectedTheme.image;
  }, [showCanvas, textValue, textColor, fontSize, textStyle, selectedTheme.image]);

  const handleExport = () => {
    if (!canvasRef.current) return;
    
    setIsExporting(true);
    
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      
      if (!dataUrl || dataUrl === 'data:,') {
        alert('Erreur: Le canvas est vide.');
        setIsExporting(false);
        return;
      }
      
      // Afficher la prévisualisation
      setPreviewUrl(dataUrl);
      setShowPreview(true);
      setIsExporting(false);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export.');
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    
    const link = document.createElement('a');
    link.download = `carte-magique-${Date.now()}.png`;
    link.href = previewUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!previewUrl) return;
    
    try {
      // Convertir dataURL en Blob
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], `carte-magique-${Date.now()}.png`, { type: 'image/png' });
      
      // Vérifier si l'API Web Share est disponible
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Ma carte de vœux',
          text: 'Découvrez ma carte de vœux personnalisée !',
          files: [file],
        });
      } else {
        // Fallback : téléchargement simple
        handleDownload();
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      // Fallback : téléchargement simple
      handleDownload();
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
          <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <img src="/pwa-192.png" alt="Innov'BOULON" className="h-10 w-10 rounded-full" />
            ← Retour
          </button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-1">
          ✨ CarteMagique
        </h1>
        <div className="w-20"></div>
      </header>

      {/* Modal de prévisualisation */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Votre carte est prête ! 🎉</h2>
            <div className="mb-6 flex justify-center">
              <img 
                src={previewUrl} 
                alt="Prévisualisation" 
                className="max-w-full h-auto rounded-lg shadow-xl"
                style={{ maxHeight: '60vh' }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleShare}
                size="lg"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                📱 Partager / Télécharger
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                💾 Télécharger uniquement
              </Button>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                ✏️ Modifier
              </Button>
            </div>
            <p className="text-sm text-gray-400 text-center mt-4">
              💡 Astuce : Utilisez "Partager" pour envoyer directement par WhatsApp, email, etc.
            </p>
          </div>
        </div>
      )}

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
                Ajoutez votre message personnalisé avec des effets professionnels.
              </p>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Carte */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                    <div style={{ maxWidth: '100%' }}>
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={750}
                        style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
                      />
                    </div>
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
                    <h3 className="text-lg font-bold">Style de texte</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(textStyles) as TextStyle[]).map((styleKey) => (
                        <button
                          key={styleKey}
                          onClick={() => setTextStyle(styleKey)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            textStyle === styleKey
                              ? 'border-white bg-white/10 text-white'
                              : 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {textStyles[styleKey].name}
                        </button>
                      ))}
                    </div>
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
                disabled={isExporting}
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                {isExporting ? '⏳ Préparation...' : '📥 Télécharger ma carte'}
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
