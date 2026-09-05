"use client"

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "motion/react"
import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { cn } from "@/utils/class-name"

type DockProps = {
  children: ReactNode
  className?: string
  distance?: number
  panelHeight?: number
  magnification?: number
  spring?: SpringOptions
}

type DockPartProps = { className?: string; children: ReactNode }
type DockContextValue = {
  mouseX: MotionValue<number>
  spring: SpringOptions
  magnification: number
  distance: number
}
type DockItemContextValue = { width: MotionValue<number>; hovered: boolean }

const DockContext = createContext<DockContextValue | null>(null)
const DockItemContext = createContext<DockItemContextValue | null>(null)

const useDock = () => {
  const context = useContext(DockContext)
  if (!context) throw new Error("DockItem must be used inside Dock")
  return context
}

const useDockItem = () => {
  const context = useContext(DockItemContext)
  if (!context) throw new Error("DockLabel and DockIcon must be used inside DockItem")
  return context
}

const Dock = ({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 76,
  distance = 150,
  panelHeight = 64,
}: DockProps) => {
  const mouseX = useMotionValue(Infinity)
  const hovered = useMotionValue(0)
  const maxHeight = useMemo(() => Math.max(100, magnification + 28), [magnification])
  const height = useSpring(useTransform(hovered, [0, 1], [panelHeight, maxHeight]), spring)

  return (
    <motion.div style={{ height }} className="flex max-w-full items-start pt-2">
      <motion.div
        onMouseMove={(event) => {
          hovered.set(1)
          mouseX.set(event.clientX)
        }}
        onMouseLeave={() => {
          hovered.set(0)
          mouseX.set(Infinity)
        }}
        style={{ height: panelHeight }}
        className={cn(
          "mx-auto flex w-[min(36rem,calc(100vw-10rem))] items-center justify-between gap-6 rounded-3xl border border-bone/10 bg-ink/80 px-7 shadow-2xl backdrop-blur-xl",
          className,
        )}
        role="toolbar"
        aria-label="Navegação principal"
      >
        <DockContext.Provider value={{ mouseX, spring, magnification, distance }}>
          {children}
        </DockContext.Provider>
      </motion.div>
    </motion.div>
  )
}

const DockItem = ({ children, className }: DockPartProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { mouseX, spring, magnification, distance } = useDock()
  const [hovered, setHovered] = useState(false)
  const mouseDistance = useTransform(mouseX, (value) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return value - bounds.x - bounds.width / 2
  })
  const width = useSpring(
    useTransform(mouseDistance, [-distance, 0, distance], [44, magnification, 44]),
    spring,
  )

  return (
    <DockItemContext.Provider value={{ width, hovered }}>
      <motion.div
        ref={ref}
        style={{ width }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={cn("relative flex aspect-square shrink-0 items-center justify-center", className)}
      >
        {children}
      </motion.div>
    </DockItemContext.Provider>
  )
}

const DockLabel = ({ children, className }: DockPartProps) => {
  const { hovered } = useDockItem()
  return hovered ? (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className={cn(
        "pointer-events-none absolute top-full mt-3 whitespace-nowrap rounded-md border border-bone/10 bg-ink px-3 py-1.5 text-xs text-bone shadow-xl",
        className,
      )}
      role="tooltip"
    >
      {children}
    </motion.div>
  ) : null
}

const DockIcon = ({ children, className }: DockPartProps) => {
  const { width } = useDockItem()
  const iconWidth = useTransform(width, (value) => value * 0.4)
  return (
    <motion.div style={{ width: iconWidth, height: iconWidth }} className={cn("flex items-center justify-center", className)}>
      {children}
    </motion.div>
  )
}

export { Dock, DockIcon, DockItem, DockLabel }
