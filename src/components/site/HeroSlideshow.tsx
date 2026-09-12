import { useEffect, useState, type ReactNode } from "react";
import { heroSlides } from "@/data/club";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5500;

export function HeroSlideshow({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const current = heroSlides[index]!;

  return (
    <section
      className="relative min-h-[70vh] overflow-hidden bg-night text-night-foreground lg:min-h-[82vh]"
      aria-roledescription="carousel"
      aria-label="Temps forts du Club"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {heroSlides.map((slide, i) => (
        <img
          key={slide.caption}
          src={slide.src}
          alt=""
          aria-hidden="true"
          width={1280}
          height={960}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out",
            i === index ? "opacity-100" : "opacity-0",
          )}
          style={{ objectPosition: slide.focus }}
        />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-night via-night/82 to-night/35" />
      <div className="absolute inset-0 bg-night/20" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20 lg:min-h-[82vh] lg:py-28">
        {children}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs tracking-widest text-accent uppercase" aria-live="polite">
            {current.caption}
          </p>
          <div className="flex gap-2" role="tablist" aria-label="Photos du hero">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.caption}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={slide.caption}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-accent" : "w-3 bg-night-foreground/35",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
