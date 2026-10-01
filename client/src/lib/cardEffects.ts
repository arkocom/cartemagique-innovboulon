export type CardEvent = 'noel' | 'anniversaire' | 'nouvel-an' | 'amour' | 'mariage' | 'merci' | 'hiver';
export type CardAnimation = 'none' | 'snow' | 'confetti' | 'fireworks' | 'hearts' | 'sparkles';
export const EVENT_LABELS: Record<CardEvent, string> = { noel: 'Noël', anniversaire: 'Anniversaire', 'nouvel-an': 'Nouvel An', amour: 'Amour', mariage: 'Mariage', merci: 'Remerciement', hiver: 'Hiver & nature' };
export const ANIMATION_LABELS: Record<CardAnimation, string> = { none: 'Sans animation', snow: 'Neige douce', confetti: 'Confettis', fireworks: 'Feux d’artifice', hearts: 'Cœurs flottants', sparkles: 'Étoiles scintillantes' };

export function eventForTheme(id: string): CardEvent {
  if (id.includes('anniversaire')) return 'anniversaire';
  if (id.includes('amour') || id === 'famille-1') return 'amour';
  if (id.includes('mariage')) return 'mariage';
  if (id.includes('merci')) return 'merci';
  if (id.startsWith('famille-')) return 'merci';
  if (id.startsWith('nouvel-an') || id.startsWith('pro') || id.startsWith('artdeco')) return 'nouvel-an';
  if (id.startsWith('hiver') || id.startsWith('nature')) return 'hiver';
  return 'noel';
}

export function animationForEvent(event: CardEvent): CardAnimation {
  return ({ noel: 'snow', hiver: 'snow', anniversaire: 'confetti', 'nouvel-an': 'fireworks', amour: 'hearts', mariage: 'sparkles', merci: 'sparkles' } as const)[event];
}

const fraction = (value: number) => value - Math.floor(value);
export function drawCardEffects(ctx: CanvasRenderingContext2D, width: number, height: number, animation: CardAnimation, seconds: number) {
  if (animation === 'none') return;
  ctx.save();
  const colors = ['#fbbf24', '#fb7185', '#38bdf8', '#a78bfa', '#34d399'];
  if (animation === 'fireworks') {
    for (let burst = 0; burst < 3; burst++) {
      const phase = fraction((seconds + burst * 0.9) / 2.8);
      const x = width * [0.15, 0.84, 0.5][burst];
      const y = height * [0.13, 0.2, 0.08][burst];
      const radius = width * 0.18 * phase;
      ctx.globalAlpha = (1 - phase) * 0.8;
      ctx.strokeStyle = colors[burst];
      ctx.lineWidth = 1.8;
      for (let ray = 0; ray < 22; ray++) {
        const angle = ray / 22 * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * radius * 0.7, y + Math.sin(angle) * radius * 0.7);
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
        ctx.stroke();
      }
    }
    ctx.restore(); return;
  }
  for (let i = 0; i < 42; i++) {
    const seed = fraction(Math.sin(i * 127.1 + 5) * 43758.5453);
    const x = width * (i % 2 ? 0.03 + seed * 0.16 : 0.81 + seed * 0.16) + Math.sin(seconds + i) * 5;
    const speed = animation === 'hearts' ? -0.045 : 0.055;
    const y = fraction(seed * 7 + seconds * speed * (0.7 + seed)) * height;
    ctx.globalAlpha = animation === 'sparkles' ? 0.3 + 0.5 * Math.sin(seconds * 2 + i) ** 2 : 0.7;
    if (animation === 'snow') {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 1.2 + seed * 2.4, 0, Math.PI * 2); ctx.fill();
    } else if (animation === 'confetti') {
      ctx.fillStyle = colors[i % colors.length];
      ctx.save(); ctx.translate(x, y); ctx.rotate(seconds * 1.6 + i); ctx.fillRect(-2, -3, 4, 7); ctx.restore();
    } else {
      ctx.font = `${12 + seed * 7}px serif`; ctx.fillStyle = animation === 'hearts' ? '#fb7185' : '#fde68a';
      ctx.fillText(animation === 'hearts' ? '♥' : '✦', x, y);
    }
  }
  ctx.restore();
}
