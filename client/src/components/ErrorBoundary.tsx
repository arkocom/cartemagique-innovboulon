import { cn } from "@/lib/utils";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Erreur d’affichage CarteMagique :", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-5 bg-slate-950 text-white">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-xl font-bold">Un affichage a été interrompu</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">Vos créations enregistrées sur cet appareil ne sont pas supprimées. Rechargez l&apos;application pour continuer.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => window.location.reload()} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 font-bold text-slate-950 transition active:scale-[0.98] hover:bg-amber-400")}>
                <RotateCcw size={17} /> Recharger
              </button>
              <button onClick={() => window.location.assign("/")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 px-4 font-semibold text-white transition active:scale-[0.98] hover:bg-white/10">
                <Home size={17} /> Accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
