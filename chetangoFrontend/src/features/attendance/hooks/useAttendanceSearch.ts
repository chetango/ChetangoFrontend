// ============================================
// USE ATTENDANCE SEARCH HOOK - CHETANGO ADMIN
// ============================================

import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { setSearchTerm } from '../store/attendanceSlice'
import { filterStudentsBySearch } from '../utils/attendanceUtils'
import type { StudentAttendance } from '../types/attendanceTypes'

// ============================================
// CONSTANTS
// ============================================

/**
 * Debounce delay for search input in milliseconds
 * Requirements: 9.3
 */
export const SEARCH_DEBOUNCE_MS = 300

// ============================================
// HOOK RETURN TYPE
// ============================================

export interface UseAttendanceSearchReturn {
  /** The current input value (immediate) */
  searchTerm: string
  /** The debounced search term used for filtering */
  debouncedSearchTerm: string
  /** Set the search term (will be debounced before filtering) */
  setSearchTerm: (term: string) => void
  /** Filtered students based on debounced search term */
  filteredStudents: StudentAttendance[]
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

/**
 * Custom hook for managing student search functionality
 * Uses Redux state for searchTerm and filterStudentsBySearch utility
 * Implements 300ms debounce for filtering (Requirement 9.3)
 *
 * Requirements: 9.1, 9.3
 *
 * @param students - Array of student attendance records to filter
 * @returns Object with searchTerm, debouncedSearchTerm, setSearchTerm, and filteredStudents
 */
export function useAttendanceSearch(
  students: StudentAttendance[]
): UseAttendanceSearchReturn {
  const dispatch = useAppDispatch()

  // Redux state selector for search term (immediate input value)
  const searchTerm = useAppSelector((state) => state.attendance.searchTerm)

  // Local state for debounced search term (used for actual filtering)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

  // Ref to track timeout for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce effect: update debouncedSearchTerm after 300ms delay
  // Requirements: 9.3
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to update debounced value
    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, SEARCH_DEBOUNCE_MS)

    // Cleanup on unmount or when searchTerm changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm])

  // Action: Set search term (Requirement 9.1)
  const handleSetSearchTerm = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term))
    },
    [dispatch]
  )

  // Memoized filtered students using debounced search term
  // Filters by nombreCompleto OR documentoIdentidad (Requirements 9.1, 9.3)
  const filteredStudents = useMemo(() => {
    return filterStudentsBySearch(students, debouncedSearchTerm)
  }, [students, debouncedSearchTerm])

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm: handleSetSearchTerm,
    filteredStudents,
  }
}
