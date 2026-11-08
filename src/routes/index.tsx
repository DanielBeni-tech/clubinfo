import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CalendarClock,
  Code2,
  Cpu,
  Hammer,
  Lightbulb,
  MapPin,
  Network,
  Rocket,
  Shield,
  Users,
} from "lucide-react";
import galleryGroup from "@/assets/images/gallery/group.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { PartnerMarquee } from "@/components/site/PartnerMarquee";
import { Reveal } from "@/components/site/Reveal";
import { CTASection, ProjectCard, SectionTitle } from "@/components/site/shared";
import {
  club,
  events,
  expertise,
  gallery,
  isUpcoming,
  joinForm,
  projects,
  stats,
} from "@/data/club";
import { eventDateParts } from "@/lib/event-utils";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Club Informatique SUP'PTIC — Une école, un esprit, une intelligence" },
      {
        name: "description",
        content:
          "Le Club Informatique de SUP'PTIC : projets tech réels dont SUP'ONE AI, formations, hackathons et une communauté d'étudiants passionnés.",
      },
      { property: "og:title", content: "Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Projets, formations et événements du Club Informatique de SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: Home,
});

const icons = {
  brain: Brain,
  code: Code2,
  shield: Shield,
  network: Network,
  cpu: Cpu,
  lightbulb: Lightbulb,
};

function Home() {
  const { locale, t } = useLocale();
  const featured = projects.find((p) => p.featured) ?? projects[0]!;
  const others = projects.filter((p) => p !== featured);
  const values = [
    { icon: Hammer, title: t("home.value.practice"), desc: t("home.value.practiceDesc") },
    { icon: Users, title: t("home.value.peers"), desc: t("home.value.peersDesc") },
    { icon: Rocket, title: t("home.value.ship"), desc: t("home.value.shipDesc") },
  ];
  const poles = joinForm.poles.slice(0, 3);
  const upcoming = events
    .filter((e) => isUpcoming(e))
    .sort((a, b) => (a.date || "9").localeCompare(b.date || "9"))
    .slice(0, 3);

  return (
    <div>
      <HeroSlideshow>
        <p className="animate-in fade-in slide-in-from-bottom-2 font-mono text-xs tracking-[0.25em] text-accent uppercase duration-700">
          {t("hero.kicker")}
        </p>
        <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-3xl font-display text-4xl leading-tight duration-700 sm:text-5xl lg:text-6xl [animation-delay:80ms]">
          {club.name}
        </h1>
        <p className="animate-in fade-in slide-in-from-bottom-3 mt-4 font-display text-lg text-accent duration-700 sm:text-xl [animation-delay:160ms]">
          « {locale === "en" ? club.taglineEn : club.tagline} »
        </p>
        <p className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-2xl text-base text-night-muted duration-700 [animation-delay:240ms]">
          {t("hero.lead")}
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-3 mt-9 flex flex-col gap-3 duration-700 sm:flex-row [animation-delay:320ms]">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/about">{t("hero.discover")}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
          >
            <Link to="/projects">{t("hero.projects")}</Link>
          </Button>
        </div>
        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-night-muted/20 pt-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="animate-in fade-in slide-in-from-bottom-2 duration-700"
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <dt className="sr-only">{locale === "en" ? s.labelEn : s.label}</dt>
              <dd className="font-display text-2xl text-accent sm:text-3xl">{s.value}</dd>
              <p className="mt-1 text-xs text-night-muted">
                {locale === "en" ? s.labelEn : s.label}
              </p>
            </div>
          ))}
        </dl>
      </HeroSlideshow>
      <PartnerMarquee />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div>
              <Reveal>
                <SectionTitle
                  eyebrow={t("home.about.eyebrow")}
                  title={t("home.about.title")}
                  lead={t("home.about.lead")}
                />
              </Reveal>
              <ul className="-mt-2 divide-y divide-border border-y border-border">
                {values.map(({ icon: Icon, title, desc }, i) => (
                  <li key={title}>
                    <Reveal delay={i * 90} className="flex gap-4 py-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <p className="font-display text-base leading-snug text-foreground">
                          {title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6">
                <Link to="/about">
                  {t("home.about.more")} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <Reveal delay={80}>
              <figure className="relative">
                <img
                  src={galleryGroup}
                  alt={t("home.groupAlt")}
                  width={1280}
                  height={960}
                  className="aspect-4/3 w-full rounded-2xl object-cover shadow-card"
                />
                <figcaption className="mt-3 rounded-xl border border-border bg-card p-3 shadow-xs sm:absolute sm:bottom-5 sm:left-5 sm:mt-0 sm:max-w-sm sm:border-white/20 sm:bg-background/90 sm:p-4 sm:shadow-card sm:backdrop-blur">
                  <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                    {t("home.about.poles")}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {poles.map((p) => (
                      <li
                        key={p.value}
                        className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {loc(p.label, locale)}
                      </li>
                    ))}
                  </ul>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow={t("home.expertise.eyebrow")}
              title={t("home.expertise.title")}
              lead={t("home.expertise.lead")}
            />
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-xs sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => {
              const Icon = icons[item.icon];
              return (
                <li key={item.title} className="bg-card">
                  <Reveal delay={i * 60} className="h-full">
                    <div className="group flex h-full gap-4 p-5 transition-colors hover:bg-secondary/40 sm:block sm:p-7">
                      <div className="flex shrink-0 items-center justify-between self-start">
                        <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-5" />
                        </span>
                        <span className="hidden font-mono text-xs text-muted-foreground/70 sm:inline">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg leading-snug sm:mt-5">
                          {locale === "en" ? item.titleEn : item.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-2">
                          {locale === "en" ? item.descriptionEn : item.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow={t("home.projects.eyebrow")}
              title={t("home.projects.title")}
              lead={t("home.projects.lead")}
              action={
                <Button asChild variant="outline">
                  <Link to="/projects">
                    {t("home.projects.all")} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <div className="grid gap-6">
            <Reveal>
              <ProjectCard project={featured} featured />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow={t("home.events.eyebrow")}
              title={t("home.events.title")}
              action={
                <Button asChild variant="outline">
                  <Link to="/events">
                    {t("home.events.all")} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          {upcoming.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t("home.events.none")}
            </p>
          ) : (
            <ul className="grid gap-4">
              {upcoming.map((e, i) => {
                const parts = eventDateParts(e, locale);
                return (
                  <li key={e.slug}>
                    <Reveal
                      delay={i * 90}
                      className="group relative grid overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-colors hover:border-primary/40 sm:grid-cols-[auto_minmax(0,1fr)_220px]"
                    >
                      <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-5 py-3 sm:w-32 sm:flex-col sm:justify-center sm:gap-1 sm:border-r sm:border-b-0 sm:py-6 sm:text-center">
                        {parts ? (
                          <>
                            <span className="font-display text-3xl leading-none text-primary">
                              {parts.day}
                            </span>
                            <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                              {parts.month} {parts.year}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground sm:mt-1">
                              {parts.time}
                            </span>
                          </>
                        ) : (
                          <>
                            <CalendarClock className="size-6 text-primary" />
                            <span className="text-xs font-semibold text-primary">
                              {t("home.events.tbc")}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="p-5 sm:p-6">
                        <Badge variant="secondary" className="rounded-full">
                          {t(`events.type.${e.type}` as MessageKey)}
                        </Badge>
                        <h3 className="mt-3 font-display text-lg leading-snug">
                          <Link
                            to="/events/$slug"
                            params={{ slug: e.slug }}
                            className="after:absolute after:inset-0 group-hover:text-primary"
                          >
                            {locale === "en" ? e.titleEn : e.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {locale === "en" ? e.descriptionEn : e.description}
                        </p>
                        {e.location ? (
                          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <MapPin className="size-4 text-primary" />
                            {loc(e.location, locale)}
                            {e.locationDetail ? (
                              <span className="font-normal text-muted-foreground">
                                · {loc(e.locationDetail, locale)}
                              </span>
                            ) : null}
                          </p>
                        ) : null}
                      </div>
                      {e.image ? (
                        <img
                          src={e.image}
                          alt=""
                          loading="lazy"
                          className="hidden h-full w-full object-cover sm:block"
                        />
                      ) : (
                        <div className="hidden bg-secondary/40 sm:block" />
                      )}
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow={t("home.gallery.eyebrow")}
              title={t("home.gallery.title")}
              action={
                <Button asChild variant="outline">
                  <Link to="/gallery">
                    {t("home.gallery.all")} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.slice(0, 8).map((item, i) => (
              <Reveal key={`${item.src}-${i}`} delay={i * 50}>
                <li className="overflow-hidden rounded-lg border border-border">
                  <img
                    src={item.src}
                    alt={locale === "en" ? item.altEn : item.alt}
                    loading="lazy"
                    width={1200}
                    height={900}
                    className="aspect-4/3 w-full object-cover"
                  />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Reveal>
        <CTASection />
      </Reveal>
    </div>
  );
}
