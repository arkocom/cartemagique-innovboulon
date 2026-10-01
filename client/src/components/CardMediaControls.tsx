import { useEffect, useRef, useState } from 'react';
import { ANIMATION_LABELS, EVENT_LABELS, animationForEvent, eventForTheme, type CardAnimation, type CardEvent } from '@/lib/cardEffects';
import { scheduleCardMusic } from '@/lib/cardMusic';
import { recordCardVideo, supportedVideoMime } from '@/lib/cardVideo';
import { shareVideoFile } from '@/lib/videoShare';

export default function CardMediaControls({ themeId, onAnimationChange, prepareCanvas }: { themeId: string; onAnimationChange: (animation: CardAnimation) => void; prepareCanvas: () => Promise<HTMLCanvasElement> }) {
  const [occasion, setOccasion] = useState<CardEvent | 'auto'>('auto');
  const [effect, setEffect] = useState<CardAnimation | 'auto'>('auto');
  const [music, setMusic] = useState(true);
  const [volume, setVolume] = useState(30);
  const [duration, setDuration] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');
  const [video, setVideo] = useState<{ blob: Blob; url: string } | null>(null);
  const audio = useRef<{ context: AudioContext; stop: () => void; timer: ReturnType<typeof setTimeout> } | null>(null);
  const abort = useRef<AbortController | null>(null);
  const mounted = useRef(true);
  const event = occasion === 'auto' ? eventForTheme(themeId) : occasion;
  const animation = effect === 'auto' ? animationForEvent(event) : effect;
  const stopAudio = () => { const current = audio.current; audio.current = null; if (current) { clearTimeout(current.timer); current.stop(); void current.context.close(); } setPlaying(false); };
  useEffect(() => { onAnimationChange(animation); }, [animation, onAnimationChange]);
  useEffect(() => { stopAudio(); }, [event, volume]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; abort.current?.abort(); const current = audio.current; if (current) { clearTimeout(current.timer); current.stop(); void current.context.close(); } }; }, []);
  useEffect(() => () => { if (video) URL.revokeObjectURL(video.url); }, [video]);
  const listen = async () => {
    if (playing) { stopAudio(); return; }
    setError('');
    let context: AudioContext | undefined;
    try {
      context = new AudioContext(); await context.resume();
      if (!mounted.current) { await context.close(); return; }
      const stop = scheduleCardMusic(context, context.destination, event, 20, volume / 100);
      audio.current = { context, stop, timer: setTimeout(stopAudio, 20000) }; setPlaying(true);
    } catch { if (context && context.state !== 'closed') void context.close(); setError('La lecture audio est indisponible dans ce navigateur.'); }
  };
  const exportVideo = async () => {
    stopAudio(); setError(''); setBusy(true); setProgress(0); setVideo(null);
    const controller = new AbortController(); abort.current = controller;
    let context: AudioContext | undefined;
    try {
      if (music) { context = new AudioContext(); await context.resume(); }
      const base = await prepareCanvas();
      const blob = await recordCardVideo(base, { animation, event, music, volume: volume / 100, duration, audioContext: context, signal: controller.signal, onProgress: value => { if (mounted.current) setProgress(value); } });
      if (mounted.current) setVideo({ blob, url: URL.createObjectURL(blob) });
    } catch (cause) { if (mounted.current) setError(controller.signal.aborted ? 'Export annulé.' : cause instanceof Error ? cause.message : 'La vidéo n’a pas pu être créée.'); }
    finally { if (context && context.state !== 'closed') await context.close().catch(() => undefined); abort.current = null; if (mounted.current) setBusy(false); }
  };
  const extension = video?.blob.type.includes('mp4') ? 'mp4' : 'webm';
  const share = async () => {
    if (!video || sharing) return;
    setError(''); setSharing(true);
    try {
      const result = await shareVideoFile(video.blob);
      if (result === 'unsupported') setError('Le partage de fichiers est indisponible ici. Téléchargez la vidéo, puis joignez-la depuis WhatsApp ou votre messagerie.');
    } catch {
      setError('La messagerie n’a pas accepté la vidéo. Téléchargez-la pour la joindre manuellement. Si son format est WebM, essayez la création depuis Chrome sur Android ou Safari sur iPhone pour obtenir un MP4 lorsque disponible.');
    } finally { if (mounted.current) setSharing(false); }
  };
  const control = 'rounded-lg border border-slate-500/40 bg-background px-3 py-2 text-foreground';
  return <section aria-label="Animation et musique" className="mb-5 rounded-xl border border-slate-500/30 bg-background p-4 text-foreground shadow-sm">
    <h3 className="mb-3 font-semibold">✨ Animation et musique</h3>
    <fieldset disabled={busy} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="flex flex-col gap-1 text-sm">Événement<select className={control} value={occasion} onChange={e => setOccasion(e.target.value as CardEvent | 'auto')}><option value="auto">Automatique · {EVENT_LABELS[eventForTheme(themeId)]}</option>{Object.entries(EVENT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm">Animation<select className={control} value={effect} onChange={e => setEffect(e.target.value as CardAnimation | 'auto')}><option value="auto">Automatique · {ANIMATION_LABELS[animationForEvent(event)]}</option>{Object.entries(ANIMATION_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label className="flex flex-col gap-1 text-sm">Volume · {volume}%<input aria-label="Volume de la musique" type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="my-3 accent-blue-600" /></label>
      <label className="flex flex-col gap-1 text-sm">Durée de la vidéo<select className={control} value={duration} onChange={e => setDuration(Number(e.target.value))}>{[5, 10, 15].map(seconds => <option key={seconds} value={seconds}>{seconds} secondes</option>)}</select></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={music} onChange={e => setMusic(e.target.checked)} /> Inclure la musique dans la vidéo</label>
      <button type="button" className={control} onClick={() => void listen()}>{playing ? 'Arrêter la musique' : 'Écouter la musique'}</button>
      <button type="button" className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50" disabled={!supportedVideoMime(music)} onClick={() => void exportVideo()}>Créer la vidéo animée</button>
    </fieldset>
    <p className="mt-3 text-sm text-muted-foreground">Mélodie originale adaptée à {EVENT_LABELS[event]}. La vidéo conserve le mouvement et le son ; le PNG reste une image fixe. L’aperçu respecte la réduction des animations de votre appareil.</p>
    {!supportedVideoMime(music) && <p className="mt-2 text-sm">L’export vidéo est indisponible dans ce navigateur.</p>}
    {busy && <div className="mt-3 flex items-center gap-3" role="status"><progress aria-label="Création de la vidéo" max="100" value={progress} className="w-40" /><span>{progress}% · Gardez cet onglet ouvert.</span><button type="button" className={control} onClick={() => abort.current?.abort()}>Annuler</button></div>}
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    {video && extension === 'webm' && <p className="mt-3 text-sm text-muted-foreground">Ce navigateur produit du WebM. Certaines messageries peuvent le refuser ; le téléchargement reste disponible.</p>}
    {video && <div className="mt-4 flex flex-col items-center gap-3"><video aria-label="Aperçu de la carte animée" src={video.url} controls playsInline className="max-h-96 max-w-full rounded-lg" /><div className="flex flex-wrap justify-center gap-3"><a className="rounded-lg bg-blue-600 px-4 py-2 text-white" href={video.url} download={`carte-magique-${Date.now()}.${extension}`}>Télécharger la vidéo ({extension.toUpperCase()})</a><button type="button" className={control} disabled={sharing} onClick={() => void share()}>{sharing ? 'Ouverture du partage…' : 'Partager la vidéo'}</button></div></div>}
  </section>;
}
