"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'
import { usePullToRefresh } from '../../hooks/usePullToRefresh'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  maxPull?: number
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPull = 120,
  className = ''
}: PullToRefreshProps) {
  const { elementRef, isRefreshing, pullDistance, isPulling, attachListeners } = usePullToRefresh<HTMLDivElement>({
    onRefresh,
    threshold,
    maxPull
  })

  // Attach listeners when component mounts
  React.useEffect(() => {
    const cleanup = attachListeners()
    return cleanup
  }, [attachListeners])

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldShowIndicator = isPulling || isRefreshing

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Pull indicator */}
      <AnimatePresence>
        {shouldShowIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center py-4 bg-gradient-to-b from-white to-transparent"
            style={{
              transform: `translateY(${Math.max(0, pullDistance - 60)}px)`
            }}
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : 0,
                scale: progress
              }}
              transition={{
                rotate: isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : { duration: 0.2 },
                scale: { duration: 0.2 }
              }}
              className="flex items-center gap-2 text-black font-mono font-bold"
            >
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} />
              <span className="text-sm uppercase tracking-wider">
                {isRefreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release to refresh' : 'Pull to refresh'}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        ref={elementRef}
        className="min-h-full"
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.max(0, pullDistance - 20)}px)` : 'translateY(0px)',
          transition: isPulling ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}