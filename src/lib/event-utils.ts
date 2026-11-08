import type { ClubEvent } from "@/data/club";
import type { Locale } from "@/lib/i18n";

/** Adresse publique du site (pour les liens partagés et les aperçus WhatsApp). */
export const SITE_URL = (
  String(import.meta.env["VITE_SITE_URL"] ?? "") || "https://clubinfo.vercel.app"
).replace(/\/$/, "");

/** Les heures sont toujours affichées à l'heure de Yaoundé, quel que soit le fuseau du visiteur. */
const TZ = "Africa/Douala";

export function eventUrl(e: ClubEvent) {
  return `${SITE_URL}/events/${e.slug}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Ex. { day: "12", month: "nov.", year: "2026", date: "Jeudi 12 novembre 2026", time: "16 h 40" } */
export function eventDateParts(e: ClubEvent, locale: Locale) {
  if (!e.date) return null;
  const d = new Date(e.date);
  if (Number.isNaN(d.getTime())) return null;
  const lang = locale === "en" ? "en-GB" : "fr-FR";
  const f = (o: Intl.DateTimeFormatOptions) => d.toLocaleString(lang, { timeZone: TZ, ...o });
  const hour = f({ hour: "2-digit", minute: "2-digit", hour12: false });
  return {
    day: f({ day: "2-digit" }),
    month: f({ month: "short" }),
    year: f({ year: "numeric" }),
    date: capitalize(f({ weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    time: locale === "en" ? hour : hour.replace(":", " h "),
  };
}

/** Libellé court : « Jeudi 12 novembre 2026 · 16 h 40 », ou le texte libre si pas de date. */
export function eventDateLabel(e: ClubEvent, locale: Locale) {
  const p = eventDateParts(e, locale);
  if (!p) return locale === "en" ? e.displayDateEn : e.displayDate;
  return `${p.date} · ${p.time}`;
}

function bounds(e: ClubEvent) {
  const start = new Date(e.date);
  const end = new Date(start.getTime() + (e.durationMinutes ?? 120) * 60_000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  return { start: fmt(start), end: fmt(end) };
}

function place(e: ClubEvent) {
  return [e.location?.fr, e.locationDetail?.fr].filter(Boolean).join(" — ");
}

export function googleCalendarUrl(e: ClubEvent) {
  const { start, end } = bounds(e);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title} — Club Info SUP'PTIC`,
    dates: `${start}/${end}`,
    details: `${e.description}\n\n${eventUrl(e)}`,
    location: place(e),
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Fichier .ics : compatible avec l'agenda Apple, Outlook, Samsung, etc. */
export function downloadIcs(e: ClubEvent) {
  const { start, end } = bounds(e);
  const esc = (v: string) =>
    v
      .replace(/\\/g, "\\\\")
      .replace(/[,;]/g, (m) => `\\${m}`)
      .replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Club Info SUP'PTIC//Evenements//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@clubinfo.vercel.app`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(`${e.title} — Club Info SUP'PTIC`)}`,
    `DESCRIPTION:${esc(`${e.description}\n\n${eventUrl(e)}`)}`,
    `LOCATION:${esc(place(e))}`,
    `URL:${eventUrl(e)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.slug}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function whatsappShareUrl(e: ClubEvent) {
  const when = eventDateLabel(e, "fr");
  const text = `📢 ${e.title} — Club Info SUP'PTIC\n🗓 ${when}${e.location ? `\n📍 ${place(e)}` : ""}\n\n${eventUrl(e)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
