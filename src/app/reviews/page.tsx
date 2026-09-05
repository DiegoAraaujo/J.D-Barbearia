import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Footer from "@/components/footer"
import ReviewModal from "@/components/review-modal"
import ReviewsPageList from "@/components/reviews-page-list"
import { getApprovedReviews } from "@/lib/reviews"

export const dynamic = "force-dynamic"

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews()
  return (
    <main className="min-h-screen bg-ink text-bone">
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Link href="/#reviews" className="group mb-10 inline-flex items-center gap-2 text-sm text-bone/65 transition-colors hover:text-gold md:mb-14"><ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" /> Voltar ao início</Link>
          <div className="mb-8 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <span className="h-12 w-px bg-gold" />
              <div><span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Experiências reais</span><h1 className="mt-2 font-display text-4xl leading-tight text-white md:text-5xl">Avaliações dos clientes</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-bone/60 md:text-base">Veja o que nossos clientes dizem e compartilhe também sua experiência.</p></div>
            </div>
            <ReviewModal />
          </div>
          <ReviewsPageList reviews={reviews} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
