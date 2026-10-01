import { z } from 'zod';
import { EVENT_LABELS, ANIMATION_LABELS } from './cardEffects';
import { MUSIC_STYLES } from './cardMusic';

const numeric = z.number().finite();
export const textBlockSchema = z.object({
  id: z.string(), text: z.string().max(10000), x: numeric, y: numeric,
  color: z.string(), fontSize: numeric.min(1).max(500), style: z.string(),
  align: z.enum(['left', 'center', 'right']), shadowEnabled: z.boolean().optional(),
  outlineEnabled: z.boolean().optional(), outlineWidth: numeric.optional(), outlineColor: z.string().optional(),
});
export const imageSchema = z.object({
  id: z.string(), src: z.string().max(4_000_000), x: numeric, y: numeric,
  width: numeric.positive(), height: numeric.positive(), rotation: numeric,
  filter: z.enum(['none', 'grayscale', 'sepia', 'vintage']).optional(), tint: z.string().optional(),
});
const styleSchema = z.object({ name: z.string(), fontFamily: z.string(), fontWeight: z.string().optional(), shadowBlur: numeric, shadowColor: z.string(), outline: z.boolean(), outlineWidth: numeric, outlineColor: z.string() });
export const mediaSchema = z.object({
  occasion: z.custom<keyof typeof EVENT_LABELS | 'auto'>(v => v === 'auto' || typeof v === 'string' && Object.hasOwn(EVENT_LABELS, v)),
  effect: z.custom<keyof typeof ANIMATION_LABELS | 'auto'>(v => v === 'auto' || typeof v === 'string' && Object.hasOwn(ANIMATION_LABELS, v)),
  musicChoice: z.custom<keyof typeof MUSIC_STYLES | 'auto'>(v => v === 'auto' || typeof v === 'string' && Object.hasOwn(MUSIC_STYLES, v)),
  music: z.boolean(), volume: numeric.min(0).max(100), duration: z.union([z.literal(5), z.literal(10), z.literal(15)]),
});
export type MediaSettings = z.infer<typeof mediaSchema>;
export const DEFAULT_MEDIA: MediaSettings = { occasion: 'auto', effect: 'auto', musicChoice: 'auto', music: true, volume: 30, duration: 10 };
export const cardSnapshotSchema = z.object({
  version: z.literal(1), themeId: z.string(), textBlocks: z.array(textBlockSchema).max(100),
  imageElements: z.array(imageSchema).max(100), backgroundColor: z.string(),
  aspectRatio: z.enum(['standard', 'story']), showFrame: z.boolean(), frameWidth: numeric.min(0).max(100),
  cardMode: z.enum(['static', 'animated']), media: mediaSchema,
  textStyles: z.record(z.string(), styleSchema), customFonts: z.record(z.string(), z.string().max(3_000_000)),
});
export type CardSnapshot = z.infer<typeof cardSnapshotSchema>;
export interface SavedCard { id: string; name: string; updatedAt: number; card: CardSnapshot }
const savedCardSchema = z.object({ id: z.string(), name: z.string().max(80), updatedAt: numeric, card: cardSnapshotSchema });
const DB_NAME = 'cartemagique-creations';
export const DRAFT_ID = 'draft';
let database: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (!database) database = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('cards', { keyPath: 'id' });
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Fermez les autres onglets CarteMagique, puis réessayez.'));
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); database = undefined; };
      resolve(db);
    };
  }).catch(error => { database = undefined; throw error; });
  return database;
}

async function transact<T>(mode: IDBTransactionMode, operation: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('cards', mode);
    const request = operation(transaction.objectStore('cards'));
    transaction.oncomplete = () => resolve(request.result);
    transaction.onabort = () => reject(transaction.error ?? request.error ?? new Error('Sauvegarde interrompue.'));
    transaction.onerror = () => reject(transaction.error ?? request.error);
  });
}

export async function saveCard(record: SavedCard): Promise<void> {
  const valid = savedCardSchema.parse(record);
  if (JSON.stringify(valid).length > 24_000_000) throw new Error('Cette carte est trop volumineuse. Retirez quelques photos puis réessayez.');
  await transact('readwrite', store => store.put(valid));
}
export async function readDraft(): Promise<CardSnapshot | null> {
  const record = await transact<unknown>('readonly', store => store.get(DRAFT_ID));
  if (record === undefined) return null;
  return savedCardSchema.parse(record).card;
}
export async function listCards(): Promise<SavedCard[]> {
  const records = await transact<unknown[]>('readonly', store => store.getAll());
  return records.filter(record => (record as SavedCard)?.id !== DRAFT_ID).map(record => savedCardSchema.parse(record)).sort((a, b) => b.updatedAt - a.updatedAt);
}
export async function deleteCard(id: string): Promise<void> {
  await transact('readwrite', store => store.delete(id));
}
export function readLegacyCard(storage: Pick<Storage, 'getItem'>): { textBlocks?: CardSnapshot['textBlocks']; imageElements?: CardSnapshot['imageElements'] } {
  const text = storage.getItem('cartemagique_textBlocks');
  const images = storage.getItem('cartemagique_imageElements');
  return {
    ...(text ? { textBlocks: z.array(textBlockSchema).max(100).parse(JSON.parse(text)) } : {}),
    ...(images ? { imageElements: z.array(imageSchema).max(100).parse(JSON.parse(images)) } : {}),
  };
}
export function storageErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === 'QuotaExceededError') return 'Stockage de cet appareil plein. Retirez des cartes enregistrées ou téléchargez votre création avant de fermer la page.';
  return 'Sauvegarde locale indisponible. Votre carte reste ouverte : téléchargez-la avant de fermer cette page. Vous pouvez réessayer.';
}
