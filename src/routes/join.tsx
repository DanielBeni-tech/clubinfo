import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  BookOpen,
  FileText,
} from "lucide-react";
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
import { club, joinChoiceLabels, joinForm, joinProfile, school } from "@/data/club";
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
          "Formulaire d'adhésion au Club Informatique SUP'PTIC, calé sur les cycles officiels de l'école (ingénieurs, inspecteurs, techniciens et agents d'exploitation).",
      },
      { property: "og:title", content: "Rejoindre le Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Adhère au Club en renseignant ta formation SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: JoinPage,
});

const fieldClass =
  "h-10 w-full min-w-0 max-w-full truncate rounded-md border border-input bg-background px-3 text-base shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-sm";

const selectClass =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-sm";

const selectContentClass = "w-[var(--radix-select-trigger-width)]";
const selectItemClass = "truncate";

function choiceLabel(value: string, locale: "fr" | "en") {
  return loc(joinChoiceLabels[value] ?? { fr: value, en: value }, locale);
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
  const [campus, setCampus] = useState<(typeof joinForm.campuses)[number] | "">("");
  const [cycle, setCycle] = useState("");
  const [regime, setRegime] = useState("");
  const [niveau, setNiveau] = useState("");
  const [option, setOption] = useState("");
  const [domaine, setDomaine] = useState("");
  const [experience, setExperience] = useState("");
  const [pole, setPole] = useState("Découverte & Ateliers");
  const [motivation, setMotivation] = useState("");
  const [engagement, setEngagement] = useState(false);

  const cycles = useMemo(() => (campus ? joinForm.cyclesByCampus[campus] : []), [campus]);
  const regimes = cycle ? (joinForm.regimesByCycle[cycle] ?? []) : [];
  const options = cycle ? (joinForm.optionsByCycle[cycle] ?? []) : [];
  const levels = cycle ? (joinForm.levelsByCycle[cycle] ?? []) : [];
  const profile = joinProfile(cycle);

  const cycleLabel = useMemo(() => {
    const found = cycles.find((c) => c.value === cycle);
    return found ? loc(found.label, locale) : "";
  }, [cycles, cycle, locale]);

  const domainGroups = useMemo(() => {
    const groups = [...joinForm.domainGroups];
    if (!profile) return groups;
    const rank = (highlight: (typeof groups)[number]["highlight"]) =>
      highlight === profile ? 0 : highlight === "all" ? 1 : 2;
    return groups.sort((a, b) => rank(a.highlight) - rank(b.highlight));
  }, [profile]);

  function onCampusChange(value: (typeof joinForm.campuses)[number] | "") {
    setCampus(value);
    setCycle("");
    setRegime("");
    setNiveau("");
    setOption("");
  }

  function onCycleChange(value: string) {
    setCycle(value);
    setRegime("");
    setNiveau("");
    setOption("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!engagement) {
      setError(t("join.error.pledge"));
      return;
    }
    if (!domaine) {
      setError(t("join.error.domain"));
      return;
    }
    if (!experience) {
      setError(t("join.error.experience"));
      return;
    }

    setSending(true);
    try {
      await saveCandidature({
        nom: nom.trim(),
        prenom: prenom.trim() || null,
        email: email.trim(),
        telephone: telephone.trim(),
        campus,
        cycle,
        regime,
        niveau,
        option,
        domaine,
        niveau_experience: experience,
        pole,
        motivation: motivation.trim() || null,
        engagement_reglement: engagement,
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
                  {cycleLabel ? ` (${cycleLabel}${campus ? ` · ${campus}` : ""})` : ""}
                </p>
                <div className="mt-6 rounded-lg bg-surface p-4 text-left text-sm text-foreground">
                  <p className="font-semibold text-primary">{t("join.done.next")}</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>{t("join.done.whatsapp", { phone: telephone })}</li>
                    <li>{t("join.done.sessions")}</li>
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

  return (
    <div>
      <PageHeader title={t("join.title")} lead={t("join.lead")} />

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4">
          <Card className="border-border shadow-card">
            <CardContent className="p-6 sm:p-10">
              <form className="grid gap-8" onSubmit={onSubmit}>
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
                    <Field id="prenom" label={t("join.firstName")} required>
                      <Input
                        id="prenom"
                        name="prenom"
                        required
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
                    <Field id="telephone" label={t("join.phone")} required>
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

                <FormStep n={2} title={t("join.step2")}>
                  <div className="grid gap-4 rounded-xl border border-border/80 bg-surface/50 p-4 sm:p-5">
                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <Field id="campus" label={t("join.campus")} required>
                        <Select
                          value={campus || undefined}
                          onValueChange={(v) => onCampusChange(v as typeof campus)}
                        >
                          <SelectTrigger id="campus" className={selectClass}>
                            <SelectValue placeholder={t("join.campusChoose")} />
                          </SelectTrigger>
                          <SelectContent className={selectContentClass}>
                            {joinForm.campuses.map((c) => (
                              <SelectItem key={c} value={c} className={selectItemClass}>
                                {t("join.campusOf", { name: c })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="cycle" label={t("join.cycle")} required>
                        <Select
                          value={cycle || undefined}
                          onValueChange={onCycleChange}
                          disabled={!campus}
                        >
                          <SelectTrigger id="cycle" className={cn(selectClass, !campus && "opacity-60")}>
                            <SelectValue placeholder={campus ? t("join.cycleChoose") : t("join.cycleNeedCampus")} />
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
                    </div>
                    <div className="grid min-w-0 gap-4 sm:grid-cols-3">
                      <Field id="regime" label={t("join.regime")} required>
                        <Select
                          value={regime || undefined}
                          onValueChange={setRegime}
                          disabled={!cycle}
                        >
                          <SelectTrigger id="regime" className={cn(selectClass, !cycle && "opacity-60")}>
                            <SelectValue placeholder={cycle ? t("join.regimeChoose") : t("join.needCycle")} />
                          </SelectTrigger>
                          <SelectContent className={selectContentClass}>
                            {regimes.map((r) => (
                              <SelectItem key={r} value={r} className={selectItemClass}>
                                {choiceLabel(r, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="niveau" label={t("join.level")} required>
                        <Select
                          value={niveau || undefined}
                          onValueChange={setNiveau}
                          disabled={!cycle}
                        >
                          <SelectTrigger id="niveau" className={cn(selectClass, !cycle && "opacity-60")}>
                            <SelectValue placeholder={cycle ? t("join.levelChoose") : t("join.needCycle")} />
                          </SelectTrigger>
                          <SelectContent className={selectContentClass}>
                            {levels.map((n) => (
                              <SelectItem key={n} value={n} className={selectItemClass}>
                                {choiceLabel(n, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="option" label={t("join.option")} required>
                        <Select
                          value={option || undefined}
                          onValueChange={setOption}
                          disabled={!cycle}
                        >
                          <SelectTrigger id="option" className={cn(selectClass, !cycle && "opacity-60")}>
                            <SelectValue placeholder={cycle ? t("join.optionChoose") : t("join.needCycle")} />
                          </SelectTrigger>
                          <SelectContent className={selectContentClass}>
                            {options.map((o) => (
                              <SelectItem key={o} value={o} className={selectItemClass}>
                                {choiceLabel(o, locale)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </div>
                </FormStep>

                <FormStep n={3} title={t("join.step3")}>
                  {profile ? (
                    <p className="rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-3 text-xs leading-relaxed text-foreground">
                      {t(
                        profile === "inspection"
                          ? "join.profile.inspection"
                          : "join.profile.engineering",
                      )}
                    </p>
                  ) : null}

                  <div className="grid gap-2.5">
                    <Label id="domaine-label">
                      {t("join.domain")} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("join.domainHint")}</p>
                    <div className="grid gap-5" role="radiogroup" aria-labelledby="domaine-label">
                      {domainGroups.map((group) => {
                        const suggested = Boolean(profile) && group.highlight === profile;
                        return (
                          <div key={group.id} className="grid gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-mono text-[11px] tracking-widest text-primary uppercase">
                                {loc(group.title, locale)}
                              </p>
                              {suggested ? (
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                  {t("join.suggested")}
                                </span>
                              ) : null}
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {group.domains.map((d) => {
                                const isSelected = domaine === d.value;
                                return (
                                  <button
                                    key={d.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() => setDomaine(d.value)}
                                    className={cn(
                                      "flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-all",
                                      isSelected
                                        ? "border-primary bg-primary/10 font-medium text-primary shadow-xs"
                                        : "border-border bg-card text-foreground hover:bg-surface",
                                    )}
                                  >
                                    <span className="pr-2">{loc(d.label, locale)}</span>
                                    <span
                                      className={cn(
                                        "grid size-4 shrink-0 place-content-center rounded-full border",
                                        isSelected
                                          ? "border-primary bg-primary"
                                          : "border-muted-foreground/40",
                                      )}
                                    >
                                      {isSelected ? (
                                        <span className="size-1.5 rounded-full bg-white" />
                                      ) : null}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-2.5">
                    <Label id="experience-label">
                      {t("join.experience")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-labelledby="experience-label">
                      {joinForm.experienceLevels.map((lvl) => {
                        const isSelected = experience === lvl.value;
                        return (
                          <button
                            key={lvl.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setExperience(lvl.value)}
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
                              {loc(lvl.label, locale)}
                            </span>
                            <span className="mt-1 text-xs text-muted-foreground">
                              {loc(lvl.desc, locale)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-2.5">
                    <Label id="pole-label">
                      {t("join.pole")} <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("join.poleHint")}</p>
                    <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-labelledby="pole-label">
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

                <FormStep n={4} title={t("join.step4")}>
                  <Field id="motivation" label={t("join.motivation")}>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder={t("join.motivationPh")}
                      className="resize-y"
                    />
                  </Field>
                </FormStep>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="engagement"
                      name="engagement"
                      checked={engagement}
                      onCheckedChange={(c) => setEngagement(Boolean(c))}
                      className="mt-1"
                    />
                    <div className="grid gap-1.5">
                      <Label
                        htmlFor="engagement"
                        className="cursor-pointer text-sm font-semibold leading-relaxed text-foreground"
                      >
                        {t("join.pledgeTitle")} <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <PledgeText
                          template={t("join.pledge")}
                          charte={
                            <Link
                              to="/charte"
                              target="_blank"
                              className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                            >
                              {t("join.charter")}
                            </Link>
                          }
                          reglement={
                            <Link
                              to="/reglement"
                              target="_blank"
                              className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                            >
                              {t("join.rules")}
                            </Link>
                          }
                        />
                      </p>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={sending}
                    className="w-full text-base font-semibold"
                  >
                    {sending ? t("join.sending") : t("join.submit")}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    {t("join.privacy", { email: club.email })}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 text-primary">
                  <GraduationCap className="size-5" />
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {t("join.info.school", { name: school.name })}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {locale === "en" ? school.fullNameEn : school.fullName}
                </p>
                <ul className="mt-3.5 space-y-1.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span>{t("join.info.campuses")}</span>
                  </li>
                  <li>• {t("join.info.yde")}</li>
                  <li>• {t("join.info.buea")}</li>
                </ul>
                <a
                  href={school.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-accent"
                >
                  {t("join.info.portal", { host: school.url.replace("https://", "") })}
                  <ExternalLink className="size-3" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 text-primary">
                  <BookOpen className="size-5" />
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {t("join.info.docs")}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {t("join.info.docsLead")}
                </p>
                <div className="mt-3.5 flex flex-col gap-2">
                  <Link
                    to="/charte"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5 text-primary" />
                      {t("join.charter")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t("join.info.read")}</span>
                  </Link>
                  <Link
                    to="/reglement"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5 text-primary" />
                      {t("join.rules")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{t("join.info.read")}</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
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
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
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
