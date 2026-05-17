import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, SkipForward, Sparkles, X } from "lucide-react";
import luna from "@/assets/luna-mascot.png";

type Step = {
  id: string;
  target: string | null; // CSS selector, null = centered (no spotlight)
  emoji: string;
  title: string;
  lines: string[];
};

const STEPS: Step[] = [
  {
    id: "welcome",
    target: null,
    emoji: "🌎✨",
    title: "Oi! Eu sou a Luna Maria",
    lines: ["Vou te mostrar esse mundo divertido!"],
  },
  {
    id: "map",
    target: "[data-tour='map']",
    emoji: "🗺️",
    title: "Mapa de descoberta",
    lines: ["Aqui você viaja pelo mundo!", "Toque nos países para descobrir coisas incríveis."],
  },
  {
    id: "games",
    target: "[data-tour='games']",
    emoji: "🎮",
    title: "Brincadeiras",
    lines: ["Aqui ficam os jogos!", "Você aprende brincando."],
  },
  {
    id: "profile",
    target: "[data-tour='profile']",
    emoji: "🧑‍🚀",
    title: "Seu personagem",
    lines: ["Aqui você muda seu avatar e nome.", "Deixe do seu jeito!"],
  },
  {
    id: "passport",
    target: "[data-tour='passport']",
    emoji: "📒",
    title: "Passaporte digital",
    lines: ["Guarda suas aventuras!", "Colecione países e conquistas."],
  },
  {
    id: "finish",
    target: null,
    emoji: "🚀",
    title: "Agora é sua vez!",
    lines: ["Vamos explorar o mundo juntos!"],
  },
];

type Rect = { top: number; left: number; width: number; height: number };

const PAD = 12;

export function LobbyTour({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  const step = STEPS[stepIdx];

  // Reset to first step every time tour opens
  useEffect(() => {
    if (open) setStepIdx(0);
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Track viewport
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Measure target each step / on resize / scroll
  useEffect(() => {
    if (!open) return;

    const measure = () => {
      if (!step.target) {
        setRect(null);
        return;
      }
      const el = document.querySelector(step.target) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      // Scroll into view smoothly
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // Measure after scroll settles
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setRect({
          top: r.top - PAD,
          left: r.left - PAD,
          width: r.width + PAD * 2,
          height: r.height + PAD * 2,
        });
      });
    };

    measure();
    // Re-measure shortly after to catch scroll-into-view settling
    const t1 = window.setTimeout(measure, 350);
    const t2 = window.setTimeout(measure, 700);

    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step.target, stepIdx]);

  const isLast = stepIdx === STEPS.length - 1;
  const isFirst = stepIdx === 0;

  // Decide bubble position
  const bubblePos = useMemo(() => {
    if (!rect || vp.h === 0) {
      // Centered
      return { mode: "center" as const };
    }
    const spaceBelow = vp.h - (rect.top + rect.height);
    const spaceAbove = rect.top;
    if (spaceBelow >= 220 || spaceBelow >= spaceAbove) {
      return { mode: "below" as const, y: Math.min(rect.top + rect.height + 14, vp.h - 240) };
    }
    return { mode: "above" as const, y: Math.max(rect.top - 14 - 220, 12) };
  }, [rect, vp]);

  const next = () => {
    if (isLast) onClose();
    else setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const prev = () => setStepIdx((i) => Math.max(i - 1, 0));

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="tour"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100]"
        aria-modal="true"
        role="dialog"
      >
        {/* Spotlight backdrop */}
        {rect ? (
          <motion.div
            key={step.id + "-spot"}
            initial={false}
            animate={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute rounded-3xl pointer-events-none"
            style={{
              boxShadow:
                "0 0 0 9999px rgba(15, 23, 42, 0.72), 0 0 0 4px rgba(255,255,255,0.9), 0 0 40px 8px rgba(255, 209, 102, 0.55)",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900/72 pointer-events-none" />
        )}

        {/* Skip button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-card/90 backdrop-blur px-4 py-2 text-sm font-bold shadow-sticker hover:-translate-y-0.5 transition"
        >
          <SkipForward className="h-4 w-4" /> Pular
        </button>

        {/* Bubble + Luna */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[min(92vw,420px)]"
          style={
            bubblePos.mode === "center"
              ? { top: "50%", transform: "translate(-50%, -50%)" }
              : { top: bubblePos.y }
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="relative"
            >
              <div className="rounded-[2rem] bg-gradient-tropical p-1 shadow-float">
                <div className="rounded-[1.85rem] bg-card p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <motion.img
                      src={luna}
                      alt="Luna Maria"
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain bg-accent/30 shadow-sticker shrink-0"
                      animate={{ rotate: [0, -6, 6, 0], y: [0, -4, 0] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center gap-1 rounded-full bg-accent/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-3 w-3" /> {stepIdx + 1} / {STEPS.length}
                      </div>
                      <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-bold leading-tight">
                        {step.title} <span className="ml-1">{step.emoji}</span>
                      </h3>
                      <div className="mt-2 space-y-1 text-foreground/80 text-sm sm:text-base font-semibold">
                        {step.lines.map((l, i) => (
                          <p key={i}>{l}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step dots */}
                  <div className="mt-5 flex items-center justify-center gap-1.5">
                    {STEPS.map((s, i) => (
                      <span
                        key={s.id}
                        className={`h-2 rounded-full transition-all ${
                          i === stepIdx ? "w-6 bg-primary" : "w-2 bg-foreground/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={prev}
                      disabled={isFirst}
                      className="rounded-full px-4 py-2 text-sm font-bold text-foreground/60 hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold shadow-sticker hover:-translate-y-0.5 transition"
                    >
                      {isLast ? (
                        <>
                          Vamos lá! <Sparkles className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Próximo <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Close (small X) */}
              <button
                onClick={onClose}
                aria-label="Fechar tutorial"
                className="absolute -top-2 -right-2 h-8 w-8 grid place-items-center rounded-full bg-card border-2 border-border shadow-sticker hover:scale-105 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const KEY_PREFIX = "lobby-tour-done:";

export function tourStorageKey(userId: string | null | undefined) {
  return `${KEY_PREFIX}${userId ?? "anon"}`;
}

export function hasSeenTour(userId: string | null | undefined) {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(tourStorageKey(userId)) === "1";
  } catch {
    return true;
  }
}

export function markTourSeen(userId: string | null | undefined) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(tourStorageKey(userId), "1");
  } catch {
    /* noop */
  }
}

export function clearTourSeen(userId: string | null | undefined) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(tourStorageKey(userId));
  } catch {
    /* noop */
  }
}
