export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-foreground/70">
        <p className="font-display font-semibold">
          🌍 Exploradores do Mundo — aventuras culturais para crianças
        </p>
        <p>© {new Date().getFullYear()} • Feito com ♥ por quem ama explorar</p>
      </div>
    </footer>
  );
}
