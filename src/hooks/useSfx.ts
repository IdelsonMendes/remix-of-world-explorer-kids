import { useCallback, useRef } from "react";

/**
 * Sons leves (sem assets) para feedback infantil.
 * Usa WebAudio com envelopes curtos — soft, não estridente.
 * Respeita prefers-reduced-motion (entendido como "quero menos estímulo").
 */
type SfxType = "tap" | "success" | "celebrate" | "error";

const STORAGE_KEY = "exploradores:sfx-enabled";

function isEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "off") return false;
  if (typeof window.matchMedia === "function") {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  }
  return true;
}

export function setSfxEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
}

export function getSfxEnabled() {
  return isEnabled();
}

type AudioCtxCtor = typeof AudioContext;

function getCtxCtor(): AudioCtxCtor | null {
  if (typeof window === "undefined") return null;
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: AudioCtxCtor }).webkitAudioContext ||
    null
  );
}

function playNotes(
  ctx: AudioContext,
  notes: Array<{ freq: number; start: number; dur: number; gain?: number; type?: OscillatorType }>,
) {
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  notes.forEach((n) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;
    const t0 = ctx.currentTime + n.start;
    const peak = n.gain ?? 0.6;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
    osc.connect(g).connect(master);
    osc.start(t0);
    osc.stop(t0 + n.dur + 0.02);
  });
}

export function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);

  const ensureCtx = useCallback((): AudioContext | null => {
    const Ctor = getCtxCtor();
    if (!Ctor) return null;
    if (!ctxRef.current) ctxRef.current = new Ctor();
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SfxType) => {
      if (!isEnabled()) return;
      const ctx = ensureCtx();
      if (!ctx) return;

      switch (type) {
        case "tap":
          playNotes(ctx, [{ freq: 720, start: 0, dur: 0.08, gain: 0.4, type: "triangle" }]);
          break;
        case "success":
          playNotes(ctx, [
            { freq: 660, start: 0, dur: 0.12, type: "triangle" },
            { freq: 880, start: 0.1, dur: 0.18, type: "triangle" },
          ]);
          break;
        case "celebrate":
          playNotes(ctx, [
            { freq: 523, start: 0, dur: 0.14, type: "triangle" }, // C5
            { freq: 659, start: 0.12, dur: 0.14, type: "triangle" }, // E5
            { freq: 784, start: 0.24, dur: 0.18, type: "triangle" }, // G5
            { freq: 1047, start: 0.36, dur: 0.28, type: "triangle" }, // C6
          ]);
          break;
        case "error":
          playNotes(ctx, [
            { freq: 320, start: 0, dur: 0.16, gain: 0.4, type: "sine" },
            { freq: 220, start: 0.12, dur: 0.18, gain: 0.4, type: "sine" },
          ]);
          break;
      }
    },
    [ensureCtx],
  );

  return { play };
}
