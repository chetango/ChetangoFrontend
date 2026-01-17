// ============================================
// ROLE SLICE - CHETANGO
// ============================================

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface RoleState {
  activeRole: string | null
  availableRoles: string[]
}

const initialState: RoleState = {
  activeRole: null,
  availableRoles: [],
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setAvailableRoles: (state, action: PayloadAction<string[]>) => {
      state.availableRoles = action.payload
      // Si no hay rol activo, seleccionar el primero por defecto
      if (!state.activeRole && action.payload.length > 0) {
        // Prioridad: admin > profesor > alumno
        if (action.payload.includes('admin')) {
          state.activeRole = 'admin'
        } else if (action.payload.includes('profesor')) {
          state.activeRole = 'profesor'
        } else {
          state.activeRole = action.payload[0]
        }
      }
    },
    setActiveRole: (state, action: PayloadAction<string>) => {
      if (state.availableRoles.includes(action.payload)) {
        state.activeRole = action.payload
        // Persistir en localStorage para mantener entre sesiones
        localStorage.setItem('chetango_active_role', action.payload)
      }
    },
    clearRoles: (state) => {
      state.activeRole = null
      state.availableRoles = []
      localStorage.removeItem('chetango_active_role')
    },
    restoreActiveRole: (state) => {
      const savedRole = localStorage.getItem('chetango_active_role')
      if (savedRole && state.availableRoles.includes(savedRole)) {
        state.activeRole = savedRole
      }
    },
  },
})

export const { setAvailableRoles, setActiveRole, clearRoles, restoreActiveRole } = roleSlice.actions
export default roleSlice.reducer