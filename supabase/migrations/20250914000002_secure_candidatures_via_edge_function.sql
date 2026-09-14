-- ============================================================
-- Phase 2 — Soumission sécurisée via Edge Function
-- Migration additive — ne supprime aucune candidature
-- ============================================================

-- 1. Table technique pour le rate limiting (IP + email)
create table if not exists public.candidature_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- Index pour les fenêtres de rate limit (1h par IP, 24h par email)
create index if not exists idx_rate_limits_ip_created on public.candidature_rate_limits (ip, created_at desc);
create index if not exists idx_rate_limits_email_created on public.candidature_rate_limits (email, created_at desc);
-- Nettoyage automatique : on garde 30 jours max (optionnel, via cron ou purge manuelle)
create index if not exists idx_rate_limits_created_at on public.candidature_rate_limits (created_at);

-- RLS pour la table technique : aucun accès public, seul service_role peut lire/écrire
alter table public.candidature_rate_limits enable row level security;
-- Aucune policy pour anon/authenticated → par défaut deny. service_role bypass RLS.

-- 2. Durcissement RLS candidatures : l'insertion ne passe plus directement par anon
--    À partir de Phase 2, le frontend appelle l'Edge Function qui utilise service_role.
--    On révoque donc l'insert direct anon pour empêcher le spam/bypass.
revoke insert on public.candidatures from anon;
-- Supprime l'ancienne policy publique (si elle existe)
drop policy if exists "Insertion publique candidatures" on public.candidatures;
drop policy if exists "Insertion publique candidatures — Nouveau uniquement" on public.candidatures;

-- Note : aucune policy SELECT/UPDATE/DELETE pour anon — lecture réservée au service_role/Dashboard
-- Si un fallback direct anon est souhaité temporairement, décommenter la policy ci-dessous :
-- create policy "Insertion publique candidatures — Nouveau uniquement (fallback)"
--   on public.candidatures for insert to anon
--   with check (statut = 'Nouveau');

-- 3. Petite table de documentation : le statut reste géré côté serveur
--    Aucun changement de contrainte ici — déjà présent en 00001 (chk_candidatures_statut)
--    On s'assure simplement que le trigger updated_at existe déjà (00001)

-- 4. Commentaire pour l'équipe
comment on table public.candidature_rate_limits is 'Rate limiting technique pour submit-candidature — max 5/IP/heure, 2/email/24h, détection doublon rapproché';
