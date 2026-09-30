import { describe, expect, it } from 'vitest';
import { isShareAbortError } from './shareUtils';

describe('share error handling', () => {
  it('recognizes a user-cancelled native share', () => {
    expect(isShareAbortError({ name: 'AbortError' })).toBe(true);
  });

  it('does not classify other share failures as a cancellation', () => {
    expect(isShareAbortError({ name: 'NotAllowedError' })).toBe(false);
    expect(isShareAbortError(new Error('share failed'))).toBe(false);
    expect(isShareAbortError(null)).toBe(false);
  });
});
