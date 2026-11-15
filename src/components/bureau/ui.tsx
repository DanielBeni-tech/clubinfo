import type { ReactNode } from "react";
import { couleur } from "@/lib/recrutement";
import { cn } from "@/lib/utils";

/** Pastille de couleur d'une structure. */
export function StructureDot({ color }: { color: string | null | undefined }) {
  return <span className={cn("inline-block size-2.5 shrink-0 rounded-full", couleur(color).dot)} />;
}

/** Filtre en forme de pilule, avec compteur facultatif. */
export function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count?: number;
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
      {count !== undefined ? (
        <span
          className={cn(
            "rounded-full px-1.5 text-[11px] tabular-nums",
            active ? "bg-white/20" : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function StatusChip({
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
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Ligne « libellé / valeur » des fiches détaillées. */
export function Item({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", full && "col-span-2")}>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-foreground">{children}</dd>
    </div>
  );
}

export function SectionTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {lead ? <p className="mt-0.5 text-xs text-muted-foreground">{lead}</p> : null}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Barre horizontale pour les répartitions du tableau de bord. */
export function Bar({
  label,
  value,
  max,
  color,
}: {
  label: ReactNode;
  value: number;
  max: number;
  color?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex min-w-0 items-center gap-2 truncate text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", color ?? "bg-primary")}
          style={{ width: `${max > 0 && value > 0 ? Math.max(4, (value / max) * 100) : 0}%` }}
        />
      </div>
    </div>
  );
}
