export interface Sticker {
  id: string;
  name: string;
  svg: string;
}

export const STICKERS: Sticker[] = [
  {
    id: 'tree',
    name: 'Sapin',
    svg: '<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><path d="M50 10 L70 40 L90 40 L65 65 L80 95 L50 70 L20 95 L35 65 L10 40 L30 40 Z" fill="#22c55e" stroke="#16a34a" stroke-width="2"/><rect x="45" y="90" width="10" height="20" fill="#8b4513"/></svg>'
  },
  {
    id: 'snowflake',
    name: 'Flocon',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"><line x1="50" y1="10" x2="50" y2="90"/><line x1="10" y1="50" x2="90" y2="50"/><line x1="20" y1="20" x2="80" y2="80"/><line x1="80" y1="20" x2="20" y2="80"/><line x1="50" y1="30" x2="35" y2="50"/><line x1="50" y1="30" x2="65" y2="50"/><line x1="70" y1="50" x2="50" y2="35"/><line x1="70" y1="50" x2="50" y2="65"/><line x1="50" y1="70" x2="35" y2="50"/><line x1="50" y1="70" x2="65" y2="50"/><line x1="30" y1="50" x2="50" y2="35"/><line x1="30" y1="50" x2="50" y2="65"/></g></svg>'
  },
  {
    id: 'gift',
    name: 'Cadeau',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="50" fill="#ef4444" stroke="#dc2626" stroke-width="2"/><rect x="45" y="10" width="10" height="70" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/><rect x="20" y="28" width="60" height="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/><circle cx="50" cy="20" r="8" fill="#fbbf24" stroke="#f59e0b" stroke-width="1"/></svg>'
  },
  {
    id: 'star',
    name: 'Étoile',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 61,39 91,39 67,57 78,86 50,68 22,86 33,57 9,39 39,39" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/></svg>'
  },
  {
    id: 'bell',
    name: 'Cloche',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 40 Q30 20 50 20 Q70 20 70 40 L70 60 Q70 70 60 75 L60 80 L40 80 L40 75 Q30 70 30 60 Z" fill="#fbbf24" stroke="#f59e0b" stroke-width="2"/><circle cx="50" cy="85" r="5" fill="#dc2626"/></svg>'
  },
  {
    id: 'candy',
    name: 'Bonbon',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="25" fill="#ef4444" stroke="#dc2626" stroke-width="2"/><circle cx="50" cy="50" r="20" fill="#fca5a5"/><line x1="30" y1="50" x2="10" y2="50" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/><line x1="70" y1="50" x2="90" y2="50" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/></svg>'
  },
  {
    id: 'holly',
    name: 'Houx',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="#22c55e"><ellipse cx="35" cy="40" rx="15" ry="20" transform="rotate(-30 35 40)"/><ellipse cx="65" cy="40" rx="15" ry="20" transform="rotate(30 65 40)"/><circle cx="40" cy="55" r="8" fill="#dc2626"/><circle cx="60" cy="55" r="8" fill="#dc2626"/></g></svg>'
  },
  {
    id: 'snowman',
    name: 'Bonhomme de neige',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="75" r="20" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/><circle cx="50" cy="30" r="12" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2"/><circle cx="47" cy="28" r="2" fill="#000"/><circle cx="53" cy="28" r="2" fill="#000"/><circle cx="50" cy="32" r="2" fill="#ef4444"/></svg>'
  },
  {
    id: 'candle',
    name: 'Bougie',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="40" y="50" width="20" height="35" fill="#f5f5dc" stroke="#d4af37" stroke-width="2"/><path d="M50 50 Q45 40 50 30 Q55 40 50 50" fill="#fbbf24"/><circle cx="50" cy="25" r="3" fill="#ef4444"/></svg>'
  },
  {
    id: 'wreath',
    name: 'Couronne',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" fill="none" stroke="#22c55e" stroke-width="8"/><circle cx="50" cy="50" r="25" fill="none" stroke="#16a34a" stroke-width="3"/><circle cx="35" cy="35" r="4" fill="#dc2626"/><circle cx="65" cy="35" r="4" fill="#dc2626"/><circle cx="50" cy="25" r="4" fill="#dc2626"/><circle cx="50" cy="75" r="4" fill="#dc2626"/></svg>'
  }
];

export const getStickerById = (id: string): Sticker | undefined => {
  return STICKERS.find(s => s.id === id);
};
