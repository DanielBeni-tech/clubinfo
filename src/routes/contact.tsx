import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CheckCircle2, ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/shared";
import { club } from "@/data/club";
import { saveMessage } from "@/lib/supabase";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Contacter le Club Informatique SUP'PTIC : formulaire, adresse e-mail et réseaux sociaux pour partenariats et collaborations.",
      },
      { property: "og:title", content: "Contacter le Club Informatique SUP'PTIC" },
      { property: "og:description", content: "Écris-nous pour un partenariat, une collaboration ou une question." },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const val = (id: string) => String(fd.get(id) ?? "").trim();
    try {
      await saveMessage({
        nom: val("c-name"),
        email: val("c-email"),
        sujet: val("c-subject"),
        message: val("c-message"),
      });
      setSent(true);
    } catch {
      setError("L'envoi a échoué. Vérifie ta connexion et réessaie.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Nous contacter"
        lead="Une question, une proposition de partenariat ou une envie de collaborer sur un projet ? Écris-nous, nous répondons sous quelques jours."
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              {sent ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto size-12 text-primary" />
                  <h2 className="mt-4 font-display text-2xl">Message envoyé</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Merci ! Le Bureau Exécutif a bien reçu ton message et te répondra par e-mail.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Écrire un autre message
                  </Button>
                </div>
              ) : (
                <form className="grid gap-5" onSubmit={onSubmit}>
                  <div className="grid gap-2">
                    <Label htmlFor="c-name">Nom</Label>
                    <Input id="c-name" name="c-name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-email">Adresse e-mail</Label>
                    <Input id="c-email" name="c-email" type="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-subject">Objet</Label>
                    <Input id="c-subject" name="c-subject" required placeholder="Partenariat, question, collaboration…" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="c-message">Message</Label>
                    <Textarea id="c-message" name="c-message" rows={6} required />
                  </div>
                  {error ? <p className="text-sm text-destructive">{error}</p> : null}
                  <Button type="submit" size="lg" disabled={sending}>
                    {sending ? "Envoi en cours…" : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-5">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg">Coordonnées</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 text-primary" />
                    <a href={`mailto:${club.email}`} className="hover:text-primary">
                      {club.email}
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 text-primary" />
                    <span>SUP'PTIC — Yaoundé & Buea</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ExternalLink className="size-4 text-primary" />
                    <a href={club.schoolUrl} target="_blank" rel="noreferrer" className="hover:text-primary">
                      e-supptic.cm
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="font-display text-lg">Réseaux sociaux</h2>
                <div className="mt-4 flex gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href={club.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin className="size-4" /> LinkedIn
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={club.github} target="_blank" rel="noreferrer">
                      <Github className="size-4" /> GitHub
                    </a>
                  </Button>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Nos comptes Instagram et X arriveront prochainement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
