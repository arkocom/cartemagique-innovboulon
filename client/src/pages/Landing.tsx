import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Download, MonitorDown, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Landing() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateDisplayMode = () => {
      const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
      setIsStandalone(displayMode.matches || navigatorWithStandalone.standalone === true);
    };

    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    updateDisplayMode();

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowInstallHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    displayMode.addEventListener("change", updateDisplayMode);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      displayMode.removeEventListener("change", updateDisplayMode);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstallHelp(true);
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome !== "accepted") setShowInstallHelp(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-20">
        <img src="/pwa-192.png" alt="Innov'BOULON" className="h-12 w-12 sm:h-16 sm:w-16 rounded-full shadow-lg" />
      </div>

      <main className="z-10 text-center max-w-2xl animate-fade-in px-2">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-semibold tracking-wide text-slate-300 border border-white/10 mb-5">
          <Smartphone size={14} /> Créateur de cartes, partout avec vous
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 font-serif bg-gradient-to-r from-white via-amber-300 to-red-500 bg-clip-text text-transparent">
          Joyeux Noël
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-2">de la part de…</p>
        <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10">
          Créez une carte unique pour célébrer la fin de l&apos;année.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto">
          <Link
            href="/editor"
            className="min-h-12 px-7 py-3.5 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-full shadow-lg transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center"
          >
            ✨ Créer ma carte
          </Link>

          {!isStandalone && (
            <button
              onClick={handleInstallClick}
              className="min-h-12 px-7 py-3.5 bg-slate-800/95 border border-slate-600 text-white font-bold rounded-full shadow-lg transition-all duration-150 hover:bg-slate-700 active:scale-[0.97] flex items-center justify-center gap-2"
            >
              <Download size={19} /> Installer l&apos;app
            </button>
          )}
        </div>

        {isStandalone && (
          <p className="mt-5 text-sm text-emerald-300">✓ Application installée · les mises à jour sont automatiques</p>
        )}
      </main>

      <footer className="absolute bottom-5 sm:bottom-8 z-20 text-center px-4">
        <p className="text-xs sm:text-sm text-gray-400">
          Offert par <a href="https://innov-boulon.fr" target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Innov&apos;BOULON</a> • Développé par <span className="font-bold text-white">Manus</span>
        </p>
      </footer>

      {showInstallHelp && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm p-4 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <section className="w-full max-w-md rounded-3xl bg-slate-800 border border-slate-600 shadow-2xl p-6 text-left relative">
            <button onClick={() => setShowInstallHelp(false)} aria-label="Fermer" className="absolute right-4 top-4 rounded-full p-2 text-slate-300 hover:bg-white/10">
              <X size={20} />
            </button>
            <div className="h-11 w-11 rounded-2xl bg-amber-400/15 text-amber-300 flex items-center justify-center mb-4"><MonitorDown size={22} /></div>
            <h2 id="install-title" className="text-xl font-bold pr-8">Installer CarteMagique</h2>
            {isIOS ? (
              <p className="mt-3 text-slate-300 leading-relaxed">Dans Safari, touchez <strong>Partager</strong>, puis <strong>Sur l&apos;écran d&apos;accueil</strong> et enfin <strong>Ajouter</strong>.</p>
            ) : (
              <p className="mt-3 text-slate-300 leading-relaxed">Dans Chrome, ouvrez le menu <strong>⋮</strong>, puis choisissez <strong>Installer l&apos;application</strong> ou <strong>Ajouter à l&apos;écran d&apos;accueil</strong>.</p>
            )}
            <p className="mt-4 rounded-xl bg-slate-900/70 p-3 text-sm text-slate-400">Si l&apos;application installée affiche une page blanche, supprimez son ancienne icône puis installez-la de nouveau depuis ce site publié.</p>
          </section>
        </div>
      )}
    </div>
  );
}
