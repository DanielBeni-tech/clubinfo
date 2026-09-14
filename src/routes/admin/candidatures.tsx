import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, Check, X, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { getCandidatures, updateCandidatureStatus, createUserFromCandidature } from "@/lib/admin-helpers";

export const Route = createFileRoute("/admin/candidatures")({
  component: AdminCandidatures,
});

type Candidature = any;

function AdminCandidatures() {
  const navigate = useNavigate();

  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>(""); // "" pour tous, "Nouveau", etc.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidature, setSelectedCandidature] = useState<Candidature | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<"valider" | "refuser" | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
    loadCandidatures();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidatures, filter, searchTerm]);

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

  async function loadCandidatures() {
    setLoading(true);
    const data = await getCandidatures();
    setCandidatures(data);
    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...candidatures];

    // Filtrer par statut
    if (filter) {
      filtered = filtered.filter(c => c.statut === filter);
    }

    // Filtrer par nom/email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        (c.nom?.toLowerCase().includes(term)) ||
        (c.prenom?.toLowerCase().includes(term)) ||
        (c.email?.toLowerCase().includes(term))
      );
    }

    setFilteredCandidatures(filtered);
  }

  async function handleValidate(candidature: Candidature) {
    setSelectedCandidature(candidature);
    setActionType("valider");
    setActionMessage(null);
    setNewPassword("");
    setShowActionDialog(true);
  }

  async function handleRefuse(candidature: Candidature) {
    setSelectedCandidature(candidature);
    setActionType("refuser");
    setActionMessage(null);
    setShowActionDialog(true);
  }

  async function executeAction() {
    if (!selectedCandidature) return;

    setActionLoading(true);
    setActionMessage(null);

    try {
      if (actionType === "valider") {
        if (!newPassword) {
          setActionMessage({ type: "error", text: "Veuillez saisir un mot de passe" });
          setActionLoading(false);
          return;
        }

        // Créer l'utilisateur Supabase
        const { userId, error: createError } = await createUserFromCandidature(
          selectedCandidature.email,
          newPassword
        );

        if (createError) {
          setActionMessage({ type: "error", text: createError });
          setActionLoading(false);
          return;
        }

        // Mettre à jour le statut de la candidature
        const { success, error: statusError } = await updateCandidatureStatus(
          selectedCandidature.id,
          "Accepté"
        );

        if (!success) {
          setActionMessage({ type: "error", text: statusError || "Erreur lors de la mise à jour" });
          setActionLoading(false);
          return;
        }

        setActionMessage({
          type: "success",
          text: `Candidat accepté ! Compte créé : ${selectedCandidature.email}`,
        });

        // Recharger les candidatures
        await new Promise(resolve => setTimeout(resolve, 1500));
        await loadCandidatures();
        setShowActionDialog(false);
      } else if (actionType === "refuser") {
        const { success, error: statusError } = await updateCandidatureStatus(
          selectedCandidature.id,
          "Refusé"
        );

        if (!success) {
          setActionMessage({ type: "error", text: statusError || "Erreur lors de la mise à jour" });
          setActionLoading(false);
          return;
        }

        setActionMessage({
          type: "success",
          text: "Candidature refusée",
        });

        // Recharger les candidatures
        await new Promise(resolve => setTimeout(resolve, 1500));
        await loadCandidatures();
        setShowActionDialog(false);
      }
    } catch (error: any) {
      setActionMessage({ type: "error", text: error.message });
    }

    setActionLoading(false);
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
            <h1 className="font-display text-lg font-bold text-foreground">Gestion des Candidatures</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Recherche */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">Recherche</Label>
                <Input
                  type="text"
                  placeholder="Nom, prénom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Filtre par statut */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">Filtrer par statut</Label>
                <div className="flex gap-2 flex-wrap">
                  {["", "Nouveau", "Accepté", "Refusé"].map((status) => (
                    <Button
                      key={status}
                      variant={filter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(status)}
                      className="text-xs"
                    >
                      {status || "Tous"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des candidatures */}
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Chargement...</p>
        ) : filteredCandidatures.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Aucune candidature</p>
        ) : (
          <div className="space-y-3">
            {filteredCandidatures.map((candidature) => (
              <Card key={candidature.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {candidature.prenom} {candidature.nom}
                      </p>
                      <p className="text-xs text-muted-foreground">{candidature.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {candidature.campus} • {candidature.cycle}
                      </p>
                      <div className="pt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          candidature.statut === "Accepté"
                            ? "bg-green-500/10 text-green-700"
                            : candidature.statut === "Refusé"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-blue-500/10 text-blue-700"
                        }`}>
                          {candidature.statut}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Détails */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <Eye className="size-3.5 mr-1.5" />
                            Détails
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-base">
                              {candidature.prenom} {candidature.nom}
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                              {candidature.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="font-semibold text-foreground">Campus</p>
                                <p className="text-muted-foreground">{candidature.campus}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Cycle</p>
                                <p className="text-muted-foreground">{candidature.cycle}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Régime</p>
                                <p className="text-muted-foreground">{candidature.regime}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Niveau</p>
                                <p className="text-muted-foreground">{candidature.niveau}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Option</p>
                                <p className="text-muted-foreground">{candidature.option}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Domaine</p>
                                <p className="text-muted-foreground">{candidature.domaine}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Pôle</p>
                                <p className="text-muted-foreground">{candidature.pole}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Téléphone</p>
                                <p className="text-muted-foreground">{candidature.telephone}</p>
                              </div>
                            </div>
                            {candidature.motivation && (
                              <div>
                                <p className="font-semibold text-foreground mb-1">Motivation</p>
                                <p className="text-muted-foreground">{candidature.motivation}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Actions */}
                      {candidature.statut === "Nouveau" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleValidate(candidature)}
                          >
                            <Check className="size-3.5 mr-1.5" />
                            Accepter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleRefuse(candidature)}
                          >
                            <X className="size-3.5 mr-1.5" />
                            Refuser
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog pour valider/refuser */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {actionType === "valider" ? "Accepter la candidature" : "Refuser la candidature"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              {selectedCandidature?.prenom} {selectedCandidature?.nom} ({selectedCandidature?.email})
            </p>

            {actionType === "valider" && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Mot de passe temporaire
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Génère un mot de passe sécurisé"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Ce mot de passe sera envoyé au candidat par email.
                </p>
              </div>
            )}

            {actionMessage && (
              <div
                className={`rounded-lg p-3 text-xs leading-relaxed flex items-start gap-2 ${
                  actionMessage.type === "success"
                    ? "bg-green-500/10 text-green-700 border border-green-500/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{actionMessage.text}</span>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowActionDialog(false)}
                disabled={actionLoading}
                className="text-xs"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={executeAction}
                disabled={actionLoading}
                className="text-xs"
              >
                {actionLoading
                  ? "En cours…"
                  : actionType === "valider"
                  ? "Accepter et créer le compte"
                  : "Refuser"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
