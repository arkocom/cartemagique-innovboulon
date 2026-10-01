export default function SupportAssociation() {
  return (
    <aside aria-label="Soutenir Innov’BOULON" className="mx-auto my-6 max-w-2xl rounded-2xl border border-slate-500/30 bg-background p-4 text-center text-foreground">
      <p className="mb-3 text-sm leading-relaxed">CarteMagique vous plaît ? Un petit geste aide Innov’BOULON à continuer de créer et de faire découvrir des applications ludiques accessibles à tous.</p>
      <a href="https://www.helloasso.com/associations/innov-boulon/formulaires/2" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">❤️ Faire un petit geste pour l’association</a>
      <details className="mt-4 text-left text-sm"><summary className="min-h-11 cursor-pointer py-2 font-semibold">Découvrir Innov’BOULON et ses applications</summary><p className="mt-2 leading-relaxed">Notre association fait découvrir le numérique et l’intelligence artificielle avec des outils accessibles et des ateliers.</p><div className="mt-3 flex flex-wrap gap-3">{[
        ['L’association', 'https://innov-boulon.fr'], ['Formations', 'https://app.innov-boulon.fr'], ['Studio créatif', 'https://studio.innov-boulon.fr'], ['De la Nature', 'https://delanature.fr'], ['Foodtrucks à Caen', 'https://foodtruck-caen.fr'], ['Dame Irma', 'https://dame-irma.fr'],
      ].map(([name, href]) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="min-h-11 rounded-lg border border-slate-500/30 px-3 py-3 underline">{name} ↗</a>)}</div></details>
      <p className="mt-2 text-xs text-muted-foreground">Don libre et facultatif sur HelloAsso · S’ouvre dans un nouvel onglet.</p>
    </aside>
  );
}
