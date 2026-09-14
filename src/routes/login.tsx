import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/site/Logo";
import { brandHeadLinks, brandSocialMeta } from "@/lib/brand-head";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — Espace Membre Club Informatique SUP'PTIC" },
      {
        name: "description",
        content:
          "Connectez-vous à votre Espace Membre du Club Informatique SUP'PTIC pour gérer votre profil, suivre vos projets et accéder à vos attestations.",
      },
      { property: "og:title", content: "Connexion — Espace Membre Club Info SUP'PTIC" },
      {
        property: "og:description",
        content: "Accès réservé aux membres et candidats du Club Informatique SUP'PTIC.",
      },
      ...brandSocialMeta,
    ],
    links: [...brandHeadLinks],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  // Password login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI state
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "info" | "success" | "error";
    text: string;
  } | null>(null);

  // Mode state: "login" or "reset"
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    if (!supabase) {
      setStatusMessage({
        type: "error",
        text: "Supabase n'est pas configuré. Vérifiez votre fichier .env.",
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setStatusMessage({
        type: "error",
        text: error.message,
      });
      return;
    }

    await navigate({ to: "/" });
  }

  async function handleResetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMessage(null);

    if (!resetEmail) {
      setStatusMessage({
        type: "error",
        text: "Saisissez votre adresse e-mail.",
      });
      return;
    }

    if (!supabase) {
      setStatusMessage({
        type: "error",
        text: "Supabase n'est pas configuré. Vérifiez votre fichier .env.",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/login`,
    });
    setLoading(false);

    if (error) {
      setStatusMessage({
        type: "error",
        text: error.message,
      });
      return;
    }

    setResetSent(true);
    setStatusMessage({
      type: "success",
      text: "Lien de réinitialisation envoyé à votre adresse e-mail.",
    });
  }

  function handleBackToLogin() {
    setMode("login");
    setResetEmail("");
    setResetSent(false);
    setStatusMessage(null);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header avec logo et titre */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <Logo />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Espace Membre
          </h1>
          <p className="text-sm text-muted-foreground">
            Accédez à vos projets, votre badge membre et vos ressources techniques.
          </p>
        </div>

        {/* Carte de connexion principale */}
        <Card className="border-border shadow-card overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {mode === "login" ? (
              // Mode LOGIN
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-xs font-semibold">
                    Adresse e-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="etudiant@supptic.cm"
                      className="pl-9 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-xs font-semibold">
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      onClick={() => setMode("reset")}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-9 pr-9 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(c) => setRememberMe(!!c)}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-xs font-normal text-muted-foreground cursor-pointer"
                    >
                      Rester connecté
                    </Label>
                  </div>
                </div>

                {statusMessage && (
                  <div
                    className={`rounded-lg p-3 text-xs leading-relaxed ${
                      statusMessage.type === "info"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : statusMessage.type === "error"
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-green-500/10 text-green-700 border border-green-500/20"
                    }`}
                  >
                    {statusMessage.text}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-sm font-semibold mt-2"
                >
                  {loading ? "Connexion en cours…" : "Se connecter"}
                </Button>
              </form>
            ) : (
              // Mode RESET PASSWORD
              <div className="space-y-4">
                {resetSent ? (
                  <div className="text-center space-y-4">
                    <CheckCircle2 className="mx-auto size-12 text-primary" />
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">
                        Lien envoyé !
                      </h2>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Un lien de réinitialisation a été envoyé à <span className="font-semibold text-foreground">{resetEmail}</span>.
                        Vérifiez votre boîte e-mail et suivez les instructions.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleBackToLogin}
                      className="w-full text-xs"
                    >
                      <ArrowLeft className="mr-1.5 size-3.5" /> Retour à la connexion
                    </Button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleResetPassword}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Réinitialiser votre mot de passe</h3>
                        <button
                          type="button"
                          onClick={handleBackToLogin}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Retour
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Saisissez votre adresse e-mail et nous vous enverrons un lien de réinitialisation.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-xs font-semibold">
                        Adresse e-mail
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="etudiant@supptic.cm"
                          className="pl-9 text-sm"
                        />
                      </div>
                    </div>

                    {statusMessage && (
                      <div
                        className={`rounded-lg p-3 text-xs leading-relaxed ${
                          statusMessage.type === "error"
                            ? "bg-destructive/10 text-destructive border border-destructive/20"
                            : "bg-green-500/10 text-green-700 border border-green-500/20"
                        }`}
                      >
                        {statusMessage.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full text-sm font-semibold"
                    >
                      {loading ? "Envoi en cours…" : "Envoyer le lien"}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bloc d'aide & Adhésion */}
        <div className="rounded-xl border border-border/70 bg-surface/50 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground block">
                Nouveau membre ou première visite ?
              </span>
              <p className="leading-relaxed">
                Les identifiants d'accès sont transmis automatiquement aux étudiants dès validation
                officielle de leur dossier d'adhésion par le Bureau Exécutif.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs text-muted-foreground">Pas encore inscrit au Club ?</span>
            <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
              <Link to="/join">
                Déposer une candidature <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
