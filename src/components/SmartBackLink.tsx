import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  fallbackTo: string;
  label?: ReactNode;
  className?: string;
};

/**
 * Predictable, single-click back button.
 *
 * We intentionally do NOT use `history.back()`: inside the Lovable preview
 * (and any nested iframe / OAuth flow), `window.history.length > 1` can be
 * true even when the previous entry is OUTSIDE the SPA — which makes
 * `back()` look like a page refresh and requires a second click to leave.
 *
 * A plain SPA <Link> to the known fallback is deterministic and always
 * navigates in a single click.
 */
export function SmartBackLink({
  fallbackTo,
  label = "Voltar",
  className = "inline-flex items-center gap-2 rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold text-foreground/80 hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition shadow-sticker",
}: Props) {
  return (
    <Link to={fallbackTo} className={className} aria-label="Voltar">
      <ArrowLeft className="h-4 w-4" /> {label}
    </Link>
  );
}
