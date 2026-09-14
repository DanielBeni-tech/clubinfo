import type { Locale } from "@/lib/i18n";

export type L10n = { fr: string; en: string };

export function loc(text: L10n, locale: Locale): string {
  return locale === "en" ? text.en : text.fr;
}
