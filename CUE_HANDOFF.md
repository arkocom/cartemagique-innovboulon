# CarteMagique — Handoff Cue

## Objectif

CarteMagique est une PWA React mobile-first pour créer et partager des cartes de vœux personnalisées pour **Innov'BOULON**.

## Démarrage local

```bash
pnpm install
pnpm run dev
```

Validation attendue avant tout changement :

```bash
pnpm run check
pnpm run build
```

## Pile technique

- React 19 + TypeScript + Vite + Tailwind 4
- Frontend statique uniquement ; ne pas modifier `server/`
- Canvas HTML pour le rendu, l’export PNG et le partage
- PWA : `client/public/manifest.json`, `client/public/sw.js`, enregistrement dans `client/src/main.tsx`

## Parcours à préserver

1. Choisir un fond par catégorie ; les galeries utilisent des miniatures légères.
2. Personnaliser texte, photos, collage et stickers.
3. Sur smartphone : barre fixe **Texte · Photo · Style · Finaliser**.
4. Générer un message via **Assistant de texte** : trois propositions privées, créées localement, puis insertion dans le bloc ou ajout d’un bloc.
5. Exporter, télécharger ou partager la carte PNG.

## Contraintes produit

- Interface française, en priorité smartphone.
- Ne pas utiliser de crédits de génération visuelle sans validation explicite.
- Conserver la lisibilité du texte, au-dessus des images.
- Pas de backend applicatif ni de clé API dans le navigateur.
- Les fonds sont stockés sous `/manus-storage/...`; le proxy Vite est défini dans `vite.config.ts` pour le développement et l’aperçu.
- Toute modification PWA doit incrémenter la version de cache dans `client/public/sw.js`.

## Vérifications clés

- L’éditeur charge une miniature dans la galerie et le fond HD dans le canvas.
- Export PNG juste après une modification : le dernier rendu est bien exporté.
- Collage sans photo : aucun layout indisponible ne doit être proposé.
- Cadre blanc sur mobile : visible dès l’activation.
- PWA installée : shell et images ne doivent jamais être servis comme HTML depuis le cache.

## État de livraison

Le dépôt est prêt à être importé dans Cue. Pour le partager, poussez ce dépôt vers le dépôt Git fourni par Cue, puis donnez à Cue l’URL du dépôt et ce fichier de consignes.
