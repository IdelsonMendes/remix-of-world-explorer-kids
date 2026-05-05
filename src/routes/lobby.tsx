import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogOut, Map, Sparkles, Stamp as StampIcon, Award } from "lucide-react";
import { getAvatarSrc, usePassport } from "@/context/PassportContext";
import { COUNTRY_LIST, COUNTRIES } from "@/data/countries";
import { MINI_GAMES, COUNTRY_ISO } from "@/data/miniGames";
import { LobbyMap } from "@/components/LobbyMap";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/lobby")({
  component: LobbyPage,
  head: () => ({
    meta: [
      { title: "Lobby — Exploradores do Mundo" },
      { name: "description", content: "Seu lobby de explorador: passaporte, mapa e brincadeiras." },
    ],
  }),
});

function LobbyPage() {
  const navigate = useNavigate();
  const {
    explorerName,
    avatar,
    isLoggedIn,
    logout,
    stamps,
    storyRead,
    gamesDone,
    miniGameScores,
  } = usePassport();
  const avatarSrc = getAvatarSrc(avatar);

  if (!isLoggedIn) {
    if (typeof window !== "undefined") {
      navigate({ to: "/login" });
    }
    return null;
  }

  const totalCountries = COUNTRY_LIST.length;
  const collected = stamps.length;
  const storiesRead = Object.values(storyRead).filter(Boolean).length;
  const gamesCompleted = Object.values(gamesDone).filter(Boolean).length;
  const overallPct = Math.round(
    ((collected + storiesRead + gamesCompleted) / (totalCountries * 3)) * 100,
  );

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Link to="/" className="font-display font-bold text-lg">
            Exploradores <span className="text-primary">do Mundo</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-card border-2 border-border pl-1 pr-3 py-1">
              <img src={avatarSrc} alt={explorerName} className="h-8 w-8 rounded-full object-contain bg-muted/40" />
              <span className="font-bold text-sm">{explorerName}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold hover:border-destructive/40 hover:text-destructive transition"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 space-y-12">
        {/* Welcome card */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-[2.5rem] bg-gradient-tropical p-1 shadow-float"
        >
          <div className="rounded-[2.35rem] bg-card p-7 sm:p-10 grid md:grid-cols-[auto_1fr_auto] gap-6 items-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-sunset grid place-items-center overflow-hidden shadow-float"
            >
              <img src={avatarSrc} alt={explorerName} className="h-full w-full object-contain p-2" />
            </motion.div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/60 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Bem-vindo de volta
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-display font-bold">
                Olá, {explorerName}! 🌟
              </h1>
              <p className="mt-2 text-foreground/70">
                Pronto para mais uma aventura? Escolha um país, uma brincadeira ou
                continue de onde parou.
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Progresso geral</span>
                  <span>{overallPct}%</span>
                </div>
                <Progress value={overallPct} className="h-3" />
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3 text-center">
              <Stat icon="🗺" value={`${collected}/${totalCountries}`} label="Carimbos" />
              <Stat icon="📖" value={`${storiesRead}/${totalCountries}`} label="Histórias" />
              <Stat icon="🎮" value={`${gamesCompleted}/${totalCountries}`} label="Países jogados" />
            </div>
          </div>
        </motion.section>

        {/* Passport + Map */}
        <section className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
          {/* Passport */}
          <div className="rounded-[2rem] bg-card p-6 sm:p-7 border-4 border-card shadow-float">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <StampIcon className="h-5 w-5 text-primary" /> Meu Passaporte
              </h2>
              <span className="text-xs font-bold rounded-full bg-[var(--mint)]/40 px-3 py-1">
                {collected}/{totalCountries}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-4 sm:grid-cols-5 gap-3">
              {COUNTRY_LIST.map((c) => {
                const stamp = stamps.find((s) => s.country === c.slug);
                const iso = COUNTRY_ISO[c.slug];
                return (
                  <Link
                    key={c.slug}
                    to="/pais/$slug"
                    params={{ slug: c.slug }}
                    className={`relative aspect-square rounded-2xl border-2 overflow-hidden grid place-items-center transition hover:scale-105 ${
                      stamp
                        ? "border-[var(--mint)] shadow-sticker"
                        : "bg-muted/40 border-dashed border-border text-foreground/30"
                    }`}
                    title={stamp ? `${c.name} — ${stamp.date}` : `${c.name} (a desbloquear)`}
                  >
                    {stamp ? (
                      <>
                        <span
                          className={`fi fi-${iso}`}
                          aria-label={`Bandeira de ${c.name}`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "block",
                            width: "100%",
                            height: "100%",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <span className="absolute inset-0 rounded-2xl border-2 border-[var(--coral)]/40 rotate-3 pointer-events-none" />
                        <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-white bg-black/55 px-1 py-0.5 text-center truncate">
                          {c.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl opacity-50">🔒</span>
                    )}
                  </Link>
                );
              })}
            </div>
            {collected === totalCountries && (
              <div className="mt-5 rounded-2xl bg-gradient-sunset text-white p-4 text-center shadow-sticker">
                <Award className="inline h-5 w-5 mr-1" />
                <strong>Mestre Explorador! 🌍✨</strong>
              </div>
            )}
            {collected > 0 && collected < totalCountries && (
              <p className="mt-4 text-xs text-foreground/60">
                Visitados: {stamps.map((s) => COUNTRIES[s.country].name).join(", ")}
              </p>
            )}
          </div>

          {/* Map */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-display font-bold flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" /> Mapa de descoberta
              </h2>
              <span className="text-xs text-foreground/60">Toque em um país para explorar</span>
            </div>
            <LobbyMap />
          </div>
        </section>

        {/* Mini-games */}
        <section>
          <div className="flex items-end justify-between mb-5 flex-wrap gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold">
                Brincadeiras 🎲
              </h2>
              <p className="text-foreground/70">
                Escolha uma atividade e teste o que aprendeu sobre o mundo.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MINI_GAMES.map((g, i) => {
              const score = miniGameScores[g.id];
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to="/brincadeiras/$gameId"
                    params={{ gameId: g.id }}
                    className="block group"
                  >
                    <div
                      className="rounded-[1.75rem] p-1 shadow-float h-full"
                      style={{ background: `linear-gradient(135deg, ${g.color}, color-mix(in oklab, ${g.color} 50%, white))` }}
                    >
                      <div className="rounded-[1.6rem] bg-card p-6 h-full flex flex-col">
                        <div className="text-5xl">{g.emoji}</div>
                        <h3 className="mt-3 text-xl font-display font-bold">{g.title}</h3>
                        <p className="text-sm font-bold text-foreground/70">{g.tagline}</p>
                        <p className="mt-2 text-sm text-foreground/70 flex-1">
                          {g.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          {score > 0 ? (
                            <span className="text-xs font-bold rounded-full bg-[var(--mint)]/40 px-3 py-1">
                              ★ Recorde: {score}
                            </span>
                          ) : (
                            <span className="text-xs font-bold rounded-full bg-muted px-3 py-1 text-foreground/60">
                              Novo
                            </span>
                          )}
                          <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition">
                            Jogar →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-3 min-w-[90px]">
      <div className="text-2xl">{icon}</div>
      <div className="font-display font-bold text-lg leading-none mt-1">{value}</div>
      <div className="text-xs text-foreground/60 font-bold mt-0.5">{label}</div>
    </div>
  );
}
