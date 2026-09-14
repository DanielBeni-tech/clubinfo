import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase du site (projet Supabase du club, géré sur supabase.com).
 * Config via variables d'environnement Vercel :
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... (ou la anon key JWT)
 *
 * Si la configuration est absente, les actions dépendantes de Supabase
 * affichent une erreur explicite à l'utilisateur.
 */
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
      })
    : null;

export type Candidature = {
  nom: string;
  prenom?: string | null;
  email: string;
  telephone: string;
  campus: string;
  cycle: string;
  regime: string;
  niveau: string;
  option: string;
  domaine: string;
  niveau_experience?: string | null;
  pole: string;
  motivation?: string | null;
  engagement_reglement?: boolean;
};

export async function saveCandidature(data: Candidature): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("candidatures").insert(data);
  if (error) throw new Error(error.message);
}

export type Message = {
  nom: string;
  email: string;
  telephone?: string | null;
  organisation?: string | null;
  categorie?: string | null;
  sujet: string;
  message: string;
};

export async function saveMessage(data: Message): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("messages").insert(data);
  if (error) throw new Error(error.message);
}
