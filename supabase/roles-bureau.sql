-- ============================================================
-- Trois niveaux de droits dans l'espace Bureau
-- Club Informatique SUP'PTIC
--
-- Prérequis : securite-bureau.sql puis recrutement.sql.
-- Le script peut être relancé.
--
--   Super-admin       (bureau_admins.super_admin = true) : tous les droits.
--   Membre du Bureau  (bureau_admins) : lecture de tout, aucune modification.
--   Responsable       (responsables) : modifie les annonces et candidatures
--                     de sa ou ses structures. Un chef de pôle est en général
--                     aussi membre du Bureau : il voit tout, modifie son pôle.
--
-- is_bureau_admin() garde son nom mais signifie désormais « membre du Bureau
-- (lecture) ». Les écritures globales passent par is_super_admin().
-- ============================================================

-- 1. Super-admin
alter table public.bureau_admins add column if not exists super_admin boolean not null default false;

-- Le vice-président, responsable de la sécurité
update public.bureau_admins set super_admin = true where lower(email) = 'nkoumougrinnel@gmail.com';

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.bureau_admins where user_id = (select auth.uid()) and super_admin
  );
$$;

revoke execute on function public.is_super_admin() from public, anon;
grant execute on function public.is_super_admin() to authenticated;

-- 2. Fonctions de droits
-- Modifier une structure (ses annonces, ses candidatures) : super-admin ou responsable
create or replace function public.peut_gerer(p_structure uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_super_admin()
      or exists (
        select 1 from public.responsables
        where user_id = (select auth.uid()) and structure_id = p_structure
      );
$$;

-- Rôle lu par le site
create or replace function public.mon_role()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'admin', public.is_super_admin(),
    'bureau', public.is_bureau_admin(),
    'structures', coalesce(
      (select jsonb_agg(structure_id) from public.responsables where user_id = (select auth.uid())),
      '[]'::jsonb
    )
  );
$$;

create or replace function public.ajouter_responsable(p_email text, p_structure uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid;
  v_email text;
begin
  if not public.is_super_admin() then
    raise exception 'acces_refuse';
  end if;
  select id, email into v_user, v_email from auth.users where lower(email) = lower(trim(p_email));
  if v_user is null then
    return 'compte_introuvable';
  end if;
  insert into public.responsables (user_id, structure_id, email)
  values (v_user, p_structure, v_email)
  on conflict (user_id, structure_id) do nothing;
  return 'ok';
end;
$$;

create or replace function public.retirer_responsable(p_user uuid, p_structure uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_super_admin() then
    raise exception 'acces_refuse';
  end if;
  delete from public.responsables where user_id = p_user and structure_id = p_structure;
  return 'ok';
end;
$$;

-- 3. Structures : le Bureau lit tout (y compris inactives), seul le super-admin modifie
drop policy if exists "Bureau gère les structures" on public.structures;
drop policy if exists "Bureau lit toutes les structures" on public.structures;
create policy "Bureau lit toutes les structures" on public.structures for select to authenticated
  using ((select public.is_bureau_admin()));
drop policy if exists "Super-admin gère les structures" on public.structures;
create policy "Super-admin gère les structures" on public.structures for all to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));

-- 4. Membres : le Bureau lit (membre_visible inchangée), seul le super-admin modifie
drop policy if exists "Bureau modifie les membres" on public.membres;
drop policy if exists "Super-admin modifie les membres" on public.membres;
create policy "Super-admin modifie les membres" on public.membres for update to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
drop policy if exists "Bureau supprime les membres" on public.membres;
drop policy if exists "Super-admin supprime les membres" on public.membres;
create policy "Super-admin supprime les membres" on public.membres for delete to authenticated
  using ((select public.is_super_admin()));

drop policy if exists "Lecture intérêts" on public.membres_interets;
create policy "Lecture intérêts" on public.membres_interets for select to authenticated
  using ((select public.is_bureau_admin()) or (select public.peut_gerer(structure_id)));

-- 5. Annonces : le Bureau lit tout (brouillons compris), le responsable modifie les siennes
drop policy if exists "Gestion annonces" on public.annonces;
drop policy if exists "Lecture annonces espace" on public.annonces;
create policy "Lecture annonces espace" on public.annonces for select to authenticated
  using ((select public.is_bureau_admin()) or (select public.peut_gerer(structure_id)));
drop policy if exists "Création annonces" on public.annonces;
create policy "Création annonces" on public.annonces for insert to authenticated
  with check ((select public.peut_gerer(structure_id)));
drop policy if exists "Modification annonces" on public.annonces;
create policy "Modification annonces" on public.annonces for update to authenticated
  using ((select public.peut_gerer(structure_id)))
  with check ((select public.peut_gerer(structure_id)));
drop policy if exists "Suppression annonces" on public.annonces;
create policy "Suppression annonces" on public.annonces for delete to authenticated
  using ((select public.peut_gerer(structure_id)));

-- 6. Candidatures aux postes : le Bureau lit tout, le responsable traite les siennes
drop policy if exists "Lecture candidatures poste" on public.candidatures_poste;
create policy "Lecture candidatures poste" on public.candidatures_poste for select to authenticated
  using (
    (select public.is_bureau_admin())
    or (select public.peut_gerer(public.annonce_structure(annonce_id)))
  );
drop policy if exists "Bureau supprime candidatures poste" on public.candidatures_poste;
drop policy if exists "Super-admin supprime candidatures poste" on public.candidatures_poste;
create policy "Super-admin supprime candidatures poste" on public.candidatures_poste for delete to authenticated
  using ((select public.is_super_admin()));
-- (« Traitement candidatures poste » utilise déjà peut_gerer)

-- 7. Messages du formulaire Contact : le Bureau lit, seul le super-admin traite ou supprime
drop policy if exists "Bureau modifie les messages" on public.messages;
drop policy if exists "Super-admin modifie les messages" on public.messages;
create policy "Super-admin modifie les messages" on public.messages for update to authenticated
  using ((select public.is_super_admin()))
  with check ((select public.is_super_admin()));
drop policy if exists "Bureau supprime les messages" on public.messages;
drop policy if exists "Super-admin supprime les messages" on public.messages;
create policy "Super-admin supprime les messages" on public.messages for delete to authenticated
  using ((select public.is_super_admin()));

-- 8. Ancienne table « candidatures » : archive en lecture seule pour le Bureau
--    (supprime une ancienne règle qui laissait tout compte connecté la modifier)
drop policy if exists "Mise à jour statut candidatures pour utilisateurs authentifié" on public.candidatures;
drop policy if exists "Bureau modifie les candidatures" on public.candidatures;
revoke update on public.candidatures from authenticated;

-- ============================================================
-- Gérer le Bureau (SQL Editor) :
--   ajouter un membre du Bureau (lecture) :
--     insert into public.bureau_admins (user_id, email)
--     select id, email from auth.users where email = 'prenom.nom@gmail.com'
--     on conflict (user_id) do nothing;
--   donner ou retirer les super-droits :
--     update public.bureau_admins set super_admin = true  where email = '…';
--     update public.bureau_admins set super_admin = false where email = '…';
-- ============================================================
