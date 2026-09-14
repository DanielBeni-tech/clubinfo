import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Partners } from "@/components/site/Partners";
import { CTASection, PageHeader, SectionTitle } from "@/components/site/shared";
import { bureau, objectives, poles } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale } from "@/lib/i18n";
import galleryGroup from "@/assets/images/gallery/group.jpg";
import galleryJuioPrize from "@/assets/images/gallery/juio-prize.jpg";
import galleryCollabGi from "@/assets/images/gallery/collab-club-gi.jpg";

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
  const { locale, t } = useLocale();
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
              Créé par des étudiants de SUP'PTIC, le Club est né d'un constat simple : les
              compétences techniques se construisent en pratiquant, ensemble, sur des sujets réels.
              Ce qui a commencé comme un groupe de travail informel est devenu une structure
              organisée, dotée d'une charte, d'un bureau et de pôles opérationnels.
            </p>
            <p className="mt-4 text-muted-foreground">
              Notre mission est de donner à chaque étudiant de l'école un espace où apprendre,
              expérimenter et contribuer — de la première ligne de code à la mise en production d'un
              projet utile à la communauté SUP'PTIC.
            </p>
            <p className="mt-4 text-muted-foreground">
              Nos valeurs : la rigueur technique, le partage entre pairs, l'ouverture à tous les
              niveaux et l'engagement au service de l'école.
            </p>
          </div>
          <img
            src={galleryGroup}
            alt="Membres du Club Informatique SUP'PTIC réunis en photo de groupe"
            width={1280}
            height={960}
            className="w-full rounded-xl border border-border object-cover shadow-[var(--shadow-card)]"
          />
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl gap-4 px-4 sm:grid-cols-2">
          <img
            src={galleryJuioPrize}
            alt="Le Club aux Journées universitaires de l'informatique 2026, Prix du meilleur projet"
            width={1280}
            height={960}
            className="aspect-4/3 w-full rounded-xl border border-border object-cover"
          />
          <img
            src={galleryCollabGi}
            alt="Rencontre entre le Club Informatique et un club partenaire"
            width={1280}
            height={960}
            className="aspect-4/3 w-full rounded-xl border border-border object-cover"
          />
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow={t("about.team.eyebrow")}
            title={t("about.team.title")}
            lead={t("about.team.lead")}
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bureau.map((member) => (
              <li key={`${member.role}-${member.name}`}>
                <article className="overflow-hidden rounded-xl border border-border bg-background shadow-[var(--shadow-card)]">
                  <img
                    src={member.image}
                    alt={`${member.name}, ${locale === "en" ? member.roleEn : member.role}`}
                    width={900}
                    height={1200}
                    className="aspect-3/4 w-full object-cover object-top"
                  />
                  <div className="p-4">
                    <h3 className="font-display text-base">{member.name}</h3>
                    <p className="mt-1 text-sm text-primary">
                      {locale === "en" ? member.roleEn : member.role}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        {" "}
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            eyebrow="Charte"
            title="Nos cinq objectifs"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/statuts">
                  Statuts du Club <ArrowRight className="size-4" />
                </Link>
              </Button>
            }
          />
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
            eyebrow={t("about.org.eyebrow")}
            title={t("about.org.title")}
            lead={t("about.org.lead")}
          />
          <ul className="grid gap-5 md:grid-cols-2">
            {poles.map((p) => (
              <li key={p.name}>
                <Card className="h-full overflow-hidden py-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={locale === "en" ? p.nameEn : p.name}
                      width={1280}
                      height={960}
                      className="aspect-4/3 w-full object-cover"
                    />
                  ) : null}
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg text-primary">
                      {locale === "en" ? p.nameEn : p.name}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {locale === "en" ? p.roleEn : p.role}
                    </p>
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
