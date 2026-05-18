import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Accessibility, Volume2, VolumeX, Mic, MicOff, X, Square } from "lucide-react";
import { useNarration } from "@/context/NarrationContext";

export function AccessibilityFab() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [open, setOpen] = useState(false);
  const {
    narrationOn,
    voiceCommandsOn,
    listening,
    speaking,
    toggleNarration,
    toggleVoiceCommands,
    stop,
  } = useNarration();

  if (!mounted) return null;

  return (
    <div data-a11y-fab className="fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="w-[min(86vw,300px)] rounded-3xl bg-card border-2 border-border shadow-float p-4 space-y-3"
            role="dialog"
            aria-label="Acessibilidade"
          >
            <div className="flex items-center justify-between">
              <div className="font-display font-bold text-base flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-primary" /> Acessibilidade
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar painel de acessibilidade"
                className="h-7 w-7 grid place-items-center rounded-full bg-muted hover:bg-muted/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-xs text-foreground/70 font-semibold leading-snug">
              Modos para quem ainda não lê. Toque para ouvir o que está na tela ou
              use a sua voz para navegar.
            </p>

            <button
              onClick={toggleNarration}
              aria-pressed={narrationOn}
              className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                narrationOn
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/40 border-border hover:border-primary/40"
              }`}
            >
              <span className="h-9 w-9 grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-sticker shrink-0">
                {narrationOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-sm">Narração ao tocar</span>
                <span className="block text-[11px] text-foreground/60">
                  {narrationOn ? "Ativada — toque em qualquer item" : "Desativada"}
                </span>
              </span>
            </button>

            <button
              onClick={toggleVoiceCommands}
              aria-pressed={voiceCommandsOn}
              className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                voiceCommandsOn
                  ? "bg-[var(--mint)]/30 border-[var(--mint)]"
                  : "bg-muted/40 border-border hover:border-primary/40"
              }`}
            >
              <span
                className={`h-9 w-9 grid place-items-center rounded-xl shadow-sticker shrink-0 ${
                  listening ? "bg-[var(--coral)] text-white animate-pulse" : "bg-foreground text-background"
                }`}
              >
                {voiceCommandsOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-sm">Comandos de voz</span>
                <span className="block text-[11px] text-foreground/60">
                  {voiceCommandsOn
                    ? listening
                      ? "Ouvindo… diga: mapa, brincadeiras, passaporte"
                      : "Ativado"
                    : "Desativado"}
                </span>
              </span>
            </button>

            {speaking && (
              <button
                onClick={stop}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground/10 hover:bg-foreground/15 px-3 py-2 text-xs font-bold"
              >
                <Square className="h-3 w-3" /> Parar narração
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir opções de acessibilidade"
        aria-expanded={open}
        className={`relative h-14 w-14 grid place-items-center rounded-full bg-gradient-sunset text-white shadow-float border-4 border-card hover:-translate-y-0.5 transition ${
          listening || speaking ? "ring-4 ring-[var(--coral)]/60" : ""
        }`}
      >
        <Accessibility className="h-6 w-6" />
        {(narrationOn || voiceCommandsOn) && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--mint)] border-2 border-card" />
        )}
      </button>
    </div>
  );
}
