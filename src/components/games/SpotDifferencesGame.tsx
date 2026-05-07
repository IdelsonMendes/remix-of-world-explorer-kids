import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Check, Lightbulb } from "lucide-react";
import { SPOT_DIFF_SCENES, type SpotDiffScene } from "@/data/miniGames";
import { usePassport } from "@/context/PassportContext";

const HIT_RADIUS = 12; // % distance tolerance for a click to count
const NUM_DIFFS = 7;

function pickScene(prevId?: string): SpotDiffScene {
  const pool = SPOT_DIFF_SCENES.filter((s) => s.id !== prevId);
  const arr = pool.length ? pool : SPOT_DIFF_SCENES;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SpotDifferencesGame() {
  const { setMiniGameScore } = usePassport();
  const [scene, setScene] = useState<SpotDiffScene>(() => pickScene());
  const [found, setFound] = useState<Array<{ x: number; y: number } | null>>(() =>
    new Array(scene.diffs.length).fill(null),
  );
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);
  const [flashWrong, setFlashWrong] = useState<{ x: number; y: number } | null>(null);
  const [hintIdx, setHintIdx] = useState<number | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  const diffs = scene.diffs;
  const foundCount = found.filter(Boolean).length;
  const totalDiffs = Math.min(diffs.length, NUM_DIFFS);

  useEffect(() => {
    if (foundCount >= totalDiffs && !done) {
      setDone(true);
      const score = Math.max(20, 100 - mistakes * 8);
      setMiniGameScore("seteerros", score);
    }
  }, [foundCount, totalDiffs, done, mistakes, setMiniGameScore]);

  const reset = () => {
    const next = pickScene(scene.id);
    setScene(next);
    setFound(new Array(next.diffs.length).fill(null));
    setMistakes(0);
    setDone(false);
    setHintIdx(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (done) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Compute distance in pixel space so wide images don't bias the X axis
    const aspect = rect.width / rect.height;
    let hitIdx = -1;
    let bestDist = Infinity;
    diffs.forEach((d, i) => {
      if (found[i]) return;
      const dx = (d.x - x) * aspect;
      const dy = d.y - y;
      const dist = Math.hypot(dx, dy);
      if (dist <= HIT_RADIUS && dist < bestDist) {
        bestDist = dist;
        hitIdx = i;
      }
    });

    if (hitIdx >= 0) {
      setFound((prev) => prev.map((v, i) => (i === hitIdx ? { x, y } : v)));
    } else {
      setMistakes((m) => m + 1);
      setFlashWrong({ x, y });
      setTimeout(() => setFlashWrong(null), 600);
    }
  };

  const useHint = () => {
    const remaining = diffs.map((_, i) => i).filter((i) => !found[i]);
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    setHintIdx(pick);
    setMistakes((m) => m + 1); // dica custa um "erro"
    setTimeout(() => setHintIdx(null), 2400);
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
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold rounded-full bg-[var(--mint)]/40 px-3 py-1">
            <Check className="inline h-4 w-4 mr-1" /> {foundCount}/{totalDiffs}
          </span>
          <span className="text-sm font-bold rounded-full bg-muted px-3 py-1 text-foreground/70">
            Erros: {mistakes}
          </span>
          <button
            onClick={useHint}
            disabled={done || foundCount === totalDiffs}
            className="rounded-full bg-card border-2 border-border px-3 py-2 text-sm font-bold hover:border-[var(--sunshine)] inline-flex items-center gap-1 disabled:opacity-40"
            title="Mostra uma diferença (custa 1 erro)"
          >
            <Lightbulb className="h-4 w-4" /> Dica
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-card border-2 border-border px-3 py-2 text-sm font-bold hover:border-primary/40 inline-flex items-center gap-1"
          >
            <RotateCcw className="h-4 w-4" /> Nova cena
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground/70">
        Compare as duas imagens e toque, na imagem da <strong>direita</strong>,
        nos <strong>{totalDiffs} elementos diferentes</strong>!
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Original */}
        <figure className="m-0">
          <figcaption className="text-xs font-bold text-foreground/70 mb-1.5 px-1">
            Original
          </figcaption>
          <img
            src={scene.original}
            alt={`${scene.name} (original)`}
            style={{ aspectRatio: scene.aspect }}
            className="w-full object-cover rounded-2xl border-4 border-card shadow-soft select-none"
            loading="lazy"
            draggable={false}
          />
        </figure>

        {/* Right: Modified — clickable */}
        <figure className="m-0">
          <figcaption className="text-xs font-bold text-foreground/70 mb-1.5 px-1">
            Encontre as diferenças
          </figcaption>
          <div
            ref={imgRef}
            onClick={handleClick}
            style={{ aspectRatio: scene.aspect }}
            className="relative w-full rounded-2xl overflow-hidden border-4 border-card shadow-soft cursor-crosshair"
          >
            <img
              src={scene.modified}
              alt={`${scene.name} (com diferenças)`}
              className="absolute inset-0 w-full h-full object-cover select-none"
              loading="lazy"
              draggable={false}
            />

            {/* Found markers — placed at the exact click coordinates */}
            {found.map((pos, i) =>
              pos ? (
                <div
                  key={`f-${i}`}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-10 w-10 rounded-full border-4 border-[var(--mint)] bg-[var(--mint)]/20 grid place-items-center"
                  >
                    <Check className="h-5 w-5 text-white drop-shadow" />
                  </motion.div>
                </div>
              ) : null,
            )}

            {/* Hint pulse */}
            <AnimatePresence>
              {hintIdx !== null && (
                <div
                  key={`hint-${hintIdx}`}
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${diffs[hintIdx].x}%`,
                    top: `${diffs[hintIdx].y}%`,
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.9, 0.5, 0.9] }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
                    className="h-11 w-11 rounded-full border-4 border-[var(--sunshine)] bg-[var(--sunshine)]/25"
                  />
                </div>
              )}
            </AnimatePresence>

            {/* Wrong click flash */}
            <AnimatePresence>
              {flashWrong && (
                <motion.div
                  key={`${flashWrong.x}-${flashWrong.y}`}
                  initial={{ scale: 0.4, opacity: 1 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute pointer-events-none h-10 w-10 rounded-full border-4 border-destructive"
                  style={{
                    left: `${flashWrong.x}%`,
                    top: `${flashWrong.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </AnimatePresence>
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
