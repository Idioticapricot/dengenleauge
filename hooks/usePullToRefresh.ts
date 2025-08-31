import { useState, useRef, useCallback } from 'react'

interface PullToRefreshConfig {
  onRefresh: () => Promise<void>
  threshold?: number
  maxPull?: number
}

export function usePullToRefresh<T extends HTMLElement = HTMLElement>(config: PullToRefreshConfig) {
  const { onRefresh, threshold = 80, maxPull = 120 } = config

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const elementRef = useRef<T>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (isRefreshing) return

    const touch = e.touches[0]
    setStartY(touch.clientY)
    setIsPulling(true)
  }, [isRefreshing])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return

    const touch = e.touches[0]
    const currentY = touch.clientY
    const distance = Math.max(0, currentY - startY)

    // Only allow pull when at the top of the scrollable area
    const element = elementRef.current
    if (element && element.scrollTop > 0) return

    if (distance > 0) {
      e.preventDefault()
      const clampedDistance = Math.min(distance * 0.5, maxPull)
      setPullDistance(clampedDistance)
    }
  }, [isPulling, isRefreshing, startY, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || isRefreshing) return

    setIsPulling(false)

    if (pullDistance >= threshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, isRefreshing, pullDistance, threshold, onRefresh])

  const handleScroll = useCallback(() => {
    // Reset pull state when scrolling down
    if (pullDistance > 0) {
      setPullDistance(0)
      setIsPulling(false)
    }
  }, [pullDistance])

  // Attach event listeners
  const attachListeners = useCallback(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('scroll', handleScroll)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll])

  return {
    elementRef,
    isRefreshing,
    pullDistance,
    isPulling,
    attachListeners
  }
}