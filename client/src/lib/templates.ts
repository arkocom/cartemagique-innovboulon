import { TextBlock } from '../pages/EditorWithImages';

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
    textBlocks: [
      {
        text: 'Meilleurs Vœux 2025',
        x: 200,
        y: 150,
        color: '#FFFFFF',
        fontSize: 36,
        style: 'elegant'
      },
      {
        text: 'Toute l\'équipe vous souhaite\nune excellente année.',
        x: 200,
        y: 300,
        color: '#FFFFFF',
        fontSize: 20,
        style: 'classic'
      },
      {
        text: 'Innov\'BOULON',
        x: 200,
        y: 500,
        color: '#FFD700', // Or
        fontSize: 24,
        style: 'modern'
      }
    ]
  },
  {
    id: 'family',
    name: 'Famille',
    icon: '👨‍👩‍👧‍👦',
    description: 'Chaleureux pour vos proches.',
    textBlocks: [
      {
        text: 'Joyeux Noël !',
        x: 200,
        y: 100,
        color: '#FF0000', // Rouge
        fontSize: 42,
        style: 'festive'
      },
      {
        text: 'Plein de bonheur et d\'amour\npour cette nouvelle année.',
        x: 200,
        y: 450,
        color: '#FFFFFF',
        fontSize: 22,
        style: 'classic'
      },
      {
        text: 'La famille Martin',
        x: 200,
        y: 550,
        color: '#FFFFFF',
        fontSize: 18,
        style: 'modern'
      }
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
        style: 'elegant'
      },
      {
        text: 'Pour une année 2025\nremplie de magie.',
        x: 200,
        y: 350,
        color: '#FFD700',
        fontSize: 24,
        style: 'classic'
      }
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
        style: 'festive'
      },
      {
        text: '2025 va être\nINCROYABLE !',
        x: 200,
        y: 300,
        color: '#FFFFFF',
        fontSize: 28,
        style: 'modern'
      },
      {
        text: '#BestYearEver',
        x: 200,
        y: 500,
        color: '#FFFFFF',
        fontSize: 18,
        style: 'classic'
      }
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
        style: 'modern'
      },
      {
        text: 'Bonne Année',
        x: 200,
        y: 350,
        color: '#FFFFFF',
        fontSize: 24,
        style: 'classic'
      }
    ]
  }
];
