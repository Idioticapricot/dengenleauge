"use client"

import { useEffect, useRef } from "react"

interface LiveRegionProps {
  children: string
  priority?: "polite" | "assertive"
  role?: "status" | "alert" | "log"
  className?: string
}

export function LiveRegion({
  children,
  priority = "polite",
  role = "status",
  className = ""
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current && children) {
      // Clear and set the content to trigger screen reader announcement
      regionRef.current.textContent = ""
      // Use setTimeout to ensure the content change is detected
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = children
        }
      }, 100)
    }
  }, [children])

  return (
    <div
      ref={regionRef}
      aria-live={priority}
      role={role}
      className={`sr-only ${className}`}
      aria-atomic="true"
    >
      {children}
    </div>
  )
}

// Specialized live regions for common use cases
export function StatusLiveRegion({ message, className = "" }: { message: string, className?: string }) {
  return (
    <LiveRegion priority="polite" role="status" className={className}>
      {message}
    </LiveRegion>
  )
}

export function AlertLiveRegion({ message, className = "" }: { message: string, className?: string }) {
  return (
    <LiveRegion priority="assertive" role="alert" className={className}>
      {message}
    </LiveRegion>
  )
}

export function LogLiveRegion({ message, className = "" }: { message: string, className?: string }) {
  return (
    <LiveRegion priority="polite" role="log" className={className}>
      {message}
    </LiveRegion>
  )
}