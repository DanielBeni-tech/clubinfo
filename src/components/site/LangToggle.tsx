import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ inverted = false }: { inverted?: boolean }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-xs transition-colors",
        inverted ? "border-white/15 bg-white/5" : "border-border/80 bg-muted/30",
      )}
      role="group"
      aria-label={t("lang.toggle")}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={cn(
          "rounded-full px-2 py-0.5 text-[11px] transition-all",
          locale === "fr"
            ? inverted
              ? "bg-white/20 text-white font-semibold shadow-xs"
              : "bg-background text-foreground font-semibold shadow-xs"
            : inverted
              ? "text-white/60 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t("lang.fr")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-2 py-0.5 text-[11px] transition-all",
          locale === "en"
            ? inverted
              ? "bg-white/20 text-white font-semibold shadow-xs"
              : "bg-background text-foreground font-semibold shadow-xs"
            : inverted
              ? "text-white/60 hover:text-white"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t("lang.en")}
      </button>
    </div>
  );
}
