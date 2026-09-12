import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { CTASection, PageHeader } from "@/components/site/shared";
import { gallery } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Galerie — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content: "Photos des événements, formations, projets et de la vie du Club Informatique SUP'PTIC.",
      },
      { property: "og:title", content: "Galerie du Club Informatique SUP'PTIC" },
      { property: "og:description", content: "La vie du Club en images : événements, formations et projets." },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: GalleryPage,
});

const categories = ["Toutes", "Événements", "Formations", "Projets", "Vie du club"];

function GalleryPage() {
  const [category, setCategory] = useState("Toutes");
  const items = useMemo(
    () => gallery.filter((g) => category === "Toutes" || g.category === category),
    [category],
  );

  return (
    <div>
      <PageHeader
        title="Galerie"
        lead="Les moments qui font le Club : sessions de travail, formations, hackathons, conférences et rencontres entre membres."
      />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={category === c ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <GalleryGrid items={items} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
