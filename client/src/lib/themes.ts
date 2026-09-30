import type { Theme } from '@/../../shared/types';

export type ThemeWithPreview = Theme & { preview: string };

const createTheme = (
  id: string,
  name: string,
  description: string,
  path: string,
  preview: string
): ThemeWithPreview => ({
  id,
  name,
  description,
  colors: {
    primary: '#ffffff',
    secondary: '#e2e8f0',
    accent: '#cbd5e1',
    background: '#0f172a',
    text: '#ffffff',
  },
  particles: 'snowflakes',
  music: 'default',
  image: path,
  preview,
});

export const themes: ThemeWithPreview[] = [
  createTheme(
    'noel-1',
    'Noël enchanté',
    'Hiver lumineux et féerique',
    '/backgrounds/hiver.webp',
    '/backgrounds/hiver.webp'
  ),
  createTheme(
    'nouvel-an-1',
    'Nouvel An doré',
    'Ballons, confettis et lumière',
    '/backgrounds/celebration.webp',
    '/backgrounds/celebration.webp'
  ),
  createTheme(
    'hiver-1',
    'Hiver givré',
    'Flocons et lumière glacée',
    '/backgrounds/hiver.webp',
    '/backgrounds/hiver.webp'
  ),
  createTheme(
    'feerie-1',
    'Féerie céleste',
    'Lune, étoiles et nuit magique',
    '/backgrounds/celeste.webp',
    '/backgrounds/celeste.webp'
  ),
  createTheme(
    'nature-1',
    'Nature enchantée',
    'Feuillage et lumières féeriques',
    '/backgrounds/nature.webp',
    '/backgrounds/nature.webp'
  ),
  createTheme(
    'artdeco-1',
    'Éclat doré',
    'Ambiance festive et élégante',
    '/backgrounds/celebration.webp',
    '/backgrounds/celebration.webp'
  ),
  createTheme(
    'pro-1',
    'Pro céleste',
    'Fond élégant bleu et or',
    '/backgrounds/celeste.webp',
    '/backgrounds/celeste.webp'
  ),
  createTheme(
    'famille-1',
    'Douceur florale',
    'Roses, lumière et tons tendres',
    '/backgrounds/romance.webp',
    '/backgrounds/romance.webp'
  ),
  createTheme(
    'famille-2',
    'Féerie pastel',
    'Arc-en-ciel, nuages et étoiles',
    '/backgrounds/enfants.webp',
    '/backgrounds/enfants.webp'
  ),
];
