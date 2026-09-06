"use client"

import Image from "next/image"

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react"
import { useRef, useState } from "react"
import { cn } from "@/utils/class-name"
import { ChevronDown } from "lucide-react"

interface Props {
  className?: string
  images: Record<"topLeft" | "topRight" | "bottomLeft" | "bottomRight", string>
}

const story = [
  ["01", "A oportunidade", "Comecei a cortar cabelo quando o antigo barbeiro do local deixou de atender e eu decidi assumir.", "topLeft", "md:left-[4vw] md:top-[14vh]"],
  ["02", "6+ anos de caminhada", "O que começou como oportunidade se tornou profissão: são mais de seis anos dedicados à barbearia.", "topRight", "md:right-[4vw] md:top-[14vh]"],
  ["03", "Pessoas", "Conheci pessoas de todos os estilos e perfis, e muitas delas se tornaram grandes amizades.", "bottomLeft", "md:bottom-[14vh] md:left-[4vw]"],
  ["04", "Qualidade", "Cada corte recebe atenção aos detalhes para entregar qualidade e um resultado que faça sentido para você.", "bottomRight", "md:bottom-[14vh] md:right-[4vw]"],
] as const

const service = [
  ["01", "Atenção em cada detalhe", "Um bom atendimento começa entendendo o que você procura, prestando atenção nos detalhes e fazendo tudo com cuidado.", "bottomLeft"],
  ["02", "Sinta-se à vontade", "A cadeira também é um lugar para desacelerar, conversar, relaxar ou simplesmente aproveitar o momento.", "bottomRight"],
] as const

const ScrollChoreography = ({ className, images }: Props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const { scrollY, scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const p = useSpring(scrollYProgress, { stiffness: 260, damping: 42, mass: 1.1, restDelta: 0.001 })

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious()
    if (previous !== undefined && current !== previous) {
      setScrollDirection(current > previous ? "down" : "up")
    }
  })
  const fourOpacity = useTransform(p, [0, 0.3, 0.37], [1, 1, 0])
  const fourScale = useTransform(p, [0, 0.3, 0.37], [0.92, 1, 0.9])
  const twoOpacity = useTransform(p, [0.32, 0.39, 0.61, 0.68], [0, 1, 1, 0])
  const twoScale = useTransform(p, [0.32, 0.42, 0.62, 0.7], [0.85, 1, 1, 0.9])
  const leftX = useTransform(p, [0.32, 0.42, 0.62, 0.7], ["-5vw", "-18vw", "-18vw", "0vw"])
  const rightX = useTransform(p, [0.32, 0.42, 0.62, 0.7], ["5vw", "18vw", "18vw", "0vw"])
  const finalOpacity = useTransform(p, [0.64, 0.72], [0, 1])
  const finalWidth = useTransform(p, [0.64, 0.74, 0.9, 1], ["38vw", "54vw", "100vw", "100vw"])
  const finalHeight = useTransform(p, [0.64, 0.74, 0.9, 1], ["48vh", "64vh", "100vh", "100vh"])
  const finalRadius = useTransform(p, [0.74, 0.9], ["2px", "0px"])
  const contentOpacity = useTransform(p, [0.72, 0.8], [0, 1])
  const contentY = useTransform(p, [0.72, 0.82], [28, 0])
  const scrollHintOpacity = useTransform(p, [0, 0.82, 0.9], [1, 1, 0])

  return (
    <div ref={ref} className={cn("relative h-[420vh] w-full", className)}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <motion.div style={{ opacity: fourOpacity, scale: fourScale }} className="absolute inset-0 grid grid-cols-2 gap-3 p-4 md:block md:p-0">
          {story.map(([number, title, text, image, position]) => (
            <article key={number} className={cn("relative min-h-0 overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/20 md:absolute md:h-[31vh] md:w-[42vw]", position)}>
              <Image src={images[image]} alt="" fill sizes="(min-width: 768px) 42vw, 50vw" className={image === "topLeft" ? "object-cover object-bottom-right md:object-bottom" : "object-cover"} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/15" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <span className="text-xs font-semibold tracking-[.2em] text-gold">{number}</span>
                <h3 className="mt-1 font-display text-xl text-bone md:text-2xl">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-bone/75 md:text-sm">{text}</p>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div style={{ opacity: twoOpacity, scale: twoScale }} className="absolute inset-0 flex items-center justify-center">
          {service.map(([number, title, text, image], index) => (
            <motion.article key={number} style={{ x: index ? rightX : leftX }} className="absolute h-[58vh] w-[42vw] min-w-[145px] max-w-[540px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gold/20 md:h-[54vh] md:w-[34vw]">
              <Image src={images[image]} alt="" fill sizes="(min-width: 768px) 34vw, 42vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-8">
                <span className="text-xs font-semibold tracking-[.2em] text-gold">{number}</span>
                <h3 className="mt-2 font-display text-xl text-bone md:text-3xl">{title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-bone/80 md:text-base">{text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.article style={{ opacity: finalOpacity, width: finalWidth, height: finalHeight, borderRadius: finalRadius }} className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-surface shadow-2xl ring-1 ring-gold/20">
          <Image src={images.topRight} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/25" />
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="absolute inset-0 flex max-w-2xl flex-col justify-end p-6 pb-12 md:justify-center md:p-12 lg:p-20">
            <span className="text-xs font-semibold uppercase tracking-[.24em] text-gold">Sobre mim</span>
            <h3 className="mt-3 font-display text-4xl text-bone md:text-6xl">Seu barbeiro</h3>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-bone/80 md:text-lg">Sou Diego, barbeiro e universitário. Há mais de seis anos, transformei uma oportunidade em profissão e paixão.</p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-bone/80 md:text-lg">Hoje, busco oferecer mais que um bom corte: um atendimento cuidadoso, leve e acolhedor.</p>
            <p className="mt-5 max-w-xl border-l border-gold pl-4 font-display text-lg text-bone md:text-2xl">Quero que você saia bem com o corte — e também mais tranquilo e à vontade.</p>
          </motion.div>
        </motion.article>

        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute bottom-5 left-1/2 z-50 -translate-x-1/2 md:bottom-8"
          aria-hidden="true"
        >
          <motion.div
            animate={{ rotate: scrollDirection === "down" ? 0 : 180 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-gold drop-shadow-[0_0_10px_rgba(212,217,226,0.5)]"
          >
            <ChevronDown className="h-9 w-9 animate-bounce md:h-11 md:w-11" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ScrollChoreography
