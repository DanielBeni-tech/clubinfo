import { joinForm } from "@/data/club";

/** Ligne de la table `candidatures` telle que lue par le Bureau. */
export type CandidatureRow = {
  id: string;
  created_at: string;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string;
  campus: string;
  cycle: string;
  regime: string | null;
  niveau: string | null;
  option: string | null;
  domaine: string;
  niveau_experience: string | null;
  pole: string;
  motivation: string | null;
  engagement_reglement: boolean;
  statut: string;
};

export type MessageRow = {
  id: string;
  created_at: string;
  nom: string;
  email: string;
  telephone: string | null;
  organisation: string | null;
  categorie: string | null;
  sujet: string;
  message: string;
  traite: boolean;
};

/* ------------------------------------------------------------------ */
/* Pôles                                                              */
/* ------------------------------------------------------------------ */

export type PoleSlug = "innovation" | "developpement" | "communication" | "decouverte" | "autre";

type PoleInfo = { slug: PoleSlug; label: string; short: string; dot: string };

const POLE_STYLE: Record<PoleSlug, { short: string; dot: string }> = {
  innovation: { short: "Innovation", dot: "bg-amber-500" },
  developpement: { short: "Développement", dot: "bg-sky-500" },
  communication: { short: "Communication", dot: "bg-fuchsia-500" },
  decouverte: { short: "Découverte", dot: "bg-emerald-500" },
  autre: { short: "Autre", dot: "bg-muted-foreground" },
};

const SLUG_BY_VALUE: Record<string, PoleSlug> = {
  "Pôle Innovation & Projets": "innovation",
  "Pôle Développement": "developpement",
  "Pôle Communication": "communication",
  "Découvrir avant de choisir": "decouverte",
  // Valeur utilisée par l'ancienne version du formulaire
  "Découverte & Ateliers": "decouverte",
};

/** Les 3 pôles + « découvrir avant de choisir », dans l'ordre du formulaire. */
export const POLES: PoleInfo[] = joinForm.poles.map((p) => {
  const slug = SLUG_BY_VALUE[p.value] ?? "autre";
  return { slug, label: p.label.fr, ...POLE_STYLE[slug] };
});

export function poleSlug(value: string): PoleSlug {
  return SLUG_BY_VALUE[value] ?? "autre";
}

export function poleInfo(slug: PoleSlug): PoleInfo {
  return (
    POLES.find((p) => p.slug === slug) ?? { slug: "autre", label: "Autre", ...POLE_STYLE.autre }
  );
}

export function isPoleSlug(v: unknown): v is PoleSlug {
  return typeof v === "string" && v in POLE_STYLE;
}

/* ------------------------------------------------------------------ */
/* Statuts                                                            */
/* ------------------------------------------------------------------ */

export const STATUTS = ["Nouveau", "Contacté", "Accepté", "Refusé"] as const;
export type Statut = (typeof STATUTS)[number];

export function isStatut(v: unknown): v is Statut {
  return typeof v === "string" && (STATUTS as readonly string[]).includes(v);
}

export const STATUT_STYLE: Record<string, string> = {
  Nouveau: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Contacté: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Accepté: "bg-green-500/10 text-green-700 dark:text-green-300",
  Refusé: "bg-destructive/10 text-destructive",
};

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */

export function fullName(c: Pick<CandidatureRow, "prenom" | "nom">) {
  return [c.prenom, c.nom].filter(Boolean).join(" ");
}

export function interestsOf(c: Pick<CandidatureRow, "domaine">): string[] {
  return c.domaine
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Lien wa.me à partir d'un numéro saisi librement (indicatif 237 ajouté si absent). */
export function whatsappLink(phone: string): string | null {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 9) digits = `237${digits}`;
  return digits.length >= 10 ? `https://wa.me/${digits}` : null;
}

export function formatDate(iso: string, withTime = false) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function daysAgo(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

/** Export CSV (séparateur « ; » + BOM pour une ouverture correcte dans Excel). */
export function downloadCandidaturesCsv(rows: CandidatureRow[], filename: string) {
  const header = [
    "Date",
    "Nom",
    "Prénom",
    "E-mail",
    "Téléphone",
    "Campus",
    "Formation",
    "Niveau",
    "Option",
    "Centres d'intérêt",
    "Pôle souhaité",
    "Expérience",
    "Motivation / idée / disponibilités",
    "Statut",
  ];
  const cell = (v: string | null | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((c) =>
    [
      formatDate(c.created_at),
      c.nom,
      c.prenom,
      c.email,
      c.telephone,
      c.campus,
      c.cycle,
      c.niveau,
      c.option,
      interestsOf(c).join(", "),
      poleInfo(poleSlug(c.pole)).label,
      c.niveau_experience,
      c.motivation,
      c.statut,
    ]
      .map(cell)
      .join(";"),
  );
  const blob = new Blob(["﻿" + [header.map(cell).join(";"), ...lines].join("\r\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
