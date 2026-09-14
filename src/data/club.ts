import projectSupone from "@/assets/images/projects/supone.jpg";
import projectCyber from "@/assets/images/projects/cyberveille.jpg";
import projectIot from "@/assets/images/projects/campus-iot.jpg";
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
import president from "@/assets/images/people/president.jpg";
import presidentPortrait from "@/assets/images/people/president-portrait.jpg";
import memberPolo from "@/assets/images/people/member-polo.jpg";
import memberBlackTee from "@/assets/images/people/member-black-tee.jpg";
import memberKeumekaWilfried from "@/assets/images/people/keumeka-wilfried.jpg";
import memberEvinaMbahoEric from "@/assets/images/people/evina-mbaho-eric.jpg";
import memberOlamaVictoire from "@/assets/images/people/olama-victoire.jpg";
import memberDanielBenny from "@/assets/images/people/daniel-benny.jpg";
import memberFowaMichelleRosee from "@/assets/images/people/fowa-michelle-rosee.jpg";
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
    icon: "brain",
    title: "Intelligence Artificielle",
    titleEn: "Artificial intelligence",
    description:
      "Machine learning, traitement du langage et vision par ordinateur appliqués à des cas d'usage camerounais.",
    descriptionEn:
      "Machine learning, language processing and computer vision applied to Cameroonian use cases.",
  },
  {
    icon: "code",
    title: "Développement logiciel",
    titleEn: "Software development",
    description:
      "Applications web et mobiles, du prototype au produit livré, avec des méthodes de travail en équipe.",
    descriptionEn:
      "Web and mobile apps, from prototype to shipped product, with real teamwork practices.",
  },
  {
    icon: "shield",
    title: "Cybersécurité",
    titleEn: "Cybersecurity",
    description:
      "Sensibilisation, audit, CTF et bonnes pratiques de sécurité des systèmes d'information.",
    descriptionEn:
      "Awareness, audits, CTFs and information-security good practice.",
  },
  {
    icon: "network",
    title: "Réseaux & Télécommunications",
    titleEn: "Networks & telecommunications",
    description:
      "Administration réseau, protocoles et infrastructures, cœur historique de la formation SUP'PTIC.",
    descriptionEn:
      "Network administration, protocols and infrastructure — the historic core of SUP'PTIC training.",
  },
  {
    icon: "cpu",
    title: "Électronique & IoT",
    titleEn: "Electronics & IoT",
    description:
      "Objets connectés, capteurs et systèmes embarqués conçus et assemblés par les membres du Club.",
    descriptionEn:
      "Connected objects, sensors and embedded systems designed and assembled by Club members.",
  },
  {
    icon: "lightbulb",
    title: "Innovation & Recherche",
    titleEn: "Innovation & research",
    description:
      "Veille technologique, expérimentations et projets de recherche appliquée portés par les pôles — y compris pour les profils management et inspection.",
    descriptionEn:
      "Tech watch, experiments and applied research led by our units — including management and inspection profiles.",
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
    slug: "cyberveille",
    name: "CyberVeille",
    subtitle: "Tableau de bord de sensibilisation à la cybersécurité",
    subtitleEn: "Cybersecurity awareness dashboard",
    summary:
      "Une plateforme de sensibilisation et de suivi des bonnes pratiques de sécurité, utilisée lors des ateliers du Club.",
    summaryEn:
      "An awareness platform that tracks security good practice, used in Club workshops.",
    status: "En cours",
    domain: "Cybersécurité",
    domainEn: "Cybersecurity",
    tags: ["Next.js", "PostgreSQL", "OSINT"],
    image: projectCyber,
  },
  {
    slug: "campus-iot",
    name: "Campus IoT",
    subtitle: "Réseau de capteurs pour le campus",
    subtitleEn: "Campus sensor network",
    summary:
      "Un prototype de capteurs connectés mesurant température, énergie et occupation des salles, conçu au laboratoire du Club.",
    summaryEn:
      "A prototype of connected sensors measuring temperature, energy and room occupancy, built in the Club lab.",
    status: "Terminé",
    domain: "Électronique & IoT",
    domainEn: "Electronics & IoT",
    tags: ["ESP32", "LoRa", "MQTT", "Grafana"],
    image: projectIot,
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
    image: gallerySyntraPitch,
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
    | "Conférence"
    | "Hackathon"
    | "Atelier"
    | "Concours"
    | "Visite"
    | "Collaboration";
  description: string;
  descriptionEn: string;
  image?: string;
  upcoming: boolean;
};

export const events: ClubEvent[] = [
  {
    title: "Hackathon SUP'ONE 48h",
    titleEn: "SUP'ONE 48h hackathon",
    date: "2026-10-17",
    displayDate: "17 – 19 octobre 2026",
    displayDateEn: "17 – 19 October 2026",
    type: "Hackathon",
    description:
      "Deux jours et deux nuits pour construire une solution numérique utile au campus, en équipes pluridisciplinaires.",
    descriptionEn:
      "Two days and two nights to build a digital solution useful to campus, in mixed teams.",
    image: galleryHackathon,
    upcoming: true,
  },
  {
    title: "Formation : introduction au machine learning",
    titleEn: "Training: introduction to machine learning",
    date: "2026-09-26",
    displayDate: "26 septembre 2026",
    displayDateEn: "26 September 2026",
    type: "Formation",
    description:
      "Session pratique de 3 heures sur Python, pandas et les premiers modèles de classification.",
    descriptionEn:
      "A 3-hour practical session on Python, pandas and first classification models.",
    image: galleryLab,
    upcoming: true,
  },
  {
    title: "Journées universitaires de l'informatique",
    titleEn: "University Computer Days",
    date: "2026-05-16",
    displayDate: "Édition 2026",
    displayDateEn: "2026 edition",
    type: "Concours",
    description:
      "Présentation des projets du Club, dont Syntra, et remise du Prix du meilleur projet (100 000 FCFA) avec le soutien de CAMPOST.",
    descriptionEn:
      "Presentation of Club projects, including Syntra, and the Best Project Prize (100,000 FCFA) with CAMPOST support.",
    image: galleryJuioPrize,
    upcoming: false,
  },
  {
    title: "Conférence : l'IA souveraine en Afrique centrale",
    titleEn: "Talk: sovereign AI in Central Africa",
    date: "2026-08-14",
    displayDate: "14 août 2026",
    displayDateEn: "14 August 2026",
    type: "Conférence",
    description:
      "Table ronde avec des professionnels du secteur sur les enjeux de souveraineté numérique.",
    descriptionEn:
      "Round table with sector professionals on digital sovereignty.",
    image: galleryConference,
    upcoming: false,
  },
  {
    title: "Atelier Capture The Flag",
    titleEn: "Capture The Flag workshop",
    date: "2026-06-08",
    displayDate: "8 juin 2026",
    displayDateEn: "8 June 2026",
    type: "Atelier",
    description: "Initiation aux challenges de cybersécurité : web, forensic et cryptographie.",
    descriptionEn: "Introduction to cybersecurity challenges: web, forensics and cryptography.",
    image: galleryTalk,
    upcoming: false,
  },
  {
    title: "Visite d'un opérateur télécom",
    titleEn: "Visit to a telecom operator",
    date: "2026-04-19",
    displayDate: "19 avril 2026",
    displayDateEn: "19 April 2026",
    type: "Visite",
    description:
      "Découverte d'un centre d'exploitation réseau et échange avec les ingénieurs et inspecteurs sur site.",
    descriptionEn:
      "Tour of a network operations centre and discussion with engineers and inspectors on site.",
    image: gallerySpeaker,
    upcoming: false,
  },
  {
    title: "Collaboration inter-clubs tech",
    titleEn: "Inter-club tech collaboration",
    date: "2026-03-02",
    displayDate: "2 mars 2026",
    displayDateEn: "2 March 2026",
    type: "Collaboration",
    description:
      "Rencontre avec les clubs informatiques d'écoles partenaires autour de projets communs.",
    descriptionEn:
      "Meeting with computer clubs from partner schools around shared projects.",
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
];

export const bureau = [
  {
    name: "MESSI OVAH FRED",
    role: "Président du Club Informatique",
    roleEn: "President of the Computer Club",
    image: presidentPortrait,
  },
  {
    name: "NKOUMOU GERMAIN",
    role: "Vice-président",
    roleEn: "Vice President",
    image: memberPolo,
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
    role: "Chef du Pôle Communication Adjoint",
    roleEn: "Deputy Head of Communications",
    image: memberFowaMichelleRosee,
  },
  {
    name: "NJIMONGBA ABDOU",
    role: "Trésorier",
    roleEn: "Treasurer",
    image: memberBlackTee,
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
