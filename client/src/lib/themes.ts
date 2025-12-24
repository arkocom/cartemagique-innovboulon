import type { Theme } from '@/../../shared/types';

const createTheme = (
  id: string,
  name: string,
  description: string,
  path: string
): Theme => ({
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
});

export const themes: Theme[] = [
  // ❄️ Hiver (10)
  createTheme('hiver-1', 'Hiver 1', 'Paysage neigeux', '/themes/hiver/hiver-1.jpg'),
  createTheme('hiver-2', 'Hiver 2', 'Forêt enneigée', '/themes/hiver/hiver-2.jpg'),
  createTheme('hiver-3', 'Hiver 3', 'Lac gelé', '/themes/hiver/hiver-3.jpg'),
  createTheme('hiver-4', 'Hiver 4', 'Montagnes', '/themes/hiver/hiver-4.jpg'),
  createTheme('hiver-5', 'Hiver 5', 'Village alpin', '/themes/hiver/hiver-5.jpg'),
  createTheme('hiver-6', 'Hiver 6', 'Aurores', '/themes/hiver/hiver-6.jpg'),
  createTheme('hiver-7', 'Hiver 7', 'Arbres givrés', '/themes/hiver/hiver-7.jpg'),
  createTheme('hiver-8', 'Hiver 8', 'Tempête douce', '/themes/hiver/hiver-8.jpg'),
  createTheme('hiver-9', 'Hiver 9', 'Chalet', '/themes/hiver/hiver-9.jpg'),
  createTheme('hiver-10', 'Hiver 10', 'Ciel étoilé', '/themes/hiver/hiver-10.jpg'),

  // 🎄 Noël (10)
  createTheme('noel-1', 'Noël 1', 'Sapin lumineux', '/themes/noel/noel-1.jpg'),
  createTheme('noel-2', 'Noël 2', 'Décor doré', '/themes/noel/noel-2.jpg'),
  createTheme('noel-3', 'Noël 3', 'Cadeaux', '/themes/noel/noel-3.jpg'),
  createTheme('noel-4', 'Noël 4', 'Guirlandes', '/themes/noel/noel-4.jpg'),
  createTheme('noel-5', 'Noël 5', 'Boules', '/themes/noel/noel-5.jpg'),
  createTheme('noel-6', 'Noël 6', 'Scandinave', '/themes/noel/noel-6.jpg'),
  createTheme('noel-7', 'Noël 7', 'Ruelle festive', '/themes/noel/noel-7.jpg'),
  createTheme('noel-8', 'Noël 8', 'Étoile', '/themes/noel/noel-8.jpg'),
  createTheme('noel-9', 'Noël 9', 'Vitrine', '/themes/noel/noel-9.jpg'),
  createTheme('noel-10', 'Noël 10', 'Magie', '/themes/noel/noel-10.jpg'),

  // 🥂 Nouvel An (10)
  createTheme('nouvel-an-1', 'Nouvel An 1', 'Feux d\'artifice', '/themes/nouvel-an/nouvel-an-1.jpg'),
  createTheme('nouvel-an-2', 'Nouvel An 2', 'Champagne', '/themes/nouvel-an/nouvel-an-2.jpg'),

  createTheme('nouvel-an-4', 'Nouvel An 4', 'Élégance dorée', '/themes/nouvel-an/nouvel-an-4.jpg'),
  createTheme('nouvel-an-5', 'Nouvel An 5', 'Nuit étoilée', '/themes/nouvel-an/nouvel-an-5.jpg'),
  createTheme('nouvel-an-6', 'Nouvel An 6', 'Confettis', '/themes/nouvel-an/nouvel-an-6.jpg'),
  createTheme('nouvel-an-7', 'Nouvel An 7', 'Horloge', '/themes/nouvel-an/nouvel-an-7.jpg'),
  createTheme('nouvel-an-8', 'Nouvel An 8', 'Lumières', '/themes/nouvel-an/nouvel-an-8.jpg'),
  createTheme('nouvel-an-9', 'Nouvel An 9', 'Espoir 2026', '/themes/nouvel-an/nouvel-an-9.jpg'),


  // ✨ Féerie (10)
  createTheme('feerie-1', 'Féerie 1', 'Lanterne magique', '/themes/feerie/feerie-1.jpg'),
  createTheme('feerie-2', 'Féerie 2', 'Poussière d\'or', '/themes/feerie/feerie-2.jpg'),
  createTheme('feerie-3', 'Féerie 3', 'Cristaux de glace', '/themes/feerie/feerie-3.jpg'),
  createTheme('feerie-4', 'Féerie 4', 'Aurore boréale', '/themes/feerie/feerie-4.jpg'),
  createTheme('feerie-5', 'Féerie 5', 'Chalet cosy', '/themes/feerie/feerie-5.jpg'),
  createTheme('feerie-6', 'Féerie 6', 'Feu d\'artifice', '/themes/feerie/feerie-6.jpg'),
  createTheme('feerie-7', 'Féerie 7', 'Sapin blanc', '/themes/feerie/feerie-7.jpg'),
  createTheme('feerie-8', 'Féerie 8', 'Bulles dorées', '/themes/feerie/feerie-8.jpg'),
  createTheme('feerie-9', 'Féerie 9', 'Chouette des neiges', '/themes/feerie/feerie-9.jpg'),
  createTheme('feerie-10', 'Féerie 10', 'Sculpture de glace', '/themes/feerie/feerie-10.jpg'),

  // 🌲 Nature (5)
  createTheme('nature-1', 'Nature 1', 'Pommes de pin', '/themes/nature/nature-1.jpg'),
  createTheme('nature-2', 'Nature 2', 'Flocon macro', '/themes/nature/nature-2.jpg'),
  createTheme('nature-3', 'Nature 3', 'Houx rustique', '/themes/nature/nature-3.jpg'),
  createTheme('nature-4', 'Nature 4', 'Forêt ensoleillée', '/themes/nature/nature-4.jpg'),
  createTheme('nature-5', 'Nature 5', 'Cannelle & Orange', '/themes/nature/nature-5.jpg'),

  // 🥂 Art Déco (5)
  createTheme('artdeco-1', 'Art Déco 1', 'Lignes or', '/themes/artdeco/artdeco-1.jpg'),
  createTheme('artdeco-2', 'Art Déco 2', 'Marbre noir', '/themes/artdeco/artdeco-2.jpg'),
  createTheme('artdeco-3', 'Art Déco 3', 'Arches dorées', '/themes/artdeco/artdeco-3.jpg'),
  createTheme('artdeco-4', 'Art Déco 4', 'Bulles champagne', '/themes/artdeco/artdeco-4.jpg'),
  createTheme('artdeco-5', 'Art Déco 5', 'Émeraude & Or', '/themes/artdeco/artdeco-5.jpg'),

  // 💼 Pro (10)
  createTheme('pro-1', 'Pro 1', 'Cadre Or & Bleu', '/themes/pro/pro-1.jpg'),
  createTheme('pro-2', 'Pro 2', 'Minimaliste Gris', '/themes/pro/pro-2.jpg'),
  createTheme('pro-3', 'Pro 3', 'Réseau Tech', '/themes/pro/pro-3.jpg'),
  createTheme('pro-4', 'Pro 4', 'Papier Exécutif', '/themes/pro/pro-4.jpg'),
  createTheme('pro-5', 'Pro 5', 'Startup Dynamique', '/themes/pro/pro-5.jpg'),
  createTheme('pro-6', 'Pro 6', 'Hexagones', '/themes/pro/pro-6.jpg'),
  createTheme('pro-7', 'Pro 7', 'Luxe Noir', '/themes/pro/pro-7.jpg'),
  createTheme('pro-8', 'Pro 8', 'Bandeau Bleu', '/themes/pro/pro-8.jpg'),
  createTheme('pro-9', 'Pro 9', 'Architecte', '/themes/pro/pro-9.jpg'),
  createTheme('pro-10', 'Pro 10', 'Bureau Moderne', '/themes/pro/pro-10.jpg'),

  // ❤️ Famille (5)
  createTheme('famille-1', 'Famille 1', 'Scrapbooking', '/themes/famille/famille-1.jpg'),
  createTheme('famille-2', 'Famille 2', 'Bois Rustique', '/themes/famille/famille-2.jpg'),
  createTheme('famille-3', 'Famille 3', 'Album Photo', '/themes/famille/famille-3.jpg'),
  createTheme('famille-4', 'Famille 4', 'Animaux Mignons', '/themes/famille/famille-4.jpg'),
  createTheme('famille-5', 'Famille 5', 'Fleurs Douces', '/themes/famille/famille-5.jpg'),
];
