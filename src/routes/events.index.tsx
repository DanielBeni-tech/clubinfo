import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTASection, PageHeader } from "@/components/site/shared";
import { events, isUpcoming, type ClubEvent } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { eventDateLabel, eventDateParts } from "@/lib/event-utils";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Activités & événements — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Cérémonies, ateliers, présentations et concours organisés par le Club Informatique SUP'PTIC.",
      },
      { property: "og:title", content: "Activités & événements du Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Les prochains rendez-vous et les activités passées du Club.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { t } = useLocale();
  const [type, setType] = useState<string>("Tous");

  // Seuls les types réellement utilisés sont proposés comme filtres
  const types = useMemo(() => ["Tous", ...new Set(events.map((e) => e.type))], []);
  const filtered = useMemo(() => events.filter((e) => type === "Tous" || e.type === type), [type]);
  const upcoming = filtered
    .filter((e) => isUpcoming(e))
    .sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));
  const past = filtered.filter((e) => !isUpcoming(e));

  return (
    <div>
      <PageHeader title={t("events.title")} lead={t("events.lead")} />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-wrap gap-2">
            {types.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={type === item ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setType(item)}
              >
                {t(`events.type.${item}` as MessageKey)}
              </Button>
            ))}
          </div>

          <h2 className="font-display text-2xl">{t("events.upcoming")}</h2>
          {upcoming.length === 0 ? (
            <Empty text={t("events.emptyUpcoming")} />
          ) : (
            <ul className="mt-6 grid gap-6">
              {upcoming.map((e) => (
                <li key={e.slug}>
                  <UpcomingCard e={e} />
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-16 font-display text-2xl">{t("events.past")}</h2>
          {past.length === 0 ? (
            <Empty text={t("events.emptyPast")} />
          ) : (
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <li key={e.slug}>
                  <PastCard e={e} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="mt-4 rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function UpcomingCard({ e }: { e: ClubEvent }) {
  const { locale, t } = useLocale();
  const parts = eventDateParts(e, locale);
  const title = locale === "en" ? e.titleEn : e.title;
  const visual = e.poster ?? e.image;

  return (
    <article
      className={cn(
        "grid overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        visual && "md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]",
      )}
    >
      {visual ? (
        <Link to="/events/$slug" params={{ slug: e.slug }} className="block bg-secondary">
          <img
            src={visual}
            alt={e.poster ? t("events.posterAlt", { title }) : title}
            loading="lazy"
            className={cn(
              "w-full object-cover",
              e.poster ? "aspect-4/5 object-top" : "aspect-4/3 md:h-full",
            )}
          />
        </Link>
      ) : null}
      <div className="flex flex-col p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full">{t(`events.type.${e.type}` as MessageKey)}</Badge>
          <Badge variant="secondary" className="rounded-full">
            {t("events.badge.upcoming")}
          </Badge>
        </div>
        <h3 className="mt-4 font-display text-2xl leading-tight sm:text-3xl">{title}</h3>
        <p className="mt-3 text-muted-foreground">
          {locale === "en" ? e.descriptionEn : e.description}
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex gap-3">
            <CalendarClock className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <dt className="text-xs font-semibold text-muted-foreground">{t("events.when")}</dt>
              <dd className="font-medium text-foreground">
                {parts ? (
                  <>
                    {parts.date}
                    <span className="block text-primary">{parts.time}</span>
                  </>
                ) : (
                  eventDateLabel(e, locale)
                )}
              </dd>
            </div>
          </div>
          {e.location ? (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <dt className="text-xs font-semibold text-muted-foreground">{t("events.where")}</dt>
                <dd className="font-medium text-foreground">
                  {loc(e.location, locale)}
                  {e.locationDetail ? (
                    <span className="block text-sm font-normal text-muted-foreground">
                      {loc(e.locationDetail, locale)}
                    </span>
                  ) : null}
                </dd>
              </div>
            </div>
          ) : null}
        </dl>

        <div className="mt-auto pt-8">
          <Button asChild>
            <Link to="/events/$slug" params={{ slug: e.slug }}>
              {t("events.details")} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function PastCard({ e }: { e: ClubEvent }) {
  const { locale, t } = useLocale();
  const title = locale === "en" ? e.titleEn : e.title;
  return (
    <Link
      to="/events/$slug"
      params={{ slug: e.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-colors hover:border-primary/40"
    >
      {e.image ? (
        <img
          src={e.image}
          alt={title}
          loading="lazy"
          className="aspect-16/10 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="aspect-16/10 bg-secondary" aria-hidden="true" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="rounded-full">
            {t(`events.type.${e.type}` as MessageKey)}
          </Badge>
          {eventDateLabel(e, locale)}
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {locale === "en" ? e.descriptionEn : e.description}
        </p>
      </div>
    </Link>
  );
}
