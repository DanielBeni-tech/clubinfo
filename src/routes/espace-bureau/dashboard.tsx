import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Inbox, Mail, UserPlus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BureauLoading, BureauShell, PoleDot, StatutBadge } from "@/components/bureau/BureauShell";
import { getCandidatures, getMessages } from "@/lib/admin-helpers";
import { useBureauGuard } from "@/lib/admin-auth";
import {
  POLES,
  daysAgo,
  formatDate,
  fullName,
  interestsOf,
  poleInfo,
  poleSlug,
  type CandidatureRow,
  type MessageRow,
} from "@/lib/bureau-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace-bureau/dashboard")({
  head: () => ({
    meta: [{ title: "Espace Bureau" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, ready } = useBureauGuard();
  const [candidatures, setCandidatures] = useState<CandidatureRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    void Promise.all([getCandidatures(), getMessages()]).then(([c, m]) => {
      setCandidatures(c as CandidatureRow[]);
      setMessages(m as MessageRow[]);
      setLoading(false);
    });
  }, [ready]);

  const stats = useMemo(() => {
    const nouvelles = candidatures.filter((c) => c.statut === "Nouveau").length;
    const semaine = candidatures.filter((c) => daysAgo(c.created_at) <= 7).length;
    const nonTraites = messages.filter((m) => !m.traite);

    const parPole = POLES.map((p) => {
      const list = candidatures.filter((c) => poleSlug(c.pole) === p.slug);
      return {
        ...p,
        total: list.length,
        nouvelles: list.filter((c) => c.statut === "Nouveau").length,
      };
    });
    const autres = candidatures.filter((c) => poleSlug(c.pole) === "autre").length;

    const counts = new Map<string, number>();
    for (const c of candidatures)
      for (const i of interestsOf(c)) {
        const key = i.startsWith("Autre") ? "Autre" : i;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    const interets = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

    return { nouvelles, semaine, nonTraites, parPole, autres, interets };
  }, [candidatures, messages]);

  if (!ready || loading) return <BureauLoading />;

  const maxInteret = stats.interets[0]?.[1] ?? 1;

  return (
    <BureauShell
      title="Tableau de bord"
      subtitle="Vue d'ensemble des inscriptions et des messages reçus."
      email={user?.email ?? null}
      badges={{
        "/espace-bureau/candidatures": stats.nouvelles,
        "/espace-bureau/messages": stats.nonTraites.length,
      }}
    >
      {/* Chiffres clés */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={UserPlus}
          label="À traiter"
          value={stats.nouvelles}
          hint="candidatures « Nouveau »"
          to="/espace-bureau/candidatures"
          search={{ statut: "Nouveau" }}
          highlight={stats.nouvelles > 0}
        />
        <Kpi
          icon={Users}
          label="Candidatures"
          value={candidatures.length}
          hint="au total"
          to="/espace-bureau/candidatures"
        />
        <Kpi
          icon={Inbox}
          label="Cette semaine"
          value={stats.semaine}
          hint="nouvelles inscriptions (7 j)"
        />
        <Kpi
          icon={Mail}
          label="Messages"
          value={stats.nonTraites.length}
          hint="non traités"
          to="/espace-bureau/messages"
          highlight={stats.nonTraites.length > 0}
        />
      </div>

      {/* Par pôle */}
      <section className="mt-10">
        <SectionTitle
          title="Candidatures par pôle"
          lead="Chaque chef de pôle retrouve ici les personnes qui ont choisi son pôle en priorité."
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.parPole.map((p) => (
            <Link
              key={p.slug}
              to="/espace-bureau/candidatures"
              search={{ pole: p.slug }}
              className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-2">
                <PoleDot className={p.dot} />
                <span className="text-sm font-semibold text-foreground">{p.label}</span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-foreground">{p.total}</p>
              <p className="text-xs text-muted-foreground">
                {p.nouvelles > 0 ? (
                  <span className="font-semibold text-primary">{p.nouvelles} à traiter</span>
                ) : (
                  "aucune en attente"
                )}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                Voir la liste
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        {stats.autres > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.autres} candidature(s) avec un pôle non reconnu (ancienne version du formulaire)
            —{" "}
            <Link
              to="/espace-bureau/candidatures"
              search={{ pole: "autre" }}
              className="text-primary underline"
            >
              les voir
            </Link>
            .
          </p>
        ) : null}
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Dernières candidatures */}
        <section>
          <SectionTitle title="Dernières candidatures" />
          <Card className="mt-4 border-border shadow-xs">
            <CardContent className="divide-y divide-border p-0">
              {candidatures.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">
                  Aucune candidature pour le moment.
                </p>
              ) : (
                candidatures.slice(0, 6).map((c) => {
                  const pole = poleInfo(poleSlug(c.pole));
                  return (
                    <Link
                      key={c.id}
                      to="/espace-bureau/candidatures"
                      search={{ id: c.id }}
                      className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {fullName(c)}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <PoleDot className={pole.dot} />
                          <span className="truncate">
                            {pole.short} · {formatDate(c.created_at)}
                          </span>
                        </p>
                      </div>
                      <StatutBadge statut={c.statut} />
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>

        <div className="grid content-start gap-6">
          {/* Messages en attente */}
          <section>
            <SectionTitle title="Messages en attente" />
            <Card className="mt-4 border-border shadow-xs">
              <CardContent className="divide-y divide-border p-0">
                {stats.nonTraites.length === 0 ? (
                  <p className="p-5 text-sm text-muted-foreground">
                    Tous les messages sont traités. 👌
                  </p>
                ) : (
                  stats.nonTraites.slice(0, 3).map((m) => (
                    <Link
                      key={m.id}
                      to="/espace-bureau/messages"
                      className="block px-5 py-3.5 transition-colors hover:bg-surface"
                    >
                      <p className="truncate text-sm font-medium text-foreground">{m.sujet}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {m.nom} · {m.categorie ?? "—"} · {formatDate(m.created_at)}
                      </p>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          {/* Centres d'intérêt */}
          {stats.interets.length > 0 ? (
            <section>
              <SectionTitle title="Centres d'intérêt les plus cités" />
              <Card className="mt-4 border-border shadow-xs">
                <CardContent className="grid gap-3 p-5">
                  {stats.interets.map(([label, n]) => (
                    <div key={label}>
                      <div className="flex justify-between gap-3 text-xs">
                        <span className="truncate text-foreground">{label}</span>
                        <span className="font-semibold text-foreground tabular-nums">{n}</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(n / maxInteret) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          ) : null}
        </div>
      </div>
    </BureauShell>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  to,
  search,
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  hint: string;
  to?: "/espace-bureau/candidatures" | "/espace-bureau/messages";
  search?: { statut?: string };
  highlight?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
        <Icon className={cn("size-4", highlight ? "text-primary" : "text-muted-foreground")} />
      </div>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-bold tabular-nums",
          highlight ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </>
  );
  const cls = cn(
    "block rounded-xl border bg-card p-4 shadow-xs sm:p-5",
    highlight ? "border-primary/40 bg-primary/5" : "border-border",
    to && "transition-colors hover:border-primary/50",
  );
  if (!to) return <div className={cls}>{body}</div>;
  return (
    <Link to={to} search={search ?? {}} className={cls}>
      {body}
    </Link>
  );
}

function SectionTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <div>
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      {lead ? <p className="mt-0.5 text-xs text-muted-foreground">{lead}</p> : null}
    </div>
  );
}
