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
  /** Groupe WhatsApp communiqué après l'envoi du formulaire d'adhésion. */
  whatsappGroup: "https://chat.whatsapp.com/FSGWhP5GRML6Oo7QsTiRzq",
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

/** Objectifs du Club — reprise fidèle de la Charte, article 2 (docs/07_Charte.md). */
export const objectives: { icon: "megaphone" | "learn" | "innovate" | "career" | "local"; title: L10n; text: L10n }[] = [
  {
    icon: "megaphone",
    title: { fr: "Culture numérique", en: "Digital culture" },
    text: {
      fr: "Promouvoir la culture numérique, informatique et les TIC auprès des étudiants.",
      en: "Promote digital culture, computing and ICT among students.",
    },
  },
  {
    icon: "learn",
    title: { fr: "Apprendre ensemble", en: "Learn together" },
    text: {
      fr: "Favoriser la formation continue, l'apprentissage pratique et le partage des connaissances.",
      en: "Encourage continuous learning, hands-on practice and knowledge sharing.",
    },
  },
  {
    icon: "innovate",
    title: { fr: "Innover", en: "Innovate" },
    text: {
      fr: "Encourager l'innovation, la recherche et la participation aux compétitions, projets et événements technologiques.",
      en: "Encourage innovation, research and participation in competitions, projects and tech events.",
    },
  },
  {
    icon: "career",
    title: { fr: "Préparer l'avenir", en: "Prepare for the future" },
    text: {
      fr: "Préparer les membres à l'insertion professionnelle et représenter SUP'PTIC lors d'événements scientifiques et technologiques.",
      en: "Prepare members for professional life and represent SUP'PTIC at scientific and technology events.",
    },
  },
  {
    icon: "local",
    title: { fr: "Agir localement", en: "Act locally" },
    text: {
      fr: "Développer des initiatives locales adaptées aux besoins de la communauté.",
      en: "Develop local initiatives suited to the community's needs.",
    },
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

/**
 * Formulaire d'adhésion (/join).
 * Principe : le cursus décrit la personne, les centres d'intérêt ce qu'elle
 * souhaite faire, et la préférence de pôle comment elle souhaite contribuer.
 * Aucun de ces éléments n'est déduit des autres (pas de suggestion par cycle).
 */
export const OTHER = "Autre";

export const joinForm = {
  campuses: [
    { value: "Yaoundé", label: { fr: "Yaoundé", en: "Yaoundé" } },
    {
      value: "Buea",
      label: { fr: "Buea — Centre régional annexe", en: "Buea — Regional annex centre" },
    },
    { value: OTHER, label: { fr: "Autre situation — préciser", en: "Other situation — specify" } },
  ],
  /** Cycles publiés par l'école. Liste non exhaustive : « Autre formation » reste toujours proposé. */
  cyclesByCampus: {
    Yaoundé: [
      {
        value: "ITT",
        label: {
          fr: "ITT — Ingénieur des Travaux des Télécommunications",
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
      {
        value: "TT",
        label: { fr: "TT — Technicien des Télécommunications", en: "TT — Telecoms Technician" },
      },
      {
        value: "CPT",
        label: {
          fr: "CPT — Contrôleur des Postes et Télécommunications",
          en: "CPT — Posts and Telecoms Controller",
        },
      },
      {
        value: "ATT",
        label: {
          fr: "ATT — Agent Technique des Télécommunications",
          en: "ATT — Telecoms Technical Officer",
        },
      },
      {
        value: "AEPT",
        label: {
          fr: "AEPT — Agent d'Exploitation des Postes et Télécommunications",
          en: "AEPT — Posts and Telecoms Operations Officer",
        },
      },
    ],
  } as Record<string, { value: string; label: L10n }[]>,
  otherCycle: {
    value: OTHER,
    label: {
      fr: "Autre formation / mon intitulé n'apparaît pas — préciser",
      en: "Other programme / mine isn't listed — specify",
    },
  },
  /** Activités concrètes (plusieurs choix, 3 maximum). Ce ne sont pas des pôles. */
  maxInterests: 3,
  interests: [
    {
      value: "Développement web, mobile ou logiciel",
      label: {
        fr: "Développement web, mobile ou logiciel",
        en: "Web, mobile or software development",
      },
    },
    {
      value: "Intelligence artificielle et données",
      label: { fr: "Intelligence artificielle et données", en: "Artificial intelligence and data" },
    },
    {
      value: "Électronique, objets connectés et prototypage",
      label: {
        fr: "Électronique, objets connectés et prototypage",
        en: "Electronics, IoT and prototyping",
      },
    },
    {
      value: "Veille technologique et partage de connaissances",
      label: {
        fr: "Veille technologique et partage de connaissances",
        en: "Tech watch and knowledge sharing",
      },
    },
    {
      value: "Recherche d'idées et conception de projets",
      label: {
        fr: "Recherche d'idées et conception de projets",
        en: "Finding ideas and designing projects",
      },
    },
    {
      value: "Organisation et coordination d'un projet",
      label: {
        fr: "Organisation et coordination d'un projet",
        en: "Organising and coordinating a project",
      },
    },
    {
      value: "Préparation de pitchs et présentations",
      label: {
        fr: "Préparation de pitchs et présentations",
        en: "Preparing pitches and presentations",
      },
    },
    {
      value: "Hackathons, concours et recherche d'opportunités",
      label: {
        fr: "Hackathons, concours et recherche d'opportunités",
        en: "Hackathons, competitions and finding opportunities",
      },
    },
    {
      value: "Design graphique et création de visuels",
      label: { fr: "Design graphique et création de visuels", en: "Graphic design and visuals" },
    },
    {
      value: "Rédaction, photo, vidéo ou réseaux sociaux",
      label: {
        fr: "Rédaction, photo, vidéo ou réseaux sociaux",
        en: "Writing, photo, video or social media",
      },
    },
    {
      value: "Communication de terrain et mobilisation",
      label: { fr: "Communication de terrain et mobilisation", en: "Outreach and mobilisation" },
    },
    {
      value: "Je souhaite découvrir avant de choisir",
      label: {
        fr: "Je souhaite découvrir avant de choisir",
        en: "I'd like to explore before choosing",
      },
    },
    { value: OTHER, label: { fr: "Autre — préciser", en: "Other — specify" } },
  ],
  /** Préférence de pôle (pas une affectation). Descriptions reprises des articles 14 à 17. */
  poles: [
    {
      value: "Pôle Innovation & Projets",
      label: { fr: "Innovation & Projets", en: "Innovation & Projects" },
      desc: {
        fr: "Faire émerger et structurer les idées, coordonner les équipes projet, préparer les pitchs et organiser la préparation aux concours.",
        en: "Surface and structure ideas, coordinate project teams, prepare pitches and organise competition preparation.",
      },
    },
    {
      value: "Pôle Développement",
      label: { fr: "Développement", en: "Development" },
      desc: {
        fr: "Concevoir les solutions techniques, réaliser des prototypes, apporter un appui technique et partager des compétences.",
        en: "Design technical solutions, build prototypes, provide technical support and share skills.",
      },
    },
    {
      value: "Pôle Communication",
      label: { fr: "Communication", en: "Communications" },
      desc: {
        fr: "Créer les supports visuels et éditoriaux, couvrir les activités et diffuser les informations du club.",
        en: "Create visual and editorial content, cover activities and share the club's news.",
      },
    },
    {
      value: "Découvrir avant de choisir",
      label: {
        fr: "Je souhaite découvrir avant de choisir",
        en: "I'd like to explore before choosing",
      },
      desc: {
        fr: "Participer aux premières activités pour mieux comprendre les trois pôles.",
        en: "Take part in the first activities to better understand the three units.",
      },
    },
  ],
  availability: [
    {
      value: "En semaine, en journée",
      label: { fr: "En semaine, en journée", en: "Weekdays, daytime" },
    },
    {
      value: "En semaine, en soirée",
      label: { fr: "En semaine, en soirée", en: "Weekday evenings" },
    },
    { value: "Le week-end", label: { fr: "Le week-end", en: "Weekends" } },
    { value: "Disponibilités variables", label: { fr: "Disponibilités variables", en: "Varies" } },
    {
      value: "Je préciserai plus tard",
      label: { fr: "Je préciserai plus tard", en: "I'll tell you later" },
    },
  ],
};
