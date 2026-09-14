import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/club";
import { useLocale } from "@/lib/i18n";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const { locale, t } = useLocale();
  const current = index === null ? null : items[index];
  const caption = current ? (locale === "en" ? current.altEn : current.alt) : "";

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((item, i) => {
          const alt = locale === "en" ? item.altEn : item.alt;
          return (
            <li key={`${item.src}-${i}`}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="block w-full overflow-hidden rounded-lg border border-border"
                aria-label={t("gallery.expand", { alt })}
              >
                <img
                  src={item.src}
                  alt={alt}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-4/3 w-full object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>

      {current && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-night/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={caption}
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            aria-label={t("gallery.close")}
            onClick={() => setIndex(null)}
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-md border border-night-muted/40 text-night-foreground"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t("gallery.prev")}
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
            }}
            className="absolute left-4 grid size-10 place-items-center rounded-md border border-night-muted/40 text-night-foreground"
          >
            <ChevronLeft className="size-5" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-full">
            <img
              src={current.src}
              alt={caption}
              className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-night-muted">{caption}</figcaption>
          </figure>
          <button
            type="button"
            aria-label={t("gallery.next")}
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => ((i ?? 0) + 1) % items.length);
            }}
            className="absolute right-4 grid size-10 place-items-center rounded-md border border-night-muted/40 text-night-foreground"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </>
  );
}
