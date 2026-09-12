import projectSupone from "@/assets/project-supone.jpg";
import projectCyber from "@/assets/project-cyber.jpg";
import projectIot from "@/assets/project-iot.jpg";
import galleryHackathon from "@/assets/gallery-hackathon.jpg";
import galleryFormation from "@/assets/gallery-formation.jpg";
import galleryTeam from "@/assets/gallery-team.jpg";
import galleryConference from "@/assets/gallery-conference.jpg";

export const club = {
  name: "Club Informatique SUP'PTIC",
  short: "Club Info SUP'PTIC",
  tagline: "Une école, un esprit, une intelligence",
  email: "clubinfo@supptic.cm",
  linkedin: "https://www.linkedin.com/",
  github: "https://github.com/",
};

export const expertise = [
  {
    icon: "brain",
    title: "Intelligence Artificielle",
    description:
      "Machine learning, traitement du langage et vision par ordinateur appliqués à des cas d'usage camerounais.",
  },
  {
    icon: "code",
    title: "Développement logiciel",
    description: "Applications web et mobiles, du prototype au produit livré, avec des méthodes de travail en équipe.",
  },
  {
    icon: "shield",
    title: "Cybersécurité",
    description: "Sensibilisation, audit, CTF et bonnes pratiques de sécurité des systèmes d'information.",
  },
  {
    icon: "network",
    title: "Réseaux & Télécommunications",
    description: "Administration réseau, protocoles et infrastructures, cœur historique de la formation SUP'PTIC.",
  },
  {
    icon: "cpu",
    title: "Électronique & IoT",
    description: "Objets connectés, capteurs et systèmes embarqués conçus et assemblés par les membres du Club.",
  },
  {
    icon: "lightbulb",
    title: "Innovation & Recherche",
    description: "Veille technologique, expérimentations et projets de recherche appliquée portés par les pôles.",
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  subtitle: string;
  summary: string;
  status: "En cours" | "Terminé";
  domain: string;
  tags: string[];
  image: string;
  featured?: boolean;
  href?: string;
};

export const projects: Project[] = [
  {
    slug: "supone-ai",
    name: "SUP'ONE AI",
    subtitle: "L'assistant intelligent des étudiants de SUP'PTIC",
    summary:
      "Un assistant conversationnel qui centralise l'information académique de l'école et répond aux questions des étudiants en langage naturel.",
    status: "En cours",
    domain: "Intelligence Artificielle",
    tags: ["Python", "LLM", "RAG", "React", "FastAPI"],
    image: projectSupone,
    featured: true,
    href: "/projects/supone-ai",
  },
  {
    slug: "cyberveille",
    name: "CyberVeille",
    subtitle: "Tableau de bord de sensibilisation à la cybersécurité",
    summary:
      "Une plateforme de sensibilisation et de suivi des bonnes pratiques de sécurité, utilisée lors des ateliers du Club.",
    status: "En cours",
    domain: "Cybersécurité",
    tags: ["Next.js", "PostgreSQL", "OSINT"],
    image: projectCyber,
  },
  {
    slug: "campus-iot",
    name: "Campus IoT",
    subtitle: "Réseau de capteurs pour le campus",
    summary:
      "Un prototype de capteurs connectés mesurant température, énergie et occupation des salles, conçu au laboratoire du Club.",
    status: "Terminé",
    domain: "Électronique & IoT",
    tags: ["ESP32", "LoRa", "MQTT", "Grafana"],
    image: projectIot,
  },
];

export type ClubEvent = {
  title: string;
  date: string;
  displayDate: string;
  type: "Formation" | "Conférence" | "Hackathon" | "Atelier" | "Concours" | "Visite" | "Collaboration";
  description: string;
  image?: string;
  upcoming: boolean;
};

export const events: ClubEvent[] = [
  {
    title: "Hackathon SUP'ONE 48h",
    date: "2026-10-17",
    displayDate: "17 – 19 octobre 2026",
    type: "Hackathon",
    description:
      "Deux jours et deux nuits pour construire une solution numérique utile au campus, en équipes pluridisciplinaires.",
    image: galleryHackathon,
    upcoming: true,
  },
  {
    title: "Formation : introduction au machine learning",
    date: "2026-09-26",
    displayDate: "26 septembre 2026",
    type: "Formation",
    description: "Session pratique de 3 heures sur Python, pandas et les premiers modèles de classification.",
    image: galleryFormation,
    upcoming: true,
  },
  {
    title: "Conférence : l'IA souveraine en Afrique centrale",
    date: "2026-08-14",
    displayDate: "14 août 2026",
    type: "Conférence",
    description: "Table ronde avec des professionnels du secteur sur les enjeux de souveraineté numérique.",
    image: galleryConference,
    upcoming: false,
  },
  {
    title: "Atelier Capture The Flag",
    date: "2026-06-08",
    displayDate: "8 juin 2026",
    type: "Atelier",
    description: "Initiation aux challenges de cybersécurité : web, forensic et cryptographie.",
    upcoming: false,
  },
  {
    title: "Visite d'un opérateur télécom",
    date: "2026-04-19",
    displayDate: "19 avril 2026",
    type: "Visite",
    description: "Découverte d'un centre d'exploitation réseau et échange avec les ingénieurs sur site.",
    upcoming: false,
  },
  {
    title: "Collaboration inter-clubs tech",
    date: "2026-03-02",
    displayDate: "2 mars 2026",
    type: "Collaboration",
    description: "Rencontre avec les clubs informatiques d'écoles partenaires autour de projets communs.",
    upcoming: false,
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  category: "Événements" | "Formations" | "Projets" | "Vie du club";
};

export const gallery: GalleryItem[] = [
  { src: galleryHackathon, alt: "Étudiants en équipe pendant le hackathon du Club", category: "Événements" },
  { src: galleryFormation, alt: "Formation animée par un membre du Club en salle de cours", category: "Formations" },
  { src: galleryTeam, alt: "Photo de groupe des membres du Club Informatique", category: "Vie du club" },
  { src: galleryConference, alt: "Table ronde lors d'une conférence organisée par le Club", category: "Événements" },
  { src: projectSupone, alt: "Interface de l'assistant SUP'ONE AI", category: "Projets" },
  { src: projectIot, alt: "Prototype de capteurs connectés du projet Campus IoT", category: "Projets" },
  { src: projectCyber, alt: "Tableau de bord du projet CyberVeille", category: "Projets" },
  { src: galleryTeam, alt: "Membres du Club réunis devant l'école", category: "Vie du club" },
];

export const poles = [
  {
    name: "Bureau Exécutif",
    role: "Coordonne la vie du Club, représente les membres auprès de l'administration et garantit le respect de la Charte.",
  },
  {
    name: "Pôle Innovation & Projets",
    role: "Fait émerger les idées, cadre les projets et accompagne les équipes jusqu'à la livraison.",
  },
  {
    name: "Pôle Développement",
    role: "Conçoit et code les solutions du Club, et anime les formations techniques auprès des membres.",
  },
  {
    name: "Pôle Communication",
    role: "Anime les réseaux, organise les événements et assure le suivi des candidatures d'adhésion.",
  },
];

export const objectives = [
  "Fédérer les étudiants passionnés d'informatique autour de projets concrets.",
  "Renforcer les compétences techniques par la formation entre pairs.",
  "Porter des projets utiles à l'école et à son écosystème.",
  "Créer des ponts avec les entreprises et les communautés tech.",
  "Valoriser l'image technologique de SUP'PTIC.",
];

export const stats = [
  { value: "2021", label: "Année de création" },
  { value: "120+", label: "Membres actifs" },
  { value: "15", label: "Projets menés" },
  { value: "3", label: "Pôles opérationnels" },
];
