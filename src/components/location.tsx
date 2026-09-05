import { MapPin } from "lucide-react"
import Reveal from "@/components/reveal"

const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.2107297001676!2d-39.207179925249676!3d-6.2017887937859655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7a325006ac17901%3A0x37f9f8bde34d50fa!2sRF%20BARBER!5e1!3m2!1spt-BR!2sbr!4v1788306230439!5m2!1spt-BR!2sbr"

const Location = () => {
  return (
    <section id="location" className="scroll-mt-20 bg-ink bg-[radial-gradient(circle_at_85%_25%,rgba(104,21,42,0.16),transparent_34%)] px-6 py-16 md:scroll-mt-24 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex items-end gap-4 md:mb-12">
            <span className="h-12 w-px bg-gold" />
            <div>
              <h2 className="font-display text-4xl leading-tight text-bone md:text-5xl">Onde estamos</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 md:text-base">
                Um espaço preparado para você chegar, relaxar e sair renovado.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid overflow-hidden rounded-2xl border border-bone/10 bg-surface shadow-[0_20px_70px_rgba(104,21,42,0.12)] lg:h-[440px] lg:grid-cols-[1.55fr_0.85fr]">
          <Reveal className="h-full min-h-[360px] lg:min-h-0">
            <div className="relative h-full min-h-[360px] w-full bg-ink lg:min-h-0">
              {mapEmbedUrl ? (
                <iframe
                  src={mapEmbedUrl}
                  title="Localização da J.D Barbearia no Google Maps"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[.2] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-4 flex flex-col items-center justify-center rounded-md border border-dashed border-gold/25 bg-[radial-gradient(circle_at_center,rgba(212,217,226,0.1),transparent_65%)] px-6 text-center md:inset-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold">
                    <MapPin className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-display text-2xl text-bone">Mapa da J.D Barbearia</p>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-bone/50">
                    O mapa do Google Maps será exibido aqui.
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <div className="flex h-full flex-col justify-center p-7 md:p-10 lg:p-12">
            <Reveal delay={0.1}>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                Visite a J.D Barbearia
              </span>
              <h3 className="mt-3 font-display text-3xl text-bone md:text-4xl">
                Fácil de chegar.<br />Difícil é não voltar.
              </h3>
            </Reveal>

            <div className="mt-9 space-y-7">
              <Reveal delay={0.16}>
                <div className="flex gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-medium text-bone">Endereço</p>
                    <p className="mt-1 text-sm leading-relaxed text-bone/55">
                      Sítio Tapuio, Quixelô — próximo à escola, ao lado de uma árvore gigante.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Location
