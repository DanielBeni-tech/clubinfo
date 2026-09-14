import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Circle, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { getMessages, updateMessageTraite, deleteMessage } from "@/lib/admin-helpers";
import { AlertCircle } from "lucide-react";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

type Message = any;

function AdminMessages() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTraiteOnly, setShowTraiteOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    checkAuth();
    loadMessages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [messages, showTraiteOnly, searchTerm]);

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

  async function loadMessages() {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...messages];

    // Filtrer par statut traité
    if (showTraiteOnly) {
      filtered = filtered.filter(m => m.traite);
    } else {
      filtered = filtered.filter(m => !m.traite);
    }

    // Filtrer par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        (m.nom?.toLowerCase().includes(term)) ||
        (m.email?.toLowerCase().includes(term)) ||
        (m.sujet?.toLowerCase().includes(term)) ||
        (m.message?.toLowerCase().includes(term))
      );
    }

    setFilteredMessages(filtered);
  }

  async function handleMarkAsTraite(messageId: string, currentStatus: boolean) {
    setActionLoading(true);
    setActionMessage(null);

    const { success, error } = await updateMessageTraite(messageId, !currentStatus);

    if (!success) {
      setActionMessage({ type: "error", text: error || "Erreur lors de la mise à jour" });
      setActionLoading(false);
      return;
    }

    setActionMessage({
      type: "success",
      text: !currentStatus ? "Message marqué comme traité" : "Message marqué comme non-traité",
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadMessages();
    setActionLoading(false);
  }

  async function handleDelete(messageId: string) {
    setActionLoading(true);
    setActionMessage(null);

    const { success, error } = await deleteMessage(messageId);

    if (!success) {
      setActionMessage({ type: "error", text: error || "Erreur lors de la suppression" });
      setActionLoading(false);
      return;
    }

    setActionMessage({
      type: "success",
      text: "Message supprimé",
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadMessages();
    setActionLoading(false);
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const nonTraiteCount = messages.filter(m => !m.traite).length;

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
            <h1 className="font-display text-lg font-bold text-foreground">Gestion des Messages</h1>
          </div>
          {nonTraiteCount > 0 && (
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">
              {nonTraiteCount} non traité{nonTraiteCount > 1 ? "s" : ""}
            </span>
          )}
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
                  placeholder="Nom, email, sujet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Filtre par statut */}
              <div>
                <Label className="text-xs font-semibold mb-2 block">Filtre</Label>
                <div className="flex gap-2">
                  <Button
                    variant={!showTraiteOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTraiteOnly(false)}
                    className="text-xs"
                  >
                    <Circle className="size-3.5 mr-1.5" />
                    Non traités ({nonTraiteCount})
                  </Button>
                  <Button
                    variant={showTraiteOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowTraiteOnly(true)}
                    className="text-xs"
                  >
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    Traités
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        {loading ? (
          <p className="text-muted-foreground text-center py-8">Chargement...</p>
        ) : filteredMessages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {messages.length === 0
              ? "Aucun message pour le moment."
              : showTraiteOnly
              ? "Aucun message traité."
              : "Aucun message non-traité."}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((message) => (
              <Card key={message.id} className={`hover:border-primary/50 transition-colors ${
                message.traite ? "opacity-60" : ""
              }`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-2">
                        {message.traite ? (
                          <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="size-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{message.nom}</p>
                          <p className="text-xs text-muted-foreground">{message.email}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-foreground">{message.sujet}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {message.message}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
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
                            <DialogTitle className="text-base">{message.sujet}</DialogTitle>
                            <DialogDescription className="text-xs">
                              {message.nom} • {message.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="font-semibold text-foreground">Nom</p>
                                <p className="text-muted-foreground">{message.nom}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">Email</p>
                                <p className="text-muted-foreground">{message.email}</p>
                              </div>
                              {message.telephone && (
                                <div>
                                  <p className="font-semibold text-foreground">Téléphone</p>
                                  <p className="text-muted-foreground">{message.telephone}</p>
                                </div>
                              )}
                              {message.organisation && (
                                <div>
                                  <p className="font-semibold text-foreground">Organisation</p>
                                  <p className="text-muted-foreground">{message.organisation}</p>
                                </div>
                              )}
                              {message.categorie && (
                                <div>
                                  <p className="font-semibold text-foreground">Catégorie</p>
                                  <p className="text-muted-foreground">{message.categorie}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Message</p>
                              <p className="text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                            </div>
                            <p className="text-muted-foreground text-xs pt-2 border-t border-border">
                              Reçu le {formatDate(message.created_at)}
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Marquer comme traité */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsTraite(message.id, message.traite)}
                        disabled={actionLoading}
                        className="text-xs"
                      >
                        {message.traite ? (
                          <>
                            <Circle className="size-3.5 mr-1.5" />
                            Non-traité
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-3.5 mr-1.5" />
                            Traité
                          </>
                        )}
                      </Button>

                      {/* Supprimer */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        disabled={actionLoading}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {actionMessage && (
          <div className={`fixed bottom-4 right-4 rounded-lg p-4 text-xs leading-relaxed flex items-start gap-2 max-w-md ${
            actionMessage.type === "success"
              ? "bg-green-500/10 text-green-700 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span>{actionMessage.text}</span>
          </div>
        )}
      </main>
    </div>
  );
}
