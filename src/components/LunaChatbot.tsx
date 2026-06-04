import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askLuna } from "@/lib/luna-chat.functions";
import { usePassport } from "@/context/PassportContext";
import { useNarration } from "@/context/NarrationContext";
import lunaAvatar from "@/assets/luna-mascot.png";

type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Como funciona o mapa?",
  "Como ganhar carimbos?",
  "Como jogar os desafios?",
  "Como editar meu perfil?",
  "Como funciona o passaporte?",
  "Recursos de acessibilidade",
];

const WELCOME: ChatMsg = {
  role: "assistant",
  content:
    "Olá, explorador! 🌎✨\n\nEu sou a Luna Matias e vou ajudar você durante suas viagens pelo Exploradores do Mundo.\n\nVocê pode me perguntar sobre países, jogos, carimbos, passaporte digital, acessibilidade e outras funções da plataforma.",
};

function LunaAvatar({ size = 36, bobbing = false }: { size?: number; bobbing?: boolean }) {
  return (
    <div
      className={`relative shrink-0 grid place-items-center rounded-full bg-white/90 ring-2 ring-white/70 shadow-sticker overflow-hidden ${
        bobbing ? "animate-luna-bob" : ""
      }`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img
        src={lunaAvatar}
        alt=""
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export function LunaChatbot() {
  const { isLoggedIn } = usePassport();
  const { speak, stop, speaking } = useNarration();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [spokenIndex, setSpokenIndex] = useState<number | null>(null);
  const ask = useServerFn(askLuna);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!speaking) setSpokenIndex(null);
  }, [speaking]);

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

  const toggleSpeak = (i: number, content: string) => {
    if (spokenIndex === i && speaking) {
      stop();
      setSpokenIndex(null);
    } else {
      setSpokenIndex(i);
      speak(content, { interrupt: true });
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Falar com a Luna Matias"
          className="fixed bottom-5 left-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-gradient-sunset text-white shadow-sticker hover:-translate-y-0.5 active:translate-y-0 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 animate-luna-bob"
        >
          <img
            src={lunaAvatar}
            alt=""
            className="h-11 w-11 rounded-full object-cover"
            draggable={false}
          />
          <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white text-primary shadow">
            <Sparkles className="h-3 w-3" />
          </span>
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <aside
            role="dialog"
            aria-label="Chat com Luna Matias"
            className="fixed z-[95] bg-background border border-border shadow-2xl flex flex-col animate-scale-in origin-bottom-left
              inset-x-0 bottom-0 top-16 rounded-t-3xl
              md:inset-auto md:bottom-5 md:left-5 md:top-auto md:h-[min(580px,80vh)] md:w-[380px] md:rounded-3xl"
          >
            <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-gradient-sunset text-white rounded-t-3xl">
              <div className="flex items-center gap-3 min-w-0">
                <LunaAvatar size={44} bobbing={loading} />
                <div className="leading-tight min-w-0">
                  <div className="font-display font-bold text-base truncate">Luna Matias</div>
                  <div className="text-[11px] opacity-90 truncate">
                    Sua guia de aventuras pelo mundo
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  stop();
                  setOpen(false);
                }}
                aria-label="Fechar chat"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30 transition shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map((m, i) => {
                const isUser = m.role === "user";
                const isSpeakingThis = spokenIndex === i && speaking;
                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 animate-fade-in ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isUser && <LunaAvatar size={28} bobbing={isSpeakingThis} />}
                    <div className={`max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                          isUser
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-muted text-foreground rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                      {!isUser && (
                        <button
                          type="button"
                          onClick={() => toggleSpeak(i, m.content)}
                          aria-label={isSpeakingThis ? "Parar narração" : "Ouvir resposta"}
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition px-2 py-0.5 rounded-full hover:bg-muted"
                        >
                          {isSpeakingThis ? (
                            <>
                              <VolumeX className="h-3 w-3" /> Parar
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3" /> Ouvir
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-end gap-2 justify-start animate-fade-in">
                  <LunaAvatar size={28} bobbing />
                  <div className="bg-muted text-foreground rounded-2xl rounded-bl-sm px-3 py-2 text-sm flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Luna está pensando
                    </span>
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:240ms]" />
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
