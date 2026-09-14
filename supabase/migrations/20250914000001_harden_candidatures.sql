-- ============================================================
-- Phase 1 — Socle fiable : durcissement candidatures
-- Migration additive — à exécuter après supabase/schema.sql
-- Ne supprime aucune donnée existante.
-- ============================================================

-- 1. Colonne updated_at + trigger automatique
alter table public.candidatures
  add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_candidatures_updated_at on public.candidatures;
create trigger trg_candidatures_updated_at
  before update on public.candidatures
  for each row execute function public.set_updated_at();

-- 2. Index utiles (lecture future back-office, filtres)
create index if not exists idx_candidatures_statut on public.candidatures (statut);
create index if not exists idx_candidatures_created_at on public.candidatures (created_at desc);
create index if not exists idx_candidatures_domaine on public.candidatures (domaine);
create index if not exists idx_candidatures_campus_cycle on public.candidatures (campus, cycle);
create index if not exists idx_candidatures_email on public.candidatures (email);

-- 3. Contraintes de domaine — statut strict
--    Seules les 4 valeurs métier prévues sont autorisées.
--    L'insertion publique ne doit jamais pouvoir créer autre chose que 'Nouveau'
--    (voir policy ci-dessous), mais la contrainte protège aussi les updates manuels.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'chk_candidatures_statut'
  ) then
    alter table public.candidatures
      add constraint chk_candidatures_statut
      check (statut in ('Nouveau', 'Contacté', 'Accepté', 'Refusé'));
  end if;
end $$;

-- 4. Contraintes campus / domaine / pole / niveau_experience
--    Valeurs issues de src/data/club.ts:joinForm (source de vérité)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'chk_candidatures_campus') then
    alter table public.candidatures
      add constraint chk_candidatures_campus
      check (campus in ('Yaoundé', 'Buea'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'chk_candidatures_domaine') then
    alter table public.candidatures
      add constraint chk_candidatures_domaine
      check (domaine in (
        'Intelligence Artificielle',
        'Développement logiciel',
        'Cybersécurité',
        'Réseaux & Télécommunications',
        'Électronique & IoT',
        'Radiocommunication',
        'Management des télécoms',
        'Innovation & Recherche'
      ));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'chk_candidatures_pole') then
    alter table public.candidatures
      add constraint chk_candidatures_pole
      check (pole in (
        'Pôle Innovation & Projets',
        'Pôle Développement',
        'Pôle Communication',
        'Découverte & Ateliers'
      ));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'chk_candidatures_niveau_exp') then
    alter table public.candidatures
      add constraint chk_candidatures_niveau_exp
      check (niveau_experience in ('Débutant', 'Intermédiaire', 'Avancé') or niveau_experience is null);
  end if;
end $$;

-- 5. RLS : durcir l'insertion publique — statut forcé à 'Nouveau'
--    On remplace la policy permissive "with check (true)" par une policy qui
--    n'autorise que les inserts où statut = 'Nouveau' (ou non fourni, donc default).
--    La lecture reste interdite pour anon (pas de SELECT).
drop policy if exists "Insertion publique candidatures" on public.candidatures;
create policy "Insertion publique candidatures — Nouveau uniquement"
  on public.candidatures for insert to anon
  with check (statut = 'Nouveau');

-- 6. Stratégie doublons : PAS de UNIQUE globale sur email/téléphone
--    Un étudiant doit pouvoir recandidater (nouvelle année, changement de cycle,
--    candidature refusée puis nouvelle tentative). On se contente d'index
--    pour la future déduplication applicative/Edge Function et d'un index
--    partiel anti-spam rapide (même email dans les dernières 24h géré côté
--    applicatif/Edge Function en Phase 2, pas en contrainte DB stricte).
--    Aucune contrainte UNIQUE ajoutée ici — choix métier documenté.
