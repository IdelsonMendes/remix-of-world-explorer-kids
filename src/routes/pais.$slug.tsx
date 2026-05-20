import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Gamepad2, Check, Stamp as StampIcon, Trophy, Sparkles, Volume2, VolumeX, PartyPopper, Video as VideoIcon } from "lucide-react";
import { AdventureVideos } from "@/components/AdventureVideos";
import { COUNTRIES } from "@/data/countries";
import { COUNTRY_EXTRAS } from "@/data/countryExtras";
import type { CountrySlug } from "@/context/PassportContext";
import { usePassport } from "@/context/PassportContext";
import { useNarration } from "@/context/NarrationContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SmartBackLink } from "@/components/SmartBackLink";

const VALID_SLUGS = Object.keys(COUNTRIES) as CountrySlug[];

export const Route = createFileRoute("/pais/$slug")({
  component: CountryPage,
  loader: ({ params }) => {
    if (!VALID_SLUGS.includes(params.slug as CountrySlug)) throw notFound();
    return { slug: params.slug as CountrySlug };
  },
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-4xl font-display font-bold">País não encontrado 🧭</h1>
        <p className="mt-2 text-foreground/70">Vamos voltar para o mapa?</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold"
        >
          Voltar ao mapa
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Algo deu errado 😢</h1>
        <p className="mt-2 text-foreground/70">{error.message}</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold">
          Voltar
        </Link>
      </div>
    </div>
  ),
  head: ({ params }) => {
    const country = COUNTRIES[params.slug as CountrySlug];
    if (!country) return { meta: [{ title: "País — Exploradores do Mundo" }] };
    return {
      meta: [
        { title: `${country.name} ${country.emoji} — Exploradores do Mundo` },
        { name: "description", content: `Descubra ${country.name}: ${country.fact}` },
        { property: "og:title", content: `${country.name} — Exploradores do Mundo` },
        { property: "og:description", content: country.fact },
      ],
    };
  },
});

type Tab = "historia" | "bandeira" | "curiosidades" | "infantil" | "brincadeira" | "videos";

function CountryPage() {
  const { slug } = Route.useParams();
  const country = COUNTRIES[slug as CountrySlug];
  const {
    explorerName,
    storyRead,
    gamesDone,
    markStoryRead,
    markGamesDone,
    addStamp,
    hasStamp,
    isLoggedIn,
  } = usePassport();

  const [tab, setTab] = useState<Tab>("historia");
  const [showStampToast, setShowStampToast] = useState(false);

  const ready = storyRead[country.slug] && gamesDone[country.slug];

  useEffect(() => {
    if (ready && !hasStamp(country.slug)) {
      addStamp(country.slug);
      setShowStampToast(true);
      const t = setTimeout(() => setShowStampToast(false), 4500);
      return () => clearTimeout(t);
    }
  }, [ready, country.slug, hasStamp, addStamp]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <SmartBackLink
          fallbackTo={isLoggedIn ? "/lobby" : "/"}
          label={isLoggedIn ? "Voltar" : "Voltar ao mapa"}
        />

        {/* Header card */}
        <div
          className="mt-5 rounded-[2.5rem] p-8 sm:p-10 shadow-float border-4 border-card"
          style={{ background: `color-mix(in oklab, ${country.color} 35%, white)` }}
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="text-7xl sm:text-8xl drop-shadow">{country.emoji}</div>
            <div className="flex-1 min-w-[220px]">
              <h1 className="text-4xl sm:text-5xl font-display font-bold">{country.name}</h1>
              <p className="mt-2 text-lg text-foreground/80">{country.fact}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded-full bg-card px-3 py-1">🏛 {country.capital}</span>
                <span className="rounded-full bg-card px-3 py-1">🗣 {country.language}</span>
                <span className="rounded-full bg-card px-3 py-1">💰 {country.currency}</span>
              </div>
            </div>
            {hasStamp(country.slug) && (
              <div className="rounded-2xl bg-card border-2 border-[var(--mint)] px-4 py-3 text-center shadow-sticker">
                <StampIcon className="h-5 w-5 mx-auto text-[var(--mint)]" />
                <div className="text-xs font-bold mt-1">Carimbado!</div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
            <ProgressPill done={storyRead[country.slug]} icon="📖" label="História lida" />
            <ProgressPill done={gamesDone[country.slug]} icon="🎮" label="Jogos completos" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          <TabButton active={tab === "historia"} onClick={() => setTab("historia")}>
            <BookOpen className="h-4 w-4" /> História
          </TabButton>
          <TabButton active={tab === "infantil"} onClick={() => setTab("infantil")}>
            <Sparkles className="h-4 w-4" /> Histórias Infantis
          </TabButton>
          <TabButton active={tab === "brincadeira"} onClick={() => setTab("brincadeira")}>
            <PartyPopper className="h-4 w-4" /> Brincadeiras Locais
          </TabButton>
          <TabButton active={tab === "videos"} onClick={() => setTab("videos")}>
            <VideoIcon className="h-4 w-4" /> Vídeos da Aventura
          </TabButton>
          <TabButton active={tab === "bandeira"} onClick={() => setTab("bandeira")}>
            <Gamepad2 className="h-4 w-4" /> Quiz da Bandeira
          </TabButton>
          <TabButton active={tab === "curiosidades"} onClick={() => setTab("curiosidades")}>
            <Trophy className="h-4 w-4" /> Quiz de Curiosidades
          </TabButton>
        </div>

        <div className="mt-6">
          {tab === "historia" && (
            <StorySection
              paragraphs={country.story}
              done={storyRead[country.slug]}
              onFinish={() => markStoryRead(country.slug)}
            />
          )}
          {tab === "infantil" && (
            <ChildStorySection
              countryName={country.name}
              color={country.color}
              extras={COUNTRY_EXTRAS[country.slug]}
            />
          )}
          {tab === "brincadeira" && (
            <LocalGameSection
              countryName={country.name}
              color={country.color}
              extras={COUNTRY_EXTRAS[country.slug]}
            />
          )}
          {tab === "videos" && (
            <AdventureVideos countryName={country.name} color={country.color} />
          )}
          {tab === "bandeira" && (
            <QuizGame
              key={`flag-${country.slug}`}
              title="Quiz da Bandeira 🏳️"
              questions={country.flagQuiz}
              quizKey={`flag-${country.slug}`}
            />
          )}
          {tab === "curiosidades" && (
            <QuizGame
              key={`trivia-${country.slug}`}
              title="Quiz de Curiosidades 🧠"
              questions={country.triviaQuiz}
              quizKey={`trivia-${country.slug}`}
            />
          )}
        </div>


        {/* Combined games tracker */}
        <GamesTracker
          countrySlug={country.slug}
          onAllDone={() => markGamesDone(country.slug)}
        />

        {/* Stamp earned toast */}
        <AnimatePresence>
          {showStampToast && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-3xl bg-gradient-sunset text-white px-6 py-4 shadow-float flex items-center gap-3 max-w-sm"
            >
              <div className="text-3xl">{country.emoji}</div>
              <div>
                <div className="font-display font-bold">
                  Carimbo conquistado{explorerName ? `, ${explorerName}` : ""}! 🎉
                </div>
                <div className="text-sm opacity-90">
                  {country.name} adicionado ao seu passaporte.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProgressPill({ done, icon, label }: { done: boolean; icon: string; label: string }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 ${
        done
          ? "bg-[var(--mint)]/30 border-[var(--mint)]"
          : "bg-card border-border/50"
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-semibold flex-1">{label}</span>
      {done ? (
        <Check className="h-5 w-5 text-[var(--mint)]" />
      ) : (
        <span className="text-xs text-foreground/50 font-bold">PENDENTE</span>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border-2 transition ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sticker"
          : "bg-card border-border hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function StorySection({
  paragraphs,
  done,
  onFinish,
}: {
  paragraphs: string[];
  done: boolean;
  onFinish: () => void;
}) {
  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <h2 className="text-2xl font-display font-bold flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" /> História do país
      </h2>
      <div className="mt-4 space-y-5 text-lg sm:text-xl leading-relaxed text-foreground/85">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <button
        onClick={onFinish}
        disabled={done}
        className={`mt-6 rounded-full px-6 py-3 font-bold transition ${
          done
            ? "bg-[var(--mint)]/40 text-foreground cursor-default"
            : "bg-primary text-primary-foreground shadow-sticker hover:-translate-y-0.5"
        }`}
      >
        {done ? "✓ História lida" : "Marcar como lida"}
      </button>
    </div>
  );
}

type QuizQ = { question: string; options: string[]; answer: string };

type QuizProgress = {
  done: boolean;
  score: number;
  total: number;
};

// Session-only progress for the MVP (lost on refresh)
const quizProgress: Record<string, QuizProgress> = {};

function QuizGame({
  title,
  questions,
  quizKey,
}: {
  title: string;
  questions: QuizQ[];
  quizKey: string;
  onWin?: () => void;
}) {
  const savedProgress = quizProgress[quizKey];
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(savedProgress?.score ?? 0);
  const [done, setDone] = useState(savedProgress?.done ?? false);

  const q = questions[idx];

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const nextScore = opt === q.answer ? score + 1 : score;
    if (opt === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setIdx(idx + 1);
        setPicked(null);
      } else {
        quizProgress[quizKey] = { done: true, score: nextScore, total: questions.length };
        setScore(nextScore);
        setDone(true);
        window.dispatchEvent(new CustomEvent("quiz-progress-changed", { detail: quizKey }));
      }
    }, 900);
  };

  const reset = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    delete quizProgress[quizKey];
    window.dispatchEvent(new CustomEvent("quiz-progress-changed", { detail: quizKey }));
  };

  if (done) {
    const finalScore = quizProgress[quizKey]?.score ?? score;
    return (
      <div className="rounded-3xl bg-gradient-tropical p-1 shadow-float">
        <div className="rounded-[1.85rem] bg-card p-8 text-center">
          <div className="text-5xl">🎉</div>
          <h3 className="mt-3 text-2xl font-display font-bold">{title} concluído!</h3>
          <p className="mt-2 text-foreground/70">
            Você acertou <strong>{finalScore}</strong> de <strong>{questions.length}</strong>.
          </p>
          <button
            onClick={reset}
            className="mt-5 rounded-full bg-card border-2 border-border px-5 py-2 font-bold text-sm hover:border-primary/40"
          >
            Jogar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">{title}</h2>
        <span className="text-sm font-bold text-foreground/60">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-sunset transition-all"
          style={{ width: `${((idx) / questions.length) * 100}%` }}
        />
      </div>
      <p className="mt-6 text-xl font-semibold">{q.question}</p>
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isCorrect = picked && opt === q.answer;
          const isWrong = picked === opt && opt !== q.answer;
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={!!picked}
              className={`rounded-2xl border-2 px-5 py-4 text-left font-semibold transition ${
                isCorrect
                  ? "bg-[var(--mint)]/40 border-[var(--mint)]"
                  : isWrong
                    ? "bg-destructive/15 border-destructive"
                    : "bg-card border-border hover:border-primary/40 hover:-translate-y-0.5"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-foreground/60">
        Pontuação: <strong>{score}</strong>
      </p>
    </div>
  );
}

function GamesTracker({
  countrySlug,
  onAllDone,
}: {
  countrySlug: CountrySlug;
  onAllDone: () => void;
}) {
  const flagKey = `flag-${countrySlug}`;
  const triviaKey = `trivia-${countrySlug}`;

  const [version, setVersion] = useState(0);

  useEffect(() => {
    const handler = () => setVersion((n) => n + 1);
    window.addEventListener("quiz-progress-changed", handler);
    return () => window.removeEventListener("quiz-progress-changed", handler);
  }, []);

  const bothDone = useMemo(
    () => !!quizProgress[flagKey]?.done && !!quizProgress[triviaKey]?.done,
    [flagKey, triviaKey, version],
  );

  useEffect(() => {
    if (bothDone) onAllDone();
  }, [bothDone, onAllDone]);

  return null;
}

// ============= Histórias Infantis =============

function ChildStorySection({
  countryName,
  color,
  extras,
}: {
  countryName: string;
  color: string;
  extras: (typeof COUNTRY_EXTRAS)[CountrySlug];
}) {
  const { speak, stop, speaking } = useNarration();
  const story = extras.childStory;

  const fullText = useMemo(
    () =>
      `Luna apresenta: ${story.title}. ${story.paragraphs.join(" ")} ${
        story.moral ? `Moral da história: ${story.moral}` : ""
      }`,
    [story],
  );

  useEffect(() => () => stop(), [stop]);

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <div
        className="rounded-2xl p-5 mb-5 flex items-start gap-3"
        style={{ background: `color-mix(in oklab, ${color} 25%, white)` }}
      >
        <div className="text-3xl">🌟</div>
        <p className="text-base sm:text-lg font-semibold text-foreground/85">
          <strong>Luna Matias diz:</strong> “Vamos viajar com a imaginação por uma história de {countryName}? Senta aqui pertinho e escuta!”
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-6xl">{story.emoji}</div>
        <div className="flex-1 min-w-[180px]">
          <h2 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" /> {story.title}
          </h2>
        </div>
        <button
          onClick={() => (speaking ? stop() : speak(fullText))}
          aria-label={speaking ? "Parar narração" : "Ouvir história"}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition"
        >
          {speaking ? (
            <>
              <VolumeX className="h-5 w-5" /> Parar
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" /> Ouvir História
            </>
          )}
        </button>
      </div>

      <div className="mt-6 space-y-5 text-lg sm:text-xl leading-relaxed text-foreground/85">
        {story.paragraphs.map((p, i) => (
          <p key={i}>
            <span className="mr-2 text-2xl align-middle">{["📖", "✨", "🌈", "💫"][i % 4]}</span>
            {p}
          </p>
        ))}
      </div>

      {story.moral && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-5">
          <div className="text-sm font-bold uppercase tracking-wider text-primary">
            ✨ Moral da história
          </div>
          <p className="mt-1 text-lg font-semibold">{story.moral}</p>
        </div>
      )}
    </div>
  );
}

// ============= Brincadeiras Locais =============

function LocalGameSection({
  countryName,
  color,
  extras,
}: {
  countryName: string;
  color: string;
  extras: (typeof COUNTRY_EXTRAS)[CountrySlug];
}) {
  const { speak, stop, speaking } = useNarration();
  const game = extras.localGame;
  const [taps, setTaps] = useState(0);
  const [won, setWon] = useState(false);

  const intro = useMemo(
    () =>
      `Brincadeira de ${countryName}: ${game.name}. ${game.description}. Regras: ${game.rules.join(" ")}`,
    [countryName, game],
  );

  useEffect(() => () => stop(), [stop]);

  const handleTap = () => {
    if (won) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= game.interaction.goal) {
      setWon(true);
      speak(`Parabéns! Você completou ${game.name}!`);
    }
  };

  const reset = () => {
    setTaps(0);
    setWon(false);
  };

  const pct = Math.min(100, (taps / game.interaction.goal) * 100);

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <div
        className="rounded-2xl p-5 mb-5 flex items-start gap-3"
        style={{ background: `color-mix(in oklab, ${color} 25%, white)` }}
      >
        <div className="text-3xl">🎉</div>
        <p className="text-base sm:text-lg font-semibold text-foreground/85">
          <strong>Luna Matias diz:</strong> “As crianças de {countryName} amam essa brincadeira! Vem aprender comigo e tente jogar aqui também!”
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-6xl">{game.emoji}</div>
        <div className="flex-1 min-w-[180px]">
          <h2 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-primary" /> {game.name}
          </h2>
          <p className="mt-1 text-foreground/70">{game.description}</p>
        </div>
        <button
          onClick={() => (speaking ? stop() : speak(intro))}
          aria-label={speaking ? "Parar narração" : "Ouvir regras"}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition"
        >
          {speaking ? (
            <>
              <VolumeX className="h-5 w-5" /> Parar
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" /> Ouvir Regras
            </>
          )}
        </button>
      </div>

      {/* Regras */}
      <div className="mt-6 rounded-2xl bg-muted/40 p-5 border-2 border-border/40">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          📋 Como brincar
        </h3>
        <ol className="mt-3 space-y-2">
          {game.rules.map((r, i) => (
            <li key={i} className="flex gap-3 text-base sm:text-lg">
              <span
                className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground font-bold grid place-items-center text-sm"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="text-foreground/85">{r}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Mini-jogo interativo */}
      <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5 sm:p-6">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          🎮 Jogue agora! <span className="text-sm font-normal text-foreground/60">— {game.interaction.prompt}</span>
        </h3>

        <div className="mt-4 h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full bg-gradient-sunset"
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-foreground/70">
          {taps} / {game.interaction.goal}
        </p>

        <div className="mt-5 grid place-items-center min-h-[180px]">
          {won ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="text-6xl mb-2">🏆</div>
              <p className="text-xl font-display font-bold">Parabéns! Você jogou {game.name}!</p>
              <button
                onClick={reset}
                className="mt-4 inline-flex rounded-full bg-card border-2 border-border px-5 py-2 font-bold text-sm hover:border-primary/40"
              >
                Jogar de novo
              </button>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleTap}
              whileTap={{ scale: 0.85, rotate: -8 }}
              aria-label={game.interaction.prompt}
              className="text-7xl sm:text-8xl drop-shadow-lg hover:scale-110 active:scale-95 transition select-none cursor-pointer rounded-full p-4"
              style={{ background: `color-mix(in oklab, ${color} 30%, transparent)` }}
            >
              {game.interaction.target}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
