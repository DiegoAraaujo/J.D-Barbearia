"use client"

import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"

const MotionProvider = ({ children }: { children: ReactNode }) => {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export default MotionProvider
