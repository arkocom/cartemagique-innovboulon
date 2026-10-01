export const MAX_PHOTOS = 12;
export const MAX_PHOTO_BYTES = 15 * 1024 * 1024;
export function validatePhotoBatch(files: Pick<File, 'size' | 'type'>[], existingCount: number): void {
  if (existingCount + files.length > MAX_PHOTOS) throw new Error(`Vous pouvez ajouter jusqu’à ${MAX_PHOTOS} photos par carte.`);
  for (const file of files) {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new Error('Choisissez une photo JPG, PNG, WebP ou GIF.');
    if (file.size > MAX_PHOTO_BYTES) throw new Error('Chaque photo doit peser moins de 15 Mo.');
  }
}
export async function preparePhoto(file: File): Promise<{ src: string; ratio: number }> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth * image.naturalHeight > 40_000_000) throw new Error('Cette photo est trop grande. Réduisez-la avant de l’ajouter.');
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Impossible de préparer cette photo.');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return { src: canvas.toDataURL('image/webp', .88), ratio: image.naturalHeight / image.naturalWidth };
  } finally { URL.revokeObjectURL(url); }
}
