import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/brand/logo-mark.png";
import logoMarkWhite from "@/assets/brand/logo-mark-white.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  inverted?: boolean;
  withWordmark?: boolean;
  className?: string;
  onClick?: () => void;
};

export function Logo({ inverted = false, withWordmark = true, className, onClick }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)} onClick={onClick}>
      <img
        src={inverted ? logoMarkWhite : logoMark}
        alt=""
        width={40}
        height={40}
        className="size-10 object-contain"
      />
      {withWordmark && (
        <span
          className={cn(
            "hidden font-display text-sm leading-tight font-bold sm:block",
            inverted && "text-night-foreground",
          )}
        >
          Club Info
          <span className={cn("block text-xs font-medium", inverted ? "text-night-muted" : "text-muted-foreground")}>
            SUP'PTIC
          </span>
        </span>
      )}
      <span className="sr-only">Club Informatique SUP'PTIC — accueil</span>
    </Link>
  );
}
