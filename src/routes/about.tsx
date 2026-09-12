import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection, PageHeader, SectionTitle } from "@/components/site/shared";
import { objectives, poles } from "@/data/club";

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
    ],
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
        <div className="mx-auto max-w-3xl px-4">
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
      </section>

      <section className="section-y bg-surface">
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

      <section className="section-y">
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

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Partenariats" title="Un ancrage institutionnel" />
          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg">Administration SUP'PTIC</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Le Club agit avec l'accord et le soutien de l'administration de l'école, qui met à disposition
                  salles et matériel pour les formations et les événements.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-display text-lg">Association des Étudiants</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nos activités s'inscrivent dans la vie associative de l'école, en coordination avec l'Association
                  des Étudiants de SUP'PTIC.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
