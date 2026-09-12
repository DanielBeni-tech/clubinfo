import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LangToggle({ inverted = false }: { inverted?: boolean }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex rounded-md border p-0.5 text-xs font-semibold tracking-wide",
        inverted ? "border-night-muted/30" : "border-border",
      )}
      role="group"
      aria-label={t("lang.toggle")}
    >
      <button
        type="button"
        onClick={() => setLocale("fr")}
        className={cn(
          "rounded-sm px-2 py-1",
          locale === "fr"
            ? inverted
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground"
            : inverted
              ? "text-night-muted"
              : "text-muted-foreground",
        )}
      >
        {t("lang.fr")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-sm px-2 py-1",
          locale === "en"
            ? inverted
              ? "bg-accent text-accent-foreground"
              : "bg-primary text-primary-foreground"
            : inverted
              ? "text-night-muted"
              : "text-muted-foreground",
        )}
      >
        {t("lang.en")}
      </button>
    </div>
  );
}
