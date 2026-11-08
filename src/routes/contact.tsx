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
import { t as translate, useLocale } from "@/lib/i18n";
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

const contactCategoryIds = ["partenariat", "projet", "conference", "renseignement"] as const;
type ContactCategory = (typeof contactCategoryIds)[number];

function ContactPage() {
  const { t } = useLocale();
  const contactCategories = contactCategoryIds.map((id) => ({
    id,
    label: t(`contact.cat.${id}`),
    placeholder: t(`contact.ph.${id}`),
    hint: id === "partenariat" ? t("contact.hint.partenariat") : "",
  }));
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [categorie, setCategorie] = useState<ContactCategory | "">("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");

  const selected = contactCategories.find((c) => c.id === categorie);

  function handleCopyEmail() {
    navigator.clipboard
      ?.writeText(club.email)
      .then(() => {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      })
      .catch(() => {
        // Presse-papiers indisponible (http, permissions) : le lien mailto reste utilisable.
      });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!categorie) {
      setError(t("contact.error.category"));
      return;
    }

    setSending(true);
    try {
      await saveMessage({
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone.trim() || null,
        organisation: organisation.trim() || null,
        // Libellé français stable, quelle que soit la langue d'affichage.
        categorie: translate(`contact.cat.${categorie}`, "fr"),
        sujet: sujet.trim(),
        message: message.trim(),
      });
      setSent(true);
    } catch {
      setError(t("contact.error"));
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
    setCategorie("");
  }

  return (
    <div>
      <PageHeader title={t("contact.title")} lead={t("contact.lead")} />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_350px]">
          {/* Colonne formulaire */}
          <Card className="border-border shadow-card min-w-0 w-full">
            <CardContent className="p-6 sm:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <CheckCircle2 className="mx-auto size-14 text-primary" />
                  <h2 className="mt-4 font-display text-2xl font-bold text-foreground">
                    {t("contact.sent.title")}
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t("contact.sent.body", { name: nom, email })}
                  </p>
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={resetForm}>
                      {t("contact.sent.again")}
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="grid gap-6" onSubmit={onSubmit}>
                  {/* Choix du motif */}
                  <div className="grid gap-2.5">
                    <Label id="c-category" className="text-sm font-semibold text-foreground">
                      {t("contact.object")} <span className="text-destructive">*</span>
                    </Label>
                    <div
                      className="flex flex-wrap gap-2"
                      role="radiogroup"
                      aria-labelledby="c-category"
                    >
                      {contactCategories.map((cat) => {
                        const isSelected = categorie === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setCategorie(cat.id)}
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
                    {selected?.hint ? (
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {selected.hint}
                      </p>
                    ) : null}
                  </div>

                  {/* Coordonnées de base */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-name" className="text-sm font-medium">
                        {t("contact.name")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-name"
                        name="c-name"
                        required
                        autoComplete="name"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder={t("contact.ph.name")}
                      />
                    </div>

                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-email" className="text-sm font-medium">
                        {t("contact.email")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-email"
                        name="c-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("contact.ph.email")}
                      />
                    </div>
                  </div>

                  {/* Téléphone et Organisation */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-phone" className="text-sm font-medium">
                        {t("contact.phone")}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          {t("contact.optional")}
                        </span>
                      </Label>
                      <Input
                        id="c-phone"
                        name="c-phone"
                        type="tel"
                        autoComplete="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="+237 6XX XX XX XX"
                      />
                    </div>

                    <div className="grid gap-2 min-w-0">
                      <Label htmlFor="c-org" className="text-sm font-medium">
                        {t("contact.org")}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          {t("contact.optional")}
                        </span>
                      </Label>
                      <Input
                        id="c-org"
                        name="c-org"
                        value={organisation}
                        onChange={(e) => setOrganisation(e.target.value)}
                        placeholder={t("contact.ph.org")}
                      />
                    </div>
                  </div>

                  {/* Objet du message */}
                  <div className="grid gap-2">
                    <Label htmlFor="c-subject">
                      {t("contact.subject")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="c-subject"
                      name="c-subject"
                      required
                      value={sujet}
                      onChange={(e) => setSujet(e.target.value)}
                      placeholder={selected?.placeholder ?? t("contact.ph.subject")}
                    />
                  </div>

                  {/* Corps du message */}
                  <div className="grid gap-2">
                    <Label htmlFor="c-message">
                      {t("contact.message")} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="c-message"
                      name="c-message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t("contact.ph.message")}
                      className="resize-y"
                    />
                  </div>

                  {error ? (
                    <div
                      role="alert"
                      className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive font-medium"
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
                    {sending ? t("contact.sending") : t("contact.send")}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    {t("contact.privacy", { email: club.email })}
                  </p>
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
                      {t("contact.student.title")}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {t("contact.student.lead")}
                    </p>
                    <Button asChild size="sm" className="mt-3 text-xs font-semibold">
                      <Link to="/join">
                        {t("contact.student.cta")} <ArrowRight className="ml-1 size-3.5" />
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
                  {t("contact.channels")}
                </h3>

                <ul className="mt-4 space-y-3.5 text-sm">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs text-muted-foreground">
                        {t("contact.officialEmail")}
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
                          title={t("contact.copy")}
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
                        {t("contact.location")}
                      </span>
                      <span className="font-medium text-foreground">
                        {t("contact.locationValue")}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {t("contact.locationDetail")}
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        {t("contact.delay")}
                      </span>
                      <span className="font-medium text-foreground">{t("contact.delayValue")}</span>
                      <span className="block text-xs text-muted-foreground">
                        {t("contact.delayDetail")}
                      </span>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <span className="block text-xs text-muted-foreground">
                        {t("contact.school")}
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
                  {t("contact.online")}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{t("contact.onlineLead")}</p>

                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={club.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin className="size-4 text-primary" /> {t("contact.linkedin")}
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={club.github} target="_blank" rel="noreferrer">
                      <Github className="size-4" /> {t("contact.github")}
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
