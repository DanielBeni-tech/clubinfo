import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Users, Mail, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { getCandidatures, getMessages } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    candidatures: 0,
    candidaturesNouvelles: 0,
    messagesNonTraites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  async function checkAuth() {
    if (!supabase) {
      await navigate({ to: "/admin/login" });
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await navigate({ to: "/admin/login" });
      return;
    }

    setUser(session.user);
  }

  async function loadStats() {
    const candidatures = await getCandidatures();
    const messagesNonTraites = await getMessages(false);

    setStats({
      candidatures: candidatures.length,
      candidaturesNouvelles: candidatures.filter(c => c.statut === "Nouveau").length,
      messagesNonTraites: messagesNonTraites.length,
    });

    setLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;

    await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Chargement du dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Total Candidatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.candidatures}</div>
              <p className="text-xs text-primary mt-1">{stats.candidaturesNouvelles} nouvelles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Utilisateurs Créés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">—</div>
              <p className="text-xs text-muted-foreground mt-1">Via le dashboard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Messages Non Traités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.messagesNonTraites}</div>
              <p className="text-xs text-primary mt-1">À consulter</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidatures Card */}
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Candidatures</CardTitle>
                  <CardDescription>Valider, refuser ou consulter</CardDescription>
                </div>
                <FileText className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-4">{stats.candidatures}</p>
              <Button asChild className="w-full text-xs">
                <Link to="/admin/candidatures">Gérer les candidatures</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Utilisateurs Card */}
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Utilisateurs</CardTitle>
                  <CardDescription>Créer des comptes, réinitialiser mdp</CardDescription>
                </div>
                <Users className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-4">—</p>
              <Button asChild className="w-full text-xs">
                <Link to="/admin/utilisateurs">Gérer les utilisateurs</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <CardDescription>Consulter les messages de contact</CardDescription>
                </div>
                <Mail className="size-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-4">{stats.messagesNonTraites}</p>
              <Button asChild className="w-full text-xs">
                <Link to="/admin/messages">Consulter les messages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-8 rounded-lg border border-border/50 bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Version 1.0</span> du dashboard du Bureau. Cette interface permet de gérer les candidatures, les utilisateurs, et les messages de contact du Club Informatique SUP'PTIC.
          </p>
        </div>
      </main>
    </div>
  );
}
