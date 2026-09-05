"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus, X } from "lucide-react"
import ReviewForm from "@/components/review-form"

const ReviewModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-ink shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-bone hover:shadow-xl active:translate-y-0"><Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" /> Adicionar avaliação</button>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-1000 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
            <motion.div role="dialog" aria-modal="true" aria-labelledby="review-modal-title" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.2 }} className="relative max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-gold/25 bg-surface shadow-2xl">
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-bone/10 bg-surface/95 px-6 py-5 backdrop-blur md:px-8">
                <div><h2 id="review-modal-title" className="font-display text-2xl text-bone md:text-3xl">Deixe sua avaliação</h2><p className="mt-1 text-sm text-bone/55">Ela será publicada depois da aprovação.</p></div>
                <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone/60 hover:border-gold/50 hover:text-gold"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-6 md:p-8"><ReviewForm /></div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default ReviewModal
