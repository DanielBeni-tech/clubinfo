import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { joinForm, OTHER } from "@/data/club";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import { cn } from "@/lib/utils";

/*
 * Champs d'adhésion partagés entre le formulaire /join et l'adhésion express
 * proposée dans une candidature (/recrutement/…) aux personnes pas encore membres.
 */

export const selectClass =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-sm";
export const selectContentClass = "w-[var(--radix-select-trigger-width)]";
export const selectItemClass = "truncate";

/** « Autre » + précision → « Autre : précision ». */
function withOther(value: string, other: string) {
  return value === OTHER ? `${OTHER} : ${other.trim()}` : value;
}

function cyclesFor(campus: string) {
  if (!campus) return [];
  return campus === OTHER
    ? Object.values(joinForm.cyclesByCampus).flat()
    : (joinForm.cyclesByCampus[campus] ?? []);
}

export function useAdhesionFields() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [campus, setCampusRaw] = useState("");
  const [campusOther, setCampusOther] = useState("");
  const [cycle, setCycle] = useState("");
  const [cycleOther, setCycleOther] = useState("");
  const [niveau, setNiveau] = useState("");
  const [engagement, setEngagement] = useState(false);

  function setCampus(value: string) {
    setCampusRaw(value);
    // Le cycle choisi reste valable si la nouvelle liste le contient encore.
    if (cycle !== OTHER && !cyclesFor(value).some((c) => c.value === cycle)) setCycle("");
  }

  /** Clé du premier message d'erreur, ou null si tout est valide. */
  function firstError(): MessageKey | null {
    const checks: [boolean, MessageKey][] = [
      [!campus, "join.error.campus"],
      [campus === OTHER && !campusOther.trim(), "join.error.campusOther"],
      [!cycle, "join.error.cycle"],
      [cycle === OTHER && !cycleOther.trim(), "join.error.cycleOther"],
      [!engagement, "join.error.pledge"],
    ];
    return checks.find(([bad]) => bad)?.[1] ?? null;
  }

  function payload() {
    return {
      nom: nom.trim(),
      prenom: prenom.trim(),
      telephone: telephone.trim(),
      campus: withOther(campus, campusOther),
      cycle: withOther(cycle, cycleOther),
      niveau: niveau.trim(),
      engagement_reglement: engagement,
    };
  }

  return {
    values: { nom, prenom, telephone, campus, campusOther, cycle, cycleOther, niveau, engagement },
    set: {
      nom: setNom,
      prenom: setPrenom,
      telephone: setTelephone,
      campus: setCampus,
      campusOther: setCampusOther,
      cycle: setCycle,
      cycleOther: setCycleOther,
      niveau: setNiveau,
      engagement: setEngagement,
    },
    firstError,
    payload,
  };
}

export type AdhesionFieldsState = ReturnType<typeof useAdhesionFields>;

/** Nom, prénom et numéro WhatsApp (l'e-mail est géré par chaque formulaire). */
export function IdentityFields({ state }: { state: AdhesionFieldsState }) {
  const { t } = useLocale();
  const { values: v, set } = state;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="nom" label={t("join.lastName")} required>
          <Input
            id="nom"
            name="nom"
            required
            maxLength={100}
            autoComplete="family-name"
            placeholder="Kouamou"
            value={v.nom}
            onChange={(e) => set.nom(e.target.value)}
          />
        </Field>
        <Field id="prenom" label={t("join.firstName")} required>
          <Input
            id="prenom"
            name="prenom"
            required
            maxLength={100}
            autoComplete="given-name"
            placeholder="Cédric"
            value={v.prenom}
            onChange={(e) => set.prenom(e.target.value)}
          />
        </Field>
      </div>
      <Field id="telephone" label={t("join.phone")} hint={t("join.phoneHint")} required>
        <Input
          id="telephone"
          name="telephone"
          type="tel"
          required
          maxLength={40}
          autoComplete="tel"
          placeholder="+237 6XX XX XX XX"
          value={v.telephone}
          onChange={(e) => set.telephone(e.target.value)}
        />
      </Field>
    </>
  );
}

/** Campus, cycle et niveau. */
export function FormationFields({ state }: { state: AdhesionFieldsState }) {
  const { locale, t } = useLocale();
  const { values: v, set } = state;

  const cycles = useMemo(
    () => (v.campus ? [...cyclesFor(v.campus), joinForm.otherCycle] : []),
    [v.campus],
  );

  const niveauField = (
    <Field id="niveau" label={t("join.level")}>
      <Input
        id="niveau"
        maxLength={60}
        placeholder={t("join.levelPh")}
        value={v.niveau}
        onChange={(e) => set.niveau(e.target.value)}
      />
    </Field>
  );

  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <Field id="campus" label={t("join.campus")} required>
        <Select {...(v.campus ? { value: v.campus } : {})} onValueChange={set.campus}>
          <SelectTrigger id="campus" className={selectClass}>
            <SelectValue placeholder={t("join.campusChoose")} />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {joinForm.campuses.map((c) => (
              <SelectItem key={c.value} value={c.value} className={selectItemClass}>
                {loc(c.label, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      {v.campus === OTHER ? (
        <Field id="campusOther" label={t("join.campusOther")} required>
          <Input
            id="campusOther"
            required
            maxLength={80}
            value={v.campusOther}
            onChange={(e) => set.campusOther(e.target.value)}
          />
        </Field>
      ) : null}
      <Field id="cycle" label={t("join.cycle")} required>
        <Select
          {...(v.cycle ? { value: v.cycle } : {})}
          onValueChange={set.cycle}
          disabled={!v.campus}
        >
          <SelectTrigger id="cycle" className={cn(selectClass, !v.campus && "opacity-60")}>
            <SelectValue
              placeholder={v.campus ? t("join.cycleChoose") : t("join.cycleNeedCampus")}
            />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {cycles.map((c) => (
              <SelectItem key={c.value} value={c.value} className={selectItemClass}>
                {loc(c.label, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      {v.cycle === OTHER ? (
        <Field id="cycleOther" label={t("join.cycleOther")} required>
          <Input
            id="cycleOther"
            required
            maxLength={120}
            value={v.cycleOther}
            onChange={(e) => set.cycleOther(e.target.value)}
          />
        </Field>
      ) : null}
      {niveauField}
    </div>
  );
}

/** Case unique : inscription à SUP'PTIC + Charte + Règlement intérieur. */
export function PledgeField({ state }: { state: AdhesionFieldsState }) {
  const { t } = useLocale();
  const docLink = (to: "/charte" | "/reglement", label: string) => (
    <Link
      to={to}
      target="_blank"
      className="font-medium text-primary underline underline-offset-2 hover:text-accent"
    >
      {label}
    </Link>
  );
  const parts = t("join.pledge").split(/\{(charte|reglement)\}/);
  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <Checkbox
        id="engagement"
        checked={state.values.engagement}
        onCheckedChange={(c) => state.set.engagement(Boolean(c))}
        className="mt-0.5"
      />
      <Label htmlFor="engagement" className="block cursor-pointer text-sm leading-relaxed">
        {parts.map((part, i) =>
          part === "charte" ? (
            <span key={i}>{docLink("/charte", t("join.charter"))}</span>
          ) : part === "reglement" ? (
            <span key={i}>{docLink("/reglement", t("join.rules"))}</span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}{" "}
        <span className="text-destructive">*</span>
      </Label>
    </div>
  );
}

export function FormStep({
  n,
  title,
  children,
}: {
  n?: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
        {n ? (
          <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {n}
          </span>
        ) : null}
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Field({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string | undefined;
  required?: boolean | undefined;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {hint ? <p className="-mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </div>
  );
}
