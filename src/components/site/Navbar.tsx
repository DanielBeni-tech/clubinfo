import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { LangToggle } from "@/components/site/LangToggle";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();
  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/events", label: t("nav.events") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors",
        "duration-300",
        scrolled ? "border-b border-border bg-background/90 backdrop-blur" : "bg-background",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo onClick={() => setOpen(false)} />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                activeProps={{ className: "text-primary bg-secondary" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/join">{t("nav.join")}</Link>
          </Button>
          <button
            type="button"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  activeOptions={{ exact: link.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground"
                  activeProps={{ className: "text-primary bg-secondary" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center justify-between pt-2">
              <LangToggle />
              <Button asChild className="flex-1 sm:hidden">
                <Link to="/join" onClick={() => setOpen(false)}>
                  {t("nav.joinClub")}
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
