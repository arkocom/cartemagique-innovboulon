import { describe, expect, it, vi, afterEach } from 'vitest';
import { cardSnapshotSchema, readLegacyCard, storageErrorMessage, DEFAULT_MEDIA, saveCard, readDraft, listCards, deleteCard, type CardSnapshot } from './cardStorage';
import { validatePhotoBatch, MAX_PHOTO_BYTES } from './photoImport';

const card: CardSnapshot = { version: 1, themeId: 'noel-3', textBlocks: [{ id: '1', text: 'Test Noël', x: 200, y: 300, color: '#111827', fontSize: 32, style: 'allura', align: 'center', shadowEnabled: false }], imageElements: [{ id: 'photo-test', src: 'data:image/png;base64,AAA', x: 20, y: 30, width: 120, height: 90, rotation: 15 }], backgroundColor: '', aspectRatio: 'story', showFrame: true, frameWidth: 12, cardMode: 'animated', media: { ...DEFAULT_MEDIA, musicChoice: 'noel-doux', volume: 60 }, textStyles: {}, customFonts: {} };

describe('saved creation boundaries', () => {
  it('keeps the complete card including photos and sound settings across JSON serialization', () => {
    expect(cardSnapshotSchema.parse(JSON.parse(JSON.stringify(card)))).toEqual(card);
  });
  it('rejects malformed drafts instead of treating them as an empty creation', () => {
    expect(() => cardSnapshotSchema.parse({ ...card, imageElements: [{ id: 'broken' }] })).toThrow();
    expect(() => cardSnapshotSchema.parse({ ...card, version: 2 })).toThrow();
  });
  it('migrates existing text and photos together and preserves an empty text list', () => {
    const values = { cartemagique_textBlocks: '[]', cartemagique_imageElements: JSON.stringify(card.imageElements) };
    expect(readLegacyCard({ getItem: key => values[key as keyof typeof values] })).toEqual({ textBlocks: [], imageElements: card.imageElements });
  });
  it('surfaces corrupt or inaccessible legacy storage', () => {
    expect(() => readLegacyCard({ getItem: () => '{broken' })).toThrow();
    expect(() => readLegacyCard({ getItem: () => { throw new Error('denied'); } })).toThrow('denied');
  });
  it('gives an actionable warning for a full device', () => {
    expect(storageErrorMessage(new DOMException('full', 'QuotaExceededError'))).toContain('Stockage de cet appareil plein');
  });
  it('rejects oversized, unsupported or too many photos before decoding', () => {
    expect(() => validatePhotoBatch([{ type: 'image/jpeg', size: MAX_PHOTO_BYTES + 1 }], 0)).toThrow('15 Mo');
    expect(() => validatePhotoBatch([{ type: 'image/heic', size: 100 }], 0)).toThrow('JPG');
    expect(() => validatePhotoBatch([{ type: 'image/png', size: 100 }], 12)).toThrow('12 photos');
    expect(() => validatePhotoBatch([{ type: 'image/png', size: 100 }], 11)).not.toThrow();
  });
});

// Transaction harness: request success alone is not a committed write.
describe('transaction completion and failure', () => {
  afterEach(() => { vi.unstubAllGlobals(); });
  it('restores photos after a committed write and retains the old draft when the next transaction aborts', async () => {
    const records = new Map<string, unknown>();
    let abortNext = false;
    const database = { transaction: () => {
      const transaction: Record<string, any> = {};
      const run = (operation: () => unknown) => {
        const request: Record<string, any> = {};
        setTimeout(() => {
          if (abortNext) { abortNext = false; transaction.error = new DOMException('full', 'QuotaExceededError'); transaction.onabort(); }
          else { request.result = operation(); transaction.oncomplete(); }
        }, 0);
        return request;
      };
      transaction.objectStore = () => ({
        put: (value: any) => run(() => { records.set(value.id, structuredClone(value)); return value.id; }),
        get: (id: string) => run(() => structuredClone(records.get(id))),
        getAll: () => run(() => structuredClone([...records.values()])),
        delete: (id: string) => run(() => { records.delete(id); }),
      });
      return transaction;
    } };
    vi.stubGlobal('indexedDB', { open: () => {
      const request: Record<string, any> = { result: database };
      setTimeout(() => request.onsuccess(), 0);
      return request;
    } });
    const initial = { id: 'draft', name: 'Création en cours', updatedAt: 1, card };
    const pending = saveCard(initial);
    expect(records.size).toBe(0);
    await pending;
    expect(await readDraft()).toEqual(card);
    abortNext = true;
    await expect(saveCard({ ...initial, card: { ...card, imageElements: [] } })).rejects.toMatchObject({ name: 'QuotaExceededError' });
    expect((await readDraft())?.imageElements).toEqual(card.imageElements);
    await saveCard({ ...initial, id: 'named', name: 'Famille' });
    expect((await listCards()).map(item => item.name)).toEqual(['Famille']);
    await deleteCard('named');
    expect(await listCards()).toEqual([]);
    expect(await readDraft()).toEqual(card);
  });
});
