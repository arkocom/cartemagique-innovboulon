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

      // Une mise à jour ne doit pas interrompre une carte en cours d’édition.
      let hasController = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!hasController) {
          hasController = true;
          return;
        }
        window.dispatchEvent(new Event("cartemagique:update-ready"));
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
