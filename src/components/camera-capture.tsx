"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, LoaderCircle, RotateCcw, X } from "lucide-react"

type CameraCaptureProps = {
  onCapture: (photo: File) => void
  onClose: () => void
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState("")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Este navegador não oferece acesso à câmera.")
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        })

        if (!active) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }
      } catch (cameraError) {
        console.error("Failed to open camera:", cameraError)
        if (active) setError("Não foi possível abrir a câmera. Verifique a permissão do navegador.")
      }
    }

    void startCamera()

    return () => {
      active = false
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const takePhoto = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const size = Math.min(video.videoWidth, video.videoHeight)
    const canvas = document.createElement("canvas")
    canvas.width = 800
    canvas.height = 800
    const context = canvas.getContext("2d")
    if (!context) return

    const sourceX = (video.videoWidth - size) / 2
    const sourceY = (video.videoHeight - size) / 2
    context.translate(800, 0)
    context.scale(-1, 1)
    context.drawImage(video, sourceX, sourceY, size, size, 0, 0, 800, 800)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        onCapture(new File([blob], `foto-${Date.now()}.jpg`, { type: "image/jpeg" }))
        onClose()
      },
      "image/jpeg",
      0.85,
    )
  }

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-ink/95 p-4" role="dialog" aria-modal="true" aria-label="Tirar foto">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gold/25 bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-bone/10 px-5 py-4">
          <h3 className="font-display text-2xl text-bone">Tirar uma foto</h3>
          <button type="button" onClick={onClose} aria-label="Fechar câmera" className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/15 text-bone/60 hover:text-gold"><X className="h-4 w-4" /></button>
        </div>

        <div className="relative aspect-square bg-black">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full scale-x-[-1] object-cover" />
          {!ready && !error ? <div className="absolute inset-0 flex items-center justify-center text-bone/70"><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Abrindo câmera...</div> : null}
          {error ? <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center text-bone/70"><Camera className="mb-4 h-10 w-10 text-gold" /><p>{error}</p></div> : null}
        </div>

        <div className="flex justify-center gap-3 p-5">
          {error ? (
            <button type="button" onClick={onClose} className="inline-flex h-11 items-center gap-2 rounded-xl border border-gold/40 px-5 text-sm text-gold"><RotateCcw className="h-4 w-4" /> Voltar</button>
          ) : (
            <button type="button" onClick={takePhoto} disabled={!ready} className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-ink disabled:opacity-50"><Camera className="h-5 w-5" /> Capturar foto</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CameraCapture
