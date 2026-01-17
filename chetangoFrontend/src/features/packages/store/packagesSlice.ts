// ============================================
// PACKAGES SLICE - CHETANGO ADMIN
// ============================================

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

/**
 * UI State for packages management
 * Requirements: 4.1, 4.2, 4.3
 */
export interface PackagesUIState {
  searchTerm: string
  filterEstado: string // 'todos' | EstadoPaquete
  filterTipoPaquete: string // 'todos' | nombre tipo
}

// Initial state for packages UI
const initialState: PackagesUIState = {
  searchTerm: '',
  filterEstado: 'todos',
  filterTipoPaquete: 'todos',
}

// Packages slice for UI state management
export const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    /**
     * Set the search term for filtering packages by alumno nombre or documento
     * Requirements: 4.1
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    /**
     * Set the estado filter for packages
     * Requirements: 4.2
     */
    setFilterEstado: (state, action: PayloadAction<string>) => {
      state.filterEstado = action.payload
    },

    /**
     * Set the tipo paquete filter for packages
     * Requirements: 4.3
     */
    setFilterTipoPaquete: (state, action: PayloadAction<string>) => {
      state.filterTipoPaquete = action.payload
    },

    /**
     * Clear all filters and reset to initial state
     * Requirements: 4.1, 4.2, 4.3
     */
    clearFilters: (state) => {
      state.searchTerm = ''
      state.filterEstado = 'todos'
      state.filterTipoPaquete = 'todos'
    },
  },
})

export const { setSearchTerm, setFilterEstado, setFilterTipoPaquete, clearFilters } =
  packagesSlice.actions

export default packagesSlice.reducer
