import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Download, Mail, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BureauLoading, BureauShell, PoleDot, StatutBadge } from "@/components/bureau/BureauShell";
import { getCandidatures, updateCandidatureStatus } from "@/lib/admin-helpers";
import { useBureauGuard } from "@/lib/admin-auth";
import {
  POLES,
  STATUTS,
  downloadCandidaturesCsv,
  formatDate,
  fullName,
  interestsOf,
  isPoleSlug,
  isStatut,
  poleInfo,
  poleSlug,
  whatsappLink,
  type CandidatureRow,
  type PoleSlug,
  type Statut,
} from "@/lib/bureau-data";
import { cn } from "@/lib/utils";

type Search = { pole?: PoleSlug; statut?: Statut; interet?: string; q?: string; id?: string };

export const Route = createFileRoute("/espace-bureau/candidatures")({
  head: () => ({
    meta: [
      { title: "Candidatures — Espace Bureau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(isPoleSlug(s["pole"]) ? { pole: s["pole"] } : {}),
    ...(isStatut(s["statut"]) ? { statut: s["statut"] } : {}),
    ...(typeof s["interet"] === "string" && s["interet"] ? { interet: s["interet"] } : {}),
    ...(typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
    ...(typeof s["id"] === "string" && s["id"] ? { id: s["id"] } : {}),
  }),
  component: AdminCandidatures,
});

const ALL = "__all__";

function AdminCandidatures() {
  const { user, ready } = useBureauGuard();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [candidatures, setCandidatures] = useState<CandidatureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(search.q ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;
    void getCandidatures().then((data) => {
      setCandidatures(data as CandidatureRow[]);
      setLoading(false);
    });
  }, [ready]);

  // Recherche répercutée dans l'URL après une courte pause de frappe
  useEffect(() => {
    const id = setTimeout(() => {
      if ((search.q ?? "") !== query.trim()) setSearch({ q: query.trim() || undefined });
    }, 250);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function setSearch(patch: Partial<Record<keyof Search, string | undefined>>) {
    void navigate({
      search: (prev) => {
        const next: Record<string, string | undefined> = { ...prev, ...patch };
        for (const k of Object.keys(next)) if (!next[k]) delete next[k];
        return next as Search;
      },
      replace: true,
    });
  }

  // 1. pôle → 2. intérêt / recherche → 3. statut (les compteurs suivent cet ordre)
  const byPole = useMemo(
    () =>
      search.pole ? candidatures.filter((c) => poleSlug(c.pole) === search.pole) : candidatures,
    [candidatures, search.pole],
  );

  const byText = useMemo(() => {
    const term = (search.q ?? "").toLowerCase();
    return byPole.filter((c) => {
      if (
        search.interet &&
        !interestsOf(c).some(
          (i) => i === search.interet || (search.interet === "Autre" && i.startsWith("Autre")),
        )
      )
        return false;
      if (!term) return true;
      return [c.nom, c.prenom, c.email, c.telephone, c.cycle, c.domaine]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term));
    });
  }, [byPole, search.interet, search.q]);

  const visible = useMemo(
    () => (search.statut ? byText.filter((c) => c.statut === search.statut) : byText),
    [byText, search.statut],
  );

  const interetOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of byPole)
      for (const i of interestsOf(c)) set.add(i.startsWith("Autre") ? "Autre" : i);
    return [...set].sort((a, b) => a.localeCompare(b, "fr"));
  }, [byPole]);

  const hasAutre = candidatures.some((c) => poleSlug(c.pole) === "autre");
  const selected = candidatures.find((c) => c.id === search.id) ?? null;
  const poleLabel = search.pole ? poleInfo(search.pole).label : "Tous les pôles";

  async function changeStatut(c: CandidatureRow, statut: Statut) {
    const previous = c.statut;
    setCandidatures((list) => list.map((x) => (x.id === c.id ? { ...x, statut } : x)));
    const { success, error } = await updateCandidatureStatus(c.id, statut);
    if (!success) {
      setCandidatures((list) => list.map((x) => (x.id === c.id ? { ...x, statut: previous } : x)));
      alert(`La mise à jour a échoué : ${error ?? "erreur inconnue"}`);
    }
  }

  function exportCsv() {
    const slug = search.pole ?? "tous-poles";
    const date = new Date().toISOString().slice(0, 10);
    downloadCandidaturesCsv(visible, `candidatures-${slug}-${date}.csv`);
  }

  function copyEmails() {
    void navigator.clipboard
      ?.writeText(visible.map((c) => c.email).join(", "))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  }

  if (!ready || loading) return <BureauLoading />;

  return (
    <BureauShell
      title="Candidatures"
      subtitle="Filtre par pôle pour retrouver les personnes qui souhaitent rejoindre le tien. Le lien de la page garde les filtres : tu peux le partager."
      email={user?.email ?? null}
      badges={{
        "/espace-bureau/candidatures": candidatures.filter((c) => c.statut === "Nouveau").length,
      }}
    >
      {/* Pôles */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Pôle">
        <Chip
          active={!search.pole}
          onClick={() => setSearch({ pole: undefined })}
          count={candidatures.length}
        >
          Tous les pôles
        </Chip>
        {[...POLES, ...(hasAutre ? [poleInfo("autre")] : [])].map((p) => (
          <Chip
            key={p.slug}
            active={search.pole === p.slug}
            onClick={() => setSearch({ pole: p.slug, interet: undefined })}
            count={candidatures.filter((c) => poleSlug(c.pole) === p.slug).length}
          >
            <PoleDot className={p.dot} />
            {p.short}
          </Chip>
        ))}
      </div>

      {/* Filtres secondaires */}
      <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-xs lg:grid-cols-[minmax(0,1fr)_260px_auto]">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, e-mail, téléphone, formation…"
            className="pl-9"
            aria-label="Rechercher"
          />
        </div>
        <Select
          value={search.interet ?? ALL}
          onValueChange={(v) => setSearch({ interet: v === ALL ? undefined : v })}
        >
          <SelectTrigger aria-label="Centre d'intérêt">
            <SelectValue placeholder="Centre d'intérêt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous les centres d'intérêt</SelectItem>
            {interetOptions.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-1.5">
          <StatusChip active={!search.statut} onClick={() => setSearch({ statut: undefined })}>
            Tous ({byText.length})
          </StatusChip>
          {STATUTS.map((s) => (
            <StatusChip
              key={s}
              active={search.statut === s}
              onClick={() => setSearch({ statut: s })}
            >
              {s} ({byText.filter((c) => c.statut === s).length})
            </StatusChip>
          ))}
        </div>
      </div>

      {/* Barre de résultat */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{visible.length}</span> candidature(s) ·{" "}
          {poleLabel}
          {search.statut ? ` · ${search.statut}` : ""}
          {search.interet ? ` · ${search.interet}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copyEmails} disabled={visible.length === 0}>
            {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            {copied ? "Copiés" : "Copier les e-mails"}
          </Button>
          <Button size="sm" onClick={exportCsv} disabled={visible.length === 0}>
            <Download className="size-4" />
            Exporter (Excel / CSV)
          </Button>
        </div>
      </div>

      {/* Liste */}
      {visible.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {candidatures.length === 0
            ? "Aucune candidature pour le moment."
            : "Aucune candidature ne correspond à ces filtres."}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {visible.map((c) => {
            const pole = poleInfo(poleSlug(c.pole));
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSearch({ id: c.id })}
                  className="grid w-full gap-2 px-4 py-4 text-left transition-colors hover:bg-surface sm:px-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.6fr)_auto] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{fullName(c)}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.email}</p>
                  </div>
                  <div className="min-w-0 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 truncate text-foreground">
                      <PoleDot className={pole.dot} />
                      {pole.short}
                    </p>
                    <p className="truncate">
                      {c.cycle} · {c.campus}
                    </p>
                  </div>
                  <div className="flex min-w-0 flex-wrap gap-1">
                    {interestsOf(c).map((i) => (
                      <span
                        key={i}
                        className="max-w-full truncate rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-1">
                    <StatutBadge statut={c.statut} />
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Fiche détaillée */}
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSearch({ id: undefined })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <CandidatureDetail c={selected} onStatut={(s) => changeStatut(selected, s)} />
          ) : null}
        </SheetContent>
      </Sheet>
    </BureauShell>
  );
}

function CandidatureDetail({ c, onStatut }: { c: CandidatureRow; onStatut: (s: Statut) => void }) {
  const pole = poleInfo(poleSlug(c.pole));
  const wa = whatsappLink(c.telephone);
  return (
    <div className="grid gap-6">
      <SheetHeader className="text-left">
        <SheetTitle className="pr-6">{fullName(c)}</SheetTitle>
        <SheetDescription>Inscrit(e) le {formatDate(c.created_at, true)}</SheetDescription>
      </SheetHeader>

      <div className="flex flex-wrap gap-2">
        {wa ? (
          <Button asChild size="sm" className="bg-[#25D366] text-white hover:bg-[#1ebe5b]">
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>
        ) : null}
        <Button asChild size="sm" variant="outline">
          <a href={`mailto:${c.email}`}>
            <Mail className="size-4" />
            E-mail
          </a>
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground">Statut</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STATUTS.map((s) => (
            <StatusChip key={s} active={c.statut === s} onClick={() => onStatut(s)}>
              {s}
            </StatusChip>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <Item label="Pôle souhaité (préférence)" full>
          <span className="inline-flex items-center gap-1.5">
            <PoleDot className={pole.dot} />
            {pole.label}
          </span>
        </Item>
        <Item label="E-mail" full>
          {c.email}
        </Item>
        <Item label="Téléphone">{c.telephone}</Item>
        <Item label="Campus">{c.campus}</Item>
        <Item label="Formation" full>
          {c.cycle}
        </Item>
        <Item label="Niveau">{c.niveau || "—"}</Item>
        <Item label="Option">{c.option || "—"}</Item>
        {c.regime ? <Item label="Régime">{c.regime}</Item> : null}
        <Item label="Centres d'intérêt" full>
          <div className="flex flex-wrap gap-1">
            {interestsOf(c).map((i) => (
              <span key={i} className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
                {i}
              </span>
            ))}
          </div>
        </Item>
        {c.niveau_experience ? (
          <Item label="Expérience" full>
            <span className="whitespace-pre-line">{c.niveau_experience}</span>
          </Item>
        ) : null}
        {c.motivation ? (
          <Item label="Motivation, idée & disponibilités" full>
            <span className="whitespace-pre-line">{c.motivation}</span>
          </Item>
        ) : null}
      </dl>
    </div>
  );
}

function Item({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return (
    <div className={cn("min-w-0", full && "col-span-2")}>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-foreground">{children}</dd>
    </div>
  );
}

function Chip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
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
      <span
        className={cn(
          "rounded-full px-1.5 text-[11px] tabular-nums",
          active ? "bg-white/20" : "bg-muted text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function StatusChip({
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
