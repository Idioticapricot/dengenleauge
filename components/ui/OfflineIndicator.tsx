"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useOnlineStatus } from "../../hooks/useOnlineStatus"
import { StatusLiveRegion } from "./LiveRegion"

interface OfflineIndicatorProps {
  className?: string
  showReconnectedMessage?: boolean
}

export function OfflineIndicator({
  className = "",
  showReconnectedMessage = true
}: OfflineIndicatorProps) {
  const { isOnline, wasOffline } = useOnlineStatus()

  return (
    <>
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
          >
            <div className="brutal-border brutal-shadow bg-red-500 text-white px-6 py-3 font-mono text-sm uppercase">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                OFFLINE - LIMITED FUNCTIONALITY
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOnline && wasOffline && showReconnectedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ delay: 0.5 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
          >
            <div className="brutal-border brutal-shadow bg-green-500 text-white px-6 py-3 font-mono text-sm uppercase">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                BACK ONLINE
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen reader announcements */}
      <StatusLiveRegion
        message={
          !isOnline
            ? "You are currently offline. Some features may be limited."
            : wasOffline
            ? "Connection restored. You are back online."
            : ""
        }
      />
    </>
  )
}

// Hook for components to check online status
export function useOfflineCapabilities() {
  const { isOnline } = useOnlineStatus()

  const withOfflineCheck = <T extends any[], R>(
    fn: (...args: T) => R,
    offlineMessage?: string
  ) => {
    return (...args: T): R | null => {
      if (!isOnline) {
        console.warn(offlineMessage || "This feature is not available offline")
        return null
      }
      return fn(...args)
    }
  }

  return {
    isOnline,
    withOfflineCheck
  }
}

// Component to wrap features that require online connectivity
interface OnlineOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function OnlineOnly({
  children,
  fallback,
  className = ""
}: OnlineOnlyProps) {
  const { isOnline } = useOnlineStatus()

  if (!isOnline) {
    return fallback ? (
      <div className={className}>
        {fallback}
      </div>
    ) : (
      <div className={`brutal-border bg-gray-100 p-4 text-center ${className}`}>
        <p className="font-mono text-sm uppercase text-gray-600">
          This feature requires an internet connection
        </p>
        <div className="mt-2 text-2xl">📡</div>
      </div>
    )
  }

  return <>{children}</>
}