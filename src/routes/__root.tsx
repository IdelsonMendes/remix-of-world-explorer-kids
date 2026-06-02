import { useEffect, useState } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { PassportProvider } from "@/context/PassportContext";
import { NarrationProvider } from "@/context/NarrationContext";
import { AccessibilityFab } from "@/components/AccessibilityFab";
import { LunaChatbot } from "@/components/LunaChatbot";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl">🧭</div>
        <h1 className="mt-2 text-4xl font-display font-bold text-foreground">Ops! Nos perdemos</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Essa página não está no nosso mapa. Vamos voltar ao começo da aventura?
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sticker hover:-translate-y-0.5 transition"
          >
            Voltar ao início 🌍
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Exploradores do Mundo" },
      { name: "description", content: "Plataforma educativa de turismo digital para crianças." },
      { name: "author", content: "Exploradores do Mundo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Exploradores do Mundo" },
      { name: "twitter:title", content: "Exploradores do Mundo" },
      { property: "og:description", content: "Plataforma educativa de turismo digital para crianças." },
      { name: "twitter:description", content: "Plataforma educativa de turismo digital para crianças." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b30bd396-a767-4ebc-bc8d-6146e55aa84c/id-preview-e0de0982--125821f4-b5bc-4794-a551-41f000a54b2c.lovable.app-1778289668369.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b30bd396-a767-4ebc-bc8d-6146e55aa84c/id-preview-e0de0982--125821f4-b5bc-4794-a551-41f000a54b2c.lovable.app-1778289668369.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RouteLoadingBar() {
  const isPending = useRouterState({ select: (s) => s.status === "pending" });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setVisible(false);
      return;
    }
    // Only show after a brief delay so instant navigations don't flash the bar.
    const show = window.setTimeout(() => setVisible(true), 180);
    // Safety net: never let the bar live longer than 6s, no matter what.
    const hide = window.setTimeout(() => setVisible(false), 6000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [isPending]);

  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Carregando próxima página"
      className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none"
    >
      <div className="h-full w-1/3 bg-gradient-sunset rounded-r-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
      <style>{`@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
    </div>
  );
}

function RootComponent() {
  return (
    <PassportProvider>
      <NarrationProvider>
        <RouteLoadingBar />
        <Outlet />
        <AccessibilityFab />
        <LunaChatbot />
      </NarrationProvider>
    </PassportProvider>
  );
}
