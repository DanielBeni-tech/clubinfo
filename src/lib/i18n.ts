import { useSyncExternalStore } from "react";

export type Locale = "fr" | "en";

const STORAGE_KEY = "clubinfo-locale";

const messages = {
  fr: {
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
    "hero.kicker": "SUP'PTIC · Yaoundé",
    "hero.lead":
      "Nous réunissons les étudiants passionnés de technologie autour de projets réels : intelligence artificielle, développement, cybersécurité, réseaux et objets connectés. Le Club forme, expérimente et livre — avec l'exigence d'une équipe tech professionnelle.",
    "hero.discover": "Découvrir le club",
    "hero.projects": "Nos projets",
    "hero.carousel": "Temps forts du Club",
    "hero.photos": "Photos du hero",
    "partners.label": "Partenaires",
    "about.team.eyebrow": "Bureau",
    "about.team.title": "L'équipe qui porte le Club",
    "about.team.lead":
      "Le Bureau Exécutif représente les membres auprès de l'administration et coordonne la vie associative.",
    "about.org.eyebrow": "Organisation",
    "about.org.title": "Un bureau, trois pôles",
    "about.org.lead":
      "Chaque membre rejoint un pôle en fonction de ses centres d'intérêt et de son temps disponible.",
    "footer.nav": "Navigation",
    "footer.contact": "Contact",
    "footer.form": "Formulaire de contact",
    "footer.rights": "Tous droits réservés.",
    "footer.legal":
      "Club étudiant reconnu par l'Administration SUP'PTIC et l'Association des Étudiants.",
    "cta.title": "Envie de construire avec nous ?",
    "cta.lead":
      "Le Club est ouvert à tout étudiant régulièrement inscrit à SUP'PTIC, quel que soit son niveau technique. Rejoins un pôle et participe à nos projets dès ce semestre.",
    "cta.join": "Rejoindre le club",
    "card.featured": "Projet phare",
    "nav.statuts": "Statuts",
    "card.sheet": "Voir la fiche",
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.toggle": "Langue",
  },
  en: {
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
    "hero.kicker": "SUP'PTIC · Yaoundé",
    "hero.lead":
      "We bring together students who love technology around real projects: AI, software, cybersecurity, networks and IoT. The Club trains, experiments and ships — with the standards of a professional tech team.",
    "hero.discover": "Discover the club",
    "hero.projects": "Our projects",
    "hero.carousel": "Club highlights",
    "hero.photos": "Hero photos",
    "partners.label": "Partners",
    "about.team.eyebrow": "Board",
    "about.team.title": "The team that leads the Club",
    "about.team.lead":
      "The Executive Board represents members to the administration and coordinates club life.",
    "about.org.eyebrow": "Organisation",
    "about.org.title": "One board, three units",
    "about.org.lead": "Each member joins a unit based on their interests and available time.",
    "footer.nav": "Navigation",
    "footer.contact": "Contact",
    "footer.form": "Contact form",
    "footer.rights": "All rights reserved.",
    "footer.legal":
      "Student club recognised by the SUP'PTIC Administration and the Students' Association.",
    "cta.title": "Want to build with us?",
    "cta.lead":
      "The Club is open to every regularly enrolled SUP'PTIC student, whatever their technical level. Join a unit and take part in our projects this semester.",
    "cta.join": "Join the club",
    "card.featured": "Flagship project",
    "nav.statuts": "Statutes",
    "card.sheet": "View details",
    "lang.fr": "FR",
    "lang.en": "EN",
    "lang.toggle": "Language",
  },
} as const;

export type MessageKey = keyof typeof messages.fr;

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

export function t(key: MessageKey, lang: Locale = locale): string {
  return messages[lang][key];
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
    t: (key: MessageKey) => t(key, current),
  };
}
