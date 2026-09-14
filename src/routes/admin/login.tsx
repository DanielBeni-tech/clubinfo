import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!supabase) {
      setErrorMessage("Supabase n'est pas configuré. Vérifiez votre fichier .env.");
      setLoading(false);
      return;
    }

    // Vérifier les identifiants du Bureau
    if (email !== "adminclub@supptic.cm" || password !== "Siteclubinf0_") {
      setErrorMessage("Identifiants du Bureau invalides.");
      setLoading(false);
      return;
    }

    // Authentifier via Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || "Erreur d'authentification");
      return;
    }

    // Redirection vers le dashboard
    await navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background to-surface">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center mb-1">
            <Logo />
          </div>
          <p className="text-sm text-muted-foreground">
            Accès réservé au Bureau.
          </p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="border-border shadow-card overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form className="space-y-4" onSubmit={handleLogin}>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-xs font-semibold">
                  Adresse e-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="pl-9 text-sm"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-semibold">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
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
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {errorMessage && (
                <div className="rounded-lg bg-destructive/10 text-destructive border border-destructive/20 p-3 text-xs leading-relaxed flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Bouton de connexion */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-sm font-semibold mt-2"
              >
                {loading ? "Connexion en cours…" : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Accès réservé</span> au Bureau Exécutif du Club Informatique SUP'PTIC uniquement. Accès protégé.
          </p>
        </div>
      </div>
    </div>
  );
}
