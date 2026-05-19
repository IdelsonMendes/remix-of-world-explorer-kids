import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  fallbackTo: string;
  label?: ReactNode;
  className?: string;
};

/**
 * Smart back navigation:
 * - If the user has prior history within the app, go back (preserves their
 *   previous page — Home, Lobby, search results, etc.).
 * - Otherwise, fall back to the provided default route.
 *
 * Renders as an <a> with a real href for accessibility and right-click /
 * cmd-click support, but intercepts the click for history.back() when possible.
 */
export function SmartBackLink({
  fallbackTo,
  label = "Voltar",
  className = "inline-flex items-center gap-2 rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold text-foreground/80 hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition shadow-sticker",
}: Props) {
  const router = useRouter();

  const canGoBack =
    typeof window !== "undefined" &&
    // TanStack history exposes a length-based check
    window.history.length > 1;

  if (!canGoBack) {
    return (
      <Link to={fallbackTo} className={className} aria-label="Voltar">
        <ArrowLeft className="h-4 w-4" /> {label}
      </Link>
    );
  }

  return (
    <a
      href={fallbackTo}
      onClick={(e) => {
        e.preventDefault();
        router.history.back();
      }}
      className={className}
      aria-label="Voltar"
    >
      <ArrowLeft className="h-4 w-4" /> {label}
    </a>
  );
}
