# ADHÉSION, STRUCTURES ET RECRUTEMENT

**Club Informatique SUP'PTIC**
_Document destiné au Bureau Exécutif et aux responsables de structure_

---

## 1. Ce qui change

| Avant | Maintenant |
|---|---|
| Un formulaire d'adhésion de 15 champs (« environ 5 minutes ») qui mélangeait adhésion et candidature | Un formulaire d'adhésion d'une minute : identité, WhatsApp, formation, pôles d'intérêt (facultatif, 2 maximum), « Comment as-tu connu le club ? » |
| Les adhésions étaient « acceptées » ou « refusées » | L'adhésion est automatique. Une adresse e-mail = un membre |
| Les pôles étaient écrits dans le code du site | Les pôles se gèrent depuis l'onglet **Structures** de l'Espace Bureau |
| Pas d'espace de recrutement | Une page publique **/recrutement** et un parcours de candidature en 4 étapes |
| Un seul accès, tout ou rien | Un accès **Bureau** (tout) et un accès **responsable** (sa structure uniquement) |

Trois niveaux de participation : **membre du Club** → **intéressé par un pôle** → **membre actif d'un pôle** (candidature acceptée).

---

## 2. Mise en production (une seule fois)

À faire par le responsable de la sécurité, **au moment où la nouvelle version du site est déployée** :

1. Ouvrir Supabase > **SQL Editor**.
2. Exécuter `supabase/recrutement.sql`. Le script :
   - crée les tables `structures`, `membres`, `membres_interets`, `responsables`, `annonces`, `candidatures_poste` et leurs règles d'accès ;
   - crée les 4 structures de départ : Innovation & Projets, Développement, Communication, Secrétariat général ;
   - **recopie les anciennes inscriptions** dans `membres` (une fiche par e-mail, la plus récente ; les inscriptions « Refusé » ne sont pas reprises ; les anciennes réponses sont conservées dans la fiche) ;
   - crée en **brouillon** les 9 postes de l'annexe « Description des postes et profils recherchés ».
3. Une fois le nouveau site en ligne, exécuter la **section 13** du script (en fin de fichier, à décommenter) pour fermer l'ancien formulaire.

L'ancienne table `candidatures` n'est ni modifiée ni supprimée : elle reste en archive.

---

## 3. Gérer les structures (Bureau)

Onglet **Structures** :

- **Nouvelle structure** : nom, description (affichée dans le formulaire d'adhésion), type, couleur, ordre d'affichage.
  - Type **Pôle** : proposé comme pôle d'intérêt à l'adhésion.
  - Type **Entité du Bureau** (ex. Secrétariat général) : peut recruter, mais n'apparaît pas dans le formulaire d'adhésion.
- **Désactiver** une structure la masque du site sans effacer ses données.
- **Responsables** : depuis la fiche d'une structure, saisir l'e-mail du responsable puis « Ajouter ».
  - Le compte doit d'abord exister : Supabase > **Authentication > Users > Add user** (cocher « Auto Confirm User »), puis envoyer « Send password recovery » pour qu'il choisisse son mot de passe.
  - Une même personne peut être responsable de plusieurs structures.
  - En fin de mandat, cliquer sur « Retirer ».

---

## 4. Publier une annonce (responsable ou Bureau)

Onglet **Annonces** > **Nouvelle annonce**. Toutes les structures utilisent le même modèle :

| Rubrique | Obligatoire | Exemple |
|---|---|---|
| Intitulé du poste | Oui | Responsable des labos réseau |
| Résumé (une phrase, affichée sur la carte) | Conseillé | Monter et animer les ateliers pratiques |
| Ce que tu feras | Oui | Préparer les TP, encadrer les séances… |
| Profil recherché | Oui | Bases en routage et commutation |
| Livrables attendus | Non | Un labo documenté par mois |
| Outils et technologies | Non | Packet Tracer, GNS3, Wireshark |
| Rubrique libre (titre au choix) | Non | « Certifications préparées », « Contribution à la digitalisation » |
| Places, engagement, date limite | Places : oui | 2 places · 3 h par semaine · 30 novembre |
| Questions propres au poste (3 maximum) | Non | As-tu déjà configuré un VLAN ? |

- **Brouillon** : invisible sur le site. **Publier** : visible sur /recrutement. **Fermer les candidatures** : la fiche reste consultable, mais on ne peut plus postuler.
- Une annonce publiée **disparaît automatiquement de la liste** le lendemain de sa date limite.
- Les 9 postes de l'annexe sont déjà créés en brouillon : il suffit de les compléter (résumé, date limite, questions…) puis de les publier.

---

## 5. Traiter les candidatures

Côté candidat (page du poste) : 1. e-mail (un membre est reconnu ; sinon il complète l'adhésion express et sera inscrit au club) → 2. motivation, expérience, liens → 3. disponibilité et questions du poste → 4. vérification et envoi. Une seule candidature par personne et par annonce.

Côté responsable, onglet **Candidatures** :

| Statut | Étape |
|---|---|
| Reçue | À étudier, puis planifier l'entretien |
| Entretien | **Entretien obligatoire**, prévu ou réalisé : il reste la décision |
| Acceptée | Décision du responsable : prévenir le candidat et l'ajouter au groupe du pôle |
| Refusée | Décision du responsable : prévenir le candidat |

- La fiche donne les boutons WhatsApp et e-mail, toutes les réponses, et une **note interne** (compte rendu d'entretien), visible uniquement dans l'Espace Bureau.
- La décision d'intégration revient au **responsable de la structure**.
- Export Excel / CSV disponible.

---

## 6. Ce que chacun voit

| | Public | Responsable | Bureau |
|---|---|---|---|
| Pôles actifs, annonces publiées | ✓ | ✓ | ✓ |
| Membres | — | Intéressés par son pôle + ses candidats | Tous |
| Annonces brouillon | — | Celles de sa structure | Toutes |
| Candidatures | — | Celles de sa structure | Toutes |
| Structures, responsables, messages | — | — | ✓ |

Ces règles sont appliquées par la base de données elle-même (Supabase RLS), pas seulement par l'affichage.

---

## 7. À prévoir ensuite

- **Notification par e-mail** au responsable à chaque nouvelle candidature, et accusé de réception au candidat (Supabase Edge Function + service d'envoi d'e-mails à configurer).
