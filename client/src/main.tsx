import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        updateViaCache: "none",
      });

      // Vérifie une mise à jour à chaque retour dans l'application.
      const refreshUpdate = () => registration.update().catch(() => undefined);
      window.addEventListener("focus", refreshUpdate);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") refreshUpdate();
      });

      // Le nouveau service worker se remplace immédiatement et recharge la page une seule fois.
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    } catch (error) {
      console.warn("Service worker indisponible :", error);
    }
  });
} else if ("serviceWorker" in navigator && import.meta.env.DEV) {
  // Une prévisualisation est temporaire : elle ne doit jamais rester installée ou conserver un ancien cache.
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
    caches.keys().then((names) => {
      names
        .filter((name) => name.startsWith("cartemagique-"))
        .forEach((name) => caches.delete(name));
    });
  });
}
