import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { listCards, saveCard, deleteCard, storageErrorMessage, type CardSnapshot, type SavedCard } from '@/lib/cardStorage';
import { themes } from '@/lib/themes';

export default function MyCards({ open, onClose, current, onRestore }: { open: boolean; onClose: () => void; current?: CardSnapshot; onRestore?: (card: CardSnapshot) => Promise<void> }) {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [name, setName] = useState('Ma carte');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const refresh = async () => setCards(await listCards());
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true); setMessage('');
    listCards().then(value => { if (!cancelled) setCards(value); }).catch(error => { if (!cancelled) setMessage(storageErrorMessage(error)); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);
  const action = async (operation: () => Promise<void>) => {
    setBusy(true); setMessage('');
    try { await operation(); } catch (error) { setMessage(error instanceof Error && !['QuotaExceededError', 'SecurityError'].includes(error.name) ? error.message : storageErrorMessage(error)); }
    finally { setBusy(false); }
  };
  return <Dialog open={open} onOpenChange={value => { if (!value && !busy) onClose(); }}>
    <DialogContent className="max-h-[85dvh] overflow-y-auto bg-background text-foreground">
      <DialogTitle>Mes cartes</DialogTitle>
      <DialogDescription>Vos créations restent dans ce navigateur, sur cet appareil. Elles ne sont pas synchronisées. Effacer les données du navigateur les supprime.</DialogDescription>
      {current && <form className="flex flex-wrap gap-2" onSubmit={event => { event.preventDefault(); void action(async () => {
        if (cards.length >= 20) throw new Error('Vous avez déjà 20 cartes. Supprimez-en une avant d’enregistrer une nouvelle.');
        await saveCard({ id: crypto.randomUUID(), name: name.trim() || 'Ma carte', updatedAt: Date.now(), card: current });
        await refresh(); setMessage('Carte enregistrée avec ses photos et ses réglages.');
      }); }}>
        <label className="min-w-0 flex-1 text-sm">Nom de la carte<input maxLength={80} value={name} onChange={event => setName(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-slate-500/40 bg-background px-3 text-foreground" /></label>
        <button disabled={busy || loading} className="self-end min-h-11 rounded-lg bg-blue-600 px-3 text-white disabled:opacity-50">Enregistrer une copie</button>
      </form>}
      <p role="status" className="text-sm">{loading ? 'Chargement…' : message}</p>
      {!loading && cards.length === 0 && <p className="text-sm text-muted-foreground">Aucune carte enregistrée. Dans l’éditeur, ouvrez « Mes cartes » pour conserver une copie nommée.</p>}
      <ul className="space-y-3">{cards.map(record => <li key={record.id} className="flex gap-3 rounded-xl border border-slate-500/30 p-3">
        <img src={themes.find(theme => theme.id === record.card.themeId)?.image} alt="" className="h-20 w-14 rounded object-cover" loading="lazy" />
        <div className="min-w-0 flex-1"><p className="break-words font-semibold">{record.name}</p><p className="text-xs text-muted-foreground">{new Date(record.updatedAt).toLocaleString('fr-FR')} · {record.card.cardMode === 'animated' ? 'Animée' : 'Statique'}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button disabled={busy} onClick={() => void action(async () => { if (onRestore) { await onRestore(record.card); onClose(); } else { window.location.href = `/editor?card=${encodeURIComponent(record.id)}`; } })} className="min-h-11 rounded-lg bg-blue-600 px-3 text-sm text-white disabled:opacity-50">Ouvrir</button>
            <button disabled={busy} onClick={() => { if (window.confirm(`Supprimer la carte « ${record.name} » ? Cette action est définitive.`)) void action(async () => { await deleteCard(record.id); await refresh(); setMessage('Carte supprimée.'); }); }} className="min-h-11 rounded-lg border border-red-500/50 px-3 text-sm text-foreground disabled:opacity-50">Supprimer</button>
          </div>
        </div>
      </li>)}</ul>
    </DialogContent>
  </Dialog>;
}
