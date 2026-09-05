"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Testimonial } from "@/components/ui/testimonial-card"
import type { Review } from "@/lib/reviews"

const ITEMS_PER_PAGE = 3
const MOBILE_INITIAL_ITEMS = 6

const ReviewsPageList = ({ reviews }: { reviews: Review[] }) => {
  const [page, setPage] = useState(1)
  const [mobileVisible, setMobileVisible] = useState(MOBILE_INITIAL_ITEMS)
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE)
  const desktopReviews = reviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const mobileReviews = reviews.slice(0, mobileVisible)

  const changePage = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!reviews.length) return <p className="rounded-lg border border-bone/10 bg-surface p-8 text-center text-bone/60">Ainda não há avaliações publicadas.</p>

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-6 md:hidden">
        {mobileReviews.map((review) => <Testimonial key={review.id} {...review} avatarClassName="h-14 w-14" className="h-auto p-7 [&>p]:text-sm" />)}
      </div>
      <div className="mx-auto hidden max-w-5xl grid-cols-1 gap-7 md:grid">
        {desktopReviews.map((review) => <Testimonial key={review.id} {...review} avatarClassName="h-16 w-16" className="h-auto p-10 [&>p]:text-sm" />)}
      </div>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3 md:hidden">
        {mobileVisible < reviews.length ? <button type="button" onClick={() => setMobileVisible((current) => Math.min(current + ITEMS_PER_PAGE, reviews.length))} className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-medium text-ink">Ver mais <ChevronDown className="h-4 w-4" /></button> : null}
        {mobileVisible > MOBILE_INITIAL_ITEMS ? <button type="button" onClick={() => setMobileVisible(MOBILE_INITIAL_ITEMS)} className="inline-flex items-center gap-2 rounded-xl border border-gold/40 px-6 py-3 text-sm font-medium text-gold">Ver menos <ChevronUp className="h-4 w-4" /></button> : null}
      </div>
      {totalPages > 1 ? (
        <nav className="mt-10 hidden items-center justify-center gap-2 md:flex" aria-label="Paginação das avaliações">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => changePage(number)} aria-current={page === number ? "page" : undefined} className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium ${page === number ? "border-gold bg-gold text-ink" : "border-bone/15 text-bone/60"}`}>{number}</button>)}
        </nav>
      ) : null}
    </>
  )
}

export default ReviewsPageList
