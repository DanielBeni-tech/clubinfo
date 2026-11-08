import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, LogOut, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { STATUT_STYLE } from "@/lib/bureau-data";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/espace-bureau/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/espace-bureau/candidatures", label: "Candidatures", icon: Users },
  { to: "/espace-bureau/messages", label: "Messages", icon: Mail },
] as const;

/** Mise en page commune aux pages de l'espace Bureau. */
export function BureauShell({
  title,
  subtitle,
  email,
  actions,
  badges,
  children,
}: {
  title: string;
  subtitle?: string;
  email?: string | null;
  actions?: ReactNode;
  /** Pastilles affichées à côté des onglets (ex. nombre de nouveautés). */
  badges?: Partial<Record<(typeof TABS)[number]["to"], number>>;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  async function logout() {
    await supabase?.auth.signOut();
    await navigate({ to: "/" });
  }

  return (
    <div className="min-h-[70vh] bg-background">
      <div className="border-b border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <div className="min-w-0">
              <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                Espace Bureau
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold text-foreground">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-2">
              {email ? (
                <span className="hidden truncate text-xs text-muted-foreground md:inline">
                  {email}
                </span>
              ) : null}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="size-4" />
                Déconnexion
              </Button>
            </div>
          </div>

          <nav className="-mb-px mt-5 flex gap-1 overflow-x-auto" aria-label="Espace Bureau">
            {TABS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "border-primary! text-primary!" }}
              >
                <Icon className="size-4" />
                {label}
                {badges?.[to] ? (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] leading-none font-semibold text-primary-foreground">
                    {badges[to]}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {actions ? <div className="mb-6 flex flex-wrap items-center gap-2">{actions}</div> : null}
        {children}
      </main>
    </div>
  );
}

export function BureauLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-muted-foreground">Chargement…</p>
    </div>
  );
}

export function PoleDot({ className }: { className: string }) {
  return <span className={cn("inline-block size-2.5 shrink-0 rounded-full", className)} />;
}

export function StatutBadge({ statut }: { statut: string }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
        STATUT_STYLE[statut] ?? "bg-muted text-muted-foreground",
      )}
    >
      {statut}
    </span>
  );
}
