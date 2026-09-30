import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { useAppStore } from '@/stores/appStore';
import { themes, galleryThemes } from '@/lib/themes';
import { STARTER_TEMPLATES, CardTemplate } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ThemeSelectorComplete from '@/components/ThemeSelectorComplete';
import TextAssistantDialog from '@/components/TextAssistantDialog';
import { Trash2, Plus, Upload, RotateCw, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight, Wand2, Undo, Redo, Smartphone, Monitor, Type, LayoutGrid, ImagePlus, SlidersHorizontal, Send, X } from 'lucide-react';
import { CardCanvasAssetError, getCardCanvasSize, isPointInsideCardTextBlock, renderCardToCanvas, type CardCanvasTextStyle } from '@/lib/cardCanvas';
import { isShareAbortError } from '@/lib/shareUtils';

type TextStyle = 'classic' | 'modern' | 'elegant' | 'festive' | string;

const INITIAL_TEXT_STYLES = {
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
  filter?: 'none' | 'grayscale' | 'sepia' | 'vintage';
  tint?: string; // Hex color for tinting
}

export default function EditorWithImages() {
  const [isClient, setIsClient] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [textBlocks, setTextBlocks] = useState<TextBlock[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cartemagique_textBlocks');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved textBlocks', e);
        }
      }
    }
    return [
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
    ];
  });
  const [imageElements, setImageElements] = useState<ImageElement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cartemagique_imageElements');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved imageElements', e);
        }
      }
    }
    return [];
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string>('1');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const [showFrame, setShowFrame] = useState(false);
  const [photoFilter, setPhotoFilter] = useState<'none' | 'grayscale' | 'sepia' | 'vintage'>('none');
  const [stickerTint, setStickerTint] = useState<string>('original'); // 'original', '#FFD700', '#FF0000', etc.
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'carte' | 'parametres'>('carte');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'standard' | 'story'>('standard'); // standard (400x600) or story (338x600 - 9:16 approx)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const [customFonts, setCustomFonts] = useState<string[]>([]);
  const [showMagicDust, setShowMagicDust] = useState(false);
  const [textStyles, setTextStyles] = useState<Record<string, CardCanvasTextStyle>>(INITIAL_TEXT_STYLES);
  const [backgroundColor, setBackgroundColor] = useState<string>(''); // Empty string means use image
  const [showCollageMenu, setShowCollageMenu] = useState(false);
  const [collageNotice, setCollageNotice] = useState('Ajoutez une ou plusieurs photos, puis choisissez une disposition.');
  const [mobileTool, setMobileTool] = useState<'text' | 'photo' | 'style' | 'share' | null>(null);
  const [showTextAssistant, setShowTextAssistant] = useState(false);
  
  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fontData = event.target?.result as string;
      const fontName = `CustomFont_${Date.now()}`;
      
      const newStyle = document.createElement('style');
      newStyle.appendChild(document.createTextNode(`
        @font-face {
          font-family: "${fontName}";
          src: url("${fontData}");
        }
      `));
      document.head.appendChild(newStyle);
      
      setCustomFonts(prev => [...prev, fontName]);
      
      // Add to textStyles dynamically
      setTextStyles(prev => ({
        ...prev,
        [fontName]: {
          name: 'Perso',
          fontFamily: `"${fontName}", sans-serif`,
          shadowBlur: 5,
          shadowColor: 'rgba(0,0,0,0.5)',
          outline: false,
          outlineWidth: 0,
          outlineColor: '#000000'
        }
      }));
      
      if (selectedBlockId) {
        updateSelectedBlock({ style: fontName as any });
      }
    };
    reader.readAsDataURL(file);
  };

  // Smart Collage Layouts — ne touche qu'aux vraies photos, jamais aux stickers.
  const applyCollageLayout = (requestedCount: number) => {
    const canvasWidth = aspectRatio === 'story' ? 338 : 400;
    const canvasHeight = 600;
    const padding = 16;
    const photos = imageElements.filter((image) => !image.id.startsWith('sticker-'));

    if (photos.length === 0) {
      setCollageNotice('Ajoutez d’abord au moins une photo personnelle pour créer un collage.');
      return;
    }

    const imagesToArrange = photos.slice(0, Math.min(requestedCount, photos.length));
    const count = imagesToArrange.length;
    const availableWidth = canvasWidth - padding * 2;
    const availableHeight = canvasHeight - padding * 2;
    const layout = new Map<string, Pick<ImageElement, 'x' | 'y' | 'width' | 'height' | 'rotation'>>();

    if (count === 1) {
      layout.set(imagesToArrange[0].id, { x: padding, y: padding, width: availableWidth, height: availableHeight, rotation: 0 });
    } else if (count === 2) {
      const height = (availableHeight - padding) / 2;
      imagesToArrange.forEach((image, index) => {
        layout.set(image.id, { x: padding, y: padding + index * (height + padding), width: availableWidth, height, rotation: 0 });
      });
    } else if (count === 3) {
      const topHeight = (availableHeight - padding) * 0.58;
      const bottomHeight = availableHeight - padding - topHeight;
      const bottomWidth = (availableWidth - padding) / 2;
      layout.set(imagesToArrange[0].id, { x: padding, y: padding, width: availableWidth, height: topHeight, rotation: 0 });
      layout.set(imagesToArrange[1].id, { x: padding, y: padding + topHeight + padding, width: bottomWidth, height: bottomHeight, rotation: 0 });
      layout.set(imagesToArrange[2].id, { x: padding + bottomWidth + padding, y: padding + topHeight + padding, width: bottomWidth, height: bottomHeight, rotation: 0 });
    } else {
      const width = (availableWidth - padding) / 2;
      const height = (availableHeight - padding) / 2;
      imagesToArrange.slice(0, 4).forEach((image, index) => {
        layout.set(image.id, {
          x: padding + (index % 2) * (width + padding),
          y: padding + Math.floor(index / 2) * (height + padding),
          width,
          height,
          rotation: 0,
        });
      });
    }

    setImageElements((current) => current.map((image) => ({ ...image, ...(layout.get(image.id) ?? {}) })));
    setSelectedImageId(imagesToArrange[0]?.id ?? null);
    setSelectedBlockId('');
    setCollageNotice(`${count} photo${count > 1 ? 's' : ''} disposée${count > 1 ? 's' : ''} — les stickers restent à leur place.`);
  };

  // History state
  const [history, setHistory] = useState<{textBlocks: TextBlock[], imageElements: ImageElement[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const addToHistory = useCallback(() => {
    if (isUndoRedoAction.current) return;
    
    const currentState = {
      textBlocks: JSON.parse(JSON.stringify(textBlocks)),
      imageElements: JSON.parse(JSON.stringify(imageElements))
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, currentState];
    });
    setHistoryIndex(prev => prev + 1);
  }, [textBlocks, imageElements, historyIndex]);

  // Initialize history
  useEffect(() => {
    if (history.length === 0 && textBlocks.length > 0) {
      addToHistory();
    }
  }, []);

  // Save to history on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      addToHistory();
    }, 500);
    return () => clearTimeout(timer);
  }, [textBlocks, imageElements]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevState = history[historyIndex - 1];
      setTextBlocks(prevState.textBlocks);
      setImageElements(prevState.imageElements);
      setHistoryIndex(prev => prev - 1);
      setTimeout(() => { isUndoRedoAction.current = false; }, 100);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setTextBlocks(nextState.textBlocks);
      setImageElements(nextState.imageElements);
      setHistoryIndex(prev => prev + 1);
      setTimeout(() => { isUndoRedoAction.current = false; }, 100);
    }
  };

  const MAGIC_STYLES = {
    pro: {
      texts: [
        "✨ Meilleurs vœux de réussite\npour cette nouvelle année.",
        "Toute l'équipe vous souhaite\nune excellente année 2026. 🤝",
        "🚀 Innovation, Succès, Prospérité.\nBonne année !",
        "Merci de votre confiance.\nJoyeuses fêtes ! ✨"
      ],
      style: 'elegant',
      color: '#FFD700', // Gold
      fontSize: 28
    },
    family: {
      texts: [
        "🎄 Joyeux Noël 🎄\nà toute la famille !",
        "Plein de bisous 😘\npour cette fin d'année.",
        "❤️ Bonheur, Santé, Amour.\nBonne année !",
        "On pense fort à vous.\nJoyeuses fêtes ! 🎁"
      ],
      style: 'classic',
      color: '#FFFFFF',
      fontSize: 32
    },
    love: {
      texts: [
        "Mon plus beau cadeau,\nc'est toi ❤️",
        "Pour toujours,\nà tes côtés. ✨",
        "🌹 Joyeuse Saint-Valentin\nmon amour.",
        "Toi + Moi = ❤️"
      ],
      style: 'elegant',
      color: '#FF69B4', // HotPink
      fontSize: 36
    },
    fun: {
      texts: [
        "🎉 Bonne année !\n(Promis, j'arrête le chocolat)",
        "Santé, Bonheur...\net beaucoup de vacances ! 🏖️",
        "365 jours de fête\nqui commencent ! 🥳",
        "New Year, New Me\n(ou pas 😜)"
      ],
      style: 'festive',
      color: '#00FFFF', // Cyan
      fontSize: 30
    },
    birthday: {
      texts: [
        "🎂 Joyeux Anniversaire ! 🎂\nQue du bonheur !",
        "Un an de plus...\nmais toujours aussi jeune ! 😉",
        "🎉 Happy Birthday ! 🎉\nProfite de ta journée !",
        "Souffle tes bougies 🕯️\net fais un vœu ! ✨"
      ],
      style: 'festive',
      color: '#FF4500', // OrangeRed
      fontSize: 34
    },
    thanks: {
      texts: [
        "🙏 Merci infiniment\npour tout.",
        "Un grand MERCI !\nTu es génial(e). ❤️",
        "Juste un petit mot\npour te dire merci. ✨",
        "Ta gentillesse\nme touche beaucoup. 🌹"
      ],
      style: 'elegant',
      color: '#9370DB', // MediumPurple
      fontSize: 32
    },
    default: {
      texts: [
        "✨ Meilleurs Vœux !",
        "🎉 Joyeuses Fêtes !",
        "Bonne Année 2026 !",
        "Sincères amitiés."
      ],
      style: 'modern',
      color: '#FFFFFF',
      fontSize: 32
    }
  };

  const generateMagicText = () => {
    if (!selectedBlockId) return;
    
    // Determine category based on current theme or content
    let category = 'default';
    if (selectedThemeId.includes('pro')) category = 'pro';
    else if (selectedThemeId.includes('famille')) category = 'family';
    else if (selectedThemeId.includes('love')) category = 'love';
    else if (selectedThemeId.includes('fun')) category = 'fun';
    // Randomly mix in birthday/thanks if no specific theme matches or just for variety in default
    else if (Math.random() > 0.7) category = 'birthday';
    else if (Math.random() > 0.7) category = 'thanks';
    
    const config = MAGIC_STYLES[category as keyof typeof MAGIC_STYLES] || MAGIC_STYLES.default;
    const randomText = config.texts[Math.floor(Math.random() * config.texts.length)];
    
    // Smart font size adjustment based on text length to prevent overflow
    let adjustedFontSize = config.fontSize;
    if (randomText.length > 50) adjustedFontSize *= 0.8;
    if (randomText.length > 80) adjustedFontSize *= 0.7;

    updateSelectedBlock({ 
      text: randomText,
      style: config.style as any,
      color: config.color,
      fontSize: adjustedFontSize,
      align: 'center' // Always center magic text for better layout
    });
  };

  const STICKERS = [
    // Noël
    '🎅', '🎄', '🎁', '⭐', '❄️', '⛄', '🦌', '🔔', '🕯️', '🍪', '🥛',
    // Nouvel An / Fête
    '🎉', '🥂', '🎆', '🎇', '🎊', '🎈', '🎭', '🎩', '👑', '🕰️',
    // Amour / Divers
    '❤️', '✨', '💖', '💌', '🍀', '🕊️', '🎶', '📷'
  ];
  
  const selectedThemeId = useAppStore((state) => state.selectedThemeId);
  const selectedTheme = themes.find((t) => t.id === selectedThemeId) || themes[0];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageCacheRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  const renderFrameRef = useRef<number | null>(null);
  const renderVersionRef = useRef(0);

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

  // Auto-save effects
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cartemagique_textBlocks', JSON.stringify(textBlocks));
    }
  }, [textBlocks, isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('cartemagique_imageElements', JSON.stringify(imageElements));
    }
  }, [imageElements, isClient]);

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
      filter: 'none', // Add filter property to new images
    };
    
    setImageElements((current) => [...current, newImage]);
    setSelectedImageId(newImage.id);
    setSelectedBlockId('');
  };

  const selectedBlock = textBlocks.find((b) => b.id === selectedBlockId);
  const selectedImage = imageElements.find((img) => img.id === selectedImageId);
  const photoCount = imageElements.filter((image) => !image.id.startsWith('sticker-')).length;

  const loadCanvasImage = useCallback((src: string) => {
    const cached = imageCacheRef.current.get(src);
    if (cached) return cached;

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = () => {
        imageCacheRef.current.delete(src);
        reject(new Error(`Impossible de charger l’image : ${src}`));
      };
      image.src = src;
    });

    imageCacheRef.current.set(src, promise);
    return promise;
  }, []);

  const drawCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !showCanvas) return;

    const renderVersion = ++renderVersionRef.current;

    try {
      const rendered = await renderCardToCanvas(canvas, {
        aspectRatio,
        backgroundColor,
        backgroundImage: selectedTheme.image,
        imageElements,
        textBlocks,
        textStyles,
        showFrame,
        frameWidth,
      }, loadCanvasImage, () => renderVersion === renderVersionRef.current);
      if (rendered && renderVersion === renderVersionRef.current) setRenderError(null);
    } catch (error) {
      if (renderVersion === renderVersionRef.current) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        setRenderError(error instanceof Error ? error.message : 'Le rendu de la carte a échoué.');
      }
      console.warn('Rendu de carte incomplet :', error);
    }
  }, [aspectRatio, backgroundColor, frameWidth, imageElements, loadCanvasImage, selectedTheme.image, showCanvas, showFrame, textBlocks, textStyles]);

  // Une image par animation : le déplacement reste fluide, même avec plusieurs photos.
  useEffect(() => {
    if (!showCanvas) return;
    if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
    renderFrameRef.current = requestAnimationFrame(() => {
      renderFrameRef.current = null;
      void drawCard();
    });
    return () => {
      if (renderFrameRef.current) cancelAnimationFrame(renderFrameRef.current);
    };
  }, [drawCard, showCanvas]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = aspectRatio === 'story' ? 338 : 400;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasWidth / rect.width;
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
      const style = textStyles[block.style] ?? textStyles.modern;

      if (isPointInsideCardTextBlock(ctx, block, style, x, y, canvasWidth, showFrame, frameWidth)) {
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
    const canvasWidth = aspectRatio === 'story' ? 338 : 400;
    const scaleX = canvasWidth / rect.width;
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
    const canvasWidth = aspectRatio === 'story' ? 338 : 400;
    const scaleX = canvasWidth / rect.width;
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
      const style = textStyles[block.style] ?? textStyles.modern;

      if (isPointInsideCardTextBlock(ctx, block, style, x, y, canvasWidth, showFrame, frameWidth)) {
        setSelectedBlockId(block.id);
        setSelectedImageId(null);
        setIsDragging(true);
        setDragOffset({ x: x - block.x, y: y - block.y });
        break;
      }
    }
  };

  const applyTemplate = async (template: CardTemplate) => {
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
      const useAppStore = (await import('@/stores/appStore')).useAppStore;
      useAppStore.getState().setSelectedThemeId(template.themeId);
    }

    // Appliquer les stickers si présents
    if (template.stickers && template.stickers.length > 0) {
      // Créer les éléments d'image pour les stickers
      // Note: createStickerDataUrl est utilisé dans templates.ts pour générer les src
      const newImages: ImageElement[] = template.stickers.map((sticker, index) => {
        // Si src est un emoji (pas une URL), on doit le convertir
        // Mais dans notre implémentation actuelle de templates.ts, nous avons déjà des URLs ou des emojis
        // Pour simplifier, si src commence par 'data:', c'est une image, sinon c'est un emoji
        
        let src = sticker.src;
        if (!src.startsWith('data:') && !src.startsWith('http') && !src.startsWith('/')) {
           // C'est probablement un emoji, on le convertit à la volée
           const canvas = document.createElement('canvas');
           canvas.width = 128;
           canvas.height = 128;
           const ctx = canvas.getContext('2d');
           if (ctx) {
             ctx.font = '100px serif';
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.fillText(sticker.src, 64, 64);
             src = canvas.toDataURL('image/png');
           }
        }

        return {
          id: 'sticker-' + Date.now() + index,
          src: src,
          x: sticker.x,
          y: sticker.y,
          width: 100 * (sticker.scale || 1),
          height: 100 * (sticker.scale || 1),
          rotation: sticker.rotation || 0,
          filter: 'none'
        };
      });
      
      setImageElements(newImages);
    } else {
      // Si pas de stickers dans le modèle, on garde les images existantes ou on vide ?
      // Pour un "preset", on remplace généralement tout
      setImageElements([]);
    }
    
    setShowTemplates(false);
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDragging || e.touches.length !== 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const canvasWidth = aspectRatio === 'story' ? 338 : 400;
    const scaleX = canvasWidth / rect.width;
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
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const readFile = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

    Promise.all(files.map(readFile)).then((sources) => {
      const canvasWidth = aspectRatio === 'story' ? 338 : 400;
      const newImages: ImageElement[] = sources.map((src, index) => ({
        id: `photo-${Date.now()}-${index}`,
        src,
        x: Math.max(20, canvasWidth / 2 - 60 + (index % 3) * 12),
        y: Math.max(20, 180 + (index % 3) * 16),
        width: 120,
        height: 120,
        rotation: 0,
        filter: 'none',
      }));
      setImageElements((current) => [...current, ...newImages]);
      setSelectedImageId(newImages[0]?.id ?? null);
      setSelectedBlockId('');
      setCollageNotice(`${newImages.length} photo${newImages.length > 1 ? 's ajoutées' : ' ajoutée'} — ouvrez « Collage » pour les placer automatiquement.`);
    }).catch(() => setCollageNotice('Une photo n’a pas pu être lue. Essayez un autre fichier.'));

    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const addAssistantText = (text: string) => {
    const base = selectedBlock;
    const newBlock: TextBlock = {
      id: `text-${Date.now()}`,
      text,
      x: base?.x ?? 200,
      y: base ? Math.min(540, base.y + 80) : 300,
      color: base?.color ?? '#ffffff',
      fontSize: base?.fontSize ?? 28,
      style: base?.style ?? 'modern',
      align: base?.align ?? 'center',
    };
    setTextBlocks((blocks) => [...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
    setSelectedImageId(null);
    setShowTextAssistant(false);
  };

  const insertAssistantText = (text: string) => {
    if (!selectedBlockId) {
      addAssistantText(text);
      return;
    }
    updateSelectedBlock({ text });
    setShowTextAssistant(false);
  };

  const createExportBlob = async () => {
    const { width, height } = getCardCanvasSize(aspectRatio);
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;

    const rendered = await renderCardToCanvas(exportCanvas, {
      aspectRatio,
      backgroundColor,
      backgroundImage: selectedTheme.image,
      imageElements,
      textBlocks,
      textStyles,
      showFrame,
      frameWidth,
    }, loadCanvasImage);
    if (!rendered) throw new Error('Le rendu de la carte a été interrompu.');

    return new Promise<Blob>((resolve, reject) => {
      exportCanvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('PNG indisponible')),
        'image/png',
        1.0,
      );
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await createExportBlob();

      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(blob));
      setPreviewBlob(blob);
      setShowPreview(true);
    } catch (error) {
      console.error('Erreur lors de l’export :', error);
      if (error instanceof CardCanvasAssetError) setRenderError(error.message);
      alert(error instanceof CardCanvasAssetError
        ? error.message
        : 'Impossible de générer le PNG. Réessayez dans un instant.');
    } finally {
      setIsExporting(false);
    }
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

  const handleWhatsAppShare = async () => {
    if (isExporting) return;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent("Regarde la carte que j'ai créée avec CarteMagique ! ✨")}`;
    const sampleFile = new File([], 'carte-magique.png', { type: 'image/png' });
    let canShareFiles = false;

    try {
      canShareFiles = Boolean(
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [sampleFile] }),
      );
    } catch {
      canShareFiles = false;
    }

    // Open the external page directly in the click handler so popup blockers do not
    // discard it while the card's images are loading.
    if (!canShareFiles) window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsExporting(true);
    let pngReady = false;

    try {
      const blob = await createExportBlob();
      pngReady = true;
      const file = new File([blob], `carte-magique-${Date.now()}.png`, { type: 'image/png' });

      if (canShareFiles && navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Ma Carte Magique',
          text: "Regarde la carte que j'ai créée ! ✨",
        });
        return;
      }

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = file.name;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (error) {
      if (isShareAbortError(error)) {
        console.info('Partage annulé par l’utilisateur.');
        return;
      }

      if (error instanceof CardCanvasAssetError) {
        setRenderError(error.message);
        alert(error.message);
        return;
      }

      console.error('Erreur lors du partage WhatsApp :', error);
      if (pngReady) {
        alert('Le PNG a été créé, mais le partage n’a pas pu être lancé.');
      } else {
        alert('Impossible de préparer le PNG. Réessayez dans un instant.');
      }
    } finally {
      setIsExporting(false);
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
        <div className="flex gap-2">
          <button 
            onClick={handleUndo} 
            disabled={historyIndex <= 0}
            className={`p-2 rounded-full transition-colors ${historyIndex <= 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
            title="Annuler"
          >
            <Undo size={20} />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex >= history.length - 1}
            className={`p-2 rounded-full transition-colors ${historyIndex >= history.length - 1 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
            title="Rétablir"
          >
            <Redo size={20} />
          </button>
        </div>
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
              {STARTER_TEMPLATES.map((template, index) => {
                // Seasonal Logic
                const currentMonth = new Date().getMonth(); // 0-11
                const isDecember = currentMonth === 11;
                const isJanuary = currentMonth === 0;
                const isFebruary = currentMonth === 1;

                let isSeasonal = false;
                let seasonLabel = '';

                if (isDecember && (template.id === 'family' || template.id === 'fun')) {
                  isSeasonal = true;
                  seasonLabel = '🎄 Spécial Noël';
                } else if (isJanuary && (template.id === 'pro' || template.id === 'minimal')) {
                  isSeasonal = true;
                  seasonLabel = '🥂 Bonne Année';
                } else if (isFebruary && template.id === 'love') {
                  isSeasonal = true;
                  seasonLabel = '❤️ St Valentin';
                }

                return (
                  <div 
                    key={template.id}
                    className={`relative bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-all border-2 animate-slide-up delay-${(index + 1) * 100} ${
                      isSeasonal 
                        ? 'border-amber-400 ring-2 ring-amber-400/20' 
                        : 'border-transparent hover:border-blue-500'
                    }`}
                    onClick={() => applyTemplate(template)}
                  >
                    {isSeasonal && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {seasonLabel}
                      </div>
                    )}
                    <div className="text-4xl mb-3 text-center">{template.icon}</div>
                    <h3 className="text-xl font-bold text-center mb-2">{template.name}</h3>
                    <p className="text-gray-400 text-center text-sm">{template.description}</p>
                  </div>
                );
              })}
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
                  onClick={handleShare}
                  variant="secondary"
                  size="sm"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  📤 Partager l’image
                </Button>
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
      <main className={showCanvas ? "py-5 pb-28 lg:py-8 lg:pb-8" : "py-8"}>
        {!showCanvas ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Choisissez votre fond</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {galleryThemes.length} modèles pour vos fêtes et vos messages.
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
                <div className="lg:col-span-2 order-1">
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden">
                    {/* Magic Dust Animation Overlay */}
                    {showMagicDust && (
                      <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-20"></div>
                        <div className="absolute text-4xl animate-bounce" style={{ top: '40%', left: '40%' }}>✨</div>
                        <div className="absolute text-4xl animate-bounce" style={{ top: '30%', left: '60%', animationDelay: '0.1s' }}>✨</div>
                        <div className="absolute text-4xl animate-bounce" style={{ top: '60%', left: '50%', animationDelay: '0.2s' }}>✨</div>
                        <div className="absolute text-4xl animate-bounce" style={{ top: '50%', left: '30%', animationDelay: '0.3s' }}>✨</div>
                        <div className="absolute text-4xl animate-bounce" style={{ top: '45%', left: '70%', animationDelay: '0.4s' }}>✨</div>
                      </div>
                    )}
                    <div style={{ aspectRatio: '2/3', maxWidth: '100%', width: '100%', maxHeight: '80vh' }} ref={containerRef}>
              <div className="flex justify-center mb-4 gap-2">
                <button
                  onClick={() => setAspectRatio('standard')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${aspectRatio === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <Monitor size={14} /> Standard
                </button>
                <button
                  onClick={() => setAspectRatio('story')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${aspectRatio === 'story' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  <Smartphone size={14} /> Story (9:16)
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={aspectRatio === 'story' ? 338 : 400}
                height={600}
                className="h-auto shadow-2xl rounded-lg cursor-crosshair touch-none mx-auto"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh', 
                  aspectRatio: aspectRatio === 'story' ? '9/16' : '2/3',
                  backgroundColor: backgroundColor || 'transparent'
                }}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={() => setIsDragging(false)}
                onTouchCancel={() => setIsDragging(false)}
              />
                    </div>
                  </div>
                  {renderError && (
                    <div role="alert" aria-live="assertive" className="mx-auto mt-3 max-w-xl rounded-lg border border-red-500/50 bg-red-950/70 p-3 text-sm text-red-100">
                      <p className="font-semibold">Aperçu incomplet — l’export PNG est bloqué.</p>
                      <p className="mt-1">{renderError}</p>
                    </div>
                  )}
                  <p className="text-sm text-gray-400 text-center mt-2">
                    💡 Cliquez/touchez et faites glisser pour déplacer les éléments
                  </p>
                </div>

                {/* Panneau de contrôle */}
                <div className="hidden lg:block space-y-3 md:space-y-4 overflow-y-auto max-h-[80vh] lg:order-2">
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
                      <Label className={darkMode ? "text-gray-300 mb-2 block text-sm" : "text-gray-700 mb-2 block text-sm"}>Ajouter un sticker</Label>
                      <div className={`grid grid-cols-8 gap-1 p-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
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

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="lg"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-base md:text-sm md:py-2 py-3"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Photo perso
                      </Button>
                      <div className="relative">
                        <Button
                          onClick={() => setShowCollageMenu(!showCollageMenu)}
                          size="lg"
                          variant="outline"
                          className={`w-full border-blue-600 text-blue-400 hover:bg-blue-900/20 text-base md:text-sm md:py-2 py-3 ${showCollageMenu ? 'bg-blue-900/20' : ''}`}
                        >
                          <LayoutGrid className="w-4 h-4 mr-2" />
                          Collage
                        </Button>
                        {showCollageMenu && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 z-20">
                          <div className="grid grid-cols-3 gap-2">
                            <button 
                              onClick={() => {
                                applyCollageLayout(1);
                                setShowCollageMenu(false);
                              }}
                              className="p-2 hover:bg-gray-700 rounded flex flex-col items-center"
                              title="1 Photo"
                            >
                              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm"></div>
                              <span className="text-xs mt-1">1</span>
                            </button>
                            <button 
                              onClick={() => {
                                applyCollageLayout(2);
                                setShowCollageMenu(false);
                              }}
                              className="p-2 hover:bg-gray-700 rounded flex flex-col items-center"
                              title="2 Photos"
                            >
                              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm flex flex-col">
                                <div className="h-1/2 border-b border-gray-400"></div>
                              </div>
                              <span className="text-xs mt-1">2</span>
                            </button>
                            <button 
                              onClick={() => {
                                applyCollageLayout(3);
                                setShowCollageMenu(false);
                              }}
                              className="p-2 hover:bg-gray-700 rounded flex flex-col items-center"
                              title="3 Photos"
                            >
                              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm flex flex-col">
                                <div className="h-1/2 border-b border-gray-400"></div>
                                <div className="h-1/2 flex">
                                  <div className="w-1/2 border-r border-gray-400"></div>
                                </div>
                              </div>
                              <span className="text-xs mt-1">3</span>
                            </button>
                            <button 
                              onClick={() => {
                                applyCollageLayout(4);
                                setShowCollageMenu(false);
                              }}
                              className="p-2 hover:bg-gray-700 rounded flex flex-col items-center"
                              title="4 Photos"
                            >
                              <div className="w-6 h-6 border-2 border-gray-400 rounded-sm grid grid-cols-2 grid-rows-2">
                                <div className="border-r border-b border-gray-400"></div>
                                <div className="border-b border-gray-400"></div>
                                <div className="border-r border-gray-400"></div>
                                <div></div>
                              </div>
                              <span className="text-xs mt-1">4</span>
                            </button>
                          </div>
                        </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-400">{collageNotice}</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
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
                      <div className={`rounded-lg p-4 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold">Image sélectionnée</h3>
                          <button
                            onClick={() => handleDeleteImage(selectedImage.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Supprimer l'image"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        
                        <div>
                          <Label className={darkMode ? "text-gray-300" : "text-gray-700"}>Filtre photo</Label>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            {[
                              { id: 'none', name: 'Aucun', icon: '🚫' },
                              { id: 'grayscale', name: 'N&B', icon: '⚫' },
                              { id: 'sepia', name: 'Sépia', icon: '🟤' },
                              { id: 'vintage', name: 'Rétro', icon: '🎞️' }
                            ].map((filter) => (
                              <button
                                key={filter.id}
                                onClick={() => updateSelectedImage({ filter: filter.id as any })}
                                className={`flex flex-col items-center justify-center p-2 rounded text-xs border transition-colors ${
                                  (selectedImage.filter || 'none') === filter.id
                                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                    : darkMode 
                                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                                      : 'border-gray-300 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                <span className="text-lg mb-1">{filter.icon}</span>
                                {filter.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tint Control */}
                        <div>
                          <Label className={darkMode ? "text-gray-300" : "text-gray-700"}>Teinte du sticker</Label>
                          <div className="grid grid-cols-5 gap-2 mt-1">
                            {[
                              { id: 'original', color: 'transparent', label: 'Orig.' },
                              { id: '#FFD700', color: '#FFD700', label: 'Or' },
                              { id: '#C0C0C0', color: '#C0C0C0', label: 'Arg.' },
                              { id: '#FF0000', color: '#FF0000', label: 'Rge' },
                              { id: '#FFFFFF', color: '#FFFFFF', label: 'Blc' },
                            ].map((tint) => (
                              <button
                                key={tint.id}
                                onClick={() => updateSelectedImage({ tint: tint.id })}
                                className={`flex flex-col items-center justify-center p-2 rounded text-xs border transition-colors ${
                                  (selectedImage.tint || 'original') === tint.id
                                    ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                    : darkMode 
                                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                                      : 'border-gray-300 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                <div 
                                  className="w-6 h-6 rounded-full mb-1 border border-gray-500" 
                                  style={{ 
                                    backgroundColor: tint.color === 'transparent' ? 'transparent' : tint.color,
                                    backgroundImage: tint.color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                                  }}
                                />
                                {tint.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <h3 className="text-sm font-medium mt-4">Taille: {selectedImage.width}×{selectedImage.height}px</h3>
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
                      <div className={`rounded-lg p-4 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold">Texte</h3>
                          <Button
                            onClick={() => setShowTextAssistant(true)}
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700 text-xs"
                            title="Ouvrir l’assistant de texte"
                          >
                            <Wand2 className="w-3 h-3 mr-1" />
                            Assistant
                          </Button>
                        </div>
                        <textarea
                          value={selectedBlock.text}
                          onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                          placeholder="Votre message..."
                          className={`w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode 
                              ? 'bg-gray-700 text-white border-gray-600' 
                              : 'bg-white text-gray-900 border-gray-300'
                          }`}
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

                      <div className={`rounded-lg p-4 space-y-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                        <h3 className="text-lg font-bold">Style de texte</h3>
                        {/* Text Alignment Controls */}
                        <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-fit mx-auto">
                          <button
                            onClick={() => updateSelectedBlock({ align: 'left' })}
                            className={`p-2 rounded transition-colors ${selectedBlock.align === 'left' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title="Aligner à gauche"
                          >
                            <AlignLeft size={18} />
                          </button>
                          <button
                            onClick={() => updateSelectedBlock({ align: 'center' })}
                            className={`p-2 rounded transition-colors ${selectedBlock.align === 'center' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title="Centrer"
                          >
                            <AlignCenter size={18} />
                          </button>
                          <button
                            onClick={() => updateSelectedBlock({ align: 'right' })}
                            className={`p-2 rounded transition-colors ${selectedBlock.align === 'right' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            title="Aligner à droite"
                          >
                            <AlignRight size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(textStyles).map(([key, style]) => (
                            <button
                              key={key}
                              onClick={() => updateSelectedBlock({ style: key as any })}
                              className={`p-2 rounded border text-sm transition-colors ${
                                selectedBlock.style === key
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300' 
                                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                              style={{ fontFamily: style.fontFamily }}
                            >
                              {style.name}
                            </button>
                          ))}
                          {customFonts.map((fontName) => (
                            <button
                              key={fontName}
                              onClick={() => updateSelectedBlock({ style: fontName as any })}
                              className={`p-2 rounded border text-sm transition-colors ${
                                selectedBlock.style === fontName
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : darkMode 
                                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-gray-300' 
                                    : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'
                              }`}
                              style={{ fontFamily: `"${fontName}", sans-serif` }}
                            >
                              Ma Police
                            </button>
                          ))}
                          <button
                            onClick={() => fontInputRef.current?.click()}
                            className={`p-2 rounded border text-sm transition-colors border-dashed flex items-center justify-center gap-2 ${
                              darkMode 
                                ? 'bg-transparent border-gray-500 hover:bg-gray-800 text-gray-400' 
                                : 'bg-transparent border-gray-400 hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Type size={14} /> Importer
                          </button>
                          <input
                            ref={fontInputRef}
                            type="file"
                            accept=".ttf,.otf,.woff,.woff2"
                            onChange={handleFontUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Fond</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Couleur unie</label>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => setBackgroundColor('')}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                  backgroundColor === '' ? 'border-white ring-2 ring-white' : 'border-gray-600'
                                }`}
                                title="Image (par défaut)"
                              >
                                <span className="text-xs">IMG</span>
                              </button>
                              {['#1a1a1a', '#ffffff', '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#818cf8', '#f472b6'].map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setBackgroundColor(color)}
                                  className={`w-8 h-8 rounded-full border-2 ${
                                    backgroundColor === color ? 'border-white ring-2 ring-white' : 'border-gray-600'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Filtres photo</h3>
                        <div className="grid grid-cols-2 gap-2">
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
                        <h3 className="text-lg font-bold">Contour du texte</h3>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={textStyles[selectedBlock.style].outline}
                              onChange={(e) => {
                                const newStyles = { ...textStyles };
                                newStyles[selectedBlock.style] = {
                                  ...newStyles[selectedBlock.style],
                                  outline: e.target.checked
                                };
                                setTextStyles(newStyles);
                              }}
                              className="w-5 h-5 cursor-pointer"
                            />
                            <span className="text-sm">Ajouter un contour</span>
                          </label>
                          {textStyles[selectedBlock.style].outline && (
                            <div>
                              <label className="text-sm text-gray-300 block mb-2">Épaisseur: {textStyles[selectedBlock.style].outlineWidth || 2}px</label>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={textStyles[selectedBlock.style]?.outlineWidth || 2}
                                onChange={(e) => {
                                  const newStyles = { ...textStyles };
                                  newStyles[selectedBlock.style] = {
                                    ...newStyles[selectedBlock.style],
                                    outlineWidth: Number(e.target.value)
                                  };
                                  setTextStyles(newStyles);
                                }}
                                className="w-full"
                              />
                              <div className="mt-2">
                                <label className="text-sm text-gray-300 block mb-2">Couleur du contour</label>
                                <div className="flex gap-2 flex-wrap">
                                  {['#ffffff', '#000000', '#ff0000', '#fbbf24'].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() => {
                                        const newStyles = { ...textStyles };
                                        newStyles[selectedBlock.style] = {
                                          ...newStyles[selectedBlock.style],
                                          outlineColor: color
                                        };
                                        setTextStyles(newStyles);
                                      }}
                                      className={`w-8 h-8 rounded-full border-2 ${
                                        (textStyles[selectedBlock.style].outlineColor || '#000000') === color ? 'border-white ring-2 ring-white' : 'border-gray-600'
                                      }`}
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                        <h3 className="text-lg font-bold">Cadre blanc (Image)</h3>
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

            <div className="hidden lg:flex text-center mt-6 md:mt-10 flex-col sm:flex-row gap-2 md:gap-4 justify-center">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-base bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                {isExporting ? '⏳ Préparation...' : '📥 Télécharger'}
              </Button>
              <Button
                onClick={handleWhatsAppShare}
                disabled={isExporting}
                size="lg"
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-base bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                WhatsApp
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

      <TextAssistantDialog
        open={showTextAssistant}
        themeId={selectedThemeId}
        canReplace={Boolean(selectedBlock)}
        onClose={() => setShowTextAssistant(false)}
        onInsert={insertAssistantText}
        onAdd={addAssistantText}
      />

      {showCanvas && (
        <>
          {/* Barre d’actions fixe : le geste de création reste à portée de pouce. */}
          <nav className={`lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-950/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur ${mobileTool ? 'pointer-events-none opacity-0' : ''}`} aria-label="Actions de création">
            <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
              {[
                { id: 'text', label: 'Texte', icon: Type },
                { id: 'photo', label: 'Photo', icon: ImagePlus },
                { id: 'style', label: 'Style', icon: SlidersHorizontal },
                { id: 'share', label: 'Finaliser', icon: Send },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setMobileTool(id as 'text' | 'photo' | 'style' | 'share')}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold text-slate-200 transition active:scale-95 hover:bg-white/10"
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {mobileTool && (
            <section className="lg:hidden fixed inset-x-0 bottom-0 z-[60] max-h-[68dvh] overflow-y-auto rounded-t-3xl border-t border-slate-600 bg-slate-900 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_50px_rgba(0,0,0,0.45)]" role="dialog" aria-modal="true" aria-label="Outils rapides">
              <div className="mx-auto max-w-md">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Modification rapide</p>
                    <h3 className="text-lg font-bold">
                      {mobileTool === 'text' && 'Votre message'}
                      {mobileTool === 'photo' && 'Photos & collage'}
                      {mobileTool === 'style' && 'Style de la carte'}
                      {mobileTool === 'share' && 'Finaliser votre carte'}
                    </h3>
                  </div>
                  <button onClick={() => setMobileTool(null)} aria-label="Fermer les outils" className="rounded-full p-2 text-slate-300 hover:bg-white/10"><X size={22} /></button>
                </div>

                {mobileTool === 'text' && (
                  <div className="space-y-3">
                    <button onClick={() => setShowTextAssistant(true)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 font-bold text-white active:scale-[0.98]"><Wand2 size={19} /> Assistant de texte</button>
                    <p className="-mt-1 text-center text-xs text-slate-400">3 messages personnalisés, créés sur votre appareil.</p>
                    {selectedBlock ? (
                      <>
                        <textarea
                          value={selectedBlock.text}
                          onChange={(event) => updateSelectedBlock({ text: event.target.value })}
                          className="h-24 w-full resize-none rounded-2xl border border-slate-600 bg-slate-800 p-3 text-base text-white outline-none focus:border-amber-400"
                          placeholder="Écrivez votre message…"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { align: 'left', label: 'Gauche', icon: AlignLeft },
                            { align: 'center', label: 'Centrer', icon: AlignCenter },
                            { align: 'right', label: 'Droite', icon: AlignRight },
                          ].map(({ align, label, icon: Icon }) => (
                            <button key={align} onClick={() => updateSelectedBlock({ align: align as TextBlock['align'] })} className={`min-h-11 rounded-xl border text-xs font-semibold ${selectedBlock.align === align ? 'border-amber-400 bg-amber-400/15 text-amber-200' : 'border-slate-600 bg-slate-800 text-slate-200'}`}>
                              <Icon size={18} className="mx-auto mb-1" />{label}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-800 p-2">
                          <span className="pl-2 text-sm text-slate-300">Taille</span>
                          <div className="flex gap-2">
                            <button onClick={() => updateSelectedBlock({ fontSize: Math.max(18, selectedBlock.fontSize - 4) })} className="min-h-10 min-w-10 rounded-xl bg-slate-700 text-lg font-bold active:scale-95">A−</button>
                            <span className="flex min-w-12 items-center justify-center text-sm font-semibold">{selectedBlock.fontSize}</span>
                            <button onClick={() => updateSelectedBlock({ fontSize: Math.min(96, selectedBlock.fontSize + 4) })} className="min-h-10 min-w-10 rounded-xl bg-slate-700 text-lg font-bold active:scale-95">A+</button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="rounded-2xl bg-slate-800 p-4 text-sm text-slate-300">Touchez un bloc de texte sur la carte pour le modifier.</p>
                    )}
                    <button onClick={handleAddTextBlock} className="min-h-12 w-full rounded-2xl bg-emerald-600 font-bold text-white active:scale-[0.98]">+ Ajouter un texte</button>
                  </div>
                )}

                {mobileTool === 'photo' && (
                  <div className="space-y-3">
                    <button onClick={() => fileInputRef.current?.click()} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 font-bold text-white active:scale-[0.98]"><Upload size={20} /> Ajouter une ou plusieurs photos</button>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((count) => {
                        const available = photoCount >= count;
                        return (
                          <button key={count} disabled={!available} onClick={() => { applyCollageLayout(count); setMobileTool(null); }} className={`min-h-16 rounded-2xl border text-sm font-semibold ${available ? 'border-slate-600 bg-slate-800 active:scale-95' : 'cursor-not-allowed border-slate-700 bg-slate-800/40 text-slate-500'}`}>
                            <LayoutGrid size={20} className={`mx-auto mb-1 ${available ? 'text-amber-300' : 'text-slate-600'}`} />{count} photo{count > 1 ? 's' : ''}
                          </button>
                        );
                      })}
                    </div>
                    <p role="status" className="rounded-xl bg-slate-800 p-3 text-xs leading-relaxed text-slate-300">{photoCount === 0 ? 'Ajoutez une photo pour déverrouiller les dispositions.' : collageNotice}</p>
                    {selectedImage && (
                      <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-3">
                        <span className="text-sm text-slate-300">Photo sélectionnée</span>
                        <div className="flex gap-2">
                          <button onClick={() => updateSelectedImage({ width: Math.max(50, selectedImage.width - 20), height: Math.max(50, selectedImage.height - 20) })} className="h-10 w-10 rounded-xl bg-slate-700 font-bold">−</button>
                          <button onClick={() => updateSelectedImage({ width: Math.min(400, selectedImage.width + 20), height: Math.min(400, selectedImage.height + 20) })} className="h-10 w-10 rounded-xl bg-slate-700 font-bold">+</button>
                          <button onClick={() => handleDeleteImage(selectedImage.id)} className="h-10 rounded-xl bg-red-500/15 px-3 text-sm font-semibold text-red-300">Supprimer</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mobileTool === 'style' && (
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-200">Format</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setAspectRatio('standard')} className={`min-h-12 rounded-2xl border font-semibold ${aspectRatio === 'standard' ? 'border-amber-400 bg-amber-400/15 text-amber-200' : 'border-slate-600 bg-slate-800'}`}><Monitor size={17} className="mr-1 inline" />Carte</button>
                        <button onClick={() => setAspectRatio('story')} className={`min-h-12 rounded-2xl border font-semibold ${aspectRatio === 'story' ? 'border-amber-400 bg-amber-400/15 text-amber-200' : 'border-slate-600 bg-slate-800'}`}><Smartphone size={17} className="mr-1 inline" />Story</button>
                      </div>
                    </div>
                    {selectedBlock && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-slate-200">Couleur du texte</p>
                        <div className="flex gap-3">
                          {['#ffffff', '#000000', '#fbbf24', '#f87171', '#60a5fa'].map((color) => (
                            <button key={color} onClick={() => updateSelectedBlock({ color })} aria-label={`Choisir ${color}`} className={`h-9 w-9 rounded-full border-2 ${selectedBlock.color === color ? 'border-white ring-2 ring-amber-400' : 'border-slate-500'}`} style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <button onClick={() => { if (!showFrame && frameWidth === 0) setFrameWidth(12); setShowFrame((visible) => !visible); }} aria-pressed={showFrame} className={`min-h-12 w-full rounded-2xl border font-semibold ${showFrame ? 'border-amber-400 bg-amber-400/15 text-amber-200' : 'border-slate-600 bg-slate-800'}`}>▣ {showFrame ? 'Retirer le cadre blanc' : 'Ajouter un cadre blanc'}</button>
                    {showFrame && (
                      <label className="block rounded-2xl bg-slate-800 p-3 text-sm font-semibold text-slate-200">Épaisseur : {frameWidth}px
                        <input type="range" min="4" max="40" value={frameWidth} onChange={(event) => setFrameWidth(Number(event.target.value))} className="mt-2 w-full" />
                      </label>
                    )}
                  </div>
                )}

                {mobileTool === 'share' && (
                  <div className="space-y-3">
                    <p className="rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">Votre création est prête. Ouvrez l’aperçu pour l’enregistrer, l’envoyer ou la partager depuis votre smartphone.</p>
                    <button onClick={() => { handleExport(); setMobileTool(null); }} disabled={isExporting} className="min-h-14 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-slate-950 disabled:opacity-60">{isExporting ? 'Préparation…' : 'Prévisualiser et télécharger'}</button>
                    <button onClick={() => { setShowCanvas(false); setMobileTool(null); }} className="min-h-12 w-full rounded-2xl border border-slate-600 bg-slate-800 font-semibold">Changer de fond</button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
