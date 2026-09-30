import { describe, expect, it } from 'vitest';
import { getKeyboardOptionIndex } from './ThemeSelectorComplete';

describe('theme selector keyboard navigation', () => {
  it('moves through options and wraps at both ends', () => {
    expect(getKeyboardOptionIndex(0, 4, 'ArrowRight')).toBe(1);
    expect(getKeyboardOptionIndex(3, 4, 'ArrowRight')).toBe(0);
    expect(getKeyboardOptionIndex(0, 4, 'ArrowLeft')).toBe(3);
    expect(getKeyboardOptionIndex(1, 4, 'ArrowDown')).toBe(2);
    expect(getKeyboardOptionIndex(2, 4, 'ArrowUp')).toBe(1);
  });

  it('supports Home and End and leaves activation keys to native buttons', () => {
    expect(getKeyboardOptionIndex(2, 4, 'Home')).toBe(0);
    expect(getKeyboardOptionIndex(1, 4, 'End')).toBe(3);
    expect(getKeyboardOptionIndex(1, 4, 'Enter')).toBeNull();
    expect(getKeyboardOptionIndex(1, 4, ' ')).toBeNull();
  });

  it('does not navigate an empty collection', () => {
    expect(getKeyboardOptionIndex(0, 0, 'ArrowRight')).toBeNull();
  });
});
