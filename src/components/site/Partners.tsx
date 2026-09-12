import { partners, type Partner } from "@/data/club";
import { cn } from "@/lib/utils";

function PartnerTile({ partner }: { partner: Partner }) {
  const inner = (
    <>
      <span className="grid h-20 place-items-center px-2">
        {partner.logo ? (
          <img src={partner.logo} alt="" className="max-h-16 w-full object-contain" />
        ) : (
          <span className="font-display text-sm font-bold text-primary">{partner.name}</span>
        )}
      </span>
      <span className="mt-3 block text-center">
        <span className="block font-display text-sm font-semibold">{partner.name}</span>
        <span className="mt-1 block text-xs text-muted-foreground">{partner.role}</span>
      </span>
    </>
  );

  const className = "block rounded-xl border border-border bg-background p-4";

  if (partner.href) {
    return (
      <a href={partner.href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}

export function Partners({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-5", className)}>
      {partners.map((partner) => (
        <li key={partner.name}>
          <PartnerTile partner={partner} />
        </li>
      ))}
    </ul>
  );
}
