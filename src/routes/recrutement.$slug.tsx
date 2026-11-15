import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  Lock,
  MessageCircle,
  Package,
  Sparkles,
  Target,
  UserCheck,
  Users,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  IdentityFields,
  PledgeField,
  selectClass,
  selectContentClass,
  selectItemClass,
  useAdhesionFields,
} from "@/components/site/AdhesionFields";
import { club, joinForm } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { useLocale, type MessageKey } from "@/lib/i18n";
import { loc } from "@/lib/locale-text";
import {
  annonceOuverte,
  couleur,
  EMAIL_RE,
  estMembre,
  formatDateLimite,
  getAnnonce,
  postuler,
  structureNom,
  type AnnonceAvecStructure,
} from "@/lib/recrutement";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recrutement/$slug")({
  head: () => ({
    meta: [
      { title: "Poste à pourvoir — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content: "Fiche de poste et candidature en ligne au Club Informatique SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: AnnoncePage,
});

const TEXT_MAX = 1000;

function AnnoncePage() {
  const { slug } = Route.useParams();
  const { locale, t } = useLocale();
  const [annonce, setAnnonce] = useState<AnnonceAvecStructure | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    setState("loading");
    getAnnonce(slug)
      .then((a) => {
        setAnnonce(a);
        setState(a ? "ready" : "missing");
      })
      .catch(() => setState("missing"));
  }, [slug]);

  const back = (
    <Link
      to="/recrutement"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      <ArrowLeft className="size-4" />
      {t("recruit.back")}
    </Link>
  );

  if (state === "loading") {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">{t("recruit.loading")}</p>
    );
  }

  if (state === "missing" || !annonce) {
    return (
      <section className="section-y">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h1 className="font-display text-2xl font-bold">{t("recruit.notFound")}</h1>
          <p className="mt-2 text-muted-foreground">{t("recruit.notFoundBody")}</p>
          <div className="mt-6">{back}</div>
        </div>
      </section>
    );
  }

  const a = annonce;
  const c = couleur(a.structure?.couleur);
  const open = annonceOuverte(a);

  return (
    <div>
      <section className="night-panel">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <Link
            to="/recrutement"
            className="inline-flex items-center gap-1.5 text-sm text-night-muted hover:text-white"
          >
            <ArrowLeft className="size-4" />
            {t("recruit.back")}
          </Link>
          {a.structure ? (
            <p className="mt-5">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white">
                <span className={cn("size-2 rounded-full", c.dot)} />
                {structureNom(a.structure, locale)}
              </span>
            </p>
          ) : null}
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">{a.titre}</h1>
          {a.resume ? <p className="mt-3 max-w-2xl text-night-muted">{a.resume}</p> : null}
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-night-muted">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" />
              {a.places > 1 ? t("recruit.placesN", { n: String(a.places) }) : t("recruit.place")}
            </span>
            {a.engagement ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {a.engagement}
              </span>
            ) : null}
            {a.date_limite ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4" />
                {t("recruit.until", { date: formatDateLimite(a.date_limite, locale) })}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto grid max-w-4xl gap-10 px-4">
          <div className="grid gap-6">
            <Rubrique icon={<Target className="size-4" />} title={t("recruit.missions")}>
              {a.missions}
            </Rubrique>
            <Rubrique icon={<UserCheck className="size-4" />} title={t("recruit.profile")}>
              {a.profil}
            </Rubrique>
            {a.livrables ? (
              <Rubrique icon={<Package className="size-4" />} title={t("recruit.deliverables")}>
                {a.livrables}
              </Rubrique>
            ) : null}
            {a.outils ? (
              <Rubrique icon={<Wrench className="size-4" />} title={t("recruit.tools")}>
                {a.outils}
              </Rubrique>
            ) : null}
            {a.rubrique_titre && a.rubrique_contenu ? (
              <Rubrique icon={<Sparkles className="size-4" />} title={a.rubrique_titre}>
                {a.rubrique_contenu}
              </Rubrique>
            ) : null}
          </div>

          {open ? (
            <ApplyForm annonce={a} />
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">
              <Lock className="size-5 shrink-0" />
              {t("recruit.closed")}
            </div>
          )}

          <div>{back}</div>
        </div>
      </section>
    </div>
  );
}

function Rubrique({ icon, title, children }: { icon: ReactNode; title: string; children: string }) {
  return (
    <div>
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
        <span className="grid size-7 place-content-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        {title}
      </h2>
      <p className="mt-2 leading-relaxed whitespace-pre-line text-muted-foreground">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Formulaire de candidature en 4 étapes                              */
/* ------------------------------------------------------------------ */

type Step = 1 | 2 | 3 | 4;

function ApplyForm({ annonce }: { annonce: AnnonceAvecStructure }) {
  const { locale, t } = useLocale();
  const adhesion = useAdhesionFields();
  const questions = annonce.questions;

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [membre, setMembre] = useState<null | boolean>(null); // null = pas encore vérifié
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");
  const [liens, setLiens] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [reponses, setReponses] = useState<string[]>(() => questions.map(() => ""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const stepTitles: Record<Step, MessageKey> = {
    1: "recruit.form.s1",
    2: "recruit.form.s2",
    3: questions.length ? "recruit.form.s3" : "recruit.form.s3NoQuestion",
    4: "recruit.form.s4",
  };

  function go(next: Step) {
    setError("");
    setStep(next);
  }

  async function nextFromStep1() {
    setError("");
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(t("recruit.error.email"));
      return;
    }
    if (membre === false) {
      // Adhésion express : vérifier les champs avant de continuer
      const { nom, prenom, telephone } = adhesion.values;
      if (!nom.trim() || !prenom.trim() || !telephone.trim()) {
        setError(t("recruit.error.required"));
        return;
      }
      const failed = adhesion.firstError();
      if (failed) {
        setError(t(failed));
        return;
      }
      go(2);
      return;
    }
    setBusy(true);
    try {
      const isMember = await estMembre(value);
      setMembre(isMember);
      if (isMember) go(2);
    } catch {
      setError(t("recruit.error.send"));
    } finally {
      setBusy(false);
    }
  }

  function nextFromStep2() {
    if (!motivation.trim() || !experience.trim()) {
      setError(t("recruit.error.required"));
      return;
    }
    go(3);
  }

  function nextFromStep3() {
    if (!disponibilite || reponses.some((r) => !r.trim())) {
      setError(t("recruit.error.required"));
      return;
    }
    go(4);
  }

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const result = await postuler({
        annonceId: annonce.id,
        email: email.trim(),
        candidature: {
          motivation: motivation.trim(),
          experience: experience.trim(),
          liens: liens.trim(),
          disponibilite,
          reponses: reponses.map((r) => r.trim()),
        },
        adhesion: membre ? null : { ...adhesion.payload(), interets: [] },
      });
      if (result === "ok") {
        setSent(true);
      } else if (result === "deja_candidat") {
        setError(t("recruit.error.duplicate"));
      } else if (result === "annonce_fermee") {
        setError(t("recruit.error.closed"));
      } else {
        // L'adresse n'est finalement pas membre : revenir à l'adhésion express
        setMembre(false);
        go(1);
      }
    } catch {
      setError(t("recruit.error.send"));
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Card className="border-border shadow-card">
        <CardContent className="p-8 text-center sm:p-10">
          <CheckCircle2 className="mx-auto size-12 text-primary" />
          <h2 className="mt-4 font-display text-2xl font-bold">{t("recruit.done.title")}</h2>
          <p className="mt-3 text-muted-foreground">
            {t("recruit.done.body", { structure: structureNom(annonce.structure, locale) })}
          </p>
          {!membre ? (
            <div className="mt-6 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 p-5">
              <p className="text-sm text-foreground">{t("recruit.done.member")}</p>
              <Button
                asChild
                className="mt-4 w-full bg-[#25D366] font-semibold text-white hover:bg-[#1ebe5b] sm:w-auto"
              >
                <a href={club.whatsappGroup} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-5" />
                  {t("join.done.whatsappCta")}
                </a>
              </Button>
            </div>
          ) : null}
          <Button asChild variant="outline" className="mt-8">
            <Link to="/recrutement">{t("recruit.done.back")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="postuler" className="border-border shadow-card">
      <CardContent className="p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">{t("recruit.form.title")}</h2>
        <p className="mt-4 text-xs text-muted-foreground">
          {t("recruit.form.stepOf", { n: String(step), total: "4" })}
        </p>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {([1, 2, 3, 4] as Step[]).map((n) => (
            <span
              key={n}
              className={cn("h-1.5 flex-1 rounded-full", n <= step ? "bg-primary" : "bg-border")}
            />
          ))}
        </div>
        <h3 className="mt-5 font-display text-lg font-semibold">{t(stepTitles[step])}</h3>

        <div className="mt-4 grid gap-5">
          {step === 1 ? (
            <>
              <Field
                id="email"
                label={t("recruit.form.email")}
                hint={t("recruit.form.emailHint")}
                required
              >
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  placeholder="etudiant@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMembre(null);
                  }}
                />
              </Field>
              {membre === false ? (
                <>
                  <p className="rounded-lg bg-primary/5 p-3 text-sm text-foreground">
                    {t("recruit.form.newMember")}
                  </p>
                  <IdentityFields state={adhesion} />
                  <FormationFields state={adhesion} />
                  <PledgeField state={adhesion} />
                </>
              ) : null}
            </>
          ) : null}

          {step === 2 ? (
            <>
              {membre ? (
                <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="mr-1.5 inline size-4 align-[-3px]" />
                  {t("recruit.form.member")}
                </p>
              ) : null}
              <LongText
                id="motivation"
                label={t("recruit.form.motivation")}
                hint={t("recruit.form.motivationHint")}
                value={motivation}
                onChange={setMotivation}
              />
              <LongText
                id="experience"
                label={t("recruit.form.experience")}
                hint={t("recruit.form.experienceHint")}
                value={experience}
                onChange={setExperience}
              />
              <Field id="liens" label={t("recruit.form.links")}>
                <Input
                  id="liens"
                  maxLength={300}
                  placeholder={t("recruit.form.linksPh")}
                  value={liens}
                  onChange={(e) => setLiens(e.target.value)}
                />
              </Field>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Field id="disponibilite" label={t("recruit.form.availability")} required>
                <Select
                  {...(disponibilite ? { value: disponibilite } : {})}
                  onValueChange={setDisponibilite}
                >
                  <SelectTrigger id="disponibilite" className={selectClass}>
                    <SelectValue placeholder={t("recruit.form.availabilityChoose")} />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {joinForm.availability.map((o) => (
                      <SelectItem key={o.value} value={o.value} className={selectItemClass}>
                        {loc(o.label, locale)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {questions.map((q, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-dashed border-border bg-surface/50 p-4"
                >
                  <LongText
                    id={`q${i}`}
                    label={`${t("recruit.form.question", { n: String(i + 1) })} : ${q}`}
                    value={reponses[i] ?? ""}
                    onChange={(v) => setReponses((r) => r.map((x, j) => (j === i ? v : x)))}
                    rows={3}
                  />
                </div>
              ))}
            </>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 text-sm">
              <p className="text-muted-foreground">{t("recruit.form.review")}</p>
              <Recap label={t("recruit.form.email")}>
                {email.trim()}
                {!membre ? (
                  <span className="block text-xs text-muted-foreground">
                    {[adhesion.values.prenom, adhesion.values.nom].join(" ").trim()} ·{" "}
                    {t("recruit.form.newMemberReview")}
                  </span>
                ) : null}
              </Recap>
              <Recap label={t("recruit.form.motivation")}>{motivation.trim()}</Recap>
              <Recap label={t("recruit.form.experience")}>{experience.trim()}</Recap>
              {liens.trim() ? <Recap label={t("recruit.form.links")}>{liens.trim()}</Recap> : null}
              <Recap label={t("recruit.form.availability")}>{disponibilite}</Recap>
              {questions.map((q, i) => (
                <Recap key={i} label={q}>
                  {reponses[i]}
                </Recap>
              ))}
            </div>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => go((step - 1) as Step)} disabled={busy}>
                <ArrowLeft className="size-4" />
                {t("recruit.form.back")}
              </Button>
            ) : (
              <span />
            )}
            {step === 1 ? (
              <Button onClick={() => void nextFromStep1()} disabled={busy}>
                {busy ? t("recruit.form.checking") : t("recruit.form.next")}
              </Button>
            ) : step === 2 ? (
              <Button onClick={nextFromStep2}>{t("recruit.form.next")}</Button>
            ) : step === 3 ? (
              <Button onClick={nextFromStep3}>{t("recruit.form.next")}</Button>
            ) : (
              <Button onClick={() => void submit()} disabled={busy}>
                {busy ? t("recruit.form.sending") : t("recruit.form.submit")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LongText({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label: string;
  hint?: string | undefined;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const { t } = useLocale();
  return (
    <Field id={id} label={label} hint={hint} required>
      <Textarea
        id={id}
        rows={rows}
        maxLength={TEXT_MAX}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y"
      />
      <span className="-mt-1 text-right text-[11px] text-muted-foreground">
        {t("recruit.form.counter", { n: String(value.length), max: String(TEXT_MAX) })}
      </span>
    </Field>
  );
}

function Recap({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="mt-1 break-words whitespace-pre-line text-foreground">{children}</div>
    </div>
  );
}
