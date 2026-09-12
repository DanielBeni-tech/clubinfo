import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/shared";
import { club, joinForm, school } from "@/data/club";
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
      { property: "og:description", content: "Adhère au Club en renseignant ta formation SUP'PTIC." },
    ],
  }),
  component: JoinPage,
});

const fieldClass =
  "h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [campus, setCampus] = useState<(typeof joinForm.campuses)[number] | "">("");
  const [cycle, setCycle] = useState("");

  const cycles = campus ? joinForm.cyclesByCampus[campus] : [];
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
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <PageHeader title="Candidature envoyée" lead="Merci pour ton intérêt pour le Club Informatique SUP'PTIC." />
        <section className="section-y">
          <div className="mx-auto max-w-2xl px-4">
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="mx-auto size-12 text-primary" />
                <h2 className="mt-4 font-display text-2xl">C'est enregistré{name ? `, ${name}` : ""} !</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Ta candidature a bien été prise en compte
                  {cycleLabel ? ` (${cycleLabel}${campus ? ` · ${campus}` : ""})` : ""}. Le Pôle Communication te
                  recontacte à {club.email} sous quelques jours.
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>
                  Envoyer une autre candidature
                </Button>
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
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_20rem]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <form className="grid gap-5" onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom et prénom</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <Input id="email" type="email" required placeholder="prenom.nom@gmail.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone (WhatsApp)</Label>
                    <Input id="phone" type="tel" required placeholder="+237 6XX XX XX XX" />
                  </div>
                </div>

                <fieldset className="grid gap-4 rounded-lg border border-border p-4">
                  <legend className="px-1 font-display text-sm text-primary">Ta formation à SUP'PTIC</legend>
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="campus">Campus</Label>
                      <select
                        id="campus"
                        required
                        value={campus}
                        onChange={(e) => onCampusChange(e.target.value as typeof campus)}
                        className={fieldClass}
                      >
                        <option value="" disabled>
                          Yaoundé ou Buea
                        </option>
                        {joinForm.campuses.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="cycle">Cycle / diplôme</Label>
                      <select
                        id="cycle"
                        required
                        value={cycle}
                        disabled={!campus}
                        onChange={(e) => setCycle(e.target.value)}
                        className={cn(fieldClass, !campus && "opacity-60")}
                      >
                        <option value="" disabled>
                          {campus ? "Choisir le cycle" : "D'abord le campus"}
                        </option>
                        {cycles.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="regime">Régime</Label>
                      <select key={`${cycle}-regime`} id="regime" required disabled={!cycle} defaultValue="" className={cn(fieldClass, !cycle && "opacity-60")}>
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
                      <Label htmlFor="niveau">Niveau</Label>
                      <select key={`${cycle}-niveau`} id="niveau" required disabled={!cycle} defaultValue="" className={cn(fieldClass, !cycle && "opacity-60")}>
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
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="option">Option / spécialité</Label>
                    <select key={`${cycle}-option`} id="option" required disabled={!cycle} defaultValue="" className={cn(fieldClass, !cycle && "opacity-60")}>
                      <option value="" disabled>
                        {cycle ? "IR, RT, RC, Management…" : "D'abord le cycle"}
                      </option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>

                <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pole">Pôle souhaité au Club</Label>
                    <select id="pole" required defaultValue="" className={fieldClass}>
                      <option value="" disabled>
                        Choisir un pôle
                      </option>
                      {joinForm.poles.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="domaine">Domaine d'intérêt principal</Label>
                    <select id="domaine" required defaultValue="" className={fieldClass}>
                      <option value="" disabled>
                        Choisir un domaine
                      </option>
                      {joinForm.domains.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="skills">Compétences déjà acquises (facultatif)</Label>
                  <Input id="skills" placeholder="Ex. Python, réseaux, Cisco, montage…" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="motivation">Motivation (facultatif)</Label>
                  <Textarea
                    id="motivation"
                    rows={4}
                    placeholder="Ce que tu aimerais apprendre ou construire avec le Club…"
                  />
                </div>
                <Button type="submit" size="lg">
                  Envoyer ma candidature
                </Button>
                <p className="text-xs text-muted-foreground">
                  Les informations servent uniquement au traitement de la candidature par le Pôle Communication (
                  <a href={`mailto:${club.email}`} className="underline underline-offset-2">
                    {club.email}
                  </a>
                  ).
                </p>
              </form>
            </CardContent>
          </Card>

          <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-primary">
                  <GraduationCap className="size-5" />
                  <h2 className="font-display text-lg">{school.name}</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{school.fullName}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>2 campus : {school.campuses.join(" & ")}</span>
                  </li>
                  <li>2 cursus : {school.cursus.join(" & ")}</li>
                  <li>Yaoundé : ITT, IPT, Masters</li>
                  <li>Buea : TT, CPT, ATT, AEPT</li>
                </ul>
                <a
                  href={school.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
                >
                  Voir les formations sur {school.url.replace("https://", "")}
                  <ExternalLink className="size-3.5" />
                </a>
                <p className="mt-3 text-xs text-muted-foreground">
                  Contact école : {club.schoolEmail} · {club.schoolPhone}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-sm">Options officielles</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  ITT : IR, RT, RC — IPT : Management, Comptabilité & Finances, Logistique & Transport, Commerce —
                  Master IT : SERES, SRM. Source : e-supptic.cm.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
