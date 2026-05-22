import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Volume2, VolumeX, Video as VideoIcon } from "lucide-react";
import { useNarration } from "@/context/NarrationContext";

type Topic = {
  key: string;
  title: string;
  emoji: string;
  description: string;
  query: (country: string) => string;
  gradient: string;
};

const TOPICS: Topic[] = [
  {
    key: "turismo",
    title: "Pontos Turísticos",
    emoji: "🏛️",
    description: "Lugares incríveis para conhecer!",
    query: (c) => `${c} pontos turísticos para crianças`,
    gradient: "from-sky-300 to-blue-400",
  },
  {
    key: "cultura",
    title: "Cultura Local",
    emoji: "🎭",
    description: "Música, dança e tradições.",
    query: (c) => `cultura de ${c} para crianças`,
    gradient: "from-fuchsia-300 to-pink-400",
  },
  {
    key: "animais",
    title: "Animais Típicos",
    emoji: "🦁",
    description: "Bichinhos que vivem por lá!",
    query: (c) => `animais típicos de ${c} para crianças`,
    gradient: "from-amber-300 to-orange-400",
  },
  {
    key: "comidas",
    title: "Comidas Tradicionais",
    emoji: "🍲",
    description: "Sabores de dar água na boca!",
    query: (c) => `comidas típicas de ${c} para crianças`,
    gradient: "from-lime-300 to-emerald-400",
  },
  {
    key: "curiosidades",
    title: "Curiosidades Infantis",
    emoji: "✨",
    description: "Você sabia? Descubra coisas incríveis!",
    query: (c) => `curiosidades sobre ${c} para crianças`,
    gradient: "from-violet-300 to-indigo-400",
  },
];

export function AdventureVideos({
  countryName,
  color,
}: {
  countryName: string;
  color: string;
}) {
  const { speak, stop, speaking } = useNarration();

  const intro = useMemo(
    () =>
      `Vamos conhecer ${countryName} pelos vídeos! Toque em um tópico para abrir vídeos infantis sobre pontos turísticos, cultura, animais, comidas ou curiosidades.`,
    [countryName],
  );

  useEffect(() => () => stop(), [stop]);

  // We intentionally do NOT embed YouTube videos in an iframe anymore:
  // the previous `listType=search&list=...` embed format was deprecated by
  // YouTube and every "Assistir" click was showing "vídeo indisponível".
  // Opening a YouTube Kids / YouTube search result in a new tab is reliable
  // on every device, never breaks, and is the safest pick for children.
  const openVideos = (query: string) => {
    const safeUrl = `https://www.youtubekids.com/search?q=${encodeURIComponent(query)}`;
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      {/* Luna mediation */}
      <div
        className="rounded-2xl p-5 mb-5 flex items-start gap-3"
        style={{ background: `color-mix(in oklab, ${color} 25%, white)` }}
      >
        <div className="text-3xl">🌎</div>
        <p className="text-base sm:text-lg font-semibold text-foreground/85 flex-1">
          <strong>Luna Matias diz:</strong> “Bora conhecer {countryName} pelos
          vídeos da aventura! Escolha o tópico e abro vídeos infantis pra você. 🌎”
        </p>
        <button
          onClick={() => (speaking ? stop() : speak(intro))}
          aria-label={speaking ? "Pedir para a Luna parar" : "Ouvir convite da Luna"}
          className="flex-shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-sticker hover:-translate-y-0.5 transition"
        >
          {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </div>

      <h2 className="text-2xl font-display font-bold flex items-center gap-2">
        <VideoIcon className="h-6 w-6 text-primary" /> Vídeos da Aventura
      </h2>
      <p className="mt-1 text-foreground/70 text-sm">
        Toque em um tópico para abrir vídeos infantis no YouTube Kids — é seguro
        e cheio de coisas legais!
      </p>

      {/* Cards grid */}
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((topic) => {
          const query = topic.query(countryName);
          return (
            <motion.button
              key={topic.key}
              onClick={() => openVideos(query)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Abrir vídeos sobre ${topic.title} de ${countryName} no YouTube Kids`}
              className={`group relative overflow-hidden rounded-3xl p-5 text-left border-4 border-card hover:border-primary/40 transition shadow-sticker min-h-[140px] bg-gradient-to-br ${topic.gradient}`}
            >
              <div className="absolute -right-3 -top-3 text-6xl opacity-30 select-none">
                {topic.emoji}
              </div>
              <div className="relative">
                <div className="text-4xl drop-shadow">{topic.emoji}</div>
                <h3 className="mt-2 font-display font-bold text-lg text-white drop-shadow">
                  {topic.title}
                </h3>
                <p className="text-sm text-white/90 font-semibold drop-shadow">
                  {topic.description}
                </p>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-foreground">
                  Assistir <ExternalLink className="h-3 w-3" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-foreground/60 text-center">
        🎬 Os vídeos abrem em uma nova aba no YouTube Kids — peça ajuda a um
        adulto se precisar!
      </p>
    </div>
  );
}
