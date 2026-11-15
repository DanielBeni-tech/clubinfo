import type { Locale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/* Types (tables définies dans supabase/recrutement.sql)              */
/* ------------------------------------------------------------------ */

export type StructureType = "pole" | "bureau";

export type Structure = {
  id: string;
  slug: string;
  nom: string;
  nom_en: string | null;
  description: string;
  description_en: string | null;
  type: StructureType;
  couleur: string;
  ordre: number;
  actif: boolean;
};

export type AnnonceStatut = "brouillon" | "publiee" | "fermee";

export type Annonce = {
  id: string;
  created_at: string;
  updated_at: string;
  structure_id: string;
  slug: string;
  titre: string;
  resume: string;
  missions: string;
  profil: string;
  livrables: string | null;
  outils: string | null;
  rubrique_titre: string | null;
  rubrique_contenu: string | null;
  places: number;
  engagement: string | null;
  date_limite: string | null;
  questions: string[];
  statut: AnnonceStatut;
};

export type AnnonceAvecStructure = Annonce & { structure: Structure | null };

/** Informations demandées à l'adhésion (formulaire /join ou adhésion express). */
export type AdhesionPayload = {
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  campus: string;
  cycle: string;
  niveau: string;
  source?: string;
  interets?: string[]; // slugs des pôles
  engagement_reglement: boolean;
};

export type CandidaturePayload = {
  motivation: string;
  experience: string;
  liens: string;
  disponibilite: string;
  reponses: string[];
};

export type ResultatAdhesion = "ok" | "deja_membre";
export type ResultatCandidature = "ok" | "adhesion_requise" | "deja_candidat" | "annonce_fermee";

/* ------------------------------------------------------------------ */
/* Couleurs des structures (classes statiques pour Tailwind)          */
/* ------------------------------------------------------------------ */

export const COULEURS = {
  amber: { dot: "bg-amber-500", badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300" },
  sky: { dot: "bg-sky-500", badge: "bg-sky-500/10 text-sky-800 dark:text-sky-300" },
  fuchsia: {
    dot: "bg-fuchsia-500",
    badge: "bg-fuchsia-500/10 text-fuchsia-800 dark:text-fuchsia-300",
  },
  emerald: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  },
  violet: { dot: "bg-violet-500", badge: "bg-violet-500/10 text-violet-800 dark:text-violet-300" },
  rose: { dot: "bg-rose-500", badge: "bg-rose-500/10 text-rose-800 dark:text-rose-300" },
  teal: { dot: "bg-teal-500", badge: "bg-teal-500/10 text-teal-800 dark:text-teal-300" },
  orange: { dot: "bg-orange-500", badge: "bg-orange-500/10 text-orange-800 dark:text-orange-300" },
  indigo: { dot: "bg-indigo-500", badge: "bg-indigo-500/10 text-indigo-800 dark:text-indigo-300" },
  slate: { dot: "bg-slate-500", badge: "bg-slate-500/10 text-slate-700 dark:text-slate-300" },
} as const;

export type CouleurKey = keyof typeof COULEURS;
export const COULEUR_KEYS = Object.keys(COULEURS) as CouleurKey[];

export function couleur(key: string | null | undefined) {
  return COULEURS[(key ?? "slate") as CouleurKey] ?? COULEURS.slate;
}

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */

export function structureNom(s: Pick<Structure, "nom" | "nom_en"> | null, locale: Locale = "fr") {
  if (!s) return "";
  return locale === "en" && s.nom_en ? s.nom_en : s.nom;
}

export function structureDescription(
  s: Pick<Structure, "description" | "description_en">,
  locale: Locale = "fr",
) {
  return locale === "en" && s.description_en ? s.description_en : s.description;
}

/** Date du jour au format AAAA-MM-JJ (fuseau du navigateur). */
export function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Une annonce accepte des candidatures si elle est publiée et que sa date limite n'est pas passée. */
export function annonceOuverte(a: Pick<Annonce, "statut" | "date_limite">) {
  return a.statut === "publiee" && (!a.date_limite || a.date_limite >= today());
}

export function formatDateLimite(date: string, locale: Locale = "fr") {
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
  });
}

/** Transforme un intitulé en identifiant d'URL : « Chargé de com' » → « charge-de-com ». */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function client() {
  if (!supabase) throw new Error("Supabase n'est pas configuré.");
  return supabase;
}

function normalizeAnnonce<T extends { questions: unknown }>(row: T) {
  return {
    ...row,
    questions: Array.isArray(row.questions) ? (row.questions as string[]) : [],
  };
}

/* ------------------------------------------------------------------ */
/* Lecture publique                                                   */
/* ------------------------------------------------------------------ */

/** Structures actives, dans l'ordre d'affichage. */
export async function getStructures(): Promise<Structure[]> {
  const { data, error } = await client()
    .from("structures")
    .select("*")
    .eq("actif", true)
    .order("ordre")
    .order("nom");
  if (error) throw new Error(error.message);
  return (data ?? []) as Structure[];
}

/** Annonces publiées dont la date limite n'est pas passée. */
export async function getAnnoncesOuvertes(): Promise<AnnonceAvecStructure[]> {
  const { data, error } = await client()
    .from("annonces")
    .select("*, structure:structures(*)")
    .eq("statut", "publiee")
    .or(`date_limite.is.null,date_limite.gte.${today()}`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizeAnnonce(row) as AnnonceAvecStructure);
}

/** Une annonce publiée ou fermée, par son identifiant d'URL. */
export async function getAnnonce(slug: string): Promise<AnnonceAvecStructure | null> {
  const { data, error } = await client()
    .from("annonces")
    .select("*, structure:structures(*)")
    .eq("slug", slug)
    .in("statut", ["publiee", "fermee"])
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? (normalizeAnnonce(data) as AnnonceAvecStructure) : null;
}

/* ------------------------------------------------------------------ */
/* Formulaires publics (fonctions SQL sécurisées)                     */
/* ------------------------------------------------------------------ */

export async function adherer(p: AdhesionPayload): Promise<ResultatAdhesion> {
  const { data, error } = await client().rpc("adherer", { p });
  if (error) throw new Error(error.message);
  return data as ResultatAdhesion;
}

export async function estMembre(email: string): Promise<boolean> {
  const { data, error } = await client().rpc("est_membre", { p_email: email });
  if (error) throw new Error(error.message);
  return data === true;
}

export async function postuler(args: {
  annonceId: string;
  email: string;
  candidature: CandidaturePayload;
  adhesion?: AdhesionPayload | null;
}): Promise<ResultatCandidature> {
  const { data, error } = await client().rpc("postuler", {
    p_annonce: args.annonceId,
    p_email: args.email,
    p_candidature: args.candidature,
    p_adhesion: args.adhesion ?? null,
  });
  if (error) throw new Error(error.message);
  return data as ResultatCandidature;
}
