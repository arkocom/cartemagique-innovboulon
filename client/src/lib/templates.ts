import { TextBlock } from '../pages/EditorWithImages';
import { createStickerDataUrl } from './stickerUtils';

export interface CardTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  textBlocks: Omit<TextBlock, 'id'>[]; // ID will be generated on apply
  stickers?: { x: number; y: number; src: string; scale: number; rotation: number }[];
  themeId?: string; // Optional preferred theme
}

export const STARTER_TEMPLATES: CardTemplate[] = [
  {
    id: 'pro',
    name: 'Vœux Pro',
    icon: '💼',
    description: 'Sobre et élégant pour vos partenaires.',
    themeId: 'pro-1',
    textBlocks: [
      {
        text: 'Meilleurs Vœux 2025',
        x: 200,
        y: 200,
        color: '#1e293b', // Dark slate
        fontSize: 32,
        style: 'elegant',
        align: 'center'
      },
      {
        text: 'Toute l\'équipe vous souhaite\nune excellente année de réussite.',
        x: 200,
        y: 300,
        color: '#334155', // Slate 700
        fontSize: 18,
        style: 'classic',
        align: 'center'
      },
      {
        text: 'Votre Entreprise',
        x: 200,
        y: 450,
        color: '#0f172a', // Slate 900
        fontSize: 22,
        style: 'modern',
        align: 'center',
      },
    ],
    stickers: [
      { x: 350, y: 50, src: '✨', scale: 0.5, rotation: 0 },
    ]
  },
  {
    id: 'family',
    name: 'Famille',
    icon: '👨‍👩‍👧‍👦',
    description: 'Chaleureux pour vos proches.',
    themeId: 'famille-1',
    textBlocks: [
      {
        text: 'Joyeux Noël !',
        x: 200,
        y: 150,
        color: '#be123c', // Rose red
        fontSize: 38,
        style: 'festive',
        align: 'center'
      },
      {
        text: 'Plein de bonheur et d\'amour\npour cette nouvelle année.',
        x: 200,
        y: 300,
        color: '#374151', // Gray 700
        fontSize: 20,
        style: 'classic',
        align: 'center'
      },
      {
        text: 'La famille Martin',
        x: 200,
        y: 450,
        color: '#1f2937', // Gray 800
        fontSize: 24,
        style: 'modern',
        align: 'center'
      }
    ],
    stickers: [
      { x: 50, y: 50, src: '🎄', scale: 0.8, rotation: -15 },
      { x: 350, y: 50, src: '⭐', scale: 0.6, rotation: 15 },
      { x: 50, y: 550, src: '🎁', scale: 0.7, rotation: 10 },
    ]
  },
  {
    id: 'love',
    name: 'Amour',
    icon: '❤️',
    description: 'Romantique pour votre moitié.',
    textBlocks: [
      {
        text: 'Toi & Moi',
        x: 200,
        y: 200,
        color: '#FFFFFF',
        fontSize: 48,
        style: 'elegant',
        align: 'center'
      },
      {
        text: 'Pour une année 2025\nremplie de magie.',
        x: 200,
        y: 350,
        color: '#FFD700',
        fontSize: 24,
        style: 'classic',
        align: 'center'
      }
    ],
    stickers: [
      { x: 100, y: 100, src: '❤️', scale: 0.8, rotation: -10 },
      { x: 300, y: 100, src: '❤️', scale: 0.8, rotation: 10 },
      { x: 200, y: 500, src: '✨', scale: 0.6, rotation: 0 },
    ]
  },
  {
    id: 'fun',
    name: 'Fun',
    icon: '🎉',
    description: 'Festif et décalé pour les amis.',
    textBlocks: [
      {
        text: 'PARTY TIME !',
        x: 200,
        y: 150,
        color: '#FFD700',
        fontSize: 40,
        style: 'festive',
        align: 'center'
      },
      {
        text: '2025 va être\nINCROYABLE !',
        x: 200,
        y: 300,
        color: '#FFFFFF',
        fontSize: 28,
        style: 'modern',
        align: 'center'
      },
      {
        text: '#BestYearEver',
        x: 200,
        y: 500,
        color: '#FFFFFF',
        fontSize: 18,
        style: 'classic',
        align: 'center'
      }
    ],
    stickers: [
      { x: 50, y: 50, src: '🎉', scale: 0.9, rotation: -20 },
      { x: 350, y: 50, src: '🥂', scale: 0.9, rotation: 20 },
      { x: 50, y: 550, src: '🎆', scale: 0.8, rotation: 10 },
      { x: 350, y: 550, src: '🎉', scale: 0.8, rotation: -10 },
    ]
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '✨',
    description: 'Simple et efficace.',
    textBlocks: [
      {
        text: '2025',
        x: 200,
        y: 250,
        color: '#FFFFFF',
        fontSize: 80,
        style: 'modern',
        align: 'center'
      },
      {
        text: 'Bonne Année',
        x: 200,
        y: 350,
        color: '#FFFFFF',
        fontSize: 24,
        style: 'classic',
        align: 'center'
      }
    ],
    stickers: [
      { x: 200, y: 100, src: '✨', scale: 0.6, rotation: 0 },
    ]
  }
];
