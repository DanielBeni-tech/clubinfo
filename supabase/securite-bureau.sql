-- ============================================================
-- Sécurité de l'espace Bureau — Club Informatique SUP'PTIC
-- À exécuter une fois dans Supabase > SQL Editor (le script peut être relancé).
--
-- Principe : seuls les comptes listés dans public.bureau_admins peuvent lire,
-- modifier ou supprimer les candidatures et les messages. Un simple compte
-- connecté n'a plus aucun droit. Le public garde uniquement le droit d'envoyer
-- les formulaires /join et /contact.
-- ============================================================

-- 1. Liste des membres du Bureau autorisés (un compte Supabase par personne)
create table if not exists public.bureau_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  ajoute_le timestamptz not null default now()
);

alter table public.bureau_admins enable row level security;
-- Personne ne lit ni ne modifie cette table depuis le site : on la gère ici, en SQL.
revoke all on public.bureau_admins from anon, authenticated;

-- 2. Fonction de contrôle utilisée par les règles et par le site
create or replace function public.is_bureau_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.bureau_admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_bureau_admin() from public, anon;
grant execute on function public.is_bureau_admin() to authenticated;

-- 3. Droits sur les tables
revoke all on public.candidatures from anon, authenticated;
revoke all on public.messages from anon, authenticated;
grant insert on public.candidatures to anon, authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update on public.candidatures to authenticated;
grant select, update, delete on public.messages to authenticated;

-- 4. Remplacement des anciennes règles (qui ouvraient tout à n'importe quel compte connecté)
drop policy if exists "Lecture candidatures pour utilisateurs authentifiés" on public.candidatures;
drop policy if exists "Mise à jour candidatures pour utilisateurs authentifiés" on public.candidatures;
drop policy if exists "Lecture messages pour utilisateurs authentifiés" on public.messages;
drop policy if exists "Mise à jour messages pour utilisateurs authentifiés" on public.messages;
drop policy if exists "Insertion publique candidatures" on public.candidatures;
drop policy if exists "Insertion publique messages" on public.messages;

drop policy if exists "Envoi public candidatures" on public.candidatures;
create policy "Envoi public candidatures"
  on public.candidatures for insert to anon, authenticated
  with check (statut = 'Nouveau');

drop policy if exists "Envoi public messages" on public.messages;
create policy "Envoi public messages"
  on public.messages for insert to anon, authenticated
  with check (traite = false);

drop policy if exists "Bureau lit les candidatures" on public.candidatures;
create policy "Bureau lit les candidatures"
  on public.candidatures for select to authenticated
  using ((select public.is_bureau_admin()));

drop policy if exists "Bureau modifie les candidatures" on public.candidatures;
create policy "Bureau modifie les candidatures"
  on public.candidatures for update to authenticated
  using ((select public.is_bureau_admin()))
  with check ((select public.is_bureau_admin()));

drop policy if exists "Bureau lit les messages" on public.messages;
create policy "Bureau lit les messages"
  on public.messages for select to authenticated
  using ((select public.is_bureau_admin()));

drop policy if exists "Bureau modifie les messages" on public.messages;
create policy "Bureau modifie les messages"
  on public.messages for update to authenticated
  using ((select public.is_bureau_admin()))
  with check ((select public.is_bureau_admin()));

drop policy if exists "Bureau supprime les messages" on public.messages;
create policy "Bureau supprime les messages"
  on public.messages for delete to authenticated
  using ((select public.is_bureau_admin()));

-- ============================================================
-- 5. Gestion des membres du Bureau
--
-- a) Créer le compte : Authentication > Users > "Add user" > "Create new user"
--    (cocher "Auto Confirm User"). Chaque membre choisit ensuite son mot de passe
--    via "Send password recovery" ou le change lui-même.
--
-- b) Lui donner l'accès (remplacer l'e-mail) :
--
--    insert into public.bureau_admins (user_id, email)
--    select id, email from auth.users where email = 'prenom.nom@exemple.com'
--    on conflict (user_id) do nothing;
--
-- c) Retirer l'accès (fin de mandat) :
--
--    delete from public.bureau_admins where email = 'prenom.nom@exemple.com';
--
-- d) Voir qui a accès :
--
--    select email, ajoute_le from public.bureau_admins order by ajoute_le;
-- ============================================================
