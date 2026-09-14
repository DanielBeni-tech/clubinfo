import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CTASection, PageHeader, ProjectCard } from "@/components/site/shared";
import { projects } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale, type MessageKey } from "@/lib/i18n";
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

const statuses = ["Tous", "En cours", "Terminé"] as const;

function ProjectsPage() {
  const { t } = useLocale();
  const [status, setStatus] = useState<(typeof statuses)[number]>("Tous");

  const filtered = useMemo(
    () => projects.filter((p) => status === "Tous" || p.status === status),
    [status],
  );

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div>
      <PageHeader title={t("projects.title")} lead={t("projects.lead")} />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col gap-4">
            <FilterRow
              label={t("projects.status")}
              options={statuses}
              value={status}
              onChange={setStatus}
              translate={(option) =>
                option === "Tous"
                  ? t("filter.all")
                  : option === "En cours"
                    ? t("status.ongoing")
                    : t("status.done")
              }
            />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-lg border border-border bg-surface p-8 text-center text-sm text-muted-foreground">
              {t("projects.empty")}
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

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
  translate,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  translate: (option: T) => string;
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
          {translate(option)}
        </Button>
      ))}
    </div>
  );
}
