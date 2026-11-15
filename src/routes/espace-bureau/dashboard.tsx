import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Briefcase, Inbox, Mail, UserPlus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BureauLoading, BureauShell, StatutBadge } from "@/components/bureau/BureauShell";
import { Bar, SectionTitle, StructureDot } from "@/components/bureau/ui";
import {
  getAllStructures,
  getAnnoncesGerees,
  getCandidaturesPoste,
  getMembres,
  getMessages,
} from "@/lib/admin-helpers";
import { useEspaceGuard } from "@/lib/admin-auth";
import {
  daysAgo,
  formatDate,
  fullName,
  structureById,
  type CandidaturePosteRow,
  type MembreRow,
  type MessageRow,
} from "@/lib/bureau-data";
import { annonceOuverte, couleur, type Annonce, type Structure } from "@/lib/recrutement";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/espace-bureau/dashboard")({
  head: () => ({
    meta: [{ title: "Espace Bureau" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Dashboard,
});

/** Compte les occurrences et renvoie les entrées triées par fréquence. */
function countBy<T>(items: T[], key: (item: T) => string | null | undefined) {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it)?.trim();
    if (k) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

/** « ITT — Ingénieur des Travaux… » → « ITT » ; « Autre : … » → « Autre ». */
function cycleCourt(cycle: string) {
  if (cycle.startsWith("Autre")) return "Autre";
  return cycle.split(" — ")[0] ?? cycle;
}

function Dashboard() {
  const { user, role, ready } = useEspaceGuard();
  const [membres, setMembres] = useState<MembreRow[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [candidatures, setCandidatures] = useState<CandidaturePosteRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    void Promise.all([
      getMembres(),
      getAllStructures(),
      getAnnoncesGerees(),
      getCandidaturesPoste(),
      role.bureau ? getMessages() : Promise.resolve([] as MessageRow[]),
    ]).then(([m, s, a, c, msg]) => {
      setMembres(m);
      setStructures(s);
      setAnnonces(a.filter((x) => role.bureau || role.structures.includes(x.structure_id)));
      setCandidatures(c);
      setMessages(msg);
      setLoading(false);
    });
  }, [ready, role]);

  const stats = useMemo(() => {
    const poles = structures.filter(
      (s) => s.type === "pole" && s.actif && (role.bureau || role.structures.includes(s.id)),
    );
    const parPole = poles.map((s) => ({
      s,
      n: membres.filter((m) => m.interets.some((i) => i.structure_id === s.id)).length,
    }));
    return {
      semaine: membres.filter((m) => daysAgo(m.created_at) <= 7).length,
      ouvertes: annonces.filter((a) => annonceOuverte(a)).length,
      aTraiter: candidatures.filter((c) => c.statut === "Reçue").length,
      nonTraites: messages.filter((m) => !m.traite).length,
      parPole,
      sansPole: membres.filter((m) => m.interets.length === 0).length,
      parCycle: countBy(membres, (m) => cycleCourt(m.cycle)).slice(0, 6),
      parCampus: countBy(membres, (m) => (m.campus.startsWith("Autre") ? "Autre" : m.campus)),
      parSource: countBy(membres, (m) => m.source).slice(0, 6),
      parStatut: (["Reçue", "Entretien", "Acceptée", "Refusée"] as const).map((st) => ({
        st,
        n: candidatures.filter((c) => c.statut === st).length,
      })),
    };
  }, [membres, structures, annonces, candidatures, messages, role]);

  if (!ready || loading) return <BureauLoading />;

  const maxPole = Math.max(1, ...stats.parPole.map((p) => p.n), stats.sansPole);
  const maxCycle = stats.parCycle[0]?.[1] ?? 1;
  const maxSource = stats.parSource[0]?.[1] ?? 1;

  return (
    <BureauShell
      role={role}
      title="Tableau de bord"
      subtitle={
        role.bureau
          ? "Vue d'ensemble des membres, du recrutement et des messages."
          : "Vue d'ensemble de ta structure : membres intéressés, annonces et candidatures."
      }
      email={user?.email ?? null}
      badges={{
        "/espace-bureau/candidatures": stats.aTraiter,
        ...(role.bureau ? { "/espace-bureau/messages": stats.nonTraites } : {}),
      }}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          icon={Users}
          label={role.bureau ? "Membres" : "Membres suivis"}
          value={membres.length}
          hint={role.bureau ? "inscrits au club" : "intéressés ou candidats"}
          to="/espace-bureau/membres"
        />
        <Kpi
          icon={UserPlus}
          label="Cette semaine"
          value={stats.semaine}
          hint="nouveaux membres (7 j)"
        />
        <Kpi
          icon={Briefcase}
          label="Annonces"
          value={stats.ouvertes}
          hint="ouvertes sur le site"
          to="/espace-bureau/annonces"
        />
        <Kpi
          icon={Inbox}
          label="À traiter"
          value={stats.aTraiter}
          hint="candidatures reçues"
          to="/espace-bureau/candidatures"
          highlight={stats.aTraiter > 0}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card className="border-border shadow-xs">
          <CardContent className="grid gap-4 p-5">
            <SectionTitle
              title="Membres par pôle d'intérêt"
              lead="Un membre peut indiquer jusqu'à 2 pôles."
            />
            {stats.parPole.map(({ s, n }) => (
              <Link
                key={s.id}
                to="/espace-bureau/membres"
                search={{ structure: s.id }}
                className="block hover:opacity-80"
              >
                <Bar
                  label={
                    <>
                      <StructureDot color={s.couleur} />
                      {s.nom}
                    </>
                  }
                  value={n}
                  max={maxPole}
                  color={couleur(s.couleur).dot}
                />
              </Link>
            ))}
            {role.bureau ? (
              <Bar
                label="Découvre d'abord (aucun pôle)"
                value={stats.sansPole}
                max={maxPole}
                color="bg-muted-foreground/50"
              />
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="grid gap-4 p-5">
            <SectionTitle
              title="Candidatures par statut"
              lead="Reçue → entretien → décision du responsable."
            />
            <div className="grid grid-cols-2 gap-3">
              {stats.parStatut.map(({ st, n }) => (
                <Link
                  key={st}
                  to="/espace-bureau/candidatures"
                  search={{ statut: st }}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-surface"
                >
                  <StatutBadge statut={st} />
                  <span className="font-display text-xl font-bold tabular-nums">{n}</span>
                </Link>
              ))}
            </div>
            <SectionTitle title="Dernières candidatures" />
            {candidatures.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucune candidature pour le moment.</p>
            ) : (
              <ul className="grid gap-2">
                {candidatures.slice(0, 5).map((c) => {
                  const s = structureById(structures, c.annonce?.structure_id);
                  return (
                    <li key={c.id}>
                      <Link
                        to="/espace-bureau/candidatures"
                        search={{ id: c.id }}
                        className="flex items-center justify-between gap-3 rounded-lg p-2 text-sm hover:bg-surface"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{fullName(c.membre)}</span>
                          <span className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                            <StructureDot color={s?.couleur} />
                            {c.annonce?.titre} · {formatDate(c.created_at)}
                          </span>
                        </span>
                        <StatutBadge statut={c.statut} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="grid gap-4 p-5">
            <SectionTitle title="Membres par formation" />
            {stats.parCycle.map(([label, n]) => (
              <Bar key={label} label={label} value={n} max={maxCycle} />
            ))}
            {stats.parCampus.length > 1 ? (
              <p className="text-xs text-muted-foreground">
                Campus : {stats.parCampus.map(([c, n]) => `${c} (${n})`).join(" · ")}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardContent className="grid gap-4 p-5">
            <SectionTitle
              title="Comment ont-ils connu le club ?"
              lead="Réponse facultative au formulaire d'adhésion."
            />
            {stats.parSource.length === 0 ? (
              <p className="text-sm text-muted-foreground">Pas encore de réponses.</p>
            ) : (
              stats.parSource.map(([label, n]) => (
                <Bar key={label} label={label} value={n} max={maxSource} />
              ))
            )}
            {role.bureau ? (
              <Link
                to="/espace-bureau/messages"
                className="mt-2 flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-surface"
              >
                <span className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  Messages non traités
                </span>
                <span className="font-semibold tabular-nums">{stats.nonTraites}</span>
              </Link>
            ) : null}
          </CardContent>
        </Card>
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
  highlight,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  hint: string;
  to?: "/espace-bureau/membres" | "/espace-bureau/annonces" | "/espace-bureau/candidatures";
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
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
