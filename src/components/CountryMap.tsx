import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import worldMap from "@/assets/world-map.jpg";
import { COUNTRY_LIST } from "@/data/countries";
import { COUNTRY_ISO } from "@/data/miniGames";
import { usePassport } from "@/context/PassportContext";
import { Flag } from "@/components/Flag";

export function CountryMap() {
  const [selected, setSelected] = useState(COUNTRY_LIST[0]);
  const { hasStamp } = usePassport();

  return (
    <section id="mapa" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-full bg-secondary/30 px-4 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            Mapa de descoberta
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold">
            Toque em um país e descubra! 🗺️
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Cada destino tem histórias, brincadeiras e curiosidades esperando você.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 items-stretch">
          {/* Map */}
          <div className="relative rounded-[2rem] overflow-hidden bg-card border-4 border-card shadow-float">
            <img
              src={worldMap}
              alt="Mapa-múndi colorido"
              loading="lazy"
              width={1536}
              height={896}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0">
              {COUNTRY_LIST.map((c) => {
                const iso = COUNTRY_ISO[c.slug];
                return (
                  <button
                    key={c.slug}
                    onClick={() => setSelected(c)}
                    style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shadow-sticker ring-4 ring-white/90 hover:scale-125 transition-transform ${selected.slug === c.slug ? "scale-125 ring-primary" : ""}`}
                    aria-label={c.name}
                    title={c.name}
                  >
                    <Flag iso={iso} name={c.name} rounded="rounded-full" />
                    {hasStamp(c.slug) && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--mint)] border-2 border-white text-[10px] grid place-items-center z-10">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info card */}
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[2rem] bg-gradient-sunset p-1 shadow-float"
          >
            <div className="rounded-[1.85rem] bg-card h-full p-7 flex flex-col">
              <div className="text-6xl">{selected.emoji}</div>
              <h3 className="mt-3 text-3xl font-display font-bold">{selected.name}</h3>
              <p className="mt-2 text-foreground/75 text-lg">{selected.fact}</p>

              <div className="mt-6 grid grid-cols-2 gap-2 text-center text-xs font-bold">
                <div className="rounded-2xl bg-accent/40 py-3">
                  <div className="text-2xl">🎮</div>Brincadeiras
                </div>
                <div className="rounded-2xl bg-[var(--mint)]/40 py-3">
                  <div className="text-2xl">📖</div>Histórias
                </div>
              </div>

              <Link
                to="/pais/$slug"
                params={{ slug: selected.slug }}
                className="mt-auto pt-6"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold shadow-sticker w-full justify-center">
                  Explorar {selected.name} →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
