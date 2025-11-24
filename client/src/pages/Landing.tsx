import { Link } from 'wouter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Logo en haut */}
      <div className="absolute top-8 left-8 z-20">
        <img src="/logo-innovboulon.jpg" alt="Innov'BOULON" className="h-16 w-16 rounded-full shadow-lg" />
      </div>

      {/* Contenu principal */}
      <div className="z-10 text-center max-w-2xl animate-fade-in">
        <h1 
          className="text-5xl md:text-7xl font-bold mb-4 font-serif bg-gradient-to-r from-white via-amber-300 to-red-500 bg-clip-text text-transparent"
        >
          Joyeux Noël
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          de la part de…
        </p>
        <p className="text-lg text-gray-400 mb-10">
          Créez une carte unique pour célébrer la fin de l'année.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/editor">
            <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
              ✨ Créer ma carte
            </button>
          </Link>
        </div>
      </div>

      {/* Footer avec crédit */}
      <div className="absolute bottom-8 z-20 text-center">
        <p className="text-sm text-gray-400">
          Offert par <span className="font-bold text-cyan-400">Innov'BOULON</span> • Développé par <span className="font-bold text-white">Manus</span>
        </p>
      </div>
    </div>
  );
}
