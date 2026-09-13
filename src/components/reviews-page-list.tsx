"use client"

import { useState } from "react"
import { Testimonial } from "@/components/ui/testimonial-card"
import type { Review } from "@/lib/reviews"

const ITEMS_PER_PAGE = 10

const ReviewsPageList = ({ reviews }: { reviews: Review[] }) => {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE)
  const visibleReviews = reviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const changePage = (nextPage: number) => {
    setPage(nextPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!reviews.length) return <p className="rounded-lg border border-bone/10 bg-surface p-8 text-center text-bone/60">Ainda não há avaliações publicadas.</p>

  return (
    <>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:gap-7">
        {visibleReviews.map((review) => <Testimonial key={review.id} {...review} avatarClassName="h-14 w-14 md:h-16 md:w-16" className="h-auto p-7 md:p-10 [&>p]:text-sm" />)}
      </div>
      {totalPages > 1 ? (
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Paginação das avaliações">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => changePage(number)} aria-current={page === number ? "page" : undefined} className={`flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium ${page === number ? "border-gold bg-gold text-ink" : "border-bone/15 text-bone/60"}`}>{number}</button>)}
        </nav>
      ) : null}
    </>
  )
}

export default ReviewsPageList
