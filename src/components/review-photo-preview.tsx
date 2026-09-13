"use client"

import { useEffect, useRef } from "react"
import { Expand, X } from "lucide-react"

const ReviewPhotoPreview = ({ photo, onRemove }: { photo: File; onRemove: () => void }) => {
  const thumbnailRef = useRef<HTMLImageElement>(null)
  const expandedImageRef = useRef<HTMLImageElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(photo)
    if (thumbnailRef.current) thumbnailRef.current.src = url
    if (expandedImageRef.current) expandedImageRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [photo])

  return (
    <>
      <div className="mt-3 flex items-center gap-4 rounded-xl bg-ink p-3">
        <button type="button" onClick={() => dialogRef.current?.showModal()} aria-label="Ampliar foto selecionada" className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-bone/15 focus-visible:outline-2 focus-visible:outline-gold">
          {/* eslint-disable-next-line @next/next/no-img-element -- Local file preview uses a temporary object URL. */}
          <img ref={thumbnailRef} alt="Prévia da foto selecionada" className="h-full w-full object-cover" />
          <span className="absolute bottom-1 right-1 rounded-md bg-ink/75 p-1 text-white"><Expand className="h-4 w-4" aria-hidden="true" /></span>
        </button>
        <div className="min-w-0 flex-1 text-xs text-bone/60">
          <p className="truncate">{photo.name}</p>
          <p className="mt-2">Clique na foto para ampliar</p>
        </div>
        <button type="button" onClick={onRemove} aria-label="Remover foto selecionada" className="shrink-0 rounded-lg p-2 text-bone/50 hover:text-gold"><X className="h-4 w-4" /></button>
      </div>
      <dialog ref={dialogRef} aria-label="Foto selecionada ampliada" onKeyDown={(event) => event.stopPropagation()} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close() }} className="fixed inset-0 m-auto h-[100dvh] max-h-none w-screen max-w-none border-0 bg-ink/95 p-4 text-bone backdrop:bg-black/80 open:flex open:items-center open:justify-center md:p-10">
        <button type="button" autoFocus onClick={() => dialogRef.current?.close()} aria-label="Fechar foto ampliada" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-bone/25 bg-ink text-bone hover:text-gold"><X className="h-6 w-6" /></button>
        {/* eslint-disable-next-line @next/next/no-img-element -- Local file preview uses a temporary object URL. */}
        <img ref={expandedImageRef} alt="Foto selecionada ampliada" className="max-h-[calc(100dvh-6rem)] max-w-full rounded-lg object-contain" />
      </dialog>
    </>
  )
}

export default ReviewPhotoPreview
