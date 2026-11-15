import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight, Briefcase, CalendarClock, Clock, Users } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/shared";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale, type MessageKey } from "@/lib/i18n";
import {
  couleur,
  formatDateLimite,
  getAnnoncesOuvertes,
  structureNom,
  type AnnonceAvecStructure,
  type Structure,
} from "@/lib/recrutement";
import { cn } from "@/lib/utils";

type Search = { structure?: string };

export const Route = createFileRoute("/recrutement/")({
  head: () => ({
    meta: [
      { title: "Recrutement — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Postes ouverts dans les pôles du Club Informatique SUP'PTIC : missions, profil recherché et candidature en ligne.",
      },
      { property: "og:title", content: "Recrutement — Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Les pôles du club recrutent : découvre les postes ouverts et postule en ligne.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["structure"] === "string" && s["structure"] ? { structure: s["structure"] } : {},
  component: RecrutementPage,
});

const FAQ: [MessageKey, MessageKey][] = [
  ["recruit.faq.q1", "recruit.faq.a1"],
  ["recruit.faq.q2", "recruit.faq.a2"],
  ["recruit.faq.q3", "recruit.faq.a3"],
  ["recruit.faq.q4", "recruit.faq.a4"],
  ["recruit.faq.q5", "recruit.faq.a5"],
];

function RecrutementPage() {
  const { locale, t } = useLocale();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [annonces, setAnnonces] = useState<AnnonceAvecStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAnnoncesOuvertes()
      .then(setAnnonces)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Seules les structures qui ont des postes ouverts servent de filtre
  const structures = useMemo(() => {
    const map = new Map<string, Structure>();
    for (const a of annonces) if (a.structure) map.set(a.structure.id, a.structure);
    return [...map.values()].sort((a, b) => a.ordre - b.ordre);
  }, [annonces]);

  const visible = search.structure
    ? annonces.filter((a) => a.structure?.slug === search.structure)
    : annonces;

  function setStructure(slug?: string) {
    void navigate({ search: slug ? { structure: slug } : {}, replace: true });
  }

  return (
    <div>
      <PageHeader title={t("recruit.title")} lead={t("recruit.lead")} />

      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4">
          {loading ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              {t("recruit.loading")}
            </p>
          ) : error ? (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {t("recruit.loadError")}
            </p>
          ) : annonces.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-border p-10 text-center">
              <Briefcase className="mx-auto size-10 text-primary" />
              <h2 className="mt-4 font-display text-xl font-bold">{t("recruit.empty.title")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("recruit.empty.body")}</p>
              <Button asChild className="mt-6">
                <Link to="/join">{t("recruit.empty.cta")}</Link>
              </Button>
            </div>
          ) : (
            <>
              {structures.length > 1 ? (
                <div className="mb-8 flex gap-2 overflow-x-auto pb-1" role="tablist">
                  <FilterChip active={!search.structure} onClick={() => setStructure()}>
                    {t("recruit.all")} ({annonces.length})
                  </FilterChip>
                  {structures.map((s) => (
                    <FilterChip
                      key={s.id}
                      active={search.structure === s.slug}
                      onClick={() => setStructure(s.slug)}
                    >
                      <span className={cn("size-2 rounded-full", couleur(s.couleur).dot)} />
                      {structureNom(s, locale)} (
                      {annonces.filter((a) => a.structure_id === s.id).length})
                    </FilterChip>
                  ))}
                </div>
              ) : null}

              {visible.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                  {t("recruit.emptyFilter")}
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {visible.map((a) => (
                    <AnnonceCard key={a.id} a={a} />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="mx-auto mt-16 max-w-3xl">
            <h2 className="font-display text-2xl font-bold">{t("recruit.faq.title")}</h2>
            <Accordion type="single" collapsible className="mt-4">
              {FAQ.map(([q, a]) => (
                <AccordionItem key={q} value={q}>
                  <AccordionTrigger className="text-left">{t(q)}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{t(a)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnnonceCard({ a }: { a: AnnonceAvecStructure }) {
  const { locale, t } = useLocale();
  const c = couleur(a.structure?.couleur);
  return (
    <Link
      to="/recrutement/$slug"
      params={{ slug: a.slug }}
      className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
    >
      {a.structure ? (
        <span className={cn("self-start rounded-md px-2 py-0.5 text-xs font-medium", c.badge)}>
          {structureNom(a.structure, locale)}
        </span>
      ) : null}
      <h3 className="mt-3 font-display text-lg leading-snug font-bold text-foreground">
        {a.titre}
      </h3>
      {a.resume ? <p className="mt-2 text-sm text-muted-foreground">{a.resume}</p> : null}
      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Users className="size-3.5" />
          {a.places > 1 ? t("recruit.placesN", { n: String(a.places) }) : t("recruit.place")}
        </span>
        {a.engagement ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            {a.engagement}
          </span>
        ) : null}
        {a.date_limite ? (
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="size-3.5" />
            {t("recruit.until", { date: formatDateLimite(a.date_limite, locale) })}
          </span>
        ) : null}
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {t("recruit.see")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
