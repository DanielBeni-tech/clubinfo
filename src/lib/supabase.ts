import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase du site (projet Supabase du club, géré sur supabase.com).
 * Config via variables d'environnement Vercel :
 *   VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... (ou la anon key JWT)
 *
 * Si non configuré (ex. aperçu local), `supabase` est null et les
 * formulaires retombent sur une simple confirmation à l'écran.
 */
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
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
  // Ne jamais faire confiance au frontend pour le statut — forcé côté service
  statut?: string;
  // Honeypot (doit rester vide) — non persisté
  website?: string;
};

export async function saveCandidature(data: Candidature): Promise<{ id?: string }> {
  if (!supabase || !url || !key) {
    throw new Error(
      "Service de candidature temporairement indisponible. Veuillez réessayer plus tard.",
    );
  }

  // Appel sécurisé via Edge Function — le statut est forcé côté serveur
  // On passe par supabase.functions.invoke pour gérer automatiquement l'auth anon
  const { data: resData, error } = await supabase.functions.invoke(
    "submit-candidature",
    {
      body: data,
    },
  );

  if (error) {
    // supabase-js encapsule l'erreur HTTP — on tente d'extraire le message serveur
    const context = (error as unknown as { context?: { response?: Response } }).context;
    let serverMessage: string | undefined;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = (resData as any) ?? (context?.response ? await (context.response as Response).json?.() : null);
      if (body && typeof body.error === "string") serverMessage = body.error;
      else if (body && body.details) serverMessage = "Veuillez corriger les champs indiqués.";
    } catch {
      // ignore
    }

    // Mapping des codes HTTP courants vers messages utilisateur
    const status = (error as unknown as { status?: number }).status;
    if (status === 400) throw new Error(serverMessage ?? "Données invalides. Veuillez corriger le formulaire.");
    if (status === 409) throw new Error(serverMessage ?? "Une candidature identique a déjà été reçue récemment.");
    if (status === 429) throw new Error(serverMessage ?? "Trop de tentatives. Veuillez réessayer plus tard.");
    if (status === 413) throw new Error("Données trop volumineuses.");
    throw new Error(serverMessage ?? error.message ?? "Erreur lors de l'envoi. Veuillez réessayer.");
  }

  // Succès — la Edge Function retourne { success: true, id }
  // Même le honeypot renvoie 201 succès sans insertion (comportement attendu)
  return resData as { id?: string };
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
