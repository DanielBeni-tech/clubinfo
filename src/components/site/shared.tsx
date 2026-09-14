import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/data/club";
import { useLocale } from "@/lib/i18n";
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
  const { t } = useLocale();
  return (
    <Badge variant={status === "En cours" ? "default" : "secondary"} className="rounded-full">
      {status === "En cours" ? t("status.ongoing") : t("status.done")}
    </Badge>
  );
}

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  const { t } = useLocale();
  const body = (
    <Card className={cn("group flex h-full flex-col overflow-hidden py-0", featured && "md:grid md:grid-cols-2")}>
      <div className="relative">
        <img
          src={project.image}
          alt={t("card.projectAlt", { name: project.name })}
          loading="lazy"
          width={1200}
          height={800}
          className={cn("h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]", featured && "md:h-full")}
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {featured && (
            <Badge className="rounded-full bg-accent text-accent-foreground">
              {t("card.featured")}
            </Badge>
          )}
          <StatusBadge status={project.status} />
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl">{project.name}</h3>
        <p className="text-sm font-medium text-primary">{project.subtitle}</p>
        <p className="text-sm text-muted-foreground">{project.summary}</p>
        <div className="mt-auto flex justify-end pt-4">
          <Button asChild size="sm">
            <Link to="/projects/$slug" params={{ slug: project.slug }}>
              {t("card.sheet")} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return body;
}

export function CTASection() {
  const { t } = useLocale();
  return (
    <section className="night-panel">
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl">{t("cta.title")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-night-muted">{t("cta.lead")}</p>
        <Button
          asChild
          size="lg"
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link to="/join">
            {t("cta.join")} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
