import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { MINI_GAMES, type MiniGameId } from "@/data/miniGames";
import { MemoryGame } from "@/components/games/MemoryGame";
import { ChoiceQuiz } from "@/components/games/ChoiceQuiz";
import { SpotDifferencesGame } from "@/components/games/SpotDifferencesGame";
import { usePassport } from "@/context/PassportContext";

const VALID: MiniGameId[] = ["memoria", "bandeiras", "safari", "sons", "monumentos", "seteerros"];

export const Route = createFileRoute("/brincadeiras/$gameId")({
  component: GamePage,
  loader: ({ params }) => {
    if (!VALID.includes(params.gameId as MiniGameId)) throw notFound();
    return { id: params.gameId as MiniGameId };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center text-center p-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Brincadeira não encontrada 🎲</h1>
        <Link to="/lobby" className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-3 font-bold">
          Voltar ao lobby
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center text-center p-6">
      <div>
        <h1 className="text-2xl font-bold">Algo deu errado 😢</h1>
        <p className="mt-2 text-foreground/70">{error.message}</p>
        <Link to="/lobby" className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-3 font-bold">
          Voltar
        </Link>
      </div>
    </div>
  ),
  head: ({ params }) => {
    const meta = MINI_GAMES.find((g) => g.id === params.gameId);
    return {
      meta: [
        { title: `${meta?.title ?? "Brincadeira"} — Exploradores do Mundo` },
        { name: "description", content: meta?.description ?? "Brincadeira educativa" },
      ],
    };
  },
});

function GamePage() {
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = usePassport();

  if (!isLoggedIn) {
    if (typeof window !== "undefined") navigate({ to: "/login" });
    return null;
  }

  const meta = MINI_GAMES.find((g) => g.id === gameId)!;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Link
            to="/lobby"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground/70 hover:text-primary transition"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao lobby
          </Link>
          <span className="text-sm font-bold">{meta.emoji} {meta.title}</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        {gameId === "memoria" ? (
          <MemoryGame />
        ) : gameId === "seteerros" ? (
          <SpotDifferencesGame />
        ) : (
          <ChoiceQuiz
            gameId={gameId as MiniGameId}
            title={meta.title}
            emoji={meta.emoji}
          />
        )}
      </main>
    </div>
  );
}
