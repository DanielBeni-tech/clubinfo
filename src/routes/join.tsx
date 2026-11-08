import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { BookOpen, CheckCircle2, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/site/shared";
import { club, joinForm, OTHER } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import { saveCandidature } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Rejoindre le Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Formulaire d'inscription au Club Informatique SUP'PTIC, ouvert à tous les cycles de formation de l'école.",
      },
      { property: "og:title", content: "Rejoindre le Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content:
          "Rejoins le Club Info SUP'PTIC, quel que soit ton cycle et ton niveau d'expérience.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: JoinPage,
});

const selectClass =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-sm";

const selectContentClass = "w-[var(--radix-select-trigger-width)]";
const selectItemClass = "truncate";

/** « Autre » + précision → « Autre : précision ». */
function withOther(value: string, other: string) {
  return value === OTHER ? `${OTHER} : ${other.trim()}` : value;
}

function JoinPage() {
  const { locale, t } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [campus, setCampus] = useState("");
  const [campusOther, setCampusOther] = useState("");
  const [cycle, setCycle] = useState("");
  const [cycleOther, setCycleOther] = useState("");
  const [niveau, setNiveau] = useState("");
  const [option, setOption] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestOther, setInterestOther] = useState("");
  const [experience, setExperience] = useState("");
  const [pole, setPole] = useState("");
  const [motivation, setMotivation] = useState("");
  const [idea, setIdea] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [engagement, setEngagement] = useState(false);

  const max = joinForm.maxInterests;

  const cycles = useMemo(() => {
    if (!campus) return [];
    const list =
      campus === OTHER
        ? Object.values(joinForm.cyclesByCampus).flat()
        : (joinForm.cyclesByCampus[campus] ?? []);
    return [...list, joinForm.otherCycle];
  }, [campus]);

  const cycleLabel = useMemo(() => {
    if (cycle === OTHER) return cycleOther.trim();
    const found = cycles.find((c) => c.value === cycle);
    return found ? loc(found.label, locale) : "";
  }, [cycles, cycle, cycleOther, locale]);

  function onCampusChange(value: string) {
    setCampus(value);
    // Le cycle choisi reste valable si la nouvelle liste le contient encore.
    const next =
      value === OTHER
        ? Object.values(joinForm.cyclesByCampus).flat()
        : (joinForm.cyclesByCampus[value] ?? []);
    if (cycle !== OTHER && !next.some((c) => c.value === cycle)) setCycle("");
  }

  function toggleInterest(value: string) {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : prev.length >= max
          ? prev
          : [...prev, value],
    );
  }

  function toggleAvailability(value: string) {
    setAvailability((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const checks: [boolean, Parameters<typeof t>[0]][] = [
      [!campus, "join.error.campus"],
      [campus === OTHER && !campusOther.trim(), "join.error.campusOther"],
      [!cycle, "join.error.cycle"],
      [cycle === OTHER && !cycleOther.trim(), "join.error.cycleOther"],
      [interests.length === 0, "join.error.interests"],
      [interests.includes(OTHER) && !interestOther.trim(), "join.error.interestsOther"],
      [!pole, "join.error.pole"],
      [!enrolled, "join.error.enrolled"],
      [!engagement, "join.error.pledge"],
    ];
    const failed = checks.find(([bad]) => bad);
    if (failed) {
      setError(t(failed[1]));
      return;
    }

    // Les réponses facultatives de la section 5 sont regroupées dans « motivation »
    // pour rester compatibles avec la table Supabase existante.
    const extra = [
      motivation.trim() && `Motivation : ${motivation.trim()}`,
      idea.trim() && `Idée de projet : ${idea.trim()}`,
      availability.length > 0 && `Disponibilités : ${availability.join(", ")}`,
    ].filter(Boolean);

    setSending(true);
    try {
      await saveCandidature({
        nom: nom.trim(),
        prenom: prenom.trim() || null,
        email: email.trim(),
        telephone: telephone.trim(),
        campus: withOther(campus, campusOther),
        cycle: withOther(cycle, cycleOther),
        regime: "", // champ retiré du formulaire (colonne conservée en base)
        niveau: niveau.trim(),
        option: option.trim(),
        domaine: interests.map((v) => withOther(v, interestOther)).join(" ; "),
        niveau_experience: experience.trim() || null,
        pole,
        motivation: extra.length > 0 ? extra.join("\n") : null,
        engagement_reglement: enrolled && engagement,
      });
      setSubmitted(true);
    } catch {
      setError(t("join.error.send"));
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    const helloName = prenom || nom ? `, ${prenom || nom}` : "";
    const campusLabel = campus === OTHER ? campusOther.trim() : campus;
    return (
      <div>
        <PageHeader title={t("join.done.title")} lead={t("join.done.lead")} />
        <section className="section-y">
          <div className="mx-auto max-w-2xl px-4">
            <Card className="border-border shadow-card">
              <CardContent className="p-8 text-center sm:p-10">
                <CheckCircle2 className="mx-auto size-12 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-bold">
                  {t("join.done.hello", { name: helloName })}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {t("join.done.body")}
                  {cycleLabel ? ` (${cycleLabel}${campusLabel ? ` · ${campusLabel}` : ""})` : ""}
                </p>
                <div className="mt-6 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-5">
                  <p className="text-sm text-foreground">{t("join.done.whatsapp")}</p>
                  <Button
                    asChild
                    size="lg"
                    className="mt-4 w-full bg-[#25D366] font-semibold text-white hover:bg-[#1ebe5b] sm:w-auto"
                  >
                    <a href={club.whatsappGroup} target="_blank" rel="noreferrer">
                      <MessageCircle className="size-5" />
                      {t("join.done.whatsappCta")}
                    </a>
                  </Button>
                </div>
                <div className="mt-6 rounded-lg bg-surface p-4 text-left text-sm text-foreground">
                  <p className="font-semibold text-primary">{t("join.done.next")}</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>{t("join.done.sessions")}</li>
                    {telephone ? <li>{t("join.done.contact", { phone: telephone })}</li> : null}
                  </ul>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link to="/events">{t("join.done.events")}</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setSubmitted(false)}>
                    {t("join.done.another")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  const docLink = (to: "/charte" | "/reglement", label: string) => (
    <Link
      to={to}
      target="_blank"
      className="font-medium text-primary underline underline-offset-2 hover:text-accent"
    >
      {label}
    </Link>
  );

  return (
    <div>
      <PageHeader title={t("join.title")} lead={t("join.lead")} />

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-surface/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-start gap-3">
              <BookOpen className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">{t("join.docsNotice")}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {(
                [
                  ["/charte", t("join.charterFull")],
                  ["/reglement", t("join.rules")],
                ] as const
              ).map(([to, label]) => (
                <Button key={to} asChild variant="outline" size="sm">
                  <Link to={to} target="_blank">
                    <FileText className="size-4 text-primary" />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <Card className="border-border shadow-card">
            <CardContent className="p-6 sm:p-10">
              <form className="grid gap-8" onSubmit={onSubmit}>
                {/* 1. Identité et contact */}
                <FormStep n={1} title={t("join.step1")}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="nom" label={t("join.lastName")} required>
                      <Input
                        id="nom"
                        name="nom"
                        required
                        autoComplete="family-name"
                        placeholder="Kouamou"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                      />
                    </Field>
                    <Field id="prenom" label={t("join.firstName")}>
                      <Input
                        id="prenom"
                        name="prenom"
                        autoComplete="given-name"
                        placeholder="Cédric"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                      />
                    </Field>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="email" label={t("join.email")} required>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="etudiant@supptic.cm"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>
                    <Field
                      id="telephone"
                      label={t("join.phone")}
                      hint={t("join.phoneHint")}
                      required
                    >
                      <Input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="+237 6XX XX XX XX"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                      />
                    </Field>
                  </div>
                </FormStep>

                {/* 2. Formation à SUP'PTIC */}
                <FormStep n={2} title={t("join.step2")}>
                  <div className="grid gap-4 rounded-xl border border-border/80 bg-surface/50 p-4 sm:p-5">
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <Field id="campus" label={t("join.campus")} required>
                        <Select
                          {...(campus ? { value: campus } : {})}
                          onValueChange={onCampusChange}
                        >
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
                      {campus === OTHER ? (
                        <Field id="campusOther" label={t("join.campusOther")} required>
                          <Input
                            id="campusOther"
                            required
                            value={campusOther}
                            onChange={(e) => setCampusOther(e.target.value)}
                          />
                        </Field>
                      ) : null}
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <Field id="cycle" label={t("join.cycle")} hint={t("join.cycleHint")} required>
                        <Select
                          {...(cycle ? { value: cycle } : {})}
                          onValueChange={setCycle}
                          disabled={!campus}
                        >
                          <SelectTrigger
                            id="cycle"
                            className={cn(selectClass, !campus && "opacity-60")}
                          >
                            <SelectValue
                              placeholder={
                                campus ? t("join.cycleChoose") : t("join.cycleNeedCampus")
                              }
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
                      {cycle === OTHER ? (
                        <Field id="cycleOther" label={t("join.cycleOther")} required>
                          <Input
                            id="cycleOther"
                            required
                            value={cycleOther}
                            onChange={(e) => setCycleOther(e.target.value)}
                          />
                        </Field>
                      ) : null}
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <Field id="niveau" label={t("join.level")} hint={t("join.levelHint")}>
                        <Input
                          id="niveau"
                          placeholder={t("join.levelPh")}
                          value={niveau}
                          onChange={(e) => setNiveau(e.target.value)}
                        />
                      </Field>
                      <Field id="option" label={t("join.option")}>
                        <Input
                          id="option"
                          value={option}
                          onChange={(e) => setOption(e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </FormStep>

                {/* 3. Ce que tu souhaites faire au club */}
                <FormStep n={3} title={t("join.step3")}>
                  <div className="grid gap-2.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Label id="interests-label">
                        {t("join.interests")} <span className="text-destructive">*</span>
                      </Label>
                      <span className="text-xs text-muted-foreground" aria-live="polite">
                        {t("join.interestsCount", {
                          n: String(interests.length),
                          max: String(max),
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("join.interestsHint", { max: String(max) })}
                    </p>
                    <div
                      className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                      role="group"
                      aria-labelledby="interests-label"
                    >
                      {joinForm.interests.map((d) => {
                        const isSelected = interests.includes(d.value);
                        const isDisabled = !isSelected && interests.length >= max;
                        return (
                          <button
                            key={d.value}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            aria-disabled={isDisabled}
                            onClick={() => toggleInterest(d.value)}
                            className={cn(
                              "flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-all",
                              isSelected
                                ? "border-primary bg-primary/10 font-medium text-primary shadow-xs"
                                : "border-border bg-card text-foreground hover:bg-surface",
                              isDisabled && "cursor-not-allowed opacity-50 hover:bg-card",
                            )}
                          >
                            <span className="pr-2">{loc(d.label, locale)}</span>
                            <span
                              className={cn(
                                "grid size-4 shrink-0 place-content-center rounded border",
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/40",
                              )}
                            >
                              {isSelected ? (
                                <span className="size-1.5 rounded-sm bg-white" />
                              ) : null}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {interests.includes(OTHER) ? (
                      <Field id="interestOther" label={t("join.interestsOther")} required>
                        <Input
                          id="interestOther"
                          required
                          value={interestOther}
                          onChange={(e) => setInterestOther(e.target.value)}
                        />
                      </Field>
                    ) : null}
                  </div>

                  <Field
                    id="experience"
                    label={t("join.experience")}
                    hint={t("join.experienceHint")}
                  >
                    <Textarea
                      id="experience"
                      rows={3}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder={t("join.experiencePh")}
                      className="resize-y"
                    />
                  </Field>
                </FormStep>

                {/* 4. Préférence de pôle */}
                <FormStep n={4} title={t("join.step4")}>
                  <div className="grid gap-2.5">
                    <Label id="pole-label">
                      {t("join.pole")} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("join.poleHint")}</p>
                    <div
                      className="grid gap-2.5 sm:grid-cols-2"
                      role="radiogroup"
                      aria-labelledby="pole-label"
                    >
                      {joinForm.poles.map((p) => {
                        const isSelected = pole === p.value;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setPole(p.value)}
                            className={cn(
                              "flex flex-col rounded-xl border p-3.5 text-left transition-all",
                              isSelected
                                ? "border-primary bg-primary/10 text-primary shadow-xs"
                                : "border-border bg-card hover:bg-surface",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                isSelected ? "text-primary" : "text-foreground",
                              )}
                            >
                              {loc(p.label, locale)}
                            </span>
                            <span className="mt-1.5 text-xs text-muted-foreground">
                              {loc(p.desc, locale)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </FormStep>

                {/* 5. Motivation, idée et disponibilités */}
                <FormStep n={5} title={t("join.step5")}>
                  <Field id="motivation" label={t("join.motivation")}>
                    <Textarea
                      id="motivation"
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      className="resize-y"
                    />
                  </Field>
                  <Field id="idea" label={t("join.idea")} hint={t("join.ideaHint")}>
                    <Textarea
                      id="idea"
                      rows={3}
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      className="resize-y"
                    />
                  </Field>
                  <div className="grid gap-2.5">
                    <Label id="availability-label">{t("join.availability")}</Label>
                    <div
                      className="grid gap-2 sm:grid-cols-2"
                      role="group"
                      aria-labelledby="availability-label"
                    >
                      {joinForm.availability.map((a) => (
                        <label
                          key={a.value}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-card p-3 text-sm hover:bg-surface"
                        >
                          <Checkbox
                            checked={availability.includes(a.value)}
                            onCheckedChange={() => toggleAvailability(a.value)}
                          />
                          {loc(a.label, locale)}
                        </label>
                      ))}
                    </div>
                  </div>
                </FormStep>

                {/* 6. Engagement et données */}
                <FormStep n={6} title={t("join.step6")}>
                  <div className="grid gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="enrolled"
                        checked={enrolled}
                        onCheckedChange={(c) => setEnrolled(Boolean(c))}
                        className="mt-0.5"
                      />
                      <Label htmlFor="enrolled" className="cursor-pointer text-sm leading-relaxed">
                        {t("join.enrolled")} <span className="text-destructive">*</span>
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="engagement"
                        checked={engagement}
                        onCheckedChange={(c) => setEngagement(Boolean(c))}
                        className="mt-0.5"
                      />
                      <Label
                        htmlFor="engagement"
                        className="cursor-pointer text-sm leading-relaxed"
                      >
                        <span>
                          <PledgeText
                            template={t("join.pledge")}
                            charte={docLink("/charte", t("join.charter"))}
                            reglement={docLink("/reglement", t("join.rules"))}
                          />{" "}
                          <span className="text-destructive">*</span>
                        </span>
                      </Label>
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground">
                    <p className="font-semibold text-foreground">{t("join.dataTitle")}</p>
                    <p className="mt-1">{t("join.data", { email: club.email })}</p>
                  </div>
                </FormStep>

                {error ? (
                  <div
                    role="alert"
                    className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
                  >
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  size="lg"
                  disabled={sending}
                  className="w-full text-base font-semibold"
                >
                  {sending ? t("join.sending") : t("join.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function FormStep({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="grid gap-4">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
        <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {n}
        </span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
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

function PledgeText({
  template,
  charte,
  reglement,
}: {
  template: string;
  charte: ReactNode;
  reglement: ReactNode;
}) {
  const parts = template.split(/\{(charte|reglement)\}/);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "charte") return <span key={i}>{charte}</span>;
        if (part === "reglement") return <span key={i}>{reglement}</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
