import type { CardCanvasTextBlock, CardCanvasTextStyle } from '@/lib/cardCanvas';

interface Props {
  block: CardCanvasTextBlock;
  styles: Record<string, CardCanvasTextStyle>;
  onChange: (changes: Partial<CardCanvasTextBlock>) => void;
}

export default function TextProperties({ block, styles, onChange }: Props) {
  const style = styles[block.style] ?? styles.modern;
  return <div className="space-y-3 rounded-xl border border-current/20 p-3">
    <label className="block text-sm font-semibold">Police du texte
      <select aria-label="Police du texte" value={block.style} onChange={(e) => onChange({ style: e.target.value })} className="mt-2 min-h-11 w-full rounded-lg border border-slate-400 bg-white px-2 text-slate-900" style={{ fontFamily: style.fontFamily }}>
        {Object.entries(styles).map(([id, item]) => <option key={id} value={id} style={{ fontFamily: item.fontFamily }}>{item.name}</option>)}
      </select>
    </label>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={block.shadowEnabled ?? style.shadowBlur > 0} onChange={(e) => onChange({ shadowEnabled: e.target.checked })} className="h-5 w-5" />Ombre portée du texte</label>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={block.outlineEnabled ?? style.outline} onChange={(e) => onChange({ outlineEnabled: e.target.checked })} className="h-5 w-5" />Contour du texte</label>
    <label className="block text-sm">Alignement
      <select aria-label="Alignement du texte" value={block.align} onChange={(e) => onChange({ align: e.target.value as CardCanvasTextBlock['align'] })} className="mt-1 min-h-11 w-full rounded-lg bg-white px-2 text-slate-900"><option value="left">Gauche</option><option value="center">Centré</option><option value="right">Droite</option></select>
    </label>
    <div className="grid grid-cols-2 gap-3">
      <label className="text-sm">Position horizontale<input aria-label="Position horizontale du texte" type="range" min="16" max="384" value={block.x} onChange={(e) => onChange({ x: Number(e.target.value) })} className="mt-2 w-full" /></label>
      <label className="text-sm">Position verticale<input aria-label="Position verticale du texte" type="range" min="16" max="584" value={block.y} onChange={(e) => onChange({ y: Number(e.target.value) })} className="mt-2 w-full" /></label>
    </div>
    <p className="text-xs opacity-80">Ces effets concernent uniquement le texte sélectionné. Décochez l’ombre et le contour pour une écriture sans effet.</p>
  </div>;
}
