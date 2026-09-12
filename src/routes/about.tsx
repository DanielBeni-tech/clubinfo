import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Partners } from "@/components/site/Partners";
import { CTASection, PageHeader, SectionTitle } from "@/components/site/shared";
import { bureau, objectives, poles } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import galleryTeam from "@/assets/gallery-team.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Mission, valeurs, objectifs et structure du Club Informatique SUP'PTIC : Bureau Exécutif et trois pôles opérationnels.",
      },
      { property: "og:title", content: "À propos du Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Mission, valeurs et organisation du Club Informatique de SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <PageHeader
        title="À propos du Club"
        lead="Le Club Informatique de SUP'PTIC est une association étudiante qui fédère les passionnés du numérique autour de la formation, de l'expérimentation et de projets livrés."
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Notre histoire et notre mission</h2>
            <p className="mt-4 text-muted-foreground">
              Créé par des étudiants de SUP'PTIC, le Club est né d'un constat simple : les compétences techniques se
              construisent en pratiquant, ensemble, sur des sujets réels. Ce qui a commencé comme un groupe de travail
              informel est devenu une structure organisée, dotée d'une charte, d'un bureau et de pôles opérationnels.
            </p>
            <p className="mt-4 text-muted-foreground">
              Notre mission est de donner à chaque étudiant de l'école un espace où apprendre, expérimenter et
              contribuer — de la première ligne de code à la mise en production d'un projet utile à la communauté
              SUP'PTIC.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nos valeurs : la rigueur technique, le partage entre pairs, l'ouverture à tous les niveaux et
              l'engagement au service de l'école.
            </p>
          </div>
          <img
            src={galleryTeam}
            alt="Membres du Club réunis autour d'un projet"
            width={1200}
            height={900}
            className="w-full rounded-xl border border-border object-cover shadow-[var(--shadow-card)]"
          />
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="Bureau"
            title="L'équipe qui porte le Club"
            lead="Le Bureau Exécutif représente les membres auprès de l'administration et coordonne la vie associative."
          />
          <ul className="grid gap-6 sm:max-w-md">
            {bureau.map((member) => (
              <li key={member.name}>
                <article className="overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-card)]">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    width={900}
                    height={900}
                    className="aspect-4/5 w-full object-cover object-top"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-lg">{member.name}</h3>
                    <p className="mt-1 text-sm text-primary">{member.role}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Charte" title="Nos cinq objectifs" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {objectives.map((o) => (
              <li key={o} className="flex gap-3 rounded-lg border border-border bg-background p-5">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="Organisation"
            title="Un bureau, trois pôles"
            lead="Chaque membre rejoint un pôle en fonction de ses centres d'intérêt et de son temps disponible."
          />
          <ul className="grid gap-5 md:grid-cols-2">
            {poles.map((p) => (
              <li key={p.name}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg text-primary">{p.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.role}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="Partenariats"
            title="Un ancrage institutionnel"
            lead="SUP'PTIC, MINPOSTEL, CAMTEL, CAMPOST et Huawei."
          />
          <Partners />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
