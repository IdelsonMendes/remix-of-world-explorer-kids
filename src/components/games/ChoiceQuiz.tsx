import { useEffect, useMemo, useRef, useState } from "react";
import { Trophy, RotateCcw, Volume2 } from "lucide-react";
import { usePassport } from "@/context/PassportContext";
import {
  ALL_COUNTRY_NAMES,
  ANIMAL_QUESTIONS,
  FLAG_CARDS,
  MONUMENT_QUESTIONS,
  ROUND_SIZE,
  SOUND_QUESTIONS,
  type MiniGameId,
} from "@/data/miniGames";

type QA = {
  prompt: React.ReactNode;
  hint?: string;
  answer: string;
  options: string[];
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(answer: string): string[] {
  const others = ALL_COUNTRY_NAMES.filter((n) => n !== answer);
  return shuffle([answer, ...shuffle(others).slice(0, 3)]);
}

function FlagBig({ iso, name }: { iso: string; name: string }) {
  return (
    <span
      className={`fi fi-${iso}`}
      role="img"
      aria-label={`Bandeira de ${name}`}
      style={{
        width: "14rem",
        height: "9rem",
        display: "inline-block",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "0.75rem",
        boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        border: "3px solid white",
      }}
    />
  );
}

function ImagePrompt({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={512}
        height={512}
        className="h-44 w-44 sm:h-52 sm:w-52 object-cover rounded-3xl border-4 border-card shadow-float"
      />
      {caption && (
        <span className="text-sm font-bold text-foreground/70">{caption}</span>
      )}
    </div>
  );
}

function SoundPrompt({
  word,
  phonetic,
  onPlay,
}: {
  word: string;
  phonetic?: string;
  onPlay: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={onPlay}
        className="group h-24 w-24 rounded-full bg-gradient-sunset text-white grid place-items-center shadow-float hover:scale-110 transition"
        aria-label={`Ouvir pronúncia de ${word}`}
      >
        <Volume2 className="h-10 w-10 group-active:scale-90 transition" />
      </button>
      <div className="text-center">
        <div className="text-3xl font-display font-bold">"{word}"</div>
        {phonetic && (
          <div className="text-sm text-foreground/60 mt-1">({phonetic})</div>
        )}
        <div className="text-xs text-foreground/50 mt-2">
          Toque no botão para ouvir!
        </div>
      </div>
    </div>
  );
}

export function ChoiceQuiz({
  gameId,
  title,
  emoji,
}: {
  gameId: MiniGameId;
  title: string;
  emoji: string;
}) {
  const { setMiniGameScore } = usePassport();
  const [seed, setSeed] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = (src: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const a = new Audio(src);
      audioRef.current = a;
      void a.play();
    } catch {
      /* noop */
    }
  };

  const questions = useMemo<QA[]>(() => {
    void seed;
    switch (gameId) {
      case "bandeiras":
        return shuffle(FLAG_CARDS)
          .slice(0, ROUND_SIZE)
          .map((c) => ({
            prompt: <FlagBig iso={c.iso} name={c.name} />,
            hint: "De qual país é esta bandeira?",
            answer: c.name,
            options: buildOptions(c.name),
          }));
      case "safari":
        return shuffle(ANIMAL_QUESTIONS)
          .slice(0, ROUND_SIZE)
          .map((a) => ({
            prompt: <ImagePrompt src={a.image} alt={a.animal} caption={a.animal} />,
            hint: "Em qual país vive este animal?",
            answer: a.country,
            options: buildOptions(a.country),
          }));
      case "sons":
        return shuffle(SOUND_QUESTIONS)
          .slice(0, ROUND_SIZE)
          .map((s) => ({
            prompt: (
              <SoundPrompt
                word={s.word}
                phonetic={s.phonetic}
                onPlay={() => playAudio(s.audio)}
              />
            ),
            hint: "De qual país vem essa saudação?",
            answer: s.country,
            options: buildOptions(s.country),
          }));
      case "monumentos":
        return shuffle(MONUMENT_QUESTIONS)
          .slice(0, ROUND_SIZE)
          .map((m) => ({
            prompt: <ImagePrompt src={m.image} alt={m.name} caption={m.name} />,
            hint: "Em qual país fica este monumento?",
            answer: m.country,
            options: buildOptions(m.country),
          }));
      default:
        return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, seed]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Auto-play audio when a sound question appears
  useEffect(() => {
    if (gameId !== "sons" || done) return;
    const q = SOUND_QUESTIONS;
    void q;
    // We rely on user click for play (better UX & no autoplay block)
  }, [idx, gameId, done]);

  const q = questions[idx];

  const handlePick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const correct = opt === q.answer;
    const nextScore = correct ? score + 1 : score;
    setTimeout(() => {
      if (idx + 1 < questions.length) {
        setScore(nextScore);
        setIdx(idx + 1);
        setPicked(null);
      } else {
        setScore(nextScore);
        setDone(true);
        const pct = Math.round((nextScore / questions.length) * 100);
        setMiniGameScore(gameId, pct);
      }
    }, 800);
  };

  const reset = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className="rounded-3xl bg-gradient-tropical p-1 shadow-float">
        <div className="rounded-[1.85rem] bg-card p-8 text-center">
          <div className="text-5xl">{emoji}</div>
          <h3 className="mt-3 text-2xl font-display font-bold">{title} concluído!</h3>
          <p className="mt-2 text-foreground/70">
            Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong>. Boa!
          </p>
          <button
            onClick={reset}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2 font-bold text-sm"
          >
            <RotateCcw className="h-4 w-4" /> Jogar de novo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">
          {emoji} {title}
        </h2>
        <span className="text-sm font-bold text-foreground/60">
          {idx + 1} / {questions.length}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-gradient-sunset transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 grid place-items-center min-h-[180px]">{q.prompt}</div>
      {q.hint && (
        <p className="mt-4 text-center text-lg font-semibold">{q.hint}</p>
      )}

      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        {q.options.map((opt) => {
          const isCorrect = picked && opt === q.answer;
          const isWrong = picked === opt && opt !== q.answer;
          return (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              disabled={!!picked}
              className={`rounded-2xl border-2 px-5 py-4 font-semibold transition text-left ${
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
      <p className="mt-4 text-sm text-foreground/60 inline-flex items-center gap-2">
        <Trophy className="h-4 w-4" /> Acertos: <strong>{score}</strong>
      </p>
    </div>
  );
}
