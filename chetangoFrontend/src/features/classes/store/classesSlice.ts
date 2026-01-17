// ============================================
// CLASSES SLICE - REDUX STATE FOR UI
// ============================================

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// ============================================
// STATE INTERFACE
// ============================================

/**
 * UI state for the classes management page
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.6
 */
export interface ClassesUIState {
  /** Search term for filtering classes by tipo or profesor name */
  searchTerm: string
  /** Filter by profesor: 'todos' shows all, otherwise idProfesor */
  filterProfesor: string
  /** Filter by tipo de clase: 'todos' shows all, otherwise nombre tipo */
  filterTipo: string
  /** Filter by specific date: '' shows all, otherwise YYYY-MM-DD */
  filterFecha: string
  /** Currently selected clase ID for detail view */
  selectedClaseId: string | null
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: ClassesUIState = {
  searchTerm: '',
  filterProfesor: 'todos',
  filterTipo: 'todos',
  filterFecha: '',
  selectedClaseId: null,
}

// ============================================
// SLICE DEFINITION
// ============================================

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    /**
     * Set the search term for filtering classes
     * Requirements: 8.1
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    /**
     * Set the profesor filter
     * Requirements: 8.3
     */
    setFilterProfesor: (state, action: PayloadAction<string>) => {
      state.filterProfesor = action.payload
    },

    /**
     * Set the tipo de clase filter
     * Requirements: 8.4
     */
    setFilterTipo: (state, action: PayloadAction<string>) => {
      state.filterTipo = action.payload
    },

    /**
     * Set the date filter
     * Requirements: 8.2
     */
    setFilterFecha: (state, action: PayloadAction<string>) => {
      state.filterFecha = action.payload
    },

    /**
     * Set the selected clase ID for detail view
     */
    setSelectedClaseId: (state, action: PayloadAction<string | null>) => {
      state.selectedClaseId = action.payload
    },

    /**
     * Clear all filters and reset to initial state
     * Requirements: 8.6
     */
    clearFilters: (state) => {
      state.searchTerm = ''
      state.filterProfesor = 'todos'
      state.filterTipo = 'todos'
      state.filterFecha = ''
    },
  },
})

// ============================================
// EXPORTS
// ============================================

export const {
  setSearchTerm,
  setFilterProfesor,
  setFilterTipo,
  setFilterFecha,
  setSelectedClaseId,
  clearFilters,
} = classesSlice.actions

export default classesSlice.reducer
