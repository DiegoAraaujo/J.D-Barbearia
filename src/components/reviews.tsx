import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Reveal from "@/components/reveal"
import { Testimonial } from "@/components/ui/testimonial-card"
import { DarkGradientBg } from "@/components/ui/elegant-dark-pattern"
import { getApprovedReviews } from "@/lib/reviews"

const Reviews = async () => {
  const reviews = await getApprovedReviews(6)

  return (
    <DarkGradientBg className="min-h-0">
    <section id="reviews" className="scroll-mt-20 bg-transparent px-6 py-16 md:scroll-mt-24 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-8 flex items-end gap-4 md:mb-12">
            <span className="h-12 w-px bg-gold" />
            <div>
              <h2 className="font-display text-4xl leading-tight text-white md:text-5xl">O que dizem</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60 md:text-base">Avaliações de quem já passou pela cadeira.</p>
            </div>
          </div>
        </Reveal>
        {reviews.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => <Reveal key={review.id} delay={index * 0.12}><Testimonial {...review} /></Reveal>)}
          </div>
        ) : (
          <Reveal><p className="rounded-lg border border-bone/10 bg-surface p-8 text-center text-bone/60">Ainda não há avaliações publicadas. Seja o primeiro a avaliar.</p></Reveal>
        )}
        <Reveal delay={0.2}>
          <div className="mt-8 flex justify-center md:mt-10">
            <Link href="/reviews" className="group inline-flex items-center gap-3 rounded-xl border border-white/50 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink hover:shadow-xl hover:shadow-black/20 active:translate-y-0">
              Ver e enviar avaliações <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
    </DarkGradientBg>
  )
}

export default Reviews
