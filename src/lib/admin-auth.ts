import { useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

/** Chemin de la page de connexion de l'espace Bureau. */
export const BUREAU_LOGIN = "/espace-bureau/login" as const;
/** Page où l'on choisit son mot de passe après un lien de réinitialisation. */
export const BUREAU_PASSWORD = "/espace-bureau/mot-de-passe" as const;

/**
 * Rôle de l'utilisateur connecté :
 *  - bureau : membre du Bureau (table bureau_admins), voit et gère tout ;
 *  - structures : identifiants des structures dont il est responsable (chef de pôle…).
 */
export type EspaceRole = { bureau: boolean; structures: string[] };

export const NO_ROLE: EspaceRole = { bureau: false, structures: [] };

export function hasAccess(role: EspaceRole) {
  return role.bureau || role.structures.length > 0;
}

/**
 * Lit le rôle côté base (fonction SQL `mon_role`). C'est la base qui protège
 * les données (RLS) : ce contrôle sert seulement à afficher ou non l'interface.
 */
export async function getRole(): Promise<EspaceRole> {
  if (!supabase) return NO_ROLE;
  const { data, error } = await supabase.rpc("mon_role");
  if (!error && data && typeof data === "object") {
    const d = data as { bureau?: unknown; structures?: unknown };
    return {
      bureau: d.bureau === true,
      structures: Array.isArray(d.structures) ? (d.structures as string[]) : [],
    };
  }
  // Base pas encore migrée (fonction mon_role absente) : ancien contrôle Bureau seul
  return { bureau: await isBureauAdmin(), structures: [] };
}

/** Membre du Bureau (fonction SQL `is_bureau_admin`). */
export async function isBureauAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.rpc("is_bureau_admin");
  if (error) {
    console.error("Vérification des droits Bureau impossible :", error.message);
    return false;
  }
  return data === true;
}

/** A accès à l'espace (Bureau ou responsable d'au moins une structure). */
export async function hasEspaceAccess(): Promise<boolean> {
  return hasAccess(await getRole());
}

/**
 * À utiliser en tête de chaque page de l'espace : redirige vers la connexion si
 * personne n'est connecté ou si le compte n'a pas accès. Avec `bureauOnly`,
 * un responsable de structure est renvoyé vers le tableau de bord.
 */
export function useEspaceGuard(options: { bureauOnly?: boolean } = {}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<EspaceRole>(NO_ROLE);
  const [ready, setReady] = useState(false);
  const bureauOnly = options.bureauOnly ?? false;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const session = supabase ? (await supabase.auth.getSession()).data.session : null;
      const r = session ? await getRole() : NO_ROLE;
      if (cancelled) return;
      if (!session || !hasAccess(r)) {
        await navigate({ to: BUREAU_LOGIN });
        return;
      }
      if (bureauOnly && !r.bureau) {
        await navigate({ to: "/espace-bureau/dashboard" });
        return;
      }
      setUser(session.user);
      setRole(r);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, bureauOnly]);

  return { user, role, ready };
}

/** Pages réservées au Bureau (ex. messages de contact). */
export function useBureauGuard() {
  return useEspaceGuard({ bureauOnly: true });
}
