import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { isBureauAdmin } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/espace-bureau/mot-de-passe")({
  head: () => ({
    meta: [
      { title: "Choisir un mot de passe — Espace Bureau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PasswordPage,
});

const MIN_LENGTH = 10;

type State = "checking" | "no-session" | "form" | "done";

function PasswordPage() {
  const [state, setState] = useState<State>("checking");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setState("no-session");
      return;
    }
    // Laisse au client le temps de lire le jeton présent dans le lien
    const timer = setTimeout(async () => {
      const { data } = await supabase!.auth.getSession();
      if (data.session) {
        setEmail(data.session.user.email ?? "");
        setState("form");
      } else {
        setState("no-session");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Le mot de passe doit contenir au moins ${MIN_LENGTH} caractères.`);
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne sont pas identiques.");
      return;
    }
    setSaving(true);
    const { error: err } = await supabase!.auth.updateUser({ password });
    if (err) {
      setSaving(false);
      setError(
        /same|different/i.test(err.message)
          ? "Choisis un mot de passe différent de l'ancien."
          : "Le mot de passe n'a pas pu être enregistré. Le lien a peut-être expiré : demande-en un nouveau.",
      );
      return;
    }
    setHasAccess(await isBureauAdmin());
    setSaving(false);
    setState("done");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-background to-surface px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mb-1 inline-flex justify-center">
            <Logo />
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Choisir mon mot de passe</h1>
          <p className="text-sm text-muted-foreground">Espace Bureau — accès réservé.</p>
        </div>

        <Card className="overflow-hidden border-border shadow-card">
          <CardContent className="p-6 sm:p-8">
            {state === "checking" ? (
              <p className="text-center text-sm text-muted-foreground">Vérification du lien…</p>
            ) : state === "no-session" ? (
              <Notice tone="error" title="Lien invalide ou expiré">
                Ce lien n'est plus valable (il ne fonctionne qu'une fois et pendant une durée
                limitée). Demande un nouveau lien au responsable de la sécurité du Club.
              </Notice>
            ) : state === "done" ? (
              <div className="space-y-5">
                <Notice tone="success" title="Mot de passe enregistré">
                  {hasAccess
                    ? "Ton accès à l'espace Bureau est actif."
                    : "Ton accès à l'espace Bureau n'est pas encore activé. Le responsable de la sécurité te préviendra dès qu'il le sera."}
                </Notice>
                {hasAccess ? (
                  <Button asChild className="w-full">
                    <Link to="/espace-bureau/dashboard">Accéder à l'espace Bureau</Link>
                  </Button>
                ) : null}
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmit}>
                {email ? (
                  <p className="rounded-lg bg-surface px-3 py-2 text-xs text-muted-foreground">
                    Compte : <span className="font-medium text-foreground">{email}</span>
                  </p>
                ) : null}
                <PasswordField
                  id="new-password"
                  label="Nouveau mot de passe"
                  value={password}
                  onChange={setPassword}
                  show={show}
                  onToggle={() => setShow((v) => !v)}
                />
                <PasswordField
                  id="confirm-password"
                  label="Confirmer le mot de passe"
                  value={confirm}
                  onChange={setConfirm}
                  show={show}
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Au moins {MIN_LENGTH} caractères. Utilise un mot de passe qui ne sert sur aucun
                  autre site.
                </p>
                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                ) : null}
                <Button type="submit" disabled={saving} className="w-full font-semibold">
                  {saving ? "Enregistrement…" : "Enregistrer mon mot de passe"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-9 pl-9 text-sm"
        />
        {onToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Notice({
  tone,
  title,
  children,
}: {
  tone: "error" | "success";
  title: string;
  children: React.ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      className={
        tone === "error"
          ? "flex gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive"
          : "flex gap-3 rounded-lg border border-green-600/20 bg-green-600/10 p-4 text-green-800 dark:text-green-300"
      }
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
