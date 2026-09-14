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

export const club = {
  name: "Club Informatique SUP'PTIC",
  short: "Club Info SUP'PTIC",
  tagline: "Une école, un esprit, une intelligence",
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
    description:
      "Machine learning, traitement du langage et vision par ordinateur appliqués à des cas d'usage camerounais.",
  },
  {
    icon: "code",
    title: "Développement logiciel",
    description:
      "Applications web et mobiles, du prototype au produit livré, avec des méthodes de travail en équipe.",
  },
  {
    icon: "shield",
    title: "Cybersécurité",
    description:
      "Sensibilisation, audit, CTF et bonnes pratiques de sécurité des systèmes d'information.",
  },
  {
    icon: "network",
    title: "Réseaux & Télécommunications",
    description:
      "Administration réseau, protocoles et infrastructures, cœur historique de la formation SUP'PTIC.",
  },
  {
    icon: "cpu",
    title: "Électronique & IoT",
    description:
      "Objets connectés, capteurs et systèmes embarqués conçus et assemblés par les membres du Club.",
  },
  {
    icon: "lightbulb",
    title: "Innovation & Recherche",
    description:
      "Veille technologique, expérimentations et projets de recherche appliquée portés par les pôles.",
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
  github?: string;
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
    github: "https://github.com/nkoumougrinnel/SupOneAI",
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
  {
    slug: "syntra",
    name: "Syntra",
    subtitle: "Le messager technique sécurisé",
    summary:
      "CommHQ — messagerie d'entreprise en temps réel (canaux, Markdown, code, bot IA), présentée aux Journées universitaires de l'informatique 2026.",
    status: "Terminé",
    domain: "Développement logiciel",
    tags: ["React", "NestJS", "Socket.IO", "MongoDB"],
    image: gallerySyntraPitch,
    github: "https://github.com/DanielBeni-tech/CommHQ",
  },
];

export type ClubEvent = {
  title: string;
  date: string;
  displayDate: string;
  type:
    "Formation" | "Conférence" | "Hackathon" | "Atelier" | "Concours" | "Visite" | "Collaboration";
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
    description:
      "Session pratique de 3 heures sur Python, pandas et les premiers modèles de classification.",
    image: galleryLab,
    upcoming: true,
  },
  {
    title: "Journées universitaires de l'informatique",
    date: "2026-05-16",
    displayDate: "Édition 2026",
    type: "Concours",
    description:
      "Présentation des projets du Club, dont Syntra, et remise du Prix du meilleur projet (100 000 FCFA) avec le soutien de CAMPOST.",
    image: galleryJuioPrize,
    upcoming: false,
  },
  {
    title: "Conférence : l'IA souveraine en Afrique centrale",
    date: "2026-08-14",
    displayDate: "14 août 2026",
    type: "Conférence",
    description:
      "Table ronde avec des professionnels du secteur sur les enjeux de souveraineté numérique.",
    image: galleryConference,
    upcoming: false,
  },
  {
    title: "Atelier Capture The Flag",
    date: "2026-06-08",
    displayDate: "8 juin 2026",
    type: "Atelier",
    description: "Initiation aux challenges de cybersécurité : web, forensic et cryptographie.",
    image: galleryTalk,
    upcoming: false,
  },
  {
    title: "Visite d'un opérateur télécom",
    date: "2026-04-19",
    displayDate: "19 avril 2026",
    type: "Visite",
    description:
      "Découverte d'un centre d'exploitation réseau et échange avec les ingénieurs sur site.",
    image: gallerySpeaker,
    upcoming: false,
  },
  {
    title: "Collaboration inter-clubs tech",
    date: "2026-03-02",
    displayDate: "2 mars 2026",
    type: "Collaboration",
    description:
      "Rencontre avec les clubs informatiques d'écoles partenaires autour de projets communs.",
    image: galleryCollabGi,
    upcoming: false,
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  category: "Événements" | "Formations" | "Projets" | "Vie du club";
};

export const gallery: GalleryItem[] = [
  {
    src: galleryJuioPrize,
    alt: "L'équipe du Club autour du Prix du meilleur projet aux Journées universitaires de l'informatique 2026",
    category: "Événements",
  },
  {
    src: galleryGroup,
    alt: "Photo de groupe des membres du Club Informatique SUP'PTIC",
    category: "Vie du club",
  },
  {
    src: galleryJuioWinners,
    alt: "Équipe lauréate du Prix du meilleur projet, chèque de 100 000 FCFA",
    category: "Événements",
  },
  {
    src: gallerySyntraPitch,
    alt: "Présentation de Syntra, le messager technique sécurisé",
    category: "Projets",
  },
  {
    src: galleryJuioPitch,
    alt: "Pitch projet devant l'amphithéâtre, écran et micros",
    category: "Événements",
  },
  {
    src: galleryJuioHuddle,
    alt: "Travail en équipe autour d'un ordinateur pendant un hackathon",
    category: "Projets",
  },
  {
    src: galleryJuioTalk,
    alt: "Présentation Impact social et humain en salle informatique",
    category: "Formations",
  },
  {
    src: galleryJuioLab,
    alt: "Participants en salle informatique pendant une journée universitaire",
    category: "Formations",
  },
  {
    src: galleryCollabGi,
    alt: "Rencontre entre le Club Informatique et un club partenaire",
    category: "Événements",
  },
  {
    src: galleryCollabDelegation,
    alt: "Délégation du Club lors d'une rencontre inter-clubs",
    category: "Événements",
  },
  {
    src: galleryHandshake,
    alt: "Poignée de main à l'issue d'une collaboration inter-clubs",
    category: "Événements",
  },
  {
    src: galleryMeeting,
    alt: "Réunion de travail du Club autour d'une table, ordinateurs ouverts",
    category: "Projets",
  },
  {
    src: galleryLab,
    alt: "Session en salle informatique : étudiants et encadrants",
    category: "Formations",
  },
  {
    src: galleryRackTeam,
    alt: "Membres du Club devant une baie de télécommunications",
    category: "Vie du club",
  },
  {
    src: galleryFormation,
    alt: "Membres du Club en salle informatique pendant une session de formation",
    category: "Formations",
  },
  {
    src: gallerySpeaker,
    alt: "Échange entre un intervenant et les étudiants en salle de cours",
    category: "Formations",
  },
  {
    src: galleryHackathon,
    alt: "Briefing d'équipe avant une présentation, ordinateur et projecteur",
    category: "Événements",
  },
  {
    src: galleryConference,
    alt: "Prise de parole lors d'une présentation organisée par le Club",
    category: "Événements",
  },
  {
    src: galleryTalk,
    alt: "Atelier du Club : présentation devant le tableau et le matériel",
    category: "Événements",
  },
  {
    src: galleryTeam,
    alt: "Session de travail autour d'un projet logiciel",
    category: "Projets",
  },
  {
    src: president,
    alt: "MESSI OVAH FRED, président du Club Informatique SUP'PTIC",
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

export const objectives = [
  "Fédérer les étudiants passionnés d'informatique autour de projets concrets.",
  "Renforcer les compétences techniques par la formation entre pairs.",
  "Porter des projets utiles à l'école et à son écosystème.",
  "Créer des ponts avec les entreprises et les communautés tech.",
  "Valoriser l'image technologique de SUP'PTIC.",
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
  { value: "2021", label: "Année de création" },
  { value: "120+", label: "Membres actifs" },
  { value: "15", label: "Projets menés" },
  { value: "3", label: "Pôles opérationnels" },
];

export type Partner = {
  name: string;
  role: string;
  href?: string;
  logo?: string;
};

export const partners: Partner[] = [
  {
    name: "SUP'PTIC",
    role: "École d'accueil — Yaoundé & Buea",
    href: "https://e-supptic.cm",
    logo: logoSupptic,
  },
  {
    name: "MINPOSTEL",
    role: "Ministère de tutelle",
    logo: logoMinpostel,
  },
  {
    name: "CAMTEL",
    role: "Opérateur historique des télécoms",
    href: "https://www.camtel.cm",
    logo: logoCamtel,
  },
  {
    name: "CAMPOST",
    role: "Opérateur postal national",
    href: "https://www.campost.cm",
    logo: logoCampost,
  },
  {
    name: "Huawei",
    role: "Partenaire formation et technologie",
    logo: logoHuawei,
  },
];

export const school = {
  name: "SUP'PTIC",
  fullName:
    "École Nationale Supérieure des Postes, des Télécommunications et des Technologies de l'Information et de la Communication",
  url: "https://e-supptic.cm",
  campuses: ["Yaoundé", "Buea"] as const,
  cursus: ["Ingénierie", "Management"] as const,
};

export const joinForm = {
  campuses: ["Yaoundé", "Buea"] as const,
  poles: [
    {
      value: "Pôle Innovation & Projets",
      label: "Pôle Innovation & Projets",
      desc: "Idéation, montage de projets, hackathons, pitchs et veille technologique.",
    },
    {
      value: "Pôle Développement",
      label: "Pôle Développement",
      desc: "Conception technique, programmation logicielle/web/mobile, IA, IoT et sécurité.",
    },
    {
      value: "Pôle Communication",
      label: "Pôle Communication",
      desc: "Visibilité, médias, relations extérieures, design graphique et événementiel.",
    },
    {
      value: "Découverte & Ateliers",
      label: "Découverte & Ateliers",
      desc: "Assister aux formations, découvrir les activités avant de choisir un pôle.",
    },
  ],
  experienceLevels: [
    {
      value: "Débutant",
      label: "Débutant / Curieux d'apprendre",
      desc: "Aucune expérience requise, envie d'apprendre et de progresser avec le Club.",
    },
    {
      value: "Intermédiaire",
      label: "Intermédiaire",
      desc: "Bases solides ou projets académiques/personnels déjà réalisés.",
    },
    {
      value: "Avancé",
      label: "Avancé / Expérimenté",
      desc: "Bonne maîtrise pratique, capable de contribuer ou de guider des projets.",
    },
  ],
  domains: [
    "Intelligence Artificielle",
    "Développement logiciel",
    "Cybersécurité",
    "Réseaux & Télécommunications",
    "Électronique & IoT",
    "Radiocommunication",
    "Management des télécoms",
    "Innovation & Recherche",
  ] as const,
  cyclesByCampus: {
    Yaoundé: [
      { value: "ITT", label: "ITT — Ingénieur des Travaux de Télécommunications" },
      { value: "IPT", label: "IPT — Inspecteur des Postes et Télécommunications" },
      { value: "MIT", label: "Master — Ingénieur des Télécommunications" },
      { value: "MAPT", label: "Master — Administrateur des Postes et Télécommunications" },
    ],
    Buea: [
      { value: "TT", label: "TT — Technicien des Télécoms" },
      { value: "CPT", label: "CPT — Contrôleur des Postes et Télécoms" },
      { value: "ATT", label: "ATT — Agent Technique des Télécoms" },
      { value: "AEPT", label: "AEPT — Agent d'Exploitation des Postes et Télécoms" },
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
