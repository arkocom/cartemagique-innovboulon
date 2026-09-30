import type { CardEvent } from './cardEffects';

// Original short scores composed for CarteMagique, generated locally without third-party audio.
const SCORES: Record<CardEvent, number[]> = {
  noel: [79, 83, 86, 83, 81, 79, 76, 79, 84, 88, 86, 83, 81, 79, 76, 74],
  anniversaire: [72, 76, 79, 84, 81, 79, 76, 74, 77, 81, 84, 86, 84, 81, 79, 72],
  'nouvel-an': [67, 74, 79, 83, 86, 83, 79, 74, 69, 76, 81, 84, 88, 84, 81, 76],
  amour: [69, 72, 76, 79, 76, 72, 71, 67, 65, 69, 72, 76, 74, 72, 69, 67],
  mariage: [72, 79, 76, 84, 83, 79, 77, 76, 74, 77, 81, 84, 86, 84, 79, 72],
  merci: [74, 77, 81, 79, 77, 74, 72, 69, 72, 76, 79, 77, 76, 72, 69, 67],
  hiver: [72, 79, 74, 81, 76, 83, 79, 86, 84, 79, 77, 74, 76, 72, 71, 67],
};

export function scheduleCardMusic(context: AudioContext, destination: AudioNode, event: CardEvent, duration: number, volume: number): () => void {
  const bus = context.createGain(); bus.gain.value = Math.max(0, Math.min(1, volume)); bus.connect(destination);
  const notes = SCORES[event];
  const step = event === 'anniversaire' || event === 'nouvel-an' ? 0.29 : 0.42;
  const start = context.currentTime + 0.03;
  const oscillators: OscillatorNode[] = [];
  for (let i = 0; i * step < duration; i++) {
    const note = notes[i % notes.length]; const time = start + i * step;
    const oscillator = context.createOscillator(); const gain = context.createGain();
    oscillator.type = event === 'noel' ? 'sine' : 'triangle';
    oscillator.frequency.value = 440 * 2 ** ((note - 69) / 12);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.14, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, time + step * 1.7);
    oscillator.connect(gain); gain.connect(bus);
    oscillator.start(time); oscillator.stop(time + step * 1.8);
    oscillators.push(oscillator);
    // Gentle bass supports the melody without drowning out a spoken message.
    if (i % 4 === 0) {
      const bass = context.createOscillator(); const bassGain = context.createGain();
      bass.type = 'sine'; bass.frequency.value = 440 * 2 ** ((note - 24 - 69) / 12);
      bassGain.gain.setValueAtTime(0.09, time); bassGain.gain.exponentialRampToValueAtTime(0.001, time + step * 3.5);
      bass.connect(bassGain); bassGain.connect(bus); bass.start(time); bass.stop(time + step * 3.6); oscillators.push(bass);
    }
  }
  return () => { for (const oscillator of oscillators) { try { oscillator.stop(); } catch {} } bus.disconnect(); };
}
