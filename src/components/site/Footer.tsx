import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Mail } from "lucide-react";
import { club } from "@/data/club";

export function Footer() {
  return (
    <footer className="night-panel mt-auto">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-md bg-accent font-display text-sm font-bold text-accent-foreground">
              CI
            </span>
            <span className="font-display text-base font-bold">{club.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-night-muted">
            {club.tagline}. Le Club Informatique fédère les étudiants de SUP'PTIC autour de projets technologiques
            concrets.
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
          <h3 className="font-display text-sm font-semibold">Navigation</h3>
          <ul className="mt-4 space-y-2 text-sm text-night-muted">
            <li>
              <Link to="/about" className="hover:text-accent">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-accent">
                Projets
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-accent">
                Événements
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-accent">
                Galerie
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-accent">
                Rejoindre
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-night-muted">
            <li>
              <a href={`mailto:${club.email}`} className="hover:text-accent">
                {club.email}
              </a>
            </li>
            <li>SUP'PTIC, Yaoundé — Cameroun</li>
            <li>
              <Link to="/contact" className="hover:text-accent">
                Formulaire de contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-night-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-night-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {club.name}. Tous droits réservés.</p>
          <p>Club étudiant reconnu par l'Administration SUP'PTIC et l'Association des Étudiants.</p>
        </div>
      </div>
    </footer>
  );
}
