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
  createTheme('hiver-2', 'Hiver 2', 'Forêt enneigée', '/manus-storage/hiver-2_1d2b2cd2.jpg', '/manus-storage/hiver-2-preview_83c74d8c.jpg'),
  createTheme('hiver-3', 'Hiver 3', 'Lac gelé', '/manus-storage/hiver-3_432cf9f6.jpg', '/manus-storage/hiver-3-preview_78ec2691.jpg'),
  createTheme('hiver-4', 'Hiver 4', 'Montagnes', '/manus-storage/hiver-4_e47bde5a.jpg', '/manus-storage/hiver-4-preview_6da8e917.jpg'),
  createTheme('hiver-5', 'Hiver 5', 'Village alpin', '/manus-storage/hiver-5_49f14fb1.jpg', '/manus-storage/hiver-5-preview_394b93cc.jpg'),
  createTheme('hiver-6', 'Hiver 6', 'Aurores', '/manus-storage/hiver-6_64a41210.jpg', '/manus-storage/hiver-6-preview_25e20028.jpg'),
  createTheme('hiver-7', 'Hiver 7', 'Arbres givrés', '/manus-storage/hiver-7_56db6727.jpg', '/manus-storage/hiver-7-preview_ed94c788.jpg'),
  createTheme('hiver-8', 'Hiver 8', 'Tempête douce', '/manus-storage/hiver-8_9b9e11c8.jpg', '/manus-storage/hiver-8-preview_3b553512.jpg'),
  createTheme('hiver-9', 'Hiver 9', 'Chalet', '/manus-storage/hiver-9_1d4d9c55.jpg', '/manus-storage/hiver-9-preview_d4e48ea4.jpg'),
  createTheme('hiver-10', 'Hiver 10', 'Ciel étoilé', '/manus-storage/hiver-10_1ee0e429.jpg', '/manus-storage/hiver-10-preview_78fc6827.jpg'),

  // 🎄 Noël (10)
  createTheme('noel-1', 'Noël 1', 'Sapin lumineux', '/backgrounds/hiver.webp', '/backgrounds/hiver.webp'),
  createTheme('noel-2', 'Noël 2', 'Décor doré', '/manus-storage/noel-2_8d13b478.jpg', '/manus-storage/noel-2-preview_55c2c30b.jpg'),
  createTheme('noel-3', 'Noël 3', 'Cadeaux', '/manus-storage/noel-3_fa6b1866.jpg', '/manus-storage/noel-3-preview_78003c8a.jpg'),
  createTheme('noel-4', 'Noël 4', 'Guirlandes', '/manus-storage/noel-4_78f48680.jpg', '/manus-storage/noel-4-preview_6462ca5c.jpg'),
  createTheme('noel-5', 'Noël 5', 'Boules', '/manus-storage/noel-5_2dae5588.jpg', '/manus-storage/noel-5-preview_2a913ca8.jpg'),
  createTheme('noel-6', 'Noël 6', 'Scandinave', '/manus-storage/noel-6_779c732c.jpg', '/manus-storage/noel-6-preview_b841dc6d.jpg'),
  createTheme('noel-7', 'Noël 7', 'Ruelle festive', '/manus-storage/noel-7_b0de30b4.jpg', '/manus-storage/noel-7-preview_61c6db22.jpg'),
  createTheme('noel-8', 'Noël 8', 'Étoile', '/manus-storage/noel-8_19a2421d.jpg', '/manus-storage/noel-8-preview_81ccedb4.jpg'),
  createTheme('noel-9', 'Noël 9', 'Vitrine', '/manus-storage/noel-9_0a3a34d9.jpg', '/manus-storage/noel-9-preview_37b92653.jpg'),
  createTheme('noel-10', 'Noël 10', 'Magie', '/manus-storage/noel-10_97971781.jpg', '/manus-storage/noel-10-preview_1a8cb8f1.jpg'),

  // 🥂 Nouvel An (10)
  createTheme('nouvel-an-1', 'Nouvel An 1', 'Feux d\'artifice', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('nouvel-an-2', 'Nouvel An 2', 'Champagne', '/manus-storage/nouvel-an-2_ba599db2.jpg', '/manus-storage/nouvel-an-2-preview_0757c821.jpg'),

  createTheme('nouvel-an-4', 'Nouvel An 4', 'Élégance dorée', '/manus-storage/nouvel-an-4_8a66d70b.jpg', '/manus-storage/nouvel-an-4-preview_40ae5b8e.jpg'),
  createTheme('nouvel-an-5', 'Nouvel An 5', 'Nuit étoilée', '/manus-storage/nouvel-an-5_2baab142.jpg', '/manus-storage/nouvel-an-5-preview_9d109ff7.jpg'),
  createTheme('nouvel-an-6', 'Nouvel An 6', 'Confettis', '/manus-storage/nouvel-an-6_e299a344.jpg', '/manus-storage/nouvel-an-6-preview_9c56e0bd.jpg'),
  createTheme('nouvel-an-7', 'Nouvel An 7', 'Horloge', '/manus-storage/nouvel-an-7_634988d1.jpg', '/manus-storage/nouvel-an-7-preview_26eed3c4.jpg'),
  createTheme('nouvel-an-8', 'Nouvel An 8', 'Lumières', '/manus-storage/nouvel-an-8_b75f2007.jpg', '/manus-storage/nouvel-an-8-preview_5942d1b3.jpg'),
  createTheme('nouvel-an-9', 'Nouvel An 9', 'Espoir 2026', '/manus-storage/nouvel-an-9_fb5e02ea.jpg', '/manus-storage/nouvel-an-9-preview_20e44ccd.jpg'),


  // ✨ Féerie (10)
  createTheme('feerie-1', 'Féerie 1', 'Lanterne magique', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('feerie-2', 'Féerie 2', 'Poussière d\'or', '/manus-storage/feerie-2_721fcf11.jpg', '/manus-storage/feerie-2-preview_150191b1.jpg'),
  createTheme('feerie-3', 'Féerie 3', 'Cristaux de glace', '/manus-storage/feerie-3_efe64a24.jpg', '/manus-storage/feerie-3-preview_79dcac32.jpg'),
  createTheme('feerie-4', 'Féerie 4', 'Aurore boréale', '/manus-storage/feerie-4_1658ec12.jpg', '/manus-storage/feerie-4-preview_a197fd55.jpg'),
  createTheme('feerie-5', 'Féerie 5', 'Chalet cosy', '/manus-storage/feerie-5_f0123e42.jpg', '/manus-storage/feerie-5-preview_2c43d122.jpg'),
  createTheme('feerie-6', 'Féerie 6', 'Feu d\'artifice', '/manus-storage/feerie-6_21776985.jpg', '/manus-storage/feerie-6-preview_0632c1d5.jpg'),
  createTheme('feerie-7', 'Féerie 7', 'Sapin blanc', '/manus-storage/feerie-7_0e44cf22.jpg', '/manus-storage/feerie-7-preview_8405b66e.jpg'),
  createTheme('feerie-8', 'Féerie 8', 'Bulles dorées', '/manus-storage/feerie-8_2b230dda.jpg', '/manus-storage/feerie-8-preview_f9bcef1c.jpg'),
  createTheme('feerie-9', 'Féerie 9', 'Chouette des neiges', '/manus-storage/feerie-9_2bfe4e15.jpg', '/manus-storage/feerie-9-preview_d152289d.jpg'),
  createTheme('feerie-10', 'Féerie 10', 'Sculpture de glace', '/manus-storage/feerie-10_605bb6f8.jpg', '/manus-storage/feerie-10-preview_e983551c.jpg'),

  // 🌲 Nature (5)
  createTheme('nature-1', 'Nature 1', 'Pommes de pin', '/backgrounds/nature.webp', '/backgrounds/nature.webp'),
  createTheme('nature-2', 'Nature 2', 'Flocon macro', '/manus-storage/nature-2_1c8315f3.jpg', '/manus-storage/nature-2-preview_adc44309.jpg'),
  createTheme('nature-3', 'Nature 3', 'Houx rustique', '/manus-storage/nature-3_cc1a0231.jpg', '/manus-storage/nature-3-preview_b5d00c60.jpg'),
  createTheme('nature-4', 'Nature 4', 'Forêt ensoleillée', '/manus-storage/nature-4_ce325d81.jpg', '/manus-storage/nature-4-preview_059aff9c.jpg'),
  createTheme('nature-5', 'Nature 5', 'Cannelle & Orange', '/manus-storage/nature-5_a92493c3.jpg', '/manus-storage/nature-5-preview_76a4804d.jpg'),

  // 🥂 Art Déco (5)
  createTheme('artdeco-1', 'Art Déco 1', 'Lignes or', '/backgrounds/celebration.webp', '/backgrounds/celebration.webp'),
  createTheme('artdeco-2', 'Art Déco 2', 'Marbre noir', '/manus-storage/artdeco-2_9b8a8423.jpg', '/manus-storage/artdeco-2-preview_970b3bba.jpg'),
  createTheme('artdeco-3', 'Art Déco 3', 'Arches dorées', '/manus-storage/artdeco-3_87237cfc.jpg', '/manus-storage/artdeco-3-preview_bf2f519d.jpg'),
  createTheme('artdeco-4', 'Art Déco 4', 'Bulles champagne', '/manus-storage/artdeco-4_0cba6e85.jpg', '/manus-storage/artdeco-4-preview_430db793.jpg'),
  createTheme('artdeco-5', 'Art Déco 5', 'Émeraude & Or', '/manus-storage/artdeco-5_f9b6a75e.jpg', '/manus-storage/artdeco-5-preview_f806942f.jpg'),

  // 💼 Pro (10)
  createTheme('pro-1', 'Pro 1', 'Cadre Or & Bleu', '/backgrounds/celeste.webp', '/backgrounds/celeste.webp'),
  createTheme('pro-2', 'Pro 2', 'Minimaliste Gris', '/manus-storage/pro-2_220b0a62.jpg', '/manus-storage/pro-2-preview_51140899.jpg'),
  createTheme('pro-3', 'Pro 3', 'Réseau Tech', '/manus-storage/pro-3_09fb4fcc.jpg', '/manus-storage/pro-3-preview_738957cc.jpg'),
  createTheme('pro-4', 'Pro 4', 'Papier Exécutif', '/manus-storage/pro-4_e160d2da.jpg', '/manus-storage/pro-4-preview_6ce8922d.jpg'),
  createTheme('pro-5', 'Pro 5', 'Startup Dynamique', '/manus-storage/pro-5_7a6aa1be.jpg', '/manus-storage/pro-5-preview_0003118c.jpg'),
  createTheme('pro-6', 'Pro 6', 'Hexagones', '/manus-storage/pro-6_1abc9c8d.jpg', '/manus-storage/pro-6-preview_745772b5.jpg'),
  createTheme('pro-7', 'Pro 7', 'Luxe Noir', '/manus-storage/pro-7_317b1c5d.jpg', '/manus-storage/pro-7-preview_77be647d.jpg'),
  createTheme('pro-8', 'Pro 8', 'Bandeau Bleu', '/manus-storage/pro-8_3c2dc297.jpg', '/manus-storage/pro-8-preview_de74550a.jpg'),
  createTheme('pro-9', 'Pro 9', 'Architecte', '/manus-storage/pro-9_749d398f.jpg', '/manus-storage/pro-9-preview_8f8ae29b.jpg'),
  createTheme('pro-10', 'Pro 10', 'Bureau Moderne', '/manus-storage/pro-10_c93f0a99.jpg', '/manus-storage/pro-10-preview_038bad83.jpg'),

  // ❤️ Famille (5)
  createTheme('famille-1', 'Famille 1', 'Scrapbooking', '/backgrounds/romance.webp', '/backgrounds/romance.webp'),
  createTheme('famille-2', 'Famille 2', 'Bois Rustique', '/backgrounds/enfants.webp', '/backgrounds/enfants.webp'),
  createTheme('famille-3', 'Famille 3', 'Album Photo', '/manus-storage/famille-3_f3b90ba5.jpg', '/manus-storage/famille-3-preview_55b98d98.jpg'),
  createTheme('famille-4', 'Famille 4', 'Animaux Mignons', '/manus-storage/famille-4_dd52252f.jpg', '/manus-storage/famille-4-preview_f1609592.jpg'),
  createTheme('famille-5', 'Famille 5', 'Fleurs Douces', '/manus-storage/famille-5_342aa8aa.jpg', '/manus-storage/famille-5-preview_7c7f71f1.jpg'),
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
