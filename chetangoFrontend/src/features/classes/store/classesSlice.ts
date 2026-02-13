// ============================================
// CLASSES SLICE - REDUX STATE FOR UI
// ============================================

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FiltroAnterior } from '../types/classTypes'

// ============================================
// STATE INTERFACE
// ============================================

/**
 * UI state for the classes management page
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.6
 */
export interface ClassesUIState {
  // Admin state
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

  // Profesor state
  /** Filter for historical classes */
  filtroAnterior: FiltroAnterior
  /** Whether to show historical classes section */
  showClasesAnteriores: boolean
  /** Selected clase for resumen modal */
  resumenClaseId: string | null

  // Student state
  /** Selected clase for reprogramar modal */
  reprogramarClaseId: string | null
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: ClassesUIState = {
  // Admin state
  searchTerm: '',
  filterProfesor: 'todos',
  filterTipo: 'todos',
  filterFecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
  selectedClaseId: null,

  // Profesor state
  filtroAnterior: 'ultimos_7',
  showClasesAnteriores: false,
  resumenClaseId: null,

  // Student state
  reprogramarClaseId: null,
}

// ============================================
// SLICE DEFINITION
// ============================================

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    // ============================================
    // ADMIN ACTIONS
    // ============================================

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

    // ============================================
    // PROFESOR ACTIONS
    // ============================================

    /**
     * Set the filter for historical classes
     * Requirements: 3.9
     */
    setFiltroAnterior: (state, action: PayloadAction<FiltroAnterior>) => {
      state.filtroAnterior = action.payload
    },

    /**
     * Toggle the visibility of historical classes section
     * Requirements: 3.8
     */
    toggleClasesAnteriores: (state) => {
      state.showClasesAnteriores = !state.showClasesAnteriores
    },

    /**
     * Set the clase ID for resumen modal
     */
    setResumenClaseId: (state, action: PayloadAction<string | null>) => {
      state.resumenClaseId = action.payload
    },

    // ============================================
    // STUDENT ACTIONS
    // ============================================

    /**
     * Set the clase ID for reprogramar modal
     */
    setReprogramarClaseId: (state, action: PayloadAction<string | null>) => {
      state.reprogramarClaseId = action.payload
    },
  },
})

// ============================================
// SELECTORS
// ============================================

export const selectAdminFilters = (state: { classes: ClassesUIState }) => ({
  searchTerm: state.classes.searchTerm,
  filterProfesor: state.classes.filterProfesor,
  filterTipo: state.classes.filterTipo,
  filterFecha: state.classes.filterFecha,
})

export const selectProfesorState = (state: { classes: ClassesUIState }) => ({
  filtroAnterior: state.classes.filtroAnterior,
  showClasesAnteriores: state.classes.showClasesAnteriores,
  resumenClaseId: state.classes.resumenClaseId,
})

export const selectStudentState = (state: { classes: ClassesUIState }) => ({
  selectedClaseId: state.classes.selectedClaseId,
  reprogramarClaseId: state.classes.reprogramarClaseId,
})

// ============================================
// EXPORTS
// ============================================

export const {
  // Admin actions
  setSearchTerm,
  setFilterProfesor,
  setFilterTipo,
  setFilterFecha,
  setSelectedClaseId,
  clearFilters,
  // Profesor actions
  setFiltroAnterior,
  toggleClasesAnteriores,
  setResumenClaseId,
  // Student actions
  setReprogramarClaseId,
} = classesSlice.actions

export default classesSlice.reducer
