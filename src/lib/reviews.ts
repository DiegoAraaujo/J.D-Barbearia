import "server-only"

import { createPublicSupabaseClient } from "@/lib/supabase"

export type Review = {
  id: string
  name: string
  rating: number
  testimonial?: string
  image?: string
  role: string
}

type ReviewRow = {
  id: string
  name: string
  rating: number
  comment: string | null
  photo_path: string | null
  created_at: string
}

const reviewDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
})

export const getApprovedReviews = async (limit?: number): Promise<Review[]> => {
  const supabase = createPublicSupabaseClient()
  let query = supabase
    .from("reviews")
    .select("id, name, rating, comment, photo_path, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    console.error("Failed to load reviews:", error.message)
    return []
  }

  return (data as ReviewRow[]).map((review) => ({
    id: review.id,
    name: review.name,
    rating: review.rating,
    testimonial: review.comment ?? undefined,
    image: review.photo_path
      ? supabase.storage.from("review-avatars").getPublicUrl(review.photo_path).data.publicUrl
      : undefined,
    role: `Avaliação de ${reviewDateFormatter.format(new Date(review.created_at))}`,
  }))
}
