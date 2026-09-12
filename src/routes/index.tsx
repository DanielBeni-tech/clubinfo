import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Code2,
  Cpu,
  Lightbulb,
  Network,
  Shield,
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Partners } from "@/components/site/Partners";
import { Reveal } from "@/components/site/Reveal";
import { CTASection, ProjectCard, SectionTitle } from "@/components/site/shared";
import { club, events, expertise, gallery, projects, stats } from "@/data/club";

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
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  component: Home,
});

const icons = { brain: Brain, code: Code2, shield: Shield, network: Network, cpu: Cpu, lightbulb: Lightbulb };

function Home() {
  const featured = projects.find((p) => p.featured) ?? projects[0]!;
  const others = projects.filter((p) => p !== featured);


  return (
    <div>
      <section className="relative overflow-hidden bg-night text-night-foreground">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-night via-night/85 to-night/45" />
        <div className="absolute inset-0 bg-night/25" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 lg:py-32">
          <p className="animate-in fade-in slide-in-from-bottom-2 font-mono text-xs tracking-[0.25em] text-accent uppercase duration-700">
            SUP'PTIC · Yaoundé
          </p>
          <h1 className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-3xl font-display text-4xl leading-tight duration-700 sm:text-5xl lg:text-6xl [animation-delay:80ms]">
            {club.name}
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-3 mt-4 font-display text-lg text-accent duration-700 sm:text-xl [animation-delay:160ms]">
            « {club.tagline} »
          </p>
          <p className="animate-in fade-in slide-in-from-bottom-3 mt-6 max-w-2xl text-base text-night-muted duration-700 [animation-delay:240ms]">
            Nous réunissons les étudiants passionnés de technologie autour de projets réels : intelligence
            artificielle, développement, cybersécurité, réseaux et objets connectés. Le Club forme, expérimente et
            livre — avec l'exigence d'une équipe tech professionnelle.
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-3 mt-9 flex flex-col gap-3 duration-700 sm:flex-row [animation-delay:320ms]">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/about">Découvrir le club</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
            >
              <Link to="/projects">Nos projets</Link>
            </Button>
          </div>
          <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-night-muted/20 pt-8 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="animate-in fade-in slide-in-from-bottom-2 duration-700"
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl text-accent sm:text-3xl">{s.value}</dd>
                <p className="mt-1 text-xs text-night-muted">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow="À propos"
              title="Un club étudiant, une exigence professionnelle"
              lead="Né au sein de SUP'PTIC, le Club Informatique rassemble des étudiants qui veulent apprendre en construisant. Nos pôles travaillent comme une petite structure tech : cadrage, développement, livraison et communication."
              action={
                <Button asChild variant="outline">
                  <Link to="/about">
                    En savoir plus <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-3">
            {["Apprendre par la pratique", "Partager entre pairs", "Livrer des projets utiles"].map((v, i) => (
              <Reveal key={v} delay={i * 90}>
                <li className="rounded-lg border border-border bg-secondary/50 p-5 font-display text-base">
                  {v}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y bg-surface">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow="Expertise"
              title="Nos domaines d'expertise"
              lead="Six domaines couverts par les membres du Club, en formation comme en projet."
            />
          </Reveal>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, i) => {
              const Icon = icons[item.icon];
              return (
                <Reveal key={item.title} delay={i * 70}>
                  <li>
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <span className="grid size-11 place-items-center rounded-lg bg-secondary text-primary">
                          <Icon className="size-5" />
                        </span>
                        <h3 className="mt-4 font-display text-lg">{item.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow="Projets"
              title="Ce que nous construisons"
              lead="Des réalisations concrètes, portées par les pôles Innovation & Projets et Développement."
              action={
                <Button asChild variant="outline">
                  <Link to="/projects">
                    Tous les projets <ArrowRight className="size-4" />
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
              eyebrow="Activités"
              title="Prochains rendez-vous"
              action={
                <Button asChild variant="outline">
                  <Link to="/events">
                    Tous les événements <ArrowRight className="size-4" />
                  </Link>
                </Button>
              }
            />
          </Reveal>
          <ul className="grid gap-5 md:grid-cols-3">
            {events.slice(0, 3).map((e, i) => (
              <Reveal key={e.title} delay={i * 90}>
                <li>
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full">
                          {e.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{e.displayDate}</span>
                      </div>
                      <h3 className="mt-3 font-display text-lg">{e.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                    </CardContent>
                  </Card>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <SectionTitle
              eyebrow="Galerie"
              title="La vie du club"
              action={
                <Button asChild variant="outline">
                  <Link to="/gallery">
                    Voir la galerie <ArrowRight className="size-4" />
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
                    alt={item.alt}
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

      <section className="border-y border-border bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="text-center font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Partenaires
            </p>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
              SUP'PTIC, MINPOSTEL, CAMTEL, CAMPOST et Huawei.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8">
              <Partners />
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <CTASection />
      </Reveal>
    </div>
  );
}
