import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import worldMap from "@/assets/world-map.jpg";
import { COUNTRY_LIST } from "@/data/countries";
import { COUNTRY_ISO } from "@/data/miniGames";
import { usePassport } from "@/context/PassportContext";
import { Flag } from "@/components/Flag";

export function LobbyMap() {
  const { hasStamp } = usePassport();

  return (
    <div className="relative rounded-[2rem] overflow-hidden bg-card border-4 border-card shadow-float">
      <img
        src={worldMap}
        alt="Mapa-múndi"
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0">
        {COUNTRY_LIST.map((c) => {
          const iso = COUNTRY_ISO[c.slug];
          return (
            <Link
              key={c.slug}
              to="/pais/$slug"
              params={{ slug: c.slug }}
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full overflow-hidden shadow-sticker ring-4 ring-white/90 hover:scale-125 transition-transform"
              aria-label={c.name}
              title={c.name}
            >
              <Flag iso={iso} name={c.name} rounded="rounded-full" />
              {hasStamp(c.slug) && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--mint)] border-2 border-white text-[10px] grid place-items-center z-10"
                >
                  ✓
                </motion.span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

