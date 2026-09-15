import projectSupone from "@/assets/images/projects/supone.jpeg";
import projectCyber from "@/assets/images/projects/cyberveille.jpg";
import projectIot from "@/assets/images/projects/campus-iot.jpg";
import projectLekki from "@/assets/images/projects/lekki.jpeg";
import projectShopkamer from "@/assets/images/projects/shopkamer.jpeg";
import projectSyntra from "@/assets/images/projects/syntra.jpeg";
import sango from "@/assets/images/projects/sango.jpeg";
import galleryHackathon from "@/assets/images/gallery/hackathon.jpg";
import galleryFormation from "@/assets/images/gallery/formation.jpg";
import galleryTeam from "@/assets/images/gallery/team.jpg";
import galleryConference from "@/assets/images/gallery/conference.jpg";
import galleryTalk from "@/assets/images/gallery/talk.jpg";
import gallerySpeaker from "@/assets/images/gallery/speaker.jpg";
import galleryGroup from "@/assets/images/gallery/group.jpg";
import galleryLab from "@/assets/images/gallery/lab.jpg";
import galleryMeeting from "@/assets/images/gallery/meeting.jpg";
import galleryCollabGi from "@/assets/images/gallery/collab-club-gi.jpg";
import galleryCollabDelegation from "@/assets/images/gallery/collab-delegation.jpg";
import galleryHandshake from "@/assets/images/gallery/collab-handshake.jpg";
import galleryRackTeam from "@/assets/images/gallery/rack-team.jpg";
import galleryJuioPrize from "@/assets/images/gallery/juio-prize.jpg";
import galleryJuioWinners from "@/assets/images/gallery/juio-winners.jpg";
import galleryJuioPitch from "@/assets/images/gallery/juio-pitch.jpg";
import galleryJuioTalk from "@/assets/images/gallery/juio-talk.jpg";
import galleryJuioLab from "@/assets/images/gallery/juio-lab.jpg";
import galleryJuioHuddle from "@/assets/images/gallery/juio-huddle.jpg";
import gallerySyntraPitch from "@/assets/images/gallery/syntra-pitch.jpg";
import galleryGalerie1 from "@/assets/images/gallery/galerie-1.jpg";
import galleryGalerie2 from "@/assets/images/gallery/galerie-2.jpg";
import galleryGalerie3 from "@/assets/images/gallery/galerie-3.jpg";
import galleryGalerie4 from "@/assets/images/gallery/galerie-4.jpg";
import galleryGalerie5 from "@/assets/images/gallery/galerie-5.jpg";
import president from "@/assets/images/people/president.jpg";
import presidentPortrait from "@/assets/images/people/president-portrait.jpg";
import memberPolo from "@/assets/images/people/member-polo.jpg";
import memberBlackTee from "@/assets/images/people/member-black-tee.jpg";
import memberKeumekaWilfried from "@/assets/images/people/keumeka-wilfried.jpg";
import memberEvinaMbahoEric from "@/assets/images/people/evina-mbaho-eric.jpg";
import memberOlamaVictoire from "@/assets/images/people/olama-victoire.jpg";
import memberDanielBenny from "@/assets/images/people/daniel-benny.jpg";
import memberFowaMichelleRosee from "@/assets/images/people/fowa-michelle-rosee.jpg";
import memberMbousekeAnge from "@/assets/images/people/mbouseke-ange.jpg";
import chargeact from "@/assets/images/people/chargeact.jpg";
import vicepr from "@/assets/images/people/vicepr.jpg";
import memberNkoumouTjadeGrinnel from "@/assets/images/people/nkoumou-tjade-grinnel.jpg";
import logoSupptic from "@/assets/images/partners/supptic.jpeg";
import logoMinpostel from "@/assets/images/partners/minpostel.jpeg";
import logoCamtel from "@/assets/images/partners/camtel.png";
import logoCampost from "@/assets/images/partners/campost.jpeg";
import logoHuawei from "@/assets/images/partners/huawei.jpeg";

import type { L10n } from "@/lib/locale-text";


export const club = {
  name: "Club Informatique SUP'PTIC",
  short: "Club Info SUP'PTIC",
  tagline: "Une école, un esprit, une intelligence",
  taglineEn: "One school, one spirit, one intelligence",
  email: "clubinfosupptic@gmail.com",
  linkedin: "https://www.linkedin.com/company/club-info-supptic",
  github: "https://github.com/nkoumougrinnel/SupOneAI",
  schoolUrl: "https://e-supptic.cm",
  schoolEmail: "contact@e-supptic.cm",
  schoolPhone: "+237 222 233 700",
};

export const expertise = [
  {
    icon: "code",
    title: "Développement logiciel",
    titleEn: "Software development",
    description:
      "Conception d'applications web, d'API et de plateformes complètes, du prototype au déploiement.",
    descriptionEn:
      "Web and mobile apps, from prototype to shipped product, with real teamwork practices.",
  },
  {
    icon: "brain",
    title: "Intelligence artificielle & données",
    titleEn: "Artificial intelligence & data",
    description:
      "RAG, assistants intelligents, machine learning et analyse de données appliqués à des problèmes concrets.",
    descriptionEn:
      "RAG, intelligent assistants, machine learning and data analysis applied to concrete problems.",
  },
  {
    icon: "shield",
    title: "Cybersécurité",
    titleEn: "Cybersecurity",
    description:
      "Sensibilisation à la cybersécurité, développement sécurisé, authentification et protection des données.",
    descriptionEn:
      "Cybersecurity awareness, secure development, authentication and data protection.",
  },
  {
    icon: "network",
    title: "Réseaux & systèmes",
    titleEn: "Networks & systems",
    description:
      "Infrastructures, protocoles, services réseau et systèmes connectés au service des applications.",
    descriptionEn:
      "Infrastructure, protocols, network services and connected systems supporting applications.",
  },
  {
    icon: "cpu",
    title: "Électronique & IoT",
    titleEn: "Electronics & IoT",
    description:
      "Exploration des capteurs, systèmes embarqués et objets connectés à travers des prototypes appliqués.",
    descriptionEn:
      "Exploration of sensors, embedded systems and connected objects through applied prototypes.",
  },
  {
    icon: "lightbulb",
    title: "Innovation appliquée",
    titleEn: "Applied innovation",
    description:
      "Prototypage rapide et transformation de problèmes locaux en solutions numériques utiles.",
    descriptionEn:
      "Rapid prototyping and turning local problems into useful digital solutions.",
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  subtitle: string;
  subtitleEn: string;
  summary: string;
  summaryEn: string;
  status: "En cours" | "Terminé";
  domain: string;
  domainEn: string;
  tags: string[];
  image: string;
  featured?: boolean;
  href?: string;
  github?: string;
  detailedDescription?: string;
  approach?: string;
  features?: string[];
};

export const projects: Project[] = [
  {
    slug: "supone-ai",
    name: "SUP'ONE AI",
    subtitle: "L'assistant intelligent des étudiants de SUP'PTIC",
    subtitleEn: "The intelligent assistant for SUP'PTIC students",
    summary:
      "Un assistant conversationnel qui centralise l'information académique de l'école et répond aux questions des étudiants en langage naturel.",
    summaryEn:
      "A conversational assistant that centralises the school's academic information and answers student questions in natural language.",
    status: "En cours",
    domain: "Intelligence Artificielle",
    domainEn: "Artificial intelligence",
    tags: ["Python", "LLM", "RAG", "React", "FastAPI"],
    image: projectSupone,
    featured: true,
    href: "/projects/supone-ai",
    github: "https://github.com/nkoumougrinnel/SupOneAI",
  },
  {
    slug: "campusflow",
    name: "CampusFlow",
    subtitle: "Intelligence et sécurité pour campus intelligents",
    subtitleEn: "Intelligence and security for smart campuses",
    summary:
      "Plateforme alimentée par l'IA pour unifier les données d'identité, détecter les anomalies et analyser les espaces du campus.",
    summaryEn:
      "An AI-powered platform that unifies identity data, detects anomalies and analyses campus spaces.",
    status: "En cours",
    domain: "Intelligence artificielle & données",
    domainEn: "Artificial intelligence & data",
    tags: ["React", "FastAPI", "PyTorch", "PostgreSQL", "Supabase"],
    image: projectIot,
    github: "https://github.com/Ruvaifa/campusflow",
    detailedDescription: "CampusFlow unifie des sources de données de campus pour fournir une résolution d'entités en temps réel, une analyse spatiale prédictive et une détection d'anomalies.",
    approach: "La plateforme combine plusieurs modèles d'apprentissage automatique et des données issues des cartes, du WiFi, de la vidéosurveillance et des réservations de laboratoire.",
    features: ["Fusion multi-sources", "Détection d'anomalies", "Carte interactive", "Alertes intelligentes"],
  },
  {
    slug: "lekki-wiki",
    name: "Lekki Wiki",
    subtitle: "Base de connaissances d'entreprise avec assistant IA",
    subtitleEn: "Enterprise knowledge base with an AI assistant",
    summary:
      "Gestion documentaire Markdown-first avec assistant RAG capable de répondre aux questions en citant ses sources.",
    summaryEn:
      "Markdown-first document management with a RAG assistant that answers questions with cited sources.",
    status: "En cours",
    domain: "Développement logiciel",
    domainEn: "Software development",
    tags: ["FastAPI", "React", "SQLite", "LangChain", "Gemini"],
    image: projectLekki,
    github: "https://github.com/nkoumougrinnel/Lekki",
    detailedDescription: "Lekki Wiki associe une gestion documentaire Markdown-first à un assistant IA qui répond à partir du contenu de l'organisation et cite ses sources.",
    approach: "Les documents sont découpés et indexés pour permettre une recherche plein texte et sémantique, avec plusieurs fournisseurs LLM en repli automatique.",
    features: ["Pages Markdown", "Assistant avec sources", "Recherche FTS5", "Gestion des rôles"],
  },
  {
    slug: "healthmesh",
    name: "HealthMesh",
    subtitle: "Triage médical d'urgence par IA pour zones rurales",
    subtitleEn: "AI emergency triage for rural areas",
    summary:
      "Application de triage d'urgence pour agents de santé, avec analyse intelligente, fonctionnement hors-ligne et tableau de bord spécialiste.",
    summaryEn:
      "An emergency triage application for health workers with intelligent analysis, offline support and a specialist dashboard.",
    status: "En cours",
    domain: "Intelligence artificielle & données",
    domainEn: "Artificial intelligence & data",
    tags: ["Node.js", "React", "PostgreSQL", "Socket.IO", "Docker"],
    image: projectSupone,
    github: "https://github.com/nkoumougrinnel/HealthMesh",
    detailedDescription: "HealthMesh est une application de triage médical d'urgence conçue pour les zones rurales, avec une application pour les agents de santé et un tableau de bord pour les spécialistes.",
    approach: "Un moteur de règles hors-ligne analyse les constantes critiques tandis que la synchronisation conserve le fonctionnement dans les zones à connectivité limitée.",
    features: ["Triage hors-ligne", "Alertes colorées", "Suivi des patients", "Synchronisation temps réel"],
  },
  {
    slug: "shopkamer",
    name: "ShopKamer",
    subtitle: "Plateforme de e-commerce",
    subtitleEn: "E-commerce platform",
    summary:
      "Site e-commerce développé dans le cadre du premier atelier du Club pour mettre en pratique les bases du développement web.",
    summaryEn:
      "An e-commerce website developed during the Club's first workshop to practise web development fundamentals.",
    status: "Terminé",
    domain: "Développement logiciel",
    domainEn: "Software development",
    tags: ["HTML", "CSS", "JavaScript", "PHP", "SQL"],
    image: projectShopkamer,
    github: "https://github.com/nkoumougrinnel/ShopKamer",
    detailedDescription: "ShopKamer est une plateforme e-commerce développée pendant le premier atelier du Club.",
    approach: "Le projet accompagne les débutants à travers la conception d'une interface, la gestion des produits et la persistance des données.",
    features: ["Catalogue produits", "Interface web", "Gestion des données", "Projet pédagogique"],
  },
  {
    slug: "sango",
    name: "Sango",
    subtitle: "Routage intelligent pour véhicules de secours",
    subtitleEn: "Intelligent routing for emergency vehicles",
    summary:
      "Système de routage en temps réel pour ambulances et pompiers, capable de s'adapter aux conditions changeantes.",
    summaryEn:
      "A real-time routing system for ambulances and firefighters that adapts to changing conditions.",
    status: "En cours",
    domain: "Intelligence artificielle & données",
    domainEn: "Artificial intelligence & data",
    tags: ["React", "TypeScript", "Python", "Vite"],
    image: sango,
    github: "https://github.com/nkoumougrinnel/Sango",
    detailedDescription: "Sango explore le routage intelligent pour les véhicules de secours, en tenant compte du trafic, de la météo, des incidents et de la qualité variable des routes.",
    approach: "Le système réévalue le meilleur itinéraire quand les conditions changent et explique les choix effectués.",
    features: ["Routage dynamique", "Adaptation aux incidents", "Décisions explicables", "Scénarios de simulation"],
  },
  {
    slug: "syntra",
    name: "Syntra",
    subtitle: "Le messager technique sécurisé",
    subtitleEn: "The secure technical messenger",
    summary:
      "CommHQ — messagerie d'entreprise en temps réel (canaux, Markdown, code, bot IA), présentée aux Journées universitaires de l'informatique 2026.",
    summaryEn:
      "CommHQ — real-time workplace messaging (channels, Markdown, code, AI bot), presented at the 2026 University Computer Days.",
    status: "Terminé",
    domain: "Développement logiciel",
    domainEn: "Software development",
    tags: ["React", "NestJS", "Socket.IO", "MongoDB"],
    image: projectSyntra,
    github: "https://github.com/DanielBeni-tech/CommHQ",
  },
];

export type ClubEvent = {
  title: string;
  titleEn: string;
  date: string;
  displayDate: string;
  displayDateEn: string;
  type:
    | "Formation"
    | "Atelier"
    | "Concours"
    | "Présentation"
    | "Collaboration";
  description: string;
  descriptionEn: string;
  image?: string;
  upcoming: boolean;
};

export const events: ClubEvent[] = [
  {
    title: "Journée de présentation des projets",
    titleEn: "Project presentation day",
    date: "",
    displayDate: "Date à confirmer",
    displayDateEn: "Date to be confirmed",
    type: "Présentation",
    description:
      "Une journée dédiée à la présentation des projets portés par les membres du Club et à la découverte des solutions développées par les équipes.",
    descriptionEn:
      "A day dedicated to presenting projects built by Club members and discovering the solutions developed by the teams.",
    image: galleryJuioPitch,
    upcoming: true,
  },
  {
    title: "SUP'ONE Challenge",
    titleEn: "SUP'ONE Challenge",
    date: "",
    displayDate: "Date à confirmer",
    displayDateEn: "Date to be confirmed",
    type: "Concours",
    description:
      "Un challenge pour mettre en valeur les compétences et les projets des membres du club et de l'ensemble de la communauté SUP’PTIC.",
    descriptionEn:
      "A challenge to highlight the skills and projects of club members and the wider SUP’PTIC community.",
    image: galleryHackathon,
    upcoming: true,
  },
  {
    title: "Journées universitaires de l'informatique (JUIN)",
    titleEn: "University Computer Days",
    date: "",
    displayDate: "Édition passée",
    displayDateEn: "2026 edition",
    type: "Concours",
    description:
      "Participation du Club aux Journées universitaires de l'informatique, avec présentation des projets et échanges autour de l'innovation numérique.",
    descriptionEn:
      "The Club took part in the University Computer Days, presenting projects and exchanging around digital innovation.",
    image: galleryJuioPrize,
    upcoming: false,
  },
  {
    title: "Atelier ShopKamer",
    titleEn: "ShopKamer workshop",
    date: "",
    displayDate: "Édition passée",
    displayDateEn: "Past edition",
    type: "Atelier",
    description:
      "Atelier pratique consacré à la réalisation de ShopKamer, une plateforme e-commerce permettant aux membres de travailler les bases du développement web.",
    descriptionEn:
      "A practical workshop focused on building ShopKamer, an e-commerce platform for practising web development fundamentals.",
    image: galleryLab,
    upcoming: false,
  },
  {
    title: "Première présentation du projet chatbot",
    titleEn: "First chatbot project presentation",
    date: "",
    displayDate: "Édition passée",
    displayDateEn: "Past edition",
    type: "Présentation",
    description:
      "Présentation du projet chatbot aux membres du Club, suivie d'un échange sur ses objectifs et ses prochaines évolutions.",
    descriptionEn:
      "Presentation of the chatbot project to Club members, followed by a discussion about its goals and next steps.",
    image: galleryMeeting,
    upcoming: false,
  },
  {
    title: "Rencontre entre le Club Informatique et le Club GI",
    titleEn: "Meeting between the Computer Club and the GI Club",
    date: "",
    displayDate: "Édition passée",
    displayDateEn: "Past edition",
    type: "Collaboration",
    description:
      "Rencontre entre le Club Informatique et le Club GI pour partager les expériences, rapprocher les membres et explorer des pistes de collaboration.",
    descriptionEn:
      "A meeting between the Computer Club and the GI Club to share experiences, connect members and explore collaboration opportunities.",
    image: galleryCollabGi,
    upcoming: false,
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  altEn: string;
  category: "Événements" | "Formations" | "Projets" | "Vie du club";
};

export const gallery: GalleryItem[] = [
  {
    src: galleryJuioPrize,
    alt: "L'équipe du Club autour du Prix du meilleur projet aux Journées universitaires de l'informatique 2026",
    altEn: "The Club around the Best Project Prize at the 2026 University Computer Days",
    category: "Événements",
  },
  {
    src: galleryGroup,
    alt: "Photo de groupe des membres du Club Informatique SUP'PTIC",
    altEn: "Group photo of SUP'PTIC Computer Club members",
    category: "Vie du club",
  },
  {
    src: galleryJuioWinners,
    alt: "Équipe lauréate du Prix du meilleur projet, chèque de 100 000 FCFA",
    altEn: "Winning team of the Best Project Prize, 100,000 FCFA cheque",
    category: "Événements",
  },
  {
    src: gallerySyntraPitch,
    alt: "Présentation de Syntra, le messager technique sécurisé",
    altEn: "Presentation of Syntra, the secure technical messenger",
    category: "Projets",
  },
  {
    src: galleryJuioPitch,
    alt: "Pitch projet devant l'amphithéâtre, écran et micros",
    altEn: "Project pitch in the lecture hall, screen and microphones",
    category: "Événements",
  },
  {
    src: galleryJuioHuddle,
    alt: "Travail en équipe autour d'un ordinateur pendant un hackathon",
    altEn: "Teamwork around a laptop during a hackathon",
    category: "Projets",
  },
  {
    src: galleryJuioTalk,
    alt: "Présentation Impact social et humain en salle informatique",
    altEn: "Talk on social and human impact in the computer lab",
    category: "Formations",
  },
  {
    src: galleryJuioLab,
    alt: "Participants en salle informatique pendant une journée universitaire",
    altEn: "Participants in the computer lab during a university day",
    category: "Formations",
  },
  {
    src: galleryCollabGi,
    alt: "Rencontre entre le Club Informatique et un club partenaire",
    altEn: "Meeting between the Computer Club and a partner club",
    category: "Événements",
  },
  {
    src: galleryCollabDelegation,
    alt: "Délégation du Club lors d'une rencontre inter-clubs",
    altEn: "Club delegation at an inter-club meeting",
    category: "Événements",
  },
  {
    src: galleryHandshake,
    alt: "Poignée de main à l'issue d'une collaboration inter-clubs",
    altEn: "Handshake after an inter-club collaboration",
    category: "Événements",
  },
  {
    src: galleryMeeting,
    alt: "Réunion de travail du Club autour d'une table, ordinateurs ouverts",
    altEn: "Club working meeting around a table, laptops open",
    category: "Projets",
  },
  {
    src: galleryLab,
    alt: "Session en salle informatique : étudiants et encadrants",
    altEn: "Computer-lab session: students and mentors",
    category: "Formations",
  },
  {
    src: galleryRackTeam,
    alt: "Membres du Club devant une baie de télécommunications",
    altEn: "Club members in front of a telecoms rack",
    category: "Vie du club",
  },
  {
    src: galleryFormation,
    alt: "Membres du Club en salle informatique pendant une session de formation",
    altEn: "Club members in the computer lab during a training session",
    category: "Formations",
  },
  {
    src: gallerySpeaker,
    alt: "Échange entre un intervenant et les étudiants en salle de cours",
    altEn: "Exchange between a speaker and students in a classroom",
    category: "Formations",
  },
  {
    src: galleryHackathon,
    alt: "Briefing d'équipe avant une présentation, ordinateur et projecteur",
    altEn: "Team briefing before a presentation, laptop and projector",
    category: "Événements",
  },
  {
    src: galleryConference,
    alt: "Prise de parole lors d'une présentation organisée par le Club",
    altEn: "Speaker at a presentation organised by the Club",
    category: "Événements",
  },
  {
    src: galleryTalk,
    alt: "Atelier du Club : présentation devant le tableau et le matériel",
    altEn: "Club workshop: presentation at the board with equipment",
    category: "Événements",
  },
  {
    src: galleryTeam,
    alt: "Session de travail autour d'un projet logiciel",
    altEn: "Working session on a software project",
    category: "Projets",
  },
  {
    src: president,
    alt: "MESSI OVAH FRED, président du Club Informatique SUP'PTIC",
    altEn: "MESSI OVAH FRED, president of the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
  {
    src: galleryGalerie1,
    alt: "Galerie 1 — Moments du Club Informatique SUP'PTIC",
    altEn: "Gallery 1 — Moments from the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
  {
    src: galleryGalerie2,
    alt: "Galerie 2 — Moments du Club Informatique SUP'PTIC",
    altEn: "Gallery 2 — Moments from the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
  {
    src: galleryGalerie3,
    alt: "Galerie 3 — Moments du Club Informatique SUP'PTIC",
    altEn: "Gallery 3 — Moments from the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
  {
    src: galleryGalerie4,
    alt: "Galerie 4 — Moments du Club Informatique SUP'PTIC",
    altEn: "Gallery 4 — Moments from the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
  {
    src: galleryGalerie5,
    alt: "Galerie 5 — Moments du Club Informatique SUP'PTIC",
    altEn: "Gallery 5 — Moments from the SUP'PTIC Computer Club",
    category: "Vie du club",
  },
];

export const bureau = [
  {
    name: "MESSI OVAH FRED",
    role: "Président du Club Informatique",
    roleEn: "President of the Computer Club",
    image: presidentPortrait,
  },
  {
    name: "NKOUMOU TJADE GRINNEL",
    role: "Vice-président",
    roleEn: "Vice President",
    image: vicepr,
  },
  {
    name: "EVINA MBAHO ERIC",
    role: "Secrétaire général",
    roleEn: "Secretary General",
    image: memberEvinaMbahoEric,
  },
  {
    name: "OLAMA VICTOIRE",
    role: "Chef du Pôle Développement",
    roleEn: "Head of Development",
    image: memberOlamaVictoire,
  },
  {
    name: "KEUMEKA SOKING WILFRIED",
    role: "Chef du Pôle Communication",
    roleEn: "Head of Communications",
    image: memberKeumekaWilfried,
  },
  {
    name: "FOWA MICHELLE ROSEE",
    role: "Chargé des relations extérieures",
    roleEn: "External Relations Officer",
    image: memberFowaMichelleRosee,
  },
  {
    name: "NJIMONGBA ABDOU",
    role: "Chef Pôle Innovation Projet",
    roleEn: "Head of Innovation & Projects",
    image: memberBlackTee,
  },
  {
    name: "MBOUSEKE ANGE",
    role: "Trésorière IT",
    roleEn: "IT Treasurer",
    image: memberMbousekeAnge,
  },
  {
    name: "Soundjock Ndzana Marie",
    role: "Chargé des activités",
    roleEn: "Activities Manager",
    image: chargeact,
  },
  {
    name: "DANIEL BENI",
    role: "Conseiller spécial",
    roleEn: "Special Advisor",
    image: memberDanielBenny,
  },
  
];

export const poles = [
  {
    name: "Bureau Exécutif",
    nameEn: "Executive Board",
    role: "Coordonne la vie du Club, représente les membres auprès de l'administration et garantit le respect de la Charte.",
    roleEn:
      "Coordinates club life, represents members to the administration and upholds the Charter.",
    image: galleryRackTeam,
  },
  {
    name: "Pôle Innovation & Projets",
    nameEn: "Innovation & Projects",
    role: "Fait émerger les idées, cadre les projets et accompagne les équipes jusqu'à la livraison.",
    roleEn: "Shapes ideas, frames projects and supports teams through to delivery.",
    image: galleryJuioWinners,
  },
  {
    name: "Pôle Développement",
    nameEn: "Development",
    role: "Conçoit et code les solutions du Club, et anime les formations techniques auprès des membres.",
    roleEn: "Designs and builds the Club's solutions, and runs technical training for members.",
    image: galleryJuioHuddle,
  },
  {
    name: "Pôle Communication",
    nameEn: "Communications",
    role: "Anime les réseaux, organise les événements et assure le suivi des candidatures d'adhésion.",
    roleEn: "Runs social channels, organises events and follows up membership applications.",
    image: galleryCollabDelegation,
  },
];

export const objectives: L10n[] = [
  {
    fr: "Fédérer les étudiants de SUP'PTIC — ingénieurs, inspecteurs, techniciens et agents d'exploitation — autour de projets concrets.",
    en: "Bring together SUP'PTIC students — engineers, inspectors, technicians and operations officers — around concrete projects.",
  },
  {
    fr: "Renforcer les compétences, numériques et professionnelles, par la formation entre pairs.",
    en: "Build digital and professional skills through peer training.",
  },
  {
    fr: "Porter des projets utiles à l'école, à l'administration des P&T et à leur écosystème.",
    en: "Deliver projects that are useful to the school, P&T administration and their ecosystem.",
  },
  {
    fr: "Créer des ponts avec les entreprises, les institutions et les communautés tech.",
    en: "Build bridges with companies, institutions and tech communities.",
  },
  {
    fr: "Valoriser l'image de SUP'PTIC et de tous ses cursus.",
    en: "Promote SUP'PTIC and every programme it offers.",
  },
];

export const heroSlides = [
  {
    src: galleryJuioPrize,
    caption: "Prix du meilleur projet · JUIO 2026",
    captionEn: "Best project prize · JUIO 2026",
    focus: "center 38%",
  },
  {
    src: galleryJuioTalk,
    caption: "Présentation en salle informatique",
    captionEn: "Talk in the computer lab",
    focus: "center 40%",
  },
  {
    src: galleryJuioWinners,
    caption: "Lauréats · 100 000 FCFA",
    captionEn: "Winners · 100,000 FCFA",
    focus: "center 42%",
  },
  {
    src: galleryJuioPitch,
    caption: "Présentation en amphithéâtre",
    captionEn: "Presentation in the lecture hall",
    focus: "center 40%",
  },
  {
    src: galleryJuioHuddle,
    caption: "Équipe au travail pendant l'événement",
    captionEn: "Team working during the event",
    focus: "center 50%",
  },
  {
    src: galleryGroup,
    caption: "Le Club Informatique SUP'PTIC",
    captionEn: "The SUP'PTIC Computer Club",
    focus: "center 58%",
  },
] as const;

export const stats = [
  { value: "2021", label: "Année de création", labelEn: "Year founded" },
  { value: "120+", label: "Membres actifs", labelEn: "Active members" },
  { value: "15", label: "Projets menés", labelEn: "Projects delivered" },
  { value: "3", label: "Pôles opérationnels", labelEn: "Operational units" },
];

export type Partner = {
  name: string;
  role: string;
  roleEn: string;
  href?: string;
  logo?: string;
};

export const partners: Partner[] = [
  {
    name: "SUP'PTIC",
    role: "École d'accueil — Yaoundé & Buea",
    roleEn: "Host school — Yaoundé & Buea",
    href: "https://e-supptic.cm",
    logo: logoSupptic,
  },
  {
    name: "MINPOSTEL",
    role: "Ministère de tutelle",
    roleEn: "Supervising ministry",
    logo: logoMinpostel,
  },
  {
    name: "CAMTEL",
    role: "Opérateur historique des télécoms",
    roleEn: "Historic telecom operator",
    href: "https://www.camtel.cm",
    logo: logoCamtel,
  },
  {
    name: "CAMPOST",
    role: "Opérateur postal national",
    roleEn: "National postal operator",
    href: "https://www.campost.cm",
    logo: logoCampost,
  },
  {
    name: "Huawei",
    role: "Partenaire formation et technologie",
    roleEn: "Training and technology partner",
    logo: logoHuawei,
  },
];

export const school = {
  name: "SUP'PTIC",
  fullName:
    "École Nationale Supérieure des Postes, des Télécommunications et des Technologies de l'Information et de la Communication",
  fullNameEn:
    "National Advanced School of Posts, Telecommunications and Information and Communication Technologies",
  url: "https://e-supptic.cm",
  campuses: ["Yaoundé", "Buea"] as const,
  cursus: ["Ingénierie", "Management"] as const,
};

export const engineeringCycles = ["ITT", "MIT", "TT", "ATT"] as const;
export const inspectionCycles = ["IPT", "MAPT", "CPT", "AEPT"] as const;

export type JoinProfile = "engineering" | "inspection";

export function joinProfile(cycle: string): JoinProfile | null {
  if ((engineeringCycles as readonly string[]).includes(cycle)) return "engineering";
  if ((inspectionCycles as readonly string[]).includes(cycle)) return "inspection";
  return null;
}

export const joinChoiceLabels: Record<string, L10n> = {
  Classique: { fr: "Classique", en: "Regular" },
  Alternance: { fr: "Alternance", en: "Work-study" },
  Concours: { fr: "Concours", en: "Competitive exam" },
  "Admission directe": { fr: "Admission directe", en: "Direct admission" },
  "1re année (ITT1)": { fr: "1re année (ITT1)", en: "1st year (ITT1)" },
  "2e année (ITT2)": { fr: "2e année (ITT2)", en: "2nd year (ITT2)" },
  "3e année (ITT3)": { fr: "3e année (ITT3)", en: "3rd year (ITT3)" },
  "1re année (IPT1)": { fr: "1re année (IPT1)", en: "1st year (IPT1)" },
  "2e année (IPT2)": { fr: "2e année (IPT2)", en: "2nd year (IPT2)" },
  "3e année (IPT3)": { fr: "3e année (IPT3)", en: "3rd year (IPT3)" },
  "Master 1": { fr: "Master 1", en: "Master 1" },
  "Master 2": { fr: "Master 2", en: "Master 2" },
  "1re année": { fr: "1re année", en: "1st year" },
  "2e année": { fr: "2e année", en: "2nd year" },
  "Tronc commun (1re année)": { fr: "Tronc commun (1re année)", en: "Common core (1st year)" },
  "Informatique et réseaux (IR)": { fr: "Informatique et réseaux (IR)", en: "IT and networks (IR)" },
  "Réseaux et télécommunications (RT)": {
    fr: "Réseaux et télécommunications (RT)",
    en: "Networks and telecommunications (RT)",
  },
  "Radiocommunication (RC)": { fr: "Radiocommunication (RC)", en: "Radiocommunication (RC)" },
  "Management (MGT)": { fr: "Management (MGT)", en: "Management (MGT)" },
  "Comptabilité et Finances (CF)": {
    fr: "Comptabilité et Finances (CF)",
    en: "Accounting and Finance (CF)",
  },
  "Logistique et Transport (LT)": {
    fr: "Logistique et Transport (LT)",
    en: "Logistics and Transport (LT)",
  },
  "Commerce et distribution": { fr: "Commerce et distribution", en: "Commerce and distribution" },
  "Tronc commun": { fr: "Tronc commun", en: "Common core" },
  "Sécurité des réseaux et systèmes (SERES)": {
    fr: "Sécurité des réseaux et systèmes (SERES)",
    en: "Network and systems security (SERES)",
  },
  "Services et Radiomobiles (SRM)": {
    fr: "Services et Radiomobiles (SRM)",
    en: "Services and mobile radio (SRM)",
  },
  "Spécialité à préciser": { fr: "Spécialité à préciser", en: "Specialisation to specify" },
  "Parcours technique télécoms": { fr: "Parcours technique télécoms", en: "Telecoms technical track" },
  "Contrôle et exploitation des P&T": {
    fr: "Contrôle et exploitation des P&T",
    en: "P&T control and operations",
  },
  "Techniques des télécoms": { fr: "Techniques des télécoms", en: "Telecoms techniques" },
  "Exploitation des postes et télécoms": {
    fr: "Exploitation des postes et télécoms",
    en: "Postal and telecoms operations",
  },
};

export const joinForm = {
  campuses: ["Yaoundé", "Buea"] as const,
  poles: [
    {
      value: "Pôle Innovation & Projets",
      label: { fr: "Pôle Innovation & Projets", en: "Innovation & Projects" },
      desc: {
        fr: "Idéation, montage de projets, hackathons, pitchs — pour profils techniques et management.",
        en: "Ideation, project set-up, hackathons, pitches — for technical and management profiles.",
      },
    },
    {
      value: "Pôle Développement",
      label: { fr: "Pôle Développement", en: "Development" },
      desc: {
        fr: "Conception technique, web/mobile, IA, IoT et sécurité — ouvert à qui veut apprendre.",
        en: "Technical design, web/mobile, AI, IoT and security — open to anyone willing to learn.",
      },
    },
    {
      value: "Pôle Communication",
      label: { fr: "Pôle Communication", en: "Communications" },
      desc: {
        fr: "Visibilité, médias, relations, design et événementiel — très adapté aux profils inspection et management.",
        en: "Visibility, media, relations, design and events — a strong fit for inspection and management profiles.",
      },
    },
    {
      value: "Découverte & Ateliers",
      label: { fr: "Découverte & Ateliers", en: "Discovery & workshops" },
      desc: {
        fr: "Participer aux formations et découvrir le Club avant de choisir un pôle.",
        en: "Join training sessions and explore the Club before choosing a unit.",
      },
    },
  ],
  experienceLevels: [
    {
      value: "Débutant",
      label: { fr: "Je découvre", en: "I'm starting out" },
      desc: {
        fr: "Aucune expérience exigée — cours, curiosité ou envie d'apprendre suffisent.",
        en: "No prior experience needed — coursework, curiosity or a will to learn is enough.",
      },
    },
    {
      value: "Intermédiaire",
      label: { fr: "Je pratique", en: "I already practise" },
      desc: {
        fr: "Projets scolaires, stages, missions associatives ou responsabilités déjà menées.",
        en: "Course projects, internships, club work or responsibilities already taken on.",
      },
    },
    {
      value: "Avancé",
      label: { fr: "Je peux contribuer", en: "I can contribute" },
      desc: {
        fr: "Expérience solide : je peux livrer, encadrer ou structurer un projet.",
        en: "Solid experience: I can deliver, mentor or structure a project.",
      },
    },
  ],
  domainGroups: [
    {
      id: "digital",
      highlight: "engineering" as const,
      title: { fr: "Numérique & techniques", en: "Digital & technical" },
      domains: [
        { value: "Intelligence Artificielle", label: { fr: "Intelligence artificielle", en: "Artificial intelligence" } },
        { value: "Développement logiciel", label: { fr: "Développement logiciel", en: "Software development" } },
        { value: "Cybersécurité", label: { fr: "Cybersécurité", en: "Cybersecurity" } },
        {
          value: "Réseaux & Télécommunications",
          label: { fr: "Réseaux & télécommunications", en: "Networks & telecommunications" },
        },
        { value: "Électronique & IoT", label: { fr: "Électronique & IoT", en: "Electronics & IoT" } },
        { value: "Radiocommunication", label: { fr: "Radiocommunication", en: "Radiocommunication" } },
      ],
    },
    {
      id: "inspection",
      highlight: "inspection" as const,
      title: { fr: "Inspection, management & services", en: "Inspection, management & services" },
      domains: [
        {
          value: "Régulation & conformité P&T",
          label: { fr: "Régulation & conformité des P&T", en: "P&T regulation & compliance" },
        },
        {
          value: "Management des postes et télécoms",
          label: { fr: "Management des postes et télécoms", en: "Postal & telecoms management" },
        },
        { value: "Comptabilité & finances", label: { fr: "Comptabilité & finances", en: "Accounting & finance" } },
        {
          value: "Logistique & transport",
          label: { fr: "Logistique, transport & supply chain", en: "Logistics, transport & supply chain" },
        },
        {
          value: "Commerce & relation client",
          label: { fr: "Commerce, distribution & relation client", en: "Commerce, distribution & customer relations" },
        },
        {
          value: "Exploitation des services postaux",
          label: { fr: "Exploitation des services postaux", en: "Postal operations" },
        },
        {
          value: "Transformation numérique",
          label: {
            fr: "Transformation numérique des administrations",
            en: "Digital transformation of public services",
          },
        },
      ],
    },
    {
      id: "club",
      highlight: "all" as const,
      title: { fr: "Vie du Club", en: "Club life" },
      domains: [
        { value: "Communication & médias", label: { fr: "Communication & médias", en: "Communications & media" } },
        { value: "Design & identité visuelle", label: { fr: "Design & identité visuelle", en: "Design & visual identity" } },
        { value: "Organisation d'événements", label: { fr: "Organisation d'événements", en: "Event organising" } },
        {
          value: "Pédagogie & formation",
          label: { fr: "Pédagogie & formation entre pairs", en: "Peer teaching & training" },
        },
      ],
    },
  ],
  cyclesByCampus: {
    Yaoundé: [
      {
        value: "ITT",
        label: {
          fr: "ITT — Ingénieur des Travaux de Télécommunications",
          en: "ITT — Telecommunications Works Engineer",
        },
      },
      {
        value: "IPT",
        label: {
          fr: "IPT — Inspecteur des Postes et Télécommunications",
          en: "IPT — Posts and Telecommunications Inspector",
        },
      },
      {
        value: "MIT",
        label: {
          fr: "Master — Ingénieur des Télécommunications",
          en: "Master's — Telecommunications Engineer",
        },
      },
      {
        value: "MAPT",
        label: {
          fr: "Master — Administrateur des Postes et Télécommunications",
          en: "Master's — Posts and Telecommunications Administrator",
        },
      },
    ],
    Buea: [
      { value: "TT", label: { fr: "TT — Technicien des Télécoms", en: "TT — Telecoms Technician" } },
      {
        value: "CPT",
        label: { fr: "CPT — Contrôleur des Postes et Télécoms", en: "CPT — Posts and Telecoms Controller" },
      },
      {
        value: "ATT",
        label: { fr: "ATT — Agent Technique des Télécoms", en: "ATT — Telecoms Technical Officer" },
      },
      {
        value: "AEPT",
        label: {
          fr: "AEPT — Agent d'Exploitation des Postes et Télécoms",
          en: "AEPT — Posts and Telecoms Operations Officer",
        },
      },
    ],
  },
  regimesByCycle: {
    ITT: ["Classique", "Alternance"],
    IPT: ["Classique", "Alternance"],
    MIT: ["Concours", "Admission directe"],
    MAPT: ["Concours", "Admission directe"],
    TT: ["Classique"],
    CPT: ["Classique"],
    ATT: ["Classique"],
    AEPT: ["Classique"],
  } as Record<string, string[]>,
  optionsByCycle: {
    ITT: [
      "Tronc commun (1re année)",
      "Informatique et réseaux (IR)",
      "Réseaux et télécommunications (RT)",
      "Radiocommunication (RC)",
    ],
    IPT: [
      "Tronc commun (1re année)",
      "Management (MGT)",
      "Comptabilité et Finances (CF)",
      "Logistique et Transport (LT)",
      "Commerce et distribution",
    ],
    MIT: [
      "Tronc commun",
      "Sécurité des réseaux et systèmes (SERES)",
      "Services et Radiomobiles (SRM)",
    ],
    MAPT: ["Tronc commun", "Spécialité à préciser"],
    TT: ["Parcours technique télécoms"],
    CPT: ["Contrôle et exploitation des P&T"],
    ATT: ["Techniques des télécoms"],
    AEPT: ["Exploitation des postes et télécoms"],
  } as Record<string, string[]>,
  levelsByCycle: {
    ITT: ["1re année (ITT1)", "2e année (ITT2)", "3e année (ITT3)"],
    IPT: ["1re année (IPT1)", "2e année (IPT2)", "3e année (IPT3)"],
    MIT: ["Master 1", "Master 2"],
    MAPT: ["Master 1", "Master 2"],
    TT: ["1re année", "2e année"],
    CPT: ["1re année", "2e année"],
    ATT: ["1re année", "2e année"],
    AEPT: ["1re année", "2e année"],
  } as Record<string, string[]>,
};
