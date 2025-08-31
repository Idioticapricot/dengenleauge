"use client"

import { useState, useRef, ReactNode, useEffect } from "react"
import { motion, useReducedMotion } from "framer-motion"

interface TouchAlternativesProps {
  children: ReactNode
  onLongPress?: () => void
  onDoubleTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  longPressDelay?: number
  className?: string
  showAlternatives?: boolean
}

export function TouchAlternatives({
  children,
  onLongPress,
  onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  longPressDelay = 500,
  className = "",
  showAlternatives = false
}: TouchAlternativesProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isLongPress, setIsLongPress] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const [showButtons, setShowButtons] = useState(false)

  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const doubleTapTimer = useRef<NodeJS.Timeout | null>(null)

  const shouldReduceMotion = useReducedMotion()
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPress(true)
        onLongPress()
        if (showAlternatives) {
          setShowButtons(true)
        }
      }, longPressDelay)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })

    // Clear long press if moved
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    // Handle swipe gestures
    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft()
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight()
    } else if (isUpSwipe && onSwipeUp) {
      onSwipeUp()
    } else if (isDownSwipe && onSwipeDown) {
      onSwipeDown()
    }

    // Handle tap gestures
    if (Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
      setTapCount(prev => prev + 1)

      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current)
      }

      doubleTapTimer.current = setTimeout(() => {
        if (tapCount === 1 && onDoubleTap) {
          onDoubleTap()
        }
        setTapCount(0)
      }, 300)
    }

    // Reset states
    setTouchStart(null)
    setTouchEnd(null)
    setIsLongPress(false)

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current)
      }
    }
  }, [])

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <div className={`relative ${className}`}>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="touch-manipulation"
      >
        {children}
      </div>

      {/* Alternative buttons for touch devices */}
      {showButtons && showAlternatives && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={shouldReduceMotion ? {} : buttonVariants}
          className="absolute top-full left-0 mt-2 flex flex-col gap-2 z-50"
        >
          {onSwipeLeft && (
            <button
              onClick={onSwipeLeft}
              className="brutal-button bg-red-400 text-white px-3 py-1 text-xs"
              aria-label="Swipe left action"
            >
              ← LEFT
            </button>
          )}
          {onSwipeRight && (
            <button
              onClick={onSwipeRight}
              className="brutal-button bg-green-400 text-white px-3 py-1 text-xs"
              aria-label="Swipe right action"
            >
              RIGHT →
            </button>
          )}
          {onSwipeUp && (
            <button
              onClick={onSwipeUp}
              className="brutal-button bg-blue-400 text-white px-3 py-1 text-xs"
              aria-label="Swipe up action"
            >
              ↑ UP
            </button>
          )}
          {onSwipeDown && (
            <button
              onClick={onSwipeDown}
              className="brutal-button bg-purple-400 text-white px-3 py-1 text-xs"
              aria-label="Swipe down action"
            >
              DOWN ↓
            </button>
          )}
          {onDoubleTap && (
            <button
              onClick={onDoubleTap}
              className="brutal-button bg-yellow-400 text-black px-3 py-1 text-xs"
              aria-label="Double tap action"
            >
              TAP ×2
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}

// Specialized component for drag-and-drop alternatives
interface DragDropAlternativeProps {
  children: ReactNode
  onDragStart?: () => void
  onDragEnd?: () => void
  onDrop?: () => void
  className?: string
}

export function DragDropAlternative({
  children,
  onDragStart,
  onDragEnd,
  onDrop,
  className = ""
}: DragDropAlternativeProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [showDropZone, setShowDropZone] = useState(false)

  const handleLongPress = () => {
    setIsDragging(true)
    setShowDropZone(true)
    onDragStart?.()
  }

  const handleTap = () => {
    if (isDragging) {
      setIsDragging(false)
      setShowDropZone(false)
      onDrop?.()
    }
  }

  return (
    <TouchAlternatives
      onLongPress={handleLongPress}
      onDoubleTap={handleTap}
      showAlternatives={true}
      className={className}
    >
      <div className={`${isDragging ? 'opacity-50 scale-105' : ''} transition-all`}>
        {children}
        {isDragging && (
          <div className="absolute inset-0 bg-yellow-300 bg-opacity-50 flex items-center justify-center">
            <span className="text-black font-mono text-sm">DRAGGING</span>
          </div>
        )}
      </div>

      {showDropZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white brutal-border p-8 text-center">
            <p className="font-mono text-lg mb-4">DROP ZONE</p>
            <p className="font-mono text-sm mb-4">Double tap to drop</p>
            <button
              onClick={() => {
                setIsDragging(false)
                setShowDropZone(false)
                onDragEnd?.()
              }}
              className="brutal-button"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </TouchAlternatives>
  )
}