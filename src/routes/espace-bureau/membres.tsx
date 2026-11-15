import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Download, Mail, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BureauLoading, BureauShell, StatutBadge } from "@/components/bureau/BureauShell";
import { Chip, EmptyState, Item, StructureDot } from "@/components/bureau/ui";
import { getAllStructures, getCandidaturesPoste, getMembres } from "@/lib/admin-helpers";
import { useEspaceGuard } from "@/lib/admin-auth";
import {
  copyToClipboard,
  downloadCsv,
  formatDate,
  fullName,
  structureById,
  whatsappLink,
  type CandidaturePosteRow,
  type MembreRow,
} from "@/lib/bureau-data";
import type { Structure } from "@/lib/recrutement";

type Search = { structure?: string; q?: string; id?: string };

export const Route = createFileRoute("/espace-bureau/membres")({
  head: () => ({
    meta: [{ title: "Membres — Espace Bureau" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["structure"] === "string" && s["structure"] ? { structure: s["structure"] } : {}),
    ...(typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
    ...(typeof s["id"] === "string" && s["id"] ? { id: s["id"] } : {}),
  }),
  component: MembresPage,
});

const SANS_POLE = "aucun";

function MembresPage() {
  const { user, role, ready } = useEspaceGuard();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [membres, setMembres] = useState<MembreRow[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [candidatures, setCandidatures] = useState<CandidaturePosteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(search.q ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!ready) return;
    void Promise.all([getMembres(), getAllStructures(), getCandidaturesPoste()]).then(
      ([m, s, c]) => {
        setMembres(m);
        setStructures(s);
        setCandidatures(c);
        setLoading(false);
      },
    );
  }, [ready]);

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

  // Le Bureau filtre par n'importe quel pôle ; un responsable par les siens
  const filtres = useMemo(
    () =>
      structures.filter(
        (s) => s.type === "pole" && (role.bureau || role.structures.includes(s.id)),
      ),
    [structures, role],
  );

  const byStructure = useMemo(() => {
    if (!search.structure) return membres;
    if (search.structure === SANS_POLE) return membres.filter((m) => m.interets.length === 0);
    return membres.filter((m) => m.interets.some((i) => i.structure_id === search.structure));
  }, [membres, search.structure]);

  const visible = useMemo(() => {
    const term = (search.q ?? "").toLowerCase();
    if (!term) return byStructure;
    return byStructure.filter((m) =>
      [m.nom, m.prenom, m.email, m.telephone, m.cycle, m.niveau, m.campus]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term)),
    );
  }, [byStructure, search.q]);

  const selected = membres.find((m) => m.id === search.id) ?? null;

  function interetsLabel(m: MembreRow) {
    return m.interets
      .map((i) => structureById(structures, i.structure_id)?.nom)
      .filter(Boolean)
      .join(", ");
  }

  function exportCsv() {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `membres-${date}.csv`,
      [
        "Inscription",
        "Nom",
        "Prénom",
        "E-mail",
        "WhatsApp",
        "Campus",
        "Formation",
        "Niveau",
        "Pôles d'intérêt",
        "Connu via",
      ],
      visible.map((m) => [
        formatDate(m.created_at),
        m.nom,
        m.prenom,
        m.email,
        m.telephone,
        m.campus,
        m.cycle,
        m.niveau,
        interetsLabel(m),
        m.source,
      ]),
    );
  }

  function copyEmails() {
    void copyToClipboard(visible.map((m) => m.email).join(", "))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  }

  if (!ready || loading) return <BureauLoading />;

  return (
    <BureauShell
      role={role}
      title="Membres"
      subtitle={
        role.bureau
          ? "Toutes les personnes inscrites au club. Filtre par pôle d'intérêt pour préparer un recrutement."
          : "Membres intéressés par ton pôle et personnes ayant postulé à tes annonces."
      }
      email={user?.email ?? null}
    >
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pôle d'intérêt">
        <Chip
          active={!search.structure}
          onClick={() => setSearch({ structure: undefined })}
          count={membres.length}
        >
          Tous
        </Chip>
        {filtres.map((s) => (
          <Chip
            key={s.id}
            active={search.structure === s.id}
            onClick={() => setSearch({ structure: s.id })}
            count={membres.filter((m) => m.interets.some((i) => i.structure_id === s.id)).length}
          >
            <StructureDot color={s.couleur} />
            {s.nom}
          </Chip>
        ))}
        {role.bureau ? (
          <Chip
            active={search.structure === SANS_POLE}
            onClick={() => setSearch({ structure: SANS_POLE })}
            count={membres.filter((m) => m.interets.length === 0).length}
          >
            Sans pôle précisé
          </Chip>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, e-mail, téléphone, formation…"
            className="pl-9"
            aria-label="Rechercher"
          />
        </div>
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

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{visible.length}</span> membre(s)
      </p>

      {visible.length === 0 ? (
        <EmptyState>
          {membres.length === 0
            ? "Aucun membre pour le moment."
            : "Aucun membre ne correspond à ces filtres."}
        </EmptyState>
      ) : (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {visible.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSearch({ id: m.id })}
                className="grid w-full gap-2 px-4 py-3.5 text-left transition-colors hover:bg-surface sm:px-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{fullName(m)}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {m.cycle}
                  {m.niveau ? ` · ${m.niveau}` : ""} · {m.campus}
                </p>
                <div className="flex min-w-0 flex-wrap gap-1.5">
                  {m.interets.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Découvre d'abord</span>
                  ) : (
                    m.interets.map((i) => {
                      const s = structureById(structures, i.structure_id);
                      return s ? (
                        <span
                          key={i.structure_id}
                          className="inline-flex items-center gap-1.5 rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                        >
                          <StructureDot color={s.couleur} />
                          {s.nom}
                        </span>
                      ) : null;
                    })
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {formatDate(m.created_at)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSearch({ id: undefined })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <MembreDetail
              m={selected}
              structures={structures}
              candidatures={candidatures.filter((c) => c.membre_id === selected.id)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </BureauShell>
  );
}

function MembreDetail({
  m,
  structures,
  candidatures,
}: {
  m: MembreRow;
  structures: Structure[];
  candidatures: CandidaturePosteRow[];
}) {
  const wa = whatsappLink(m.telephone);
  return (
    <div className="grid gap-6">
      <SheetHeader className="text-left">
        <SheetTitle className="pr-6">{fullName(m)}</SheetTitle>
        <SheetDescription>Membre depuis le {formatDate(m.created_at)}</SheetDescription>
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
          <a href={`mailto:${m.email}`}>
            <Mail className="size-4" />
            E-mail
          </a>
        </Button>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <Item label="E-mail" full>
          {m.email}
        </Item>
        <Item label="WhatsApp">{m.telephone}</Item>
        <Item label="Campus">{m.campus}</Item>
        <Item label="Formation" full>
          {m.cycle}
        </Item>
        <Item label="Niveau">{m.niveau || "—"}</Item>
        <Item label="Connu via">{m.source || "—"}</Item>
        <Item label="Pôles d'intérêt" full>
          {m.interets.length === 0
            ? "Découvre d'abord"
            : m.interets
                .map((i) => structureById(structures, i.structure_id)?.nom)
                .filter(Boolean)
                .join(", ")}
        </Item>
      </dl>

      {candidatures.length > 0 ? (
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Candidatures aux postes</p>
          <ul className="mt-2 grid gap-2">
            {candidatures.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
              >
                <span className="min-w-0 truncate">{c.annonce?.titre ?? "Annonce supprimée"}</span>
                <StatutBadge statut={c.statut} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {m.historique ? (
        <div className="rounded-lg bg-surface p-3">
          <p className="text-xs font-semibold text-muted-foreground">
            Réponses de l'ancien formulaire
          </p>
          <p className="mt-1 text-sm whitespace-pre-line text-foreground">{m.historique}</p>
        </div>
      ) : null}
    </div>
  );
}
