import { NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

export const runtime = "nodejs"

const MAX_PHOTO_SIZE = 2 * 1024 * 1024
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

const extensionFor = (type: string) =>
  ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[type]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get("name") ?? "").trim()
    const comment = String(formData.get("comment") ?? "").trim()
    const rating = Number(formData.get("rating"))
    const website = String(formData.get("website") ?? "").trim()
    const photoEntry = formData.get("photo")
    const photo = photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null

    if (website) return NextResponse.json({ ok: true }, { status: 201 })

    if (!name || name.length > 80) {
      return NextResponse.json({ error: "Informe um nome com até 80 caracteres." }, { status: 400 })
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Escolha uma nota de 1 a 5 estrelas." }, { status: 400 })
    }

    if (comment.length > 300) {
      return NextResponse.json({ error: "O comentário deve ter até 300 caracteres." }, { status: 400 })
    }

    if (photo && (!ALLOWED_PHOTO_TYPES.has(photo.type) || photo.size > MAX_PHOTO_SIZE)) {
      return NextResponse.json(
        { error: "Envie uma imagem JPG, PNG ou WebP de até 2 MB." },
        { status: 400 },
      )
    }

    const supabase = createAdminSupabaseClient()
    let photoPath: string | null = null

    if (photo) {
      photoPath = `reviews/${crypto.randomUUID()}.${extensionFor(photo.type)}`
      const { error: uploadError } = await supabase.storage
        .from("review-avatars")
        .upload(photoPath, await photo.arrayBuffer(), {
          contentType: photo.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("Failed to upload review photo:", uploadError.message)
        return NextResponse.json({ error: "Não foi possível enviar a foto." }, { status: 500 })
      }
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      name,
      rating,
      comment: comment || null,
      photo_path: photoPath,
      status: "pending",
    })

    if (insertError) {
      if (photoPath) await supabase.storage.from("review-avatars").remove([photoPath])
      console.error("Failed to save review:", insertError.message)
      return NextResponse.json({ error: "Não foi possível salvar sua avaliação." }, { status: 500 })
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("Failed to submit review:", error)
    return NextResponse.json({ error: "Não foi possível enviar sua avaliação." }, { status: 500 })
  }
}
