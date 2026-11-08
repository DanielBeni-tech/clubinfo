import { supabase } from "./supabase";

/**
 * Met à jour le statut d'une candidature
 * @param candidatureId UUID de la candidature
 * @param newStatus Nouveau statut
 * @returns { success, error }
 */
export async function updateCandidatureStatus(candidatureId: string, newStatus: string) {
  if (!supabase) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  const { error } = await supabase
    .from("candidatures")
    .update({ statut: newStatus })
    .eq("id", candidatureId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Récupère toutes les candidatures avec filtres optionnels
 * @param status Filtre par statut (optionnel)
 * @returns Array de candidatures
 */
export async function getCandidatures(status?: string) {
  if (!supabase) {
    return [];
  }

  let query = supabase.from("candidatures").select("*").order("created_at", { ascending: false });

  if (status) {
    query = query.eq("statut", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return [];
  }

  return data || [];
}

/**
 * Récupère une candidature par ID
 * @param candidatureId UUID de la candidature
 * @returns Candidature ou null
 */
export async function getCandidatureById(candidatureId: string) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("candidatures")
    .select("*")
    .eq("id", candidatureId)
    .single();

  if (error) {
    console.error("Erreur lors de la récupération de la candidature:", error);
    return null;
  }

  return data;
}

/**
 * Récupère tous les messages
 * @param traiteOnly Filtre par statut traité (optionnel)
 * @returns Array de messages
 */
export async function getMessages(traiteOnly?: boolean) {
  if (!supabase) {
    return [];
  }

  let query = supabase.from("messages").select("*").order("created_at", { ascending: false });

  if (traiteOnly !== undefined) {
    query = query.eq("traite", traiteOnly);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return [];
  }

  return data || [];
}

/**
 * Marque un message comme traité
 * @param messageId UUID du message
 * @param traite true ou false
 * @returns { success, error }
 */
export async function updateMessageTraite(messageId: string, traite: boolean) {
  if (!supabase) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  const { error } = await supabase
    .from("messages")
    .update({ traite })
    .eq("id", messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Supprime un message
 * @param messageId UUID du message
 * @returns { success, error }
 */
export async function deleteMessage(messageId: string) {
  if (!supabase) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  const { error } = await supabase.from("messages").delete().eq("id", messageId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
