import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy, Check } from "lucide-react";
import { SCENE_IMAGES, SCENE_STICKERS } from "@/data/miniGames";
import { usePassport } from "@/context/PassportContext";

type Sticker = {
  id: number;
  emoji: string;
  x: number; // 0-100 (%)
  y: number; // 0-100 (%)
  size: number; // rem
  rotate: number;
  found: boolean;
};

const NUM_DIFFS = 7;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildStickers(): Sticker[] {
  const emojis = shuffle(SCENE_STICKERS).slice(0, NUM_DIFFS);
  const placed: Sticker[] = [];
  let attempts = 0;
  while (placed.length < NUM_DIFFS && attempts < 200) {
    attempts++;
    const x = rand(8, 88);
    const y = rand(8, 88);
    // avoid overlap (min distance ~14%)
    if (placed.some((p) => Math.hypot(p.x - x, p.y - y) < 14)) continue;
    placed.push({
      id: placed.length,
      emoji: emojis[placed.length],
      x,
      y,
      size: rand(2, 3.2),
      rotate: rand(-25, 25),
      found: false,
    });
  }
  return placed;
}

export function SpotDifferencesGame() {
  const { setMiniGameScore } = usePassport();
  const [seed, setSeed] = useState(0);
  const scene = useMemo(() => {
    void seed;
    return SCENE_IMAGES[Math.floor(Math.random() * SCENE_IMAGES.length)];
  }, [seed]);
  const [stickers, setStickers] = useState<Sticker[]>(() => buildStickers());
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [flashWrong, setFlashWrong] = useState(false);

  useEffect(() => {
    setStickers(buildStickers());
    setMistakes(0);
    setDone(false);
  }, [seed]);

  const foundCount = stickers.filter((s) => s.found).length;

  useEffect(() => {
    if (foundCount === NUM_DIFFS && !done) {
      setDone(true);
      const score = Math.max(20, 100 - mistakes * 10);
      setMiniGameScore("seteerros", score);
    }
  }, [foundCount, done, mistakes, setMiniGameScore]);

  const reset = () => setSeed((s) => s + 1);

  const handleStickerClick = (id: number) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, found: true } : s)),
    );
  };

  const handleWrongClick = (e: React.MouseEvent) => {
    // Only count as a wrong click if it's the image itself (not a sticker button)
    if ((e.target as HTMLElement).closest("button[data-sticker]")) return;
    if (done) return;
    setMistakes((m) => m + 1);
    setFlashWrong(true);
    setTimeout(() => setFlashWrong(false), 300);
  };

  return (
    <div className="rounded-3xl bg-card p-5 sm:p-7 border-2 border-border/40 shadow-soft">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold">🔍 Sete Erros</h2>
          <p className="text-sm text-foreground/70">
            {scene.name} <span className="text-foreground/50">— {scene.country}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold rounded-full bg-[var(--mint)]/40 px-3 py-1">
            <Check className="inline h-4 w-4 mr-1" /> {foundCount}/{NUM_DIFFS}
          </span>
          <span className="text-sm font-bold rounded-full bg-muted px-3 py-1 text-foreground/70">
            Erros: {mistakes}
          </span>
          <button
            onClick={reset}
            className="rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold hover:border-primary/40 inline-flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" /> Nova cena
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/70">
        Compare as duas imagens. Toque nos <strong>7 elementos extras</strong> que
        aparecem só na cena da direita!
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original */}
        <figure className="relative">
          <img
            src={scene.image}
            alt={`${scene.name} (original)`}
            className="w-full aspect-square object-cover rounded-2xl border-4 border-card shadow-soft"
            loading="lazy"
          />
          <figcaption className="absolute top-2 left-2 text-xs font-bold bg-card/90 rounded-full px-3 py-1">
            Original
          </figcaption>
        </figure>

        {/* Right: With stickers */}
        <figure className="relative">
          <div
            className={`relative w-full aspect-square rounded-2xl overflow-hidden border-4 transition-colors ${
              flashWrong ? "border-destructive" : "border-card"
            } shadow-soft`}
            onClick={handleWrongClick}
          >
            <img
              src={scene.image}
              alt={`${scene.name} (com diferenças)`}
              className="absolute inset-0 w-full h-full object-cover select-none"
              loading="lazy"
              draggable={false}
            />
            {stickers.map((s) => (
              <button
                key={s.id}
                data-sticker
                onClick={(e) => {
                  e.stopPropagation();
                  if (!s.found && !done) handleStickerClick(s.id);
                }}
                aria-label={s.found ? "Encontrado" : "Diferença"}
                className="absolute grid place-items-center"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: `translate(-50%, -50%) rotate(${s.rotate}deg)`,
                  fontSize: `${s.size}rem`,
                  lineHeight: 1,
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                  cursor: s.found ? "default" : "pointer",
                }}
              >
                {s.found ? (
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 0.4 }}
                    className="grid place-items-center h-12 w-12 rounded-full bg-[var(--mint)]/80 text-white"
                    style={{ fontSize: "1.5rem" }}
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span aria-hidden>{s.emoji}</span>
                )}
              </button>
            ))}
          </div>
          <figcaption className="absolute top-2 left-2 text-xs font-bold bg-card/90 rounded-full px-3 py-1">
            Encontre as diferenças
          </figcaption>
        </figure>
      </div>

      {done && (
        <div className="mt-6 rounded-2xl bg-gradient-sunset text-white p-5 text-center shadow-sticker">
          <Trophy className="inline h-5 w-5 mr-1" />
          <strong>
            Encontrou todas! 🎉 ({mistakes} {mistakes === 1 ? "erro" : "erros"})
          </strong>
        </div>
      )}
    </div>
  );
}
