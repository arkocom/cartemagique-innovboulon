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
  // ❄️ Hiver (10)
  createTheme('hiver-1', 'Hiver 1', 'Paysage neigeux', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),
  createTheme('hiver-2', 'Hiver 2', 'Forêt enneigée', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('hiver-3', 'Hiver 3', 'Lac gelé', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('hiver-4', 'Hiver 4', 'Montagnes', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),
  createTheme('hiver-5', 'Hiver 5', 'Village alpin', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('hiver-6', 'Hiver 6', 'Aurores', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('hiver-7', 'Hiver 7', 'Arbres givrés', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),
  createTheme('hiver-8', 'Hiver 8', 'Tempête douce', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('hiver-9', 'Hiver 9', 'Chalet', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('hiver-10', 'Hiver 10', 'Ciel étoilé', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),

  // 🎄 Noël (10)
  createTheme('noel-1', 'Noël 1', 'Sapin lumineux', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),
  createTheme('noel-2', 'Noël 2', 'Décor doré', '/backgrounds/noel-rubis.webp', '/backgrounds/previews/noel-rubis.webp'),
  createTheme('noel-3', 'Noël 3', 'Cadeaux', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('noel-4', 'Noël 4', 'Guirlandes', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('noel-5', 'Noël 5', 'Boules', '/backgrounds/noel-rubis.webp', '/backgrounds/previews/noel-rubis.webp'),
  createTheme('noel-6', 'Noël 6', 'Scandinave', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('noel-7', 'Noël 7', 'Ruelle festive', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('noel-8', 'Noël 8', 'Étoile', '/backgrounds/noel-rubis.webp', '/backgrounds/previews/noel-rubis.webp'),
  createTheme('noel-9', 'Noël 9', 'Vitrine', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('noel-10', 'Noël 10', 'Magie', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),

  // 🥂 Nouvel An (10)
  createTheme('nouvel-an-1', 'Nouvel An 1', 'Feux d\'artifice', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('nouvel-an-2', 'Nouvel An 2', 'Champagne', '/backgrounds/nouvel-an-bleu-or.webp', '/backgrounds/previews/nouvel-an-bleu-or.webp'),

  createTheme('nouvel-an-4', 'Nouvel An 4', 'Élégance dorée', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('nouvel-an-5', 'Nouvel An 5', 'Nuit étoilée', '/backgrounds/nouvel-an-bleu-or.webp', '/backgrounds/previews/nouvel-an-bleu-or.webp'),
  createTheme('nouvel-an-6', 'Nouvel An 6', 'Confettis', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),
  createTheme('nouvel-an-7', 'Nouvel An 7', 'Horloge', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('nouvel-an-8', 'Nouvel An 8', 'Lumières', '/backgrounds/nouvel-an-bleu-or.webp', '/backgrounds/previews/nouvel-an-bleu-or.webp'),
  createTheme('nouvel-an-9', 'Nouvel An 9', 'Espoir 2026', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),


  // ✨ Féerie (10)
  createTheme('feerie-1', 'Féerie 1', 'Lanterne magique', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('feerie-2', 'Féerie 2', 'Poussière d\'or', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('feerie-3', 'Féerie 3', 'Cristaux de glace', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('feerie-4', 'Féerie 4', 'Aurore boréale', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('feerie-5', 'Féerie 5', 'Chalet cosy', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('feerie-6', 'Féerie 6', 'Feu d\'artifice', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('feerie-7', 'Féerie 7', 'Sapin blanc', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('feerie-8', 'Féerie 8', 'Bulles dorées', '/backgrounds/noel-feerique.webp', '/backgrounds/previews/noel-feerique.webp'),
  createTheme('feerie-9', 'Féerie 9', 'Chouette des neiges', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('feerie-10', 'Féerie 10', 'Sculpture de glace', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),

  // 🌲 Nature (5)
  createTheme('nature-1', 'Nature 1', 'Pommes de pin', '/backgrounds/nature.webp', '/backgrounds/nature.webp'),
  createTheme('nature-2', 'Nature 2', 'Flocon macro', '/backgrounds/merci-prairie.webp', '/backgrounds/previews/merci-prairie.webp'),
  createTheme('nature-3', 'Nature 3', 'Houx rustique', '/backgrounds/hiver-oiseaux.webp', '/backgrounds/previews/hiver-oiseaux.webp'),
  createTheme('nature-4', 'Nature 4', 'Forêt ensoleillée', '/backgrounds/nature.webp', '/backgrounds/nature.webp'),
  createTheme('nature-5', 'Nature 5', 'Cannelle & Orange', '/backgrounds/merci-prairie.webp', '/backgrounds/previews/merci-prairie.webp'),

  // 🥂 Art Déco (5)
  createTheme('artdeco-1', 'Art Déco 1', 'Lignes or', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('artdeco-2', 'Art Déco 2', 'Marbre noir', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),
  createTheme('artdeco-3', 'Art Déco 3', 'Arches dorées', '/backgrounds/nouvel-an-bleu-or.webp', '/backgrounds/previews/nouvel-an-bleu-or.webp'),
  createTheme('artdeco-4', 'Art Déco 4', 'Bulles champagne', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('artdeco-5', 'Art Déco 5', 'Émeraude & Or', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),

  // 💼 Pro (10)
  createTheme('pro-1', 'Pro 1', 'Cadre Or & Bleu', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('pro-2', 'Pro 2', 'Minimaliste Gris', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),
  createTheme('pro-3', 'Pro 3', 'Réseau Tech', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('pro-4', 'Pro 4', 'Papier Exécutif', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('pro-5', 'Pro 5', 'Startup Dynamique', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),
  createTheme('pro-6', 'Pro 6', 'Hexagones', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('pro-7', 'Pro 7', 'Luxe Noir', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('pro-8', 'Pro 8', 'Bandeau Bleu', '/backgrounds/voeux-professionnels.webp', '/backgrounds/previews/voeux-professionnels.webp'),
  createTheme('pro-9', 'Pro 9', 'Architecte', '/backgrounds/noel-minimaliste.webp', '/backgrounds/previews/noel-minimaliste.webp'),
  createTheme('pro-10', 'Pro 10', 'Bureau Moderne', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),

  // ❤️ Famille (5)
  createTheme('famille-1', 'Famille 1', 'Scrapbooking', '/backgrounds/romance.webp', '/backgrounds/romance.webp'),
  createTheme('famille-2', 'Famille 2', 'Bois Rustique', '/backgrounds/enfants.webp', '/backgrounds/enfants.webp'),
  createTheme('famille-3', 'Famille 3', 'Album Photo', '/backgrounds/mariage-sauge.webp', '/backgrounds/previews/mariage-sauge.webp'),
  createTheme('famille-4', 'Famille 4', 'Animaux Mignons', '/backgrounds/anniversaire-corail.webp', '/backgrounds/previews/anniversaire-corail.webp'),
  createTheme('famille-5', 'Famille 5', 'Fleurs Douces', '/backgrounds/amour-roses.webp', '/backgrounds/previews/amour-roses.webp'),
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


// Keep legacy theme IDs for saved cards without repeating replacement designs in the gallery.
export const galleryThemes = themes.filter((theme) => {
  const legacy = /^(hiver|noel|nouvel-an|feerie|nature|artdeco|pro|famille)-(\d+)$/.exec(theme.id);
  return !legacy || legacy[2] === '1' || theme.id === 'famille-2';
});
