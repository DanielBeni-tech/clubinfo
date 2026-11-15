import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ExternalLink, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Chip, EmptyState, StructureDot } from "@/components/bureau/ui";
import {
  deleteAnnonce,
  getAllStructures,
  getAnnoncesGerees,
  getCandidaturesPoste,
  saveAnnonce,
  setAnnonceStatut,
  type AnnonceInput,
} from "@/lib/admin-helpers";
import { canManage, useEspaceGuard } from "@/lib/admin-auth";
import {
  ANNONCE_STATUT_LABEL,
  formatDate,
  structureById,
  type CandidaturePosteRow,
} from "@/lib/bureau-data";
import { cn } from "@/lib/utils";
import { annonceOuverte, slugify, today, type Annonce, type Structure } from "@/lib/recrutement";

type Search = { structure?: string; edit?: string };

export const Route = createFileRoute("/espace-bureau/annonces")({
  head: () => ({
    meta: [{ title: "Annonces — Espace Bureau" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["structure"] === "string" && s["structure"] ? { structure: s["structure"] } : {}),
    ...(typeof s["edit"] === "string" && s["edit"] ? { edit: s["edit"] } : {}),
  }),
  component: AnnoncesPage,
});

const NEW = "nouvelle";

function AnnoncesPage() {
  const { user, role, ready } = useEspaceGuard();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);
  const [candidatures, setCandidatures] = useState<CandidaturePosteRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [a, s, c] = await Promise.all([
      getAnnoncesGerees(),
      getAllStructures(),
      getCandidaturesPoste(),
    ]);
    setAnnonces(a);
    setStructures(s);
    setCandidatures(c);
    setLoading(false);
  }

  useEffect(() => {
    if (ready) void load();
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

  // Structures où le compte peut publier (super-admin ou responsable)
  const gerees = useMemo(
    () => structures.filter((s) => s.actif && canManage(role, s.id)),
    [structures, role],
  );
  // Le Bureau voit toutes les annonces (lecture) ; un responsable hors Bureau, les siennes
  const mine = useMemo(
    () => annonces.filter((a) => role.bureau || canManage(role, a.structure_id)),
    [annonces, role],
  );
  // Structures proposées en filtre : celles qui ont des annonces visibles
  const filtres = useMemo(
    () => structures.filter((s) => mine.some((a) => a.structure_id === s.id)),
    [structures, mine],
  );
  const visible = search.structure ? mine.filter((a) => a.structure_id === search.structure) : mine;
  const editing = search.edit === NEW ? null : (mine.find((a) => a.id === search.edit) ?? null);
  const sheetOpen = (search.edit === NEW && gerees.length > 0) || !!editing;

  async function changeStatut(a: Annonce, statut: Annonce["statut"]) {
    const { success, error } = await setAnnonceStatut(a.id, statut);
    if (!success) alert(`La mise à jour a échoué : ${error ?? "erreur inconnue"}`);
    await load();
  }

  async function remove(a: Annonce) {
    const n = candidatures.filter((c) => c.annonce_id === a.id).length;
    const warning = n > 0 ? `\n\nAttention : ses ${n} candidature(s) seront aussi supprimées.` : "";
    if (!confirm(`Supprimer l'annonce « ${a.titre} » ?${warning}`)) return;
    const { success, error } = await deleteAnnonce(a.id);
    if (!success) alert(`La suppression a échoué : ${error ?? "erreur inconnue"}`);
    await load();
  }

  if (!ready || loading) return <BureauLoading />;

  return (
    <BureauShell
      role={role}
      title="Annonces"
      subtitle={
        gerees.length > 0
          ? "Publie les postes de ta structure sur la page Recrutement du site. Une annonce reste invisible tant qu'elle est en brouillon."
          : "Annonces de toutes les structures, en lecture. Seuls le responsable de la structure et l'administrateur peuvent les modifier."
      }
      email={user?.email ?? null}
      actions={
        gerees.length > 0 ? (
          <Button onClick={() => setSearch({ edit: NEW })}>
            <Plus className="size-4" />
            Nouvelle annonce
          </Button>
        ) : null
      }
    >
      {filtres.length > 1 ? (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Structure">
          <Chip
            active={!search.structure}
            onClick={() => setSearch({ structure: undefined })}
            count={mine.length}
          >
            Toutes
          </Chip>
          {filtres.map((s) => (
            <Chip
              key={s.id}
              active={search.structure === s.id}
              onClick={() => setSearch({ structure: s.id })}
              count={mine.filter((a) => a.structure_id === s.id).length}
            >
              <StructureDot color={s.couleur} />
              {s.nom}
            </Chip>
          ))}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <EmptyState>
          Aucune annonce pour le moment. Crée la première avec « Nouvelle annonce ».
        </EmptyState>
      ) : (
        <ul className="mt-4 grid gap-3">
          {visible.map((a) => {
            const s = structureById(structures, a.structure_id);
            const n = candidatures.filter((c) => c.annonce_id === a.id).length;
            const expired = a.statut === "publiee" && !annonceOuverte(a);
            return (
              <li
                key={a.id}
                className="rounded-xl border border-border bg-card p-4 shadow-xs sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                      <StructureDot color={s?.couleur} />
                      {s?.nom ?? "—"}
                    </p>
                    <p className="mt-1 font-semibold text-foreground">{a.titre}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.places} place(s)
                      {a.date_limite
                        ? ` · jusqu'au ${formatDate(`${a.date_limite}T12:00:00`)}`
                        : " · sans date limite"}
                      {" · "}
                      <Link
                        to="/espace-bureau/candidatures"
                        search={{ annonce: a.id }}
                        className="font-medium text-primary hover:underline"
                      >
                        {n} candidature(s)
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {expired ? <StatutBadge statut="Fermée" /> : null}
                    <StatutBadge statut={ANNONCE_STATUT_LABEL[a.statut]} />
                  </div>
                </div>
                {expired ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Date limite dépassée : l'annonce n'apparaît plus sur le site.
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSearch({ edit: a.id })}>
                    {canManage(role, a.structure_id) ? (
                      <Pencil className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    {canManage(role, a.structure_id) ? "Modifier" : "Consulter"}
                  </Button>
                  {!canManage(role, a.structure_id) ? null : a.statut !== "publiee" ? (
                    <Button size="sm" onClick={() => void changeStatut(a, "publiee")}>
                      Publier
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void changeStatut(a, "fermee")}
                    >
                      Fermer les candidatures
                    </Button>
                  )}
                  {a.statut !== "brouillon" ? (
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/recrutement/$slug" params={{ slug: a.slug }} target="_blank">
                        <ExternalLink className="size-4" />
                        Voir sur le site
                      </Link>
                    </Button>
                  ) : null}
                  {canManage(role, a.structure_id) ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => void remove(a)}
                    >
                      <Trash2 className="size-4" />
                      Supprimer
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={sheetOpen} onOpenChange={(open) => !open && setSearch({ edit: undefined })}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {sheetOpen ? (
            <AnnonceForm
              key={editing?.id ?? NEW}
              annonce={editing}
              readOnly={!!editing && !canManage(role, editing.structure_id)}
              structures={editing && !canManage(role, editing.structure_id) ? structures : gerees}
              defaultStructure={search.structure}
              onSaved={async () => {
                setSearch({ edit: undefined });
                await load();
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </BureauShell>
  );
}

/* ------------------------------------------------------------------ */
/* Formulaire de création / modification                              */
/* ------------------------------------------------------------------ */

function AnnonceForm({
  annonce,
  readOnly = false,
  structures,
  defaultStructure,
  onSaved,
}: {
  annonce: Annonce | null;
  readOnly?: boolean;
  structures: Structure[];
  defaultStructure?: string | undefined;
  onSaved: () => Promise<void>;
}) {
  const initialStructure =
    annonce?.structure_id ??
    (structures.some((s) => s.id === defaultStructure) ? defaultStructure : structures[0]?.id) ??
    "";

  const [structureId, setStructureId] = useState(initialStructure);
  const [titre, setTitre] = useState(annonce?.titre ?? "");
  const [slug, setSlug] = useState(annonce?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!annonce);
  const [resume, setResume] = useState(annonce?.resume ?? "");
  const [missions, setMissions] = useState(annonce?.missions ?? "");
  const [profil, setProfil] = useState(annonce?.profil ?? "");
  const [livrables, setLivrables] = useState(annonce?.livrables ?? "");
  const [outils, setOutils] = useState(annonce?.outils ?? "");
  const [rubriqueTitre, setRubriqueTitre] = useState(annonce?.rubrique_titre ?? "");
  const [rubriqueContenu, setRubriqueContenu] = useState(annonce?.rubrique_contenu ?? "");
  const [places, setPlaces] = useState(String(annonce?.places ?? 1));
  const [engagement, setEngagement] = useState(annonce?.engagement ?? "");
  const [dateLimite, setDateLimite] = useState(annonce?.date_limite ?? "");
  const [questions, setQuestions] = useState<string[]>(annonce?.questions ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function onTitre(value: string) {
    setTitre(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function submit(e: FormEvent, statut: Annonce["statut"]) {
    e.preventDefault();
    setError("");
    const cleanSlug = slugify(slug || titre);
    const nbPlaces = Number.parseInt(places, 10);
    const qs = questions.map((q) => q.trim()).filter(Boolean);
    if (!structureId || !titre.trim() || !missions.trim() || !profil.trim()) {
      setError(
        "Remplis au moins la structure, l'intitulé, « Ce que tu feras » et le profil recherché.",
      );
      return;
    }
    if (!cleanSlug) {
      setError("L'adresse de la page est invalide.");
      return;
    }
    if (!Number.isFinite(nbPlaces) || nbPlaces < 1 || nbPlaces > 50) {
      setError("Le nombre de places doit être compris entre 1 et 50.");
      return;
    }
    if (rubriqueContenu.trim() && !rubriqueTitre.trim()) {
      setError("Donne un titre à la rubrique libre, ou laisse-la vide.");
      return;
    }
    if (statut === "publiee" && dateLimite && dateLimite < today()) {
      setError("La date limite est déjà passée : modifie-la avant de publier.");
      return;
    }
    const input: AnnonceInput = {
      structure_id: structureId,
      slug: cleanSlug,
      titre: titre.trim(),
      resume: resume.trim(),
      missions: missions.trim(),
      profil: profil.trim(),
      livrables: livrables.trim() || null,
      outils: outils.trim() || null,
      rubrique_titre: rubriqueTitre.trim() || null,
      rubrique_contenu: rubriqueContenu.trim() || null,
      places: nbPlaces,
      engagement: engagement.trim() || null,
      date_limite: dateLimite || null,
      questions: qs,
      statut,
    };
    setSaving(true);
    const { success, error: err } = await saveAnnonce(input, annonce?.id);
    setSaving(false);
    if (!success) {
      setError(
        err?.includes("annonces_slug_key") || err?.includes("duplicate")
          ? "Une autre annonce utilise déjà cette adresse de page : modifie-la."
          : `L'enregistrement a échoué : ${err ?? "erreur inconnue"}`,
      );
      return;
    }
    await onSaved();
  }

  return (
    <form className="grid gap-5" onSubmit={(e) => void submit(e, annonce?.statut ?? "brouillon")}>
      <SheetHeader className="text-left">
        <SheetTitle>
          {readOnly ? "Annonce" : annonce ? "Modifier l'annonce" : "Nouvelle annonce"}
        </SheetTitle>
        <SheetDescription>
          {readOnly
            ? "Lecture seule : seuls le responsable de la structure et l'administrateur peuvent la modifier."
            : "Les champs marqués * sont obligatoires. Les rubriques facultatives n'apparaissent sur le site que si elles sont remplies."}
        </SheetDescription>
      </SheetHeader>

      <fieldset disabled={readOnly} className="grid gap-5 disabled:opacity-90">
        <F label="Structure" required>
          <Select value={structureId} onValueChange={setStructureId}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              {structures.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </F>

        <F label="Intitulé du poste" required>
          <Input
            value={titre}
            maxLength={120}
            onChange={(e) => onTitre(e.target.value)}
            placeholder="Responsable Événements et Compétitions"
          />
        </F>
        <F
          label="Adresse de la page"
          hint={`Le poste sera visible sur /recrutement/${slugify(slug || titre) || "…"}`}
        >
          <Input
            value={slug}
            maxLength={80}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </F>
        <F label="Résumé (une phrase, affichée sur la carte)">
          <Input value={resume} maxLength={180} onChange={(e) => setResume(e.target.value)} />
        </F>
        <F label="Ce que tu feras" required>
          <Textarea
            rows={4}
            value={missions}
            maxLength={3000}
            onChange={(e) => setMissions(e.target.value)}
          />
        </F>
        <F label="Profil recherché" required>
          <Textarea
            rows={3}
            value={profil}
            maxLength={2000}
            onChange={(e) => setProfil(e.target.value)}
          />
        </F>
        <F label="Livrables attendus">
          <Textarea
            rows={2}
            value={livrables}
            maxLength={2000}
            onChange={(e) => setLivrables(e.target.value)}
          />
        </F>
        <F label="Outils et technologies">
          <Input
            value={outils}
            maxLength={300}
            onChange={(e) => setOutils(e.target.value)}
            placeholder="Canva, CapCut, Notion, GitHub…"
          />
        </F>
        <div className="grid gap-3 rounded-xl border border-dashed border-border p-4">
          <p className="text-sm font-medium">Rubrique libre</p>
          <p className="-mt-2 text-xs text-muted-foreground">
            Titre au choix : « Contribution à la digitalisation », « Concours visés », «
            Certifications préparées »…
          </p>
          <Input
            value={rubriqueTitre}
            maxLength={80}
            onChange={(e) => setRubriqueTitre(e.target.value)}
            placeholder="Titre"
          />
          <Textarea
            rows={2}
            value={rubriqueContenu}
            maxLength={2000}
            onChange={(e) => setRubriqueContenu(e.target.value)}
            placeholder="Contenu"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <F label="Places" required>
            <Input
              type="number"
              min={1}
              max={50}
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
            />
          </F>
          <F label="Engagement">
            <Input
              value={engagement}
              maxLength={60}
              onChange={(e) => setEngagement(e.target.value)}
              placeholder="3 h par semaine"
            />
          </F>
          <F label="Date limite">
            <Input type="date" value={dateLimite} onChange={(e) => setDateLimite(e.target.value)} />
          </F>
        </div>

        <div className="grid gap-3">
          <div>
            <p className="text-sm font-medium">Questions propres au poste ({questions.length}/3)</p>
            <p className="text-xs text-muted-foreground">
              Le candidat devra y répondre. Exemple : « As-tu déjà organisé un événement ? Raconte
              en deux lignes. »
            </p>
          </div>
          {questions.map((q, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={q}
                maxLength={300}
                onChange={(e) =>
                  setQuestions((list) => list.map((x, j) => (j === i ? e.target.value : x)))
                }
                placeholder={`Question ${i + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Retirer la question"
                onClick={() => setQuestions((list) => list.filter((_, j) => j !== i))}
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
          {questions.length < 3 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-start"
              onClick={() => setQuestions((l) => [...l, ""])}
            >
              <Plus className="size-4" />
              Ajouter une question
            </Button>
          ) : null}
        </div>
      </fieldset>

      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap justify-end gap-2 border-t border-border pt-4",
          readOnly && "hidden",
        )}
      >
        {annonce?.statut === "publiee" ? (
          <Button type="submit" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        ) : (
          <>
            <Button type="submit" variant="outline" disabled={saving}>
              {saving
                ? "Enregistrement…"
                : annonce?.statut === "fermee"
                  ? "Enregistrer"
                  : "Enregistrer le brouillon"}
            </Button>
            <Button type="button" disabled={saving} onClick={(e) => void submit(e, "publiee")}>
              Publier
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

function F({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
