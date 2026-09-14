"use client"

import { CoverflowCarousel, type CoverflowSlide } from "@/components/ui/coverflow-carousel"

const slides: CoverflowSlide[] = [
  {
    src: "/images/photo1.webp",
    alt: "Corte Social realizado na barbearia",
  },
  {
    src: "/images/photo2.webp",
    alt: "Corte Degradê realizado na barbearia",
  },
  {
    src: "/images/photo3.webp",
    alt: "Corte Americano realizado na barbearia",
  },
  {
    src: "/images/photo4.webp",
    alt: "Corte Freestyle realizado na barbearia",
  },
  {
    src: "/images/photo5.webp",
    alt: "Corte Moicano realizado na barbearia",
  },
]

export default function GalleryCarousel() {
  return (
    <CoverflowCarousel
      slides={slides}
      cardWidth="clamp(180px, 28vw, 340px)"
      label="Fotos de atendimentos"
      cardClassName="[&>img[src='/images/photo1.webp']]:object-right"
      showNavigation
      showPagination
    />
  )
}
