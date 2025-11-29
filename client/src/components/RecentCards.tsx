import { SavedCard, deleteCard } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface RecentCardsProps {
  cards: SavedCard[];
  onCardSelect: (card: SavedCard) => void;
  onCardDelete: (id: string) => void;
}

export default function RecentCards({ cards, onCardSelect, onCardDelete }: RecentCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucune carte sauvegardée</p>
        <p className="text-sm">Créez votre première carte pour la retrouver ici</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Mes cartes récentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCardSelect(card)}
          >
            <div className="space-y-2">
              <h3 className="font-semibold truncate">{card.name}</h3>
              <p className="text-sm text-muted-foreground">
                Thème: {card.theme}
              </p>
              <p className="text-xs text-muted-foreground">
                Modifiée: {new Date(card.updatedAt).toLocaleDateString('fr-FR')}
              </p>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardSelect(card);
                  }}
                >
                  Charger
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardDelete(card.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
