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
  createTheme(
    'famille-anniversaire-corail',
    'Anniversaire corail',
    'Ballons nacrés, rubans et étoiles dorées',
    '/backgrounds/anniversaire-corail.webp',
    '/backgrounds/previews/anniversaire-corail.webp'
  ),
  createTheme(
    'famille-amour-roses',
    'Amour en fleurs',
    'Roses poudrées et petits cœurs',
    '/backgrounds/amour-roses.webp',
    '/backgrounds/previews/amour-roses.webp'
  ),
  createTheme(
    'famille-mariage-sauge',
    'Mariage sauge',
    'Fleurs blanches, eucalyptus et touches dorées',
    '/backgrounds/mariage-sauge.webp',
    '/backgrounds/previews/mariage-sauge.webp'
  ),
  createTheme(
    'nature-merci-prairie',
    'Merci fleuri',
    'Marguerites et fleurs de prairie',
    '/backgrounds/merci-prairie.webp',
    '/backgrounds/previews/merci-prairie.webp'
  ),
  createTheme(
    'noel-rubis',
    'Noël rubis et or',
    'Sapin, velours rouge et lumière chaleureuse',
    '/backgrounds/noel-rubis.webp',
    '/backgrounds/previews/noel-rubis.webp'
  ),
  createTheme(
    'nouvel-an-bleu-or',
    'Minuit doré',
    'Feux d’artifice dorés sur fond bleu nuit',
    '/backgrounds/nouvel-an-bleu-or.webp',
    '/backgrounds/previews/nouvel-an-bleu-or.webp'
  ),
  createTheme(
    'noel-feerique',
    'Village féerique',
    'Chalets illuminés et paysage enneigé',
    '/backgrounds/noel-feerique.webp',
    '/backgrounds/previews/noel-feerique.webp'
  ),
  createTheme(
    'noel-minimaliste',
    'Noël minimaliste',
    'Sapin dessiné, terracotta et étoiles fines',
    '/backgrounds/noel-minimaliste.webp',
    '/backgrounds/previews/noel-minimaliste.webp'
  ),
  createTheme(
    'hiver-oiseaux',
    'Rouges-gorges d’hiver',
    'Oiseaux et baies rouges à l’aquarelle',
    '/backgrounds/hiver-oiseaux.webp',
    '/backgrounds/previews/hiver-oiseaux.webp'
  ),
  createTheme(
    'pro-voeux-champagne',
    'Vœux champagne',
    'Rubans champagne et courbes bleu nuit',
    '/backgrounds/voeux-professionnels.webp',
    '/backgrounds/previews/voeux-professionnels.webp'
  ),
];
