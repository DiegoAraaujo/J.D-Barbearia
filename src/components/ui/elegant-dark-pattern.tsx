import type React from "react"
import { cn } from "@/utils/class-name"

interface DarkGradientBgProps {
  children?: React.ReactNode
  className?: string
}

const streakMasks = [
  "linear-gradient(90deg, transparent 0%, #000 20%, transparent 36%, #000 55%, rgba(0,0,0,.13) 67%, #000 78%, transparent 97%)",
  "linear-gradient(90deg, transparent 11%, #000 25%, rgba(0,0,0,.55) 41%, rgba(0,0,0,.13) 67%, #000 78%, transparent 97%)",
  "linear-gradient(90deg, transparent 9%, #000 20%, rgba(0,0,0,.55) 28%, rgba(0,0,0,.42) 40%, #000 48%, rgba(0,0,0,.27) 54%, rgba(0,0,0,.13) 78%, #000 88%, transparent 97%)",
  "linear-gradient(90deg, transparent 0%, #000 17%, rgba(0,0,0,.55) 26%, #000 35%, transparent 47%, rgba(0,0,0,.13) 69%, #000 79%, transparent 97%)",
  "linear-gradient(90deg, transparent 0%, #000 20%, rgba(0,0,0,.55) 27%, #000 42%, transparent 48%, rgba(0,0,0,.13) 67%, #000 74%, #000 82%, rgba(0,0,0,.47) 88%, transparent 97%)",
]

export function DarkGradientBg({ children, className }: DarkGradientBgProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-ink", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background: "radial-gradient(100% 100% at 0% 0%, #202631 0%, #080a0f 100%)",
            mask: "radial-gradient(125% 100% at 0% 0%, #000 0%, rgba(0,0,0,.224) 88.2883%, transparent 100%)",
            WebkitMask: "radial-gradient(125% 100% at 0% 0%, #000 0%, rgba(0,0,0,.224) 88.2883%, transparent 100%)",
          }}
        >
          {streakMasks.map((mask) => (
            <div
              key={mask}
              className="absolute inset-0 opacity-[0.12]"
              style={{
                background: "linear-gradient(#a72d4c 0%, transparent 100%)",
                mask,
                WebkitMask: mask,
                transform: "skewX(45deg)",
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage: 'url("https://cdn.21st.dev/assets/mirror/f5/f55dfc553c100e6da0ad95258a042b4100f0ff4bb03a5313d1f541984275e262.png")',
          backgroundSize: "149.76px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(245,247,250,.45) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,217,226,0.1),transparent_42%)]" aria-hidden="true" />

      <div className="relative z-10">{children}</div>
    </div>
  )
}
