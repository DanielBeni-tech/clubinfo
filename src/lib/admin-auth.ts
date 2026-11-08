import { useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/** Chemin de la page de connexion de l'espace Bureau. */
export const BUREAU_LOGIN = "/espace-bureau/login" as const;

/**
 * Vérifie côté base (fonction SQL `is_bureau_admin`) que l'utilisateur connecté
 * fait partie du Bureau. C'est la base qui protège les données (RLS) :
 * ce contrôle sert seulement à afficher ou non l'interface.
 */
export async function isBureauAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_bureau_admin");
  if (error) {
    console.error("Vérification des droits Bureau impossible :", error.message);
    return false;
  }
  return data === true;
}

/**
 * À utiliser en tête de chaque page de l'espace Bureau : redirige vers la
 * connexion si personne n'est connecté ou si le compte n'est pas membre du Bureau.
 */
export function useBureauGuard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const ok = session ? await isBureauAdmin() : false;
      if (cancelled) return;
      if (!session || !ok) {
        await navigate({ to: BUREAU_LOGIN });
        return;
      }
      setUser(session.user);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { user, ready };
}
