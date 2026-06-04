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
import { useNavigate } from "@tanstack/react-router";

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
  // Fallback: own text (full text — needed for highlight matching on paragraphs)
  const txt = (node.textContent || "").replace(/\s+/g, " ").trim();
  return txt.slice(0, 1200);
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
  const navigate = useNavigate();
  const [narrationOn, setNarrationOn] = useState<boolean>(() => loadBool(STORAGE_NARRATION));
  const [voiceCommandsOn, setVoiceCommandsOn] = useState<boolean>(() => loadBool(STORAGE_VOICE));
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const voiceCmdRef = useRef(voiceCommandsOn);
  useEffect(() => { voiceCmdRef.current = voiceCommandsOn; }, [voiceCommandsOn]);

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

  // Highlight state. Two strategies:
  //  1) CSS Custom Highlight API (preferred) — zero DOM mutation, no reflow.
  //  2) Fallback: wrap words in <span> via innerHTML (mutates DOM, may reflow).
  type HighlightState = {
    el: HTMLElement;
    offsets: number[];
    originalHTML?: string;
    spans?: HTMLSpanElement[];
    ranges?: Range[];
    highlightName?: string;
  };
  const highlightRef = useRef<HighlightState | null>(null);

  const supportsCssHighlights = (): boolean => {
    return typeof window !== "undefined" && typeof (window as any).CSS !== "undefined"
      && !!(window as any).CSS.highlights && typeof (window as any).Highlight === "function";
  };

  const clearHighlight = useCallback(() => {
    const h = highlightRef.current;
    if (!h) return;
    try {
      if (h.highlightName && supportsCssHighlights()) {
        (window as any).CSS.highlights.delete(h.highlightName);
      } else if (h.originalHTML != null) {
        h.el.innerHTML = h.originalHTML;
      }
    } catch { /* noop */ }
    highlightRef.current = null;
  }, []);

  // Decide if an element is safe to highlight.
  const canHighlight = (el: Element | null): el is HTMLElement => {
    if (!el) return false;
    const html = el as HTMLElement;
    const tag = html.tagName;
    if (!/^(P|H1|H2|H3|H4|H5|H6|LI|SPAN|DIV|BLOCKQUOTE|EM|STRONG|FIGCAPTION|LABEL|A|BUTTON)$/.test(tag)) return false;
    const txt = (html.textContent || "").trim();
    if (!txt || txt.length > 1200) return false;
    // For the span-fallback path only, avoid mutating elements with interactive descendants
    if (!supportsCssHighlights()) {
      if (html.querySelector?.("button, a, input, textarea, select, [role='button'], [role='link'], img, svg, video, audio")) return false;
    }
    return true;
  };

  // Build per-word Ranges using the CSS Custom Highlight API (no DOM mutation).
  const setupHighlightRanges = (el: HTMLElement): boolean => {
    try {
      const win = window as any;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const ranges: Range[] = [];
      const offsets: number[] = [];
      let globalIdx = 0;
      let node = walker.nextNode() as Text | null;
      while (node) {
        const text = node.nodeValue || "";
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          ranges.push(r);
          offsets.push(globalIdx + m.index);
        }
        globalIdx += text.length;
        node = walker.nextNode() as Text | null;
      }
      if (ranges.length === 0) return false;
      const name = "narration-active";
      win.CSS.highlights.delete(name);
      const hl = new win.Highlight();
      win.CSS.highlights.set(name, hl);
      highlightRef.current = { el, ranges, offsets, highlightName: name };
      return true;
    } catch {
      return false;
    }
  };

  const wrapElementWords = (el: HTMLElement, text: string) => {
    const escapeHtml = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const offsets: number[] = [];
    let html = "";
    let lastIdx = 0;
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    let wordIdx = 0;
    while ((m = re.exec(text))) {
      html += escapeHtml(text.slice(lastIdx, m.index));
      offsets.push(m.index);
      html += `<span class="narration-word" data-nw="${wordIdx}">${escapeHtml(m[0])}</span>`;
      lastIdx = m.index + m[0].length;
      wordIdx++;
    }
    html += escapeHtml(text.slice(lastIdx));
    const originalHTML = el.innerHTML;
    el.innerHTML = html;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".narration-word"));
    highlightRef.current = { el, originalHTML, spans, offsets };
  };

  const setupHighlight = (el: HTMLElement, text: string): boolean => {
    if (supportsCssHighlights() && setupHighlightRanges(el)) return true;
    try { wrapElementWords(el, text); return true; } catch { return false; }
  };

  const highlightAt = (charIndex: number, _charLength?: number) => {
    const h = highlightRef.current;
    if (!h) return;
    let active = -1;
    for (let i = 0; i < h.offsets.length; i++) {
      if (h.offsets[i] <= charIndex) active = i; else break;
    }
    if (active < 0) active = 0;

    if (h.highlightName && h.ranges && supportsCssHighlights()) {
      try {
        const win = window as any;
        const hl = win.CSS.highlights.get(h.highlightName);
        if (hl) { hl.clear(); hl.add(h.ranges[active]); }
        const rect = h.ranges[active].getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom < 0 || rect.top > vh) {
          h.el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      } catch { /* noop */ }
      return;
    }

    if (h.spans) {
      h.spans.forEach((s, i) => {
        if (i === active) s.classList.add("narration-active");
        else s.classList.remove("narration-active");
      });
      const node = h.spans[active];
      if (node && typeof node.scrollIntoView === "function") {
        node.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  };

  const fallbackTimerRef = useRef<number | null>(null);
  const clearFallbackTimer = () => {
    if (fallbackTimerRef.current != null) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const speakInternal = useCallback(
    (text: string, opts?: { interrupt?: boolean; element?: HTMLElement | null }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      if (!text || !text.trim()) return;
      const synth = window.speechSynthesis;
      if (opts?.interrupt !== false) {
        synth.cancel();
        clearFallbackTimer();
        clearHighlight();
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "pt-BR";
      u.rate = 0.95;
      u.pitch = 1.05;
      if (voiceRef.current) u.voice = voiceRef.current;

      const el = opts?.element;
      const wantsHighlight = el && canHighlight(el);
      if (wantsHighlight) {
        wrapElementWords(el, text);
      }

      let boundaryFired = false;
      let usingFallback = false;

      const startFallback = () => {
        if (usingFallback) return;
        const h = highlightRef.current;
        if (!h || h.spans.length === 0) return;
        usingFallback = true;
        // Estimate ~2.6 words/sec at rate 0.95 (typical Portuguese TTS)
        const wordsPerSec = 2.6 * (u.rate || 1);
        const intervalMs = Math.max(180, Math.round(1000 / wordsPerSec));
        let idx = 0;
        // Highlight first word immediately
        highlightAt(h.offsets[0] ?? 0);
        fallbackTimerRef.current = window.setInterval(() => {
          idx += 1;
          if (idx >= h.offsets.length) {
            clearFallbackTimer();
            return;
          }
          highlightAt(h.offsets[idx]);
        }, intervalMs);
      };

      u.onstart = () => {
        setSpeaking(true);
        // If onboundary hasn't fired within 400ms, use fallback timer
        if (wantsHighlight) {
          window.setTimeout(() => {
            if (!boundaryFired) startFallback();
          }, 400);
        }
      };
      u.onboundary = (ev: SpeechSynthesisEvent) => {
        boundaryFired = true;
        if (usingFallback) {
          clearFallbackTimer();
          usingFallback = false;
        }
        highlightAt(ev.charIndex, (ev as any).charLength);
      };
      u.onend = () => {
        setSpeaking(false);
        clearFallbackTimer();
        clearHighlight();
      };
      u.onerror = () => {
        setSpeaking(false);
        clearFallbackTimer();
        clearHighlight();
      };
      synth.speak(u);
    },
    [clearHighlight],
  );


  const speak = useCallback(
    (text: string, opts?: { interrupt?: boolean }) => speakInternal(text, opts),
    [speakInternal],
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    clearFallbackTimer();
    clearHighlight();
  }, [clearHighlight]);

  const toggleNarration = useCallback(() => {
    setNarrationOn((on) => {
      const next = !on;
      saveBool(STORAGE_NARRATION, next);
      if (next) {
        speak("Modo narração ativado. Toque em qualquer coisa para ouvir.");
      } else {
        window.speechSynthesis?.cancel();
        clearHighlight();
      }
      return next;
    });
  }, [speak, clearHighlight]);

  // Find best element to highlight: walk up to a text-content ancestor.
  const findHighlightTarget = (start: Element | null): HTMLElement | null => {
    let cur: Element | null = start;
    for (let i = 0; i < 6 && cur; i++) {
      if (canHighlight(cur)) return cur as HTMLElement;
      cur = cur.parentElement;
    }
    return null;
  };

  // Global click listener — read element when narration on
  useEffect(() => {
    if (!narrationOn) return;
    const onPointer = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;
      if ((target as HTMLElement).closest?.("[data-a11y-fab]")) return;
      const text = getNarratableText(target);
      if (!text) return;
      const hl = findHighlightTarget(target);
      // Loose match: highlight if element text equals or contains spoken text (handles punctuation/whitespace differences)
      const norm = (s: string) => s.replace(/\s+/g, " ").trim();
      const elText = hl ? norm(hl.textContent || "") : "";
      const spoken = norm(text);
      const useEl = hl && (elText === spoken || elText.includes(spoken) || spoken.includes(elText)) ? hl : null;
      speakInternal(text, { element: useEl });
    };
    document.addEventListener("click", onPointer, true);
    return () => document.removeEventListener("click", onPointer, true);
  }, [narrationOn, speakInternal]);

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
      try { recognitionRef.current?.stop?.(); } catch { /* noop */ }
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
    rec.maxAlternatives = 3;
    rec.onstart = () => {
      // eslint-disable-next-line no-console
      console.log("[voice] listening...");
      setListening(true);
    };
    rec.onend = () => {
      // eslint-disable-next-line no-console
      console.log("[voice] ended");
      setListening(false);
      if (voiceCmdRef.current) {
        // Some browsers throw if start() is called too soon
        setTimeout(() => {
          if (!voiceCmdRef.current) return;
          try { rec.start(); } catch (e) { console.warn("[voice] restart failed", e); }
        }, 250);
      }
    };
    rec.onerror = (e: any) => {
      // eslint-disable-next-line no-console
      console.warn("[voice] error", e?.error || e);
      setListening(false);
      if (e?.error === "not-allowed" || e?.error === "service-not-allowed") {
        speak("Não consegui acessar o microfone. Permita o uso do microfone nas configurações do navegador.");
        voiceCmdRef.current = false;
        saveBool(STORAGE_VOICE, false);
        setVoiceCommandsOn(false);
      }
    };
    rec.onresult = (event: any) => {
      // Iterate ALL new results, try every alternative
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (!res?.isFinal && !res?.[0]) continue;
        for (let a = 0; a < res.length; a++) {
          const transcript = res[a]?.transcript as string | undefined;
          if (!transcript) continue;
          // eslint-disable-next-line no-console
          console.log("[voice] heard:", transcript);
          const nav: NavFn = (path) => {
            navigate({ to: path as any });
          };
          if (matchCommand(transcript, nav, speak)) return;
        }
      }
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (e) {
      console.warn("[voice] start failed", e);
    }
    return () => {
      try { rec.stop(); } catch { /* noop */ }
      recognitionRef.current = null;
      setListening(false);
    };
  }, [voiceCommandsOn, speak, navigate]);

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
