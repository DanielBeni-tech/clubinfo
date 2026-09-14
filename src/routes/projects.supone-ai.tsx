import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Globe } from "lucide-react";
import projectSupone from "@/assets/images/projects/supone.jpg";
import galleryMeeting from "@/assets/images/gallery/meeting.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/site/shared";
import { projects } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/projects/supone-ai")({
  head: () => ({
    meta: [
      { title: "SUP'ONE AI — Projet phare du Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "SUP'ONE AI, l'assistant intelligent des étudiants de SUP'PTIC : problème résolu, approche technique, équipe et démonstration.",
      },
      { property: "og:title", content: "SUP'ONE AI — assistant intelligent de SUP'PTIC" },
      {
        property: "og:description",
        content:
          "Le projet phare du Club Informatique SUP'PTIC : un assistant IA au service des étudiants.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: SuponePage,
});

function SuponePage() {
  const next = projects.find((p) => !p.featured);

  return (
    <div>
      <section className="night-panel">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <nav aria-label="Fil d'Ariane" className="text-xs text-night-muted">
            <Link to="/projects" className="hover:text-accent">
              Projets
            </Link>
            <span className="mx-2">/</span>
            <span>SUP'ONE AI</span>
          </nav>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl">SUP'ONE AI</h1>
          <p className="mt-3 max-w-2xl text-lg text-accent">
            L'assistant intelligent des étudiants de SUP'PTIC
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="rounded-full bg-accent text-accent-foreground">Projet phare</Badge>
            <Badge className="rounded-full">En cours</Badge>
            <Badge variant="secondary" className="rounded-full">
              Intelligence Artificielle
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              Développement logiciel
            </Badge>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="https://github.com/nkoumougrinnel/SupOneAI" target="_blank" rel="noreferrer">
                <Github className="size-4" /> Voir sur GitHub
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
            >
              <a href="https://github.com/nkoumougrinnel/SupOneAI" target="_blank" rel="noreferrer">
                <Globe className="size-4" /> Dépôt SUP'ONE AI
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl">Le projet</h2>
            <p className="mt-4 text-muted-foreground">
              Trouver une information administrative ou pédagogique à SUP'PTIC prend souvent
              plusieurs jours : l'information circule entre affichages, groupes de discussion et
              documents dispersés. SUP'ONE AI répond à ce problème avec un assistant conversationnel
              qui interroge une base documentaire officielle et répond en français, en citant sa
              source.
            </p>
            <h3 className="mt-8 font-display text-lg">Notre approche</h3>
            <p className="mt-3 text-muted-foreground">
              L'assistant repose sur une architecture de recherche augmentée (RAG) : les documents
              de l'école sont découpés, vectorisés et interrogés à chaque question, avant qu'un
              modèle de langage ne formule une réponse ancrée dans ces extraits. Ce choix limite les
              réponses inventées et rend chaque réponse vérifiable.
            </p>
            <h3 className="mt-8 font-display text-lg">Technologies</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[
                "Python",
                "FastAPI",
                "LLM",
                "RAG",
                "PostgreSQL / pgvector",
                "React",
                "TypeScript",
              ].map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="font-display text-lg">Équipe porteuse</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pôle Innovation & Projets (cadrage et données) et Pôle Développement (backend,
                interface, déploiement), avec le soutien du Bureau Exécutif pour les relations avec
                l'administration.
              </p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd className="font-medium">En cours — version bêta interne</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Démarrage</dt>
                  <dd className="font-medium">Semestre 1, 2025</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Membres impliqués</dt>
                  <dd className="font-medium">9 étudiants</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl">Aperçu</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <img
              src={projectSupone}
              alt="Équipe du Club en session de travail sur SUP'ONE AI"
              loading="lazy"
              width={1200}
              height={800}
              className="aspect-3/2 w-full rounded-lg border border-border object-cover"
            />
            <img
              src={galleryMeeting}
              alt="Réunion de travail du Club autour d'un projet logiciel"
              loading="lazy"
              width={1200}
              height={900}
              className="aspect-3/2 w-full rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      </section>

      {next && (
        <section className="section-y">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col gap-4 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  Projet suivant
                </p>
                <h2 className="mt-2 font-display text-xl">{next.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{next.subtitle}</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/projects">
                  Voir tous les projets <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
}
