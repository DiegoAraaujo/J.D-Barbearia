"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react"

const particles = [
  { left: "4%", size: 3, delay: 0, duration: 14 },
  { left: "11%", size: 2, delay: 2.4, duration: 11 },
  { left: "19%", size: 4, delay: 5.1, duration: 16 },
  { left: "27%", size: 2, delay: 1.2, duration: 12 },
  { left: "35%", size: 3, delay: 3.6, duration: 15 },
  { left: "43%", size: 2, delay: 6.3, duration: 13 },
  { left: "52%", size: 4, delay: 0.8, duration: 17 },
  { left: "60%", size: 2, delay: 4.4, duration: 11 },
  { left: "68%", size: 3, delay: 2.9, duration: 14 },
  { left: "76%", size: 2, delay: 5.7, duration: 12 },
  { left: "84%", size: 3, delay: 1.6, duration: 16 },
  { left: "92%", size: 2, delay: 3.1, duration: 13 },
  { left: "97%", size: 3, delay: 4.9, duration: 15 },
]

const useReducedMotion = () => {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const handleChange = () => setReduced(query.matches)
    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
  }, [])

  return reduced
}

const HeroFx = () => {
  const reduced = useReducedMotion()
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(30)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const background = useMotionTemplate`radial-gradient(480px circle at ${springX}% ${springY}%, rgba(212,217,226,0.16), transparent 70%)`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - bounds.left) / bounds.width) * 100)
    mouseY.set(((event.clientY - bounds.top) / bounds.height) * 100)
  }

  return (
    <div onPointerMove={handlePointerMove} className="absolute inset-0 z-5">
      <motion.div className="pointer-events-none absolute inset-0" style={{ background }} />

      {!reduced ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((particle, index) => (
            <motion.span
              key={index}
              className="absolute bottom-0 rounded-full bg-gold"
              style={{ left: particle.left, width: particle.size, height: particle.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: "-100vh", opacity: [0, 0.7, 0.7, 0] }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default HeroFx
