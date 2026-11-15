import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Pencil, Plus, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { BureauLoading, BureauShell } from "@/components/bureau/BureauShell";
import { StructureDot } from "@/components/bureau/ui";
import {
  addResponsable,
  getAllStructures,
  getResponsables,
  removeResponsable,
  saveStructure,
  type StructureInput,
} from "@/lib/admin-helpers";
import { useEspaceGuard } from "@/lib/admin-auth";
import type { ResponsableRow } from "@/lib/bureau-data";
import { COULEUR_KEYS, slugify, type Structure, type StructureType } from "@/lib/recrutement";
import { cn } from "@/lib/utils";

type Search = { edit?: string };

export const Route = createFileRoute("/espace-bureau/structures")({
  head: () => ({
    meta: [
      { title: "Structures — Espace Bureau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search =>
    typeof s["edit"] === "string" && s["edit"] ? { edit: s["edit"] } : {},
  component: StructuresPage,
});

const NEW = "nouvelle";

function StructuresPage() {
  const { user, role, ready } = useEspaceGuard({ bureauOnly: true });
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const [structures, setStructures] = useState<Structure[]>([]);
  const [responsables, setResponsables] = useState<ResponsableRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [s, r] = await Promise.all([getAllStructures(), getResponsables()]);
    setStructures(s);
    setResponsables(r);
    setLoading(false);
  }

  useEffect(() => {
    if (ready) void load();
  }, [ready]);

  const editing =
    search.edit === NEW ? null : (structures.find((s) => s.id === search.edit) ?? null);
  const open = role.admin && (search.edit === NEW || !!editing);
  const close = () => void navigate({ search: {}, replace: true });

  if (!ready || loading) return <BureauLoading />;

  return (
    <BureauShell
      role={role}
      title="Structures"
      subtitle={
        role.admin
          ? "Pôles et autres entités du club. Un pôle actif apparaît dans le formulaire d'adhésion ; chaque structure peut publier des annonces via ses responsables."
          : "Pôles et autres entités du club, avec leurs responsables. Seul l'administrateur peut les modifier."
      }
      email={user?.email ?? null}
      actions={
        role.admin ? (
          <Button onClick={() => void navigate({ search: { edit: NEW }, replace: true })}>
            <Plus className="size-4" />
            Nouvelle structure
          </Button>
        ) : null
      }
    >
      <ul className="grid gap-3 md:grid-cols-2">
        {structures.map((s) => {
          const resp = responsables.filter((r) => r.structure_id === s.id);
          return (
            <li
              key={s.id}
              className={cn(
                "rounded-xl border border-border bg-card p-4 shadow-xs sm:p-5",
                !s.actif && "opacity-60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold text-foreground">
                    <StructureDot color={s.couleur} />
                    {s.nom}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.type === "pole" ? "Pôle" : "Entité du Bureau"} ·{" "}
                    {s.actif ? "active" : "inactive"} · ordre {s.ordre}
                  </p>
                </div>
                {role.admin ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void navigate({ search: { edit: s.id }, replace: true })}
                  >
                    <Pencil className="size-4" />
                    Modifier
                  </Button>
                ) : null}
              </div>
              {s.description ? (
                <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
              ) : null}
              <p className="mt-3 text-xs font-semibold text-muted-foreground">Responsable(s)</p>
              <p className="mt-1 text-sm text-foreground">
                {resp.length ? (
                  resp.map((r) => r.email).join(", ")
                ) : (
                  <span className="text-muted-foreground">Aucun pour le moment</span>
                )}
              </p>
            </li>
          );
        })}
      </ul>

      <Sheet open={open} onOpenChange={(o) => !o && close()}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {open ? (
            <StructureForm
              key={editing?.id ?? NEW}
              structure={editing}
              nextOrdre={Math.max(0, ...structures.map((s) => s.ordre)) + 10}
              responsables={
                editing ? responsables.filter((r) => r.structure_id === editing.id) : []
              }
              onChanged={load}
              onSaved={async () => {
                close();
                await load();
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </BureauShell>
  );
}

function StructureForm({
  structure,
  nextOrdre,
  responsables,
  onChanged,
  onSaved,
}: {
  structure: Structure | null;
  nextOrdre: number;
  responsables: ResponsableRow[];
  onChanged: () => Promise<void>;
  onSaved: () => Promise<void>;
}) {
  const [nom, setNom] = useState(structure?.nom ?? "");
  const [nomEn, setNomEn] = useState(structure?.nom_en ?? "");
  const [slug, setSlug] = useState(structure?.slug ?? "");
  const [description, setDescription] = useState(structure?.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(structure?.description_en ?? "");
  const [type, setType] = useState<StructureType>(structure?.type ?? "pole");
  const [color, setColor] = useState(structure?.couleur ?? "emerald");
  const [ordre, setOrdre] = useState(String(structure?.ordre ?? nextOrdre));
  const [actif, setActif] = useState(structure?.actif ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [respEmail, setRespEmail] = useState("");
  const [respError, setRespError] = useState("");
  const [respBusy, setRespBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const cleanSlug = structure ? structure.slug : slugify(slug || nom);
    if (!nom.trim() || !cleanSlug) {
      setError("Le nom est obligatoire.");
      return;
    }
    const input: StructureInput = {
      slug: cleanSlug,
      nom: nom.trim(),
      nom_en: nomEn.trim() || null,
      description: description.trim(),
      description_en: descriptionEn.trim() || null,
      type,
      couleur: color,
      ordre: Number.parseInt(ordre, 10) || 100,
      actif,
    };
    setSaving(true);
    const { success, error: err } = await saveStructure(input, structure?.id);
    setSaving(false);
    if (!success) {
      setError(
        err?.includes("duplicate")
          ? "Une structure utilise déjà cet identifiant."
          : `L'enregistrement a échoué : ${err ?? "erreur inconnue"}`,
      );
      return;
    }
    await onSaved();
  }

  async function addResp() {
    if (!structure) return;
    setRespError("");
    setRespBusy(true);
    const { success, error: err } = await addResponsable(respEmail.trim(), structure.id);
    setRespBusy(false);
    if (!success) {
      setRespError(err ?? "Erreur inconnue");
      return;
    }
    setRespEmail("");
    await onChanged();
  }

  async function removeResp(r: ResponsableRow) {
    if (!confirm(`Retirer l'accès de ${r.email} à cette structure ?`)) return;
    const { success, error: err } = await removeResponsable(r.user_id, r.structure_id);
    if (!success) alert(`Le retrait a échoué : ${err ?? "erreur inconnue"}`);
    await onChanged();
  }

  return (
    <div className="grid gap-8">
      <form className="grid gap-4" onSubmit={(e) => void submit(e)}>
        <SheetHeader className="text-left">
          <SheetTitle>
            {structure ? `Modifier « ${structure.nom} »` : "Nouvelle structure"}
          </SheetTitle>
          <SheetDescription>
            Ajouter un pôle ici le fait apparaître dans le formulaire d'adhésion, les filtres et les
            statistiques, sans modifier le site.
          </SheetDescription>
        </SheetHeader>

        <F label="Nom" required>
          <Input
            value={nom}
            maxLength={80}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Innovation & Projets"
          />
        </F>
        {!structure ? (
          <F
            label="Identifiant"
            hint={`Utilisé dans les liens : ${slugify(slug || nom) || "…"} (non modifiable ensuite)`}
          >
            <Input value={slug} maxLength={60} onChange={(e) => setSlug(e.target.value)} />
          </F>
        ) : null}
        <F label="Nom en anglais">
          <Input
            value={nomEn}
            maxLength={80}
            onChange={(e) => setNomEn(e.target.value)}
            placeholder="Innovation & Projects"
          />
        </F>
        <F label="Description (affichée dans le formulaire d'adhésion)">
          <Textarea
            rows={3}
            value={description}
            maxLength={400}
            onChange={(e) => setDescription(e.target.value)}
          />
        </F>
        <F label="Description en anglais">
          <Textarea
            rows={3}
            value={descriptionEn}
            maxLength={400}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </F>
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Type">
            <Select value={type} onValueChange={(v) => setType(v as StructureType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pole">Pôle (proposé à l'adhésion)</SelectItem>
                <SelectItem value="bureau">Entité du Bureau</SelectItem>
              </SelectContent>
            </Select>
          </F>
          <F label="Ordre d'affichage">
            <Input type="number" value={ordre} onChange={(e) => setOrdre(e.target.value)} />
          </F>
        </div>
        <F label="Couleur">
          <div className="flex flex-wrap gap-2">
            {COULEUR_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-label={k}
                aria-pressed={color === k}
                onClick={() => setColor(k)}
                className={cn(
                  "grid size-8 place-content-center rounded-full border",
                  color === k ? "border-foreground" : "border-transparent",
                )}
              >
                <StructureDot color={k} />
              </button>
            ))}
          </div>
        </F>
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
          <span>
            Active
            <span className="block text-xs text-muted-foreground">
              Inactive : masquée du site, données conservées.
            </span>
          </span>
          <Switch checked={actif} onCheckedChange={setActif} />
        </label>

        {error ? (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={saving} className="justify-self-end">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>

      {structure ? (
        <div className="grid gap-3 border-t border-border pt-6">
          <div>
            <p className="font-semibold">Responsables</p>
            <p className="text-xs text-muted-foreground">
              Ils publient les annonces et traitent les candidatures de cette structure. Le compte
              doit d'abord être créé dans Supabase (Authentication &gt; Users).
            </p>
          </div>
          {responsables.length ? (
            <ul className="grid gap-2">
              {responsables.map((r) => (
                <li
                  key={r.user_id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"
                >
                  <span className="truncate">{r.email}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => void removeResp(r)}
                  >
                    <UserMinus className="size-4" />
                    Retirer
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Aucun responsable pour le moment.</p>
          )}
          <div className="flex gap-2">
            <Input
              type="email"
              value={respEmail}
              onChange={(e) => setRespEmail(e.target.value)}
              placeholder="prenom.nom@gmail.com"
              aria-label="E-mail du responsable"
            />
            <Button
              type="button"
              variant="outline"
              disabled={respBusy || !respEmail.trim()}
              onClick={() => void addResp()}
            >
              <UserPlus className="size-4" />
              Ajouter
            </Button>
          </div>
          {respError ? <p className="text-sm text-destructive">{respError}</p> : null}
        </div>
      ) : null}
    </div>
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
