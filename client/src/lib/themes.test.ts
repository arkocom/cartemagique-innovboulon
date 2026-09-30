import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { themes, galleryThemes } from './themes';

const localThemeAssets: Record<string, string> = {
  'noel-1': 'hiver.webp',
  'nouvel-an-1': 'celebration.webp',
  'hiver-1': 'hiver.webp',
  'feerie-1': 'celeste.webp',
  'nature-1': 'nature.webp',
  'artdeco-1': 'celebration.webp',
  'pro-1': 'celeste.webp',
  'famille-1': 'romance.webp',
  'famille-2': 'enfants.webp',
};

const localFiles = [...new Set(Object.values(localThemeAssets))];

describe('local card background catalogue', () => {
  it('preserves existing theme IDs and exposes all seventy-three models', () => {
    expect(themes).toHaveLength(73);
    expect(galleryThemes).toHaveLength(73);
    expect(new Set(themes.map((theme) => theme.id)).size).toBe(themes.length);

    for (const [themeId, fileName] of Object.entries(localThemeAssets)) {
      const theme = themes.find((item) => item.id === themeId);
      expect(theme, `theme ${themeId} should remain in the catalogue`).toBeDefined();
      expect(theme?.image).toBe(`/backgrounds/${fileName}`);
      expect(theme?.preview).toBe(`/backgrounds/${fileName}`);
    }
  });

  it('restores all fifty-four missing backgrounds as distinct assets', () => {
    const restored = themes.filter(theme => theme.image.startsWith('/backgrounds/collection/'));
    expect(restored).toHaveLength(54);
    expect(new Set(restored.map(theme => theme.image)).size).toBe(54);
  });

  it('uses local image files for every current and legacy theme', () => {
    for (const theme of themes) {
      for (const asset of [theme.image, theme.preview]) {
        expect(asset).toMatch(/^\/backgrounds\/.+\.webp$/);
        expect(existsSync(new URL(`../../public${asset}`, import.meta.url)), asset).toBe(true);
      }
    }
  });

  it('contains all six local WebP assets referenced by the catalogue', () => {
    expect(localFiles).toHaveLength(6);
    for (const fileName of localFiles) {
      expect(existsSync(new URL(`../../public/backgrounds/${fileName}`, import.meta.url))).toBe(true);
    }
  });
});

