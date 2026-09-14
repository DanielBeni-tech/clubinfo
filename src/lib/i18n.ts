import { useSyncExternalStore } from "react";

export type Locale = "fr" | "en";

const STORAGE_KEY = "clubinfo-locale";

const fr = {
  "nav.home": "Accueil",
  "nav.about": "À propos",
  "nav.projects": "Projets",
  "nav.events": "Événements",
  "nav.gallery": "Galerie",
  "nav.contact": "Contact",
  "nav.join": "Rejoindre",
  "nav.joinClub": "Rejoindre le club",
  "nav.menu": "Ouvrir le menu",
  "nav.close": "Fermer le menu",
  "nav.bureau": "Espace Bureau",
  "nav.logout": "Déconnexion",
  "nav.language": "Langue",
  "hero.kicker": "SUP'PTIC · Yaoundé & Buea",
  "hero.lead":
    "Le Club réunit les étudiants de SUP'PTIC — ingénieurs, inspecteurs, techniciens et agents d'exploitation — autour de projets réels : numérique, réseaux, management des P&T, communication et innovation. On forme, on expérimente, on livre.",
  "hero.discover": "Découvrir le club",
  "hero.projects": "Nos projets",
  "hero.carousel": "Temps forts du Club",
  "hero.photos": "Photos du hero",
  "hero.prev": "Photo précédente",
  "hero.next": "Photo suivante",
  "partners.label": "Partenaires",
  "home.about.eyebrow": "À propos",
  "home.about.title": "Un club étudiant, une exigence professionnelle",
  "home.about.lead":
    "Né au sein de SUP'PTIC, le Club Informatique rassemble des étudiants qui veulent apprendre en construisant. Nos pôles travaillent comme une petite structure : cadrage, réalisation, livraison et communication.",
  "home.about.more": "En savoir plus",
  "home.value.practice": "Apprendre par la pratique",
  "home.value.peers": "Partager entre pairs",
  "home.value.ship": "Livrer des projets utiles",
  "home.groupAlt": "Membres du Club Informatique SUP'PTIC réunis en photo de groupe",
  "home.expertise.eyebrow": "Expertise",
  "home.expertise.title": "Nos domaines d'expertise",
  "home.expertise.lead":
    "Numérique, réseaux, innovation — et aussi le management, l'inspection et les services des P&T, au cœur de SUP'PTIC.",
  "home.projects.eyebrow": "Projets",
  "home.projects.title": "Ce que nous construisons",
  "home.projects.lead":
    "Des réalisations concrètes, portées par les pôles Innovation & Projets, Développement et Communication.",
  "home.projects.all": "Tous les projets",
  "home.events.eyebrow": "Activités",
  "home.events.title": "Prochains rendez-vous",
  "home.events.all": "Tous les événements",
  "home.gallery.eyebrow": "Galerie",
  "home.gallery.title": "La vie du club",
  "home.gallery.all": "Voir la galerie",
  "about.header.title": "À propos du Club",
  "about.header.lead":
    "Le Club Informatique de SUP'PTIC est une association étudiante ouverte à tous les cursus de l'école : ingénierie, inspection, techniques et exploitation. On y forme, on expérimente, on livre.",
  "about.story.title": "Notre histoire et notre mission",
  "about.story.p1":
    "Créé par des étudiants de SUP'PTIC, le Club est né d'un constat simple : les compétences se construisent en pratiquant, ensemble, sur des sujets réels. Ce qui a commencé comme un groupe de travail informel est devenu une structure organisée, dotée d'une charte, d'un bureau et de pôles opérationnels.",
  "about.story.p2":
    "Notre mission est de donner à chaque étudiant de l'école — ITT, IPT, masters, TT, CPT, ATT ou AEPT — un espace où apprendre, expérimenter et contribuer, du premier atelier à un projet utile à la communauté SUP'PTIC.",
  "about.story.p3":
    "Nos valeurs : la rigueur, le partage entre pairs, l'ouverture à tous les profils de l'école et l'engagement au service de SUP'PTIC.",
  "about.team.eyebrow": "Bureau",
  "about.team.title": "L'équipe qui porte le Club",
  "about.team.lead":
    "Le Bureau Exécutif représente les membres auprès de l'administration et coordonne la vie associative.",
  "about.charter.eyebrow": "Charte",
  "about.charter.title": "Nos cinq objectifs",
  "about.org.eyebrow": "Organisation",
  "about.org.title": "Un bureau, trois pôles",
  "about.org.lead":
    "Chaque membre rejoint un pôle selon ses centres d'intérêt — techniques, managériaux ou associatifs — et son temps disponible.",
  "about.partners.eyebrow": "Partenariats",
  "about.partners.title": "Un ancrage institutionnel",
  "about.partners.lead": "SUP'PTIC, MINPOSTEL, CAMTEL, CAMPOST et Huawei.",
  "about.alt.juio": "Le Club aux Journées universitaires de l'informatique 2026, Prix du meilleur projet",
  "about.alt.collab": "Rencontre entre le Club Informatique et un club partenaire",
  "footer.blurb":
    "{tagline}. Le Club Informatique fédère les étudiants de SUP'PTIC — tous campus, tous cycles — autour de projets concrets.",
  "footer.nav": "Navigation",
  "footer.contact": "Contact",
  "footer.form": "Formulaire de contact",
  "footer.campus": "SUP'PTIC — Yaoundé & Buea",
  "footer.rights": "Tous droits réservés.",
  "footer.legal":
    "Club étudiant reconnu par l'Administration SUP'PTIC et l'Association des Étudiants.",
  "footer.linkedin": "LinkedIn du Club",
  "footer.github": "GitHub du Club",
  "footer.mail": "Écrire au Club",
  "cta.title": "Envie de construire avec nous ?",
  "cta.lead":
    "Le Club est ouvert à tout étudiant régulièrement inscrit à SUP'PTIC : ingénieurs, inspecteurs, techniciens et agents d'exploitation, quel que soit le campus. Rejoins un pôle dès ce semestre.",
  "cta.join": "Rejoindre le club",
  "card.featured": "Projet phare",
  "card.sheet": "Voir la fiche",
  "card.github": "GitHub",
  "card.projectAlt": "Illustration du projet {name}",
  "status.ongoing": "En cours",
  "status.done": "Terminé",
  "filter.all": "Tous",
  "lang.fr": "FR",
  "lang.en": "EN",
  "lang.toggle": "Langue",
  "join.title": "Rejoindre le Club",
  "join.lead":
    "Ouvert à tout étudiant régulièrement inscrit à SUP'PTIC — Yaoundé ou Buea, ingénierie ou inspection, classique, alternance ou master. Aucune expérience technique n'est exigée.",
  "join.headTitle": "Rejoindre le Club Informatique SUP'PTIC",
  "join.headDesc":
    "Formulaire d'adhésion au Club Informatique SUP'PTIC, calé sur les cycles officiels de l'école (ingénieurs, inspecteurs, techniciens et agents d'exploitation).",
  "join.step1": "Identité & coordonnées",
  "join.lastName": "Nom de famille",
  "join.firstName": "Prénom(s)",
  "join.email": "Adresse e-mail",
  "join.phone": "Téléphone (WhatsApp)",
  "join.step2": "Cursus à SUP'PTIC",
  "join.campus": "Campus",
  "join.campusChoose": "Choisir le campus",
  "join.campusOf": "Campus de {name}",
  "join.cycle": "Cycle / diplôme préparé",
  "join.cycleChoose": "Sélectionner le cycle",
  "join.cycleNeedCampus": "Choisis d'abord le campus",
  "join.regime": "Régime d'études",
  "join.regimeChoose": "Classique, alternance…",
  "join.needCycle": "D'abord le cycle",
  "join.level": "Niveau actuel",
  "join.levelChoose": "Année en cours",
  "join.option": "Option / spécialité",
  "join.optionChoose": "Selon ton cycle",
  "join.step3": "Centres d'intérêt & expérience",
  "join.domain": "Centre d'intérêt principal",
  "join.domainHint":
    "Choisis ce que tu veux explorer au Club — pas seulement le code. Ingénieurs, inspecteurs, techniciens et agents d'exploitation ont tous leur place.",
  "join.suggested": "Suggéré pour ton cursus",
  "join.profile.engineering":
    "Profil ingénierie / technique (ITT, MIT, TT, ATT). Les thèmes numériques sont mis en avant, mais tu peux tout à fait choisir le management, l'inspection ou la vie du Club.",
  "join.profile.inspection":
    "Profil inspection, management ou exploitation (IPT, MAPT, CPT, AEPT). Le Club Informatique n'est pas réservé aux développeurs : régulation, gestion, transformation numérique, communication et projets t'y attendent aussi.",
  "join.experience": "Niveau d'expérience actuel",
  "join.pole": "Pôle d'affectation souhaité",
  "join.poleHint":
    "Les trois pôles du Club, ou l'option découverte si tu veux d'abord participer aux ateliers.",
  "join.step4": "Motivation & ambitions (facultatif)",
  "join.motivation": "Qu'aimerais-tu apprendre, construire ou apporter au Club ?",
  "join.motivationPh":
    "Ex. Ateliers, hackathons, transformation numérique, communication, projets d'école, cybersécurité, management des P&T…",
  "join.pledgeTitle": "Engagement et respect des textes du Club Informatique",
  "join.pledge":
    "Je confirme être régulièrement inscrit(e) à SUP'PTIC. J'ai pris connaissance de la {charte} et du {reglement}, et je m'engage à en respecter les principes de travail en équipe, d'assiduité et de déontologie (Art. 2 du Règlement).",
  "join.charter": "Charte du Club",
  "join.rules": "Règlement intérieur",
  "join.submit": "Soumettre mon adhésion",
  "join.sending": "Transmission en cours…",
  "join.privacy":
    "Les informations recueillies sont strictement confidentielles et réservées au Bureau Exécutif pour le traitement de l'adhésion ({email}).",
  "join.error.pledge":
    "Confirme ton engagement à respecter la Charte et le Règlement intérieur du Club.",
  "join.error.domain": "Sélectionne un centre d'intérêt principal.",
  "join.error.experience": "Indique ton niveau d'expérience.",
  "join.error.send": "L'envoi a échoué. Vérifie ta connexion et réessaie.",
  "join.done.title": "Candidature envoyée",
  "join.done.lead": "Merci pour ton intérêt pour le Club Informatique SUP'PTIC.",
  "join.done.hello": "C'est bien enregistré{name} !",
  "join.done.body": "Ta demande d'adhésion a été transmise au Bureau Exécutif.",
  "join.done.next": "Prochaines étapes :",
  "join.done.whatsapp":
    "Le Pôle Communication te contactera via WhatsApp ({phone}) pour t'intégrer à la communauté.",
  "join.done.sessions": "Tu seras invité(e) aux prochaines sessions d'accueil et ateliers.",
  "join.done.events": "Découvrir les prochains événements",
  "join.done.another": "Soumettre une autre demande",
  "join.info.school": "Formations {name}",
  "join.info.campuses": "Campus : Yaoundé & Buea",
  "join.info.yde": "Yaoundé : ITT, IPT, Masters (SERES, SRM, MAPT)",
  "join.info.buea": "Buea : TT, CPT, ATT, AEPT",
  "join.info.portal": "Portail académique ({host})",
  "join.info.docs": "Documents officiels",
  "join.info.docsLead":
    "Consulte les textes qui régissent le fonctionnement du Club :",
  "join.info.read": "Lire →",
  "contact.title": "Nous contacter",
  "contact.lead":
    "Entreprises, institutions, communautés tech ou étudiants : écrivez-nous pour un partenariat, un projet, une intervention ou toute autre question.",
  "contact.object": "Quel est l'objet de votre demande ?",
  "contact.cat.partenariat": "Partenariat & sponsoring",
  "contact.cat.projet": "Projet ou hackathon",
  "contact.cat.conference": "Intervention & conférence",
  "contact.cat.renseignement": "Renseignements généraux",
  "contact.ph.partenariat": "Proposition de partenariat, sponsoring ou collaboration",
  "contact.ph.projet": "Proposition de projet, hackathon ou concours",
  "contact.ph.conference": "Intervention en atelier, talk ou formation",
  "contact.ph.renseignement": "Question générale sur les activités du Club",
  "contact.name": "Nom complet ou interlocuteur",
  "contact.email": "Adresse e-mail",
  "contact.phone": "Téléphone / WhatsApp",
  "contact.optional": "(optionnel)",
  "contact.org": "Structure / entreprise / université",
  "contact.subject": "Objet précis du message",
  "contact.message": "Votre message",
  "contact.send": "Envoyer le message",
  "contact.sending": "Envoi en cours…",
  "contact.error": "L'envoi a échoué. Vérifiez votre connexion et réessayez.",
  "contact.sent.title": "Message transmis avec succès",
  "contact.sent.body":
    "Merci {name} ! Votre message a bien été transmis au Bureau Exécutif. Une réponse vous sera adressée sous 24h à 48h à {email}.",
  "contact.sent.again": "Envoyer un nouveau message",
  "contact.student.title": "Tu es étudiant(e) à SUP'PTIC ?",
  "contact.student.lead":
    "Pour adhérer au Club, utilise le formulaire d'adhésion plutôt que la messagerie générale.",
  "contact.student.cta": "Rejoindre le Club",
  "contact.channels": "Canaux directs",
  "contact.officialEmail": "Adresse e-mail officielle",
  "contact.copy": "Copier l'adresse",
  "contact.location": "Siège & localisation",
  "contact.locationValue": "SUP'PTIC — Campus principal de Yaoundé",
  "contact.locationDetail": "Route de l'Aéroport, Ngoa-Ekellé · Annexe de Buea",
  "contact.delay": "Délai de traitement",
  "contact.delayValue": "24h à 48h ouvrées",
  "contact.delayDetail": "Réponse par le Secrétariat Général ou le Pôle Communication",
  "contact.school": "Portail de l'école",
  "contact.online": "Présence en ligne",
  "contact.onlineLead": "Suivez nos projets et l'actualité du Club :",
  "contact.linkedin": "Page LinkedIn",
  "contact.github": "Organisation GitHub",
  "events.title": "Activités & événements",
  "events.lead":
    "Formations entre pairs, conférences, hackathons et visites — ouverts à tous les membres, tous cursus.",
  "events.upcoming": "À venir",
  "events.past": "Passés",
  "events.emptyUpcoming": "Aucun événement à venir dans cette catégorie.",
  "events.emptyPast": "Aucun événement passé dans cette catégorie.",
  "events.type.Tous": "Tous",
  "events.type.Formation": "Formation",
  "events.type.Conférence": "Conférence",
  "events.type.Hackathon": "Hackathon",
  "events.type.Atelier": "Atelier",
  "events.type.Visite": "Visite",
  "events.type.Collaboration": "Collaboration",
  "events.type.Concours": "Concours",
  "gallery.title": "Galerie",
  "gallery.lead":
    "Les moments qui font le Club : sessions de travail, formations, hackathons, conférences et rencontres.",
  "gallery.cat.Toutes": "Toutes",
  "gallery.cat.Événements": "Événements",
  "gallery.cat.Formations": "Formations",
  "gallery.cat.Projets": "Projets",
  "gallery.cat.Vie du club": "Vie du club",
  "gallery.expand": "Agrandir : {alt}",
  "gallery.close": "Fermer",
  "gallery.prev": "Image précédente",
  "gallery.next": "Image suivante",
  "projects.title": "Nos projets",
  "projects.lead":
    "Chaque projet est porté par une équipe de membres, du cadrage à la livraison. SUP'ONE AI est notre projet phare.",
  "projects.domain": "Domaine",
  "projects.status": "Statut",
  "projects.empty": "Aucun projet ne correspond à ces filtres pour le moment.",
  "projects.domain.Tous": "Tous",
  "projects.domain.Intelligence Artificielle": "Intelligence artificielle",
  "projects.domain.Développement logiciel": "Développement logiciel",
  "projects.domain.Cybersécurité": "Cybersécurité",
  "projects.domain.Électronique & IoT": "Électronique & IoT",
  "supone.crumb": "Fil d'Ariane",
  "supone.subtitle": "L'assistant intelligent des étudiants de SUP'PTIC",
  "supone.github": "Voir sur GitHub",
  "supone.repo": "Dépôt SUP'ONE AI",
  "supone.project": "Le projet",
  "supone.p1":
    "Trouver une information administrative ou pédagogique à SUP'PTIC prend souvent plusieurs jours : l'information circule entre affichages, groupes de discussion et documents dispersés. SUP'ONE AI répond à ce problème avec un assistant conversationnel qui interroge une base documentaire officielle et répond en français, en citant sa source.",
  "supone.approach": "Notre approche",
  "supone.p2":
    "L'assistant repose sur une architecture de recherche augmentée (RAG) : les documents de l'école sont découpés, vectorisés et interrogés à chaque question, avant qu'un modèle de langage ne formule une réponse ancrée dans ces extraits. Ce choix limite les réponses inventées et rend chaque réponse vérifiable.",
  "supone.tech": "Technologies",
  "supone.team": "Équipe porteuse",
  "supone.teamLead":
    "Pôle Innovation & Projets (cadrage et données) et Pôle Développement (backend, interface, déploiement), avec le soutien du Bureau Exécutif pour les relations avec l'administration.",
  "supone.status": "Statut",
  "supone.statusValue": "En cours — version bêta interne",
  "supone.start": "Démarrage",
  "supone.startValue": "Semestre 1, 2025",
  "supone.members": "Membres impliqués",
  "supone.membersValue": "9 étudiants",
  "supone.preview": "Aperçu",
  "supone.next": "Projet suivant",
  "supone.all": "Voir tous les projets",
  "supone.alt1": "Équipe du Club en session de travail sur SUP'ONE AI",
  "supone.alt2": "Réunion de travail du Club autour d'un projet logiciel",
} as const;

const en: { [K in keyof typeof fr]: string } = {
  "nav.home": "Home",
  "nav.about": "About",
  "nav.projects": "Projects",
  "nav.events": "Events",
  "nav.gallery": "Gallery",
  "nav.contact": "Contact",
  "nav.join": "Join",
  "nav.joinClub": "Join the club",
  "nav.menu": "Open menu",
  "nav.close": "Close menu",
  "nav.bureau": "Board area",
  "nav.logout": "Sign out",
  "nav.language": "Language",
  "hero.kicker": "SUP'PTIC · Yaoundé & Buea",
  "hero.lead":
    "The Club brings together SUP'PTIC students — engineers, inspectors, technicians and operations officers — around real projects: digital skills, networks, P&T management, communications and innovation. We train, experiment and ship.",
  "hero.discover": "Discover the club",
  "hero.projects": "Our projects",
  "hero.carousel": "Club highlights",
  "hero.photos": "Hero photos",
  "hero.prev": "Previous photo",
  "hero.next": "Next photo",
  "partners.label": "Partners",
  "home.about.eyebrow": "About",
  "home.about.title": "A student club, professional standards",
  "home.about.lead":
    "Born at SUP'PTIC, the Computer Club brings together students who want to learn by building. Our units work like a small organisation: scoping, delivery and communications.",
  "home.about.more": "Learn more",
  "home.value.practice": "Learn by doing",
  "home.value.peers": "Peer learning",
  "home.value.ship": "Ship useful projects",
  "home.groupAlt": "Members of the SUP'PTIC Computer Club in a group photo",
  "home.expertise.eyebrow": "Expertise",
  "home.expertise.title": "What we work on",
  "home.expertise.lead":
    "Digital skills, networks and innovation — and also P&T management, inspection and services, at the heart of SUP'PTIC.",
  "home.projects.eyebrow": "Projects",
  "home.projects.title": "What we build",
  "home.projects.lead":
    "Concrete work led by the Innovation & Projects, Development and Communications units.",
  "home.projects.all": "All projects",
  "home.events.eyebrow": "Activities",
  "home.events.title": "Upcoming dates",
  "home.events.all": "All events",
  "home.gallery.eyebrow": "Gallery",
  "home.gallery.title": "Club life",
  "home.gallery.all": "See the gallery",
  "about.header.title": "About the Club",
  "about.header.lead":
    "The SUP'PTIC Computer Club is a student association open to every programme at the school: engineering, inspection, technical and operations tracks. We train, experiment and ship.",
  "about.story.title": "Our story and mission",
  "about.story.p1":
    "Started by SUP'PTIC students, the Club grew from a simple idea: skills are built by practising together on real problems. An informal working group became an organised structure, with a charter, a board and operational units.",
  "about.story.p2":
    "Our mission is to give every student — ITT, IPT, master's, TT, CPT, ATT or AEPT — a place to learn, experiment and contribute, from a first workshop to a project that serves the SUP'PTIC community.",
  "about.story.p3":
    "Our values: rigour, peer sharing, openness to every profile at the school, and service to SUP'PTIC.",
  "about.team.eyebrow": "Board",
  "about.team.title": "The team that leads the Club",
  "about.team.lead":
    "The Executive Board represents members to the administration and coordinates club life.",
  "about.charter.eyebrow": "Charter",
  "about.charter.title": "Our five objectives",
  "about.org.eyebrow": "Organisation",
  "about.org.title": "One board, three units",
  "about.org.lead":
    "Each member joins a unit based on their interests — technical, managerial or community — and the time they can give.",
  "about.partners.eyebrow": "Partnerships",
  "about.partners.title": "An institutional foothold",
  "about.partners.lead": "SUP'PTIC, MINPOSTEL, CAMTEL, CAMPOST and Huawei.",
  "about.alt.juio": "The Club at the 2026 University Computer Days, Best Project Prize",
  "about.alt.collab": "Meeting between the Computer Club and a partner club",
  "footer.blurb":
    "{tagline}. The Computer Club brings together SUP'PTIC students — every campus, every programme — around concrete projects.",
  "footer.nav": "Navigation",
  "footer.contact": "Contact",
  "footer.form": "Contact form",
  "footer.campus": "SUP'PTIC — Yaoundé & Buea",
  "footer.rights": "All rights reserved.",
  "footer.legal":
    "Student club recognised by the SUP'PTIC Administration and the Students' Association.",
  "footer.linkedin": "Club LinkedIn",
  "footer.github": "Club GitHub",
  "footer.mail": "Email the Club",
  "cta.title": "Want to build with us?",
  "cta.lead":
    "The Club is open to every regularly enrolled SUP'PTIC student: engineers, inspectors, technicians and operations officers, on either campus. Join a unit this semester.",
  "cta.join": "Join the club",
  "card.featured": "Flagship project",
  "card.sheet": "View details",
  "card.github": "GitHub",
  "card.projectAlt": "Illustration of the {name} project",
  "status.ongoing": "In progress",
  "status.done": "Completed",
  "filter.all": "All",
  "lang.fr": "FR",
  "lang.en": "EN",
  "lang.toggle": "Language",
  "join.title": "Join the Club",
  "join.lead":
    "Open to every regularly enrolled SUP'PTIC student — Yaoundé or Buea, engineering or inspection, regular, work-study or master's. No prior technical experience required.",
  "join.headTitle": "Join the SUP'PTIC Computer Club",
  "join.headDesc":
    "Membership form for the SUP'PTIC Computer Club, aligned with the school's official programmes (engineers, inspectors, technicians and operations officers).",
  "join.step1": "Identity & contact details",
  "join.lastName": "Family name",
  "join.firstName": "Given name(s)",
  "join.email": "Email address",
  "join.phone": "Phone (WhatsApp)",
  "join.step2": "Your SUP'PTIC programme",
  "join.campus": "Campus",
  "join.campusChoose": "Choose a campus",
  "join.campusOf": "{name} campus",
  "join.cycle": "Programme / diploma",
  "join.cycleChoose": "Select your programme",
  "join.cycleNeedCampus": "Choose a campus first",
  "join.regime": "Study track",
  "join.regimeChoose": "Regular, work-study…",
  "join.needCycle": "Choose a programme first",
  "join.level": "Current year",
  "join.levelChoose": "Year of study",
  "join.option": "Option / specialisation",
  "join.optionChoose": "Depends on your programme",
  "join.step3": "Interests & experience",
  "join.domain": "Main area of interest",
  "join.domainHint":
    "Pick what you want to explore at the Club — not only coding. Engineers, inspectors, technicians and operations officers all belong here.",
  "join.suggested": "Suggested for your programme",
  "join.profile.engineering":
    "Engineering / technical profile (ITT, MIT, TT, ATT). Digital topics are highlighted, but you can just as well choose management, inspection or club life.",
  "join.profile.inspection":
    "Inspection, management or operations profile (IPT, MAPT, CPT, AEPT). The Computer Club is not only for developers: regulation, management, digital transformation, communications and projects are for you too.",
  "join.experience": "Current experience level",
  "join.pole": "Preferred unit",
  "join.poleHint":
    "The Club's three units, or the discovery option if you first want to join workshops.",
  "join.step4": "Motivation & ambitions (optional)",
  "join.motivation": "What would you like to learn, build or bring to the Club?",
  "join.motivationPh":
    "e.g. workshops, hackathons, digital transformation, communications, school projects, cybersecurity, P&T management…",
  "join.pledgeTitle": "Commitment to the Computer Club's rules",
  "join.pledge":
    "I confirm that I am regularly enrolled at SUP'PTIC. I have read the {charte} and the {reglement}, and I commit to teamwork, attendance and professional conduct (Art. 2 of the Internal Rules).",
  "join.charter": "Club Charter",
  "join.rules": "Internal Rules",
  "join.submit": "Submit my application",
  "join.sending": "Sending…",
  "join.privacy":
    "Information collected is confidential and used only by the Executive Board to process membership ({email}).",
  "join.error.pledge": "Please confirm that you will follow the Club Charter and Internal Rules.",
  "join.error.domain": "Please select a main area of interest.",
  "join.error.experience": "Please select your experience level.",
  "join.error.send": "Sending failed. Check your connection and try again.",
  "join.done.title": "Application sent",
  "join.done.lead": "Thank you for your interest in the SUP'PTIC Computer Club.",
  "join.done.hello": "You're in{name}!",
  "join.done.body": "Your membership request has been sent to the Executive Board.",
  "join.done.next": "Next steps:",
  "join.done.whatsapp":
    "The Communications unit will contact you on WhatsApp ({phone}) to welcome you into the community.",
  "join.done.sessions": "You will be invited to upcoming welcome sessions and workshops.",
  "join.done.events": "See upcoming events",
  "join.done.another": "Submit another application",
  "join.info.school": "{name} programmes",
  "join.info.campuses": "Campuses: Yaoundé & Buea",
  "join.info.yde": "Yaoundé: ITT, IPT, Master's (SERES, SRM, MAPT)",
  "join.info.buea": "Buea: TT, CPT, ATT, AEPT",
  "join.info.portal": "Academic portal ({host})",
  "join.info.docs": "Official documents",
  "join.info.docsLead": "Read the texts that govern how the Club works:",
  "join.info.read": "Read →",
  "contact.title": "Contact us",
  "contact.lead":
    "Companies, institutions, tech communities or students: write to us about a partnership, a project, a talk or any other question.",
  "contact.object": "What is your request about?",
  "contact.cat.partenariat": "Partnership & sponsoring",
  "contact.cat.projet": "Project or hackathon",
  "contact.cat.conference": "Talk & conference",
  "contact.cat.renseignement": "General enquiry",
  "contact.ph.partenariat": "Partnership, sponsoring or collaboration proposal",
  "contact.ph.projet": "Technical project, hackathon or contest proposal",
  "contact.ph.conference": "Workshop, talk or training session",
  "contact.ph.renseignement": "General question about Club activities",
  "contact.name": "Full name or contact person",
  "contact.email": "Email address",
  "contact.phone": "Phone / WhatsApp",
  "contact.optional": "(optional)",
  "contact.org": "Organisation / company / university",
  "contact.subject": "Message subject",
  "contact.message": "Your message",
  "contact.send": "Send message",
  "contact.sending": "Sending…",
  "contact.error": "Sending failed. Check your connection and try again.",
  "contact.sent.title": "Message sent",
  "contact.sent.body":
    "Thank you {name}! Your message has been forwarded to the Executive Board. You should hear back within 24–48 hours at {email}.",
  "contact.sent.again": "Send another message",
  "contact.student.title": "Are you a SUP'PTIC student?",
  "contact.student.lead":
    "To join the Club, use the membership form rather than this general inbox.",
  "contact.student.cta": "Join the Club",
  "contact.channels": "Direct channels",
  "contact.officialEmail": "Official email",
  "contact.copy": "Copy address",
  "contact.location": "Office & location",
  "contact.locationValue": "SUP'PTIC — Yaoundé main campus",
  "contact.locationDetail": "Airport Road, Ngoa-Ekellé · Buea annex",
  "contact.delay": "Response time",
  "contact.delayValue": "24 to 48 business hours",
  "contact.delayDetail": "Reply from the Secretary General or the Communications unit",
  "contact.school": "School portal",
  "contact.online": "Online presence",
  "contact.onlineLead": "Follow our projects and Club news:",
  "contact.linkedin": "LinkedIn page",
  "contact.github": "GitHub organisation",
  "events.title": "Activities & events",
  "events.lead":
    "Peer training, talks, hackathons and visits — open to every member, every programme.",
  "events.upcoming": "Upcoming",
  "events.past": "Past",
  "events.emptyUpcoming": "No upcoming events in this category.",
  "events.emptyPast": "No past events in this category.",
  "events.type.Tous": "All",
  "events.type.Formation": "Training",
  "events.type.Conférence": "Talk",
  "events.type.Hackathon": "Hackathon",
  "events.type.Atelier": "Workshop",
  "events.type.Visite": "Visit",
  "events.type.Collaboration": "Collaboration",
  "events.type.Concours": "Contest",
  "gallery.title": "Gallery",
  "gallery.lead":
    "The moments that make the Club: work sessions, training, hackathons, talks and meet-ups.",
  "gallery.cat.Toutes": "All",
  "gallery.cat.Événements": "Events",
  "gallery.cat.Formations": "Training",
  "gallery.cat.Projets": "Projects",
  "gallery.cat.Vie du club": "Club life",
  "gallery.expand": "Enlarge: {alt}",
  "gallery.close": "Close",
  "gallery.prev": "Previous image",
  "gallery.next": "Next image",
  "projects.title": "Our projects",
  "projects.lead":
    "Each project is led by a team of members, from scoping to delivery. SUP'ONE AI is our flagship.",
  "projects.domain": "Domain",
  "projects.status": "Status",
  "projects.empty": "No project matches these filters yet.",
  "projects.domain.Tous": "All",
  "projects.domain.Intelligence Artificielle": "Artificial intelligence",
  "projects.domain.Développement logiciel": "Software development",
  "projects.domain.Cybersécurité": "Cybersecurity",
  "projects.domain.Électronique & IoT": "Electronics & IoT",
  "supone.crumb": "Breadcrumb",
  "supone.subtitle": "The intelligent assistant for SUP'PTIC students",
  "supone.github": "View on GitHub",
  "supone.repo": "SUP'ONE AI repository",
  "supone.project": "The project",
  "supone.p1":
    "Finding academic or administrative information at SUP'PTIC often takes days: it is spread across notice boards, chat groups and scattered documents. SUP'ONE AI answers with a conversational assistant that queries an official knowledge base and replies in French, citing its source.",
  "supone.approach": "Our approach",
  "supone.p2":
    "The assistant uses retrieval-augmented generation (RAG): school documents are split, embedded and queried for each question, then a language model writes an answer grounded in those excerpts. That limits invented answers and keeps every reply checkable.",
  "supone.tech": "Technologies",
  "supone.team": "Core team",
  "supone.teamLead":
    "Innovation & Projects (scoping and data) and Development (backend, interface, deployment), with support from the Executive Board for relations with the administration.",
  "supone.status": "Status",
  "supone.statusValue": "In progress — internal beta",
  "supone.start": "Started",
  "supone.startValue": "Semester 1, 2025",
  "supone.members": "Members involved",
  "supone.membersValue": "9 students",
  "supone.preview": "Preview",
  "supone.next": "Next project",
  "supone.all": "See all projects",
  "supone.alt1": "Club team working on SUP'ONE AI",
  "supone.alt2": "Club working meeting on a software project",
};

const messages = { fr, en };

export type MessageKey = keyof typeof fr;

let locale: Locale = "fr";
const listeners = new Set<() => void>();

function readStored(): Locale {
  if (typeof window === "undefined") return "fr";
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "en" ? "en" : "fr";
}

if (typeof window !== "undefined") {
  locale = readStored();
}

function emit() {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
  listeners.forEach((l) => l());
}

export function setLocale(next: Locale) {
  locale = next;
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, next);
  emit();
}

export function toggleLocale() {
  setLocale(locale === "fr" ? "en" : "fr");
}

function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function t(key: MessageKey, lang: Locale = locale, vars?: Record<string, string>): string {
  return interpolate(messages[lang][key], vars);
}

export function useLocale() {
  const current = useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => locale,
    () => "fr" as Locale,
  );

  return {
    locale: current,
    setLocale,
    toggleLocale,
    t: (key: MessageKey, vars?: Record<string, string>) => t(key, current, vars),
  };
}
