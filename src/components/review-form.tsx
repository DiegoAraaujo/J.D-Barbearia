"use client"

import { ChangeEvent, FormEvent, useRef, useState } from "react"
import { Camera, ImagePlus, Info, LoaderCircle, Star, X } from "lucide-react"
import CameraCapture from "@/components/camera-capture"

type FormStatus = "idle" | "sending" | "success" | "error"

const ReviewForm = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [rating, setRating] = useState(0)
  const [photo, setPhoto] = useState<File | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [photoOptionsOpen, setPhotoOptionsOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>("idle")
  const [message, setMessage] = useState("")

  const submitReview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    if (!rating) {
      setStatus("error")
      setMessage("Escolha uma nota de 1 a 5 estrelas.")
      return
    }

    setStatus("sending")
    try {
      const formData = new FormData(event.currentTarget)
      formData.set("rating", String(rating))
      if (photo) formData.set("photo", photo)
      const response = await fetch("/api/reviews", { method: "POST", body: formData })
      const result = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(result.error ?? "Não foi possível enviar sua avaliação.")

      formRef.current?.reset()
      if (galleryInputRef.current) galleryInputRef.current.value = ""
      setRating(0)
      setPhoto(null)
      setStatus("success")
      setMessage("Avaliação enviada! Ela aparecerá após a aprovação.")
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar sua avaliação.")
    }
  }

  const selectPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoto(event.target.files?.[0] ?? null)
    setMessage("")
  }

  return (
    <form ref={formRef} onSubmit={submitReview}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-bone/75">
          <span>Nome <span className="text-gold">*</span></span>
          <input name="name" required maxLength={80} className="h-12 rounded-sm border border-bone/15 bg-ink px-4 text-bone outline-none placeholder:text-bone/25 focus:border-gold/70" placeholder="Seu nome" />
        </label>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm text-bone/75">Sua nota <span className="text-gold">*</span></legend>
          <div className="flex h-12 items-center gap-2" aria-label="Nota de 1 a 5 estrelas">
            {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
              <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`} aria-pressed={rating === value} className="rounded-sm p-1 text-gold transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-gold">
                <Star className={value <= rating ? "fill-gold" : "fill-transparent"} />
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <label className="mt-6 flex flex-col gap-2 text-sm text-bone/75">
        <span>Comentário <span className="text-bone/40">(opcional)</span></span>
        <textarea name="comment" maxLength={300} rows={4} className="resize-y rounded-xl border border-bone/15 bg-ink px-4 py-3 text-bone outline-none placeholder:text-bone/25 focus:border-gold/70" placeholder="Conte como foi sua experiência" />
        <span className="text-right text-xs text-bone/35">Máximo de 300 caracteres</span>
      </label>

      <div className="mt-6">
        <p className="mb-3 text-sm text-bone/75">Foto <span className="text-bone/40">(opcional)</span></p>
        <button type="button" onClick={() => setPhotoOptionsOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-bone/15 bg-ink px-4 py-3 text-sm text-bone/65 transition-colors hover:border-gold/50 hover:text-gold">
          <Camera className="h-4 w-4" /> {photo ? "Trocar foto" : "Adicionar foto"}
        </button>
        <p className="mt-3 flex max-w-md items-start gap-2 text-xs leading-relaxed text-bone/45">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
          Ao enviar uma foto, você concorda que ela seja exibida publicamente junto à avaliação após a aprovação.
        </p>
        <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={selectPhoto} className="sr-only" />
        {photo ? <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-ink px-4 py-2 text-xs text-bone/60"><span className="truncate">{photo.name}</span><button type="button" onClick={() => setPhoto(null)} aria-label="Remover foto selecionada" className="shrink-0 text-bone/50 hover:text-gold"><X className="h-4 w-4" /></button></div> : null}
      </div>

      {photoOptionsOpen ? (
        <div className="fixed inset-0 z-1050 flex items-center justify-center bg-ink/70 p-4" role="dialog" aria-modal="true" aria-labelledby="photo-options-title" onMouseDown={(event) => event.target === event.currentTarget && setPhotoOptionsOpen(false)}>
          <div className="w-full max-w-xs rounded-2xl border border-bone/15 bg-surface p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="photo-options-title" className="font-display text-xl text-bone">Adicionar foto</h3>
              <button type="button" onClick={() => setPhotoOptionsOpen(false)} aria-label="Fechar opções de foto" className="text-bone/50 hover:text-gold"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-3">
              <button type="button" onClick={() => { setPhotoOptionsOpen(false); setCameraOpen(true) }} className="flex items-center gap-3 rounded-xl border border-bone/15 bg-ink p-4 text-left text-sm text-bone/75 hover:border-gold/50 hover:text-gold"><Camera className="h-5 w-5" /><span><strong className="block font-medium">Tirar foto</strong><span className="text-xs text-bone/40">Usar a câmera deste aparelho</span></span></button>
              <button type="button" onClick={() => { setPhotoOptionsOpen(false); galleryInputRef.current?.click() }} className="flex items-center gap-3 rounded-xl border border-bone/15 bg-ink p-4 text-left text-sm text-bone/75 hover:border-gold/50 hover:text-gold"><ImagePlus className="h-5 w-5" /><span><strong className="block font-medium">Escolher da galeria</strong><span className="text-xs text-bone/40">Selecionar uma imagem salva</span></span></button>
            </div>
          </div>
        </div>
      ) : null}

      {cameraOpen ? <CameraCapture onCapture={setPhoto} onClose={() => setCameraOpen(false)} /> : null}

      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "sending"} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-ink hover:bg-bone disabled:cursor-not-allowed disabled:opacity-60">
          {status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}{status === "sending" ? "Enviando..." : "Enviar avaliação"}
        </button>
        {message ? <p role="status" className={`text-sm ${status === "error" ? "text-red-300" : "text-gold"}`}>{message}</p> : null}
      </div>
    </form>
  )
}

export default ReviewForm
