import { ArrowRight, CalendarCheck, Eye, Scissors, Sparkles } from "lucide-react"
import Reveal from "@/components/reveal"

const services = [
  {
    title: "Barba",
    description: "Desenho, alinhamento e acabamento para manter a barba bem cuidada.",
    icon: Sparkles,
  },
  {
    title: "Cabelo",
    description: "Corte pensado para o seu estilo, com atenção aos detalhes e ao acabamento.",
    icon: Scissors,
  },
  {
    title: "Corte + barba",
    description: "O cuidado completo para renovar o cabelo e a barba no mesmo atendimento.",
    icon: Scissors,
  },
  {
    title: "Sobrancelha",
    description: "Limpeza e alinhamento sutis para completar o visual com naturalidade.",
    icon: Eye,
  },
]

const Services = () => {
  return (
    <section id="services" className="scroll-mt-20 bg-surface px-6 py-16 md:scroll-mt-24 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex items-end gap-4 md:mb-12">
            <span className="h-12 w-px bg-gold" />
            <div>
              <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">Serviços</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 md:text-base">
                Escolha seu cuidado e deixe o restante comigo.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Reveal key={service.title} delay={index * 0.08}>
                <article className="group flex h-full min-h-56 flex-col rounded-2xl border border-gold/15 bg-ink p-6 transition-colors hover:border-gold/45 md:p-7">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-7 font-display text-2xl leading-tight text-bone">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone/60">
                    {service.description}
                  </p>
                  <a href="#contact" className="group/link mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-gold transition-colors hover:text-gold-bright">
                    Agendar atendimento
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  </a>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={0.18}>
          <article className="relative mt-5 overflow-hidden rounded-2xl border border-bone/10 bg-gradient-to-r from-wine/35 via-ink to-ink p-7 md:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-wine-bright/20 blur-3xl" />
            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="flex max-w-3xl gap-5">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wine-bright text-bone sm:flex">
                  <CalendarCheck className="h-6 w-6" strokeWidth={1.7} />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-wine-bright">
                    Vantagem para cliente frequente
                  </span>
                  <h3 className="mt-2 font-display text-3xl text-bone md:text-4xl">
                    Combão do mês
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-bone/65 md:text-base">
                    Para quem gosta de manter o corte sempre em dia: venha todas as semanas e aproveite
                    uma condição especial durante o mês.
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/5588996553613?text=${encodeURIComponent("Olá! Gostaria de consultar o desconto do Combão do mês.")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-medium text-ink shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone hover:shadow-xl hover:shadow-black/25 active:translate-y-0"
              >
                Consultar desconto
              </a>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}

export default Services
