import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import { FLAG_CARDS, ROUND_SIZE } from "@/data/miniGames";
import { usePassport } from "@/context/PassportContext";
import cardBack from "@/assets/card-back.png";

type Card = { id: number; iso: string; name: string; matched: boolean };

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildDeck(seed: number): Card[] {
  void seed;
  const subset = shuffle(FLAG_CARDS).slice(0, ROUND_SIZE);
  const doubled = [...subset, ...subset];
  return shuffle(doubled).map((c, i) => ({
    id: i,
    iso: c.iso,
    name: c.name,
    matched: false,
  }));
}

export function MemoryGame() {
  const { setMiniGameScore } = usePassport();
  const [seed, setSeed] = useState(0);
  const initialDeck = useMemo(() => buildDeck(seed), [seed]);
  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const [shuffling, setShuffling] = useState(true);
  const [memorizePhase, setMemorizePhase] = useState(true);
  const [memorizeCount, setMemorizeCount] = useState(5);

  const reset = () => {
    setSeed((s) => s + 1);
    setOpen([]);
    setMoves(0);
    setDone(false);
    setMemorizePhase(true);
    setMemorizeCount(5);
  };

  // Refresh deck, play shuffle animation and start memorize countdown
  useEffect(() => {
    setDeck(initialDeck);
    setShuffling(true);
    setMemorizePhase(true);
    setMemorizeCount(5);

    const shuffleTimer = setTimeout(() => setShuffling(false), 900);

    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setMemorizeCount(count);
      if (count <= 0) {
        clearInterval(interval);
        setMemorizePhase(false);
      }
    }, 1000);

    return () => {
      clearTimeout(shuffleTimer);
      clearInterval(interval);
    };
  }, [initialDeck]);

  const allMatched = deck.length > 0 && deck.every((c) => c.matched);

  useEffect(() => {
    if (allMatched && !done) {
      setDone(true);
      const score = Math.max(0, 100 - (moves - ROUND_SIZE) * 5);
      setMiniGameScore("memoria", score);
    }
  }, [allMatched, done, moves, setMiniGameScore]);

  const flip = (idx: number) => {
    if (memorizePhase) return;
    if (shuffling) return;
    if (open.length === 2) return;
    if (open.includes(idx)) return;
    if (deck[idx].matched) return;
    const next = [...open, idx];
    setOpen(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].iso === deck[b].iso) {
        setTimeout(() => {
          setDeck((d) =>
            d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)),
          );
          setOpen([]);
        }, 600);
      } else {
        setTimeout(() => setOpen([]), 900);
      }
    }
  };

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold">🧠 Jogo da Memória</h2>
          <p className="text-sm text-foreground/70">
            Encontre os pares de bandeiras iguais! ({ROUND_SIZE} pares por partida)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">Jogadas: {moves}</span>
          <button
            onClick={reset}
            className="rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold hover:border-primary/40 inline-flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
        </div>
      </div>

      <div
        className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4"
        style={{ perspective: 1000 }}
      >
        <AnimatePresence mode="popLayout">
          {deck.map((card, i) => {
            const isOpen = memorizePhase || open.includes(i) || card.matched;
            // Shuffle animation: cards fly in from random offsets
            const initialX = ((i * 73) % 11 - 5) * 30;
            const initialY = ((i * 53) % 7 - 3) * 30;
            return (
              <motion.button
                key={`${seed}-${card.id}`}
                onClick={() => flip(i)}
                whileTap={{ scale: 0.95 }}
                initial={{
                  x: initialX,
                  y: initialY,
                  rotate: (initialX + initialY) % 30,
                  opacity: 0,
                  scale: 0.6,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  rotate: 0,
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.55,
                  delay: shuffling ? (i * 0.04) : 0,
                  type: "spring",
                  stiffness: 180,
                  damping: 16,
                }}
                aria-label={isOpen ? `Bandeira de ${card.name}` : "Carta virada"}
                className={`relative aspect-[3/4] rounded-2xl border-4 overflow-hidden ${
                  isOpen
                    ? card.matched
                      ? "border-[var(--mint)]"
                      : "border-primary"
                    : "border-card"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Back of card */}
                  <div
                    className="absolute inset-0 grid place-items-center bg-gradient-tropical"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={cardBack}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      width={512}
                      height={512}
                      className="h-3/5 w-3/5 object-contain drop-shadow-md opacity-95"
                    />
                  </div>
                  {/* Front of card (flag) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span
                      className={`fi fi-${card.iso}`}
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        display: "block",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] sm:text-xs font-bold text-white bg-black/55 rounded-md px-1 py-0.5 text-center truncate">
                      {card.name}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {done && (
        <div className="mt-6 rounded-2xl bg-gradient-sunset text-white p-5 text-center shadow-sticker">
          <Trophy className="inline h-5 w-5 mr-1" />
          <strong>Mandou bem! Você achou todos os pares em {moves} jogadas! 🎉</strong>
        </div>
      )}
    </div>
  );
}
