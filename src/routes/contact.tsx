import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Clock,
  Building2,
  Phone,
  ArrowRight,
  Copy,
  Check,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/shared";
import { club } from "@/data/club";
import { saveMessage } from "@/lib/supabase";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Contacter le Club Informatique SUP'PTIC : formulaire de contact, partenariats académiques et industriels, projets et réseaux sociaux.",
      },
      { property: "og:title", content: "Contacter le Club Informatique SUP'PTIC" },
      {
        property: "og:description",
        content: "Écris-nous pour un partenariat, une collaboration, un projet ou une question.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: ContactPage,
});

const contactCategories = [
  {
    id: "partenariat",
    label: "Partenariat & Sponsoring",
    placeholder: "Proposition de partenariat, sponsoring ou collaboration",
  },
  {
    id: "projet",
    label: "Projet ou Hackathon",
    placeholder: "Proposition de projet technique, hackathon ou concours",
  },
  {
    id: "conference",
    label: "Intervention & Conférence",
    placeholder: "Intervention en atelier, talk technique ou formation",
  },
  {
    id: "renseignement",
    label: "Renseignements généraux",
    placeholder: "Question générale sur les activités du Club",
  },
] as const;

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form states
  const [categorie, setCategorie] = useState<string>("partenariat");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");

  function onSelectCategory(catId: string) {
    setCategorie(catId);
    const cat = contactCategories.find((c) => c.id === catId);
    if (cat && !sujet) {
      setSujet(cat.placeholder);
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(club.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);

    const selectedCatLabel = contactCategories.find((c) => c.id === categorie)?.label ?? categorie;

    try {
      await saveMessage({
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || null,
        organisation: organisation.trim() || null,
        categorie: selectedCatLabel,
        sujet: sujet.trim(),
        message: message.trim(),
      });
      setSent(true);
    } catch {
      setError("L'envoi a échoué. Vérifiez votre connexion et réessayez.");
    } finally {
      setSending(false);
    }
  }

  function resetForm() {
    setSent(false);
    setNom("");
    setEmail("");
    setTelephone("");
    setOrganisation("");
    setSujet("");
    setMessage("");
    setCategorie("partenariat");
  }

  return (
    <div>
      <PageHeader
        title="Nous contacter"
        lead="Entreprises, institutions, communautés tech ou étudiants : écrivez-nous pour un partenariat, un projet, une intervention ou toute autre question."
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* Colonne formulaire */}
          <Card className="border-border shadow-card min-w-0 w-full">
            <CardContent className="p-6 sm:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="mx-auto size-14 text-primary" />
                  <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
                    Message transmis avec succès
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Merci {nom} ! Votre message a bien été transmis au Bureau Exécutif du Club
                    Informatique SUP'PTIC. Une réponse vous sera adressée sous 24h à 48h à l'adresse{" "}
                    <span className="font-semibold text-foreground">{email}</span>.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={resetForm}>
                      Envoyer un nouveau message
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="grid gap-6" onSubmit={onSubmit}>
                  {/* Choix du motif */}
                  <div className="grid gap-2.5">
                    <Label className="text-sm font-semibold text-foreground">
                      Quel est l'objet de votre demande ?{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {contactCategories.map((cat) => {
                        const isSelected = categorie === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => onSelectCategory(cat.id)}
                            className={cn(
                              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                              isSelected
                                ? "border-primary bg-primary text-primary-foreground shadow-xs"
                                : "border-border bg-surface text-muted-foreground hover:border-border/80 hover:text-foreground",
                            )}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coordonnées de base */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-name" className="text-sm font-medium">
                        Nom complet ou interlocuteur <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-name"
                        name="c-name"
                        required
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Ex. Dr. Jean Dupont / Awa Ngo"
                      />
                    </div>

                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-email" className="text-sm font-medium">
                        Adresse e-mail pro ou personnelle{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-email"
                        name="c-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@organisation.com"
                      />
                    </div>
                  </div>

                  {/* Téléphone et Organisation */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-phone" className="text-sm font-medium">
                        Téléphone / WhatsApp{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          (optionnel)
                        </span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="c-phone"
                          name="c-phone"
                          type="tel"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          placeholder="+237 6XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-org" className="text-sm font-medium">
                        Structure / Entreprise / Université{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          (optionnel)
                        </span>
                      </Label>
                      <Input
                        id="c-org"
                        name="c-org"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder="Ex. Huawei, Camtel, Startup, SUP'PTIC…"
                      />
                    </div>
                  </div>

                  {/* Objet du message */}
                  <div className="grid gap-2">
                    <Label htmlFor="c-subject">
                      Objet précis du message <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="c-subject"
                      name="c-subject"
                      required
                      value={sujet}
                      onChange={(e) => setSujet(e.target.value)}
                      placeholder="Ex. Proposition d'atelier cybersécurité pour les étudiants"
                    />
                  </div>

                  {/* Corps du message */}
                  <div className="grid gap-2">
                    <Label htmlFor="c-message">
                      Votre message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="c-message"
                      name="c-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Détaillez votre proposition, vos objectifs, les dates envisagées ou vos questions…"
                      className="resize-y"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium">
                      {error}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={sending}
                    className="w-full text-base font-semibold"
                  >
                    {sending ? "Envoi en cours…" : "Envoyer le message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Colonne latérale d'informations */}
          <div className="grid gap-5 min-w-0">
            {/* Aiguillage pour adhésion étudiant */}
            <Card className="border-primary/30 bg-primary/5 shadow-xs">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-3.5">
                  <div className="grid size-9 shrink-0 place-content-center rounded-lg bg-primary text-primary-foreground">
                    <UserPlus className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      Tu es étudiant(e) à SUP'PTIC ?
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Si tu souhaites adhérer au Club Informatique, utilise directement le
                      formulaire d'adhésion en ligne plutôt que la messagerie générale.
                    </p>
                    <Button asChild size="sm" className="mt-3 text-xs font-semibold">
                      <Link to="/join">
                        Rejoindre le Club <ArrowRight className="ml-1 size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordonnées officielles */}
            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <h3 className="font-display text-base font-semibold text-foreground">
                  Canaux directs
                </h3>

                <ul className="mt-4 space-y-3.5 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs text-muted-foreground">
                        Adresse e-mail officielle
                      </span>
                      <div className="mt-0.5 flex items-center gap-2">
                        <a
                          href={`mailto:${club.email}`}
                          className="truncate font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {club.email}
                        </a>
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          title="Copier l'adresse"
                          className="grid size-6 place-content-center rounded border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                        >
                          {copiedEmail ? (
                            <Check className="size-3 text-primary" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        Siège & localisation
                      </span>
                      <span className="font-medium text-foreground">
                        SUP'PTIC — Campus principal de Yaoundé
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Route de l'Aéroport, Ngoa-Ekellé · Annexe de Buea
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        Délai de traitement
                      </span>
                      <span className="font-medium text-foreground">24h à 48h ouvrées</span>
                      <span className="block text-xs text-muted-foreground">
                        Réponse par le Secrétariat Général ou le Pôle Communication
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        Portail de l'école
                      </span>
                      <a
                        href={club.schoolUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:text-accent transition-colors"
                      >
                        e-supptic.cm
                      </a>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Réseaux professionnels & GitHub */}
            <Card className="border-border shadow-xs">
              <CardContent className="p-6">
                <h3 className="font-display text-base font-semibold text-foreground">
                  Présence en ligne
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Suivez nos projets open-source et l'actualité de nos événements sur nos
                  plateformes officielles :
                </p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={club.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin className="size-4 text-primary" /> Page LinkedIn
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={club.github} target="_blank" rel="noreferrer">
                      <Github className="size-4" /> Organisation GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
