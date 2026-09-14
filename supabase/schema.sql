-- ============================================================
-- Backend du site clubinfo.vercel.app — Club Informatique SUP'PTIC
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- ============================================================

-- 1. Candidatures d'adhésion (formulaire /join)
create table if not exists public.candidatures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  prenom text,
  email text not null,
  telephone text not null,
  campus text not null,
  cycle text not null,
  regime text not null,
  niveau text not null,
  option text not null,
  domaine text not null,
  niveau_experience text,
  pole text not null,
  motivation text,
  engagement_reglement boolean not null default true,
  statut text not null default 'Nouveau' -- Nouveau / Contacté / Accepté / Refusé
);

-- 2. Messages de contact (formulaire /contact)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  email text not null,
  telephone text,
  organisation text,
  categorie text,
  sujet text not null,
  message text not null,
  traite boolean not null default false
);

-- 3. Droits d'accès par rôle
grant insert on public.candidatures to anon;
grant insert on public.messages to anon;
grant select, update on public.candidatures to authenticated;
grant select, update on public.messages to authenticated;

-- 4. Sécurité au niveau ligne (RLS) : activation
alter table public.candidatures enable row level security;
alter table public.messages enable row level security;

-- 5. Politiques RLS : Insertion publique (pour le formulaire /join et /contact)
create policy "Insertion publique candidatures"
  on public.candidatures for insert to anon
  with check (true);

create policy "Insertion publique messages"
  on public.messages for insert to anon
  with check (true);

-- 6. Politiques RLS : Lecture pour utilisateurs authentifiés (Bureau)
create policy "Lecture candidatures pour utilisateurs authentifiés"
  on public.candidatures for select to authenticated
  using (true);

create policy "Lecture messages pour utilisateurs authentifiés"
  on public.messages for select to authenticated
  using (true);

-- 7. Politiques RLS : Modification pour utilisateurs authentifiés (Bureau)
create policy "Mise à jour candidatures pour utilisateurs authentifiés"
  on public.candidatures for update to authenticated
  using (true)
  with check (true);

create policy "Mise à jour messages pour utilisateurs authentifiés"
  on public.messages for update to authenticated
  using (true)
  with check (true);
