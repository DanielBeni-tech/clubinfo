import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/shared";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Rejoindre le Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Formulaire d'adhésion au Club Informatique SUP'PTIC : choisis ton pôle et ton domaine d'intérêt en quelques minutes.",
      },
      { property: "og:title", content: "Rejoindre le Club Informatique SUP'PTIC" },
      { property: "og:description", content: "Adhère au Club en remplissant le formulaire d'adhésion." },
    ],
  }),
  component: JoinPage,
});

const poleOptions = ["Pôle Innovation & Projets", "Pôle Développement", "Pôle Communication", "Je ne sais pas encore"];
const domainOptions = [
  "Intelligence Artificielle",
  "Développement logiciel",
  "Cybersécurité",
  "Réseaux & Télécommunications",
  "Électronique & IoT",
  "Innovation & Recherche",
];

function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");

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
                  Ta candidature a bien été prise en compte. Le Pôle Communication te recontacte par e-mail sous
                  quelques jours pour la suite (entretien d'accueil et affectation au pôle choisi).
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
        lead="L'adhésion est ouverte à tout étudiant régulièrement inscrit à SUP'PTIC, quel que soit son niveau technique. Aucune expérience préalable n'est exigée : seule la motivation compte."
      />

      <section className="section-y">
        <div className="mx-auto max-w-2xl px-4">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <form
                className="grid gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom et prénom</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <Input id="email" type="email" required placeholder="prenom.nom@supptic.cm" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone (WhatsApp)</Label>
                  <Input id="phone" type="tel" required placeholder="+237 6XX XX XX XX" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="filiere">Filière</Label>
                    <Input id="filiere" required placeholder="Ex. Génie logiciel" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="niveau">Niveau d'études</Label>
                    <Input id="niveau" required placeholder="Ex. Licence 2" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pole">Pôle souhaité</Label>
                  <select
                    id="pole"
                    required
                    defaultValue=""
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="" disabled>
                      Choisir un pôle
                    </option>
                    {poleOptions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="domaine">Domaine d'intérêt principal</Label>
                  <select
                    id="domaine"
                    required
                    defaultValue=""
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="" disabled>
                      Choisir un domaine
                    </option>
                    {domainOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="motivation">Motivation (facultatif)</Label>
                  <Textarea id="motivation" rows={4} placeholder="Ce que tu aimerais apprendre ou construire…" />
                </div>
                <Button type="submit" size="lg">
                  Envoyer ma candidature
                </Button>
                <p className="text-xs text-muted-foreground">
                  Les informations transmises servent uniquement au traitement de la candidature par le Pôle
                  Communication.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
