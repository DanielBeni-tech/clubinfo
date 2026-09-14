# PRD — Product Requirements Document

## Site officiel du Club Informatique SUP'PTIC

---

## 1. Vision produit

Faire du site du Club Informatique SUP'PTIC la vitrine technologique de référence du Club : un espace qui présente son identité, ses domaines d'expertise, ses projets réels (à commencer par **SUP'ONE AI**) et sa vie associative avec le niveau de finition d'un club tech professionnel — pas d'un site étudiant amateur — tout en restant ancré visuellement dans l'écosystème institutionnel de SUP'PTIC.

## 2. Personas

| Persona                                | Besoin principal                                      | Ce qu'il cherche sur le site                                 |
| -------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| Étudiant SUP'PTIC curieux              | Comprendre le Club avant de s'engager                 | Mission, domaines d'expertise, projets concrets, ambiance    |
| Étudiant motivé / futur membre de pôle | S'inscrire rapidement                                 | Formulaire d'adhésion clair, choix du pôle/domaine d'intérêt |
| Enseignant / administration SUP'PTIC   | Vérifier le sérieux et la conformité institutionnelle | Présentation, structure, partenariats, réalisations          |
| Entreprise / partenaire potentiel      | Évaluer la crédibilité et l'impact du Club            | Projets (SUP'ONE AI en tête), événements, contact            |
| Recruteur / alumni                     | Repérer des talents, suivre l'évolution du Club       | Fiches projets détaillées, GitHub, événements passés         |
| Club ou communauté tech externe        | Envisager une collaboration                           | Domaines d'expertise, activités, contact                     |

## 3. Portée fonctionnelle — priorisation MoSCoW

### Must have

- Page d'accueil complète (hero, à propos, domaines d'expertise, projets, activités, galerie, partenaires, rejoindre, footer)
- Page `/about` : présentation détaillée, mission, valeurs, structure (Bureau Exécutif + 3 pôles)
- Page `/projects` : liste des projets avec au moins SUP'ONE AI en position phare
- Page `/projects/supone-ai` : fiche projet détaillée
- Page `/join` : formulaire d'adhésion
- Page `/contact` : formulaire de contact + réseaux sociaux
- Design responsive mobile/tablette/desktop
- Navigation cohérente (navbar + footer communs à toutes les pages)

### Should have

- Page `/events` : activités et événements (formations, conférences, hackathons, ateliers, concours, visites, collaborations)
- Page `/gallery` : galerie multimédia complète (photos, événements, projets, vie du club)
- Liens GitHub sur les fiches projets
- Intégration de vidéos/démonstrations (embed YouTube/Vimeo)

### Could have

- Sous-pages dédiées pour de futurs projets phares, sur le même modèle que `/projects/supone-ai`
- Témoignages de membres
- Fiches détaillées par domaine d'expertise (`/expertise/ia`, etc.) si le contenu le justifie plus tard

### Won't have (V1)

- Compte utilisateur, espace membre connecté
- CMS / back-office d'administration
- Base de données applicative (le contenu est géré en fichiers versionnés, voir Backend Schema)
- Version anglaise complète (l'architecture est prête, le contenu EN viendra en V2)

## 4. Spécification détaillée par page

### `/` — Accueil

1. **Hero** : logo, nom du club, slogan _"Une école, un esprit, une intelligence"_, présentation courte (2-3 phrases), boutons "Découvrir le club" et "Nos projets".
2. **À propos du club (aperçu)** : présentation courte, mission, valeurs — renvoie vers `/about` pour le détail.
3. **Domaines d'expertise** : 6 cartes — Intelligence Artificielle, Développement logiciel, Cybersécurité, Réseaux & Télécommunications, Électronique/IoT, Innovation & Recherche. Chaque carte : icône, titre, description courte (1-2 phrases).
4. **Projets (aperçu)** : 3 cartes projets, **SUP'ONE AI en position n°1**, avec statut et tags technologiques ; lien "Tous les projets" → `/projects`.
5. **Activités & événements (aperçu)** : 2-3 prochains ou derniers événements ; lien "Voir tous les événements" → `/events`.
6. **Galerie (aperçu)** : bande de 6-8 photos ; lien "Voir la galerie" → `/gallery`.
7. **Partenaires** : logos institutionnels (SUP'PTIC, partenaires validés).
8. **Rejoindre le club (CTA)** : accroche + bouton vers `/join`.
9. **Footer** : navigation, réseaux sociaux (LinkedIn confirmé), contact, mentions institutionnelles.

### `/about` — À propos

- Présentation détaillée du Club (contexte SUP'PTIC, création).
- Mission complète et les 5 objectifs de la Charte.
- Valeurs.
- Structure : Bureau Exécutif + 3 pôles (Innovation & Projets, Développement, Communication), rôle de chaque pôle.
- Partenariats institutionnels (Administration SUP'PTIC, Association des Étudiants).

### `/projects` — Projets

- Grille de toutes les fiches projets, filtrable par domaine d'expertise et/ou statut (Terminé / En cours).
- **SUP'ONE AI épinglé en tête de liste**, visuellement mis en avant (carte plus grande ou badge "Projet phare").
- Chaque carte : nom, image/illustration, description courte, statut, tags technos, lien vers la fiche détaillée ou GitHub.

### `/projects/supone-ai` — Fiche SUP'ONE AI

- Titre, sous-titre, statut, domaine(s) d'expertise concerné(s).
- Description complète du projet (problème résolu, approche, technologies).
- Captures d'écran / démonstration (image ou vidéo embarquée).
- Équipe / pôle porteur.
- Lien GitHub (si public) et lien de démonstration live (si disponible).
- Navigation "Voir un autre projet" en bas de page.

### `/events` — Activités & événements

- Liste chronologique (à venir puis passés) : formations, conférences, hackathons, ateliers, concours, visites, collaborations.
- Chaque item : titre, date, type d'événement, courte description, photo si disponible, lien vers la galerie de l'événement si pertinent.

### `/gallery` — Galerie

- Vue grille/masonry de toutes les photos et médias : membres, événements, formations, projets, vie du club.
- Filtrage optionnel par catégorie (Événements / Formations / Projets / Vie du club).
- Ouverture en grand format (lightbox) au clic.

### `/join` — Rejoindre

- Rappel des conditions d'adhésion (étudiant régulièrement inscrit à SUP'PTIC).
- Formulaire d'adhésion (champs détaillés dans le Backend Schema).
- Message de confirmation clair après soumission.

### `/contact` — Contact

- Formulaire de contact générique.
- Coordonnées directes (e-mail du Club).
- Liens réseaux sociaux (LinkedIn, et futurs : Instagram, GitHub du Club).

## 5. Métriques de succès

- Nombre de candidatures d'adhésion reçues par mois.
- Taux de complétion du formulaire d'adhésion.
- Trafic (visiteurs uniques, pages vues) via un outil gratuit (Plausible ou Google Analytics).
- Taux de clic vers la fiche SUP'ONE AI et vers le GitHub du Club.
- Taux de clic vers LinkedIn depuis le footer.
- Retour qualitatif du Bureau Exécutif sur la crédibilité perçue du site.
