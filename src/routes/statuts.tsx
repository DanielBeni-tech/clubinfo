import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Scale } from "lucide-react";
import { CTASection, PageHeader } from "@/components/site/shared";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/statuts")({
  head: () => ({
    meta: [
      { title: "Statuts — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Charte et règlement intérieur du Club Informatique SUP'PTIC : les textes fondateurs qui régissent le Club.",
      },
      { property: "og:title", content: "Statuts du Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Charte et règlement intérieur du Club Informatique SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: StatutsPage,
});

function StatutsPage() {
  const { locale } = useLocale();

  return (
    <div>
      <PageHeader
        title="Statuts du Club"
        lead="Les deux textes fondateurs qui définissent l'identité, l'organisation et le fonctionnement du Club Informatique SUP'PTIC."
      />

      <section className="section-y">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Charte card */}
            <Link
              to="/charte"
              className="group relative block overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-elevated)]"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute inset-0 animate-[gradientShift_6s_ease-in-out_infinite] bg-[length:200%_200%] bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
              </div>

              {/* Floating orb animation */}
              <div className="pointer-events-none absolute -top-20 -right-20 size-40 animate-[orbFloat1_8s_ease-in-out_infinite] rounded-full bg-primary/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 size-32 animate-[orbFloat2_10s_ease-in-out_infinite] rounded-full bg-accent/8 blur-3xl" />

              <div className="relative p-8 sm:p-10">
                {/* Icon with pulse ring */}
                <div className="relative mb-6 inline-flex">
                  <div className="absolute inset-0 animate-[pulseRing_3s_ease-in-out_infinite] rounded-full bg-primary/20" />
                  <div className="relative grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <FileText className="size-7" />
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl">
                  {locale === "en" ? "Charter" : "Charte"}
                </h2>
                <p className="mt-1 font-display text-sm text-primary">
                  {locale === "en" ? "Founding document" : "Texte fondateur"}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {locale === "en"
                    ? "Mission, values, objectives, governance structure and the founding principles of the SUP'PTIC Computer Club."
                    : "Mission, valeurs, objectifs, organisation et principes de gouvernance du Club Informatique SUP'PTIC."}
                </p>

                {/* Animated bottom bar */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <span>{locale === "en" ? "Read the charter" : "Lire la charte"}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Règlement card */}
            <Link
              to="/reglement"
              className="group relative block overflow-hidden rounded-2xl border border-border bg-background shadow-[var(--shadow-card)] transition-all duration-500 hover:shadow-[var(--shadow-elevated)]"
            >
              {/* Animated background gradient - offset timing */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                <div className="absolute inset-0 animate-[gradientShift_6s_ease-in-out_infinite_3s] bg-[length:200%_200%] bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10" />
              </div>

              {/* Floating orb animation - different timing */}
              <div className="pointer-events-none absolute -top-16 -left-20 size-40 animate-[orbFloat2_9s_ease-in-out_infinite] rounded-full bg-accent/8 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-16 size-32 animate-[orbFloat1_11s_ease-in-out_infinite] rounded-full bg-primary/8 blur-3xl" />

              <div className="relative p-8 sm:p-10">
                {/* Icon with pulse ring - offset timing */}
                <div className="relative mb-6 inline-flex">
                  <div className="absolute inset-0 animate-[pulseRing_3s_ease-in-out_infinite_1.5s] rounded-full bg-accent/20" />
                  <div className="relative grid size-16 place-items-center rounded-2xl bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    <Scale className="size-7" />
                  </div>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl">
                  {locale === "en" ? "Internal Regulations" : "Règlement intérieur"}
                </h2>
                <p className="mt-1 font-display text-sm text-accent">
                  {locale === "en" ? "Operating rules" : "Règles de fonctionnement"}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {locale === "en"
                    ? "Membership, Bureau Executive, poles, meetings, discipline and all practical procedures of the Club."
                    : "Adhésion, Bureau Exécutif, pôles, réunions, discipline et toutes les procédures pratiques du Club."}
                </p>

                {/* Animated bottom bar */}
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
                  <span>{locale === "en" ? "Read the regulations" : "Lire le règlement"}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Decorative connector */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px w-12 bg-border" />
              <span className="font-mono tracking-widest uppercase">
                {locale === "en" ? "Both documents are binding" : "Les deux textes font foi"}
              </span>
              <div className="h-px w-12 bg-border" />
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
