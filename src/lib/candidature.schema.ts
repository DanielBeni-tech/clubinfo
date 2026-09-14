import { z } from "zod";
import { joinForm } from "@/data/club";

// Valeurs autorisées — source de vérité : joinForm
const campusValues = [...joinForm.campuses] as [string, ...string[]];
const domaineValues = [...joinForm.domains] as [string, ...string[]];
const poleValues = joinForm.poles.map((p) => p.value) as [string, ...string[]];
const experienceValues = joinForm.experienceLevels.map((e) => e.value) as [string, ...string[]];

const allCycles = Object.values(joinForm.cyclesByCampus).flatMap((arr) =>
  arr.map((c) => c.value),
) as [string, ...string[]];
const allRegimes = [...new Set(Object.values(joinForm.regimesByCycle).flat())] as [string, ...string[]];
const allOptions = [...new Set(Object.values(joinForm.optionsByCycle).flat())] as [string, ...string[]];
const allLevels = [...new Set(Object.values(joinForm.levelsByCycle).flat())] as [string, ...string[]];

// Regex téléphone raisonnable : chiffres, espaces, +, -, au moins 8 chiffres
const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

export const candidatureSchema = z
  .object({
    nom: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères.")
      .max(100, "Le nom ne peut pas dépasser 100 caractères."),
    prenom: z
      .string()
      .trim()
      .min(2, "Le prénom doit contenir au moins 2 caractères.")
      .max(100, "Le prénom ne peut pas dépasser 100 caractères."),
    email: z
      .string()
      .trim()
      .email("Veuillez saisir une adresse e-mail valide.")
      .max(254, "L'adresse e-mail est trop longue."),
    telephone: z
      .string()
      .trim()
      .min(8, "Le numéro de téléphone doit contenir au moins 8 caractères.")
      .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères.")
      .regex(phoneRegex, "Veuillez saisir un numéro de téléphone valide (ex. +237 6XX XX XX XX).")
      .refine((v) => (v.replace(/\D/g, "").length >= 8 ? true : false), {
        message: "Le numéro doit contenir au moins 8 chiffres.",
      }),
    campus: z.enum(campusValues, {
      errorMap: () => ({ message: "Veuillez sélectionner un campus valide." }),
    }),
    cycle: z.enum(allCycles, {
      errorMap: () => ({ message: "Veuillez sélectionner un cycle valide." }),
    }),
    regime: z.enum(allRegimes, {
      errorMap: () => ({ message: "Veuillez sélectionner un régime valide." }),
    }),
    niveau: z.enum(allLevels, {
      errorMap: () => ({ message: "Veuillez sélectionner un niveau valide." }),
    }),
    option: z.enum(allOptions, {
      errorMap: () => ({ message: "Veuillez sélectionner une option valide." }),
    }),
    domaine: z.enum(domaineValues, {
      errorMap: () => ({ message: "Veuillez sélectionner un centre d'intérêt valide." }),
    }),
    niveau_experience: z.enum(experienceValues, {
      errorMap: () => ({ message: "Veuillez sélectionner un niveau d'expérience." }),
    }),
    pole: z.enum(poleValues, {
      errorMap: () => ({ message: "Veuillez sélectionner un pôle valide." }),
    }),
    motivation: z
      .string()
      .trim()
      .max(1000, "La motivation ne peut pas dépasser 1000 caractères.")
      .optional()
      .or(z.literal("")),
    engagement_reglement: z.literal(true, {
      errorMap: () => ({
        message:
          "Veuillez confirmer votre engagement à respecter la Charte et le Règlement intérieur.",
      }),
    }),
    // Honeypot anti-spam : doit rester vide
    website: z
      .string()
      .max(0, "Validation anti-spam échouée.")
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Vérifications de cohérence campus → cycle → régime/niveau/option
    const cyclesForCampus = joinForm.cyclesByCampus[data.campus as keyof typeof joinForm.cyclesByCampus];
    if (cyclesForCampus && !cyclesForCampus.some((c) => c.value === data.cycle)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["cycle"],
        message: "Le cycle sélectionné ne correspond pas au campus choisi.",
      });
    }
    const regimes = joinForm.regimesByCycle[data.cycle] ?? [];
    if (regimes.length > 0 && !regimes.includes(data.regime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["regime"],
        message: "Le régime sélectionné ne correspond pas au cycle choisi.",
      });
    }
    const levels = joinForm.levelsByCycle[data.cycle] ?? [];
    if (levels.length > 0 && !levels.includes(data.niveau)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["niveau"],
        message: "Le niveau sélectionné ne correspond pas au cycle choisi.",
      });
    }
    const options = joinForm.optionsByCycle[data.cycle] ?? [];
    if (options.length > 0 && !options.includes(data.option)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["option"],
        message: "L'option sélectionnée ne correspond pas au cycle choisi.",
      });
    }
  });

export type CandidatureFormValues = z.infer<typeof candidatureSchema>;
