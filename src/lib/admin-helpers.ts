import type { Annonce, Structure } from "./recrutement";
import type {
  CandidaturePosteRow,
  CandidatureStatut,
  MembreRow,
  MessageRow,
  ResponsableRow,
} from "./bureau-data";
import { supabase } from "./supabase";

/*
 * Accès aux données de l'espace Bureau. Les règles RLS de Supabase limitent
 * automatiquement ce que chaque compte voit : le Bureau voit tout, un responsable
 * ne voit que sa ou ses structures.
 */

type Result = { success: boolean; error: string | null };

function db() {
  if (!supabase) throw new Error("Supabase n'est pas configuré");
  return supabase;
}

async function run(promise: PromiseLike<{ error: { message: string } | null }>): Promise<Result> {
  try {
    const { error } = await promise;
    return error ? { success: false, error: error.message } : { success: true, error: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

async function list<T>(
  promise: PromiseLike<{ data: unknown; error: { message: string } | null }>,
  label: string,
): Promise<T[]> {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error(`Lecture impossible (${label}) :`, error.message);
      return [];
    }
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Structures                                                         */
/* ------------------------------------------------------------------ */

/** Toutes les structures (les inactives ne sont visibles que du Bureau). */
export function getAllStructures() {
  return list<Structure>(
    db().from("structures").select("*").order("ordre").order("nom"),
    "structures",
  );
}

export type StructureInput = Omit<Structure, "id">;

export function saveStructure(input: StructureInput, id?: string) {
  return id
    ? run(db().from("structures").update(input).eq("id", id))
    : run(db().from("structures").insert(input));
}

export function getResponsables() {
  return list<ResponsableRow>(db().from("responsables").select("*").order("email"), "responsables");
}

export async function addResponsable(email: string, structureId: string): Promise<Result> {
  try {
    const { data, error } = await db().rpc("ajouter_responsable", {
      p_email: email,
      p_structure: structureId,
    });
    if (error) return { success: false, error: error.message };
    if (data === "compte_introuvable")
      return {
        success: false,
        error:
          "Aucun compte n'existe avec cet e-mail. Créez-le d'abord dans Supabase (Authentication > Users).",
      };
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Erreur inconnue" };
  }
}

export function removeResponsable(userId: string, structureId: string) {
  return run(db().rpc("retirer_responsable", { p_user: userId, p_structure: structureId }));
}

/* ------------------------------------------------------------------ */
/* Membres                                                            */
/* ------------------------------------------------------------------ */

export function getMembres() {
  return list<MembreRow>(
    db()
      .from("membres")
      .select("*, interets:membres_interets(structure_id)")
      .order("created_at", { ascending: false }),
    "membres",
  );
}

/* ------------------------------------------------------------------ */
/* Annonces                                                           */
/* ------------------------------------------------------------------ */

/** Annonces gérées par le compte connecté (tous statuts). */
export async function getAnnoncesGerees(): Promise<Annonce[]> {
  const rows = await list<Annonce>(
    db().from("annonces").select("*").order("updated_at", { ascending: false }),
    "annonces",
  );
  return rows.map((a) => ({ ...a, questions: Array.isArray(a.questions) ? a.questions : [] }));
}

export type AnnonceInput = Omit<Annonce, "id" | "created_at" | "updated_at">;

export function saveAnnonce(input: AnnonceInput, id?: string) {
  return id
    ? run(db().from("annonces").update(input).eq("id", id))
    : run(db().from("annonces").insert(input));
}

export function setAnnonceStatut(id: string, statut: Annonce["statut"]) {
  return run(db().from("annonces").update({ statut }).eq("id", id));
}

export function deleteAnnonce(id: string) {
  return run(db().from("annonces").delete().eq("id", id));
}

/* ------------------------------------------------------------------ */
/* Candidatures aux postes                                            */
/* ------------------------------------------------------------------ */

export async function getCandidaturesPoste(): Promise<CandidaturePosteRow[]> {
  const rows = await list<CandidaturePosteRow>(
    db()
      .from("candidatures_poste")
      .select(
        "*, annonce:annonces(id, titre, slug, structure_id, questions), membre:membres(id, nom, prenom, email, telephone, campus, cycle, niveau)",
      )
      .order("created_at", { ascending: false }),
    "candidatures_poste",
  );
  return rows.map((c) => ({ ...c, reponses: Array.isArray(c.reponses) ? c.reponses : [] }));
}

export function updateCandidaturePoste(
  id: string,
  patch: Partial<{ statut: CandidatureStatut; note_interne: string | null }>,
) {
  return run(db().from("candidatures_poste").update(patch).eq("id", id));
}

/* ------------------------------------------------------------------ */
/* Messages (formulaire Contact)                                      */
/* ------------------------------------------------------------------ */

export function getMessages() {
  return list<MessageRow>(
    db().from("messages").select("*").order("created_at", { ascending: false }),
    "messages",
  );
}

export function updateMessageTraite(messageId: string, traite: boolean) {
  return run(db().from("messages").update({ traite }).eq("id", messageId));
}

export function deleteMessage(messageId: string) {
  return run(db().from("messages").delete().eq("id", messageId));
}
