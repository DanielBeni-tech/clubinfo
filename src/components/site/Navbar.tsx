import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { LangToggle } from "@/components/site/LangToggle";
import { useLocale } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { isBureauAdmin } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

export function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange(() => {
      // Pas d'appel Supabase directement dans ce callback (risque de blocage) : on diffère.
      setTimeout(() => void checkSession(), 0);
    });
    return () => data.subscription.unsubscribe();
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
    setIsAdmin(session ? await isBureauAdmin() : false);
    setLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
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
                className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                activeProps={{ className: "text-primary bg-secondary" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <LangToggle />
          {!loading && user && isAdmin ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden gap-1.5 text-xs font-semibold text-primary hover:bg-secondary hover:text-primary sm:inline-flex"
                  aria-label={t("nav.bureau")}
                >
                  <ShieldCheck className="size-4" />
                  <span className="hidden xl:inline">{t("nav.bureau")}</span>
                  <ChevronDown className="size-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/espace-bureau/dashboard">
                    <ShieldCheck className="size-4" />
                    {t("nav.bureau")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void handleLogout()}>
                  <LogOut className="size-4" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex text-xs font-semibold shadow-xs">
              <Link to="/join">{t("nav.join")}</Link>
            </Button>
          )}
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
              {!loading && user && isAdmin && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => setOpen(false)}
                  >
                    <Link to="/espace-bureau/dashboard">
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
