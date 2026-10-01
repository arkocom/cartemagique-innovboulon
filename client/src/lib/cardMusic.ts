import type { CardEvent } from './cardEffects';

export type MusicStyle = CardEvent | 'noel-doux' | 'noel-festif';
type Instrument = 'bells' | 'box' | 'marimba' | 'synth' | 'piano' | 'harp' | 'guitar' | 'pad';
type Note = readonly [beat: number, midi: number, length: number];
type Arrangement = { label: string; description: string; bpm: number; beats: number; instrument: Instrument; melody: readonly Note[]; chords: readonly (readonly number[])[]; rhythm: 'sleigh' | 'party' | 'dance' | 'waltz' | 'acoustic' | 'none' };

// Original arrangements. Different meters, phrasing, timbres and percussion;
// no remote audio, tracking, licensed recordings or paid service required.
export const MUSIC_STYLES: Record<MusicStyle, Arrangement> = {
  noel: { label: 'Noël · Carillon et grelots', description: 'Clochettes cristallines et grelots de traîneau, 108 BPM.', bpm: 108, beats: 4, instrument: 'bells', rhythm: 'sleigh', chords: [[48,52,55],[53,57,60],[55,59,62],[48,52,55]], melody: [[0,79,.5],[.5,84,.5],[1,83,1],[2,79,.5],[2.5,76,.5],[3,79,.8],[4,81,1],[5,77,.5],[5.5,81,.5],[6,84,1.5],[8,83,.5],[8.5,86,.5],[9,84,1],[10,79,.5],[10.5,77,.5],[11,74,.8],[12,76,1],[13,79,1],[14,84,1.7]] },
  'noel-doux': { label: 'Noël · Boîte à musique', description: 'Berceuse délicate à trois temps, sans percussion, 72 BPM.', bpm: 72, beats: 3, instrument: 'box', rhythm: 'none', chords: [[60,64,67],[57,60,64],[53,57,60],[55,59,62]], melody: [[0,84,1.5],[1.5,79,.5],[2,76,.8],[3,81,1],[4,79,1.7],[6,77,1.5],[7.5,81,.5],[8,84,.8],[9,83,1],[10,79,1.7]] },
  'noel-festif': { label: 'Noël · Atelier des cadeaux', description: 'Marimba bondissant et grelots, 126 BPM.', bpm: 126, beats: 4, instrument: 'marimba', rhythm: 'sleigh', chords: [[48,52,55],[55,59,62],[53,57,60],[48,52,55]], melody: [[0,72,.4],[.75,76,.4],[1.5,79,.4],[2,84,.6],[3,79,.4],[3.5,76,.4],[4,74,.4],[4.75,79,.4],[5.5,83,.4],[6,86,.6],[7,83,.5],[8,81,.5],[9,77,.5],[10,74,1],[12,76,.5],[12.75,79,.5],[13.5,84,1.8]] },
  anniversaire: { label: 'Anniversaire · Fête pop', description: 'Marimba joyeux, basse rebondissante et claquements, 118 BPM.', bpm: 118, beats: 4, instrument: 'marimba', rhythm: 'party', chords: [[48,52,55],[57,60,64],[53,57,60],[55,59,62]], melody: [[0,72,.4],[.5,72,.4],[1.5,76,.4],[2,79,.7],[3,84,.7],[4,81,.4],[4.5,79,.4],[5.5,76,.4],[6,72,1.3],[8,77,.4],[8.5,81,.4],[9.5,84,.4],[10,89,.7],[11,84,.7],[12,86,.4],[12.5,83,.4],[13.5,79,.4],[14,72,1.5]] },
  'nouvel-an': { label: 'Nouvel An · Minuit électro', description: 'Rythme dansant, synthétiseur et grosse caisse, 128 BPM.', bpm: 128, beats: 4, instrument: 'synth', rhythm: 'dance', chords: [[45,48,52],[53,57,60],[48,52,55],[55,59,62]], melody: [[0,76,.3],[.75,76,.3],[1.5,79,.3],[2.5,81,.3],[3.5,79,.3],[4,77,.3],[4.75,77,.3],[5.5,81,.3],[6.5,84,.3],[7.5,81,.3],[8,79,.3],[8.75,79,.3],[9.5,84,.3],[10.5,88,.3],[11.5,84,.3],[12,83,.3],[12.75,83,.3],[13.5,86,.3],[14.5,83,.3],[15.5,79,.3]] },
  amour: { label: 'Amour · Piano intime', description: 'Piano feutré, accords espacés et tempo lent, 66 BPM.', bpm: 66, beats: 4, instrument: 'piano', rhythm: 'none', chords: [[45,52,60],[53,60,64],[48,55,62],[55,62,65]], melody: [[0,76,2],[2.5,72,1],[4,77,2.5],[7,76,.8],[8,74,1.5],[10,72,1.5],[12,71,2],[14.5,67,1]] },
  mariage: { label: 'Mariage · Valse de harpe', description: 'Harpe en arpèges et accords doux à trois temps, 84 BPM.', bpm: 84, beats: 3, instrument: 'harp', rhythm: 'waltz', chords: [[48,52,55],[53,57,60],[55,59,62],[48,52,55]], melody: [[0,72,1],[1,76,.5],[1.5,79,.5],[2,84,.8],[3,81,1.5],[4.5,77,.5],[5,76,.8],[6,74,1],[7,79,.5],[7.5,83,.5],[8,86,.8],[9,84,2.5]] },
  merci: { label: 'Merci · Acoustique solaire', description: 'Cordes pincées, accords chaleureux et rythme léger, 96 BPM.', bpm: 96, beats: 4, instrument: 'guitar', rhythm: 'acoustic', chords: [[50,54,57],[55,59,62],[52,55,59],[57,61,64]], melody: [[0,74,.8],[1.5,78,.4],[2,81,1],[4,79,.7],[5,78,.5],[6.5,74,1],[8,76,.8],[9.5,79,.4],[10,83,1],[12,81,.7],[13,78,.5],[14.5,74,1]] },
  hiver: { label: 'Hiver & nature · Paysage sonore', description: 'Nappes aériennes et carillons espacés, sans batterie, 48 BPM.', bpm: 48, beats: 4, instrument: 'pad', rhythm: 'none', chords: [[48,55,62],[53,60,67],[45,52,59],[55,62,69]], melody: [[0,84,3],[4,79,3],[8,86,3],[12,81,3]] },
};

export function musicForTheme(themeId: string, event: CardEvent): MusicStyle {
  if (event !== 'noel') return event;
  if (themeId === 'noel-3' || themeId === 'noel-9') return 'noel-festif';
  if (themeId === 'noel-6' || themeId === 'noel-minimaliste' || themeId === 'noel-4') return 'noel-doux';
  return 'noel';
}

export function scheduleCardMusic(context: BaseAudioContext, destination: AudioNode, style: MusicStyle, duration: number, volume: number): () => void {
  const score = MUSIC_STYLES[style];
  const bus = context.createGain();
  const start = context.currentTime + .03;
  const end = context.currentTime + Math.max(.1, duration);
  const level = Number.isFinite(volume) ? 3 * Math.max(0, Math.min(1, volume)) : 0;
  bus.gain.setValueAtTime(0, context.currentTime);
  bus.gain.linearRampToValueAtTime(level, start + .04);
  bus.gain.setValueAtTime(level, Math.max(start + .04, end - .35));
  bus.gain.linearRampToValueAtTime(0, end);
  bus.connect(destination);
  const sources: AudioScheduledSourceNode[] = [];
  const nodes: AudioNode[] = [bus];
  const beat = 60 / score.bpm;
  const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
  const partials: Record<Instrument, readonly (readonly [number, number])[]> = {
    bells: [[1,.65],[2.76,.22],[5.4,.09]], box: [[1,.8],[2,.15],[3,.05]],
    marimba: [[1,.8],[4,.2]], synth: [[1,1]], piano: [[1,.65],[2,.23],[3,.08],[4,.04]],
    harp: [[1,.65],[2,.2],[3,.1]], guitar: [[1,.5],[2,.25],[3,.13],[4,.07]], pad: [[1,.65],[2,.2]],
  };
  const tone = (midi: number, time: number, length: number, instrument: Instrument, gain = .12) => {
    if (time >= end - .03) return;
    const stop = Math.min(end, time + Math.max(.07, length));
    for (const [ratio, weight] of partials[instrument]) {
      const osc = context.createOscillator(); const env = context.createGain();
      osc.type = instrument === 'synth' ? 'triangle' : 'sine';
      osc.frequency.value = frequency(midi) * ratio;
      const attack = Math.min(instrument === 'pad' ? .55 : .008, (stop-time)/3);
      env.gain.setValueAtTime(0, time);
      env.gain.linearRampToValueAtTime(gain * weight, time + attack);
      env.gain.exponentialRampToValueAtTime(.0001, stop);
      osc.connect(env); env.connect(bus); osc.start(time); osc.stop(stop);
      sources.push(osc); nodes.push(osc, env);
    }
  };
  // Seeded noise makes the percussion repeatable in preview and export.
  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * .25), context.sampleRate);
  let seed = 173;
  const data = noise.getChannelData(0);
  for (let i=0; i<data.length; i++) { seed = (seed * 16807) % 2147483647; data[i] = (seed / 2147483647) * 2 - 1; }
  const percussion = (time: number, kind: 'hat' | 'clap' | 'sleigh', gain: number) => {
    if (time >= end - .02) return;
    const source = context.createBufferSource(); const filter = context.createBiquadFilter(); const env = context.createGain();
    source.buffer = noise; filter.type = 'highpass'; filter.frequency.value = kind === 'clap' ? 1200 : 6500;
    const stop = Math.min(end, time + (kind === 'clap' ? .13 : .065));
    env.gain.setValueAtTime(gain, time); env.gain.exponentialRampToValueAtTime(.0001, stop);
    source.connect(filter); filter.connect(env); env.connect(bus); source.start(time); source.stop(stop);
    sources.push(source); nodes.push(source,filter,env);
    if (kind === 'sleigh') tone(100, time, .1, 'bells', .018);
  };
  const kick = (time: number) => {
    if (time >= end - .02) return;
    const osc = context.createOscillator(); const env = context.createGain(); const stop = Math.min(end,time+.22);
    osc.frequency.setValueAtTime(125,time); osc.frequency.exponentialRampToValueAtTime(45,stop);
    env.gain.setValueAtTime(.17,time); env.gain.exponentialRampToValueAtTime(.0001,stop);
    osc.connect(env); env.connect(bus); osc.start(time); osc.stop(stop); sources.push(osc); nodes.push(osc,env);
  };
  const phraseBeats = score.beats * score.chords.length;
  for (let loop = 0; start + loop * phraseBeats * beat < end; loop++) {
    const origin = start + loop * phraseBeats * beat;
    for (const [position, midi, length] of score.melody) tone(midi, origin + position * beat, length * beat * 1.2, score.instrument, score.instrument === 'pad' ? .09 : .14);
    score.chords.forEach((chord, bar) => {
      const time = origin + bar * score.beats * beat;
      if (time >= end) return;
      tone(chord[0] - 12, time, beat * 2.5, 'piano', .07);
      if (score.rhythm === 'dance') {
        for (let b=0; b<4; b++) { kick(time+b*beat); tone(chord[0],time+(b+.5)*beat,beat*.4,'synth',.085); percussion(time+(b+.5)*beat,'hat',.045); if(b%2) percussion(time+b*beat,'clap',.09); }
      } else if (score.rhythm === 'party') {
        kick(time); kick(time+2.5*beat); percussion(time+beat,'clap',.075); percussion(time+3*beat,'clap',.075);
        chord.forEach((n,i)=>tone(n+12,time+(i*.5)*beat,beat*.6,'marimba',.06));
      } else if (score.rhythm === 'sleigh') {
        for(let b=0;b<score.beats;b++) percussion(time+b*beat,'sleigh',.04);
        chord.forEach(n=>tone(n,time,beat*2,'piano',.035));
      } else if (score.rhythm === 'waltz' || score.rhythm === 'acoustic') {
        for (let b=0;b<score.beats;b++) chord.forEach((n,i)=>tone(n+12,time+(b+i*.045)*beat,beat*.85,score.instrument,.036));
        if(score.rhythm==='acoustic') { percussion(time+beat,'hat',.025); percussion(time+3*beat,'hat',.025); }
      } else chord.forEach((n,i)=>tone(n,time+i*.08,beat*score.beats,score.instrument==='pad'?'pad':'piano',.035));
    });
  }
  let stopped = false;
  return () => {
    if (stopped) return; stopped = true;
    for (const source of sources) { try { source.stop(); } catch { /* Already finished. */ } }
    for (const node of nodes) node.disconnect();
  };
}
