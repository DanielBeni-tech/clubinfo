import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
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
import { PageHeader } from "@/components/site/shared";
import { club, joinForm, school } from "@/data/club";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { saveCandidature } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Rejoindre le Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Formulaire d'adhésion au Club Informatique SUP'PTIC, calé sur les cycles et options officiels de l'école (e-supptic.cm).",
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
  "h-10 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Form state
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
  const [experience, setExperience] = useState("Débutant");
  const [pole, setPole] = useState("Pôle Développement");
  const [motivation, setMotivation] = useState("");
  const [engagement, setEngagement] = useState(false);

  const cycles = useMemo(() => (campus ? joinForm.cyclesByCampus[campus] : []), [campus]);
  const regimes = cycle ? (joinForm.regimesByCycle[cycle] ?? []) : [];
  const options = cycle ? (joinForm.optionsByCycle[cycle] ?? []) : [];
  const levels = cycle ? (joinForm.levelsByCycle[cycle] ?? []) : [];

  const cycleLabel = useMemo(
    () => cycles.find((c) => c.value === cycle)?.label ?? "",
    [cycles, cycle],
  );

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
      setError(
        "Veuillez confirmer votre engagement à respecter la Charte et le Règlement intérieur du Club.",
      );
      return;
    }

    if (!domaine) {
      setError("Veuillez sélectionner votre centre d'intérêt principal.");
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
      setError("L'envoi a échoué. Vérifie ta connexion et réessaie.");
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div>
        <PageHeader
          title="Candidature envoyée"
          lead="Merci pour ton intérêt pour le Club Informatique SUP'PTIC."
        />
        <section className="section-y">
          <div className="mx-auto max-w-2xl px-4">
            <Card className="border-border shadow-card">
              <CardContent className="p-8 text-center sm:p-10">
                <CheckCircle2 className="mx-auto size-12 text-primary" />
                <h2 className="mt-4 font-display text-2xl font-bold">
                  C'est bien enregistré{prenom ? `, ${prenom}` : nom ? `, ${nom}` : ""} !
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Ta demande d'adhésion a été transmise au Bureau Exécutif.
                  {cycleLabel ? ` (${cycleLabel}${campus ? ` · ${campus}` : ""})` : ""}
                </p>
                <div className="mt-6 rounded-lg bg-surface p-4 text-left text-sm text-foreground">
                  <p className="font-semibold text-primary">Prochaines étapes :</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                    <li>
                      Le Pôle Communication te contactera via WhatsApp ({telephone}) pour t'intégrer
                      à la communauté.
                    </li>
                    <li>
                      Tu seras invité(e) aux prochaines sessions d'accueil et ateliers pratiques.
                    </li>
                  </ul>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button asChild variant="outline">
                    <Link to="/events">Découvrir les prochains événements</Link>
                  </Button>
                  <Button variant="ghost" onClick={() => setSubmitted(false)}>
                    Soumettre une autre demande
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
      <PageHeader
        title="Rejoindre le Club"
        lead="Ouvert à tout étudiant régulièrement inscrit à SUP'PTIC — Yaoundé ou Buea, ingénierie ou management, classique, alternance ou master. Aucune expérience préalable n'est exigée."
      />

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-4">
          <Card className="border-border shadow-card">
            <CardContent className="p-6 sm:p-10">
              <form className="grid gap-8" onSubmit={onSubmit}>
                {/* 1. Coordonnées personnelles */}
                <div>
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>
                    Identité & Coordonnées
                  </h3>
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="nom">
                          Nom de famille <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="nom"
                          name="nom"
                          required
                          placeholder="Ex. Kouamou"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="prenom">
                          Prénom(s) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="prenom"
                          name="prenom"
                          required
                          placeholder="Ex. Cédric"
                          value={prenom}
                          onChange={(e) => setPrenom(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="email">
                          Adresse e-mail <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="etudiant@supptic.cm ou gmail"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="telephone">
                          Téléphone (WhatsApp) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          required
                          placeholder="+237 6XX XX XX XX"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cursus académique SUP'PTIC */}
                <div>
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      2
                    </span>
                    Cursus à SUP'PTIC
                  </h3>
                  <div className="mt-4 grid gap-4 rounded-xl border border-border/80 bg-surface/50 p-4 sm:p-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="campus">
                          Campus <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="campus"
                          name="campus"
                          required
                          value={campus}
                          onChange={(e) => onCampusChange(e.target.value as typeof campus)}
                          className={fieldClass}
                        >
                          <option value="" disabled>
                            Choisir le campus
                          </option>
                          {joinForm.campuses.map((c) => (
                            <option key={c} value={c}>
                              Campus de {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="cycle">
                          Cycle / Diplôme préparé <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="cycle"
                          name="cycle"
                          required
                          value={cycle}
                          disabled={!campus}
                          onChange={(e) => onCycleChange(e.target.value)}
                          className={cn(fieldClass, !campus && "opacity-60")}
                        >
                          <option value="" disabled>
                            {campus ? "Sélectionner le cycle" : "Sélectionne d'abord le campus"}
                          </option>
                          {cycles.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="regime">
                          Régime d'études <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="regime"
                          name="regime"
                          required
                          disabled={!cycle}
                          value={regime}
                          onChange={(e) => setRegime(e.target.value)}
                          className={cn(fieldClass, !cycle && "opacity-60")}
                        >
                          <option value="" disabled>
                            {cycle ? "Classique, alternance…" : "D'abord le cycle"}
                          </option>
                          {regimes.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="niveau">
                          Niveau actuel <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="niveau"
                          name="niveau"
                          required
                          disabled={!cycle}
                          value={niveau}
                          onChange={(e) => setNiveau(e.target.value)}
                          className={cn(fieldClass, !cycle && "opacity-60")}
                        >
                          <option value="" disabled>
                            {cycle ? "Année en cours" : "D'abord le cycle"}
                          </option>
                          {levels.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="option">
                          Option / Spécialité <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="option"
                          name="option"
                          required
                          disabled={!cycle}
                          value={option}
                          onChange={(e) => setOption(e.target.value)}
                          className={cn(fieldClass, !cycle && "opacity-60")}
                        >
                          <option value="" disabled>
                            {cycle ? "IR, RT, RC, MGT…" : "D'abord le cycle"}
                          </option>
                          {options.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Centre d'intérêt & Profil */}
                <div>
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </span>
                    Centres d'intérêt & Expérience
                  </h3>

                  <div className="mt-4 grid gap-5">
                    {/* Centre d'intérêt principal */}
                    <div className="grid gap-2.5">
                      <Label htmlFor="domaine">
                        Centre d'intérêt principal <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Choisis la thématique que tu souhaites explorer ou développer en priorité au
                        sein du club :
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {joinForm.domains.map((d) => {
                          const isSelected = domaine === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setDomaine(d)}
                              className={cn(
                                "flex items-center justify-between rounded-lg border p-3 text-left text-sm transition-all",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary font-medium shadow-xs"
                                  : "border-border bg-card text-foreground hover:border-border/80 hover:bg-surface",
                              )}
                            >
                              <span>{d}</span>
                              <div
                                className={cn(
                                  "grid size-4 shrink-0 place-content-center rounded-full border",
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/40",
                                )}
                              >
                                {isSelected ? (
                                  <div className="size-1.5 rounded-full bg-white" />
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {/* Sélecteur fallback accessible */}
                      <select
                        id="domaine"
                        name="domaine"
                        required
                        value={domaine}
                        onChange={(e) => setDomaine(e.target.value)}
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <option value="">Choisir un domaine</option>
                        {joinForm.domains.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Niveau d'expérience */}
                    <div className="grid gap-2.5">
                      <Label>
                        Niveau d'expérience actuel <span className="text-destructive">*</span>
                      </Label>
                      <div className="grid gap-2.5 sm:grid-cols-3">
                        {joinForm.experienceLevels.map((lvl) => {
                          const isSelected = experience === lvl.value;
                          return (
                            <button
                              key={lvl.value}
                              type="button"
                              onClick={() => setExperience(lvl.value)}
                              className={cn(
                                "flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                                  : "border-border bg-card hover:bg-surface",
                              )}
                            >
                              <div>
                                <span
                                  className={cn(
                                    "block text-sm font-semibold",
                                    isSelected ? "text-primary" : "text-foreground",
                                  )}
                                >
                                  {lvl.label}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {lvl.desc}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pôle souhaité */}
                    <div className="grid gap-2.5">
                      <Label>
                        Pôle d'affectation souhaité <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Les 3 pôles opérationnels du Club (ou l'option découverte pour débuter
                        librement) :
                      </p>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {joinForm.poles.map((p) => {
                          const isSelected = pole === p.value;
                          return (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() => setPole(p.value)}
                              className={cn(
                                "flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                                  : "border-border bg-card hover:bg-surface",
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span
                                  className={cn(
                                    "text-sm font-semibold",
                                    isSelected ? "text-primary" : "text-foreground",
                                  )}
                                >
                                  {p.label}
                                </span>
                                <div
                                  className={cn(
                                    "grid size-4 shrink-0 place-content-center rounded-full border mt-0.5",
                                    isSelected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground/40",
                                  )}
                                >
                                  {isSelected ? (
                                    <div className="size-1.5 rounded-full bg-white" />
                                  ) : null}
                                </div>
                              </div>
                              <span className="mt-1.5 text-xs text-muted-foreground">{p.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Motivation & Projets */}
                <div>
                  <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
                    <span className="grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      4
                    </span>
                    Motivation & Ambitions (facultatif)
                  </h3>
                  <div className="mt-4 grid gap-2">
                    <Label htmlFor="motivation">
                      Qu'aimerais-tu apprendre, construire ou apporter au Club ?
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      rows={3}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Ex. Participer aux hackathons, apprendre l'IA avec SUP'ONE, développer un projet d'école, progresser en cybersécurité…"
                      className="resize-y"
                    />
                  </div>
                </div>

                {/* 5. Engagement officiel (Charte & Règlement intérieur) */}
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
                        Engagement et respect des textes du Club Informatique{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Je confirme être régulièrement inscrit(e) à SUP'PTIC. J'ai pris connaissance
                        de la{" "}
                        <Link
                          to="/charte"
                          target="_blank"
                          className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                        >
                          Charte du Club
                        </Link>{" "}
                        et du{" "}
                        <Link
                          to="/reglement"
                          target="_blank"
                          className="font-medium text-primary underline underline-offset-2 hover:text-accent"
                        >
                          Règlement Intérieur
                        </Link>
                        , et je m'engage à en respecter les principes de travail en équipe,
                        d'assiduité et de déontologie (Art. 2 du Règlement).
                      </p>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
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
                    {sending ? "Transmission en cours…" : "Soumettre mon adhésion"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Les informations recueillies sont strictement confidentielles et réservées au
                    Bureau Exécutif pour le traitement de l'adhésion ({club.email}).
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Section d'information sur les campus & formations — déplacée élégamment sous le formulaire */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 text-primary">
                  <GraduationCap className="size-5" />
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Formations {school.name}
                  </h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {school.fullName}
                </p>
                <ul className="mt-3.5 space-y-1.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <MapPin className="size-3.5 shrink-0 text-primary" />
                    <span>Campus : Yaoundé & Buea</span>
                  </li>
                  <li>• Yaoundé : ITT, IPT, Masters (SERES, SRM, MAPT)</li>
                  <li>• Buea : TT, CPT, ATT, AEPT</li>
                </ul>
                <a
                  href={school.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-accent"
                >
                  Portail académique ({school.url.replace("https://", "")})
                  <ExternalLink className="size-3" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <div className="flex items-center gap-2.5 text-primary">
                  <BookOpen className="size-5" />
                  <h3 className="font-display text-base font-semibold text-foreground">
                    Documents officiels
                  </h3>
                </div>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Consulte les documents statutaires régissant le fonctionnement de notre
                  organisation étudiante :
                </p>
                <div className="mt-3.5 flex flex-col gap-2">
                  <Link
                    to="/charte"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5 text-primary" />
                      Charte du Club Informatique
                    </span>
                    <span className="text-[10px] text-muted-foreground">Lire →</span>
                  </Link>
                  <Link
                    to="/reglement"
                    className="flex items-center justify-between rounded-lg border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface hover:text-primary"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="size-3.5 text-primary" />
                      Règlement Intérieur
                    </span>
                    <span className="text-[10px] text-muted-foreground">Lire →</span>
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
