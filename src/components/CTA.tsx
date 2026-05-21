import { Rocket } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-candy p-10 sm:p-16 text-center text-white shadow-float">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-accent/40 blur-2xl" />
          <div className="relative">
            <div className="text-5xl mb-3 animate-wiggle inline-block">🚀</div>
            <h2 className="text-4xl sm:text-5xl font-display font-bold">
              Bora começar a aventura?
            </h2>
            <p className="mt-4 text-lg sm:text-xl opacity-95 max-w-xl mx-auto">
              Crie seu passaporte gratuito e descubra o mundo com a Luna Matias!
            </p>
            <a
              href="#mapa"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-primary px-8 py-4 font-bold shadow-sticker hover:-translate-y-1 transition"
            >
              <Rocket className="h-5 w-5" />
              Começar aventura
            </a>
            <p className="mt-3 text-xs opacity-80">Grátis • Sem anúncios • Seguro para crianças</p>
          </div>
        </div>
      </div>
    </section>
  );
}
