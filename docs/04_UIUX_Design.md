# UI/UX Design
## Site officiel du Club Informatique SUP'PTIC

---

## 1. Architecture de l'information

```
Accueil (/)
├── À propos (/about)
├── Projets (/projects)
│    └── SUP'ONE AI (/projects/supone-ai)
├── Activités & événements (/events)
├── Galerie (/gallery)
├── Rejoindre (/join)
└── Contact (/contact)

Footer (commun) : Navigation · Réseaux sociaux · Contact · Partenaires · Mentions institutionnelles
```

## 2. Charte graphique

### 2.1 Couleurs

Palette dérivée de la couleur réelle extraite du logo officiel (`#0047AD`), complétée pour répondre à l'exigence "bleu, blanc, éléments sombres, style club tech professionnel" :

| Rôle | Couleur | Hex |
|---|---|---|
| Bleu principal (marque, CTA) | Bleu Club Info | `#0047AD` |
| Bleu nuit (fonds sombres, hero, footer) | Bleu profond | `#001B3D` |
| Bleu clair (fonds de section, cartes) | Bleu pâle | `#EAF1FB` |
| Accent technologique (liens, hover, badges "statut") | Cyan électrique | `#2FB4E0` |
| Texte principal | Noir doux | `#111417` |
| Texte secondaire / légendes | Gris | `#5B6470` |
| Fond principal | Blanc | `#FFFFFF` |

> Le bleu nuit `#001B3D` et l'accent cyan `#2FB4E0` sont proposés pour donner au site le rendu "tech sombre/professionnel" demandé (hero et footer en fond sombre, reste du site en fond clair) — à ajuster si des captures exactes de e-supptic.cm révèlent une teinte institutionnelle différente à respecter.

### 2.2 Typographie

- **Titres / accroches** : police display en gras (Poppins ou Montserrat Bold) — écho au lettrage du logo "CLUB INFO".
- **Texte courant** : police neutre et lisible (Inter ou Roboto).
- **Code / tags technologiques** : police monospace légère (ex. JetBrains Mono) pour les badges de stack technique sur les fiches projets.

### 2.3 Éléments de marque

- Logo utilisé en pleine couleur sur fond clair, en version blanche sur les fonds sombres (hero, footer).
- Tagline officielle *"Une école, un esprit, une intelligence"* systématiquement présente dans le hero de l'accueil.
- Motif de points connectés du logo réutilisable en filigrane discret sur les fonds sombres (hero, section CTA).

## 3. Wireframes texte par page

### `/` — Accueil
1. Navbar sticky (fond transparent → opaque au scroll) : logo, liens (Accueil, À propos, Projets, Événements, Galerie, Contact), bouton CTA "Rejoindre".
2. Hero (fond bleu nuit, motif de points en filigrane) : logo, titre, tagline, texte d'accroche, boutons "Découvrir le club" / "Nos projets".
3. Bloc À propos (aperçu) : 2-3 phrases + mini-liste de valeurs, lien "En savoir plus" → `/about`.
4. Grille "Domaines d'expertise" : 6 cartes (icône + titre + description courte), 3 colonnes desktop / 2 tablette / 1 mobile.
5. Section "Nos projets" : SUP'ONE AI en carte large mise en avant + 2 autres projets en cartes standard ; lien "Tous les projets".
6. Section "Activités & événements" : 2-3 cartes événements (date, type, titre) ; lien "Tous les événements".
7. Bande "Galerie" : 6-8 vignettes photo en défilement horizontal ou grille ; lien "Voir la galerie".
8. Bandeau "Partenaires" : logos alignés horizontalement, fond blanc.
9. CTA "Rejoindre" (fond bleu nuit) : accroche + bouton.
10. Footer (fond bleu nuit) : logo, navigation, réseaux sociaux, contact, mentions.

### `/about`
1. En-tête de page (titre + chapeau court).
2. Présentation détaillée + mission (texte long, colonne unique lisible).
3. Grille des 5 objectifs (icônes + texte court).
4. Bloc "Structure" : carte Bureau Exécutif + 3 cartes pôles (Innovation & Projets, Développement, Communication), rôle de chacun.
5. Bloc "Partenariats institutionnels" (Administration SUP'PTIC, AE).
6. CTA de fin de page → `/join`.

### `/projects`
1. En-tête + chapeau.
2. Filtres (par domaine d'expertise, par statut).
3. Carte "Projet phare" SUP'ONE AI en tête, visuellement plus grande, badge distinctif.
4. Grille standard des autres projets (nom, image, description courte, statut, tags, lien fiche/GitHub).

### `/projects/supone-ai`
1. Fil d'Ariane (Projets > SUP'ONE AI).
2. En-tête : titre, sous-titre, badges (statut, domaines concernés).
3. Bloc description longue.
4. Bloc média : captures d'écran en carrousel ou vidéo embarquée.
5. Bloc équipe/pôle porteur.
6. Boutons "Voir sur GitHub" / "Voir la démo" (si disponibles).
7. Navigation "Projet suivant" en pied de page.

### `/events`
1. En-tête + chapeau.
2. Filtre par type (Formation / Conférence / Hackathon / Atelier / Concours / Visite / Collaboration).
3. Liste chronologique en cartes : date, type (badge coloré), titre, description courte, photo, lien vers galerie de l'événement si applicable.

### `/gallery`
1. En-tête + chapeau.
2. Filtres par catégorie (Événements / Formations / Projets / Vie du club).
3. Grille type masonry, ouverture en lightbox au clic (zoom, navigation flèches).

### `/join`
1. En-tête : rappel des conditions d'adhésion.
2. Formulaire d'adhésion (voir Backend Schema pour les champs).
3. État de confirmation clair après soumission (sans rechargement complet si possible).

### `/contact`
1. En-tête.
2. Formulaire de contact générique.
3. Bloc coordonnées directes + réseaux sociaux (LinkedIn, futurs Instagram/GitHub).

## 4. Composants UI réutilisables

| Composant | Usage |
|---|---|
| `Navbar` | Toutes les pages, état actif sur la page courante |
| `Hero` | Accueil (variante sombre avec motif de points) |
| `ExpertiseCard` | Grille des 6 domaines d'expertise |
| `ProjectCard` (+ variante "featured") | Accueil, `/projects`, mise en avant de SUP'ONE AI |
| `EventCard` | `/events` |
| `GalleryGrid` + `Lightbox` | Accueil (aperçu), `/gallery` (complet) |
| `StatCounter` | Chiffres clés (année de création, membres, projets) |
| `CTASection` | Bandeaux d'appel à l'action (Rejoindre) |
| `Footer` | Toutes les pages |
| `Badge` | Statuts de projet, types d'événements, tags technos |

## 5. Responsive

| Breakpoint | Largeur | Comportement |
|---|---|---|
| Mobile | < 640px | Menu hamburger, sections empilées en 1 colonne, boutons pleine largeur, galerie en défilement |
| Tablette | 640–1024px | Grilles en 2 colonnes (projets, domaines, galerie) |
| Desktop | > 1024px | Grilles en 3 colonnes, hero en 2 colonnes texte/visuel, navbar complète |
