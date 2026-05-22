import { Award, Stamp as StampIcon, Sparkles, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import passport from "@/assets/passport.png";
import { usePassport } from "@/context/PassportContext";
import { COUNTRIES, COUNTRY_LIST } from "@/data/countries";
import { COUNTRY_ISO } from "@/data/miniGames";

export function Passport() {
  const { explorerName, isLoggedIn, stamps, resetPassport } = usePassport();

  const totalCountries = COUNTRY_LIST.length;
  const collected = stamps.length;

  return (
    <section id="passaporte" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-candy opacity-20 blur-2xl" />
          <div className="relative rounded-[2.5rem] bg-card p-8 shadow-float border-4 border-card">
            {!isLoggedIn ? (
              <div className="flex flex-col items-center text-center">
                <img
                  src={passport}
                  alt="Passaporte digital"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="w-48 mx-auto animate-float-slow"
                />
                <h3 className="mt-4 text-2xl font-display font-bold">
                  Pegue seu passaporte! 🛂
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  Entre na aventura para colecionar carimbos e guardar suas conquistas.
                </p>
                <Link
                  to="/login"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker hover:-translate-y-0.5 transition"
                >
                  Começar aventura
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/40 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3" /> Passaporte ativo
                    </span>
                    <h3 className="mt-2 text-2xl font-display font-bold">
                      {explorerName}
                    </h3>
                    <p className="text-sm text-foreground/70">
                      {collected} de {totalCountries} carimbos
                    </p>
                  </div>
                  <button
                    onClick={resetPassport}
                    className="rounded-full p-2 hover:bg-muted transition"
                    aria-label="Reiniciar passaporte"
                    title="Reiniciar passaporte"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {COUNTRY_LIST.map((c) => {
                    const stamp = stamps.find((s) => s.country === c.slug);
                    const iso = COUNTRY_ISO[c.slug];
                    return (
                      <div
                        key={c.slug}
                        className={`relative aspect-square rounded-2xl border-2 overflow-hidden grid place-items-center ${
                          stamp
                            ? "border-[var(--mint)] shadow-sticker"
                            : "bg-muted/40 border-dashed border-border text-foreground/30"
                        }`}
                        title={stamp ? `${c.name} — ${stamp.date}` : `${c.name} (bloqueado)`}
                      >
                        {stamp ? (
                          <>
                            <span
                              className={`fi fi-${iso}`}
                              aria-label={`Bandeira de ${c.name}`}
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "block",
                                width: "100%",
                                height: "100%",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <span className="absolute inset-0 rounded-2xl border-2 border-[var(--coral)]/40 rotate-3 pointer-events-none" />
                            <span className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-white bg-black/55 px-1 py-0.5 text-center truncate">
                              {c.name}
                            </span>
                          </>
                        ) : (
                          <StampIcon className="h-6 w-6" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {collected === totalCountries && (
                  <div className="mt-5 rounded-2xl bg-gradient-sunset text-white p-4 text-center shadow-sticker">
                    <Award className="inline h-5 w-5 mr-1" />
                    <strong>Uhuul!</strong> Você ganhou todos os carimbos! 🌍✨
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <span className="inline-block rounded-full bg-[var(--mint)]/40 px-4 py-1 text-xs font-bold uppercase tracking-wider">
            Passaporte digital
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold leading-tight">
            Cada carimbo <span className="text-primary">vira uma aventura</span>
          </h2>
          <p className="mt-5 text-lg text-foreground/75">
            Leia a história de cada país e descubra as brincadeiras de cada lugar
            para ganhar seus carimbos. Junte todos e vire um Mestre Explorador! 🌟
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border-2 border-border/40 shadow-sticker">
              <span className="bg-[var(--coral)] h-11 w-11 rounded-xl grid place-items-center text-white shadow-sticker text-xl">
                📖
              </span>
              <span className="font-semibold text-sm">Leia a história do país</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border-2 border-border/40 shadow-sticker">
              <span className="bg-[var(--sunshine)] h-11 w-11 rounded-xl grid place-items-center text-white shadow-sticker text-xl">
                🎮
              </span>
              <span className="font-semibold text-sm">Descubra as brincadeiras de cada país</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border-2 border-border/40 shadow-sticker">
              <span className="bg-[var(--mint)] h-11 w-11 rounded-xl grid place-items-center text-white shadow-sticker text-xl">
                🏅
              </span>
              <span className="font-semibold text-sm">Ganhe o carimbo no passaporte</span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-card p-4 border-2 border-border/40 shadow-sticker">
              <span className="bg-[var(--grape)] h-11 w-11 rounded-xl grid place-items-center text-white shadow-sticker text-xl">
                🌍
              </span>
              <span className="font-semibold text-sm">
                {totalCountries} países diferentes para explorar
              </span>
            </div>
          </div>
          {collected > 0 && (
            <p className="mt-4 text-xs text-foreground/50">
              Visitados:{" "}
              {stamps.map((s) => COUNTRIES[s.country].name).join(", ")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
