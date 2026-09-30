import { describe, expect, it, vi } from 'vitest';
import { animationForEvent, drawCardEffects, eventForTheme } from './cardEffects';
import { supportedVideoMime } from './cardVideo';

describe('occasion-aware animated cards', () => {
  it('pairs each occasion with its expected effect', () => {
    expect(animationForEvent(eventForTheme('noel-rubis'))).toBe('snow');
    expect(animationForEvent(eventForTheme('famille-anniversaire'))).toBe('confetti');
    expect(animationForEvent(eventForTheme('nouvel-an-4'))).toBe('fireworks');
    expect(animationForEvent(eventForTheme('famille-amour'))).toBe('hearts');
  });
  it('leaves a still card untouched when animation is disabled', () => {
    const context = { save: vi.fn() };
    drawCardEffects(context as unknown as CanvasRenderingContext2D, 400, 600, 'none', 1);
    expect(context.save).not.toHaveBeenCalled();
  });
  it('detects unsupported video export and selects an actually supported format', () => {
    expect(supportedVideoMime()).toBeUndefined();
    vi.stubGlobal('MediaRecorder', { isTypeSupported: (type: string) => type === 'video/webm;codecs=vp8,opus' });
    expect(supportedVideoMime()).toBe('video/webm;codecs=vp8,opus');
    vi.unstubAllGlobals();
  });
});
