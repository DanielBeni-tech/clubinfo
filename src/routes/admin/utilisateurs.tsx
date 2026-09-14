import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, RotateCcw, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/utilisateurs")({
  component: AdminUtilisateurs,
});

type User = any;

function AdminUtilisateurs() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
    loadUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm]);

  async function checkAuth() {
    if (!supabase) {
      await navigate({ to: "/admin/login" });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await navigate({ to: "/admin/login" });
    }
  }

  async function loadUsers() {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        setLoading(false);
        return;
      }

      // Filtrer pour exclure l'admin lui-même
      const filteredUsers = (data?.users || []).filter(u => u.email !== "adminclub@supptic.cm");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Erreur:", error);
    }

    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        (u.email?.toLowerCase().includes(term))
      );
    }

    setFilteredUsers(filtered);
  }

  async function handleResetPassword(user: User) {
    if (!supabase) return;

    setSelectedUser(user);
    setShowResetDialog(true);
    setResetMessage(null);
  }

  async function executeReset() {
    if (!selectedUser || !supabase) return;

    setResetLoading(true);
    setResetMessage(null);

    try {
      // Envoyer le lien de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(selectedUser.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setResetMessage({ type: "error", text: error.message });
        setResetLoading(false);
        return;
      }

      setResetMessage({
        type: "success",
        text: `Lien de réinitialisation envoyé à ${selectedUser.email}`,
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowResetDialog(false);
    } catch (error: any) {
      setResetMessage({ type: "error", text: error.message });
    }

    setResetLoading(false);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/dashboard">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="font-display text-lg font-bold text-foreground">Gestion des Utilisateurs</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info */}
        <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="font-semibold text-foreground">Les utilisateurs sont créés automatiquement</span> lors de la validation d'une candidature.
                </p>
                <p>
                  Vous pouvez envoyer un lien de réinitialisation de mot de passe à tout moment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recherche */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div>
              <Label className="text-xs font-semibold mb-2 block">Recherche</Label>
              <Input
                type="text"
                placeholder="Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des utilisateurs */}
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Chargement...</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {users.length === 0
              ? "Aucun utilisateur créé pour le moment."
              : "Aucun utilisateur ne correspond à votre recherche."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <p className="font-semibold text-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Créé le {formatDate(user.created_at)}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.confirmed_at
                            ? "bg-green-500/10 text-green-700"
                            : "bg-yellow-500/10 text-yellow-700"
                        }`}>
                          {user.confirmed_at ? "Confirmé" : "En attente"}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResetPassword(user)}
                      className="text-xs"
                    >
                      <RotateCcw className="size-3.5 mr-1.5" />
                      Réinitialiser mdp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog pour réinitialiser */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Réinitialiser le mot de passe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Un lien de réinitialisation sera envoyé à :
            </p>
            <p className="font-semibold text-foreground text-sm">{selectedUser?.email}</p>

            {resetMessage && (
              <div
                className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                  resetMessage.type === "success"
                    ? "bg-green-500/10 text-green-700 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{resetMessage.text}</span>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetDialog(false)}
                disabled={resetLoading}
                className="text-xs"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={executeReset}
                disabled={resetLoading}
                className="text-xs"
              >
                {resetLoading ? "En cours…" : "Envoyer le lien"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
