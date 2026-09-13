-- ============================================================
-- Backend du site clubinfo.vercel.app — Club Informatique SUP'PTIC
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- ============================================================

-- 1. Candidatures d'adhésion (formulaire /join)
create table if not exists public.candidatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  email text not null,
  telephone text not null,
  campus text not null,
  cycle text not null,
  regime text not null,
  niveau text not null,
  option text not null,
  pole text not null,
  domaine text not null,
  competences text,
  motivation text,
  statut text not null default 'Nouveau' -- Nouveau / Contacté / Accepté / Refusé
);

-- 2. Messages de contact (formulaire /contact)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  email text not null,
  sujet text not null,
  message text not null,
  traite boolean not null default false
);

-- 3. Droits d'accès : le site (clé publique anon) peut UNIQUEMENT insérer.
--    La lecture/modification reste réservée au dashboard Supabase (service role).
grant insert on public.candidatures to anon;
grant insert on public.messages to anon;

-- 4. Sécurité au niveau ligne : insertion publique, aucune lecture publique.
alter table public.candidatures enable row level security;
alter table public.messages enable row level security;

create policy "Insertion publique candidatures"
  on public.candidatures for insert to anon
  with check (true);

create policy "Insertion publique messages"
  on public.messages for insert to anon
  with check (true);
