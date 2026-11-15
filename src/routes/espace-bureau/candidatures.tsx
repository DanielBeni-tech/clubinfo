import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { BureauLoading, BureauShell, StatutBadge } from "@/components/bureau/BureauShell";
import { EmptyState, Item, StatusChip, StructureDot } from "@/components/bureau/ui";
import {
  getAllStructures,
  getCandidaturesPoste,
  updateCandidaturePoste,
} from "@/lib/admin-helpers";
import { useEspaceGuard } from "@/lib/admin-auth";
import {
  CANDIDATURE_STATUTS,
  downloadCsv,
  formatDate,
  fullName,
  isCandidatureStatut,
  structureById,
  whatsappLink,
  type CandidaturePosteRow,
  type CandidatureStatut,
} from "@/lib/bureau-data";
import type { Structure } from "@/lib/recrutement";

type Search = { annonce?: string; statut?: CandidatureStatut; id?: string };

export const Route = createFileRoute("/espace-bureau/candidatures")({
  head: () => ({
    meta: [
      { title: "Candidatures — Espace Bureau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["annonce"] === "string" && s["annonce"] ? { annonce: s["annonce"] } : {}),
    ...(isCandidatureStatut(s["statut"]) ? { statut: s["statut"] } : {}),
    ...(typeof s["id"] === "string" && s["id"] ? { id: s["id"] } : {}),
  }),
  component: CandidaturesPage,
});

const ALL = "__all__";

const ETAPES: Record<CandidatureStatut, string> = {
  Reçue: "À étudier, puis planifier l'entretien.",
  Entretien: "Entretien prévu ou réalisé : il reste la décision.",
  Acceptée: "Prévenir le candidat et l'ajouter au groupe du pôle.",
  Refusée: "Prévenir le candidat de la décision.",
};

function CandidaturesPage() {
  const { user, role, ready } = useEspaceGuard();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [candidatures, setCandidatures] = useState<CandidaturePosteRow[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    void Promise.all([getCandidaturesPoste(), getAllStructures()]).then(([c, s]) => {
      setCandidatures(c);
      setStructures(s);
      setLoading(false);
    });
  }, [ready]);

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

  const annonces = useMemo(() => {
    const map = new Map<string, NonNullable<CandidaturePosteRow["annonce"]>>();
    for (const c of candidatures) if (c.annonce) map.set(c.annonce.id, c.annonce);
    return [...map.values()].sort((a, b) => a.titre.localeCompare(b.titre, "fr"));
  }, [candidatures]);

  const byAnnonce = search.annonce
    ? candidatures.filter((c) => c.annonce_id === search.annonce)
    : candidatures;
  const visible = search.statut ? byAnnonce.filter((c) => c.statut === search.statut) : byAnnonce;
  const selected = candidatures.find((c) => c.id === search.id) ?? null;

  async function update(
    c: CandidaturePosteRow,
    patch: Partial<Pick<CandidaturePosteRow, "statut" | "note_interne">>,
  ) {
    const previous = c;
    setCandidatures((list) => list.map((x) => (x.id === c.id ? { ...x, ...patch } : x)));
    const { success, error } = await updateCandidaturePoste(c.id, patch);
    if (!success) {
      setCandidatures((list) => list.map((x) => (x.id === c.id ? previous : x)));
      alert(`La mise à jour a échoué : ${error ?? "erreur inconnue"}`);
    }
  }

  function exportCsv() {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(
      `candidatures-${date}.csv`,
      [
        "Date",
        "Poste",
        "Nom",
        "Prénom",
        "E-mail",
        "WhatsApp",
        "Formation",
        "Niveau",
        "Disponibilité",
        "Motivation",
        "Expérience",
        "Liens",
        "Réponses",
        "Statut",
        "Note interne",
      ],
      visible.map((c) => [
        formatDate(c.created_at),
        c.annonce?.titre,
        c.membre?.nom,
        c.membre?.prenom,
        c.membre?.email,
        c.membre?.telephone,
        c.membre?.cycle,
        c.membre?.niveau,
        c.disponibilite,
        c.motivation,
        c.experience,
        c.liens,
        c.reponses.map((r, i) => `${c.annonce?.questions[i] ?? `Q${i + 1}`} : ${r}`).join(" | "),
        c.statut,
        c.note_interne,
      ]),
    );
  }

  if (!ready || loading) return <BureauLoading />;

  return (
    <BureauShell
      role={role}
      title="Candidatures"
      subtitle="Candidatures reçues sur les annonces. Parcours : reçue → entretien (obligatoire) → décision du responsable."
      email={user?.email ?? null}
      badges={{
        "/espace-bureau/candidatures": candidatures.filter((c) => c.statut === "Reçue").length,
      }}
    >
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-xs lg:grid-cols-[320px_minmax(0,1fr)_auto] lg:items-center">
        <Select
          value={search.annonce ?? ALL}
          onValueChange={(v) => setSearch({ annonce: v === ALL ? undefined : v })}
        >
          <SelectTrigger aria-label="Annonce">
            <SelectValue placeholder="Annonce" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes les annonces</SelectItem>
            {annonces.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.titre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-1.5">
          <StatusChip active={!search.statut} onClick={() => setSearch({ statut: undefined })}>
            Toutes ({byAnnonce.length})
          </StatusChip>
          {CANDIDATURE_STATUTS.map((s) => (
            <StatusChip
              key={s}
              active={search.statut === s}
              onClick={() => setSearch({ statut: s })}
            >
              {s} ({byAnnonce.filter((c) => c.statut === s).length})
            </StatusChip>
          ))}
        </div>
        <Button size="sm" onClick={exportCsv} disabled={visible.length === 0}>
          <Download className="size-4" />
          Exporter
        </Button>
      </div>

      {visible.length === 0 ? (
        <EmptyState>
          {candidatures.length === 0
            ? "Aucune candidature pour le moment. Elles arriveront ici dès qu'une annonce sera publiée."
            : "Aucune candidature ne correspond à ces filtres."}
        </EmptyState>
      ) : (
        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {visible.map((c) => {
            const s = structureById(structures, c.annonce?.structure_id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSearch({ id: c.id })}
                  className="grid w-full gap-2 px-4 py-3.5 text-left transition-colors hover:bg-surface sm:px-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {fullName(c.membre)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.membre?.cycle}
                      {c.membre?.niveau ? ` · ${c.membre.niveau}` : ""}
                    </p>
                  </div>
                  <p className="flex min-w-0 items-center gap-2 truncate text-sm text-foreground">
                    <StructureDot color={s?.couleur} />
                    <span className="truncate">{c.annonce?.titre ?? "Annonce supprimée"}</span>
                  </p>
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

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSearch({ id: undefined })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <CandidatureDetail
              key={selected.id}
              c={selected}
              onUpdate={(p) => void update(selected, p)}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </BureauShell>
  );
}

function CandidatureDetail({
  c,
  onUpdate,
}: {
  c: CandidaturePosteRow;
  onUpdate: (patch: Partial<Pick<CandidaturePosteRow, "statut" | "note_interne">>) => void;
}) {
  const [note, setNote] = useState(c.note_interne ?? "");
  const wa = c.membre ? whatsappLink(c.membre.telephone) : null;
  const noteChanged = note.trim() !== (c.note_interne ?? "").trim();

  return (
    <div className="grid gap-6">
      <SheetHeader className="text-left">
        <SheetTitle className="pr-6">{fullName(c.membre)}</SheetTitle>
        <SheetDescription>
          {c.annonce?.titre ?? "Annonce supprimée"} · reçue le {formatDate(c.created_at, true)}
        </SheetDescription>
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
        {c.membre ? (
          <Button asChild size="sm" variant="outline">
            <a
              href={`mailto:${c.membre.email}?subject=${encodeURIComponent(`Candidature : ${c.annonce?.titre ?? ""}`)}`}
            >
              <Mail className="size-4" />
              E-mail
            </a>
          </Button>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground">Statut</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CANDIDATURE_STATUTS.map((s) => (
            <StatusChip key={s} active={c.statut === s} onClick={() => onUpdate({ statut: s })}>
              {s}
            </StatusChip>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{ETAPES[c.statut]}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <Item label="E-mail" full>
          {c.membre?.email ?? "—"}
        </Item>
        <Item label="WhatsApp">{c.membre?.telephone ?? "—"}</Item>
        <Item label="Disponibilité">{c.disponibilite}</Item>
        <Item label="Formation" full>
          {c.membre
            ? `${c.membre.cycle}${c.membre.niveau ? ` · ${c.membre.niveau}` : ""} · ${c.membre.campus}`
            : "—"}
        </Item>
        <Item label="Motivation" full>
          <span className="whitespace-pre-line">{c.motivation}</span>
        </Item>
        <Item label="Expérience" full>
          <span className="whitespace-pre-line">{c.experience}</span>
        </Item>
        {c.liens ? (
          <Item label="Liens" full>
            {/^https?:\/\//.test(c.liens) ? (
              <a
                href={c.liens}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {c.liens}
                <ExternalLink className="size-3.5" />
              </a>
            ) : (
              c.liens
            )}
          </Item>
        ) : null}
        {c.reponses.map((r, i) => (
          <Item key={i} label={c.annonce?.questions[i] ?? `Question ${i + 1}`} full>
            <span className="whitespace-pre-line">{r}</span>
          </Item>
        ))}
      </dl>

      <div className="grid gap-2">
        <p className="text-xs font-semibold text-muted-foreground">
          Note interne (compte rendu d'entretien…)
        </p>
        <Textarea
          rows={4}
          value={note}
          maxLength={3000}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          className="justify-self-end"
          disabled={!noteChanged}
          onClick={() => onUpdate({ note_interne: note.trim() || null })}
        >
          Enregistrer la note
        </Button>
      </div>
    </div>
  );
}
