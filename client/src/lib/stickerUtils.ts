// Helper to generate sticker data URLs for templates
// This mimics the canvas drawing logic in EditorWithImages.tsx

export const createStickerDataUrl = (emoji: string): string => {
  // In a real browser environment we could use canvas
  // But since this runs at import time or in SSR context, we might need a different approach
  // However, for client-side only app, we can use a function that returns the data URL
  // We'll implement this as a runtime helper that generates the URL on demand
  
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  ctx.font = '100px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 64, 64);
  
  return canvas.toDataURL('image/png');
};
