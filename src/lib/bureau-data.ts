import type { Annonce, Structure } from "@/lib/recrutement";

/* ------------------------------------------------------------------ */
/* Types lus par l'espace Bureau                                      */
/* ------------------------------------------------------------------ */

export type MembreRow = {
  id: string;
  created_at: string;
  nom: string;
  prenom: string | null;
  email: string;
  telephone: string;
  campus: string;
  cycle: string;
  niveau: string;
  source: string | null;
  historique: string | null;
  interets: { structure_id: string }[];
};

export type CandidaturePosteRow = {
  id: string;
  created_at: string;
  annonce_id: string;
  membre_id: string;
  motivation: string;
  experience: string;
  liens: string | null;
  disponibilite: string;
  reponses: string[];
  statut: CandidatureStatut;
  note_interne: string | null;
  annonce: Pick<Annonce, "id" | "titre" | "slug" | "structure_id" | "questions"> | null;
  membre: Pick<
    MembreRow,
    "id" | "nom" | "prenom" | "email" | "telephone" | "campus" | "cycle" | "niveau"
  > | null;
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

export type ResponsableRow = {
  user_id: string;
  structure_id: string;
  email: string;
  ajoute_le: string;
};

/* ------------------------------------------------------------------ */
/* Statuts                                                            */
/* ------------------------------------------------------------------ */

/** Parcours d'une candidature : reçue → entretien (obligatoire) → décision du responsable. */
export const CANDIDATURE_STATUTS = ["Reçue", "Entretien", "Acceptée", "Refusée"] as const;
export type CandidatureStatut = (typeof CANDIDATURE_STATUTS)[number];

export function isCandidatureStatut(v: unknown): v is CandidatureStatut {
  return typeof v === "string" && (CANDIDATURE_STATUTS as readonly string[]).includes(v);
}

export const ANNONCE_STATUT_LABEL: Record<Annonce["statut"], string> = {
  brouillon: "Brouillon",
  publiee: "Publiée",
  fermee: "Fermée",
};

export const STATUT_STYLE: Record<string, string> = {
  Reçue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Entretien: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Acceptée: "bg-green-500/10 text-green-700 dark:text-green-300",
  Refusée: "bg-destructive/10 text-destructive",
  Brouillon: "bg-muted text-muted-foreground",
  Publiée: "bg-green-500/10 text-green-700 dark:text-green-300",
  Fermée: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */

export function fullName(c: { prenom: string | null; nom: string } | null | undefined) {
  if (!c) return "—";
  return [c.prenom, c.nom].filter(Boolean).join(" ");
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

/** Cycle sans le libellé long : « ITT », « Autre : … ». */
export function shortCycle(cycle: string) {
  return cycle.length > 40 ? `${cycle.slice(0, 40)}…` : cycle;
}

export function structureById(structures: Structure[], id: string | null | undefined) {
  return structures.find((s) => s.id === id) ?? null;
}

/** Export CSV (séparateur « ; » + BOM pour une ouverture correcte dans Excel). */
export function downloadCsv(
  filename: string,
  header: string[],
  rows: (string | null | undefined)[][],
) {
  const cell = (v: string | null | undefined) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = [header, ...rows].map((r) => r.map(cell).join(";"));
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string) {
  return navigator.clipboard?.writeText(text) ?? Promise.reject(new Error("clipboard"));
}
