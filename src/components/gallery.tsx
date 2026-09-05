import Reveal from "@/components/reveal"
import GalleryCarousel from "@/components/ui/gallery-carousel"

const Gallery = () => {
  return (
    <section id="gallery" className="scroll-mt-20 bg-surface px-6 py-16 md:scroll-mt-24 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
        <div className="mb-8 flex items-end gap-4 md:mb-12">
          <span className="h-12 w-px bg-gold" />
          <div>
            <h2 className="font-display text-4xl leading-tight text-bone md:text-5xl">Fotos de atendimentos</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 md:text-base">
              Arraste pros lados e veja um pouco do nosso trabalho.
            </p>
          </div>
        </div>
        </Reveal>

        <Reveal delay={0.15}>
          <GalleryCarousel />
        </Reveal>
      </div>
    </section>
  )
}

export default Gallery
