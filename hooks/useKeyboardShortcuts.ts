"use client"

import { useEffect, useCallback } from "react"

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  handler: () => void
  description?: string
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true
}: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Don't trigger shortcuts when user is typing in input fields
    const target = event.target as HTMLElement
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.contentEditable === "true" ||
      target.closest("[contenteditable]") ||
      target.closest("input") ||
      target.closest("textarea")
    ) {
      return
    }

    shortcuts.forEach((shortcut) => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatches = !!event.ctrlKey === !!shortcut.ctrlKey
      const altMatches = !!event.altKey === !!shortcut.altKey
      const shiftMatches = !!event.shiftKey === !!shortcut.shiftKey
      const metaMatches = !!event.metaKey === !!shortcut.metaKey

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        event.preventDefault()
        event.stopPropagation()
        shortcut.handler()
      }
    })
  }, [shortcuts, enabled])

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return {
    shortcuts
  }
}

// Common keyboard shortcuts for the app
export const commonShortcuts: KeyboardShortcut[] = [
  {
    key: "h",
    altKey: true,
    handler: () => {
      // Navigate to home
      window.location.href = "/"
    },
    description: "Go to home page"
  },
  {
    key: "b",
    altKey: true,
    handler: () => {
      // Navigate to battle
      window.location.href = "/battle"
    },
    description: "Go to battle page"
  },
  {
    key: "t",
    altKey: true,
    handler: () => {
      // Navigate to tokens
      window.location.href = "/buy-tokens"
    },
    description: "Go to buy tokens page"
  },
  {
    key: "p",
    altKey: true,
    handler: () => {
      // Navigate to profile
      window.location.href = "/profile"
    },
    description: "Go to profile page"
  },
  {
    key: "/",
    handler: () => {
      // Focus search (if exists)
      const searchInput = document.querySelector("input[type='search'], input[placeholder*='search']") as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
      }
    },
    description: "Focus search input"
  },
  {
    key: "Escape",
    handler: () => {
      // Close modals, clear focus, etc.
      // This can be extended based on app state
      const activeModal = document.querySelector("[role='dialog'][aria-hidden='false']")
      if (activeModal) {
        const closeButton = activeModal.querySelector("button[aria-label*='close'], button[aria-label*='Close']") as HTMLButtonElement
        if (closeButton) {
          closeButton.click()
        }
      }
    },
    description: "Close modal or clear focus"
  }
]