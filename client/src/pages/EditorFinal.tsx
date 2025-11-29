import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StickerGallery from '@/components/StickerGallery';
import TemplateSelector from '@/components/TemplateSelector';
import RecentCards from '@/components/RecentCards';
import { themes as THEMES } from '@/lib/themes';
import { STICKERS, getStickerById } from '@/lib/stickers';
import { Template } from '@/lib/templates';
import { SavedCard, saveCard, getCards, deleteCard, generateCardId } from '@/lib/storage';
import { ChevronLeft, Download, Plus, Trash2, Upload, RotateCw, Maximize2 } from 'lucide-react';

interface TextBlock {
  id: string;
  text: string;
  color: string;
  style: string;
  size: number;
  x: number;
  y: number;
}

interface ImageElement {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface StickerElement {
  id: string;
  stickerId: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export default function EditorFinal() {
  const [, navigate] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
    {
      id: '1',
      text: 'Joyeux Noël !',
      color: '#ffffff',
      style: 'Moderne',
      size: 48,
      x: 300,
      y: 200
    }
  ]);
  const [images, setImages] = useState<ImageElement[]>([]);
  const [stickers, setStickers] = useState<StickerElement[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>('1');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [draggedElement, setDraggedElement] = useState<{ type: string; id: string } | null>(null);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSavedCards(getCards());
    drawCanvas();
  }, [selectedTheme, textBlocks, images, stickers]);

  useEffect(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasOffset({ x: rect.left, y: rect.top });
    }
  }, []);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner le fond
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, 600, 750);
      ctx.drawImage(img, 0, 0, 600, 750);

      // Dessiner les images uploadées
      images.forEach((img) => {
        const imgElement = new Image();
        imgElement.crossOrigin = 'anonymous';
        imgElement.src = img.src;
        imgElement.onload = () => {
          ctx.save();
          ctx.translate(img.x + img.width / 2, img.y + img.height / 2);
          ctx.rotate((img.rotation * Math.PI) / 180);
          ctx.drawImage(imgElement, -img.width / 2, -img.height / 2, img.width, img.height);
          ctx.restore();
        };
      });

      // Dessiner les stickers
      stickers.forEach((sticker) => {
        const stickerData = getStickerById(sticker.stickerId);
        if (stickerData) {
          ctx.save();
          ctx.translate(sticker.x, sticker.y);
          ctx.rotate((sticker.rotation * Math.PI) / 180);
          const svg = new Image();
          svg.src = 'data:image/svg+xml;base64,' + btoa(stickerData.svg);
          svg.onload = () => {
            ctx.drawImage(svg, -sticker.size / 2, -sticker.size / 2, sticker.size, sticker.size);
          };
          ctx.restore();
        }
      });

      // Dessiner les blocs de texte
      textBlocks.forEach((block) => {
        ctx.save();
        ctx.font = `bold ${block.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Appliquer le style
        if (block.style === 'Moderne') {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 3;
          ctx.strokeText(block.text, block.x, block.y);
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        } else if (block.style === 'Festif') {
          ctx.strokeStyle = '#d4af37';
          ctx.lineWidth = 4;
          ctx.strokeText(block.text, block.x, block.y);
          ctx.shadowColor = 'rgba(212,175,55,0.6)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        } else if (block.style === 'Élégant') {
          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 6;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }

        ctx.fillStyle = block.color;
        ctx.fillText(block.text, block.x, block.y);
        ctx.restore();
      });
    };
    img.src = selectedTheme.image;
  };

  const handleAddTextBlock = () => {
    const newBlock: TextBlock = {
      id: String(Date.now()),
      text: 'Nouveau texte',
      color: '#ffffff',
      style: 'Classique',
      size: 36,
      x: 300,
      y: 400
    };
    setTextBlocks([...textBlocks, newBlock]);
    setSelectedBlock(newBlock.id);
  };

  const handleAddSticker = (stickerId: string) => {
    const newSticker: StickerElement = {
      id: String(Date.now()),
      stickerId,
      x: 300,
      y: 300,
      size: 60,
      rotation: 0
    };
    setStickers([...stickers, newSticker]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const newImage: ImageElement = {
        id: String(Date.now()),
        src,
        x: 300,
        y: 300,
        width: 120,
        height: 120,
        rotation: 0
      };
      setImages([...images, newImage]);
      setSelectedImage(newImage.id);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadTemplate = (template: Template) => {
    setTextBlocks(
      template.textBlocks.map((block, idx) => ({
        id: String(idx),
        text: block.text,
        color: block.color,
        style: block.style,
        size: block.size,
        x: block.x,
        y: block.y
      }))
    );
    setShowTemplates(false);
  };

  const handleSaveCard = () => {
    const cardName = `Carte ${new Date().toLocaleDateString('fr-FR')}`;
    const card: SavedCard = {
      id: generateCardId(),
      name: cardName,
      theme: selectedTheme.id,
      textBlocks: textBlocks.map(({ id, ...rest }) => rest) as any,
      images: images.map(({ id, ...rest }) => rest) as any,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    saveCard(card);
    setSavedCards(getCards());
  };

  const handleLoadCard = (card: SavedCard) => {
    const theme = THEMES.find((t: any) => t.id === card.theme);
    if (theme) setSelectedTheme(theme);
    setTextBlocks(
      card.textBlocks.map((block, idx) => ({
        id: String(idx),
        ...block
      }))
    );
    if (card.images && card.images.length > 0) {
      setImages(
        card.images.map((img: any, idx: number) => ({
          id: String(idx),
          src: img.src,
          x: img.x,
          y: img.y,
          width: img.width,
          height: img.height,
          rotation: img.rotation
        }))
      );
    }
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
    setSavedCards(getCards());
  };

  const handleExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `carte-magique-${Date.now()}.png`;
    link.click();
    setShowExportModal(false);
  };

  const currentBlock = textBlocks.find(b => b.id === selectedBlock);
  const currentImage = images.find(img => img.id === selectedImage);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-2 md:p-4">
        <div className="flex items-center justify-between mb-4 md:mb-6 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2 flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <h1 className="text-lg md:text-2xl font-bold truncate">✨ CarteMagique</h1>
          </div>
          <Button
            onClick={() => handleSaveCard()}
            variant="outline"
            size="sm"
            className="gap-2 flex-shrink-0"
          >
            <span className="hidden sm:inline">💾 Sauvegarder</span>
            <span className="sm:hidden">💾</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sélecteur de thème */}
            <Card className="p-3 md:p-4">
              <h3 className="font-semibold mb-3 text-sm md:text-base">Choisir un fond</h3>
              <div className="space-y-2">
                {['noel', 'nouvel-an', 'hiver'].map((category) => (
                  <div key={category}>
                    <p className="text-xs md:text-sm font-medium text-muted-foreground mb-2 capitalize">
                      {category === 'noel' ? 'Noël' : category === 'nouvel-an' ? 'Nouvel An' : 'Hiver'}
                    </p>
                    <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                      {THEMES.filter((t: any) => {
                        const themeCategory = t.id.split('-').slice(0, -1).join('-');
                        return themeCategory === category;
                      }).map((theme: any) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme)}
                          className={`aspect-square rounded border-2 overflow-hidden transition-all ${
                            selectedTheme.id === theme.id
                              ? 'border-blue-500 scale-105'
                              : 'border-transparent hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={theme.image}
                            alt={theme.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Canvas */}
            <Card className="p-3 md:p-4">
              <canvas
                ref={canvasRef}
                width={600}
                height={750}
                className="w-full border rounded-lg bg-muted"
              />
              <Button
                onClick={() => setShowExportModal(true)}
                className="w-full mt-4 gap-2"
              >
                <Download className="w-4 h-4" />
                📥 Télécharger ma carte
              </Button>
            </Card>
          </div>

          {/* Panneau de contrôle */}
          <div className="space-y-4">
            <Tabs defaultValue="texte" className="w-full">
              <TabsList className="grid w-full grid-cols-3 text-xs md:text-sm">
                <TabsTrigger value="texte">Texte</TabsTrigger>
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                <TabsTrigger value="cartes">Cartes</TabsTrigger>
              </TabsList>

              {/* Onglet Texte */}
              <TabsContent value="texte" className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Blocs de texte</h3>
                  <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                    {textBlocks.map((block) => (
                      <Button
                        key={block.id}
                        variant={selectedBlock === block.id ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start text-left truncate text-xs"
                        onClick={() => setSelectedBlock(block.id)}
                      >
                        {block.text.substring(0, 20)}...
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleAddTextBlock}
                    size="sm"
                    className="w-full gap-2 text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </Button>
                </div>

                {currentBlock && (
                  <div className="space-y-3 border-t pt-3">
                    <div>
                      <label className="text-xs font-medium">Texte</label>
                      <input
                        type="text"
                        value={currentBlock.text}
                        onChange={(e) => {
                          setTextBlocks(
                            textBlocks.map(b =>
                              b.id === selectedBlock ? { ...b, text: e.target.value } : b
                            )
                          );
                        }}
                        className="w-full px-2 py-1 border rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium">Couleur</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['#ffffff', '#000000', '#ef4444', '#fbbf24', '#22c55e', '#60a5fa', '#a855f7', '#ec4899', '#f97316', '#06b6d4', '#8b5cf6', '#d946ef', '#0ea5e9', '#14b8a6'].map((color) => (
                          <button
                            key={color}
                            className="w-full h-8 rounded border-2"
                            style={{
                              backgroundColor: color,
                              borderColor: currentBlock.color === color ? '#000' : 'transparent'
                            }}
                            onClick={() => {
                              setTextBlocks(
                                textBlocks.map(b =>
                                  b.id === selectedBlock ? { ...b, color } : b
                                )
                              );
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Style</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Classique', 'Moderne', 'Élégant', 'Festif'].map((style) => (
                          <Button
                            key={style}
                            variant={currentBlock.style === style ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              setTextBlocks(
                                textBlocks.map(b =>
                                  b.id === selectedBlock ? { ...b, style } : b
                                )
                              );
                            }}
                            className="text-xs"
                          >
                            {style}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Taille: {currentBlock.size}px</label>
                      <input
                        type="range"
                        min="16"
                        max="72"
                        value={currentBlock.size}
                        onChange={(e) => {
                          setTextBlocks(
                            textBlocks.map(b =>
                              b.id === selectedBlock ? { ...b, size: parseInt(e.target.value) } : b
                            )
                          );
                        }}
                        className="w-full"
                      />
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2 text-xs"
                      onClick={() => {
                        setTextBlocks(textBlocks.filter(b => b.id !== selectedBlock));
                        setSelectedBlock(textBlocks[0]?.id || '');
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </Button>
                  </div>
                )}

                {/* Upload d'images */}
                <div className="border-t pt-3 space-y-3">
                  <h3 className="font-semibold text-sm">Images personnalisées</h3>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    className="w-full gap-2 text-xs"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4" />
                    Ajouter une image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Vos images ({images.length})</p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {images.map((img) => (
                          <Button
                            key={img.id}
                            variant={selectedImage === img.id ? 'default' : 'outline'}
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setSelectedImage(img.id)}
                          >
                            Image {images.indexOf(img) + 1}
                          </Button>
                        ))}
                      </div>

                      {currentImage && (
                        <div className="space-y-2 border-t pt-2">
                          <div>
                            <label className="text-xs font-medium">Largeur: {currentImage.width}px</label>
                            <input
                              type="range"
                              min="30"
                              max="300"
                              value={currentImage.width}
                              onChange={(e) => {
                                setImages(
                                  images.map(img =>
                                    img.id === selectedImage
                                      ? { ...img, width: parseInt(e.target.value) }
                                      : img
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium">Hauteur: {currentImage.height}px</label>
                            <input
                              type="range"
                              min="30"
                              max="300"
                              value={currentImage.height}
                              onChange={(e) => {
                                setImages(
                                  images.map(img =>
                                    img.id === selectedImage
                                      ? { ...img, height: parseInt(e.target.value) }
                                      : img
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium">Rotation: {currentImage.rotation}°</label>
                            <input
                              type="range"
                              min="0"
                              max="360"
                              value={currentImage.rotation}
                              onChange={(e) => {
                                setImages(
                                  images.map(img =>
                                    img.id === selectedImage
                                      ? { ...img, rotation: parseInt(e.target.value) }
                                      : img
                                  )
                                );
                              }}
                              className="w-full"
                            />
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full gap-2 text-xs"
                            onClick={() => {
                              setImages(images.filter(img => img.id !== selectedImage));
                              setSelectedImage(null);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer l'image
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Onglet Stickers */}
              <TabsContent value="stickers">
                <StickerGallery onStickerSelect={handleAddSticker} />
              </TabsContent>

              {/* Onglet Cartes */}
              <TabsContent value="cartes" className="space-y-4">
                <Button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="w-full text-xs"
                  size="sm"
                >
                  {showTemplates ? 'Masquer' : 'Afficher'} les templates
                </Button>

                {showTemplates && (
                  <TemplateSelector onTemplateSelect={handleLoadTemplate} />
                )}

                <div className="border-t pt-4">
                  <RecentCards
                    cards={savedCards}
                    onCardSelect={handleLoadCard}
                    onCardDelete={handleDeleteCard}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm p-6 space-y-4">
            <h2 className="text-xl font-bold">Télécharger votre carte</h2>
            <p className="text-sm text-muted-foreground">
              Votre carte est prête à être téléchargée en haute qualité (600×750px)
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                className="flex-1"
              >
                Télécharger
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
