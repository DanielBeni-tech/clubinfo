import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection, PageHeader } from "@/components/site/shared";
import { events } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Activités & événements — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Formations, conférences, hackathons, ateliers et visites organisés par le Club Informatique SUP'PTIC.",
      },
      { property: "og:title", content: "Activités & événements du Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Le calendrier des formations, hackathons et conférences du Club.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: EventsPage,
});

const types = [
  "Tous",
  "Formation",
  "Conférence",
  "Hackathon",
  "Atelier",
  "Visite",
  "Collaboration",
  "Concours",
];

function EventsPage() {
  const [type, setType] = useState("Tous");
  const filtered = useMemo(() => events.filter((e) => type === "Tous" || e.type === type), [type]);
  const upcoming = filtered.filter((e) => e.upcoming);
  const past = filtered.filter((e) => !e.upcoming);

  return (
    <div>
      <PageHeader
        title="Activités & événements"
        lead="Le Club anime toute l'année des formations entre pairs, des conférences, des hackathons et des visites professionnelles, ouverts à tous les membres."
      />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-wrap gap-2">
            {types.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={type === t ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setType(t)}
              >
                {t}
              </Button>
            ))}
          </div>

          <EventList
            title="À venir"
            items={upcoming}
            empty="Aucun événement à venir dans cette catégorie."
          />
          <div className="mt-14">
            <EventList
              title="Passés"
              items={past}
              empty="Aucun événement passé dans cette catégorie."
            />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}

function EventList({
  title,
  items,
  empty,
}: {
  title: string;
  items: typeof events;
  empty: string;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-4 rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <ul className="mt-6 grid gap-5">
          {items.map((e) => (
            <li key={e.title}>
              <Card className="overflow-hidden py-0 md:grid md:grid-cols-[280px_1fr]">
                {e.image ? (
                  <img
                    src={e.image}
                    alt={e.title}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="h-48 w-full object-cover md:h-full"
                  />
                ) : (
                  <div className="hidden bg-secondary md:block" aria-hidden="true" />
                )}
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full">{e.type}</Badge>
                    <span className="text-xs text-muted-foreground">{e.displayDate}</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl">{e.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
