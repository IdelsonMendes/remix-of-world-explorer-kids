import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { PassportProvider } from "@/context/PassportContext";
import { NarrationProvider } from "@/context/NarrationContext";
import { AccessibilityFab } from "@/components/AccessibilityFab";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
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

function RootComponent() {
  return (
    <PassportProvider>
      <NarrationProvider>
        <Outlet />
        <AccessibilityFab />
      </NarrationProvider>
    </PassportProvider>
  );
}
