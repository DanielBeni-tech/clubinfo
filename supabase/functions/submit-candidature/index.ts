// supabase/functions/submit-candidature/index.ts
// Edge Function — porte d'entrée sécurisée pour les candidatures
// Deno + Supabase (service_role)
// Variables d'environnement requises :
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Optionnelles (email) : RESEND_API_KEY, EMAIL_FROM, CANDIDATURE_NOTIFICATION_EMAIL

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_PAYLOAD_BYTES = 20 * 1024; // 20KB

// Valeurs autorisées — miroir de src/data/club.ts:joinForm
const CAMPUS_VALUES = ["Yaoundé", "Buea"] as const;
const DOMAINE_VALUES = [
  "Intelligence Artificielle",
  "Développement logiciel",
  "Cybersécurité",
  "Réseaux & Télécommunications",
  "Électronique & IoT",
  "Radiocommunication",
  "Management des télécoms",
  "Innovation & Recherche",
] as const;
const POLE_VALUES = [
  "Pôle Innovation & Projets",
  "Pôle Développement",
  "Pôle Communication",
  "Découverte & Ateliers",
] as const;
const EXPERIENCE_VALUES = ["Débutant", "Intermédiaire", "Avancé"] as const;
const CYCLE_VALUES = ["ITT", "IPT", "MIT", "MAPT", "TT", "CPT", "ATT", "AEPT"] as const;

const CYCLES_BY_CAMPUS: Record<string, string[]> = {
  Yaoundé: ["ITT", "IPT", "MIT", "MAPT"],
  Buea: ["TT", "CPT", "ATT", "AEPT"],
};
const REGIMES_BY_CYCLE: Record<string, string[]> = {
  ITT: ["Classique", "Alternance"],
  IPT: ["Classique", "Alternance"],
  MIT: ["Concours", "Admission directe"],
  MAPT: ["Concours", "Admission directe"],
  TT: ["Classique"],
  CPT: ["Classique"],
  ATT: ["Classique"],
  AEPT: ["Classique"],
};
const OPTIONS_BY_CYCLE: Record<string, string[]> = {
  ITT: ["Tronc commun (1re année)", "Informatique et réseaux (IR)", "Réseaux et télécommunications (RT)", "Radiocommunication (RC)"],
  IPT: ["Tronc commun (1re année)", "Management (MGT)", "Comptabilité et Finances (CF)", "Logistique et Transport (LT)", "Commerce et distribution"],
  MIT: ["Tronc commun", "Sécurité des réseaux et systèmes (SERES)", "Services et Radiomobiles (SRM)"],
  MAPT: ["Tronc commun", "Spécialité à préciser"],
  TT: ["Parcours technique télécoms"],
  CPT: ["Contrôle et exploitation des P&T"],
  ATT: ["Techniques des télécoms"],
  AEPT: ["Exploitation des postes et télécoms"],
};
const LEVELS_BY_CYCLE: Record<string, string[]> = {
  ITT: ["1re année (ITT1)", "2e année (ITT2)", "3e année (ITT3)"],
  IPT: ["1re année (IPT1)", "2e année (IPT2)", "3e année (IPT3)"],
  MIT: ["Master 1", "Master 2"],
  MAPT: ["Master 1", "Master 2"],
  TT: ["1re année", "2e année"],
  CPT: ["1re année", "2e année"],
  ATT: ["1re année", "2e année"],
  AEPT: ["1re année", "2e année"],
};

const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  nom?: unknown;
  prenom?: unknown;
  email?: unknown;
  telephone?: unknown;
  campus?: unknown;
  cycle?: unknown;
  regime?: unknown;
  niveau?: unknown;
  option?: unknown;
  domaine?: unknown;
  niveau_experience?: unknown;
  pole?: unknown;
  motivation?: unknown;
  engagement_reglement?: unknown;
  website?: unknown;
  statut?: unknown;
};

function jsonResponse(body: unknown, status: number, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders, ...extraHeaders },
  });
}

function validate(payload: Payload): { ok: true; data: Record<string, unknown> } | { ok: false; errors: Record<string, string>; status: number } {
  const errors: Record<string, string> = {};

  const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const nom = trim(payload.nom);
  if (nom.length < 2) errors.nom = "Le nom doit contenir au moins 2 caractères.";
  else if (nom.length > 100) errors.nom = "Le nom ne peut pas dépasser 100 caractères.";

  const prenom = trim(payload.prenom);
  if (prenom.length < 2) errors.prenom = "Le prénom doit contenir au moins 2 caractères.";
  else if (prenom.length > 100) errors.prenom = "Le prénom ne peut pas dépasser 100 caractères.";

  const email = trim(payload.email);
  if (!email) errors.email = "L'adresse e-mail est requise.";
  else if (!emailRegex.test(email)) errors.email = "Veuillez saisir une adresse e-mail valide.";
  else if (email.length > 254) errors.email = "L'adresse e-mail est trop longue.";

  const telephone = trim(payload.telephone);
  if (!telephone) errors.telephone = "Le téléphone est requis.";
  else if (telephone.length < 8) errors.telephone = "Le numéro doit contenir au moins 8 caractères.";
  else if (telephone.length > 20) errors.telephone = "Le numéro ne peut pas dépasser 20 caractères.";
  else if (!phoneRegex.test(telephone)) errors.telephone = "Numéro invalide (ex. +237 6XX XX XX XX).";
  else if (telephone.replace(/\D/g, "").length < 8) errors.telephone = "Le numéro doit contenir au moins 8 chiffres.";

  const campus = trim(payload.campus);
  if (!CAMPUS_VALUES.includes(campus as typeof CAMPUS_VALUES[number])) errors.campus = "Campus invalide.";

  const cycle = trim(payload.cycle);
  if (!CYCLE_VALUES.includes(cycle as typeof CYCLE_VALUES[number])) errors.cycle = "Cycle invalide.";

  const regime = trim(payload.regime);
  const niveau = trim(payload.niveau);
  const option = trim(payload.option);
  const domaine = trim(payload.domaine);
  const niveauExp = trim(payload.niveau_experience);
  const pole = trim(payload.pole);
  const motivation = payload.motivation != null ? String(payload.motivation).trim() : "";
  const engagement = payload.engagement_reglement;

  if (!regime) errors.regime = "Régime requis.";
  else if (cycle && REGIMES_BY_CYCLE[cycle] && !REGIMES_BY_CYCLE[cycle].includes(regime)) errors.regime = "Régime incompatible avec le cycle.";

  if (!niveau) errors.niveau = "Niveau requis.";
  else if (cycle && LEVELS_BY_CYCLE[cycle] && !LEVELS_BY_CYCLE[cycle].includes(niveau)) errors.niveau = "Niveau incompatible avec le cycle.";

  if (!option) errors.option = "Option requise.";
  else if (cycle && OPTIONS_BY_CYCLE[cycle] && !OPTIONS_BY_CYCLE[cycle].includes(option)) errors.option = "Option incompatible avec le cycle.";

  if (!DOMAINE_VALUES.includes(domaine as typeof DOMAINE_VALUES[number])) errors.domaine = "Centre d'intérêt invalide.";

  if (!EXPERIENCE_VALUES.includes(niveauExp as typeof EXPERIENCE_VALUES[number])) errors.niveau_experience = "Niveau d'expérience invalide.";

  if (!POLE_VALUES.includes(pole as typeof POLE_VALUES[number])) errors.pole = "Pôle invalide.";

  if (motivation && motivation.length > 1000) errors.motivation = "La motivation ne peut pas dépasser 1000 caractères.";

  if (engagement !== true) errors.engagement_reglement = "Veuillez confirmer votre engagement à respecter la Charte et le Règlement intérieur.";

  // Cohérence campus → cycle
  if (campus && cycle && CYCLES_BY_CAMPUS[campus] && !CYCLES_BY_CAMPUS[campus].includes(cycle)) {
    errors.cycle = "Le cycle ne correspond pas au campus.";
  }

  // Statut ne doit jamais être fourni par le client
  if (payload.statut != null && String(payload.statut).trim() !== "" && String(payload.statut) !== "Nouveau") {
    // On ne retourne pas d'erreur détaillée pour éviter l'énumération, mais on force Nouveau côté serveur
    // Pour être strict, on rejette les tentatives explicites d'Accepté/Refusé/Contacté
    const s = String(payload.statut).trim();
    if (["Accepté", "Refusé", "Contacté"].includes(s)) {
      errors.statut = "Statut non autorisé.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors, status: 400 };
  }

  return {
    ok: true,
    data: {
      nom,
      prenom,
      email,
      telephone,
      campus,
      cycle,
      regime,
      niveau,
      option,
      domaine,
      niveau_experience: niveauExp,
      pole,
      motivation: motivation || null,
      engagement_reglement: true,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Méthode non autorisée." }, 405);
  }

  // Limite taille payload
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return jsonResponse({ error: "Payload trop volumineux." }, 413);
  }

  let payload: Payload;
  try {
    const text = await req.text();
    if (text.length > MAX_PAYLOAD_BYTES) {
      return jsonResponse({ error: "Payload trop volumineux." }, 413);
    }
    payload = text ? JSON.parse(text) : {};
  } catch {
    return jsonResponse({ error: "JSON invalide." }, 400);
  }

  // Honeypot — doit rester vide, réponse générique si rempli (ne pas révéler)
  const website = typeof payload.website === "string" ? payload.website.trim() : "";
  if (website.length > 0) {
    // Simulation succès pour le bot, pas d'insertion
    return jsonResponse({ success: true, message: "Candidature reçue." }, 201);
  }

  // Validation serveur
  const validation = validate(payload);
  if (!validation.ok) {
    return jsonResponse({ error: "Données invalides.", details: validation.errors }, validation.status);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return jsonResponse({ error: "Configuration serveur incomplète." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Rate limiting — basé sur IP + email
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const email = String(validation.data.email).toLowerCase();

  try {
    // Vérif rate limit : max 5 requêtes par IP / heure, max 2 par email / 24h
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: ipCount, error: ipErr } = await supabase
      .from("candidature_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", oneHourAgo);

    if (!ipErr && ipCount != null && ipCount >= 5) {
      return jsonResponse({ error: "Trop de tentatives. Veuillez réessayer dans une heure." }, 429);
    }

    const { count: emailCount, error: emailErr } = await supabase
      .from("candidature_rate_limits")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneDayAgo);

    if (!emailErr && emailCount != null && emailCount >= 2) {
      return jsonResponse({ error: "Une candidature a déjà été reçue récemment avec cet e-mail." }, 429);
    }

    // Détection doublon rapproché : même email+telephone+cycle dans les dernières 24h
    const { data: recent, error: recentErr } = await supabase
      .from("candidatures")
      .select("id")
      .eq("email", validation.data.email)
      .eq("telephone", validation.data.telephone)
      .eq("cycle", validation.data.cycle)
      .gte("created_at", oneDayAgo)
      .limit(1);

    if (!recentErr && recent && recent.length > 0) {
      return jsonResponse({ error: "Une candidature identique a déjà été reçue récemment." }, 409);
    }
  } catch (e) {
    console.error("Rate limit check failed", e);
    // On ne bloque pas l'insertion si le check rate limit échoue (fail open pour ne pas perdre de candidature)
  }

  // Insertion sécurisée — statut forcé à Nouveau
  let insertedId: string | null = null;
  try {
    const { data: inserted, error: insertError } = await supabase
      .from("candidatures")
      .insert({
        ...validation.data,
        statut: "Nouveau",
      })
      .select("id")
      .single();

    if (insertError) throw insertError;
    insertedId = inserted?.id ?? null;

    // Enregistrement rate limit (best effort)
    try {
      await supabase.from("candidature_rate_limits").insert({ ip, email });
    } catch (_) {
      // ignore
    }
  } catch (e) {
    console.error("Insert failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    // Conflit doublon si contrainte unique future
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return jsonResponse({ error: "Une candidature identique existe déjà." }, 409);
    }
    return jsonResponse({ error: "Erreur lors de l'enregistrement. Veuillez réessayer." }, 500);
  }

  // Notifications email — best effort, ne doit pas faire échouer la candidature
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const emailFrom = Deno.env.get("EMAIL_FROM") ?? "Club Informatique SUP'PTIC <noreply@supptic.club>";
  const notifyEmail = Deno.env.get("CANDIDATURE_NOTIFICATION_EMAIL");

  let emailCandidateSent = false;
  let emailBureauSent = false;

  if (resendKey) {
    const candidateSubject = "Confirmation de réception — Club Informatique SUP'PTIC";
    const candidateHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
        <h2 style="color: #0f2a4d;">Merci ${validation.data.prenom ? String(validation.data.prenom) : String(validation.data.nom)} !</h2>
        <p>Votre candidature pour rejoindre le <strong>Club Informatique SUP'PTIC</strong> a bien été reçue.</p>
        <p>Elle sera examinée par le Bureau Exécutif. Le Pôle Communication vous contactera via WhatsApp (<strong>${validation.data.telephone}</strong>) si nécessaire.</p>
        <p style="font-size: 12px; color: #666;">Campus : ${validation.data.campus} — Cycle : ${validation.data.cycle} — Domaine : ${validation.data.domaine} — Pôle : ${validation.data.pole}</p>
        <p style="font-size: 12px; color: #666;">Aucune admission n'est garantie à ce stade — vous serez informé(e) des prochaines étapes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="font-size: 12px; color: #888;">Club Informatique SUP'PTIC — Une école, un esprit, une intelligence<br/>${emailFrom}</p>
      </div>
    `;

    try {
      const r1 = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [String(validation.data.email)],
          subject: candidateSubject,
          html: candidateHtml,
        }),
      });
      emailCandidateSent = r1.ok;
      if (!r1.ok) console.error("Resend candidate failed", await r1.text());
    } catch (e) {
      console.error("Resend candidate error", e);
    }

    if (notifyEmail) {
      const bureauHtml = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
          <h2 style="color: #0f2a4d;">Nouvelle candidature — Club Informatique SUP'PTIC</h2>
          <p><strong>${validation.data.nom} ${validation.data.prenom}</strong> vient de soumettre une candidature.</p>
          <ul style="font-size: 14px;">
            <li><strong>Email :</strong> ${validation.data.email}</li>
            <li><strong>Téléphone :</strong> ${validation.data.telephone}</li>
            <li><strong>Campus :</strong> ${validation.data.campus}</li>
            <li><strong>Cycle :</strong> ${validation.data.cycle} — Régime : ${validation.data.regime} — Niveau : ${validation.data.niveau} — Option : ${validation.data.option}</li>
            <li><strong>Domaine :</strong> ${validation.data.domaine}</li>
            <li><strong>Niveau d'expérience :</strong> ${validation.data.niveau_experience}</li>
            <li><strong>Pôle souhaité :</strong> ${validation.data.pole}</li>
            <li><strong>Date :</strong> ${new Date().toISOString()}</li>
          </ul>
          ${validation.data.motivation ? `<p><strong>Motivation :</strong><br/>${String(validation.data.motivation).replace(/</g, "&lt;")}</p>` : ""}
          <p style="font-size: 12px; color: #666;">ID : ${insertedId ?? "—"} — Statut : Nouveau</p>
        </div>
      `;
      try {
        const r2 = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: emailFrom,
            to: [notifyEmail],
            subject: `Nouvelle candidature : ${validation.data.nom} ${validation.data.prenom} — ${validation.data.domaine}`,
            html: bureauHtml,
          }),
        });
        emailBureauSent = r2.ok;
        if (!r2.ok) console.error("Resend bureau failed", await r2.text());
      } catch (e) {
        console.error("Resend bureau error", e);
      }
    }
  } else {
    console.warn("RESEND_API_KEY not configured — emails skipped");
  }

  return jsonResponse(
    {
      success: true,
      id: insertedId,
      message: "Candidature reçue.",
      emailCandidateSent,
      emailBureauSent,
    },
    201,
  );
});
