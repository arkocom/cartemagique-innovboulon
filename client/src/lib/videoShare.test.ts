import { afterEach, describe, expect, it, vi } from 'vitest';
import { createVideoFile, shareVideoFile } from './videoShare';
import { supportedVideoMime } from './cardVideo';

afterEach(() => vi.unstubAllGlobals());
describe('video file sharing', () => {
  it('keeps bytes and container but removes codecs from the shared file MIME', async () => {
    const source = new Blob(['video-bytes'], { type: 'video/mp4;codecs=avc1,mp4a.40.2' });
    const file = createVideoFile(source);
    expect(file.type).toBe('video/mp4');
    expect(file.name).toBe('carte-magique.mp4');
    expect(await file.text()).toBe(await source.text());
  });
  it('never relabels WebM as MP4 and rejects empty exports', () => {
    expect(createVideoFile(new Blob(['x'], { type: 'video/webm;codecs=vp8,opus' })).name).toMatch(/\.webm$/);
    expect(() => createVideoFile(new Blob([], { type: 'video/mp4' }))).toThrow();
  });
  it('calls native sharing immediately with the actual video file', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const result = shareVideoFile(new Blob(['x'], { type: 'video/mp4' }), { share, canShare: vi.fn(() => true) });
    expect(share).toHaveBeenCalledTimes(1);
    expect(share.mock.calls[0][0].files[0].type).toBe('video/mp4');
    expect(await result).toBe('shared');
  });
  it('allows cancellation and a subsequent retry', async () => {
    const target = { canShare: vi.fn(() => true), share: vi.fn().mockRejectedValueOnce({ name: 'AbortError' }).mockResolvedValueOnce(undefined) };
    const blob = new Blob(['x'], { type: 'video/mp4' });
    expect(await shareVideoFile(blob, target)).toBe('cancelled');
    expect(await shareVideoFile(blob, target)).toBe('shared');
  });
  it('provides a fallback without reporting success when files cannot be shared', async () => {
    const target = { canShare: vi.fn(() => false), share: vi.fn() };
    expect(await shareVideoFile(new Blob(['x'], { type: 'video/mp4' }), target)).toBe('unsupported');
    expect(target.share).not.toHaveBeenCalled();
  });
  it('surfaces actual platform errors', async () => {
    await expect(shareVideoFile(new Blob(['x'], { type: 'video/mp4' }), { canShare: () => true, share: vi.fn().mockRejectedValue({ name: 'NotAllowedError' }) })).rejects.toEqual({ name: 'NotAllowedError' });
  });
  it('requires explicit H264/AAC support before choosing MP4 with music', () => {
    vi.stubGlobal('MediaRecorder', { isTypeSupported: (type: string) => ['video/mp4', 'video/webm;codecs=vp8,opus'].includes(type) });
    expect(supportedVideoMime()).toBe('video/webm;codecs=vp8,opus');
    vi.stubGlobal('MediaRecorder', { isTypeSupported: () => true });
    expect(supportedVideoMime()).toBe('video/mp4;codecs=avc1,mp4a.40.2');
    expect(supportedVideoMime(false)).toBe('video/mp4;codecs=avc1');
  });
});
