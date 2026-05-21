import { motion } from "framer-motion";
import { Sparkles, Rocket, PlayCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import luna from "@/assets/luna-mascot.png";
import { usePassport } from "@/context/PassportContext";

export function Hero() {
  const { isLoggedIn } = usePassport();
  return (
    <section id="top" className="relative overflow-hidden pt-10 pb-24 sm:pt-16 sm:pb-32">
      {/* Floating decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[8%] h-16 w-16 rounded-full bg-accent shadow-sticker animate-float-slow" />
        <div className="absolute top-40 right-[12%] h-10 w-10 rotate-12 rounded-2xl bg-secondary shadow-sticker animate-float-slow [animation-delay:1.2s]" />
        <div className="absolute bottom-24 left-[18%] h-12 w-12 rounded-full bg-[var(--mint)] shadow-sticker animate-float-slow [animation-delay:0.6s]" />
        <div className="absolute bottom-10 right-[20%] h-8 w-8 rounded-full bg-[var(--grape)] shadow-sticker animate-float-slow [animation-delay:1.8s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-accent/60 px-4 py-1.5 text-sm font-bold text-accent-foreground shadow-sticker"
          >
            <Sparkles className="h-4 w-4" />
            Aventura educativa para pequenos exploradores
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.02]"
          >
            Viaje pelo mundo,{" "}
            <span className="text-primary">aprendendo brincando</span>{" "}
            ✈️
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-lg sm:text-xl text-foreground/75 max-w-xl"
          >
            Descubra países, ouça histórias, jogue brincadeiras e colecione carimbos
            no seu passaporte — com a Luna Matias guiando cada aventura.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to={isLoggedIn ? "/lobby" : "/login"}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-4 text-base font-bold shadow-float hover:-translate-y-1 transition-all"
            >
              <Rocket className="h-5 w-5" />
              {isLoggedIn ? "Continuar aventura" : "Começar aventura"}
            </Link>
            <a
              href="#jogos"
              className="inline-flex items-center gap-2 rounded-full bg-card border-2 border-foreground/10 px-7 py-4 text-base font-bold shadow-sticker hover:border-primary/40 transition"
            >
              <PlayCircle className="h-5 w-5 text-primary" />
              Espiar as brincadeiras
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex items-center gap-6 text-sm text-foreground/70"
          >
            <div>
              <div className="font-display font-bold text-2xl text-foreground">20</div>
              <div>países para descobrir</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="font-display font-bold text-2xl text-foreground">6</div>
              <div>brincadeiras educativas</div>
            </div>
            <div className="hidden sm:block h-10 w-px bg-border" />
            <div className="hidden sm:block">
              <div className="font-display font-bold text-2xl text-foreground">100%</div>
              <div>seguro e sem anúncios</div>
            </div>
          </motion.div>
        </div>

        {/* Mascot card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-0 -rotate-3 rounded-[2.5rem] bg-gradient-tropical" />
            <div className="relative rounded-[2.5rem] bg-card p-6 shadow-float border-4 border-card">
              <img
                src={luna}
                alt="Luna Matias, a guia exploradora"
                width={1024}
                height={1024}
                className="w-full h-auto drop-shadow-xl"
              />
              <div className="absolute -top-4 -left-4 rotate-[-8deg] rounded-2xl bg-accent text-accent-foreground px-4 py-2 font-display font-bold shadow-sticker">
                Oi! Sou a Luna Matias 👋
              </div>
              <div className="absolute -bottom-5 -right-3 rotate-[6deg] rounded-2xl bg-secondary text-secondary-foreground px-4 py-2 font-display font-bold shadow-sticker">
                Vamos viajar juntos?
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
