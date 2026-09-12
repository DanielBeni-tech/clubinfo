import { partners } from "@/data/club";
import styles from "./PartnerMarquee.module.css";

export function PartnerMarquee() {
  const loop = [...partners, ...partners];

  return (
    <section aria-label="Partenaires du Club" className="overflow-hidden border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 pt-5 pb-2">
        <p className="shrink-0 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          Partenaires
        </p>
        <span className="hidden h-px flex-1 bg-border sm:block" />
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-background to-transparent" />
        <ul className={`${styles.track} flex w-max items-center gap-12 py-5 pr-12`}>
          {loop.map((partner, i) => (
            <li key={`${partner.name}-${i}`} className="flex h-12 w-36 shrink-0 items-center justify-center">
              {partner.logo ? (
                <img src={partner.logo} alt={partner.name} className="max-h-10 max-w-full object-contain" />
              ) : (
                <span className="font-display text-sm font-semibold text-primary">{partner.name}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
