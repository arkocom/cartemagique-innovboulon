import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { themes } from './themes';

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
  it('keeps all 63 existing themes while adding local assets to selected themes', () => {
    expect(themes).toHaveLength(63);

    for (const [themeId, fileName] of Object.entries(localThemeAssets)) {
      const theme = themes.find((item) => item.id === themeId);
      expect(theme, `theme ${themeId} should remain in the catalogue`).toBeDefined();
      expect(theme?.image).toBe(`/backgrounds/${fileName}`);
      expect(theme?.preview).toBe(`/backgrounds/${fileName}`);
    }
  });

  it('contains all six local WebP assets referenced by the catalogue', () => {
    expect(localFiles).toHaveLength(6);
    for (const fileName of localFiles) {
      expect(existsSync(new URL(`../../public/backgrounds/${fileName}`, import.meta.url))).toBe(true);
    }
  });
});
