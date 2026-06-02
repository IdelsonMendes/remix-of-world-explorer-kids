import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askLuna } from "@/lib/luna-chat.functions";
import { usePassport } from "@/context/PassportContext";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Conhecer o mapa",
  "Como ganhar carimbos",
  "Editar perfil",
  "Jogar quizzes",
  "Configurações de acessibilidade",
];

const WELCOME: ChatMsg = {
  role: "assistant",
  content:
    "Oi, explorador(a)! 🌍 Eu sou a Luna Matias. Posso te ajudar a entender o mapa, os carimbos, as brincadeiras e tudo da plataforma. O que você quer saber?",
};

export function LunaChatbot() {
  const { isLoggedIn } = usePassport();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = useServerFn(askLuna);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  if (!isLoggedIn) return null;

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: clean }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const history = next.slice(-10);
      const { reply } = await ask({ data: { messages: history } });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Opa! Não consegui responder agora. Tenta de novo? ✨",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Falar com a Luna Matias"
          className="fixed bottom-5 left-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-gradient-sunset text-white shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-primary shadow">
            <Sparkles className="h-3 w-3" />
          </span>
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-label="Chat com Luna Matias"
            className="fixed z-[95] bg-background border border-border shadow-2xl flex flex-col
              inset-x-0 bottom-0 top-16 rounded-t-3xl
              md:inset-auto md:bottom-5 md:left-5 md:top-auto md:h-[min(560px,80vh)] md:w-[380px] md:rounded-3xl"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-gradient-sunset text-white rounded-t-3xl">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-bold text-base">Luna Matias</div>
                  <div className="text-[11px] opacity-90">Sua guia da aventura</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar chat"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" />
                      <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:120ms]" />
                      <span className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="px-3 pb-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={loading}
                    onClick={() => send(s)}
                    className="text-xs font-semibold rounded-full border border-border bg-card hover:bg-muted px-3 py-1.5 transition disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="p-3 border-t border-border/60 flex items-end gap-2 bg-background"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={500}
                placeholder="Pergunta pra Luna..."
                aria-label="Sua pergunta"
                className="flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-28"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sticker disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </aside>
        </>
      )}
    </>
  );
}
