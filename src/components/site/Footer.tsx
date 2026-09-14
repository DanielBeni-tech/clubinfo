import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { LangToggle } from "@/components/site/LangToggle";
import { club } from "@/data/club";
import { useLocale } from "@/lib/i18n";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="night-panel mt-auto">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted withWordmark={false} className="w-fit" />
          <p className="mt-3 font-display text-base font-bold">{club.name}</p>
          <p className="mt-4 max-w-sm text-sm text-night-muted">
            {club.tagline}. Le Club Informatique fédère les étudiants de SUP'PTIC autour de projets
            technologiques concrets.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={club.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn du Club"
              className="grid size-9 place-items-center rounded-md border border-night-muted/30 transition-colors hover:border-accent hover:text-accent"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href={club.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub du Club"
              className="grid size-9 place-items-center rounded-md border border-night-muted/30 transition-colors hover:border-accent hover:text-accent"
            >
              <Github className="size-4" />
            </a>
            <a
              href={`mailto:${club.email}`}
              aria-label="Écrire au Club"
              className="grid size-9 place-items-center rounded-md border border-night-muted/30 transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">{t("footer.nav")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-night-muted">
            <li>
              <Link to="/about" className="hover:text-accent">
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-accent">
                {t("nav.projects")}
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-accent">
                {t("nav.events")}
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-accent">
                {t("nav.gallery")}
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-accent">
                {t("nav.join")}
              </Link>
            </li>
            <li>
              <Link to="/statuts" className="hover:text-accent">
                {t("nav.statuts")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">{t("footer.contact")}</h3>
          <ul className="mt-4 space-y-2 text-sm text-night-muted">
            <li>
              <a href={`mailto:${club.email}`} className="hover:text-accent">
                {club.email}
              </a>
            </li>
            <li>
              <a
                href={club.schoolUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent"
              >
                e-supptic.cm
              </a>
            </li>
            <li>SUP'PTIC — Yaoundé & Buea</li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                {t("footer.form")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-night-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {club.name}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-3">
            <p>{t("footer.legal")}</p>
            <LangToggle inverted />
          </div>
        </div>
      </div>
    </footer>
  );
}
