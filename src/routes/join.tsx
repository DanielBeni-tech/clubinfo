import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { BookOpen, Briefcase, CheckCircle2, Clock, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FormationFields,
  FormStep,
  IdentityFields,
  PledgeField,
  selectClass,
  selectContentClass,
  selectItemClass,
  useAdhesionFields,
} from "@/components/site/AdhesionFields";
import { PageHeader } from "@/components/site/shared";
import { club, joinForm } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import { adherer, structureDescription, structureNom } from "@/lib/recrutement";
import { useStructures } from "@/lib/use-structures";
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
          "Rejoins le Club Info SUP'PTIC en une minute, quel que soit ton cycle et ton niveau d'expérience.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: JoinPage,
});

type Done = null | "ok" | "deja_membre";

function JoinPage() {
  const { locale, t } = useLocale();
  const fields = useAdhesionFields();
  const { structures } = useStructures();
  const poles = structures.filter((s) => s.type === "pole");

  const [email, setEmail] = useState("");
  const [interets, setInterets] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [done, setDone] = useState<Done>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const max = joinForm.maxPoles;

  function toggleInteret(slug: string) {
    setInterets((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= max
          ? prev
          : [...prev, slug],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const failed = fields.firstError();
    if (failed) {
      setError(t(failed));
      return;
    }
    setSending(true);
    try {
      const result = await adherer({
        ...fields.payload(),
        email: email.trim(),
        source,
        interets,
      });
      setDone(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(t("join.error.send"));
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setDone(null);
    setEmail("");
    setInterets([]);
    setSource("");
    fields.set.nom("");
    fields.set.prenom("");
    fields.set.telephone("");
    fields.set.niveau("");
    fields.set.engagement(false);
  }

  if (done) {
    const already = done === "deja_membre";
    const { prenom, nom, telephone } = fields.values;
    const helloName = prenom || nom ? `, ${prenom || nom}` : "";
    return (
      <div>
        <PageHeader
          title={already ? t("join.done.alreadyTitle") : t("join.done.title")}
          lead={t("join.done.lead")}
        />
        <section className="section-y">
          <div className="mx-auto max-w-2xl px-4">
            <Card className="border-border shadow-card">
              <CardContent className="p-8 text-center sm:p-10">
                <CheckCircle2 className="mx-auto size-12 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-bold">
                  {already
                    ? t("join.done.alreadyTitle")
                    : t("join.done.hello", { name: helloName })}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {already ? t("join.done.alreadyBody") : t("join.done.body")}
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
                {!already ? (
                  <div className="mt-6 rounded-lg bg-surface p-4 text-left text-sm text-foreground">
                    <p className="font-semibold text-primary">{t("join.done.next")}</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                      <li>{t("join.done.sessions")}</li>
                      {telephone ? <li>{t("join.done.contact", { phone: telephone })}</li> : null}
                    </ul>
                  </div>
                ) : null}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link to="/recrutement">
                      <Briefcase className="size-4" />
                      {t("join.done.recruit")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/events">{t("join.done.events")}</Link>
                  </Button>
                  <Button variant="ghost" onClick={reset}>
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
              <p className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 text-primary" />
                {t("join.duration")}
              </p>
              <form className="grid gap-8" onSubmit={onSubmit}>
                <FormStep n={1} title={t("join.step1")}>
                  <IdentityFields state={fields} />
                  <Field id="email" label={t("join.email")} required>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      placeholder="etudiant@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                </FormStep>

                <FormStep n={2} title={t("join.step2")}>
                  <FormationFields state={fields} />
                </FormStep>

                <FormStep n={3} title={t("join.step3")}>
                  <div className="grid gap-2.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Label id="poles-label">{t("join.poles")}</Label>
                      <span className="text-xs text-muted-foreground" aria-live="polite">
                        {t("join.polesCount", { n: String(interets.length), max: String(max) })}
                      </span>
                    </div>
                    <p className="-mt-1 text-xs text-muted-foreground">
                      {t("join.polesHint", { max: String(max) })}
                    </p>
                    <div
                      className="grid gap-2 sm:grid-cols-2"
                      role="group"
                      aria-labelledby="poles-label"
                    >
                      {poles.map((p) => {
                        const selected = interets.includes(p.slug);
                        const disabled = !selected && interets.length >= max;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            role="checkbox"
                            aria-checked={selected}
                            aria-disabled={disabled}
                            onClick={() => toggleInteret(p.slug)}
                            className={cn(
                              "flex flex-col rounded-xl border p-3.5 text-left transition-all",
                              selected
                                ? "border-primary bg-primary/10 shadow-xs"
                                : "border-border bg-card hover:bg-surface",
                              disabled && "cursor-not-allowed opacity-50 hover:bg-card",
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                selected ? "text-primary" : "text-foreground",
                              )}
                            >
                              {structureNom(p, locale)}
                            </span>
                            {p.description ? (
                              <span className="mt-1 text-xs text-muted-foreground">
                                {structureDescription(p, locale)}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={interets.length === 0}
                        onClick={() => setInterets([])}
                        className={cn(
                          "rounded-xl border p-3.5 text-left text-sm font-semibold transition-all",
                          interets.length === 0
                            ? "border-primary bg-primary/10 text-primary shadow-xs"
                            : "border-border bg-card text-foreground hover:bg-surface",
                        )}
                      >
                        {t("join.discover")}
                      </button>
                    </div>
                  </div>

                  <Field id="source" label={t("join.source")}>
                    <Select {...(source ? { value: source } : {})} onValueChange={setSource}>
                      <SelectTrigger id="source" className={selectClass}>
                        <SelectValue placeholder={t("join.sourceChoose")} />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {joinForm.sources.map((s) => (
                          <SelectItem key={s.value} value={s.value} className={selectItemClass}>
                            {loc(s.label, locale)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <PledgeField state={fields} />

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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("join.recruitHint")}{" "}
            <Link
              to="/recrutement"
              className="font-medium text-primary underline underline-offset-2 hover:text-accent"
            >
              {t("join.recruitLink")}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
