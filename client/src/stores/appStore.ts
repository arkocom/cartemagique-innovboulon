import { create } from 'zustand';
import type { CanvasElement } from '@/../../shared/types';

const getDefaultText = (themeId: string): string => {
  if (themeId.startsWith('noel')) return 'Joyeux Noël\nde la part de…';
  if (themeId.startsWith('nouvel-an')) return 'Bonne Année 2026 !';
  return 'Meilleurs vœux\npour cette fin d\'année';
};

export interface AppState {
  selectedThemeId: string;
  pendingThemeSelection: boolean;
  elements: CanvasElement[];
  selectedId: string | null;
  setSelectedThemeId: (id: string) => void;
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, attrs: Partial<CanvasElement>) => void;
  selectElement: (id: string | null) => void;
  removeElement: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedThemeId: 'noel-1',
  pendingThemeSelection: false,
  elements: [
    {
      id: 'main-text',
      type: 'text',
      x: 400,
      y: 300,
      content: 'Joyeux Noël\nde la part de…',
      fill: '#ffffff',
      fontSize: 48,
      fontFamily: 'Georgia, serif',
      align: 'center',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  ],
  selectedId: null,

  setSelectedThemeId: (id) => {
    const content = getDefaultText(id);
    set({
      selectedThemeId: id,
      pendingThemeSelection: true,
      elements: [
        {
          id: 'main-text',
          type: 'text',
          x: 400,
          y: 300,
          content,
          fill: '#ffffff',
          fontSize: 48,
          fontFamily: 'Georgia, serif',
          align: 'center',
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
      ],
      selectedId: null,
    });
  },

  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
      selectedId: element.id,
    })),

  updateElement: (id, attrs) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...attrs } : el
      ),
    })),

  selectElement: (id) => set({ selectedId: id }),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: null,
    })),
}));

