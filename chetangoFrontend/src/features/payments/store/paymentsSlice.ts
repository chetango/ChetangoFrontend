// ============================================
// PAYMENTS SLICE - CHETANGO ADMIN
// ============================================

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { PaymentsUIState } from '../types/paymentTypes'

/**
 * Initial state for payments UI
 * Requirements: 4.1, 4.2, 4.3
 */
const initialState: PaymentsUIState = {
  searchTerm: '',
  selectedAlumnoId: null,
  activeTab: 'busqueda',
  isQRScannerActive: false,
}

// Payments slice for UI state management
export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    /**
     * Set the search term for filtering alumnos by nombre or documento
     * Requirements: 4.3
     */
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },

    /**
     * Set the selected alumno ID
     * Requirements: 4.1
     */
    setSelectedAlumno: (state, action: PayloadAction<string | null>) => {
      state.selectedAlumnoId = action.payload
    },

    /**
     * Set the active tab (búsqueda or QR)
     * Requirements: 4.1, 4.2
     */
    setActiveTab: (state, action: PayloadAction<'busqueda' | 'qr'>) => {
      state.activeTab = action.payload
      // Automatically activate/deactivate QR scanner based on tab
      state.isQRScannerActive = action.payload === 'qr'
    },

    /**
     * Set QR scanner active state
     * Requirements: 4.2
     */
    setQRScannerActive: (state, action: PayloadAction<boolean>) => {
      state.isQRScannerActive = action.payload
    },

    /**
     * Clear the current alumno selection and search term
     * Requirements: 4.1
     */
    clearSelection: (state) => {
      state.selectedAlumnoId = null
      state.searchTerm = ''
    },

    /**
     * Reset all payments UI state to initial values
     * Requirements: 4.1, 4.2, 4.3
     */
    resetPaymentsUI: () => initialState,
  },
})

export const {
  setSearchTerm,
  setSelectedAlumno,
  setActiveTab,
  setQRScannerActive,
  clearSelection,
  resetPaymentsUI,
} = paymentsSlice.actions

export default paymentsSlice.reducer
