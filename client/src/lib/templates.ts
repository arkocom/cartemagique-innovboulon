export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'entreprise' | 'personnel' | 'famille' | 'classique';
  textBlocks: Array<{
    text: string;
    color: string;
    style: string;
    size: number;
    x: number;
    y: number;
  }>;
}

export const TEMPLATES: Template[] = [
  {
    id: 'template_1',
    name: 'Titre + Signature',
    description: 'Un titre principal avec une signature en bas',
    category: 'classique',
    textBlocks: [
      {
        text: 'Joyeux Noël',
        color: '#fbbf24',
        style: 'Festif',
        size: 56,
        x: 50,
        y: 35
      },
      {
        text: 'de la part de toute l\'équipe',
        color: '#ffffff',
        style: 'Classique',
        size: 24,
        x: 50,
        y: 75
      }
    ]
  },
  {
    id: 'template_2',
    name: 'Trois blocs alignés',
    description: 'Trois messages alignés verticalement',
    category: 'famille',
    textBlocks: [
      {
        text: 'Meilleurs vœux',
        color: '#ef4444',
        style: 'Moderne',
        size: 40,
        x: 50,
        y: 25
      },
      {
        text: 'pour 2026',
        color: '#22c55e',
        style: 'Moderne',
        size: 40,
        x: 50,
        y: 50
      },
      {
        text: 'Santé et bonheur',
        color: '#60a5fa',
        style: 'Moderne',
        size: 40,
        x: 50,
        y: 75
      }
    ]
  },
  {
    id: 'template_3',
    name: 'Professionnel',
    description: 'Message professionnel avec logo',
    category: 'entreprise',
    textBlocks: [
      {
        text: 'Meilleurs vœux',
        color: '#1e40af',
        style: 'Élégant',
        size: 48,
        x: 50,
        y: 30
      },
      {
        text: 'Nous vous souhaitons une excellente année 2026',
        color: '#1e3a8a',
        style: 'Classique',
        size: 20,
        x: 50,
        y: 55
      },
      {
        text: 'L\'équipe',
        color: '#3b82f6',
        style: 'Classique',
        size: 18,
        x: 50,
        y: 80
      }
    ]
  },
  {
    id: 'template_4',
    name: 'Festif coloré',
    description: 'Plusieurs messages avec couleurs festives',
    category: 'personnel',
    textBlocks: [
      {
        text: 'Joyeuses',
        color: '#dc2626',
        style: 'Festif',
        size: 44,
        x: 35,
        y: 35
      },
      {
        text: 'Fêtes',
        color: '#22c55e',
        style: 'Festif',
        size: 44,
        x: 65,
        y: 35
      },
      {
        text: 'Bonne année 2026 !',
        color: '#fbbf24',
        style: 'Festif',
        size: 32,
        x: 50,
        y: 70
      }
    ]
  },
  {
    id: 'template_5',
    name: 'Minimaliste',
    description: 'Design épuré et élégant',
    category: 'entreprise',
    textBlocks: [
      {
        text: 'Bonne année',
        color: '#ffffff',
        style: 'Élégant',
        size: 52,
        x: 50,
        y: 45
      },
      {
        text: '2026',
        color: '#e5e7eb',
        style: 'Moderne',
        size: 36,
        x: 50,
        y: 70
      }
    ]
  }
];

export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: Template['category']): Template[] => {
  return TEMPLATES.filter(t => t.category === category);
};
