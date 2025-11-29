export interface SavedCard {
  id: string;
  name: string;
  theme: string;
  textBlocks: Array<{
    text: string;
    color: string;
    style: string;
    size: number;
    x: number;
    y: number;
  }>;
  images: Array<{
    id: string;
    src: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  }>;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'cartemagique_cards';
const MAX_CARDS = 10;

export const saveCard = (card: SavedCard): void => {
  try {
    const cards = getCards();
    const existingIndex = cards.findIndex(c => c.id === card.id);
    
    if (existingIndex >= 0) {
      cards[existingIndex] = { ...card, updatedAt: Date.now() };
    } else {
      cards.unshift({ ...card, createdAt: Date.now(), updatedAt: Date.now() });
    }
    
    // Garder seulement les 10 dernières cartes
    if (cards.length > MAX_CARDS) {
      cards.pop();
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

export const getCards = (): SavedCard[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    return [];
  }
};

export const getCardById = (id: string): SavedCard | undefined => {
  const cards = getCards();
  return cards.find(c => c.id === id);
};

export const deleteCard = (id: string): void => {
  try {
    const cards = getCards();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

export const clearAllCards = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression complète:', error);
  }
};

export const generateCardId = (): string => {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
