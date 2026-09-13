import { partners } from "@/data/club";
import { useLocale } from "@/lib/i18n";
import styles from "./PartnerMarquee.module.css";

export function PartnerMarquee() {
  const { t } = useLocale();
  const loop = [...partners, ...partners, ...partners];

  return (
    <section aria-label={t("partners.label")} className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 pt-6 pb-1">
        <p className="shrink-0 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          {t("partners.label")}
        </p>
        <span className="hidden h-px flex-1 bg-border sm:block" />
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
        <ul className={`${styles["track"]} flex w-max items-end gap-16 px-8 py-7`}>
          {loop.map((partner, i) => (
            <li key={`${partner.name}-${i}`} className="flex w-40 shrink-0 flex-col items-center gap-2">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="h-12 w-full object-contain" />
              ) : (
                <span className="font-display text-sm font-semibold text-primary">{partner.name}</span>
              )}
              <span className="text-center text-[11px] font-medium text-muted-foreground">{partner.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
