import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, RotateCcw, Volume2, VolumeX, Video as VideoIcon } from "lucide-react";
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
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [playerKey, setPlayerKey] = useState(0);

  const intro = useMemo(
    () =>
      `Vamos conhecer ${countryName} pelos vídeos! Escolha um tópico: pontos turísticos, cultura, animais, comidas ou curiosidades.`,
    [countryName],
  );

  useEffect(() => () => stop(), [stop]);

  const active = TOPICS.find((t) => t.key === activeKey);
  const query = active ? active.query(countryName) : "";
  const embedSrc = active
    ? `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}&cc_load_policy=1&hl=pt&modestbranding=1&rel=0`
    : "";

  return (
    <div className="rounded-3xl bg-card p-6 sm:p-8 border-2 border-border/40 shadow-soft">
      {/* Luna mediation */}
      <div
        className="rounded-2xl p-5 mb-5 flex items-start gap-3"
        style={{ background: `color-mix(in oklab, ${color} 25%, white)` }}
      >
        <div className="text-3xl">🌎</div>
        <p className="text-base sm:text-lg font-semibold text-foreground/85 flex-1">
          <strong>Luna Matias diz:</strong> “Bora conhecer {countryName} pelos vídeos da aventura! Escolha o tópico que mais te encanta. 🌎”
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
        Vídeos educativos com legendas — toque em um card para começar!
      </p>

      {/* Cards grid */}
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPICS.map((topic) => {
          const isActive = activeKey === topic.key;
          return (
            <motion.button
              key={topic.key}
              onClick={() => {
                setActiveKey(topic.key);
                setPlayerKey((k) => k + 1);
              }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Assistir vídeos sobre ${topic.title} de ${countryName}`}
              aria-pressed={isActive}
              className={`group relative overflow-hidden rounded-3xl p-5 text-left border-4 transition shadow-sticker min-h-[140px] ${
                isActive ? "border-primary ring-4 ring-primary/30" : "border-card hover:border-primary/40"
              } bg-gradient-to-br ${topic.gradient}`}
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
                  <Play className="h-3 w-3 fill-current" /> Assistir
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Player */}
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border-4 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-3 sm:p-5"
        >
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <span className="text-2xl">{active.emoji}</span>
              {active.title} — {countryName}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setPlayerKey((k) => k + 1)}
                aria-label="Recomeçar vídeo"
                className="inline-flex items-center gap-1.5 rounded-full bg-card border-2 border-border px-3 py-2 text-sm font-bold hover:border-primary/40 min-h-11"
              >
                <RotateCcw className="h-4 w-4" /> Replay
              </button>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIYAQ%253D%253D`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir mais vídeos no YouTube"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-2 text-sm font-bold shadow-sticker hover:-translate-y-0.5 transition min-h-11"
              >
                Mais vídeos <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video shadow-float">
            <iframe
              key={playerKey}
              src={embedSrc}
              title={`Vídeos sobre ${active.title} de ${countryName}`}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>

          <p className="mt-3 text-xs text-foreground/60 text-center">
            🎬 Vídeos com legendas em português. Peça ajuda a um adulto se precisar!
          </p>
        </motion.div>
      )}
    </div>
  );
}
