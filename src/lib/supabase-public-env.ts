const SUPABASE_HOST = /^[a-z0-9]+\.supabase\.co$/;
const PUBLISHABLE_KEY = /^sb_publishable_[A-Za-z0-9_-]+$/;

export type PublicSupabaseEnv = {
  url: string;
  publishableKey: string;
};

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json) as { role?: string };
  } catch {
    return null;
  }
}

function assertSupabaseUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("VITE_SUPABASE_URL est invalide.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("VITE_SUPABASE_URL doit utiliser HTTPS.");
  }

  if (!SUPABASE_HOST.test(parsed.hostname)) {
    throw new Error("VITE_SUPABASE_URL doit pointer vers un projet *.supabase.co.");
  }

  if (parsed.username || parsed.password || parsed.port) {
    throw new Error("VITE_SUPABASE_URL ne doit pas contenir d’identifiants.");
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    throw new Error("VITE_SUPABASE_URL ne doit pas contenir de chemin.");
  }
}

function assertPublishableKey(key: string) {
  const lower = key.toLowerCase();

  if (lower.includes("service_role") || key.startsWith("sb_secret_")) {
    throw new Error(
      "Refus : clé serveur Supabase détectée. Utilise uniquement une clé publishable (sb_publishable_…).",
    );
  }

  if (PUBLISHABLE_KEY.test(key)) {
    return;
  }

  if (key.startsWith("eyJ")) {
    const payload = decodeJwtPayload(key);
    if (payload?.role && payload.role !== "anon") {
      throw new Error("Refus : le JWT Supabase n’est pas une clé anon.");
    }
    return;
  }

  throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY doit être une clé publishable Supabase.");
}

export function parsePublicSupabaseEnv(
  env: Record<string, string | undefined>,
): PublicSupabaseEnv {
  const url = env.VITE_SUPABASE_URL?.trim() ?? "";
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? "";

  if (!url) {
    throw new Error("VITE_SUPABASE_URL est manquante.");
  }

  if (!publishableKey) {
    throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY est manquante.");
  }

  assertSupabaseUrl(url);
  assertPublishableKey(publishableKey);

  return { url, publishableKey };
}

export function shouldAssertPublicSupabaseEnv(
  env: Record<string, string | undefined>,
  mode: string,
): boolean {
  return (
    Boolean(process.env.VERCEL) ||
    mode === "production" ||
    Boolean(env.VITE_SUPABASE_URL || env.VITE_SUPABASE_PUBLISHABLE_KEY)
  );
}
