import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2, LogOut, KeyRound, Mail, User as UserIcon, HelpCircle } from "lucide-react";
import { AVATAR_OPTIONS, getAvatarSrc, usePassport } from "@/context/PassportContext";
import { supabase } from "@/integrations/supabase/client";
import { deleteMyAccount } from "@/lib/account.functions";
import { clearTourSeen } from "@/components/LobbyTour";

export const Route = createFileRoute("/conta")({
  component: AccountPage,
  head: () => ({
    meta: [
      { title: "Minha conta — Exploradores do Mundo" },
      { name: "description", content: "Gerencie seu perfil, email, senha e conta." },
    ],
  }),
});

function AccountPage() {
  const navigate = useNavigate();
  const { session, isLoggedIn, explorerName, avatar, setProfile, logout, loading, profileLoading } =
    usePassport();
  const deleteAccount = useServerFn(deleteMyAccount);

  const [name, setName] = useState(explorerName);
  const [chosenAvatar, setChosenAvatar] = useState(avatar || AVATAR_OPTIONS[0].id);
  const [email, setEmail] = useState(session?.user.email ?? "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");

  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Only redirect AFTER auth bootstrap finishes — otherwise we redirect to
  // /login during the initial render (session is null briefly), which then
  // bounces the user back to /lobby and looks like a random reload.
  useEffect(() => {
    if (loading || profileLoading) return;
    if (!session) navigate({ to: "/login" });
  }, [loading, profileLoading, session, navigate]);

  useEffect(() => {
    setName(explorerName);
    setChosenAvatar(avatar || AVATAR_OPTIONS[0].id);
    setEmail(session?.user.email ?? "");
  }, [explorerName, avatar, session?.user.email]);

  if (loading || !session) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-foreground/60 font-bold">Preparando sua conta… ⚙️</div>
      </div>
    );
  }

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    window.setTimeout(() => setMsg(null), 4000);
  };

  const saveProfile = async () => {
    if (!name.trim()) return flash("err", "Escolha um nome de explorador.");
    setBusy("profile");
    try {
      await setProfile(name.trim(), chosenAvatar);
      flash("ok", "Perfil de explorador atualizado!");
    } catch (e) {
      flash("err", e instanceof Error ? e.message : "Não consegui salvar agora. Tente de novo.");
    } finally {
      setBusy(null);
    }
  };

  const saveEmail = async () => {
    const newEmail = email.trim();
    if (!newEmail || newEmail === session.user.email) {
      return flash("err", "Informe um e-mail diferente do atual.");
    }
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusy(null);
    if (error) return flash("err", error.message);
    flash("ok", "Confirme o novo e-mail pelo link que enviamos para você.");
  };

  const savePassword = async () => {
    if (password.length < 6) return flash("err", "A senha precisa ter pelo menos 6 caracteres.");
    if (password !== password2) return flash("err", "As duas senhas não são iguais.");
    setBusy("password");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(null);
    if (error) return flash("err", error.message);
    setPassword("");
    setPassword2("");
    flash("ok", "Senha atualizada com sucesso!");
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const handleDelete = async () => {
    if (confirmDelete !== "EXCLUIR") {
      return flash("err", "Digite a palavra EXCLUIR para confirmar.");
    }
    setBusy("delete");
    try {
      await deleteAccount();
      await supabase.auth.signOut();
      navigate({ to: "/" });
    } catch (e) {
      setBusy(null);
      flash("err", e instanceof Error ? e.message : "Não consegui excluir a conta agora.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 sm:px-6 py-3">
          <Link
            to={isLoggedIn ? "/lobby" : "/"}
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground/70 hover:text-primary transition"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-border px-4 py-2 text-sm font-bold hover:border-destructive/40 hover:text-destructive transition"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Minha conta</h1>
          <p className="mt-2 text-foreground/70">Seu cantinho de explorador. Mude seu nome, avatar e senha aqui.</p>
        </div>

        {msg && (
          <div
            className={`rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
              msg.kind === "ok"
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Profile */}
        <section className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-sticker">
          <h2 className="font-display text-2xl font-bold inline-flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" /> Perfil de explorador
          </h2>

          <div className="mt-6 flex items-center gap-4">
            <img
              src={getAvatarSrc(chosenAvatar)}
              alt={name}
              className="h-20 w-20 rounded-2xl object-contain bg-muted/30 border-2 border-border"
            />
            <div>
              <p className="font-bold">{name || "Sem nome ainda"}</p>
              <p className="text-sm text-foreground/60">{session.user.email}</p>
            </div>
          </div>

          <label className="mt-6 block text-sm font-bold">Nome de explorador</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
          />

          <p className="mt-6 text-sm font-bold">Avatar</p>
          <div className="mt-2 grid grid-cols-4 sm:grid-cols-8 gap-3">
            {AVATAR_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setChosenAvatar(opt.id)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition flex items-center justify-center bg-card ${
                  chosenAvatar === opt.id
                    ? "border-primary scale-105 shadow-sticker ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
                title={opt.label}
              >
                <img src={opt.src} alt={opt.label} className="h-full w-full object-contain p-1" />
              </button>
            ))}
          </div>

          <button
            onClick={saveProfile}
            disabled={busy === "profile"}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Salvar perfil
          </button>
        </section>

        {/* Email */}
        <section className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-sticker">
          <h2 className="font-display text-2xl font-bold inline-flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" /> E-mail
          </h2>
          <label className="mt-6 block text-sm font-bold">Endereço de e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-foreground/60">
            Vamos enviar um link de confirmação para o novo e-mail.
          </p>
          <button
            onClick={saveEmail}
            disabled={busy === "email"}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Atualizar e-mail
          </button>
        </section>

        {/* Password */}
        <section className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-sticker">
          <h2 className="font-display text-2xl font-bold inline-flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Senha
          </h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Confirmar senha</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="mt-2 w-full rounded-2xl border-2 border-border bg-background px-5 py-3 font-semibold focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <button
            onClick={savePassword}
            disabled={busy === "password"}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> Atualizar senha
          </button>
        </section>

        {/* Tutorial */}
        <section className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8 shadow-sticker">
          <h2 className="font-display text-2xl font-bold inline-flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Apresentação da Luna
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Quer rever a apresentação da Luna Matias? É só tocar aqui!
          </p>
          <button
            onClick={() => {
              clearTourSeen(session.user.id);
              navigate({ to: "/lobby", search: { tour: "1" } as never });
            }}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition"
          >
            <HelpCircle className="h-4 w-4" /> Ver de novo
          </button>
        </section>

        {/* Danger zone */}
        <section className="rounded-3xl border-2 border-destructive/40 bg-destructive/5 p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-destructive inline-flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Excluir conta
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Esta ação é para sempre. Todos os seus carimbos e seu progresso serão
            apagados e não dá para recuperar. Peça ajuda a um adulto.
          </p>
          <label className="mt-6 block text-sm font-bold">
            Para confirmar, digite <span className="font-mono">EXCLUIR</span>
          </label>
          <input
            type="text"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            className="mt-2 w-full sm:w-72 rounded-2xl border-2 border-destructive/40 bg-background px-5 py-3 font-semibold focus:outline-none focus:border-destructive"
          />
          <button
            onClick={handleDelete}
            disabled={busy === "delete" || confirmDelete !== "EXCLUIR"}
            className="mt-4 block sm:inline-flex items-center gap-2 rounded-full bg-destructive text-destructive-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </section>
      </main>
    </div>
  );
}
