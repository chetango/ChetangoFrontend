// ============================================
// CUSTOM HOOK: useModalScroll
// Manages scroll behavior for modal components
// ============================================

import { useEffect, useRef } from 'react'

/**
 * Custom hook to manage scroll behavior when a modal is opened/closed
 * 
 * Features:
 * - Scrolls window to top when modal opens
 * - Prevents body scrolling while modal is open
 * - Resets modal content scroll to top
 * - Restores body scroll on unmount/close
 * 
 * @param isOpen - Whether the modal is currently open
 * @returns containerRef - Ref to attach to the modal container
 */
export function useModalScroll(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Scroll window to top instantly
      window.scrollTo({ top: 0, behavior: 'instant' })
      
      // Prevent body scrolling
      document.body.style.overflow = 'hidden'
      
      // Reset modal scroll to top
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    } else {
      // Restore body scrolling
      document.body.style.overflow = ''
    }

    // Cleanup: restore body scrolling
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return containerRef
}
