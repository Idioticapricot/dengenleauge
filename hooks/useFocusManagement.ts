"use client"

import { useEffect, useRef, RefObject } from "react"

interface UseFocusManagementOptions {
  isOpen: boolean
  initialFocusRef?: RefObject<HTMLElement>
  returnFocusRef?: RefObject<HTMLElement>
}

export function useFocusManagement({
  isOpen,
  initialFocusRef,
  returnFocusRef
}: UseFocusManagementOptions) {
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus the initial element or the first focusable element in the modal
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else {
        // Find the first focusable element
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstFocusable = focusableElements[0] as HTMLElement
        if (firstFocusable) {
          firstFocusable.focus()
        }
      }

      // Add event listener for Escape key
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          // This will be handled by the modal's onClose
          event.stopPropagation()
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    } else {
      // Restore focus when modal closes
      if (previousFocusRef.current && returnFocusRef?.current) {
        returnFocusRef.current.focus()
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, initialFocusRef, returnFocusRef])

  // Focus trap function
  const trapFocus = (event: KeyboardEvent) => {
    if (!isOpen) return

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    if (event.key === "Tab") {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", trapFocus)
      return () => document.removeEventListener("keydown", trapFocus)
    }
  }, [isOpen])

  return {
    trapFocus
  }
}