"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef, ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const directionVariants = {
  up: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 }
  },
  down: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 }
  },
  left: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 }
  },
  right: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 }
  }
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const shouldReduceMotion = useReducedMotion()

  const variants = directionVariants[direction]

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={shouldReduceMotion ? {} : variants.initial}
      animate={shouldReduceMotion ? {} : (isInView ? variants.animate : variants.initial)}
      transition={{
        duration,
        delay,
        ease: "easeOut" as const
      }}
    >
      {children}
    </motion.div>
  )
}