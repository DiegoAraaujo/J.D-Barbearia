import Reveal from "@/components/reveal"
import ScrollChoreography from "@/components/ui/scroll-choreography"

const images = {
  topLeft: "/images/barbershop-interior.webp",
  bottomRight:
    "https://images.unsplash.com/photo-1546596468-13349ee0c504?auto=format&fit=crop&w=1600&q=80",
  bottomLeft:
    "https://images.unsplash.com/photo-1759134248487-e8baaf31e33e?auto=format&fit=crop&w=1600&q=80",
  topRight:
    "https://images.unsplash.com/photo-1703792686756-c82bf734c89b?auto=format&fit=crop&w=1600&q=80",
}

const About = () => {
  return (
    <section id="about" className="scroll-mt-20 bg-ink md:scroll-mt-24">
      <div className="px-6 pt-16 md:px-12 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
          <div className="mb-6 flex items-end gap-4">
            <span className="h-12 w-px bg-gold" />
            <div>
              <h2 className="font-display text-4xl leading-tight text-bone md:text-5xl">
                Por trás da cadeira
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 md:text-base">
                De oportunidade a propósito.
              </p>
            </div>
          </div>
          </Reveal>
        </div>
      </div>

      <ScrollChoreography className="mt-6 md:mt-8" images={images} />
    </section>
  )
}

export default About
