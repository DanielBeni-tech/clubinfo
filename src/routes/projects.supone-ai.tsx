import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Globe } from "lucide-react";
import projectSupone from "@/assets/images/projects/supone.jpg";
import galleryMeeting from "@/assets/images/gallery/meeting.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CTASection } from "@/components/site/shared";
import { projects } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/projects/supone-ai")({
  head: () => ({
    meta: [
      { title: "SUP'ONE AI — Projet phare du Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "SUP'ONE AI, l'assistant intelligent des étudiants de SUP'PTIC : problème résolu, approche technique, équipe et démonstration.",
      },
      { property: "og:title", content: "SUP'ONE AI — assistant intelligent de SUP'PTIC" },
      {
        property: "og:description",
        content:
          "Le projet phare du Club Informatique SUP'PTIC : un assistant IA au service des étudiants.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: SuponePage,
});

function SuponePage() {
  const { locale, t } = useLocale();
  const next = projects.find((p) => !p.featured);

  return (
    <div>
      <section className="night-panel">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <nav aria-label={t("supone.crumb")} className="text-xs text-night-muted">
            <Link to="/projects" className="hover:text-accent">
              {t("nav.projects")}
            </Link>
            <span className="mx-2">/</span>
            <span>SUP'ONE AI</span>
          </nav>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl">SUP'ONE AI</h1>
          <p className="mt-3 max-w-2xl text-lg text-accent">
            {t("supone.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="rounded-full bg-accent text-accent-foreground">{t("card.featured")}</Badge>
            <Badge className="rounded-full">{t("status.ongoing")}</Badge>
            <Badge variant="secondary" className="rounded-full">
              {t("projects.domain.Intelligence Artificielle")}
            </Badge>
            <Badge variant="secondary" className="rounded-full">
              {t("projects.domain.Développement logiciel")}
            </Badge>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href="https://github.com/nkoumougrinnel/SupOneAI" target="_blank" rel="noreferrer">
                <Github className="size-4" /> {t("supone.github")}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
            >
              <a href="https://github.com/nkoumougrinnel/SupOneAI" target="_blank" rel="noreferrer">
                <Globe className="size-4" /> {t("supone.repo")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl">{t("supone.project")}</h2>
            <p className="mt-4 text-muted-foreground">{t("supone.p1")}</p>
            <h3 className="mt-8 font-display text-lg">{t("supone.approach")}</h3>
            <p className="mt-3 text-muted-foreground">{t("supone.p2")}</p>
            <h3 className="mt-8 font-display text-lg">{t("supone.tech")}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[
                "Python",
                "FastAPI",
                "LLM",
                "RAG",
                "PostgreSQL / pgvector",
                "React",
                "TypeScript",
              ].map((t) => (
                <li
                  key={t}
                  className="rounded-md bg-secondary px-2.5 py-1 font-mono text-xs text-secondary-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h3 className="font-display text-lg">{t("supone.team")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("supone.teamLead")}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t("supone.status")}</dt>
                  <dd className="font-medium">{t("supone.statusValue")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("supone.start")}</dt>
                  <dd className="font-medium">{t("supone.startValue")}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t("supone.members")}</dt>
                  <dd className="font-medium">{t("supone.membersValue")}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl">{t("supone.preview")}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <img
              src={projectSupone}
              alt={t("supone.alt1")}
              loading="lazy"
              width={1200}
              height={800}
              className="aspect-3/2 w-full rounded-lg border border-border object-cover"
            />
            <img
              src={galleryMeeting}
              alt={t("supone.alt2")}
              loading="lazy"
              width={1200}
              height={900}
              className="aspect-3/2 w-full rounded-lg border border-border object-cover"
            />
          </div>
        </div>
      </section>

      {next && (
        <section className="section-y">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col gap-4 rounded-lg border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {t("supone.next")}
                </p>
                <h2 className="mt-2 font-display text-xl">{next.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {locale === "en" ? next.subtitleEn : next.subtitle}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/projects">
                  {t("supone.all")} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
}
