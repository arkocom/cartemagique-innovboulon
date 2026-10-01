import "./Landing.css";
import { galleryThemes } from "@/lib/themes";
import { useAppStore } from "@/stores/appStore";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Download, MonitorDown, Smartphone, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Landing() {
  const { theme } = useTheme();
  const setSelectedThemeId = useAppStore((state) => state.setSelectedThemeId);
  const [previewIndex, setPreviewIndex] = useState(0);
  const featured = [
    "noel-3",
    "noel-4",
    "noel-5",
    "nouvel-an-4",
    "feerie-2",
    "nature-4",
    "famille-1",
    "pro-7",
  ]
    .map((id) => galleryThemes.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const heroCard = featured[previewIndex % featured.length];
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateDisplayMode = () => {
      const navigatorWithStandalone = navigator as Navigator & {
        standalone?: boolean;
      };
      setIsStandalone(
        displayMode.matches || navigatorWithStandalone.standalone === true,
      );
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
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
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

  const copyApplicationLink = async () => {
    try {
      await navigator.clipboard.writeText('https://cartemagique.innov-boulon.fr/');
      setCopyStatus('Lien copié : vous pouvez le coller dans votre message.');
    } catch {
      setCopyStatus('Sélectionnez et copiez l’adresse affichée ci-dessous.');
    }
  };

  return (
    <div className="magic-landing" data-ui-theme={theme}>
      <nav className="nav" aria-label="Navigation principale">
        <Link href="/" className="brand">
          <img src="/pwa-192.png" alt="" className="brand-logo" />
          <span className="brand-name">
            CarteMagique<span>Innov’BOULON</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#comment">Comment ça marche</a>
          <a href="#modeles">Modèles</a>
          <a href="#soutien">Soutien</a>
          <ThemeToggle />
          <Link href="/editor" className="btn btn-primary btn-sm">
            ✨ Créer ma carte
          </Link>
        </div>
      </nav>
      <main>
        <header className="hero">
          <div className="hero-grid">
            <div>
              <div className="badges">
                <span className="badge">
                  <i />
                  {galleryThemes.length} modèles de fonds
                </span>
                <span className="badge gold">
                  <i />
                  100 % gratuit
                </span>
                <span className="badge purple">
                  <i />
                  Sans inscription
                </span>
              </div>
              <h1>
                Des cartes de fêtes{" "}
                <span className="grad">qui font sourire</span>, en quelques
                secondes.
              </h1>
              <p className="lead">
                Noël, Nouvel An, anniversaire ou juste un merci. Choisissez un
                vrai fond, ajoutez votre message et vos photos. Offrez une carte
                statique ou une vidéo animée avec musique et effets.
              </p>
              <div className="hero-cta">
                <Link href="/editor" className="btn btn-primary">
                  ✨ Créer ma carte maintenant
                </Link>
                <a href="#modeles" className="btn btn-ghost">
                  Voir les modèles
                </a>
              </div>
              <div className="hero-trust">
                <img
                  src="/pwa-192.png"
                  alt="Logo Innov’BOULON"
                  width="36"
                  height="36"
                />
                <span>
                  Offert par l’association <strong>Innov’BOULON</strong>
                  <br />
                  L’IA et le numérique accessibles à tous.
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="blob" aria-hidden="true" />
              <Link
                href="/editor"
                onClick={() => setSelectedThemeId(heroCard.id)}
                className="mock-card"
                aria-label={`Créer une carte avec ${heroCard.name}`}
              >
                <img
                  src={heroCard.image}
                  alt={heroCard.description}
                  className="real-background"
                  fetchPriority="high"
                />
                <div className="mock-inner">
                  <span className="top">CarteMagique · {heroCard.name}</span>
                  <div
                    className={`msg ${heroCard.id === "noel-3" ? "ink-message" : ""}`}
                  >
                    Un peu de magie,
                    <br />
                    beaucoup de bonheur ✨
                  </div>
                  <span className="from">
                    De tout cœur,
                    <br />
                    l’équipe Innov’BOULON
                  </span>
                </div>
              </Link>
              <div className="float-chip fc1">
                <span className="ic">🎨</span>
                <div>
                  {galleryThemes.length} vrais fonds
                  <small>Noël · Nouvel An · Nature…</small>
                </div>
              </div>
              <div className="float-chip fc2">
                <span className="ic">🎵</span>
                <div>
                  Statique ou animée<small>Votre message, votre ambiance</small>
                </div>
              </div>
            </div>
          </div>
          <div
            className="hero-choices"
            aria-label="Changer le fond de démonstration"
          >
            {featured.slice(0, 3).map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={previewIndex === index}
                aria-label={`Afficher ${item.name}`}
                onClick={() => setPreviewIndex(index)}
              >
                <img src={item.preview} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </header>
        <div
          className="marquee"
          aria-label="Des cartes pour toutes les occasions"
        >
          <div className="occasion-strip">
            {[
              "Noël",
              "Nouvel An",
              "Anniversaire",
              "Merci",
              "Musique & effets",
              "Innov’BOULON",
            ].map((label) => (
              <span key={label}>
                {label}
                <b aria-hidden="true">✦</b>
              </span>
            ))}
          </div>
        </div>
        <section className="section" id="comment">
          <div className="wrap">
            <span className="kicker">Comment ça marche</span>
            <h2 className="sec-title">
              De l’idée à la carte partagée, en trois gestes.
            </h2>
            <div className="steps">
              {[
                [
                  "01",
                  "Choisissez votre fond",
                  `Découvrez ${galleryThemes.length} fonds de l’application. Sélectionnez celui qui vous plaît, puis ouvrez la personnalisation.`,
                ],
                [
                  "02",
                  "Ajoutez votre touche personnelle",
                  "Écrivez votre message, ajoutez vos photos et des émoticônes. Choisissez une image statique ou une carte animée avec une ambiance musicale et des effets.",
                ],
                [
                  "03",
                  "Téléchargez et partagez",
                  "Enregistrez votre PNG ou votre vidéo. Utilisez le partage de votre appareil lorsqu’il est disponible, ou joignez le fichier dans votre messagerie.",
                ],
              ].map(([number, title, text]) => (
                <article className="step" key={number}>
                  <span className="tag">Étape {number}</span>
                  <div className="num">{number}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="stats">
              <div className="stat">
                <b>{galleryThemes.length}</b>
                <span>fonds à découvrir</span>
              </div>
              <div className="stat">
                <b>9</b>
                <span>ambiances musicales</span>
              </div>
              <div className="stat">
                <b>0 €</b>
                <span>gratuit, sans compte</span>
              </div>
              <div className="stat">
                <b>2 formats</b>
                <span>image ou vidéo</span>
              </div>
            </div>
          </div>
        </section>
        <section className="section gallery-section" id="modeles">
          <div className="wrap">
            <div className="gallery-head">
              <div>
                <span className="kicker">Les vrais modèles</span>
                <h2 className="sec-title">Un fond pour chaque attention.</h2>
                <p className="sec-sub">
                  Ces visuels sont ceux de l’application. Choisissez votre
                  préféré pour commencer.
                </p>
              </div>
              <Link href="/editor" className="btn btn-primary">
                Tous les modèles →
              </Link>
            </div>
            <div className="tpl-grid">
              {featured.map((item) => (
                <Link
                  key={item.id}
                  href="/editor"
                  onClick={() => setSelectedThemeId(item.id)}
                  className="tpl"
                  aria-label={`Choisir ${item.name} — ${item.description}`}
                >
                  <img
                    src={item.preview}
                    alt={item.description}
                    loading="lazy"
                    className="real-background"
                  />
                  <span className="name">
                    {item.name} · {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="section" id="installer">
          <div className="wrap install-section">
            <div>
              <span className="kicker">Toujours à portée de main</span>
              <h2 className="sec-title">
                Votre petit atelier de cartes, sur smartphone.
              </h2>
              <p className="sec-sub">
                Créez depuis votre navigateur ou ajoutez CarteMagique à votre
                écran d’accueil.
              </p>
            </div>
            {isStandalone ? (
              <p className="installed-status">✓ Application installée</p>
            ) : (
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn btn-primary"
              >
                <Download size={19} /> Installer l’application
              </button>
            )}
          </div>
        </section>
        <section className="section" id="soutien">
          <div className="wrap">
            <div className="support-card">
              <div>
                <span className="kicker">Soutenir l’association</span>
                <h2>Un petit geste pour continuer à créer des sourires.</h2>
                <p>
                  Innov’BOULON crée et fait découvrir des applications ludiques
                  et accessibles à tous. Votre soutien nous aide à poursuivre
                  cette aventure associative.
                </p>
                <div className="support-perks">
                  <div>
                    <b>Libre</b>vous choisissez le montant
                  </div>
                  <div>
                    <b>Facultatif</b>CarteMagique reste gratuite
                  </div>
                </div>
              </div>
              <div className="support-cta">
                <a
                  className="btn btn-heart"
                  href="https://www.helloasso.com/associations/innov-boulon/formulaires/2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ❤️ Faire un petit geste
                </a>
                <span className="note">
                  Sur HelloAsso · S’ouvre dans un nouvel onglet
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="section" id="partager" aria-labelledby="share-app-title">
          <div className="wrap share-app-section">
            <div>
              <span className="kicker">Faites découvrir CarteMagique</span>
              <h2 id="share-app-title" className="sec-title">Un petit lien, de belles attentions.</h2>
              <p className="sec-sub">Partagez l’application avec vos proches. Le QR code ouvre directement CarteMagique : parfait pour vos flyers et les ateliers.</p>
              <div className="share-app-actions">
                <button type="button" onClick={copyApplicationLink} className="btn btn-primary">Copier le lien de l’application</button>
                <a href="/share/cartemagique-qr.png" download="CarteMagique-QR.png" className="btn btn-ghost">Télécharger le QR en PNG</a>
                <a href="/share/cartemagique-qr.svg" download="CarteMagique-QR.svg" className="btn btn-ghost">QR en SVG pour l’impression</a>
              </div>
              <label className="share-app-link">Adresse de l’application<input readOnly value="https://cartemagique.innov-boulon.fr/" aria-label="Adresse de l’application à partager" onFocus={(event) => event.currentTarget.select()} /></label>
              <p role="status" className="share-app-status">{copyStatus}</p>
            </div>
            <figure className="share-app-qr"><img src="/share/cartemagique-qr.svg" alt="QR code vers https://cartemagique.innov-boulon.fr/" width="222" height="222" loading="lazy" /><figcaption>Scannez pour créer votre carte</figcaption></figure>
          </div>
        </section>
        <section className="applications-network" aria-labelledby="applications-title">
          <h2 id="applications-title">Découvrez aussi les applications Innov’BOULON</h2>
          <p>Des outils et des découvertes proposés par notre association.</p>
          <nav aria-label="Applications Innov’BOULON">
            <a href="https://delanature.fr" target="_blank" rel="noopener noreferrer">De la Nature ↗</a>
            <a href="https://foodtruck-caen.fr" target="_blank" rel="noopener noreferrer">FoodTruck Caen ↗</a>
            <a href="https://dame-irma.fr" target="_blank" rel="noopener noreferrer">Dame Irma ↗</a>
            <a href="https://studio.innov-boulon.fr" target="_blank" rel="noopener noreferrer">Studio Innov’BOULON ↗</a>
            <a href="https://app.innov-boulon.fr" target="_blank" rel="noopener noreferrer">Plateforme de formation ↗</a>
          </nav>
        </section>
      </main>
      <footer className="landing-footer">
        <Link href="/" className="brand">
          <img className="brand-logo" src="/pwa-192.png" alt="" />
          <span className="brand-name">
            CarteMagique<span>Une application Innov’BOULON</span>
          </span>
        </Link>
        <a
          href="https://innov-boulon.fr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Découvrir les applications Innov’BOULON ↗
        </a>
        <span>Créons de belles attentions, ensemble.</span>
      </footer>
      {showInstallHelp && (
        <div
          className="install-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
        >
          <section className="install-dialog">
            <button
              type="button"
              onClick={() => setShowInstallHelp(false)}
              aria-label="Fermer"
              className="close-install"
            >
              <X size={22} />
            </button>
            <MonitorDown size={32} />
            <h2 id="install-title">Installer CarteMagique</h2>
            <p>
              {isIOS
                ? "Dans Safari, touchez Partager, puis Sur l’écran d’accueil et Ajouter."
                : "Dans le menu de votre navigateur, choisissez Installer l’application ou Ajouter à l’écran d’accueil, si cette option est proposée."}
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowInstallHelp(false)}
            >
              Compris
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
