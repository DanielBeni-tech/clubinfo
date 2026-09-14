import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CTASection, PageHeader, ProjectCard } from "@/components/site/shared";
import { projects } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projets — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Les projets du Club Informatique SUP'PTIC : SUP'ONE AI, Syntra, CyberVeille, Campus IoT et les réalisations de nos pôles.",
      },
      { property: "og:title", content: "Les projets du Club Informatique SUP'PTIC" },
      { property: "og:description", content: "SUP'ONE AI et les autres réalisations du Club." },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: ProjectsPage,
});

const statuses = ["Tous", "En cours", "Terminé"];

function ProjectsPage() {
  const [status, setStatus] = useState("Tous");

  const filtered = useMemo(
    () => projects.filter((p) => status === "Tous" || p.status === status),
    [status],
  );

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div>
      <PageHeader
        title="Nos projets"
        lead="Chaque projet est porté par une équipe de membres, du cadrage à la livraison. SUP'ONE AI est notre projet phare."
      />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4">
            <FilterRow label="Statut" options={statuses} value={status} onChange={setStatus} />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
              Aucun projet ne correspond à ces filtres pour le moment.
            </p>
          ) : (
            <div className="grid gap-6">
              {featured && <ProjectCard project={featured} featured />}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2">
                  {rest.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={value === option ? "default" : "outline"}
          onClick={() => onChange(option)}
          className={cn("rounded-full")}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
