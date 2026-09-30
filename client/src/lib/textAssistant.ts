export type TextOccasion =
  | "noel"
  | "nouvelAn"
  | "anniversaire"
  | "merci"
  | "amour"
  | "felicitations"
  | "naissance"
  | "mariage"
  | "retablissement"
  | "personnel"
  | "professionnel";

export type TextRecipient = "partenaire" | "famille" | "ami" | "enfant" | "collegue" | "equipe" | "autre";
export type TextTone = "chaleureux" | "tendre" | "elegant" | "drole" | "poetique" | "professionnel";
export type TextLength = "court" | "moyen" | "developpe";

export interface TextAssistantRequest {
  occasion: TextOccasion;
  recipient: TextRecipient;
  name: string;
  tone: TextTone;
  length: TextLength;
}

export interface TextSuggestion {
  id: string;
  label: string;
  text: string;
  characterCount: number;
  estimatedLines: number;
}

export const OCCASION_LABELS: Record<TextOccasion, string> = {
  noel: "Noël",
  nouvelAn: "Nouvel An",
  anniversaire: "Anniversaire",
  merci: "Remerciement",
  amour: "Amour",
  felicitations: "Félicitations",
  naissance: "Naissance",
  mariage: "Mariage",
  retablissement: "Rétablissement",
  personnel: "Juste pour toi",
  professionnel: "Vœux professionnels",
};

export const RECIPIENT_LABELS: Record<TextRecipient, string> = {
  partenaire: "Partenaire",
  famille: "Famille",
  ami: "Ami·e",
  enfant: "Enfant",
  collegue: "Collègue / client",
  equipe: "Équipe",
  autre: "Autre",
};

export const TONE_LABELS: Record<TextTone, string> = {
  chaleureux: "Chaleureux",
  tendre: "Tendre",
  elegant: "Élégant",
  drole: "Drôle",
  poetique: "Poétique",
  professionnel: "Professionnel",
};

export const LENGTH_LABELS: Record<TextLength, string> = {
  court: "Court",
  moyen: "Moyen",
  developpe: "Développé",
};

const openings: Record<TextOccasion, string[]> = {
  noel: ["Joyeux Noël", "Très belles fêtes", "En cette douce période de Noël"],
  nouvelAn: ["Belle année", "Meilleurs vœux", "Pour cette nouvelle année"],
  anniversaire: ["Très joyeux anniversaire", "Une très belle journée pour toi", "Aujourd'hui, c'est ta fête"],
  merci: ["Un grand merci", "Merci du fond du cœur", "Avec toute ma reconnaissance"],
  amour: ["Pour toi, avec tout mon amour", "Mon plus beau cadeau, c'est toi", "À nous deux"],
  felicitations: ["Toutes mes félicitations", "Bravo pour cette belle réussite", "Quelle merveilleuse nouvelle"],
  naissance: ["Bienvenue à ce merveilleux petit bonheur", "Une douce nouvelle est arrivée", "Félicitations pour cette belle naissance"],
  mariage: ["Tous mes vœux de bonheur", "À votre si belle aventure", "Que cette union soit lumineuse"],
  retablissement: ["Je pense très fort à toi", "Prends bien soin de toi", "Un petit mot pour t'envoyer du courage"],
  personnel: ["Une pensée rien que pour toi", "Avec toute mon affection", "Juste un petit mot pour toi"],
  professionnel: ["Nous vous adressons nos meilleurs vœux", "Toute l'équipe vous remercie", "Avec nos sincères salutations"],
};

const wishes: Record<TextOccasion, string[]> = {
  noel: ["Que la douceur, les rires et la lumière remplissent votre foyer.", "Que cette parenthèse soit pleine de bonheur partagé.", "Profitez de chaque instant auprès de ceux qui comptent."],
  nouvelAn: ["Que cette année vous apporte santé, sérénité et de beaux projets.", "Qu'elle soit riche en joies, en rencontres et en réussites.", "Que chaque jour ouvre une nouvelle raison de sourire."],
  anniversaire: ["Que cette nouvelle année de vie soit aussi belle que vous.", "Que vos envies les plus chères trouvent leur chemin.", "Aujourd'hui, tout est permis : sourires, gâteaux et beaux souvenirs."],
  merci: ["Votre présence et votre soutien comptent énormément.", "Votre attention a rendu les choses plus belles.", "Je mesure la chance de pouvoir compter sur vous."],
  amour: ["Merci de rendre chaque jour plus doux et plus lumineux.", "Que notre complicité continue de grandir, simplement.", "Je vous choisis encore, aujourd'hui et demain."],
  felicitations: ["Cette réussite vous ressemble : elle est belle et méritée.", "Savourez pleinement ce moment que vous avez si bien construit.", "La suite promet d'être tout aussi inspirante."],
  naissance: ["Que votre famille se remplisse de tendresse, de rires et de merveilleux instants.", "Une nouvelle histoire commence, pleine de douceur.", "Que ce petit trésor illumine vos journées."],
  mariage: ["Que votre complicité vous accompagne dans tous les beaux jours à venir.", "Que votre bonheur grandisse au fil de chaque aventure partagée.", "Une très belle page s'ouvre pour vous deux."],
  retablissement: ["Chaque petit pas compte : je vous envoie toute mon énergie.", "J'espère que les jours à venir seront plus doux et plus légers.", "Reposez-vous et laissez le temps faire son chemin."],
  personnel: ["J'espère que ces quelques mots vous apporteront un peu de chaleur.", "Parce que vous méritez de belles attentions, tout simplement.", "Gardez précieusement cette pensée qui vous est destinée."],
  professionnel: ["Nous vous souhaitons une année de confiance, d'élan et de réussites partagées.", "Votre confiance nous inspire et nous vous en remercions sincèrement.", "Nous sommes heureux de poursuivre cette belle collaboration à vos côtés."],
};

const toneDetails: Record<TextTone, string[]> = {
  chaleureux: ["Avec toute mon affection.", "De tout cœur."],
  tendre: ["Je vous embrasse bien fort.", "Avec une immense tendresse."],
  elegant: ["Avec mes pensées les plus sincères.", "Très chaleureusement."],
  drole: ["Et n'oubliez pas : aujourd'hui, les calories ne comptent pas !", "La bonne humeur est officiellement obligatoire."],
  poetique: ["Que la lumière des petits bonheurs vous accompagne.", "Que chaque jour fasse éclore une nouvelle étincelle."],
  professionnel: ["Bien cordialement.", "Avec toute notre considération."],
};

const recipientDetails: Record<TextRecipient, string[]> = {
  partenaire: ["Mon amour", "À la personne qui partage ma vie"],
  famille: ["À toute la famille", "À ceux qui me sont si chers"],
  ami: ["Pour une personne qui compte beaucoup", "À une belle amitié"],
  enfant: ["Pour une petite étoile", "Pour une personne formidable"],
  collegue: ["Merci pour votre engagement au quotidien", "Au plaisir de continuer cette belle aventure"],
  equipe: ["À toute l'équipe", "Ensemble, nous faisons de belles choses"],
  autre: ["Pour vous", "Avec une pensée particulière"],
};

const maxCharacters: Record<TextLength, number> = { court: 70, moyen: 130, developpe: 190 };
const targetLineWidth: Record<TextLength, number> = { court: 26, moyen: 30, developpe: 33 };

function hash(value: string) {
  let hashValue = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hashValue ^= value.charCodeAt(index);
    hashValue = Math.imul(hashValue, 16777619);
  }
  return hashValue >>> 0;
}

function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let output = value;
    output = Math.imul(output ^ (output >>> 15), output | 1);
    output ^= output + Math.imul(output ^ (output >>> 7), output | 61);
    return ((output ^ (output >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(values: T[], rng: () => number) {
  return values[Math.floor(rng() * values.length)] ?? values[0];
}

function tidyName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, 32);
}

function wrap(text: string, width: number) {
  return text
    .split("\n")
    .flatMap((paragraph) => {
      const words = paragraph.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = "";
      words.forEach((word) => {
        const next = line ? `${line} ${word}` : word;
        if (next.length > width && line) {
          lines.push(line);
          line = word;
        } else {
          line = next;
        }
      });
      if (line) lines.push(line);
      return lines;
    })
    .join("\n");
}

function compact(text: string, maximum: number) {
  if (text.length <= maximum) return text;
  const sentence = text.split(/(?<=[.!?])\s/).slice(0, 2).join(" ");
  if (sentence.length <= maximum) return sentence;
  return `${text.slice(0, maximum - 1).replace(/[,:;\s]+$/, "")}…`;
}

export function inferOccasion(themeId: string): TextOccasion {
  if (themeId.startsWith("noel")) return "noel";
  if (themeId.startsWith("nouvel-an")) return "nouvelAn";
  if (themeId.startsWith("pro")) return "professionnel";
  return "personnel";
}

export function createTextSuggestions(request: TextAssistantRequest, reroll = 0): TextSuggestion[] {
  const normalizedName = tidyName(request.name);
  const base = JSON.stringify({ ...request, name: normalizedName, reroll });
  const variants = ["Chaleureux", "Plus concis", "Plus personnel"];

  return variants.map((label, index) => {
    const rng = random(hash(`${base}-${index}`));
    const formal = request.tone === "professionnel" || request.occasion === "professionnel";
    const greeting = pick(openings[request.occasion], rng);
    const recipient = normalizedName
      ? `${greeting}, ${normalizedName}${formal ? "," : " !"}`
      : `${greeting}${formal ? "," : " !"}`;
    const detail = pick(recipientDetails[request.recipient], rng);
    const wish = pick(wishes[request.occasion], rng);
    const closing = pick(toneDetails[formal ? "professionnel" : request.tone], rng);
    const sentences = request.length === "court"
      ? [recipient, index === 1 ? detail : wish]
      : request.length === "moyen"
        ? [recipient, index === 2 ? detail : wish, closing]
        : [recipient, detail, wish, closing];
    const text = wrap(compact(sentences.join(" "), maxCharacters[request.length]), targetLineWidth[request.length]);

    return {
      id: `${reroll}-${index}`,
      label,
      text,
      characterCount: text.replace(/\n/g, " ").length,
      estimatedLines: text.split("\n").length,
    };
  });
}
