-- ============================================================
-- Adhésion allégée, structures dynamiques et espace Recrutement
-- Club Informatique SUP'PTIC — clubinfo.vercel.app
--
-- Prérequis : schema.sql puis securite-bureau.sql déjà exécutés.
-- À exécuter une fois dans Supabase > SQL Editor, AU MOMENT du déploiement
-- de la version du site qui l'utilise (le script peut être relancé).
--
-- Contenu :
--   1. structures          pôles et autres entités du club (Secrétariat général…)
--   2. membres             une fiche par personne (e-mail unique)
--   3. membres_interets    pôles d'intérêt indiqués à l'adhésion
--   4. responsables        comptes des chefs de pôle / responsables de structure
--   5. annonces            postes publiés sur /recrutement
--   6. candidatures_poste  candidatures à un poste
--   7. fonctions de contrôle des droits
--   8. règles d'accès (RLS)
--   9. fonctions publiques : adherer, est_membre, postuler
--  10. fonctions du Bureau : ajouter / retirer un responsable
--  11. reprise des anciennes inscriptions (table candidatures)
--  12. structures et annonces de départ (annexe du 15/11/2026)
--  13. (après déploiement) fermeture de l'ancien formulaire
--
-- L'ancienne table « candidatures » n'est ni modifiée ni supprimée : elle reste
-- en archive. Ses données sont recopiées dans « membres » (section 11).
-- ============================================================


-- ------------------------------------------------------------
-- 1. Structures (pôles, Secrétariat général…)
-- ------------------------------------------------------------
create table if not exists public.structures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nom text not null,
  nom_en text,
  description text not null default '',
  description_en text,
  -- 'pole' : proposé comme pôle d'intérêt à l'adhésion.
  -- 'bureau' : entité du Bureau (ex. Secrétariat général), peut recruter mais
  --            n'apparaît pas dans le formulaire d'adhésion.
  type text not null default 'pole' check (type in ('pole', 'bureau')),
  couleur text not null default 'slate',   -- clé de couleur utilisée par le site
  ordre int not null default 100,
  actif boolean not null default true
);


-- ------------------------------------------------------------
-- 2. Membres : une fiche par personne
-- ------------------------------------------------------------
create table if not exists public.membres (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  prenom text,
  email text not null,
  telephone text not null,
  campus text not null,
  cycle text not null,
  niveau text not null default '',
  source text,                                  -- « Comment as-tu connu le club ? »
  engagement_reglement boolean not null default true,
  historique text,                              -- réponses de l'ancien formulaire (reprise)
  ancienne_inscription uuid unique              -- id dans l'ancienne table candidatures
);

create unique index if not exists membres_email_unique on public.membres (lower(email));


-- ------------------------------------------------------------
-- 3. Pôles d'intérêt (2 au maximum, contrôlé par la fonction adherer)
-- ------------------------------------------------------------
create table if not exists public.membres_interets (
  membre_id uuid not null references public.membres (id) on delete cascade,
  structure_id uuid not null references public.structures (id) on delete cascade,
  primary key (membre_id, structure_id)
);


-- ------------------------------------------------------------
-- 4. Responsables de structure (chefs de pôle, secrétaire général…)
-- ------------------------------------------------------------
create table if not exists public.responsables (
  user_id uuid not null references auth.users (id) on delete cascade,
  structure_id uuid not null references public.structures (id) on delete cascade,
  email text not null,
  ajoute_le timestamptz not null default now(),
  primary key (user_id, structure_id)
);


-- ------------------------------------------------------------
-- 5. Annonces de poste
-- ------------------------------------------------------------
create table if not exists public.annonces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  structure_id uuid not null references public.structures (id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titre text not null,
  resume text not null default '',              -- une phrase, affichée sur la carte
  missions text not null,                       -- « Ce que tu feras » (obligatoire)
  profil text not null,                         -- « Profil recherché » (obligatoire)
  livrables text,                               -- facultatif
  outils text,                                  -- « Outils et technologies », facultatif
  rubrique_titre text,                          -- rubrique libre : titre au choix
  rubrique_contenu text,
  places int not null default 1 check (places between 1 and 50),
  engagement text,                              -- ex. « 3 h par semaine »
  date_limite date,
  questions jsonb not null default '[]'::jsonb
    check (jsonb_typeof(questions) = 'array' and jsonb_array_length(questions) <= 3),
  statut text not null default 'brouillon' check (statut in ('brouillon', 'publiee', 'fermee'))
);

create index if not exists annonces_structure_idx on public.annonces (structure_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists annonces_updated_at on public.annonces;
create trigger annonces_updated_at
  before update on public.annonces
  for each row execute function public.touch_updated_at();


-- ------------------------------------------------------------
-- 6. Candidatures à un poste
-- ------------------------------------------------------------
create table if not exists public.candidatures_poste (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  annonce_id uuid not null references public.annonces (id) on delete cascade,
  membre_id uuid not null references public.membres (id) on delete cascade,
  motivation text not null,
  experience text not null,
  liens text,
  disponibilite text not null,
  reponses jsonb not null default '[]'::jsonb check (jsonb_typeof(reponses) = 'array'),
  statut text not null default 'Reçue'
    check (statut in ('Reçue', 'Entretien', 'Acceptée', 'Refusée')),
  note_interne text,                            -- visible uniquement dans l'espace Bureau
  unique (annonce_id, membre_id)
);

create index if not exists candidatures_poste_membre_idx on public.candidatures_poste (membre_id);


-- ------------------------------------------------------------
-- 7. Fonctions de contrôle des droits
--    (is_bureau_admin() est définie dans securite-bureau.sql)
-- ------------------------------------------------------------

-- Structures dont l'utilisateur connecté est responsable
create or replace function public.mes_structures()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select structure_id from public.responsables where user_id = (select auth.uid());
$$;

-- Le Bureau gère tout ; un responsable gère sa ou ses structures
create or replace function public.peut_gerer(p_structure uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_bureau_admin()
      or exists (
        select 1 from public.responsables
        where user_id = (select auth.uid()) and structure_id = p_structure
      );
$$;

-- Un responsable voit les membres intéressés par sa structure
-- et ceux qui ont postulé à l'une de ses annonces
create or replace function public.membre_visible(p_membre uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_bureau_admin()
      or exists (
        select 1
        from public.membres_interets mi
        join public.responsables r on r.structure_id = mi.structure_id
        where mi.membre_id = p_membre and r.user_id = (select auth.uid())
      )
      or exists (
        select 1
        from public.candidatures_poste c
        join public.annonces a on a.id = c.annonce_id
        join public.responsables r on r.structure_id = a.structure_id
        where c.membre_id = p_membre and r.user_id = (select auth.uid())
      );
$$;

create or replace function public.annonce_structure(p_annonce uuid)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select structure_id from public.annonces where id = p_annonce;
$$;

-- Rôle de l'utilisateur connecté, lu par le site pour afficher l'espace Bureau
create or replace function public.mon_role()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'bureau', public.is_bureau_admin(),
    'structures', coalesce(
      (select jsonb_agg(structure_id) from public.responsables where user_id = (select auth.uid())),
      '[]'::jsonb
    )
  );
$$;

revoke execute on function public.mes_structures() from public, anon;
revoke execute on function public.peut_gerer(uuid) from public, anon;
revoke execute on function public.membre_visible(uuid) from public, anon;
revoke execute on function public.annonce_structure(uuid) from public, anon;
revoke execute on function public.mon_role() from public, anon;
grant execute on function public.mes_structures() to authenticated;
grant execute on function public.peut_gerer(uuid) to authenticated;
grant execute on function public.membre_visible(uuid) to authenticated;
grant execute on function public.annonce_structure(uuid) to authenticated;
grant execute on function public.mon_role() to authenticated;


-- ------------------------------------------------------------
-- 8. Règles d'accès (RLS)
-- ------------------------------------------------------------
alter table public.structures enable row level security;
alter table public.membres enable row level security;
alter table public.membres_interets enable row level security;
alter table public.responsables enable row level security;
alter table public.annonces enable row level security;
alter table public.candidatures_poste enable row level security;

revoke all on public.structures, public.membres, public.membres_interets,
  public.responsables, public.annonces, public.candidatures_poste from anon, authenticated;

-- Structures : lecture publique des structures actives ; gestion par le Bureau
grant select on public.structures to anon, authenticated;
grant insert, update, delete on public.structures to authenticated;

drop policy if exists "Lecture structures" on public.structures;
-- (les structures inactives restent lisibles par le Bureau via la règle suivante)
create policy "Lecture structures" on public.structures for select to anon, authenticated
  using (actif);

drop policy if exists "Bureau gère les structures" on public.structures;
create policy "Bureau gère les structures" on public.structures for all to authenticated
  using ((select public.is_bureau_admin()))
  with check ((select public.is_bureau_admin()));

-- Membres : aucune écriture directe depuis le site public (fonction adherer)
grant select, update, delete on public.membres to authenticated;

drop policy if exists "Lecture membres" on public.membres;
create policy "Lecture membres" on public.membres for select to authenticated
  using ((select public.membre_visible(id)));

drop policy if exists "Bureau modifie les membres" on public.membres;
create policy "Bureau modifie les membres" on public.membres for update to authenticated
  using ((select public.is_bureau_admin()))
  with check ((select public.is_bureau_admin()));

drop policy if exists "Bureau supprime les membres" on public.membres;
create policy "Bureau supprime les membres" on public.membres for delete to authenticated
  using ((select public.is_bureau_admin()));

-- Pôles d'intérêt
grant select on public.membres_interets to authenticated;

drop policy if exists "Lecture intérêts" on public.membres_interets;
create policy "Lecture intérêts" on public.membres_interets for select to authenticated
  using ((select public.peut_gerer(structure_id)));

-- Responsables : lecture par le Bureau et par l'intéressé ; écriture via fonctions
grant select on public.responsables to authenticated;

drop policy if exists "Lecture responsables" on public.responsables;
create policy "Lecture responsables" on public.responsables for select to authenticated
  using ((select public.is_bureau_admin()) or user_id = (select auth.uid()));

-- Annonces : le public lit les annonces publiées ou fermées ;
-- le Bureau et le responsable de la structure gèrent les leurs
grant select on public.annonces to anon, authenticated;
grant insert, update, delete on public.annonces to authenticated;

drop policy if exists "Lecture publique annonces" on public.annonces;
create policy "Lecture publique annonces" on public.annonces for select to anon, authenticated
  using (statut in ('publiee', 'fermee'));

drop policy if exists "Gestion annonces" on public.annonces;
create policy "Gestion annonces" on public.annonces for all to authenticated
  using ((select public.peut_gerer(structure_id)))
  with check ((select public.peut_gerer(structure_id)));

-- Candidatures aux postes : aucune écriture directe depuis le site public (fonction postuler)
grant select, update, delete on public.candidatures_poste to authenticated;

drop policy if exists "Lecture candidatures poste" on public.candidatures_poste;
create policy "Lecture candidatures poste" on public.candidatures_poste for select to authenticated
  using ((select public.peut_gerer(public.annonce_structure(annonce_id))));

drop policy if exists "Traitement candidatures poste" on public.candidatures_poste;
create policy "Traitement candidatures poste" on public.candidatures_poste for update to authenticated
  using ((select public.peut_gerer(public.annonce_structure(annonce_id))))
  with check ((select public.peut_gerer(public.annonce_structure(annonce_id))));

drop policy if exists "Bureau supprime candidatures poste" on public.candidatures_poste;
create policy "Bureau supprime candidatures poste" on public.candidatures_poste for delete to authenticated
  using ((select public.is_bureau_admin()));


-- ------------------------------------------------------------
-- 9. Fonctions publiques (formulaires du site)
-- ------------------------------------------------------------

-- Création d'une fiche membre. Usage interne (adherer et postuler).
create or replace function public._creer_membre(p jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(coalesce(p->>'email', '')));
  v_id uuid;
begin
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or length(v_email) > 200 then
    raise exception 'email_invalide';
  end if;
  if coalesce(trim(p->>'nom'), '') = ''
     or coalesce(trim(p->>'telephone'), '') = ''
     or coalesce(trim(p->>'campus'), '') = ''
     or coalesce(trim(p->>'cycle'), '') = '' then
    raise exception 'champs_manquants';
  end if;
  if coalesce((p->>'engagement_reglement')::boolean, false) is not true then
    raise exception 'engagement_requis';
  end if;

  insert into public.membres (nom, prenom, email, telephone, campus, cycle, niveau, source, engagement_reglement)
  values (
    left(trim(p->>'nom'), 100),
    nullif(left(trim(coalesce(p->>'prenom', '')), 100), ''),
    v_email,
    left(trim(p->>'telephone'), 40),
    left(trim(p->>'campus'), 120),
    left(trim(p->>'cycle'), 160),
    left(trim(coalesce(p->>'niveau', '')), 60),
    nullif(left(trim(coalesce(p->>'source', '')), 120), ''),
    true
  )
  returning id into v_id;

  insert into public.membres_interets (membre_id, structure_id)
  select v_id, s.id
  from public.structures s
  where s.actif and s.type = 'pole'
    and s.slug in (
      select value from jsonb_array_elements_text(coalesce(p->'interets', '[]'::jsonb)) limit 2
    );

  return v_id;
end;
$$;

revoke execute on function public._creer_membre(jsonb) from public, anon, authenticated;

-- Formulaire /join. Renvoie 'ok' ou 'deja_membre'.
create or replace function public.adherer(p jsonb)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.membres where lower(email) = lower(trim(coalesce(p->>'email', '')))) then
    return 'deja_membre';
  end if;
  perform public._creer_membre(p);
  return 'ok';
exception
  when unique_violation then
    return 'deja_membre';
end;
$$;

-- Étape 1 de la candidature : l'e-mail correspond-il à un membre ?
-- Ne renvoie qu'un oui / non, jamais d'informations personnelles.
create or replace function public.est_membre(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.membres where lower(email) = lower(trim(coalesce(p_email, ''))));
$$;

-- Formulaire de candidature. Renvoie 'ok', 'adhesion_requise', 'deja_candidat' ou 'annonce_fermee'.
-- p_adhesion n'est utile que si la personne n'est pas encore membre.
create or replace function public.postuler(
  p_annonce uuid,
  p_email text,
  p_candidature jsonb,
  p_adhesion jsonb default null
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_annonce public.annonces%rowtype;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_membre uuid;
  v_reponses jsonb := coalesce(p_candidature->'reponses', '[]'::jsonb);
begin
  select * into v_annonce from public.annonces where id = p_annonce;
  if not found
     or v_annonce.statut <> 'publiee'
     or (v_annonce.date_limite is not null and v_annonce.date_limite < current_date) then
    return 'annonce_fermee';
  end if;

  if coalesce(trim(p_candidature->>'motivation'), '') = ''
     or coalesce(trim(p_candidature->>'experience'), '') = ''
     or coalesce(trim(p_candidature->>'disponibilite'), '') = '' then
    raise exception 'champs_manquants';
  end if;
  if jsonb_typeof(v_reponses) <> 'array'
     or jsonb_array_length(v_reponses) <> jsonb_array_length(v_annonce.questions) then
    raise exception 'reponses_invalides';
  end if;

  select id into v_membre from public.membres where lower(email) = v_email;
  if v_membre is null then
    if p_adhesion is null then
      return 'adhesion_requise';
    end if;
    v_membre := public._creer_membre(p_adhesion || jsonb_build_object('email', v_email));
  end if;

  insert into public.candidatures_poste (annonce_id, membre_id, motivation, experience, liens, disponibilite, reponses)
  values (
    p_annonce,
    v_membre,
    left(trim(p_candidature->>'motivation'), 1500),
    left(trim(p_candidature->>'experience'), 1500),
    nullif(left(trim(coalesce(p_candidature->>'liens', '')), 500), ''),
    left(trim(p_candidature->>'disponibilite'), 200),
    (select coalesce(jsonb_agg(to_jsonb(left(value, 1000))), '[]'::jsonb)
       from jsonb_array_elements_text(v_reponses))
  );
  return 'ok';
exception
  when unique_violation then
    return 'deja_candidat';
end;
$$;

revoke execute on function public.adherer(jsonb) from public;
revoke execute on function public.est_membre(text) from public;
revoke execute on function public.postuler(uuid, text, jsonb, jsonb) from public;
grant execute on function public.adherer(jsonb) to anon, authenticated;
grant execute on function public.est_membre(text) to anon, authenticated;
grant execute on function public.postuler(uuid, text, jsonb, jsonb) to anon, authenticated;


-- ------------------------------------------------------------
-- 10. Fonctions du Bureau : nommer ou retirer un responsable
--     Le compte doit d'abord exister (Authentication > Users > Add user).
-- ------------------------------------------------------------
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
  if not public.is_bureau_admin() then
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
  if not public.is_bureau_admin() then
    raise exception 'acces_refuse';
  end if;
  delete from public.responsables where user_id = p_user and structure_id = p_structure;
  return 'ok';
end;
$$;

revoke execute on function public.ajouter_responsable(text, uuid) from public, anon;
revoke execute on function public.retirer_responsable(uuid, uuid) from public, anon;
grant execute on function public.ajouter_responsable(text, uuid) to authenticated;
grant execute on function public.retirer_responsable(uuid, uuid) to authenticated;


-- ------------------------------------------------------------
-- 12 (exécutée avant 11). Structures de départ
--     Les pôles dont la création n'est pas encore validée ne sont pas
--     créés ici : le Bureau les ajoutera depuis l'espace Bureau une fois validés.
-- ------------------------------------------------------------
insert into public.structures (slug, nom, nom_en, description, description_en, type, couleur, ordre)
values
  ('innovation', 'Innovation & Projets', 'Innovation & Projects',
   'Faire émerger et structurer les idées, coordonner les équipes projet, préparer les pitchs et organiser la préparation aux concours.',
   'Surface and structure ideas, coordinate project teams, prepare pitches and organise competition preparation.',
   'pole', 'amber', 10),
  ('developpement', 'Développement', 'Development',
   'Concevoir les solutions techniques, réaliser des prototypes, apporter un appui technique et partager des compétences.',
   'Design technical solutions, build prototypes, provide technical support and share skills.',
   'pole', 'sky', 20),
  ('communication', 'Communication', 'Communications',
   'Créer les supports visuels et éditoriaux, couvrir les activités et diffuser les informations du club.',
   'Create visual and editorial content, cover activities and share the club''s news.',
   'pole', 'fuchsia', 30),
  ('secretariat-general', 'Secrétariat général', 'General Secretariat',
   'Gestion administrative du club : comptes rendus, correspondances, réunions et documents.',
   'Club administration: minutes, correspondence, meetings and documents.',
   'bureau', 'slate', 90)
on conflict (slug) do nothing;


-- ------------------------------------------------------------
-- 11. Reprise des anciennes inscriptions
--     Une fiche par e-mail (la plus récente). Les inscriptions marquées
--     « Refusé » ne sont pas reprises. Les réponses de l'ancien formulaire
--     sont conservées dans « historique ».
-- ------------------------------------------------------------
insert into public.membres (
  created_at, nom, prenom, email, telephone, campus, cycle, niveau,
  engagement_reglement, historique, ancienne_inscription
)
select distinct on (lower(trim(c.email)))
  c.created_at, c.nom, c.prenom, lower(trim(c.email)), c.telephone, c.campus, c.cycle,
  coalesce(c.niveau, ''), c.engagement_reglement,
  concat_ws(E'\n',
    'Pôle souhaité (ancien formulaire) : ' || c.pole,
    case when coalesce(c.option, '') <> '' then 'Option : ' || c.option end,
    'Centres d''intérêt : ' || c.domaine,
    case when c.niveau_experience is not null then 'Expérience : ' || c.niveau_experience end,
    c.motivation,
    'Statut de l''inscription : ' || c.statut
  ),
  c.id
from public.candidatures c
where c.statut <> 'Refusé'
order by lower(trim(c.email)), c.created_at desc
on conflict do nothing;

insert into public.membres_interets (membre_id, structure_id)
select m.id, s.id
from public.membres m
join public.candidatures c on c.id = m.ancienne_inscription
join public.structures s on s.slug = case c.pole
  when 'Pôle Innovation & Projets' then 'innovation'
  when 'Pôle Développement' then 'developpement'
  when 'Pôle Communication' then 'communication'
end
on conflict do nothing;


-- ------------------------------------------------------------
-- 12 bis. Annonces de départ, d'après l'annexe « Description des postes
--     et profils recherchés » (15/11/2026). Créées en BROUILLON : chaque
--     responsable les complète (résumé, livrables, outils, date limite,
--     questions) puis les publie depuis l'espace Bureau.
-- ------------------------------------------------------------
with profil_commun as (
  select 'Discipline, engagement, esprit d''équipe et réel intérêt pour les activités du Club Informatique. Une expérience préalable dans un poste similaire est un atout, mais n''est pas obligatoire.'::text as txt
)
insert into public.annonces (structure_id, slug, titre, resume, missions, profil, places, statut)
select s.id, v.slug, v.titre, v.resume, v.missions, (select txt from profil_commun), 1, 'brouillon'
from (values
  ('innovation', 'responsable-veille-opportunites', 'Responsable Veille et Opportunités',
   'Repérer les innovations, appels à projets, concours et partenariats utiles au club.',
   'Assurer une veille permanente sur les innovations technologiques, les appels à projets, les formations, les concours et les opportunités de partenariat susceptibles de bénéficier au Club et à ses membres.'),
  ('innovation', 'responsable-collecte-analyse-idees', 'Responsable Collecte et Analyse des Idées',
   'Recueillir les idées des membres et les transformer en initiatives concrètes.',
   'Recueillir les propositions et suggestions des membres, analyser leur pertinence et leur faisabilité, puis contribuer à leur transformation en initiatives concrètes pour le développement du Club.'),
  ('innovation', 'responsable-coordination-projets', 'Responsable Coordination des Projets',
   'Planifier, coordonner et suivre l''exécution des projets du club.',
   'Assurer la planification, la coordination et le suivi de l''exécution des projets du Club. Veiller au respect des objectifs, des délais et à la bonne collaboration entre les différents intervenants.'),
  ('innovation', 'responsable-evenements-competitions', 'Responsable Événements et Compétitions',
   'Organiser les ateliers, conférences, hackathons et compétitions du club.',
   'Concevoir et coordonner l''organisation des événements, ateliers, conférences, hackathons, compétitions et autres activités techniques ou scientifiques initiées par le Club.'),
  ('communication', 'charge-contenus-reseaux-sociaux', 'Chargé des Contenus et des Réseaux Sociaux',
   'Animer les plateformes numériques du club et rédiger ses publications.',
   'Assurer la gestion et l''animation des plateformes numériques du Club. Élaborer les contenus éditoriaux, rédiger les publications et veiller à la diffusion régulière des informations relatives aux activités et aux initiatives du Club.'),
  ('communication', 'charge-creation-visuelle-audiovisuelle', 'Chargé de la Création Visuelle et Audiovisuelle',
   'Concevoir les affiches, visuels et vidéos du club.',
   'Concevoir et réaliser les supports graphiques et audiovisuels du Club, notamment les affiches, flyers, visuels promotionnels, vidéos et autres contenus destinés à renforcer son identité visuelle et sa visibilité.'),
  ('communication', 'charge-automatisation-diffusion', 'Chargé de l''Automatisation et de la Diffusion',
   'Automatiser la communication et la diffusion des informations du club.',
   'Mettre en place et assurer le suivi des solutions permettant d''automatiser les processus de communication et de diffusion des informations. Contribuer à l''optimisation de la gestion des plateformes numériques, des campagnes de communication et des outils de diffusion du Club.'),
  ('secretariat-general', 'assistant-secretaire-general', 'Assistant du Secrétaire général',
   'Appuyer le Secrétaire général dans la gestion administrative du club.',
   'Assister le Secrétaire général dans la gestion administrative du Club. Contribuer à la rédaction des comptes rendus, au suivi des correspondances, à l''organisation des réunions et à la gestion des documents administratifs.'),
  ('developpement', 'secretaire-pole-developpement', 'Secrétaire du Pôle Développement',
   'Assurer le suivi administratif des activités du Pôle Développement.',
   'Assurer le suivi administratif des activités du Pôle Développement. Participer à la rédaction des comptes rendus, au suivi des projets, à la centralisation des informations et à la coordination des échanges entre les responsables du pôle.')
) as v (structure_slug, slug, titre, resume, missions)
join public.structures s on s.slug = v.structure_slug
on conflict (slug) do nothing;


-- ------------------------------------------------------------
-- 13. APRÈS le déploiement du nouveau site uniquement :
--     fermer l'ancien formulaire (plus aucune écriture dans « candidatures »).
--     Décommenter et exécuter.
-- ------------------------------------------------------------
-- revoke insert on public.candidatures from anon, authenticated;
-- drop policy if exists "Envoi public candidatures" on public.candidatures;

-- ============================================================
-- Nommer un responsable : depuis l'espace Bureau (page Structures), ou en SQL :
--   select public.ajouter_responsable('prenom.nom@exemple.com',
--     (select id from public.structures where slug = 'communication'));
-- (en SQL Editor, is_bureau_admin() est faux : utiliser plutôt l'insert direct)
--   insert into public.responsables (user_id, structure_id, email)
--   select u.id, s.id, u.email from auth.users u, public.structures s
--   where u.email = 'prenom.nom@exemple.com' and s.slug = 'communication'
--   on conflict do nothing;
-- ============================================================
