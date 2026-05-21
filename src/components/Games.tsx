import { Gamepad2, Brain, Music2, Camera } from "lucide-react";

const games = [
  {
    icon: Gamepad2,
    title: "Caça aos Monumentos",
    desc: "Encontre pontos turísticos escondidos em cenários animados.",
    bg: "bg-gradient-sunset",
    tag: "Aventura",
  },
  {
    icon: Brain,
    title: "Quiz das Bandeiras",
    desc: "Adivinhe a bandeira certa e ganhe estrelinhas para o passaporte.",
    bg: "bg-gradient-tropical",
    tag: "Memória",
  },
  {
    icon: Music2,
    title: "Sons do Mundo",
    desc: "Escute músicas e idiomas de cada país e relacione com o lugar certo.",
    bg: "bg-gradient-candy",
    tag: "Áudio",
  },
  {
    icon: Camera,
    title: "Foto Safari",
    desc: "Tire fotos virtuais de animais, comidas e festas pelo planeta.",
    bg: "bg-gradient-sky",
    tag: "Cultural",
  },
];

export function Games() {
  return (
    <section id="jogos" className="py-20 sm:py-28 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block rounded-full bg-accent/60 px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              Brincadeiras e quizzes
            </span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-display font-bold">
              Brincadeiras que ensinam 🎉
            </h2>
          </div>
          <p className="max-w-md text-foreground/70">
            Atividades curtinhas, com narração da Luna e linguagem fácil — feitas para
            exploradores de 6 a 12 anos.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {games.map((g, i) => (
            <div
              key={g.title}
              className="group relative rounded-3xl bg-card p-6 shadow-soft border-2 border-border/40 hover:-translate-y-2 hover:shadow-float transition-all"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`${g.bg} h-16 w-16 rounded-2xl grid place-items-center shadow-sticker text-white mb-5 group-hover:rotate-6 transition-transform`}>
                <g.icon className="h-8 w-8" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {g.tag}
              </span>
              <h3 className="mt-1 text-xl font-display font-bold">{g.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
