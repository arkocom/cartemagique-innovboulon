import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Landing from "./pages/Landing";
import EditorWithImages from "./pages/EditorWithImages";
import HelpModal from "@/components/HelpModal";

const UPDATE_READY_EVENT = "cartemagique:update-ready";

function ServiceWorkerUpdateNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showNotice = () => setIsVisible(true);
    window.addEventListener(UPDATE_READY_EVENT, showNotice);
    return () => window.removeEventListener(UPDATE_READY_EVENT, showNotice);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 top-4 z-[100] mx-auto max-w-xl rounded-xl border border-amber-400/60 bg-slate-950/95 p-4 text-white shadow-2xl"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Une mise à jour est prête.</p>
          <p className="mt-1 text-sm text-slate-300">
            La page ne sera pas rechargée automatiquement. Actualisez quand votre carte sera prête.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            Actualiser
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/editor" component={EditorWithImages} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <div className="dark">
        <TooltipProvider>
          <Toaster />
          <ServiceWorkerUpdateNotice />
          <Router />
          <HelpModal />
        </TooltipProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
