import { useEffect, useMemo, useState } from "react";
import { Sparkles, X, RotateCcw, Plus, Check } from "lucide-react";
import {
  createTextSuggestions,
  inferOccasion,
  LENGTH_LABELS,
  OCCASION_LABELS,
  RECIPIENT_LABELS,
  TONE_LABELS,
  type TextAssistantRequest,
  type TextLength,
  type TextOccasion,
  type TextRecipient,
  type TextTone,
} from "@/lib/textAssistant";

interface TextAssistantDialogProps {
  open: boolean;
  themeId: string;
  canReplace: boolean;
  onClose: () => void;
  onInsert: (text: string) => void;
  onAdd: (text: string) => void;
}

const occasions = Object.keys(OCCASION_LABELS) as TextOccasion[];
const recipients = Object.keys(RECIPIENT_LABELS) as TextRecipient[];
const tones = Object.keys(TONE_LABELS) as TextTone[];
const lengths = Object.keys(LENGTH_LABELS) as TextLength[];

export default function TextAssistantDialog({ open, themeId, canReplace, onClose, onInsert, onAdd }: TextAssistantDialogProps) {
  const [request, setRequest] = useState<TextAssistantRequest>({
    occasion: inferOccasion(themeId),
    recipient: "autre",
    name: "",
    tone: "chaleureux",
    length: "moyen",
  });
  const [reroll, setReroll] = useState(0);

  useEffect(() => {
    if (!open) return;
    setRequest((current) => ({ ...current, occasion: inferOccasion(themeId) }));
    setReroll(0);
  }, [open, themeId]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  const suggestions = useMemo(() => createTextSuggestions(request, reroll), [request, reroll]);

  if (!open) return null;

  const choose = (key: keyof TextAssistantRequest, value: string) => {
    setRequest((current) => ({ ...current, [key]: value }));
    setReroll(0);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="assistant-title" aria-describedby="assistant-description">
      <section className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-600 bg-slate-900 p-5 shadow-2xl sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300"><Sparkles size={15} /> Assistant de texte</p>
            <h2 id="assistant-title" className="mt-1 text-xl font-bold text-white">Trois messages sur mesure</h2>
            <p id="assistant-description" className="mt-1 text-sm text-slate-300">Créé directement sur cet appareil : aucun détail n&apos;est envoyé.</p>
          </div>
          <button onClick={onClose} className="min-h-11 min-w-11 rounded-full text-slate-300 hover:bg-white/10" aria-label="Fermer l’assistant"><X className="mx-auto" size={22} /></button>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-200">Occasion
            <select value={request.occasion} onChange={(event) => choose("occasion", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 text-white">
              {occasions.map((occasion) => <option key={occasion} value={occasion}>{OCCASION_LABELS[occasion]}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-200">Pour qui ?
            <select value={request.recipient} onChange={(event) => choose("recipient", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 text-white">
              {recipients.map((recipient) => <option key={recipient} value={recipient}>{RECIPIENT_LABELS[recipient]}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-200">Prénom <span className="font-normal text-slate-400">(facultatif)</span>
            <input value={request.name} onChange={(event) => { setRequest((current) => ({ ...current, name: event.target.value })); setReroll(0); }} maxLength={32} placeholder="Ex. Camille" className="mt-1 min-h-11 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 text-white placeholder:text-slate-500" />
          </label>
          <label className="block text-sm font-semibold text-slate-200">Ton
            <select value={request.tone} onChange={(event) => choose("tone", event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 text-white">
              {tones.map((tone) => <option key={tone} value={tone}>{TONE_LABELS[tone]}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-200">Longueur</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {lengths.map((length) => (
              <button key={length} onClick={() => choose("length", length)} aria-pressed={request.length === length} className={`min-h-11 rounded-xl border text-sm font-semibold ${request.length === length ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-slate-600 bg-slate-800 text-slate-300"}`}>
                {LENGTH_LABELS[length]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {suggestions.map((suggestion) => (
            <article key={suggestion.id} className="rounded-2xl border border-slate-700 bg-slate-800/75 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-amber-200">{suggestion.label}</p>
                <span className="text-xs text-slate-400">{suggestion.characterCount} caractères · {suggestion.estimatedLines} lignes</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white">{suggestion.text}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button onClick={() => onInsert(suggestion.text)} className="min-h-11 rounded-xl bg-amber-400 px-3 text-sm font-bold text-slate-950 active:scale-[0.98]">
                  <Check className="mr-1 inline" size={16} /> {canReplace ? "Insérer dans ce bloc" : "Créer ce message"}
                </button>
                <button onClick={() => onAdd(suggestion.text)} className="min-h-11 rounded-xl border border-slate-500 px-3 text-sm font-semibold text-white hover:bg-white/10 active:scale-[0.98]"><Plus className="mr-1 inline" size={16} /> Ajouter un bloc</button>
              </div>
            </article>
          ))}
        </div>

        <footer className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <button onClick={onClose} className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-300 hover:bg-white/10">Retour à la carte</button>
          <button onClick={() => setReroll((value) => value + 1)} className="min-h-11 rounded-xl border border-slate-500 px-4 text-sm font-semibold text-white hover:bg-white/10"><RotateCcw className="mr-1 inline" size={16} /> 3 autres idées</button>
        </footer>
      </section>
    </div>
  );
}
