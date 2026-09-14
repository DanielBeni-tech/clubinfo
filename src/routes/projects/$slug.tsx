import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Github, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/site/shared";
import { projects } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const project = projects.find((item) => item.slug === params.slug);
    return {
      meta: [
        { title: `${project?.name ?? "Projet"} — Club Informatique SUP'PTIC` },
        {
          name: "description",
          content: project?.summary ?? "Projet du Club Informatique SUP'PTIC.",
        },
        ...brandSocialMeta,
      ],
      links: [...brandHeadLinks],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">Projet introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/projects">Retour aux projets</Link>
      </Button>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw notFound();
  }

  const next = projects[(projects.indexOf(project) + 1) % projects.length] ?? project;

  return (
    <div>
      <section className="night-panel">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <nav aria-label="Fil d'Ariane" className="text-xs text-night-muted">
            <Link to="/projects" className="inline-flex items-center gap-1 hover:text-accent">
              <ArrowLeft className="size-3.5" /> Projets
            </Link>
            <span className="mx-2">/</span>
            <span>{project.name}</span>
          </nav>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
            <div className="flex h-full flex-col justify-center">
              <h1 className="font-display text-3xl sm:text-5xl">{project.name}</h1>
              <p className="mt-3 max-w-2xl text-lg text-accent">{project.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Badge className="rounded-full">{project.status}</Badge>
              </div>
                <div className="mt-8 flex flex-wrap gap-3">
                    {project.github && (
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <a href={project.github} target="_blank" rel="noreferrer">
                        <Github className="size-4" /> Voir sur GitHub
                        </a>
                    </Button>
                    )}
                    {project.href?.startsWith("http") && (
                    <Button
                        asChild
                        variant="outline"
                        className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
                    >
                        <a href={project.href} target="_blank" rel="noreferrer">
                        <Globe className="size-4" /> Voir la démo
                        </a>
                    </Button>
                    )}
                </div>
            </div>
            <img
              src={project.image}
              alt={`Illustration du projet ${project.name}`}
              width={1200}
              height={800}
              className="aspect-4/3 w-full rounded-lg border border-night-muted/30 object-cover lg:aspect-[1.15/1]"
            />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <h2 className="font-display text-2xl">Le projet</h2>
            <p className="mt-4 text-muted-foreground">
              {project.detailedDescription ?? project.summary}
            </p>
            <h2 className="mt-10 font-display text-2xl">Notre approche</h2>
            <p className="mt-4 text-muted-foreground">
              {project.approach ?? "Une équipe du Club construit ce projet par itérations, du cadrage au prototype puis à la démonstration."}
            </p>
            <h2 className="mt-10 font-display text-2xl">Fonctionnalités</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {(project.features ?? []).map((feature, index) => (
                <li
                  key={feature}
                  className="group flex min-h-20 items-start gap-3 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 pt-1 text-sm font-medium text-foreground">{feature}</span>
                  <Check className="mt-1 size-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h2 className="font-display text-xl">Technologies</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag} className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground">
                    {tag}
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Statut</dt>
                  <dd className="font-medium">{project.status}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Équipe porteuse</dt>
                  <dd className="font-medium">Club Informatique SUP'PTIC</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Projet suivant</p>
              <h2 className="mt-2 font-display text-xl">{next.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{next.subtitle}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/projects/$slug" params={{ slug: next.slug }}>
                Voir le projet <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
