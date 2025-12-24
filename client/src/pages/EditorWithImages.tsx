import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useAppStore } from '@/stores/appStore';
import { themes } from '@/lib/themes';
import { STARTER_TEMPLATES, CardTemplate } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ThemeSelectorComplete from '@/components/ThemeSelectorComplete';
import { Trash2, Plus, Upload, RotateCw, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

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

export interface TextBlock {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  style: TextStyle;
  align: 'left' | 'center' | 'right';
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

export default function EditorWithImages() {
  const [isClient, setIsClient] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([
    {
      id: '1',
      text: 'Joyeux Noël !',
      x: 200,
      y: 300,
      color: '#ffffff',
      fontSize: 32,
      style: 'modern',
      align: 'center',
    },
  ]);
  const [imageElements, setImageElements] = useState<ImageElement[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>('1');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const [showFrame, setShowFrame] = useState(false);
  const [activeTab, setActiveTab] = useState<'carte' | 'parametres'>('carte');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const STICKERS = [
    '🎅', '🎄', '🎁', '⭐', '❄️', '⛄', '🦌', '🔔', 
    '🕯️', '🍪', '🥛', '🎉', '🥂', '🎆', '❤️', '✨'
  ];
  
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Initialiser l'audio
    audioRef.current = new Audio('/music/jingle-bells.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Lecture auto bloquée par le navigateur", e));
    }
    setIsPlaying(!isPlaying);
  };

  const addSticker = (emoji: string) => {
    // Convertir l'emoji en image via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.font = '100px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);
    
    const dataUrl = canvas.toDataURL('image/png');
    
    const newImage: ImageElement = {
      id: Date.now().toString(),
      src: dataUrl,
      x: 150,
      y: 250,
      width: 100,
      height: 100,
      rotation: 0,
    };
    
    setImageElements([...imageElements, newImage]);
    setSelectedImageId(newImage.id);
    setSelectedBlockId('');
  };

  const selectedBlock = textBlocks.find((b) => b.id === selectedBlockId);
  const selectedImage = imageElements.find((img) => img.id === selectedImageId);

  // Dessiner la carte sur le canvas
  useEffect(() => {
    if (!canvasRef.current || !showCanvas) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    // IMPORTANT: crossOrigin doit être défini AVANT src pour éviter le tainting du canvas
    img.crossOrigin = 'anonymous';
    img.src = selectedTheme.image;
    
    img.onload = () => {
      ctx.clearRect(0, 0, 400, 600);
      ctx.drawImage(img, 0, 0, 400, 600);
      
      // Dessiner les images
      imageElements.forEach((imgElem) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = imgElem.src;
        
        image.onload = () => {
          ctx.save();
          ctx.translate(imgElem.x + imgElem.width / 2, imgElem.y + imgElem.height / 2);
          ctx.rotate((imgElem.rotation * Math.PI) / 180);
          ctx.drawImage(image, -imgElem.width / 2, -imgElem.height / 2, imgElem.width, imgElem.height);
          ctx.restore();
        };
      });
      
      // Dessiner les blocs de texte
      textBlocks.forEach((block) => {
        const style = textStyles[block.style];
        
        ctx.font = `bold ${block.fontSize}px ${style.fontFamily}`;
        ctx.fillStyle = block.color;
        ctx.textAlign = block.align || 'center';
        ctx.textBaseline = 'middle';
        
        ctx.shadowColor = style.shadowColor;
        ctx.shadowBlur = style.shadowBlur;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Gestion du texte multi-lignes
        const lines = block.text.split('\n');
        const lineHeight = block.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = block.y - (totalHeight / 2) + (lineHeight / 2);
        
        lines.forEach((line, index) => {
          const lineY = startY + (index * lineHeight);
          
          if (style.outline) {
            ctx.strokeStyle = style.outlineColor || '#000000';
            ctx.lineWidth = style.outlineWidth || 2;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, block.x, lineY);
          }
          
          ctx.fillText(line, block.x, lineY);
        });
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });
      
      // Dessiner le cadre blanc si activé
      if (showFrame && frameWidth > 0) {
        // Dessiner le cadre blanc autour de l'image de fond
        ctx.fillStyle = '#ffffff';
        // Bordure gauche
        ctx.fillRect(0, 0, frameWidth, 600);
        // Bordure droite
        ctx.fillRect(400 - frameWidth, 0, frameWidth, 600);
        // Bordure haut
        ctx.fillRect(0, 0, 400, frameWidth);
        // Bordure bas
        ctx.fillRect(0, 600 - frameWidth, 400, frameWidth);
      }
    };
    // img.src est déjà défini plus haut
  }, [showCanvas, textBlocks, imageElements, selectedTheme.image, showFrame, frameWidth]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Vérifier si on clique sur une image
    for (let i = imageElements.length - 1; i >= 0; i--) {
      const img = imageElements[i];
      if (x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height) {
        setSelectedImageId(img.id);
        setIsDragging(true);
        setDragOffset({ x: x - img.x, y: y - img.y });
        return;
      }
    }

    // Vérifier si on clique sur un bloc de texte
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const block = textBlocks[i];
      const style = textStyles[block.style];
      ctx.font = `bold ${block.fontSize}px ${style.fontFamily}`;
      const metrics = ctx.measureText(block.text);
      const textWidth = metrics.width;
      const textHeight = block.fontSize;

      if (
        x >= block.x - textWidth / 2 &&
        x <= block.x + textWidth / 2 &&
        y >= block.y - textHeight / 2 &&
        y <= block.y + textHeight / 2
      ) {
        setSelectedBlockId(block.id);
        setSelectedImageId(null);
        setIsDragging(true);
        setDragOffset({ x: x - block.x, y: y - block.y });
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (selectedImageId) {
      setImageElements((imgs) =>
        imgs.map((img) =>
          img.id === selectedImageId
            ? { ...img, x: x - dragOffset.x, y: y - dragOffset.y }
            : img
        )
      );
    } else if (selectedBlockId) {
      setTextBlocks((blocks) =>
        blocks.map((block) =>
          block.id === selectedBlockId
            ? { ...block, x: x - dragOffset.x, y: y - dragOffset.y }
            : block
        )
      );
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length !== 1) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

    // Vérifier si on touche une image
    for (let i = imageElements.length - 1; i >= 0; i--) {
      const img = imageElements[i];
      if (x >= img.x && x <= img.x + img.width && y >= img.y && y <= img.y + img.height) {
        setSelectedImageId(img.id);
        setIsDragging(true);
        setDragOffset({ x: x - img.x, y: y - img.y });
        return;
      }
    }

    // Vérifier si on touche un bloc de texte
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let i = textBlocks.length - 1; i >= 0; i--) {
      const block = textBlocks[i];
      const style = textStyles[block.style];
      ctx.font = `bold ${block.fontSize}px ${style.fontFamily}`;
      const metrics = ctx.measureText(block.text);
      const textWidth = metrics.width;
      const textHeight = block.fontSize;

      if (
        x >= block.x - textWidth / 2 &&
        x <= block.x + textWidth / 2 &&
        y >= block.y - textHeight / 2 &&
        y <= block.y + textHeight / 2
      ) {
        setSelectedBlockId(block.id);
        setSelectedImageId(null);
        setIsDragging(true);
        setDragOffset({ x: x - block.x, y: y - block.y });
        break;
      }
    }
  };

  const applyTemplate = (template: CardTemplate) => {
    // Appliquer les blocs de texte du modèle
    const newBlocks = template.textBlocks.map((block, index) => ({
      ...block,
      id: Date.now().toString() + index,
    }));
    setTextBlocks(newBlocks);
    
    // Sélectionner le premier bloc
    if (newBlocks.length > 0) {
      setSelectedBlockId(newBlocks[0].id);
    }
    
    // Appliquer le thème si spécifié
    if (template.themeId) {
      // Logique pour changer le thème si nécessaire
    }
    
    setShowTemplates(false);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 600 / rect.height;
    const x = (e.touches[0].clientX - rect.left) * scaleX;
    const y = (e.touches[0].clientY - rect.top) * scaleY;

    if (selectedImageId) {
      setImageElements((imgs) =>
        imgs.map((img) =>
          img.id === selectedImageId
            ? { ...img, x: x - dragOffset.x, y: y - dragOffset.y }
            : img
        )
      );
    } else if (selectedBlockId) {
      setTextBlocks((blocks) =>
        blocks.map((block) =>
          block.id === selectedBlockId
            ? { ...block, x: x - dragOffset.x, y: y - dragOffset.y }
            : block
        )
      );
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleAddTextBlock = () => {
    const newBlock: TextBlock = {
      id: Date.now().toString(),
      text: 'Nouveau texte',
      x: 200,
      y: 150,
      color: '#ffffff',
      fontSize: 24,
      style: 'modern',
      align: 'center',
    };
    setTextBlocks([...textBlocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setSelectedImageId(null);
  };

  const handleDeleteTextBlock = (id: string) => {
    if (textBlocks.length === 1) {
      alert('Vous devez garder au moins un bloc de texte.');
      return;
    }
    setTextBlocks(textBlocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(textBlocks.find((b) => b.id !== id)?.id || '');
    }
  };

  const handleDeleteImage = (id: string) => {
    setImageElements(imageElements.filter((img) => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const newImage: ImageElement = {
        id: Date.now().toString(),
        src,
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        rotation: 0,
      };
      setImageElements([...imageElements, newImage]);
      setSelectedImageId(newImage.id);
    };
    reader.readAsDataURL(file);

    // Réinitialiser l'input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateSelectedBlock = (updates: Partial<TextBlock>) => {
    setTextBlocks((blocks) =>
      blocks.map((block) =>
        block.id === selectedBlockId ? { ...block, ...updates } : block
      )
    );
  };

  const updateSelectedImage = (updates: Partial<ImageElement>) => {
    setImageElements((imgs) =>
      imgs.map((img) =>
        img.id === selectedImageId ? { ...img, ...updates } : img
      )
    );
  };

  const handleExport = () => {
    console.log('Début de l\'export...');
    if (!canvasRef.current) {
      console.error('Canvas introuvable');
      return;
    }
    
    setIsExporting(true);
    
    // Attendre un court instant pour s'assurer que le dernier rendu est terminé
    setTimeout(() => {
      try {
        if (!canvasRef.current) return;
        
        // Utiliser toBlob au lieu de toDataURL pour une meilleure performance et compatibilité mobile
        canvasRef.current.toBlob((blob) => {
          if (!blob) {
            console.error('Erreur de génération du Blob');
            alert('Erreur: Impossible de générer l\'image.');
            setIsExporting(false);
            return;
          }
          
          console.log('Blob généré, taille:', blob.size);
          
          // Créer une URL objet à partir du blob
          const objectUrl = URL.createObjectURL(blob);
          setPreviewUrl(objectUrl);
          setPreviewBlob(blob); // Stocker le blob pour usage ultérieur
          setShowPreview(true);
          setIsExporting(false);
        }, 'image/png', 1.0);
        
      } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        alert('Une erreur est survenue lors de l\'export.');
        setIsExporting(false);
      }
    }, 100);
  };

  const handleDownload = async () => {
    console.log('Tentative de téléchargement...');
    if (!previewUrl) {
      console.error('Aucune URL de prévisualisation disponible');
      alert('Erreur : Impossible de télécharger l\'image. Veuillez réessayer.');
      return;
    }
    
    try {
      // Si c'est une URL blob (créée via createObjectURL), on peut la télécharger directement
      if (previewUrl.startsWith('blob:')) {
        const link = document.createElement('a');
        link.download = `carte-magique-${Date.now()}.png`;
        link.href = previewUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('Téléchargement déclenché via Blob URL');
      } else {
        // Fallback pour les DataURL (si jamais on revient en arrière) ou URLs distantes
        const response = await fetch(previewUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `carte-magique-${Date.now()}.png`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        console.log('Téléchargement déclenché via fetch+blob');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Le téléchargement a échoué. Essayez de faire un appui long sur l\'image pour l\'enregistrer.');
    }
  };

  const handleShare = async () => {
    if (!previewBlob) return; // Utiliser le blob stocké directement
    
    try {
      const file = new File([previewBlob], `carte-magique-${Date.now()}.png`, { type: 'image/png' });
      
      // Essayer d'abord le partage natif
      if (navigator.share && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Ma carte de vœux',
            text: 'Découvrez ma carte de vœux personnalisée !',
            files: [file],
          });
          return; // Succès
        } catch (shareError) {
          console.warn('Le partage natif a été annulé ou a échoué:', shareError);
          // Continuer vers les alternatives
        }
      } else {
        // Si le partage natif n'est pas supporté (ex: desktop ou contexte non-sécurisé)
        console.log('Partage natif non supporté ou non sécurisé');
      }

      // Essayer la copie dans le presse-papier (Clipboard API)
      try {
        // Vérifier si l'API Clipboard est disponible et supporte les images
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({
              [previewBlob.type]: previewBlob
            })
          ]);
          alert('Image copiée dans le presse-papier ! Vous pouvez maintenant la coller dans votre message.');
          return; // Succès
        }
      } catch (clipboardError) {
        console.warn('La copie dans le presse-papier a échoué:', clipboardError);
      }

      // Si tout échoue, ouvrir le modal de sauvegarde manuelle
      console.log('Méthodes de partage automatiques échouées, ouverture du modal de sauvegarde');
      setShowSaveModal(true);
      
    } catch (error) {
      console.error('Erreur globale lors du partage:', error);
      setShowSaveModal(true);
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
            <img src="/logo-innovboulon.jpg" alt="Innov'BOULON" className="h-10 w-10 rounded-full" />
            ← Retour
          </button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-1">
          ✨ CarteMagique
        </h1>
        <div className="w-20"></div>
      </header>

      {/* Modal de sélection de modèles */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Choisir un modèle</h2>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STARTER_TEMPLATES.map((template, index) => (
                <div 
                  key={template.id}
                  className={`bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all border-2 border-transparent hover:border-blue-500 animate-slide-up delay-${(index + 1) * 100}`}
                  onClick={() => applyTemplate(template)}
                >
                  <div className="text-4xl mb-3 text-center">{template.icon}</div>
                  <h3 className="text-xl font-bold text-center mb-2">{template.name}</h3>
                  <p className="text-gray-400 text-center text-sm">{template.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de sauvegarde manuelle (Mobile) */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-2">Sauvegarder votre carte</h2>
            <p className="text-yellow-400 mb-4 font-medium">
              👆 Maintenez votre doigt sur l'image ci-dessous pour l'enregistrer dans votre galerie.
            </p>
            
            <div className="mb-6 flex justify-center bg-gray-900 p-2 rounded-lg">
              <img 
                src={previewUrl} 
                alt="Carte finale" 
                className="max-w-full h-auto rounded shadow-lg"
                style={{ maxHeight: '50vh' }}
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `carte-magique-${Date.now()}.png`;
                  link.href = previewUrl;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                💾 Essayer le téléchargement direct
              </Button>
              <Button
                onClick={() => setShowSaveModal(false)}
                variant="outline"
                className="w-full"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {/* Bouton Télécharger transformé en lien direct pour compatibilité mobile maximale */}
                <a
                  href={previewUrl}
                  download={`carte-magique-${Date.now()}.png`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 w-full rounded-md text-white font-medium transition-colors"
                  onClick={(e) => {
                    // Si c'est un blob, on laisse le lien faire son travail natif
                    if (previewUrl.startsWith('blob:')) return;
                    // Sinon (fallback), on empêche le lien et on utilise la fonction JS
                    e.preventDefault();
                    handleDownload();
                  }}
                >
                  💾 Télécharger l'image
                </a>
                
                <Button
                  onClick={() => {
                    const subject = encodeURIComponent("Ma carte de vœux personnalisée");
                    const body = encodeURIComponent("Bonjour,\n\nJe t'envoie cette carte de vœux que j'ai créée spécialement pour toi !\n\n(N'oublie pas de joindre l'image que tu as téléchargée)\n\nJoyeuses fêtes !");
                    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                  }}
                  variant="secondary"
                  size="sm"
                  className="w-full bg-gray-700 hover:bg-gray-600"
                >
                  📧 Envoyer par Email
                </Button>
              </div>
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                size="lg"
                className="px-6 py-3"
              >
                ✏️ Modifier
              </Button>
            </div>
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-center">
              <p className="text-sm text-yellow-200 font-medium mb-1">
                📱 Sur mobile (iPhone/Android) :
              </p>
              <p className="text-xs text-gray-300">
                Si le bouton "Télécharger" ne fonctionne pas, faites un <strong>appui long sur l'image</strong> ci-dessus et choisissez "Enregistrer l'image".
              </p>
            </div>
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
                Ajoutez du texte, des images et déplacez-les librement sur la carte.
              </p>
            </div>

            <div className="max-w-6xl mx-auto px-2 md:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                {/* Carte */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                    <div style={{ aspectRatio: '2/3', maxWidth: '100%', width: '100%', maxHeight: '80vh' }} ref={containerRef}>
                      <canvas
                        ref={canvasRef}
                        width={400}
                        height={600}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'block',
                          cursor: isDragging ? 'grabbing' : 'grab',
                          touchAction: 'none',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 text-center mt-2">
                    💡 Cliquez/touchez et faites glisser pour déplacer les éléments
                  </p>
                </div>

                {/* Panneau de contrôle */}
                <div className="space-y-3 md:space-y-4 overflow-y-auto max-h-[80vh] order-1 lg:order-2">
                  {/* Upload d'images */}
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Images & Stickers
                      </h3>
                      <Button
                        onClick={() => setShowTemplates(true)}
                        size="sm"
                        variant="outline"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 border-none hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        ✨ Modèles
                      </Button>
                    </div>
                    
                    {/* Stickers */}
                    <div className="mb-4">
                      <Label className="text-gray-300 mb-2 block text-sm">Ajouter un sticker</Label>
                      <div className="grid grid-cols-8 gap-1 bg-gray-900 p-2 rounded-lg">
                        {STICKERS.map((sticker) => (
                          <button
                            key={sticker}
                            onClick={() => addSticker(sticker)}
                            className="text-2xl hover:bg-gray-700 p-1 rounded transition-colors flex items-center justify-center aspect-square"
                            title="Ajouter ce sticker"
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-base md:text-sm md:py-2 py-3"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Ajouter une photo perso
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {imageElements.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto mt-3">
                        {imageElements.map((img) => (
                          <div
                            key={img.id}
                            className={`flex items-center justify-between p-3 md:p-2 rounded border-2 transition-all cursor-pointer touch-target ${
                              selectedImageId === img.id
                                ? 'border-white bg-white/10'
                                : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                            }`}
                            onClick={() => setSelectedImageId(img.id)}
                          >
                            <span className="text-sm truncate flex-1">Image / Sticker</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(img.id);
                              }}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedImage && (
                    <>
                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Taille: {selectedImage.width}×{selectedImage.height}px</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateSelectedImage({ width: Math.max(50, selectedImage.width - 20), height: Math.max(50, selectedImage.height - 20) })}
                            size="sm"
                            variant="outline"
                          >
                            <ZoomOut className="w-4 h-4" />
                          </Button>
                          <input
                            type="range"
                            min="50"
                            max="400"
                            value={selectedImage.width}
                            onChange={(e) => updateSelectedImage({ width: Number(e.target.value), height: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => updateSelectedImage({ width: Math.min(400, selectedImage.width + 20), height: Math.min(400, selectedImage.height + 20) })}
                            size="sm"
                            variant="outline"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Rotation: {selectedImage.rotation}°</h3>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateSelectedImage({ rotation: (selectedImage.rotation - 15 + 360) % 360 })}
                            size="sm"
                            variant="outline"
                          >
                            <RotateCw className="w-4 h-4 transform -scale-x-100" />
                          </Button>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={selectedImage.rotation}
                            onChange={(e) => updateSelectedImage({ rotation: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => updateSelectedImage({ rotation: (selectedImage.rotation + 15) % 360 })}
                            size="sm"
                            variant="outline"
                          >
                            <RotateCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Liste des blocs */}
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Blocs de texte</h3>
                      <Button
                        onClick={handleAddTextBlock}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {textBlocks.map((block) => (
                        <div
                          key={block.id}
                          className={`flex items-center justify-between p-2 rounded border-2 transition-all cursor-pointer ${
                            selectedBlockId === block.id
                              ? 'border-white bg-white/10'
                              : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          }`}
                          onClick={() => {
                            setSelectedBlockId(block.id);
                            setSelectedImageId(null);
                          }}
                        >
                          <span className="text-sm truncate flex-1">
                            {block.text || 'Texte vide'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTextBlock(block.id);
                            }}
                            className="ml-2 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedBlock && (
                    <>
                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Texte</h3>
                        <textarea
                          value={selectedBlock.text}
                          onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                          placeholder="Votre message..."
                          className="w-full h-24 p-3 bg-gray-700 text-white border border-gray-600 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => updateSelectedBlock({ align: 'left' })}
                            className={`flex-1 py-2 rounded border ${
                              selectedBlock.align === 'left'
                                ? 'bg-white/20 border-white'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                            title="Aligner à gauche"
                          >
                            <AlignLeft className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => updateSelectedBlock({ align: 'center' })}
                            className={`flex-1 py-2 rounded border ${
                              selectedBlock.align === 'center'
                                ? 'bg-white/20 border-white'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                            title="Centrer"
                          >
                            <AlignCenter className="w-4 h-4 mx-auto" />
                          </button>
                          <button
                            onClick={() => updateSelectedBlock({ align: 'right' })}
                            className={`flex-1 py-2 rounded border ${
                              selectedBlock.align === 'right'
                                ? 'bg-white/20 border-white'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                            title="Aligner à droite"
                          >
                            <AlignRight className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Style de texte</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.keys(textStyles) as TextStyle[]).map((styleKey) => (
                            <button
                              key={styleKey}
                              onClick={() => updateSelectedBlock({ style: styleKey })}
                              className={`px-4 py-3 md:py-2 rounded-lg border-2 transition-all text-sm md:text-xs ${
                                selectedBlock.style === styleKey
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
                          {['#ffffff', '#000000', '#ff0000', '#fbbf24'].map(
                            (color) => (
                              <button
                                key={color}
                                onClick={() => updateSelectedBlock({ color })}
                                className={`w-10 h-10 rounded-full border-2 ${
                                  selectedBlock.color === color ? 'border-white ring-2 ring-white' : 'border-gray-600'
                                }`}
                                style={{ backgroundColor: color }}
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Cadre blanc</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={showFrame}
                              onChange={(e) => setShowFrame(e.target.checked)}
                              className="w-5 h-5 cursor-pointer"
                            />
                            <span className="text-sm">Ajouter un cadre blanc</span>
                          </label>
                          {showFrame && (
                            <div>
                              <label className="text-sm text-gray-300 block mb-2">Épaisseur: {frameWidth}px</label>
                              <input
                                type="range"
                                min="0"
                                max="40"
                                value={frameWidth}
                                onChange={(e) => setFrameWidth(Number(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Taille: {selectedBlock.fontSize}px</h3>
                        <input
                          type="range"
                          min="18"
                          max="96"
                          value={selectedBlock.fontSize}
                          onChange={(e) => updateSelectedBlock({ fontSize: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-6 md:mt-10 flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-base bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                {isExporting ? '⏳ Préparation...' : '📥 Partager ma carte'}
              </Button>
              <Button
                onClick={() => setShowCanvas(false)}
                variant="outline"
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-base"
              >
                ← Changer de fond
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
