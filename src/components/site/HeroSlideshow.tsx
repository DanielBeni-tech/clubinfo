import { useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/club";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5500;

export function HeroSlideshow({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { locale, t } = useLocale();
  const count = heroSlides.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  const current = heroSlides[index]!;
  const caption = locale === "en" ? current.captionEn : current.caption;

  return (
    <section
      className="relative min-h-[78vh] overflow-hidden bg-night text-night-foreground lg:min-h-[88vh]"
      aria-roledescription="carousel"
      aria-label={t("hero.carousel")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {heroSlides.map((slide) => (
          <img
            key={slide.caption}
            src={slide.src}
            alt=""
            aria-hidden="true"
            width={1280}
            height={960}
            className="h-full min-h-[78vh] w-full min-w-full shrink-0 object-cover lg:min-h-[88vh]"
            style={{ objectPosition: slide.focus }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-linear-to-r from-night/92 via-night/55 to-night/20" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-night/80 to-transparent" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-4 py-20 lg:min-h-[88vh] lg:py-28">
        {children}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs tracking-widest text-accent uppercase" aria-live="polite">
            {caption}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={t("hero.prev")}
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              className="grid size-9 place-items-center rounded-md border border-night-foreground/25"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-2" role="tablist" aria-label={t("hero.photos")}>
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.caption}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={locale === "en" ? slide.captionEn : slide.caption}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-8 bg-accent" : "w-3 bg-night-foreground/35",
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label={t("hero.next")}
              onClick={() => setIndex((i) => (i + 1) % count)}
              className="grid size-9 place-items-center rounded-md border border-night-foreground/25"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
