import { drawCardEffects, type CardAnimation, type CardEvent } from './cardEffects';
import { scheduleCardMusic, type MusicStyle } from './cardMusic';

export function supportedVideoMime(withAudio = true): string | undefined {
  if (typeof MediaRecorder === 'undefined') return undefined;
  const mp4 = withAudio
    ? ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4;codecs=avc1.42001E,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,mp4a.40.2']
    : ['video/mp4;codecs=avc1', 'video/mp4;codecs=avc1.42001E'];
  // Generic MP4 may silently select VP9/Opus, which messaging apps can reject.
  return [...mp4, 'video/webm;codecs=vp8,opus', 'video/webm;codecs=vp9,opus', 'video/webm'].find(type => MediaRecorder.isTypeSupported(type));
}

export async function recordCardVideo(base: HTMLCanvasElement, options: { animation: CardAnimation; event: CardEvent; musicStyle?: MusicStyle; music: boolean; volume: number; duration: number; audioContext?: AudioContext; signal: AbortSignal; onProgress: (value: number) => void }): Promise<Blob> {
  const mimeType = supportedVideoMime(options.music);
  if (!mimeType || !HTMLCanvasElement.prototype.captureStream) throw new Error('L’export vidéo n’est pas disponible dans ce navigateur. Essayez Chrome, Edge ou Safari récent.');
  if (options.signal.aborted) throw new DOMException('Export annulé', 'AbortError');
  const canvas = document.createElement('canvas'); canvas.width = base.width; canvas.height = base.height;
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('La vidéo ne peut pas être dessinée.');
  ctx.drawImage(base, 0, 0);
  const stream = canvas.captureStream(25);
  let stopMusic: (() => void) | undefined;
  let frame = 0; let stopTimer: ReturnType<typeof setTimeout> | undefined;
  const audioContext = options.audioContext;
  const chunks: Blob[] = [];
  let recorder: MediaRecorder | undefined;
  let onAbort: (() => void) | undefined;
  const onHidden = () => { if (document.hidden) onAbort?.(); };
  try {
    if (options.music && audioContext) {
      await audioContext.resume();
      const audioDestination = audioContext.createMediaStreamDestination();
      for (const track of audioDestination.stream.getAudioTracks()) stream.addTrack(track);
      stopMusic = scheduleCardMusic(audioContext, audioDestination, options.musicStyle ?? options.event, options.duration, options.volume);
    }
    if (options.signal.aborted) throw new DOMException('Export annulé', 'AbortError');
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2200000, audioBitsPerSecond: 128000 });
    const recording = new Promise<Blob>((resolve, reject) => {
      const fail = () => { if (recorder?.state !== 'inactive') recorder?.stop(); reject(new DOMException('Export interrompu. Gardez cet onglet ouvert et réessayez.', 'AbortError')); };
      onAbort = fail; options.signal.addEventListener('abort', fail, { once: true }); document.addEventListener('visibilitychange', onHidden);
      recorder!.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder!.onerror = () => reject(new Error('L’enregistrement vidéo a échoué.'));
      recorder!.onstop = () => { const blob = new Blob(chunks, { type: recorder!.mimeType || mimeType }); blob.size ? resolve(blob) : reject(new Error('La vidéo est vide. Réessayez.')); };
      recorder!.start(250);
      const start = performance.now();
      const paint = (now: number) => {
        const elapsed = (now - start) / 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(base, 0, 0);
        drawCardEffects(ctx, canvas.width, canvas.height, options.animation, elapsed);
        options.onProgress(Math.min(99, Math.round(elapsed / options.duration * 100)));
        if (recorder?.state === 'recording') frame = requestAnimationFrame(paint);
      };
      frame = requestAnimationFrame(paint);
      stopTimer = setTimeout(() => { if (recorder?.state === 'recording') recorder.stop(); }, options.duration * 1000);
    });
    const blob = await recording; options.onProgress(100); return blob;
  } finally {
    cancelAnimationFrame(frame); if (stopTimer) clearTimeout(stopTimer);
    if (onAbort) options.signal.removeEventListener('abort', onAbort);
    document.removeEventListener('visibilitychange', onHidden);
    if (recorder?.state !== 'inactive') recorder?.stop();
    stopMusic?.(); stream.getTracks().forEach(track => track.stop());
    if (audioContext && audioContext.state !== 'closed') await audioContext.close().catch(() => undefined);
  }
}
