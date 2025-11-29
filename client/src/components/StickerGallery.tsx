import { STICKERS } from '@/lib/stickers';
import { Button } from '@/components/ui/button';

interface StickerGalleryProps {
  onStickerSelect: (stickerId: string) => void;
}

export default function StickerGallery({ onStickerSelect }: StickerGalleryProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm">🎄 Stickers festifs</h3>
      <div className="grid grid-cols-4 gap-2">
        {STICKERS.map((sticker) => (
          <Button
            key={sticker.id}
            variant="outline"
            size="sm"
            className="h-12 p-1 flex items-center justify-center hover:bg-accent"
            onClick={() => onStickerSelect(sticker.id)}
            title={sticker.name}
          >
            <div
              className="w-8 h-8"
              dangerouslySetInnerHTML={{ __html: sticker.svg }}
            />
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Cliquez sur un sticker pour l'ajouter à votre carte</p>
    </div>
  );
}
