import type { CardCanvasTextBlock, CardCanvasTextStyle } from '@/lib/cardCanvas';

interface Props {
  block: CardCanvasTextBlock;
  styles: Record<string, CardCanvasTextStyle>;
  onChange: (changes: Partial<CardCanvasTextBlock>) => void;
  onAdaptColor: () => Promise<void>;
  adaptingColor: boolean;
  canvasWidth: number;
  onImportFont: () => void;
}

const fieldClass = 'mt-2 min-h-11 w-full rounded-lg border border-slate-400 bg-white px-2 text-slate-900';

export default function TextProperties({ block, styles, onChange, onAdaptColor, adaptingColor, canvasWidth, onImportFont }: Props) {
  const style = styles[block.style] ?? styles.modern;
  const outlined = block.outlineEnabled ?? style.outline;
  return <div className="space-y-4 rounded-xl border border-current/20 p-3">
    <label className="block text-sm font-semibold">Police du texte
      <select aria-label="Police du texte" value={block.style} onChange={(e) => onChange({ style: e.target.value })} className={fieldClass} style={{ fontFamily: style.fontFamily }}>
        {Object.entries(styles).map(([id, item]) => <option key={id} value={id} style={{ fontFamily: item.fontFamily }}>{item.name}</option>)}
      </select>
    </label>
    <button type="button" onClick={onImportFont} className="min-h-11 w-full rounded-lg border border-current/30 px-3 text-sm">Importer ma police</button>
    <label className="block text-sm">Taille du texte : {block.fontSize}px
      <input aria-label="Taille du texte" type="range" min="18" max="96" value={block.fontSize} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} className="mt-2 w-full" />
    </label>
    <div className="space-y-2">
      <label className="flex min-h-11 items-center justify-between gap-3 text-sm font-semibold">Couleur du texte
        <input aria-label="Couleur du texte" type="color" value={block.color} onChange={(e) => onChange({ color: e.target.value })} className="h-11 w-14 cursor-pointer rounded bg-white" />
      </label>
      <div className="flex flex-wrap gap-2">
        {[['Blanc', '#ffffff'], ['Noir', '#000000'], ['Doré', '#fbbf24'], ['Rouge', '#f87171'], ['Bleu', '#60a5fa']].map(([name, color]) => <button key={color} type="button" aria-label={`Texte ${name.toLowerCase()}`} aria-pressed={block.color === color} onClick={() => onChange({ color })} className="h-11 w-11 rounded-full border-2 border-slate-400" style={{ backgroundColor: color }} />)}
      </div>
      <button type="button" onClick={() => void onAdaptColor()} disabled={adaptingColor} className="min-h-11 w-full rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white disabled:opacity-60">{adaptingColor ? 'Analyse du fond…' : 'Adapter la couleur au fond'}</button>
      <p className="text-xs opacity-80">Propose du texte clair ou foncé selon la zone du fond derrière votre message. Vous pouvez ensuite choisir une autre couleur.</p>
    </div>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={block.shadowEnabled ?? style.shadowBlur > 0} onChange={(e) => onChange({ shadowEnabled: e.target.checked })} className="h-5 w-5" />Ombre portée du texte</label>
    <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={outlined} onChange={(e) => onChange({ outlineEnabled: e.target.checked })} className="h-5 w-5" />Contour du texte</label>
    {outlined && <div className="space-y-3">
      <label className="block text-sm">Épaisseur du contour : {block.outlineWidth ?? (style.outlineWidth || 2)}px
        <input aria-label="Épaisseur du contour" type="range" min="1" max="10" value={block.outlineWidth ?? (style.outlineWidth || 2)} onChange={(e) => onChange({ outlineWidth: Number(e.target.value) })} className="mt-2 w-full" />
      </label>
      <label className="flex min-h-11 items-center justify-between text-sm">Couleur du contour<input aria-label="Couleur du contour" type="color" value={block.outlineColor ?? (style.outlineColor || '#000000')} onChange={(e) => onChange({ outlineColor: e.target.value })} className="h-11 w-14 rounded bg-white" /></label>
    </div>}
    <label className="block text-sm">Alignement
      <select aria-label="Alignement du texte" value={block.align} onChange={(e) => onChange({ align: e.target.value as CardCanvasTextBlock['align'] })} className={fieldClass}><option value="left">Gauche</option><option value="center">Centré</option><option value="right">Droite</option></select>
    </label>
    <div className="grid grid-cols-2 gap-3">
      <label className="text-sm">Position horizontale<input aria-label="Position horizontale du texte" type="range" min="16" max={canvasWidth - 16} value={block.x} onChange={(e) => onChange({ x: Number(e.target.value) })} className="mt-2 w-full" /></label>
      <label className="text-sm">Position verticale<input aria-label="Position verticale du texte" type="range" min="16" max="584" value={block.y} onChange={(e) => onChange({ y: Number(e.target.value) })} className="mt-2 w-full" /></label>
    </div>
    <p className="text-xs opacity-80">Ces réglages concernent uniquement le texte sélectionné.</p>
  </div>;
}
