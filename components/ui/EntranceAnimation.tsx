"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ReactNode, useEffect, useState } from "react"

interface EntranceAnimationProps {
  children: ReactNode
  type?: "fadeIn" | "slideUp" | "slideDown" | "scale" | "bounce"
  delay?: number
  duration?: number
  className?: string
  trigger?: boolean
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 }
  },
  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }
  }
}

export function EntranceAnimation({
  children,
  type = "fadeIn",
  delay = 0,
  duration = 0.5,
  className = "",
  trigger = true
}: EntranceAnimationProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => setIsVisible(true), delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, delay])

  const variants = animationVariants[type]

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  const transition = {
    duration,
    delay: 0,
    ease: "easeOut" as const,
    ...(type === "bounce" ? { type: "spring" as const, stiffness: 260, damping: 20 } : {})
  }

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      animate={isVisible ? variants.animate : variants.initial}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

// Specialized components for common use cases
export function NewTokenAnimation({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <EntranceAnimation type="bounce" delay={0.1} duration={0.6} className={className}>
      {children}
    </EntranceAnimation>
  )
}

export function BattleResultAnimation({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <EntranceAnimation type="scale" delay={0.2} duration={0.4} className={className}>
      {children}
    </EntranceAnimation>
  )
}

export function NotificationAnimation({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <EntranceAnimation type="slideDown" delay={0} duration={0.3} className={className}>
      {children}
    </EntranceAnimation>
  )
}