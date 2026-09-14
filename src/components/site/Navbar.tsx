import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { LangToggle } from "@/components/site/LangToggle";
import { useLocale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
    checkSession();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function checkSession() {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    await navigate({ to: "/" });
  }

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

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LangToggle />
          {!loading && user && user.email === "adminclub@supptic.cm" && (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex text-xs font-semibold text-primary hover:text-primary hover:bg-secondary"
              >
                <Link to="/admin/dashboard">
                  <ShieldCheck className="mr-1.5 size-3.5" />
                  {t("nav.bureau")}
                </Link>
              </Button>
              <span className="hidden sm:inline text-xs text-muted-foreground">{user.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:inline-flex text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <LogOut className="mr-1.5 size-3.5" />
                {t("nav.logout")}
              </Button>
            </>
          )}
          <Button asChild size="sm" className="hidden sm:inline-flex text-xs font-semibold shadow-xs">
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
            <li className="flex flex-col gap-2.5 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{t("nav.language")}</span>
                <LangToggle />
              </div>
              {!loading && user && user.email === "adminclub@supptic.cm" && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/admin/dashboard">
                      <ShieldCheck className="mr-1.5 size-3.5" />
                      {t("nav.bureau")}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-1.5 size-3.5" />
                    {t("nav.logout")}
                  </Button>
                </div>
              )}
              <Button asChild size="sm" className="w-full text-xs font-semibold">
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
