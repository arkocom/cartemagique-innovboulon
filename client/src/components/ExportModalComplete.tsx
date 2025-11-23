import { useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ExportModalCompleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stageRef: React.RefObject<any>;
}

export default function ExportModalComplete({
  open,
  onOpenChange,
  stageRef,
}: ExportModalCompleteProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    if (!stageRef.current) return;

    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Méthode 1: Export direct depuis Konva (meilleure qualité)
      const uri = stageRef.current.toDataURL({
        pixelRatio: 2, // Haute résolution
        mimeType: 'image/png',
      });

      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.download = `carte-magique-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      
      // Fermer la modal après 2 secondes
      setTimeout(() => {
        onOpenChange(false);
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Télécharger votre carte</DialogTitle>
          <DialogDescription className="text-gray-400">
            Votre carte sera téléchargée en haute qualité au format PNG.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {exportSuccess ? (
            <div className="text-center space-y-2">
              <div className="text-6xl">✅</div>
              <p className="text-lg font-medium text-green-400">
                Carte téléchargée avec succès !
              </p>
              <p className="text-sm text-gray-400">
                Vérifiez votre dossier de téléchargements
              </p>
            </div>
          ) : (
            <>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">📱 Sur mobile</h4>
                <p className="text-sm text-gray-300">
                  Appuyez longuement sur l'image téléchargée pour l'enregistrer dans votre galerie.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <h4 className="font-medium">💻 Sur ordinateur</h4>
                <p className="text-sm text-gray-300">
                  L'image sera enregistrée dans votre dossier de téléchargements.
                </p>
              </div>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
                ) : (
                  <>📥 Télécharger maintenant</>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
