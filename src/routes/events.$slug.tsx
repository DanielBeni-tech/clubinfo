import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  CalendarPlus,
  Download,
  Expand,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/shared";
import { events, isUpcoming, type ClubEvent } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import {
  SITE_URL,
  downloadIcs,
  eventDateLabel,
  eventDateParts,
  eventUrl,
  googleCalendarUrl,
  whatsappShareUrl,
} from "@/lib/event-utils";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";

export const Route = createFileRoute("/events/$slug")({
  head: ({ params }) => {
    const e = events.find((x) => x.slug === params.slug);
    if (!e) return { meta: [{ title: "Événement — Club Informatique SUP'PTIC" }] };
    const description = `${eventDateLabel(e, "fr")}${e.location ? ` · ${e.location.fr}` : ""} — ${e.description}`;
    // L'affiche sert d'aperçu quand le lien est partagé (WhatsApp, LinkedIn…)
    const image = e.poster ? `${SITE_URL}${e.poster}` : null;
    return {
      meta: [
        { title: `${e.title} — Club Informatique SUP'PTIC` },
        { name: "description", content: description },
        { property: "og:title", content: `${e.title} — Club Info SUP'PTIC` },
        { property: "og:description", content: description },
        { property: "og:url", content: eventUrl(e) },
        { property: "og:type", content: "website" },
        ...(image
          ? [
              ...brandSocialMeta.filter(
                (m) =>
                  !("property" in m && m.property.startsWith("og:image")) &&
                  !("name" in m && m.name.startsWith("twitter:image")),
              ),
              { property: "og:image", content: image },
              { property: "og:image:type", content: "image/jpeg" },
              { property: "og:image:alt", content: `Affiche : ${e.title}` },
              { name: "twitter:image", content: image },
            ]
          : brandSocialMeta),
      ],
      links: [...brandHeadLinks],
    };
  },
  notFoundComponent: NotFound,
  component: EventPage,
});

function NotFound() {
  const { t } = useLocale();
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl">{t("events.notFound")}</h1>
      <Button asChild className="mt-6">
        <Link to="/events">{t("events.back")}</Link>
      </Button>
    </div>
  );
}

function EventPage() {
  const { slug } = Route.useParams();
  const e = events.find((x) => x.slug === slug);
  if (!e) throw notFound();
  return <EventDetail e={e} />;
}

function EventDetail({ e }: { e: ClubEvent }) {
  const { locale, t } = useLocale();
  const upcoming = isUpcoming(e);
  const parts = eventDateParts(e, locale);
  const title = locale === "en" ? e.titleEn : e.title;
  const visual = e.poster ?? e.image;

  return (
    <div>
      <section className="night-panel">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            to="/events"
            className="inline-flex items-center gap-1 text-xs text-night-muted hover:text-accent"
          >
            <ArrowLeft className="size-3.5" /> {t("events.back")}
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-accent text-accent-foreground">
                  {t(`events.type.${e.type}` as MessageKey)}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-night-muted/40 text-night-foreground"
                >
                  {upcoming ? t("events.badge.upcoming") : t("events.badge.past")}
                </Badge>
              </div>
              <h1 className="mt-5 font-display text-3xl leading-tight sm:text-5xl">{title}</h1>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <Info icon={CalendarClock} label={t("events.when")}>
                  {parts ? (
                    <>
                      {parts.date}
                      <span className="block text-accent">{parts.time}</span>
                    </>
                  ) : (
                    eventDateLabel(e, locale)
                  )}
                </Info>
                {e.location ? (
                  <Info icon={MapPin} label={t("events.where")}>
                    {loc(e.location, locale)}
                    {e.locationDetail ? (
                      <span className="block text-sm font-normal text-night-muted">
                        {loc(e.locationDetail, locale)}
                      </span>
                    ) : null}
                  </Info>
                ) : null}
                {e.audience ? (
                  <Info icon={Users} label={t("events.who")}>
                    {loc(e.audience, locale)}
                  </Info>
                ) : null}
              </dl>

              {upcoming && parts ? (
                <div className="mt-9">
                  <p className="text-xs font-semibold tracking-wide text-night-muted uppercase">
                    {t("events.addToCalendar")}
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                      <a href={googleCalendarUrl(e)} target="_blank" rel="noreferrer">
                        <CalendarPlus className="size-4" /> {t("events.addGoogle")}
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="border-night-muted/40 bg-transparent text-night-foreground hover:bg-night-foreground/10 hover:text-night-foreground"
                      onClick={() => downloadIcs(e)}
                    >
                      <Download className="size-4" /> {t("events.addIcs")}
                    </Button>
                    <Button asChild className="bg-[#25D366] text-white hover:bg-[#1ebe5b]">
                      <a href={whatsappShareUrl(e)} target="_blank" rel="noreferrer">
                        <MessageCircle className="size-4" /> {t("events.share")}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {visual ? (
              <figure className="mx-auto w-full max-w-sm lg:max-w-none">
                <a href={visual} target="_blank" rel="noreferrer" className="group relative block">
                  <img
                    src={visual}
                    alt={e.poster ? t("events.posterAlt", { title }) : title}
                    className="w-full rounded-2xl border border-night-muted/30 shadow-2xl"
                  />
                  {e.poster ? (
                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand className="size-3.5" /> {t("events.posterOpen")}
                    </span>
                  ) : null}
                </a>
                {e.poster ? (
                  <figcaption className="mt-3 text-center">
                    <a
                      href={e.poster}
                      download
                      className="inline-flex items-center gap-1.5 text-sm text-night-muted hover:text-accent"
                    >
                      <Download className="size-4" /> {t("events.posterDownload")}
                    </a>
                  </figcaption>
                ) : null}
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-2xl">{t("events.about")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {locale === "en" ? e.descriptionEn : e.description}
          </p>
          {e.poster && e.image ? (
            <img
              src={e.image}
              alt={title}
              loading="lazy"
              className="mt-8 aspect-16/9 w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>
      </section>

      <CTASection />
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-night-foreground/10 text-accent">
        <Icon className="size-5" />
      </span>
      <div>
        <dt className="text-xs font-semibold text-night-muted">{label}</dt>
        <dd className="mt-0.5 font-medium text-night-foreground">{children}</dd>
      </div>
    </div>
  );
}
