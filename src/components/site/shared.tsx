import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/data/club";
import { cn } from "@/lib/utils";

export function PageHeader({ title, lead }: { title: string; lead: string }) {
  return (
    <section className="night-panel">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-base text-night-muted">{lead}</p>
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="font-mono text-xs tracking-widest text-primary uppercase">{eyebrow}</p>
        )}
        <h2 className="mt-2 font-display text-2xl sm:text-3xl">{title}</h2>
        {lead && <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <Badge variant={status === "En cours" ? "default" : "secondary"} className="rounded-full">
      {status}
    </Badge>
  );
}

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const body = (
    <Card
      className={cn(
        "h-full overflow-hidden py-0 transition-shadow hover:shadow-[var(--shadow-elevated)]",
        featured && "md:grid md:grid-cols-2",
      )}
    >
      <img
        src={project.image}
        alt={`Illustration du projet ${project.name}`}
        loading="lazy"
        width={1200}
        height={800}
        className={cn("h-48 w-full object-cover", featured && "md:h-full")}
      />
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {featured && <Badge className="rounded-full bg-accent text-accent-foreground">Projet phare</Badge>}
          <StatusBadge status={project.status} />
          <span className="text-xs text-muted-foreground">{project.domain}</span>
        </div>
        <h3 className={cn("font-display text-xl", featured && "sm:text-2xl")}>{project.name}</h3>
        <p className="text-sm font-medium text-primary">{project.subtitle}</p>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <ul className="mt-1 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-secondary px-2 py-1 font-mono text-[11px] text-secondary-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.href ? (
            <Button asChild size="sm">
              <Link to="/projects/supone-ai">
                Voir la fiche <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <a href="https://github.com/" target="_blank" rel="noreferrer">
                <Github className="size-4" /> GitHub
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return body;
}

export function CTASection() {
  return (
    <section className="night-panel">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl">Envie de construire avec nous&nbsp;?</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-night-muted">
          Le Club est ouvert à tout étudiant régulièrement inscrit à SUP'PTIC, quel que soit son niveau technique.
          Rejoins un pôle et participe à nos projets dès ce semestre.
        </p>
        <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/join">
            Rejoindre le club <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
