import { describe, expect, it } from 'vitest';
import { chooseContrastingTextColor } from './textContrast';

describe('text color adapted to the background', () => {
  it('suggests dark text on a cream background and white text on a navy background', () => {
    expect(chooseContrastingTextColor(new Uint8ClampedArray([248, 240, 220, 255]))).toBe('#111827');
    expect(chooseContrastingTextColor(new Uint8ClampedArray([10, 28, 63, 255]))).toBe('#ffffff');
  });
  it('composites transparent pixels on white and handles an empty sample', () => {
    expect(chooseContrastingTextColor(new Uint8ClampedArray([0, 0, 0, 0]))).toBe('#111827');
    expect(chooseContrastingTextColor(new Uint8ClampedArray())).toBe('#111827');
  });
});
