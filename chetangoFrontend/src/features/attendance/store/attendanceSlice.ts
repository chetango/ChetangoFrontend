// ============================================
// ATTENDANCE SLICE - CHETANGO ADMIN
// ============================================

import type { AttendanceUIState } from '@/features/attendance/types/attendanceTypes'
import { getToday } from '@/shared/utils/dateTimeHelper'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayDate = (): string => {
  return getToday()
}

// Initial state for attendance UI
const initialState: AttendanceUIState = {
  selectedDate: getTodayDate(),
  selectedClassId: null,
  searchTerm: '',
  updatingStudents: {},
}

// Attendance slice for UI state management
export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    /**
     * Set the selected date for attendance view
     * Requirements: 1.4
     */
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload
      // Reset class selection when date changes
      state.selectedClassId = null
    },

    /**
     * Set the selected class ID
     * Requirements: 2.3
     */
    setSelectedClassId: (state, action: PayloadAction<string | null>) => {
      state.selectedClassId = action.payload
    },

    /**
     * Set the search term for filtering students
     * Requirements: 6.1
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    /**
     * Set updating status for a specific student
     * Used for optimistic updates and loading states
     */
    setUpdatingStudent: (
      state,
      action: PayloadAction<{ studentId: string; isUpdating: boolean }>
    ) => {
      const { studentId, isUpdating } = action.payload
      if (isUpdating) {
        state.updatingStudents[studentId] = true
      } else {
        delete state.updatingStudents[studentId]
      }
    },

    /**
     * Clear all updating states
     */
    clearUpdatingStudents: (state) => {
      state.updatingStudents = {}
    },

    /**
     * Reset attendance UI state to initial values
     */
    resetAttendanceState: () => initialState,
  },
})

export const {
  setSelectedDate,
  setSelectedClassId,
  setSearchTerm,
  setUpdatingStudent,
  clearUpdatingStudents,
  resetAttendanceState,
} = attendanceSlice.actions

export default attendanceSlice.reducer
