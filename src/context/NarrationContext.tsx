import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NarrationState = {
  narrationOn: boolean;
  voiceCommandsOn: boolean;
  listening: boolean;
  speaking: boolean;
  toggleNarration: () => void;
  toggleVoiceCommands: () => void;
  speak: (text: string, opts?: { interrupt?: boolean }) => void;
  stop: () => void;
};

const NarrationContext = createContext<NarrationState | null>(null);

const STORAGE_NARRATION = "a11y:narration";
const STORAGE_VOICE = "a11y:voice-commands";

function loadBool(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
function saveBool(key: string, v: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, v ? "1" : "0");
  } catch {
    /* noop */
  }
}

// Extract a friendly label for narration from a DOM element.
function getNarratableText(el: Element | null): string {
  if (!el) return "";
  const node = el as HTMLElement;
  // Walk up to find an interactive ancestor with a label
  let cur: HTMLElement | null = node;
  for (let i = 0; i < 5 && cur; i++) {
    const aria = cur.getAttribute("aria-label");
    if (aria && aria.trim()) return aria.trim();
    const title = cur.getAttribute("title");
    if (title && title.trim()) return title.trim();
    if (
      cur.tagName === "BUTTON" ||
      cur.tagName === "A" ||
      cur.getAttribute("role") === "button" ||
      cur.getAttribute("role") === "link"
    ) {
      const txt = (cur.textContent || "").replace(/\s+/g, " ").trim();
      if (txt) return txt.slice(0, 140);
      // Image alt fallback
      const img = cur.querySelector("img[alt]") as HTMLImageElement | null;
      if (img?.alt) return img.alt;
    }
    cur = cur.parentElement;
  }
  // Fallback: own text
  const txt = (node.textContent || "").replace(/\s+/g, " ").trim();
  return txt.slice(0, 140);
}

type NavFn = (path: string) => void;

function matchCommand(transcript: string, nav: NavFn, speak: (s: string) => void): boolean {
  const t = transcript.toLowerCase();
  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has("início", "inicio", "home", "página inicial", "pagina inicial")) {
    nav("/");
    speak("Indo para o início");
    return true;
  }
  if (has("lobby", "meu lobby", "menu principal")) {
    nav("/lobby");
    speak("Abrindo o lobby");
    return true;
  }
  if (has("mapa")) {
    nav("/lobby");
    setTimeout(() => {
      document.querySelector("[data-tour='map']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    speak("Mostrando o mapa");
    return true;
  }
  if (has("brincadeira", "brincadeiras", "jogos", "jogar")) {
    nav("/lobby");
    setTimeout(() => {
      document.querySelector("[data-tour='games']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    speak("Mostrando as brincadeiras");
    return true;
  }
  if (has("passaporte")) {
    nav("/lobby");
    setTimeout(() => {
      document.querySelector("[data-tour='passport']")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    speak("Abrindo seu passaporte");
    return true;
  }
  if (has("conta", "perfil", "minha conta")) {
    nav("/conta");
    speak("Abrindo sua conta");
    return true;
  }
  if (has("voltar", "anterior")) {
    window.history.back();
    speak("Voltando");
    return true;
  }
  if (has("parar", "silêncio", "silencio", "calar")) {
    window.speechSynthesis?.cancel();
    return true;
  }
  return false;
}

export function NarrationProvider({ children }: { children: ReactNode }) {
  const [narrationOn, setNarrationOn] = useState<boolean>(() => loadBool(STORAGE_NARRATION));
  const [voiceCommandsOn, setVoiceCommandsOn] = useState<boolean>(() => loadBool(STORAGE_VOICE));
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Pick a Portuguese voice when available
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      voiceRef.current =
        voices.find((v) => /pt-BR/i.test(v.lang)) ||
        voices.find((v) => /^pt/i.test(v.lang)) ||
        voices[0] ||
        null;
    };
    pick();
    window.speechSynthesis.addEventListener?.("voiceschanged", pick);
    return () => window.speechSynthesis.removeEventListener?.("voiceschanged", pick);
  }, []);

  const speak = useCallback(
    (text: string, opts?: { interrupt?: boolean }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!text || !text.trim()) return;
      const synth = window.speechSynthesis;
      if (opts?.interrupt !== false) synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.95;
      u.pitch = 1.05;
      if (voiceRef.current) u.voice = voiceRef.current;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
    },
    [],
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const toggleNarration = useCallback(() => {
    setNarrationOn((on) => {
      const next = !on;
      saveBool(STORAGE_NARRATION, next);
      if (next) {
        speak("Modo narração ativado. Toque em qualquer coisa para ouvir.");
      } else {
        window.speechSynthesis?.cancel();
      }
      return next;
    });
  }, [speak]);

  // Global click/focus listener — read element when narration on
  useEffect(() => {
    if (!narrationOn) return;
    const onPointer = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;
      // Skip the FAB itself to avoid speaking its own controls awkwardly
      if ((target as HTMLElement).closest?.("[data-a11y-fab]")) return;
      const text = getNarratableText(target);
      if (text) speak(text);
    };
    document.addEventListener("click", onPointer, true);
    return () => document.removeEventListener("click", onPointer, true);
  }, [narrationOn, speak]);

  // Voice commands via Web Speech Recognition
  const toggleVoiceCommands = useCallback(() => {
    const SR: any =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    if (!SR) {
      speak("Comandos de voz não são suportados neste navegador.");
      return;
    }
    setVoiceCommandsOn((on) => {
      const next = !on;
      saveBool(STORAGE_VOICE, next);
      if (next) speak("Comandos de voz ativados. Diga: mapa, brincadeiras, passaporte, conta ou início.");
      return next;
    });
  }, [speak]);

  useEffect(() => {
    if (!voiceCommandsOn) {
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
      setListening(false);
      return;
    }
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      // Auto-restart while toggle stays on
      if (voiceCommandsOn) {
        try {
          rec.start();
        } catch {
          /* noop */
        }
      }
    };
    rec.onerror = () => {
      setListening(false);
    };
    rec.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (!last?.[0]?.transcript) return;
      const transcript = last[0].transcript as string;
      const nav: NavFn = (path) => {
        window.history.pushState({}, "", path);
        window.dispatchEvent(new PopStateEvent("popstate"));
      };
      matchCommand(transcript, nav, speak);
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      /* noop */
    }
    return () => {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
      setListening(false);
    };
  }, [voiceCommandsOn, speak]);

  const value = useMemo<NarrationState>(
    () => ({
      narrationOn,
      voiceCommandsOn,
      listening,
      speaking,
      toggleNarration,
      toggleVoiceCommands,
      speak,
      stop,
    }),
    [narrationOn, voiceCommandsOn, listening, speaking, toggleNarration, toggleVoiceCommands, speak, stop],
  );

  return <NarrationContext.Provider value={value}>{children}</NarrationContext.Provider>;
}

export function useNarration() {
  const ctx = useContext(NarrationContext);
  if (!ctx) throw new Error("useNarration must be used within NarrationProvider");
  return ctx;
}
