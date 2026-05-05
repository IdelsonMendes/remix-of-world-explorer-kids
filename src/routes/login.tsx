import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, LogIn } from "lucide-react";
import { AVATAR_OPTIONS, DEFAULT_AVATAR_ID, getAvatarSrc, usePassport } from "@/context/PassportContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import luna from "@/assets/luna-mascot.png";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Entrar — Exploradores do Mundo" },
      { name: "description", content: "Crie seu perfil de explorador e acesse o lobby." },
    ],
  }),
});

type Mode = "signin" | "signup";

function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, session, setExplorerName, setAvatar, explorerName, avatar } = usePassport();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [chosenAvatar, setChosenAvatar] = useState<string>(AVATAR_OPTIONS[0].id);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // Already authenticated → go to lobby (or finish profile)
  useEffect(() => {
    if (!session) return;
    // If profile is complete, go to lobby
    if (isLoggedIn) {
      navigate({ to: "/lobby" });
    }
  }, [session, isLoggedIn, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (mode === "signup" && !name.trim()) {
      setError("Escolha seu nome de explorador!");
      return;
    }
    if (!email.trim() || password.length < 6) {
      setError("Informe email válido e senha com 6+ caracteres.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/lobby`,
            data: { explorer_name: name.trim(), avatar: chosenAvatar },
          },
        });
        if (err) throw err;
        if (data.session) {
          setExplorerName(name.trim());
          setAvatar(chosenAvatar);
          navigate({ to: "/lobby" });
        } else {
          setInfo("Conta criada! Confirme seu email para entrar.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        // Navigation handled by useEffect once profile loads
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/lobby`,
    });
    if (result.error) {
      setError("Não foi possível entrar com o Google.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    // Tokens were set, navigate
    navigate({ to: "/lobby" });
  };

  // Profile completion view (logged in but no name/avatar yet — e.g. after Google login)
  if (session && !isLoggedIn) {
    return (
      <ProfileCompletion
        defaultName={explorerName || (session.user.user_metadata?.full_name as string) || ""}
        defaultAvatar={avatar || AVATAR_OPTIONS[0].src}
        onSubmit={(n, a) => {
          setExplorerName(n);
          setAvatar(a);
          navigate({ to: "/lobby" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-gradient-tropical items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <motion.img
          src={luna}
          alt="Luna Matias"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md drop-shadow-2xl"
        />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Bem-vindo,<br />pequeno explorador! 🌍
          </h2>
          <p className="mt-3 text-white/90">
            Crie ou acesse seu perfil para guardar seu progresso.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground/70 hover:text-primary transition"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </Link>

          <h1 className="mt-6 text-4xl font-display font-bold">
            {mode === "signup" ? "Vamos começar! ✨" : "Bem-vindo de volta! 👋"}
          </h1>
          <p className="mt-2 text-foreground/70">
            {mode === "signup"
              ? "Crie sua conta para salvar carimbos e progresso."
              : "Entre para continuar sua aventura."}
          </p>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="mt-6 w-full inline-flex items-center justify-center gap-3 rounded-full bg-card border-2 border-border px-5 py-3 font-bold hover:border-primary/40 transition disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continuar com Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-foreground/50 font-bold uppercase">
            <div className="h-px flex-1 bg-border" />
            ou com email
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="text-sm font-bold">Seu nome de explorador</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={24}
                    placeholder="Ex: Capitã Júlia"
                    className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold">Escolha seu avatar</label>
                  <div className="mt-2 grid grid-cols-4 gap-3">
                    {AVATAR_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setChosenAvatar(opt.id)}
                        className={`group aspect-square rounded-2xl overflow-hidden border-2 transition flex items-center justify-center bg-card ${
                          chosenAvatar === opt.id
                            ? "border-primary scale-105 shadow-sticker ring-2 ring-primary/30"
                            : "border-border hover:border-primary/40"
                        }`}
                        aria-label={`Avatar ${opt.label}`}
                        title={opt.label}
                      >
                        <img src={opt.src} alt={opt.label} className="h-full w-full object-contain p-1" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-bold">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-sm text-destructive font-bold">{error}</p>}
            {info && <p className="text-sm text-primary font-bold">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 font-bold shadow-float hover:-translate-y-0.5 transition disabled:opacity-50"
            >
              {mode === "signup" ? <Rocket className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
              {mode === "signup" ? "Criar conta e entrar" : "Entrar"}
            </button>

            <p className="text-center text-sm text-foreground/70">
              {mode === "signup" ? "Já tem conta? " : "Ainda não tem conta? "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "signup" ? "signin" : "signup");
                  setError("");
                  setInfo("");
                }}
                className="font-bold text-primary hover:underline"
              >
                {mode === "signup" ? "Entrar" : "Criar conta"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function ProfileCompletion({
  defaultName,
  defaultAvatar,
  onSubmit,
}: {
  defaultName: string;
  defaultAvatar: string;
  onSubmit: (name: string, avatar: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-display font-bold">Falta pouco! ✨</h1>
        <p className="mt-2 text-foreground/70">Escolha um nome e avatar de explorador.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) {
              setError("Escolha um nome!");
              return;
            }
            onSubmit(name.trim(), avatar);
          }}
          className="mt-6 space-y-4"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Ex: Capitão Pedro"
            className="w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
          />
          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAvatar(opt.src)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition flex items-center justify-center bg-card ${
                  avatar === opt.src
                    ? "border-primary scale-105 shadow-sticker ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <img src={opt.src} alt={opt.label} className="h-full w-full object-contain p-1" />
              </button>
            ))}
          </div>
          {error && <p className="text-sm text-destructive font-bold">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-primary text-primary-foreground px-7 py-4 font-bold shadow-float hover:-translate-y-0.5 transition"
          >
            Entrar no lobby
          </button>
        </form>
      </div>
    </div>
  );
}
